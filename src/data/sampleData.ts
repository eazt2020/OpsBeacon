import {
  BusinessServiceRow,
  DrRow,
  Environment,
  Filters,
  Host,
  Problem,
  SampleData,
  Severity,
  SeverityGroup,
  SlaState,
  Tier,
  TopServerRow,
} from '../types';

const SERVICE_SLUG: Record<string, string> = {
  'Core Banking': 'core-bank',
  'Payment Gateway': 'pay-batch',
  'Internet Banking': 'web-portal',
  Treasury: 'treasury',
  'Customer Information': 'cust-info',
  'HR & Finance': 'hr-fin',
  'Other Services': 'app-srv',
};

const TIER_SUBTITLE: Record<Tier, string> = {
  'Tier 1': 'Core Banking',
  'Tier 2': 'Business Critical',
  'Tier 3': 'Supporting',
};

const OS_POOL: Array<[string, number]> = [
  ['Linux', 70],
  ['Windows', 18],
  ['AIX', 6],
  ['Solaris', 6],
];

const CRITICAL_PROBLEMS = [
  { text: 'Disk space is low on /data', threshold: '> 90%' },
  { text: 'CPU utilization is too high', threshold: '> 90%' },
  { text: 'Memory utilization is too high', threshold: '> 90%' },
  { text: 'Filesystem /var is full', threshold: '> 90%' },
  { text: 'Service MSSQL is down', threshold: '= 1' },
  { text: 'Host is unreachable', threshold: '= 1' },
  { text: 'Storage replication lag exceeds threshold', threshold: '> 15m' },
  { text: 'DR readiness check failed', threshold: '= Healthy' },
];

const WARNING_PROBLEMS = [
  { text: 'CPU load is high', threshold: '> 5' },
  { text: 'Memory utilization is high', threshold: '> 80%' },
  { text: 'Filesystem /tmp usage is high', threshold: '> 80%' },
  { text: 'Replication lag is elevated', threshold: '> 2m' },
  { text: 'Agent availability is stale', threshold: '> 5m' },
  { text: 'Network errors on eth0', threshold: '> 10' },
  { text: 'Swap utilization is high', threshold: '> 50%' },
];

const INFO_PROBLEMS = [
  'Configuration changed',
  'Agent restarted',
  'New host discovered',
  'Maintenance window started',
  'SLA report generated',
  'Template re-linked',
  'Inventory updated',
];

const RELATED = [
  'related (same storage)',
  'related (same host group)',
  '3 related (same cluster)',
  'affected (same LB)',
  'related (same filesystem)',
  '6 related (DR cluster)',
  'related (same service)',
  '12 affected (same network)',
  '2 related (same hypervisor)',
];

