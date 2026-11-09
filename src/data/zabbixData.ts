import {
  BusinessServiceRow,
  Environment,
  Host,
  Problem,
  SampleData,
  Severity,
  SeverityGroup,
  SlaState,
  Tier,
  TopServerRow,
  UtilizationStat,
} from '../types';

import { loadZabbixConfig, zabbixEndpoint, zabbixRpc, ZabbixTransport } from './config';

interface ZabbixTag {
  tag: string;
  value: string;
}

interface ZabbixHost {
  hostid: string;
  host: string;
  name?: string;
  status?: string;
  available?: string;
  maintenance_status?: string;
  groups?: Array<{ groupid: string; name: string }>;
  tags?: ZabbixTag[];
  inventory?: { os?: string; os_full?: string };
  interfaces?: Array<{ available?: string }>;
}

interface ZabbixProblem {
  eventid: string;
  objectid: string;
  clock: string;
  name: string;
  severity: string;
  acknowledged: string;
  suppressed?: string;
  opdata?: string;
  tags?: ZabbixTag[];
}

interface ZabbixTrigger {
  triggerid: string;
  description: string;
  priority: string;
  hosts?: Array<{ hostid: string; host: string }>;
}

interface ZabbixItem {
  itemid: string;
  hostid: string;
  key_: string;
  name: string;
  lastvalue: string;
  lastclock: string;
  units: string;
}

interface ZabbixMaintenance {
  maintenanceid: string;
  name: string;
  hosts?: Array<{ hostid: string }>;
}

export interface LiveResult {
  data: SampleData;
  version: string;
  fetchedAt: Date;
  transport: ZabbixTransport;
}

// Freshness must not depend on the browser's clock. A workstation whose clock
// runs fast (or behind) would mark every host stale even though Zabbix is
// delivering data every minute. Instead, "now" is the newest item clock the
// API just returned: a host whose newest item lags that reference has stopped
// reporting. If the whole estate stops advancing while the API still answers,
// every host is marked no-data after this many minutes. The elapsed time is
// measured with performance.now(), so a skewed clock cannot affect it.
const ESTATE_FROZEN_MINUTES = 15;
let estateAnchorClock = 0;
let estateAnchorAt = 0;
let estateFrozen = false;

// Top-server sparklines need history.get, which can return thousands of points.
// The dashboards poll every 15-60 s, so fetching that history on every refresh
// puts a steady load on Zabbix for data that changes slowly. Keep the
// downsampled series for a few minutes and only fetch what is missing/expired.
const HISTORY_TTL_MS = 5 * 60_000;
const HISTORY_MAX_ENTRIES = 400;
const historyCache = new Map<string, { at: number; values: number[] }>();

function zabbixReferenceNow(items: ZabbixItem[]): number {
  let newest = 0;
  for (const item of items) {
    const clock = parseInt(item.lastclock || '0', 10) || 0;
    if (clock > newest) {
      newest = clock;
    }
  }
  if (newest <= 0) {
    // No clocks at all (nothing monitored yet): fall back to the local clock.
    return Math.floor(Date.now() / 1000);
  }
  const mono =
    typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now();
  if (newest > estateAnchorClock) {
    estateAnchorClock = newest;
    estateAnchorAt = mono;
    estateFrozen = false;
  } else if (estateAnchorAt > 0 && (mono - estateAnchorAt) / 60000 > ESTATE_FROZEN_MINUTES) {
    estateFrozen = true;
  }
  return newest;
}

const SEVERITY_GROUP: Record<number, SeverityGroup> = {
  0: 'Info',
  1: 'Info',
  2: 'Warning',
  3: 'Warning',
  4: 'Critical',
  5: 'Critical',
};

const SEVERITY_LABEL: Record<number, Severity> = {
  0: 'Info',
  1: 'Info',
  2: 'Warning',
  3: 'Warning',
  4: 'High',
  5: 'Critical',
};

// The dashboard presents Singapore time everywhere (the header clock and sync
// labels are formatted for Asia/Singapore). Format problem start times the same
// way so they cannot disagree with the header on a workstation set to another
// time zone. Constructing an Intl.DateTimeFormat is expensive, so one instance
// is reused for every problem in the snapshot.
const TIME_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Singapore',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function timeLabel(clockSec: number): string {
  const parts = TIME_FORMATTER.formatToParts(new Date(clockSec * 1000));
  const get = (type: string) => parts.find((p) => p.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}

