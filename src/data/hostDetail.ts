import {
  FilesystemUsage,
  HistoryMetric,
  HistoryPoint,
  HistoryRangeKey,
  Host,
  HostDetail,
  HostHistory,
} from '../types';
import { loadZabbixConfig, zabbixRpc } from './config';

interface DetailItem {
  itemid: string;
  key_: string;
  lastvalue: string;
  value_type?: string;
  units?: string;
}

interface HistoryRow {
  clock: string;
  value: string;
}

interface TrendRow {
  clock: string;
  value_avg?: string;
  value?: string;
}

interface ZabbixHostId {
  hostid: string;
}

type MemoryMode = 'percent' | 'invert' | 'derived';

interface ResolvedHostItems {
  hostid: string;
  /** Primary CPU item; with SNMP-only IBM i hosts this is the first core. */
  cpu?: DetailItem;
  /** Additional hrProcessorLoad cores averaged into the CPU series. */
  cpuPeers: DetailItem[];
  memory?: DetailItem;
  memoryMode?: MemoryMode;
  /** Total-memory item/value backing a derived 'used' percentage. */
  memoryTotal?: DetailItem;
  memoryTotalValue?: number;
  disk?: DetailItem;
  netIn: DetailItem[];
  netOut: DetailItem[];
  filesystems: Array<{ mount: string; used: number; item: DetailItem }>;
}

/** Aggregate CPU key from the AS/400 agent emulator: proc.cpu.util[,,total,,,]. */
function isAggregateProcCpuKey(key: string): boolean {
  if (!/^proc\.cpu\.util\[/i.test(key)) {
    return false;
  }
  const args = key.slice(key.indexOf('[') + 1, -1).split(',');
  return (args[0] || '').trim() === '' && args.some((arg) => arg.trim().toLowerCase() === 'total');
}

/** IBM i ASP/disk-unit usage keys use the same percentage argument as filesystems. */
function isDiskUsageKey(key: string): boolean {
  return (
    /^vfs\.fs\.(dependent\.)?size\[[^\]]*pused[^\]]*\]$/i.test(key) ||
    /^as400\.disk\.size\[[^\]]*pused[^\]]*\]$/i.test(key)
  );
}

function memoryConverter(resolved: ResolvedHostItems): ((value: number) => number) | undefined {
  if (resolved.memoryMode === 'invert') {
    return (value) => clamp(100 - value);
  }
  if (resolved.memoryMode === 'derived' && resolved.memoryTotalValue && resolved.memoryTotalValue > 0) {
    const total = resolved.memoryTotalValue;
    return (value) => clamp(100 - (value / total) * 100);
  }
  return undefined;
}

const MAX_POINTS = 24;
const HISTORY_SECONDS = 24 * 60 * 60;
const ITEM_CACHE_TTL_MS = 5 * 60 * 1000;

export const HISTORY_RANGES: Record<
  HistoryRangeKey,
  { label: string; full: string; seconds: number; points: number }
> = {
  '6h': { label: '6H', full: 'last 6 hours', seconds: 6 * 60 * 60, points: 72 },
  '24h': { label: '24H', full: 'last 24 hours', seconds: 24 * 60 * 60, points: 96 },
  '7d': { label: '7D', full: 'last 7 days', seconds: 7 * 24 * 60 * 60, points: 84 },
  '30d': { label: '30D', full: 'last 30 days', seconds: 30 * 24 * 60 * 60, points: 90 },
  '90d': { label: '90D', full: 'last 90 days', seconds: 90 * 24 * 60 * 60, points: 90 },
  '6m': { label: '6M', full: 'last 6 months', seconds: 180 * 24 * 60 * 60, points: 90 },
};

export const HISTORY_RANGE_KEYS: HistoryRangeKey[] = ['6h', '24h', '7d', '30d', '90d', '6m'];