const ENV_SPECS: Array<{
  env: Environment;
  group: string;
  tiers: Array<[Tier, number]>;
  services: Array<[string, number]>;
  flags: { unavailable: number; maintenance: number; stale: number; warning: number; critical: number };
  dataStates: { notMonitored: number; noData: number; stale: number };
  cpu: { critical: number; warning: number };
  memory: { critical: number; warning: number };
  disk: { critical: number; warning: number };
  network: { critical: number; warning: number };
}> = [
  {
    env: 'PROD',
    group: 'Production',
    tiers: [
      ['Tier 1', 182],
      ['Tier 2', 214],
      ['Tier 3', 186],
    ],
    services: [
      ['Core Banking', 200],
      ['Payment Gateway', 128],
      ['Internet Banking', 80],
      ['Treasury', 86],
      ['Customer Information', 60],
      ['Other Services', 28],
    ],
    flags: { unavailable: 8, maintenance: 12, stale: 8, warning: 13, critical: 15 },
    dataStates: { notMonitored: 5, noData: 8, stale: 16 },
    cpu: { critical: 18, warning: 60 },
    memory: { critical: 24, warning: 84 },
    disk: { critical: 32, warning: 100 },
    network: { critical: 10, warning: 40 },
  },
  {
    env: 'DR',
    group: 'Disaster Recovery',
    tiers: [
      ['Tier 1', 120],
      ['Tier 2', 126],
      ['Tier 3', 122],
    ],
    services: [
      ['Core Banking', 102],
      ['Internet Banking', 62],
      ['Customer Information', 36],
      ['Other Services', 168],
    ],
    flags: { unavailable: 6, maintenance: 8, stale: 5, warning: 8, critical: 10 },
    dataStates: { notMonitored: 3, noData: 5, stale: 10 },
    cpu: { critical: 12, warning: 36 },
    memory: { critical: 16, warning: 52 },
    disk: { critical: 20, warning: 60 },
    network: { critical: 7, warning: 26 },
  },
  {
    env: 'UAT',
    group: 'Development / UAT',
    tiers: [
      ['Tier 1', 96],
      ['Tier 2', 102],
      ['Tier 3', 120],
    ],
    services: [
      ['HR & Finance', 74],
      ['Other Services', 244],
    ],
    flags: { unavailable: 4, maintenance: 5, stale: 3, warning: 6, critical: 6 },
    dataStates: { notMonitored: 2, noData: 3, stale: 6 },
    cpu: { critical: 8, warning: 28 },
    memory: { critical: 12, warning: 40 },
    disk: { critical: 16, warning: 50 },
    network: { critical: 5, warning: 20 },
  },
];

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function formatTime(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60_000);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function durationLabel(minutes: number): string {
  const m = Math.max(1, Math.round(minutes));
  if (m < 60) {
    return `${m}m`;
  }
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function trend(base: number, seed: number): number[] {
  let s = seed;
  const r = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: 24 }, (_, i) =>
    Math.max(0, Math.min(100, Math.round(base + Math.sin(i / 2.8) * 5 + (r() - 0.5) * 9)))
  );
}

function makeTopServers(): TopServerRow[] {
  const rows: Array<[string, Environment, Tier, number, number, number, string]> = [
    ['core-bank-01', 'PROD', 'Tier 1', 98, 92, 81, 'Core Banking'],
    ['pay-batch-02', 'PROD', 'Tier 1', 96, 88, 76, 'Payment Gateway'],
    ['app-core-03', 'PROD', 'Tier 2', 94, 85, 89, 'Other Services'],
    ['db-uat-01', 'UAT', 'Tier 2', 91, 93, 72, 'Other Services'],
    ['web-portal-01', 'PROD', 'Tier 2', 88, 78, 84, 'Internet Banking'],
    ['rhdl-app-15', 'PROD', 'Tier 3', 86, 72, 68, 'Other Services'],
    ['app-dev-06', 'UAT', 'Tier 3', 84, 69, 74, 'Other Services'],
    ['integ-srv-02', 'PROD', 'Tier 3', 82, 77, 66, 'Core Banking'],
    ['rhel-dr-07', 'DR', 'Tier 3', 79, 71, 62, 'Other Services'],
    ['app-uat-09', 'UAT', 'Tier 3', 79, 68, 65, 'Other Services'],
  ];
  return rows.map(([hostname, environment, tier, cpu, memory, disk, businessService], i) => ({
    rank: i + 1,
    hostname,
    environment,
    tier,
    os: 'Linux',
    businessService,
    cpu,
    memory,
    disk,
    trends: {
      cpu: trend(cpu, 100 + i),
      memory: trend(memory, 200 + i),
      disk: trend(disk, 300 + i),
    },
  }));
}

/** Empty dataset used while live data loads when sample data is disabled. */
export function emptySampleData(): SampleData {
  const zero = { avg: 0, critical: 0, warning: 0, normal: 0 };
  return {
    hosts: [],
    problems: [],
    businessServices: [],
    drComponents: [],
    topServers: [],
    utilization: { cpu: zero, memory: zero, disk: zero, network: zero },
    kpiDeltas: { available: '', unavailable: '', warning: '', critical: '' },
  };
}