function durationLabel(minutes: number): string {
  const m = Math.max(1, Math.round(minutes));
  if (m < 60) {
    return `${m}m`;
  }
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function tagValue(tags: ZabbixTag[] | undefined, names: string[]): string | undefined {
  if (!tags) {
    return undefined;
  }
  const wanted = names.map((n) => n.toLowerCase());
  const hit = tags.find((t) => wanted.includes(String(t.tag || '').toLowerCase()));
  return hit ? String(hit.value || '').trim() || undefined : undefined;
}

function inferEnvironment(groupNames: string[]): Environment {
  const text = groupNames.join(' ');
  if (/disaster|\bdr\b|recovery/i.test(text)) {
    return 'DR';
  }
  if (/uat|\bdev\b|development|test|qa/i.test(text)) {
    return 'UAT';
  }
  return 'PROD';
}

function normalizeEnvironment(value: string | undefined, groups: string[]): Environment {
  const v = (value || '').toLowerCase();
  if (v.includes('dr') || v.includes('disaster')) {
    return 'DR';
  }
  if (v.includes('uat') || v.includes('dev') || v.includes('test') || v.includes('qa')) {
    return 'UAT';
  }
  if (v.includes('prod') || v.includes('prd')) {
    return 'PROD';
  }
  return inferEnvironment(groups);
}

function normalizeTier(value: string | undefined): Tier {
  const v = (value || '').toLowerCase();
  if (v.includes('1') || v.includes('core') || v.includes('critical')) {
    return 'Tier 1';
  }
  if (v.includes('2')) {
    return 'Tier 2';
  }
  return 'Tier 3';
}

const IBM_I_PATTERN = /ibm\s*i\b|as\/?400|os\/?400|i5\/os|iseries/i;

function osFromInventory(host: ZabbixHost): string {
  const text = `${host.inventory?.os || ''} ${host.inventory?.os_full || ''}`;
  if (IBM_I_PATTERN.test(text)) {
    return 'IBM i';
  }
  if (/windows/i.test(text)) {
    return 'Windows';
  }
  if (/\baix\b/i.test(text)) {
    return 'AIX';
  }
  if (/solaris/i.test(text)) {
    return 'Solaris';
  }
  return 'Linux';
}

/**
 * IBM i hosts commonly have no inventory OS field. The AS/400 agent emulator
 * exposes as400.* keys, and system.uname reports OS/400 or IBM i, so use those
 * as a second signal.
 */
function osFromItems(items: ZabbixItem[]): string | null {
  if (items.some((item) => /^as400\./i.test(item.key_))) {
    return 'IBM i';
  }
  const uname = items.find((item) => item.key_ === 'system.uname');
  if (uname && IBM_I_PATTERN.test(uname.lastvalue || '')) {
    return 'IBM i';
  }
  return null;
}

/** Aggregate CPU key from the AS/400 agent emulator: proc.cpu.util[,,total,,,]. */
function isAggregateProcCpu(key: string): boolean {
  if (!/^proc\.cpu\.util\[/i.test(key)) {
    return false;
  }
  const args = key.slice(key.indexOf('[') + 1, -1).split(',');
  return (
    (args[0] || '').trim() === '' &&
    args.some((arg) => arg.trim().toLowerCase() === 'total')
  );
}

function numeric(value: string | undefined): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function metricForHost(items: ZabbixItem[], nowSec: number): {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  lastSeenMin: number;
  itemIds: { cpu?: string; memory?: string; disk?: string };
  hasItems: boolean;
} {
  let cpu: number | null = null;
  let memory: number | null = null;
  let disk: number | null = null;
  let netIn = 0;
  let netOut = 0;
  let sawNet = false;
  let cpuItem: string | undefined;
  let memItem: string | undefined;
  let diskItem: string | undefined;
  let lastClock = 0;

  // IBM i fallbacks: the AS/400 agent emulator exposes proc.cpu.util[,,total,,,]
  // instead of system.cpu.util, and SNMP templates may expose one
  // hrProcessorLoad item per core. The aggregate key wins when both exist.
  let aggregateCpu: number | null = null;
  let aggregateCpuItem: string | undefined;
  let cpuFallbackSum = 0;
  let cpuFallbackCount = 0;
  let cpuFallbackItem: string | undefined;
  let memAvailable: number | null = null;
  let memFree: number | null = null;
  let memTotal: number | null = null;

  for (const item of items) {
    const key = item.key_ || '';
    const value = numeric(item.lastvalue);
    const clock = parseInt(item.lastclock || '0', 10) || 0;
    if (clock > lastClock) {
      lastClock = clock;
    }
    if (value === null) {
      continue;
    }
    if (key === 'system.cpu.util') {
      cpu = value;
      cpuItem = item.itemid;
    } else if (isAggregateProcCpu(key)) {
      if (aggregateCpu === null) {
        aggregateCpu = value;
        aggregateCpuItem = item.itemid;
      }
    } else if (/hrProcessorLoad/i.test(key)) {
      cpuFallbackSum += value;
      cpuFallbackCount += 1;
      cpuFallbackItem = item.itemid;
    } else if (key === 'vm.memory.util' || key === 'vm.memory.utilization') {
      memory = value;
      memItem = item.itemid;
    } else if (key === 'vm.memory.size[pavailable]' && memory === null) {
      memory = Math.max(0, 100 - value);
      memItem = item.itemid;
    } else if (key === 'vm.memory.size[pfree]' && memory === null) {
      memory = Math.max(0, 100 - value);
      memItem = item.itemid;
    } else if (key === 'vm.memory.size[available]') {
      memAvailable = value;
    } else if (key === 'vm.memory.size[free]') {
      memFree = value;
    } else if (key === 'vm.memory.size[total]') {
      memTotal = value;
    } else if (
      /^vfs\.fs\.(dependent\.)?size\[[^\]]*pused[^\]]*\]$/i.test(key) ||
      /^as400\.disk\.size\[[^\]]*pused[^\]]*\]$/i.test(key)
    ) {
      if (disk === null || value > disk) {
        disk = value;
        diskItem = item.itemid;
      }
    } else if (
      (/^net\.if\.in\[[^\]]*\]$/i.test(key) ||
        (/^if(HC)?InOctets\[/i.test(key) && /bps/i.test(item.units || ''))) &&
      !/errors|dropped|collisions/i.test(key)
    ) {
      netIn += value;
      sawNet = true;
    } else if (
      (/^net\.if\.out\[[^\]]*\]$/i.test(key) ||
        (/^if(HC)?OutOctets\[/i.test(key) && /bps/i.test(item.units || ''))) &&
      !/errors|dropped|collisions/i.test(key)
    ) {
      netOut += value;
      sawNet = true;
    }
  }

  if (cpu === null && aggregateCpu !== null) {
    cpu = aggregateCpu;
    cpuItem = aggregateCpuItem;
  } else if (cpu === null && cpuFallbackCount > 0) {
    cpu = cpuFallbackSum / cpuFallbackCount;
    cpuItem = cpuFallbackItem;
  }
  if (memory === null && memTotal !== null && memTotal > 0) {
    if (memAvailable !== null) {
      memory = Math.max(0, 100 - (memAvailable / memTotal) * 100);
    } else if (memFree !== null) {
      memory = Math.max(0, 100 - (memFree / memTotal) * 100);
    }
  }

  const lastSeenMin = lastClock > 0 ? Math.max(0, Math.round((nowSec - lastClock) / 60)) : 9999;
  // Assume a 1 Gbps access port when converting interface bit rates to a percentage.
  const network = sawNet ? Math.min(100, ((netIn + netOut) / 1e9) * 100) : 0;

  return {
    cpu: Math.round(cpu ?? 0),
    memory: Math.round(memory ?? 0),
    disk: Math.round(disk ?? 0),
    network: Math.round(network * 10) / 10,
    lastSeenMin,
    itemIds: { cpu: cpuItem, memory: memItem, disk: diskItem },
    hasItems: items.length > 0,
  };
}