function numeric(value: string | undefined): number | null {
  const n = parseFloat(value || '');
  return Number.isFinite(n) ? n : null;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** Average equally sized value arrays (one per CPU core) index by index. */
function averageValues(series: number[][]): number[] {
  const valid = series.filter((values) => values.length > 0);
  if (!valid.length) {
    return [];
  }
  const length = Math.min(...valid.map((values) => values.length));
  return Array.from({ length }, (_, i) =>
    round(valid.reduce((sum, values) => sum + values[i], 0) / valid.length)
  );
}

/** Average per-core point series on their shared bucket timestamps. */
function averagePoints(series: HistoryPoint[][]): HistoryPoint[] {
  const byTime = new Map<number, { sum: number; count: number }>();
  for (const points of series) {
    for (const point of points) {
      const bucket = byTime.get(point.t) || { sum: 0, count: 0 };
      bucket.sum += point.v;
      bucket.count += 1;
      byTime.set(point.t, bucket);
    }
  }
  return Array.from(byTime.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([t, bucket]) => ({ t, v: round(bucket.sum / bucket.count) }));
}

function downsample(values: number[], buckets = MAX_POINTS): number[] {
  if (values.length <= buckets) {
    return values;
  }
  const out: number[] = [];
  const size = values.length / buckets;
  for (let i = 0; i < buckets; i++) {
    const start = Math.floor(i * size);
    const end = Math.max(start + 1, Math.floor((i + 1) * size));
    const slice = values.slice(start, end);
    out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}

/** Spread raw values over the requested window with an even bucket cadence. */
function toPoints(values: number[], points: number, from: number, to: number): HistoryPoint[] {
  if (!values.length) {
    return [];
  }
  const out: HistoryPoint[] = [];
  const size = values.length / points;
  for (let i = 0; i < points; i++) {
    const start = Math.floor(i * size);
    if (start >= values.length) {
      break;
    }
    const end = Math.min(values.length, Math.max(start + 1, Math.floor((i + 1) * size)));
    const slice = values.slice(start, end);
    if (!slice.length) {
      break;
    }
    const value = slice.reduce((a, b) => a + b, 0) / slice.length;
    out.push({ t: Math.round(from + ((i + 0.5) / points) * (to - from)), v: round(value) });
  }
  return out;
}

function sampleTrend(hostname: string, key: string, current: number): number[] {
  const h = hash(`${hostname}:${key}`);
  const phase = (h % 100) / 13;
  const amp = 4 + (h % 11);
  const values = Array.from({ length: MAX_POINTS }, (_, i) => {
    const wave =
      Math.sin(i / 2.7 + phase) * amp +
      Math.sin(i / 1.13 + phase * 1.7) * amp * 0.32 +
      Math.cos(i / 4.1 + phase) * amp * 0.18;
    return round(clamp(current + wave));
  });
  values[values.length - 1] = round(current);
  return values;
}

/** Deterministic sample history for any range, shaped per range so windows differ. */
function sampleTrendFor(
  hostname: string,
  key: string,
  current: number,
  points: number,
  range: HistoryRangeKey
): number[] {
  const h = hash(`${hostname}:${key}:${range}`);
  const phase = (h % 100) / 13;
  const amp = 4 + (h % 11);
  const values = Array.from({ length: points }, (_, i) => {
    const x = (i * 24) / Math.max(1, points - 1);
    const wave =
      Math.sin(x / 2.7 + phase) * amp +
      Math.sin(x / 1.13 + phase * 1.7) * amp * 0.32 +
      Math.cos(x / 4.1 + phase) * amp * 0.18;
    const drift = Math.sin((i / Math.max(1, points - 1)) * Math.PI * 2 + phase) * amp * 0.55;
    return round(clamp(current + wave + drift));
  });
  values[values.length - 1] = round(current);
  return values;
}

function sampleFilesystems(host: Host): FilesystemUsage[] {
  // IBM i/AS400 exposes ASPs plus IFS mounts; Windows uses drive letters; Unix
  // uses conventional mount points.
  const mounts =
    host.os === 'Windows'
      ? ['C:', 'D:', 'E:']
      : host.os === 'IBM i' || host.os === 'AS400'
      ? ['/', '/QIBM/ProdData', '/QOpenSys', '/home']
      : ['/', '/data', '/var', '/opt'];
  const factors = [1, 0.93, 0.82, 0.64];
  return mounts
    .map((mount, index) => {
      const jitter = (hash(`${host.hostname}:${mount}`) % 9) - 4;
      const used = index === 0 ? host.disk : clamp(host.disk * factors[index] + jitter);
      return { mount, used: round(used) };
    })
    .sort((a, b) => b.used - a.used);
}

/**
 * Deterministic sample history and filesystem breakdown, so the server detail
 * view has the same shape in SAMPLE mode without pretending it is real history.
 */
export function sampleHostDetail(host: Host): HostDetail {
  return {
    filesystems: sampleFilesystems(host),
    trends: {
      cpu: sampleTrend(host.hostname, 'cpu', host.cpu),
      memory: sampleTrend(host.hostname, 'memory', host.memory),
      disk: sampleTrend(host.hostname, 'disk', host.disk),
      network: sampleTrend(host.hostname, 'network', host.network),
    },
    source: 'sample',
    note: 'SAMPLE dataset — charts are deterministic sample values, not Zabbix history.',
  };
}

/** Deterministic multi-metric history used by the drawer's history view in SAMPLE mode. */
export function sampleHostHistory(host: Host, range: HistoryRangeKey): HostHistory {
  const spec = HISTORY_RANGES[range];
  const to = Math.floor(Date.now() / 1000);
  const from = to - spec.seconds;
  const metrics: HistoryMetric[] = ['cpu', 'memory', 'disk', 'network'];
  const series: Partial<Record<HistoryMetric, HistoryPoint[]>> = {};
  for (const key of metrics) {
    const values = sampleTrendFor(host.hostname, key, host[key], spec.points, range);
    series[key] = toPoints(values, spec.points, from, to);
  }
  return {
    range,
    from,
    to,
    series,
    filesystems: sampleFilesystems(host).map((fs) => ({
      mount: fs.mount,
      points: toPoints(
        sampleTrendFor(host.hostname, `fs:${fs.mount}`, fs.used, spec.points, range),
        spec.points,
        from,
        to
      ),
    })),
    source: 'sample',
    note: `SAMPLE dataset — deterministic ${spec.full}, not Zabbix history.`,
  };
}

/** Snapshot-only fallback used when live detail calls fail. */
export function fallbackHostDetail(host: Host, message: string): HostDetail {
  return {
    filesystems: [{ mount: host.os === 'Windows' ? 'C:' : '/', used: host.disk }],
    trends: {},
    source: 'live',
    partial: true,
    note: message,
  };
}

function parseMount(key: string): string {
  const open = key.indexOf('[');
  const args = open >= 0 ? key.slice(open + 1, -1).split(',') : [];
  const mount = (args[0] || '').replace(/^"|"$/g, '');
  return mount || '/';
}

function makeRpc(config: Awaited<ReturnType<typeof loadZabbixConfig>>) {
  return <T>(method: string, params: unknown) => zabbixRpc<T>(config, method, params);
}

async function resolveHostItems(
  rpc: ReturnType<typeof makeRpc>,
  host: Host
): Promise<ResolvedHostItems | null> {
  const hosts = await rpc<ZabbixHostId[]>('host.get', {
    output: ['hostid'],
    filter: { host: [host.hostname] },
  });
  const hostid = hosts[0] && hosts[0].hostid;
  if (!hostid) {
    return null;
  }

  const items = await rpc<DetailItem[]>('item.get', {
    output: ['itemid', 'key_', 'lastvalue', 'value_type', 'units'],
    hostids: [hostid],
    monitored: true,
    limit: 5000,
  });

  const byKey = new Map(items.map((item) => [item.key_, item]));
  let cpu = byKey.get('system.cpu.util');
  let cpuPeers: DetailItem[] = [];
  if (!cpu) {
    // IBM i AS/400 agent emulator exposes one aggregate proc.cpu.util item.
    cpu = items.find((item) => isAggregateProcCpuKey(item.key_));
  }
  if (!cpu) {
    // SNMP-only IBM i hosts expose one hrProcessorLoad item per core.
    cpuPeers = items.filter((item) => /^hrProcessorLoad\[/i.test(item.key_));
    cpu = cpuPeers.shift();
  }

  const memoryUtil = byKey.get('vm.memory.util') || byKey.get('vm.memory.utilization');
  let memory = memoryUtil;
  let memoryMode: MemoryMode | undefined = memoryUtil ? 'percent' : undefined;
  let memoryTotal: DetailItem | undefined;
  let memoryTotalValue: number | undefined;
  if (!memory) {
    const pavailable = byKey.get('vm.memory.size[pavailable]');
    const pfree = byKey.get('vm.memory.size[pfree]');
    if (pavailable) {
      memory = pavailable;
      memoryMode = 'invert';
    } else if (pfree) {
      memory = pfree;
      memoryMode = 'invert';
    }
  }
  if (!memory) {
    // SNMP/agent pairs: used% = 100 - available/total (or free/total).
    memoryTotal = byKey.get('vm.memory.size[total]');
    memoryTotalValue = numeric(memoryTotal?.lastvalue) ?? undefined;
    const available =
      byKey.get('vm.memory.size[available]') || byKey.get('vm.memory.size[free]');
    if (available && memoryTotal && memoryTotalValue && memoryTotalValue > 0) {
      memory = available;
      memoryMode = 'derived';
    } else {
      memoryTotal = undefined;
      memoryTotalValue = undefined;
    }
  }

  const filesystemByMount = new Map<string, { mount: string; used: number; item: DetailItem }>();
  let diskItem: DetailItem | undefined;
  let diskUsed = -1;
  const netIn: DetailItem[] = [];
  const netOut: DetailItem[] = [];
  const isBps = (item: DetailItem) => /bps/i.test(item.units || '');

  for (const item of items) {
    if (isDiskUsageKey(item.key_)) {
      const used = numeric(item.lastvalue);
      if (used === null) {
        continue;
      }
      // as400.disk.size keys identify a disk unit by serial number; label it as
      // a disk so it is not mistaken for an IFS mount in the filesystem list.
      const mount = /^as400\.disk\.size/i.test(item.key_)
        ? `Disk ${parseMount(item.key_)}`
        : parseMount(item.key_);
      const previous = filesystemByMount.get(mount);
      if (!previous || used > previous.used) {
        filesystemByMount.set(mount, { mount, used: round(used), item });
      }
      if (used > diskUsed) {
        diskUsed = used;
        diskItem = item;
      }
    } else if (
      (/^net\.if\.in\[[^\]]*\]$/i.test(item.key_) ||
        (/^if(HC)?InOctets\[/i.test(item.key_) && isBps(item))) &&
      !/errors|dropped|collisions/i.test(item.key_)
    ) {
      netIn.push(item);
    } else if (
      (/^net\.if\.out\[[^\]]*\]$/i.test(item.key_) ||
        (/^if(HC)?OutOctets\[/i.test(item.key_) && isBps(item))) &&
      !/errors|dropped|collisions/i.test(item.key_)
    ) {
      netOut.push(item);
    }
  }

  const byTraffic = (a: DetailItem, b: DetailItem) =>
    (numeric(b.lastvalue) || 0) - (numeric(a.lastvalue) || 0);

  return {
    hostid,
    cpu,
    cpuPeers,
    memory,
    memoryMode,
    memoryTotal,
    memoryTotalValue,
    disk: diskItem,
    // The overview chart aggregates interfaces; two busiest directions keep the
    // history request small while matching that percentage formula.
    netIn: netIn.sort(byTraffic).slice(0, 2),
    netOut: netOut.sort(byTraffic).slice(0, 2),
    filesystems: Array.from(filesystemByMount.values()).sort((a, b) => b.used - a.used),
  };
}

const itemCache = new Map<string, { at: number; promise: Promise<ResolvedHostItems | null> }>();

function resolveHostItemsCached(
  rpc: ReturnType<typeof makeRpc>,
  host: Host
): Promise<ResolvedHostItems | null> {
  const now = Date.now();
  const hit = itemCache.get(host.hostname);
  if (hit && now - hit.at < ITEM_CACHE_TTL_MS) {
    return hit.promise;
  }
  const promise = resolveHostItems(rpc, host);
  itemCache.set(host.hostname, { at: now, promise });
  promise.catch(() => {
    if (itemCache.get(host.hostname)?.promise === promise) {
      itemCache.delete(host.hostname);
    }
  });
  return promise;
}

/** Average samples into fixed time buckets, keeping their real timestamps. */
function bucketPoints(
  raw: HistoryPoint[],
  points: number,
  from: number,
  to: number
): HistoryPoint[] {
  if (!raw.length) {
    return [];
  }
  const span = Math.max(1, to - from);
  const buckets = Array.from({ length: points }, () => ({ sum: 0, count: 0 }));
  for (const point of raw) {
    const index = Math.min(
      points - 1,
      Math.max(0, Math.floor(((point.t - from) / span) * points))
    );
    buckets[index].sum += point.v;
    buckets[index].count += 1;
  }
  const out: HistoryPoint[] = [];
  buckets.forEach((bucket, index) => {
    if (bucket.count) {
      out.push({
        t: Math.round(from + ((index + 0.5) / points) * span),
        v: round(bucket.sum / bucket.count),
      });
    }
  });
  return out;
}

async function historyPointsFor(
  rpc: ReturnType<typeof makeRpc>,
  item: DetailItem,
  range: HistoryRangeKey,
  from: number,
  to: number,
  convert?: (value: number) => number
): Promise<HistoryPoint[]> {
  const spec = HISTORY_RANGES[range];
  let raw: HistoryPoint[] = [];

  // Zabbix keeps raw history for a limited retention window; use hourly trends
  // for multi-day ranges and fall back to history if trends are unavailable.
  if (spec.seconds > HISTORY_SECONDS) {
    try {
      const rows = await rpc<TrendRow[]>('trend.get', {
        output: ['clock', 'value_avg'],
        itemids: [item.itemid],
        time_from: from,
        time_till: to,
        sortfield: 'clock',
        sortorder: 'ASC',
        limit: 5000,
      });
      raw = rows
        .map((row) => ({ t: parseInt(row.clock, 10), v: numeric(row.value_avg ?? row.value) }))
        .filter((point) => Number.isFinite(point.t) && point.v !== null)
        .map((point) => ({ t: point.t, v: convert ? convert(point.v as number) : (point.v as number) }));
    } catch {
      // fall through to history.get
    }
  }

  if (!raw.length) {
    try {
      const rows = await rpc<HistoryRow[]>('history.get', {
        output: 'extend',
        history: parseInt(item.value_type || '0', 10) || 0,
        itemids: [item.itemid],
        time_from: from,
        time_till: to,
        sortfield: 'clock',
        // Keep the newest samples when a high-frequency item exceeds the row cap.
        sortorder: 'DESC',
        limit: 5000,
      });
      raw = rows
        .map((row) => ({ t: parseInt(row.clock, 10), v: numeric(row.value) }))
        .filter((point) => Number.isFinite(point.t) && point.v !== null)
        .map((point) => ({ t: point.t, v: convert ? convert(point.v as number) : (point.v as number) }))
        .reverse();
    } catch {
      return [];
    }
  }

  return bucketPoints(raw, spec.points, from, to);
}

async function networkPointsFor(
  rpc: ReturnType<typeof makeRpc>,
  resolved: ResolvedHostItems,
  range: HistoryRangeKey,
  from: number,
  to: number
): Promise<HistoryPoint[]> {
  const directions = [...resolved.netIn, ...resolved.netOut];
  if (!directions.length) {
    return [];
  }
  const series = (
    await Promise.all(directions.map((item) => historyPointsFor(rpc, item, range, from, to)))
  ).filter((points) => points.length > 0);
  if (!series.length) {
    return [];
  }
  const byTime = new Map<number, number>();
  for (const points of series) {
    for (const point of points) {
      byTime.set(point.t, (byTime.get(point.t) || 0) + point.v);
    }
  }
  // Same 1 Gbps access-port assumption as the dashboard's snapshot metric.
  return Array.from(byTime.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([t, sum]) => ({ t, v: round(clamp((sum / 1e9) * 100)) }));
}

/** Average the per-core hrProcessorLoad series when no aggregate CPU item exists. */
async function cpuPointsFor(
  rpc: ReturnType<typeof makeRpc>,
  resolved: ResolvedHostItems,
  range: HistoryRangeKey,
  from: number,
  to: number
): Promise<HistoryPoint[]> {
  const items = [resolved.cpu, ...resolved.cpuPeers].filter(
    (item): item is DetailItem => !!item
  );
  if (!items.length) {
    return [];
  }
  if (items.length === 1) {
    return historyPointsFor(rpc, items[0], range, from, to);
  }
  return averagePoints(
    await Promise.all(items.map((item) => historyPointsFor(rpc, item, range, from, to)))
  );
}

/**
 * Fetch the per-host detail used by the server drawer: filesystem usage and
 * 24-hour CPU/memory/disk history. Falls back to snapshot-only data on failure.
 */
export async function fetchHostDetail(host: Host): Promise<HostDetail> {
  const config = await loadZabbixConfig();
  const rpc = makeRpc(config);

  let resolved: ResolvedHostItems | null = null;
  try {
    resolved = await resolveHostItemsCached(rpc, host);
  } catch (err) {
    return fallbackHostDetail(host, `Live detail unavailable: ${(err as Error).message}`);
  }
  if (!resolved) {
    return fallbackHostDetail(host, 'This host is no longer present in Zabbix.');
  }

  const filesystems: FilesystemUsage[] = resolved.filesystems.map(({ mount, used }) => ({
    mount,
    used,
  }));
  if (!filesystems.length) {
    filesystems.push({ mount: host.os === 'Windows' ? 'C:' : '/', used: host.disk });
  }

  const legacyHistory = (item?: DetailItem, convert?: (value: number) => number) =>
    item ? historyValues(rpc, item, convert) : Promise.resolve([]);

  const cpuItems = [resolved.cpu, ...resolved.cpuPeers].filter(
    (item): item is DetailItem => !!item
  );
  const [cpuSeries, memory, disk] = await Promise.all([
    Promise.all(cpuItems.map((item) => legacyHistory(item))),
    legacyHistory(resolved.memory, memoryConverter(resolved)),
    legacyHistory(resolved.disk),
  ]);
  const cpu = averageValues(cpuSeries);

  const partial = !cpu.length || !memory.length || !disk.length;
  return {
    filesystems: filesystems.slice(0, 8),
    trends: {
      ...(cpu.length ? { cpu } : {}),
      ...(memory.length ? { memory } : {}),
      ...(disk.length ? { disk } : {}),
    },
    source: 'live',
    partial,
    note: partial
      ? 'Live snapshot; 24 h history is unavailable for one or more items on this host.'
      : 'Fetched from Zabbix when this panel opened; sparklines cover the last 24 hours.',
  };
}

/** The original 24-point overview sparkline feed. */
async function historyValues(
  rpc: ReturnType<typeof makeRpc>,
  item: DetailItem,
  convert?: (value: number) => number
): Promise<number[]> {
  try {
    const rows = await rpc<HistoryRow[]>('history.get', {
      output: 'extend',
      history: parseInt(item.value_type || '0', 10) || 0,
      itemids: [item.itemid],
      time_from: Math.floor(Date.now() / 1000) - HISTORY_SECONDS,
      sortfield: 'clock',
      sortorder: 'DESC',
      limit: 2000,
    });
    const values = rows
      .map((row) => numeric(row.value))
      .filter((value): value is number => value !== null)
      .map((value) => (convert ? convert(value) : value))
      .reverse();
    return downsample(values).map(round);
  } catch {
    return [];
  }
}

/** Multi-metric history backing the Server Statistics history view. */
export async function fetchHostHistory(
  host: Host,
  range: HistoryRangeKey
): Promise<HostHistory> {
  const config = await loadZabbixConfig();
  const rpc = makeRpc(config);
  const spec = HISTORY_RANGES[range];
  const to = Math.floor(Date.now() / 1000);
  const from = to - spec.seconds;
  const empty: HostHistory = {
    range,
    from,
    to,
    series: {},
    filesystems: [],
    source: 'live',
    partial: true,
    note: 'Live history is unavailable for this host.',
  };

  let resolved: ResolvedHostItems | null = null;
  try {
    resolved = await resolveHostItemsCached(rpc, host);
  } catch (err) {
    return { ...empty, note: `Live history unavailable: ${(err as Error).message}` };
  }
  if (!resolved) {
    return { ...empty, note: 'This host is no longer present in Zabbix.' };
  }

  const [cpu, memory, disk, network, filesystems] = await Promise.all([
    cpuPointsFor(rpc, resolved, range, from, to),
    resolved.memory
      ? historyPointsFor(rpc, resolved.memory, range, from, to, memoryConverter(resolved))
      : Promise.resolve([]),
    resolved.disk ? historyPointsFor(rpc, resolved.disk, range, from, to) : Promise.resolve([]),
    networkPointsFor(rpc, resolved, range, from, to),
    Promise.all(
      resolved.filesystems.slice(0, 8).map(async (fs) => ({
        mount: fs.mount,
        points: await historyPointsFor(rpc, fs.item, range, from, to),
      }))
    ),
  ]);

  const series: Partial<Record<HistoryMetric, HistoryPoint[]>> = {};
  if (cpu.length) {
    series.cpu = cpu;
  }
  if (memory.length) {
    series.memory = memory;
  }
  if (disk.length) {
    series.disk = disk;
  }
  if (network.length) {
    series.network = network;
  }
  const filesystemSeries = filesystems.filter((fs) => fs.points.length > 0);
  const partial = !cpu.length || !memory.length || !disk.length || !network.length;

  return {
    range,
    from,
    to,
    series,
    filesystems: filesystemSeries,
    source: 'live',
    partial,
    note: partial
      ? `Live history is incomplete for ${spec.full}.`
      : `Fetched from Zabbix: ${spec.full}.`,
  };
}