export function buildSampleData(): SampleData {
  let seed = 0xc0ffee;
  const rnd = () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const rand = (min: number, max: number) => min + rnd() * (max - min);
  const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1));
  const pick = <T,>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
  const shuffle = <T,>(arr: T[]): T[] => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const pickOs = () => {
    const total = OS_POOL.reduce((sum, [, w]) => sum + w, 0);
    let n = rnd() * total;
    for (const [name, weight] of OS_POOL) {
      n -= weight;
      if (n <= 0) {
        return name;
      }
    }
    return OS_POOL[0][0];
  };

  const hosts: Host[] = [];
  let hostId = 1;

  const assignMetric = (
    envHosts: Host[],
    key: 'cpu' | 'memory' | 'disk' | 'network',
    counts: { critical: number; warning: number },
    ranges: { critical: [number, number]; warning: [number, number]; normal: [number, number] }
  ) => {
    const idx = shuffle(envHosts.map((_, i) => i));
    let p = 0;
    for (let i = 0; i < counts.critical; i++) {
      envHosts[idx[p++]][key] = randInt(ranges.critical[0], ranges.critical[1]);
    }
    for (let i = 0; i < counts.warning; i++) {
      envHosts[idx[p++]][key] = randInt(ranges.warning[0], ranges.warning[1]);
    }
    while (p < idx.length) {
      envHosts[idx[p++]][key] = randInt(ranges.normal[0], ranges.normal[1]);
    }
  };

  for (const spec of ENV_SPECS) {
    const envHosts: Host[] = [];
    const servicePool: string[] = [];
    for (const [service, count] of spec.services) {
      for (let i = 0; i < count; i++) {
        servicePool.push(service);
      }
    }
    const shuffledServices = shuffle(servicePool);
    let serviceIdx = 0;
    const nameCounters: Record<string, number> = {};

    for (const [tier, count] of spec.tiers) {
      for (let i = 0; i < count; i++) {
        const service = shuffledServices[serviceIdx++] ?? 'Other Services';
        const slug = SERVICE_SLUG[service] ?? 'app-srv';
        nameCounters[slug] = (nameCounters[slug] ?? 0) + 1;
        const prefix = spec.env === 'PROD' ? '' : spec.env === 'DR' ? 'dr-' : 'uat-';
        const hostname = `${prefix}${slug}-${pad(nameCounters[slug])}`;
        envHosts.push({
          id: hostId++,
          hostname,
          environment: spec.env,
          hostGroup: spec.group,
          tier,
          os: pickOs(),
          businessService: service,
          health: 'healthy',
          connectivity: 'available',
          severity: null,
          maintenance: false,
          stale: false,
          lastSeenMin: 0,
          dataState: 'upToDate',
          drRole: spec.env === 'PROD' ? 'Primary' : spec.env === 'DR' ? 'DR' : 'N/A',
          cpu: 0,
          memory: 0,
          disk: 0,
          network: 0,
        });
      }
    }

    const flagIdx = shuffle(envHosts.map((_, i) => i));
    let fi = 0;
    for (let i = 0; i < spec.flags.unavailable; i++) {
      envHosts[flagIdx[fi++]].connectivity = 'unavailable';
    }
    for (let i = 0; i < spec.flags.maintenance; i++) {
      envHosts[flagIdx[fi++]].maintenance = true;
    }
    for (let i = 0; i < spec.flags.stale; i++) {
      envHosts[flagIdx[fi++]].stale = true;
    }
    for (let i = 0; i < spec.flags.warning; i++) {
      envHosts[flagIdx[fi++]].severity = 'warning';
    }
    for (let i = 0; i < spec.flags.critical; i++) {
      envHosts[flagIdx[fi++]].severity = 'critical';
    }

    for (const h of envHosts) {
      h.health = h.maintenance
        ? 'maintenance'
        : h.connectivity === 'unavailable'
        ? 'unavailable'
        : h.stale
        ? 'stale'
        : h.severity === 'critical'
        ? 'critical'
        : h.severity === 'warning'
        ? 'warning'
        : 'healthy';
    }

    const unavailablePool = shuffle(envHosts.filter((h) => h.connectivity === 'unavailable'));
    for (let i = 0; i < spec.dataStates.notMonitored; i++) {
      if (unavailablePool[i]) {
        unavailablePool[i].dataState = 'notMonitored';
      }
    }
    const remainingPool = shuffle(envHosts.filter((h) => h.dataState === 'upToDate'));
    let ri = 0;
    for (let i = 0; i < spec.dataStates.noData; i++) {
      if (remainingPool[ri]) {
        remainingPool[ri++].dataState = 'noData';
      }
    }
    for (let i = 0; i < spec.dataStates.stale; i++) {
      if (remainingPool[ri]) {
        remainingPool[ri++].dataState = 'stale';
      }
    }
    for (const h of envHosts) {
      h.lastSeenMin =
        h.dataState === 'notMonitored'
          ? randInt(30, 120)
          : h.dataState === 'noData'
          ? randInt(11, 25)
          : h.dataState === 'stale'
          ? randInt(5, 10)
          : randInt(0, 4);
    }

    assignMetric(envHosts, 'cpu', spec.cpu, {
      critical: [90, 99],
      warning: [70, 89],
      normal: [5, 55],
    });
    assignMetric(envHosts, 'memory', spec.memory, {
      critical: [90, 99],
      warning: [72, 89],
      normal: [15, 65],
    });
    assignMetric(envHosts, 'disk', spec.disk, {
      critical: [90, 99],
      warning: [75, 89],
      normal: [15, 69],
    });
    assignMetric(envHosts, 'network', spec.network, {
      critical: [90, 99],
      warning: [70, 85],
      normal: [5, 42],
    });

    hosts.push(...envHosts);
  }

  const problems: Problem[] = [];
  let problemId = 1;
  const criticalHosts = hosts.filter((h) => h.severity === 'critical');
  const warningHosts = hosts.filter((h) => h.severity === 'warning');
  const infoHosts = shuffle(hosts.slice()).slice(0, 18);

  const slaFor = (): SlaState => {
    const n = rnd();
    return n < 0.6 ? 'Within SLA' : n < 0.85 ? 'At Risk' : 'Breaching';
  };

  criticalHosts.forEach((h, i) => {
    const template = pick(CRITICAL_PROBLEMS);
    const highest = Math.max(h.cpu, h.memory, h.disk);
    let problem = template.text;
    let current = `${highest}%`;
    let threshold = template.threshold;
    if (highest === h.cpu) {
      problem = 'CPU utilization is too high';
      current = `${h.cpu}%`;
      threshold = '> 90%';
    } else if (highest === h.memory) {
      problem = 'Memory utilization is too high';
      current = `${h.memory}%`;
      threshold = '> 90%';
    } else {
      problem = 'Filesystem /var is full';
      current = `${h.disk}%`;
      threshold = '> 90%';
    }
    const minutesAgo = randInt(1, 120);
    problems.push({
      id: problemId++,
      time: formatTime(minutesAgo),
      minutesAgo,
      severity: i < 21 ? 'Critical' : 'High',
      severityGroup: 'Critical',
      hostname: h.hostname,
      environment: h.environment,
      tier: h.tier,
      businessService: h.businessService,
      problem,
      currentValue: current,
      threshold,
      duration: durationLabel(minutesAgo),
      sla: slaFor(),
      ack: true,
      maintenance: false,
      related: pick(RELATED),
    });
  });

  warningHosts.forEach((h) => {
    const template = pick(WARNING_PROBLEMS);
    const minutesAgo = randInt(3, 180);
    const current =
      template.text.includes('load')
        ? (rand(4.5, 8.5)).toFixed(1)
        : template.text.includes('Replication')
        ? `${randInt(2, 14)}m`
        : template.text.includes('errors')
        ? String(randInt(12, 80))
        : `${randInt(70, 89)}%`;
    problems.push({
      id: problemId++,
      time: formatTime(minutesAgo),
      minutesAgo,
      severity: 'Warning',
      severityGroup: 'Warning',
      hostname: h.hostname,
      environment: h.environment,
      tier: h.tier,
      businessService: h.businessService,
      problem: template.text,
      currentValue: current,
      threshold: template.threshold,
      duration: durationLabel(minutesAgo),
      sla: slaFor(),
      ack: true,
      maintenance: false,
      related: pick(RELATED),
    });
  });

  infoHosts.forEach((h) => {
    const minutesAgo = randInt(5, 600);
    problems.push({
      id: problemId++,
      time: formatTime(minutesAgo),
      minutesAgo,
      severity: 'Info',
      severityGroup: 'Info',
      hostname: h.hostname,
      environment: h.environment,
      tier: h.tier,
      businessService: h.businessService,
      problem: pick(INFO_PROBLEMS),
      currentValue: '-',
      threshold: '-',
      duration: durationLabel(minutesAgo),
      sla: 'Within SLA',
      ack: true,
      maintenance: false,
      related: pick(RELATED),
    });
  });

  problems.sort((a, b) => a.minutesAgo - b.minutesAgo);
  const unackIdx = new Set(shuffle(problems.map((_, i) => i)).slice(0, 48));
  problems.forEach((p, i) => {
    p.ack = !unackIdx.has(i);
    p.maintenance = i % 9 === 0;
  });

  const businessServices: BusinessServiceRow[] = [
    { name: 'Core Banking', env: 'PROD/DR', servers: 302, status: 'Critical', activeProblems: 8 },
    { name: 'Payment Gateway', env: 'PROD', servers: 128, status: 'High', activeProblems: 6 },
    { name: 'Internet Banking', env: 'PROD/DR', servers: 142, status: 'High', activeProblems: 4 },
    { name: 'Treasury', env: 'PROD', servers: 86, status: 'Warning', activeProblems: 3 },
    { name: 'Customer Information', env: 'PROD/DR', servers: 96, status: 'Warning', activeProblems: 4 },
    { name: 'HR & Finance', env: 'UAT', servers: 74, status: 'Warning', activeProblems: 0 },
    { name: 'Other Services', env: 'Mixed', servers: 440, status: 'Healthy', activeProblems: 2 },
  ];

  const drComponents: DrRow[] = [
    {
      name: 'Core Banking DB',
      prodStatus: 'Healthy',
      drStatus: 'Healthy',
      replicationLag: '12 sec',
      lastSync: '1m ago',
      hostFilter: { environment: 'DR', businessService: 'Core Banking' },
    },
    {
      name: 'Application Servers',
      prodStatus: 'Healthy',
      drStatus: 'Healthy',
      replicationLag: '< 1 min',
      lastSync: '2m ago',
      hostFilter: { environment: 'DR', tier: 'Tier 1' },
    },
    {
      name: 'File Services',
      prodStatus: 'Warning',
      drStatus: 'Healthy',
      replicationLag: '5 min',
      lastSync: '6m ago',
      hostFilter: { environment: 'DR', os: 'Windows' },
    },
    {
      name: 'Backup Repository',
      prodStatus: 'Healthy',
      drStatus: 'Healthy',
      replicationLag: '-',
      lastSync: '3m ago',
      hostFilter: { environment: 'DR', businessService: 'Other Services' },
    },
    {
      name: 'VM Replication (VMware)',
      prodStatus: 'Healthy',
      drStatus: 'Warning',
      replicationLag: '3 min',
      lastSync: '5m ago',
      hostFilter: { environment: 'DR' },
    },
    {
      name: 'Storage Replication',
      prodStatus: 'Critical',
      drStatus: 'Critical',
      replicationLag: '1h 24m',
      lastSync: '15m ago',
      hostFilter: { environment: 'DR' },
    },
    {
      name: 'DR Network Connectivity',
      prodStatus: 'Healthy',
      drStatus: 'Healthy',
      replicationLag: '-',
      lastSync: '1m ago',
      hostFilter: { environment: 'DR' },
    },
  ];

  return {
    hosts,
    problems,
    businessServices,
    drComponents,
    topServers: makeTopServers(),
    utilization: {
      cpu: { avg: 36, critical: 38, warning: 124, normal: 1106 },
      memory: { avg: 48, critical: 52, warning: 176, normal: 1040 },
      disk: { avg: 52, critical: 68, warning: 210, normal: 2481 },
      network: { avg: 28, critical: 22, warning: 86, normal: 2345 },
    },
    kpiDeltas: {
      available: '▲ +7 (24h)',
      unavailable: '▲ +3 (24h)',
      warning: '▼ -5 (24h)',
      critical: '▲ +6 (24h)',
    },
  };
}

export function matchesFilters(host: Host, filters: Filters): boolean {
  return (
    (filters.environment === 'All' || host.environment === filters.environment) &&
    (filters.tier === 'All' || host.tier === filters.tier) &&
    (filters.hostGroup === 'All' || host.hostGroup === filters.hostGroup) &&
    (filters.os === 'All' || host.os === filters.os) &&
    (filters.businessService === 'All' || host.businessService === filters.businessService)
  );
}
