export type Environment = 'PROD' | 'DR' | 'UAT';
export type Tier = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type Health = 'healthy' | 'warning' | 'critical' | 'stale' | 'maintenance' | 'unavailable';
export type Severity = 'Critical' | 'High' | 'Warning' | 'Info';
export type SeverityGroup = 'Critical' | 'Warning' | 'Info';
export type SlaState = 'Within SLA' | 'At Risk' | 'Breaching' | 'Not tracked';
export type ResourceKey = 'cpu' | 'memory' | 'disk';

export interface Host {
  id: number;
  hostname: string;
  environment: Environment;
  hostGroup: string;
  tier: Tier;
  os: string;
  businessService: string;
  health: Health;
  connectivity: 'available' | 'unavailable';
  severity: 'critical' | 'warning' | null;
  maintenance: boolean;
  stale: boolean;
  lastSeenMin: number;
  dataState: 'upToDate' | 'stale' | 'noData' | 'notMonitored';
  drRole: 'Primary' | 'DR' | 'N/A';
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

export interface Problem {
  id: number;
  time: string;
  minutesAgo: number;
  severity: Severity;
  severityGroup: SeverityGroup;
  hostname: string;
  environment: Environment;
  tier: Tier;
  businessService: string;
  problem: string;
  currentValue: string;
  threshold: string;
  duration: string;
  sla: SlaState;
  ack: boolean;
  maintenance: boolean;
  related: string;
}

export interface BusinessServiceRow {
  name: string;
  env: string;
  servers: number;
  status: 'Critical' | 'High' | 'Warning' | 'Healthy';
  activeProblems: number;
}

export interface DrRow {
  name: string;
  prodStatus: 'Healthy' | 'Warning' | 'Critical';
  drStatus: 'Healthy' | 'Warning' | 'Critical';
  replicationLag: string;
  lastSync: string;
  /** Host attributes that define the servers behind this DR component. */
  hostFilter?: Partial<Filters>;
}

export interface TopServerRow {
  rank: number;
  hostname: string;
  environment: Environment;
  tier: Tier;
  os: string;
  businessService: string;
  cpu: number;
  memory: number;
  disk: number;
  trends: Record<ResourceKey, number[]>;
}

export interface UtilizationStat {
  avg: number;
  critical: number;
  warning: number;
  normal: number;
}

export interface SampleData {
  hosts: Host[];
  problems: Problem[];
  businessServices: BusinessServiceRow[];
  drComponents: DrRow[];
  topServers: TopServerRow[];
  utilization: Record<'cpu' | 'memory' | 'disk' | 'network', UtilizationStat>;
  kpiDeltas: { available: string; unavailable: string; warning: string; critical: string };
}

export interface Filters {
  environment: string;
  tier: string;
  hostGroup: string;
  os: string;
  businessService: string;
}

export interface FilesystemUsage {
  mount: string;
  used: number;
}

export interface HostDetail {
  filesystems: FilesystemUsage[];
  trends: Partial<Record<'cpu' | 'memory' | 'disk' | 'network', number[]>>;
  source: 'sample' | 'live';
  partial?: boolean;
  note: string;
}

export type HistoryMetric = 'cpu' | 'memory' | 'disk' | 'network';
export type HistoryRangeKey = '6h' | '24h' | '7d' | '30d' | '90d' | '6m';

export interface HistoryPoint {
  /** Unix timestamp in seconds. */
  t: number;
  v: number;
}

export interface FilesystemHistory {
  mount: string;
  points: HistoryPoint[];
}

export interface HostHistory {
  range: HistoryRangeKey;
  from: number;
  to: number;
  series: Partial<Record<HistoryMetric, HistoryPoint[]>>;
  filesystems: FilesystemHistory[];
  source: 'sample' | 'live';
  partial?: boolean;
  note: string;
}

export interface FleetAverage {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  hosts: number;
}

export interface TierGroup {
  name: Tier;
  subtitle: string;
  hosts: Host[];
}

export interface GroupSummary {
  key: Environment;
  name: string;
  panelClass: string;
  total: number;
  healthy: number;
  warning: number;
  critical: number;
  stale: number;
  maintenance: number;
  unavailable: number;
  tiers: TierGroup[];
}
