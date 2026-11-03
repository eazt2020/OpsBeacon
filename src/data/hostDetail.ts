import { FilesystemUsage, Host, HostDetail } from '../types';
import { loadZabbixConfig, zabbixRpc } from './config';

interface DetailItem {
  itemid: string;
  key_: string;
  lastvalue: string;
  value_type?: string;
}

interface HistoryRow {
  clock: string;
  value: string;
}

interface ZabbixHostId {
  hostid: string;
}

const MAX_POINTS = 24;
const HISTORY_SECONDS = 24 * 60 * 60;

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

function sampleFilesystems(host: Host): FilesystemUsage[] {
  const mounts = host.os === 'Windows' ? ['C:', 'D:', 'E:'] : ['/', '/data', '/var', '/opt'];
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
  const match = key.match(/\[(.*),pused\]/);
  const mount = match ? match[1].replace(/^"|"$/g, '') : '';
  return mount || '/';
}

async function historyFor(
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
      sortorder: 'ASC',
      limit: 2000,
    });
    const values = rows
      .map((row) => numeric(row.value))
      .filter((value): value is number => value !== null)
      .map((value) => (convert ? convert(value) : value));
    return downsample(values).map(round);
  } catch {
    return [];
  }
}

function makeRpc(config: Awaited<ReturnType<typeof loadZabbixConfig>>) {
  return <T>(method: string, params: unknown) => zabbixRpc<T>(config, method, params);
}

/**
 * Fetch the per-host detail used by the server drawer: filesystem usage and
 * 24-hour CPU/memory/disk history. Falls back to snapshot-only data on failure.
 */
export async function fetchHostDetail(host: Host): Promise<HostDetail> {
  const config = await loadZabbixConfig();
  const rpc = makeRpc(config);

  const hosts = await rpc<ZabbixHostId[]>('host.get', {
    output: ['hostid'],
    filter: { host: [host.hostname] },
  });
  const hostid = hosts[0] && hosts[0].hostid;
  if (!hostid) {
    return fallbackHostDetail(host, 'This host is no longer present in Zabbix.');
  }

  const items = await rpc<DetailItem[]>('item.get', {
    output: ['itemid', 'key_', 'lastvalue', 'value_type'],
    hostids: [hostid],
    monitored: true,
    limit: 5000,
  });

  const byKey = new Map(items.map((item) => [item.key_, item]));
  const cpuItem = byKey.get('system.cpu.util');
  const memItem = byKey.get('vm.memory.util') || byKey.get('vm.memory.utilization');
  const pavailable = !memItem ? byKey.get('vm.memory.size[pavailable]') : undefined;

  const filesystemByMount = new Map<string, FilesystemUsage>();
  let diskItem: DetailItem | undefined;
  let diskUsed = -1;
  for (const item of items) {
    if (!/^vfs\.fs\.(dependent\.)?size\[[^\]]*pused\]$/.test(item.key_)) {
      continue;
    }
    const used = numeric(item.lastvalue);
    if (used === null) {
      continue;
    }
    const mount = parseMount(item.key_);
    const previous = filesystemByMount.get(mount);
    if (!previous || used > previous.used) {
      filesystemByMount.set(mount, { mount, used: round(used) });
    }
    if (used > diskUsed) {
      diskUsed = used;
      diskItem = item;
    }
  }
  const filesystems = Array.from(filesystemByMount.values()).sort((a, b) => b.used - a.used);
  if (!filesystems.length) {
    filesystems.push({ mount: host.os === 'Windows' ? 'C:' : '/', used: host.disk });
  }

  const [cpu, memory, disk] = await Promise.all([
    cpuItem ? historyFor(rpc, cpuItem) : Promise.resolve([]),
    memItem
      ? historyFor(rpc, memItem)
      : pavailable
      ? historyFor(rpc, pavailable, (value) => 100 - value)
      : Promise.resolve([]),
    diskItem ? historyFor(rpc, diskItem) : Promise.resolve([]),
  ]);

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