function downsample(values: number[], buckets = 24): number[] {
  if (values.length === 0) {
    return [];
  }
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

function utilization(hosts: Host[], key: 'cpu' | 'memory' | 'disk' | 'network'): UtilizationStat {
  const values = hosts.map((h) => h[key]);
  const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  return {
    avg,
    critical: values.filter((v) => v >= 90).length,
    warning: values.filter((v) => v >= 70 && v < 90).length,
    normal: values.filter((v) => v < 70).length,
  };
}

export async function fetchZabbixData(): Promise<LiveResult> {
  const config = await loadZabbixConfig();
  const rpc = <T>(method: string, params: unknown, route: 'api' | 'public' = 'api') =>
    zabbixRpc<T>(config, method, params, route);

  const empty: SampleData = {
    hosts: [],
    problems: [],
    businessServices: [],
    drComponents: [],
    topServers: [],
    utilization: {
      cpu: { avg: 0, critical: 0, warning: 0, normal: 0 },
      memory: { avg: 0, critical: 0, warning: 0, normal: 0 },
      disk: { avg: 0, critical: 0, warning: 0, normal: 0 },
      network: { avg: 0, critical: 0, warning: 0, normal: 0 },
    },
    kpiDeltas: { available: '', unavailable: '', warning: '', critical: '' },
  };

  const versionPromise = rpc<string>('apiinfo.version', {}, 'public').catch(() => '');

  const [hostsRaw, problemsRaw, triggersRaw, itemsRaw, maintenancesRaw, version] = await Promise.all([
    rpc<ZabbixHost[]>('host.get', {
      output: ['hostid', 'host', 'name', 'status', 'available', 'maintenance_status'],
      selectGroups: ['groupid', 'name'],
      selectTags: 'extend',
      selectInterfaces: ['interfaceid', 'available'],
      selectInventory: ['os', 'os_full'],
      monitored: true,
    }),
    rpc<ZabbixProblem[]>('problem.get', { output: 'extend', selectTags: 'extend' }),
    rpc<ZabbixTrigger[]>('trigger.get', {
      output: ['triggerid', 'description', 'priority'],
      selectHosts: ['hostid', 'host'],
      filter: { value: 1 },
      monitored: true,
    }),
    rpc<ZabbixItem[]>('item.get', {
      output: ['itemid', 'hostid', 'key_', 'name', 'lastvalue', 'lastclock', 'units'],
      monitored: true,
      limit: 5000,
    }),
    rpc<ZabbixMaintenance[]>('maintenance.get', { output: 'extend', selectHosts: ['hostid'] }),
    versionPromise,
  ]);

  // The reference clock for all freshness and duration arithmetic comes from
  // the item timestamps Zabbix just returned, not from the browser.
  const now = zabbixReferenceNow(itemsRaw);

  const itemsByHost = new Map<string, ZabbixItem[]>();
  for (const item of itemsRaw) {
    const list = itemsByHost.get(item.hostid) || [];
    list.push(item);
    itemsByHost.set(item.hostid, list);
  }

  const maintenanceHostIds = new Set<string>();
  for (const m of maintenancesRaw) {
    for (const h of m.hosts || []) {
      maintenanceHostIds.add(h.hostid);
    }
  }

  const triggerById = new Map<string, ZabbixTrigger>();
  const maxSeverityByHost = new Map<string, number>();
  for (const t of triggersRaw) {
    triggerById.set(t.triggerid, t);
    const priority = parseInt(t.priority || '0', 10) || 0;
    for (const h of t.hosts || []) {
      const prev = maxSeverityByHost.get(h.hostid) || 0;
      if (priority > prev) {
        maxSeverityByHost.set(h.hostid, priority);
      }
    }
  }

  const metricsByHost = new Map<string, ReturnType<typeof metricForHost>>();
  for (const zh of hostsRaw) {
    metricsByHost.set(zh.hostid, metricForHost(itemsByHost.get(zh.hostid) || [], now));
  }

  const hosts: Host[] = hostsRaw.map((zh, index) => {
    const groups = (zh.groups || []).map((g) => g.name);
    const hostItems = itemsByHost.get(zh.hostid) || [];
    const metrics = metricsByHost.get(zh.hostid) || metricForHost(hostItems, now);
    const maintenance = zh.maintenance_status === '1' || maintenanceHostIds.has(zh.hostid);
    const unavailable = zh.available === '2' || (zh.interfaces || []).some((i) => i.available === '2');
    const severityNum = maxSeverityByHost.get(zh.hostid) || 0;
    const critical = severityNum >= 4;
    const warning = severityNum >= 2 && !critical;

    let dataState: Host['dataState'] = 'upToDate';
    if (!metrics.hasItems) {
      dataState = 'notMonitored';
    } else if (estateFrozen || metrics.lastSeenMin > 10) {
      // estateFrozen: collection has stopped across the whole estate even
      // though the API still answers, so no host has fresh data.
      dataState = 'noData';
    } else if (metrics.lastSeenMin > 5) {
      dataState = 'stale';
    }

    const health: Host['health'] = maintenance
      ? 'maintenance'
      : unavailable
      ? 'unavailable'
      : critical
      ? 'critical'
      : warning
      ? 'warning'
      : dataState === 'stale' || dataState === 'noData'
      ? 'stale'
      : 'healthy';

    return {
      id: parseInt(zh.hostid, 10) || index + 1,
      hostname: zh.host,
      environment: normalizeEnvironment(tagValue(zh.tags, ['environment', 'env']), groups),
      hostGroup: groups[0] || 'Ungrouped',
      tier: normalizeTier(tagValue(zh.tags, ['tier', 'system_tier', 'system tier'])),
      os: osFromItems(hostItems) || osFromInventory(zh),
      businessService: tagValue(zh.tags, ['business_service', 'business service', 'service']) || 'Unassigned',
      health,
      connectivity: unavailable ? 'unavailable' : 'available',
      severity: critical ? 'critical' : warning ? 'warning' : null,
      maintenance,
      stale: dataState === 'stale' || dataState === 'noData',
      lastSeenMin: metrics.lastSeenMin,
      dataState,
      drRole: 'N/A',
      cpu: metrics.cpu,
      memory: metrics.memory,
      disk: metrics.disk,
      network: metrics.network,
    };
  });

  const hostByHostname = new Map(hosts.map((h) => [h.hostname, h]));

  const problems: Problem[] = problemsRaw.map((zp, index) => {
    const trigger = triggerById.get(zp.objectid);
    const zhost = trigger?.hosts?.[0]?.host || 'unknown';
    const host = hostByHostname.get(zhost);
    const severityNum = parseInt(zp.severity || '0', 10) || 0;
    const clock = parseInt(zp.clock || '0', 10) || Math.floor(now);
    const minutesAgo = Math.max(0, Math.round((now - clock) / 60));
    const tags = (zp.tags || []).map((t) => `${t.tag}:${t.value}`).slice(0, 3);
    return {
      id: index + 1,
      time: timeLabel(clock),
      minutesAgo,
      severity: SEVERITY_LABEL[severityNum] || 'Info',
      severityGroup: SEVERITY_GROUP[severityNum] || 'Info',
      hostname: zhost,
      environment: host?.environment || 'PROD',
      tier: host?.tier || 'Tier 3',
      businessService: host?.businessService || 'Unassigned',
      problem: zp.name,
      currentValue: zp.opdata && zp.opdata.trim() ? zp.opdata : '-',
      threshold: '-',
      duration: durationLabel(minutesAgo),
      sla: 'Not tracked' as SlaState,
      ack: zp.acknowledged === '1',
      maintenance: zp.suppressed === '1',
      related: tags.length ? tags.join(' · ') : '—',
    };
  });

  problems.sort((a, b) => a.minutesAgo - b.minutesAgo);

  const serviceMap = new Map<string, Host[]>();
  for (const h of hosts) {
    const list = serviceMap.get(h.businessService) || [];
    list.push(h);
    serviceMap.set(h.businessService, list);
  }
  const businessServices: BusinessServiceRow[] = Array.from(serviceMap.entries())
    .map(([name, serviceHosts]) => {
      const envs = new Set(serviceHosts.map((h) => h.environment));
      const activeProblems = problems.filter((p) => p.businessService === name).length;
      const status: BusinessServiceRow['status'] = serviceHosts.some((h) => h.health === 'critical')
        ? 'Critical'
        : serviceHosts.some((h) => h.health === 'warning' || h.health === 'stale')
        ? 'Warning'
        : 'Healthy';
      return {
        name,
        env: envs.size === 1 ? Array.from(envs)[0] : 'Mixed',
        servers: serviceHosts.length,
        status,
        activeProblems,
      };
    })
    .sort((a, b) => b.servers - a.servers);

  const topSorted = hosts
    .slice()
    .sort((a, b) => b.cpu - a.cpu || b.memory - a.memory || b.disk - a.disk)
    .slice(0, 10);

  const metricItemByHost = new Map<string, { cpu?: string; memory?: string; disk?: string }>();
  for (const zh of hostsRaw) {
    metricItemByHost.set(zh.host, metricsByHost.get(zh.hostid)?.itemIds || {});
  }
  const historyIds = new Set<string>();
  for (const row of topSorted) {
    const ids = metricItemByHost.get(row.hostname);
    if (!ids) {
      continue;
    }
    if (ids.cpu) historyIds.add(ids.cpu);
    if (ids.memory) historyIds.add(ids.memory);
    if (ids.disk) historyIds.add(ids.disk);
  }

  const historyByItem = new Map<string, number[]>();
  if (historyIds.size > 0) {
    const endpoint = zabbixEndpoint(config, 'api');
    const nowMs = Date.now();
    const cacheKey = (itemid: string) => `${endpoint}|${itemid}`;
    const missing = Array.from(historyIds).filter((itemid) => {
      const cached = historyCache.get(cacheKey(itemid));
      return !cached || nowMs - cached.at > HISTORY_TTL_MS;
    });
    if (missing.length > 0) {
      try {
        const history = await rpc<Array<{ itemid: string; clock: string; value: string }>>('history.get', {
          output: ['itemid', 'clock', 'value'],
          history: 0,
          itemids: missing,
          time_from: Math.floor(now) - 86400,
          sortfield: 'clock',
          sortorder: 'DESC',
          limit: 5000,
        });
        const collected = new Map<string, number[]>();
        for (const itemid of missing) {
          // Cache an empty series too: an item with no history must not be
          // requested again on every refresh.
          collected.set(itemid, []);
        }
        for (const point of history) {
          const list = collected.get(point.itemid) || [];
          const v = numeric(point.value);
          if (v !== null) {
            list.push(v);
          }
          collected.set(point.itemid, list);
        }
        for (const [itemid, values] of collected.entries()) {
          const series = downsample(values.slice().reverse()).map((v) =>
            Math.max(0, Math.min(100, Math.round(v)))
          );
          historyCache.set(cacheKey(itemid), { at: nowMs, values: series });
        }
      } catch {
        // History is a nice-to-have; keep any cached series and fall back to
        // flat sparklines for the rest.
      }
    }
    for (const itemid of historyIds) {
      const cached = historyCache.get(cacheKey(itemid));
      if (cached && cached.values.length > 0) {
        historyByItem.set(itemid, cached.values);
      }
    }
    // Drop series for hosts that have left the top list.
    for (const [key, entry] of historyCache) {
      if (nowMs - entry.at > HISTORY_TTL_MS * 4 || historyCache.size > HISTORY_MAX_ENTRIES) {
        historyCache.delete(key);
      }
    }
  }

  const flat = (value: number) => Array.from({ length: 24 }, () => Math.round(value));
  const topServers: TopServerRow[] = topSorted.map((h, i) => {
    const ids = metricItemByHost.get(h.hostname) || {};
    return {
      rank: i + 1,
      hostname: h.hostname,
      environment: h.environment,
      tier: h.tier,
      os: h.os,
      businessService: h.businessService,
      cpu: h.cpu,
      memory: h.memory,
      disk: h.disk,
      trends: {
        cpu: (ids.cpu && historyByItem.get(ids.cpu)) || flat(h.cpu),
        memory: (ids.memory && historyByItem.get(ids.memory)) || flat(h.memory),
        disk: (ids.disk && historyByItem.get(ids.disk)) || flat(h.disk),
      },
    };
  });

  const data: SampleData = {
    ...empty,
    hosts,
    problems,
    businessServices,
    topServers,
    utilization: {
      cpu: utilization(hosts, 'cpu'),
      memory: utilization(hosts, 'memory'),
      disk: utilization(hosts, 'disk'),
      network: utilization(hosts, 'network'),
    },
  };

  return {
    data,
    version: version || 'Unknown',
    fetchedAt: new Date(now * 1000),
    transport: config.transport,
  };
}
