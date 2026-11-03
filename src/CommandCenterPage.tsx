import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BusinessServicesTable,
  DrTable,
  FilterOptions,
  FreshnessPanel,
  GroupGrids,
  Header,
  Kpi,
  ProblemsTable,
  TopServersPanel,
  UtilCard,
} from './components';
import { HostDetailModal } from './HostDetailModal';
import { buildSampleData, emptySampleData, matchesFilters } from './data/sampleData';
import {
  appSubUrl,
  DEFAULT_ZABBIX_CONFIG,
  isGrafanaHosted,
  loadZabbixConfig,
  resolveSource,
  ZabbixConfig,
} from './data/config';
import { fetchZabbixData, LiveResult } from './data/zabbixData';
import { CSS } from './styles';
import {
  BusinessServiceRow,
  DrRow,
  Filters,
  FleetAverage,
  GroupSummary,
  Host,
  ResourceKey,
  SeverityGroup,
  Tier,
} from './types';

const ALL = 'All';

const ALL_FILTERS: Filters = {
  environment: ALL,
  tier: ALL,
  hostGroup: ALL,
  os: ALL,
  businessService: ALL,
};

const TIER_SUBTITLE: Record<Tier, string> = {
  'Tier 1': 'Core Banking',
  'Tier 2': 'Business Critical',
  'Tier 3': 'Supporting',
};

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (n: number) => `${n.toFixed(1)}%`;

function initialFilters(): Filters {
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const pick = (key: string, allowed?: string[]) => {
    const value = params ? params.get(key) : null;
    return value && (!allowed || allowed.includes(value)) ? value : ALL;
  };
  return {
    environment: pick('environment', ['PROD', 'DR', 'UAT']),
    tier: pick('tier', ['Tier 1', 'Tier 2', 'Tier 3']),
    hostGroup: pick('hostGroup'),
    os: pick('os'),
    businessService: pick('businessService'),
  };
}

function urlRequestedSource(): string | null {
  return typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('source')
    : null;
}

function initialSource(canGoLive: boolean): 'sample' | 'live' {
  if (!canGoLive || typeof window === 'undefined') {
    return 'sample';
  }
  return urlRequestedSource() === 'live' ? 'live' : 'sample';
}

/**
 * A URL with source=sample was produced while sample data was available. Once an
 * administrator disables sample data, its filter parameters (for example
 * businessService=Treasury from a sample drill-down) are stale and would hide every
 * live host, so they must not be applied.
 */
function isStaleSampleLink(config?: ZabbixConfig): boolean {
  return !!config && !config.sampleDataEnabled && urlRequestedSource() === 'sample';
}

export function CommandCenterPage({ initialConfig }: { initialConfig?: ZabbixConfig } = {}) {
  const sample = useMemo(() => buildSampleData(), []);
  const empty = useMemo(() => emptySampleData(), []);
  const canGoLive = useMemo(() => isGrafanaHosted(), []);
  const [sampleEnabled, setSampleEnabled] = useState(initialConfig ? initialConfig.sampleDataEnabled : true);
  const [source, setSource] = useState<'sample' | 'live'>(() => {
    const requested = initialSource(canGoLive);
    const preferred =
      requested === 'live' || (initialConfig && initialConfig.defaultSource === 'live')
        ? 'live'
        : requested;
    return resolveSource(
      preferred,
      canGoLive,
      initialConfig ? initialConfig.sampleDataEnabled : true
    );
  });
  const [live, setLive] = useState<LiveResult | null>(null);
  const [liveState, setLiveState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveTick, setLiveTick] = useState(0);
  const [refreshSeconds, setRefreshSeconds] = useState(
    initialConfig ? initialConfig.refreshSeconds : DEFAULT_ZABBIX_CONFIG.refreshSeconds
  );
  const sourceTouched = useRef(false);
  const staleFiltersCleared = useRef(isStaleSampleLink(initialConfig));
  const [filters, setFilters] = useState<Filters>(() =>
    staleFiltersCleared.current ? { ...ALL_FILTERS } : initialFilters()
  );
  const [now, setNow] = useState(new Date());
  const [resource, setResource] = useState<ResourceKey>('cpu');
  const [problemTab, setProblemTab] = useState<SeverityGroup | 'All'>('All');
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Read the configurable wiring from Grafana plugin settings.
  useEffect(() => {
    if (!canGoLive) {
      return;
    }
    let cancelled = false;
    loadZabbixConfig()
      .then((config) => {
        if (cancelled) {
          return;
        }
        setRefreshSeconds(config.refreshSeconds);
        setSampleEnabled(config.sampleDataEnabled);
        if (!config.sampleDataEnabled) {
          // Live-only mode: ignore any sample request (URL or header state).
          sourceTouched.current = true;
          setSource('live');
          if (!staleFiltersCleared.current && isStaleSampleLink(config)) {
            staleFiltersCleared.current = true;
            setFilters({ ...ALL_FILTERS });
          }
        } else if (!sourceTouched.current && config.defaultSource === 'live') {
          setSource('live');
        }
      })
      .catch(() => {
        // keep the built-in defaults
      });
    return () => {
      cancelled = true;
    };
  }, [canGoLive]);

  const onSource = (next: 'sample' | 'live') => {
    sourceTouched.current = true;
    setSource(next);
  };

  useEffect(() => {
    if (source !== 'live') {
      return;
    }
    const timer = window.setInterval(() => setLiveTick((t) => t + 1), refreshSeconds * 1000);
    return () => window.clearInterval(timer);
  }, [source, refreshSeconds]);

  useEffect(() => {
    if (source !== 'live') {
      return;
    }
    let cancelled = false;
    setLiveState('loading');
    setLiveError(null);
    fetchZabbixData()
      .then((result) => {
        if (!cancelled) {
          setLive(result);
          setLiveState('ready');
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setLiveError(err.message || 'Unable to reach the Zabbix API');
          setLiveState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [source, liveTick]);

  const data = source === 'live' && live ? live.data : sampleEnabled ? sample : empty;
  const effectiveSource: 'sample' | 'live' = resolveSource(
    source === 'live' && live ? 'live' : 'sample',
    canGoLive,
    sampleEnabled
  );
  const connection: 'sample' | 'loading' | 'ready' | 'error' =
    source !== 'live' ? 'sample' : liveState === 'ready' ? 'ready' : liveState === 'error' ? 'error' : 'loading';

  const filtersInitialised = useRef(false);
  useEffect(() => {
    if (!filtersInitialised.current) {
      filtersInitialised.current = true;
      return;
    }
    setFilters({ environment: ALL, tier: ALL, hostGroup: ALL, os: ALL, businessService: ALL });
  }, [source]);

  const options: FilterOptions = useMemo(() => {
    const envOrder: Array<{ value: string; label: string }> = [
      { value: 'PROD', label: 'PROD' },
      { value: 'DR', label: 'DR' },
      { value: 'UAT', label: 'DEV / UAT' },
    ];
    const groupOrder = ['Production', 'Disaster Recovery', 'Development / UAT'];
    const groups = Array.from(new Set(data.hosts.map((h) => h.hostGroup))).sort((a, b) => {
      const ia = groupOrder.indexOf(a);
      const ib = groupOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });
    return {
      environments: envOrder,
      tiers: ['Tier 1', 'Tier 2', 'Tier 3'],
      groups,
      os: Array.from(new Set(data.hosts.map((h) => h.os))).sort(),
      services: data.businessServices.map((s) => s.name),
    };
  }, [data]);

  const onChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredHosts = useMemo(() => data.hosts.filter((h) => matchesFilters(h, filters)), [data.hosts, filters]);
  const hostByHostname = useMemo(() => new Map(data.hosts.map((h) => [h.hostname, h])), [data.hosts]);
  const filteredProblems = useMemo(
    () =>
      data.problems.filter((p) => {
        const h = hostByHostname.get(p.hostname);
        return !!h && matchesFilters(h, filters);
      }),
    [data.problems, hostByHostname, filters]
  );

  const fleet: FleetAverage = useMemo(() => {
    const count = filteredHosts.length;
    const average = (key: 'cpu' | 'memory' | 'disk' | 'network') =>
      count ? filteredHosts.reduce((sum, host) => sum + host[key], 0) / count : 0;
    return {
      cpu: average('cpu'),
      memory: average('memory'),
      disk: average('disk'),
      network: average('network'),
      hosts: count,
    };
  }, [filteredHosts]);

  const activeHost = selectedHost ? data.hosts.find((h) => h.id === selectedHost.id) || null : null;

  const filtersActive = Object.values(filters).some((v) => v !== ALL);

  const total = filteredHosts.length;
  const unavailable = filteredHosts.filter((h) => h.connectivity === 'unavailable').length;
  const maintenance = filteredHosts.filter((h) => h.maintenance).length;
  const stale = filteredHosts.filter((h) => h.stale).length;
  const warning = filteredHosts.filter((h) => h.severity === 'warning').length;
  const critical = filteredHosts.filter((h) => h.severity === 'critical').length;
  const available = filteredHosts.filter(
    (h) => h.connectivity !== 'unavailable' && !h.maintenance && !h.stale
  ).length;
  const totalProblems = filteredProblems.length;
  const unacknowledged = filteredProblems.filter((p) => !p.ack).length;
  const safeTotal = total || 1;
  const safeProblems = totalProblems || 1;

  const utilization = useMemo(() => {
    if (!filtersActive && source === 'sample') {
      return data.utilization;
    }
    const compute = (key: 'cpu' | 'memory' | 'disk' | 'network') => {
      const values = filteredHosts.map((h) => h[key]);
      const avg = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
      return {
        avg,
        critical: values.filter((v) => v >= 90).length,
        warning: values.filter((v) => v >= 70 && v < 90).length,
        normal: values.filter((v) => v < 70).length,
      };
    };
    return {
      cpu: compute('cpu'),
      memory: compute('memory'),
      disk: compute('disk'),
      network: compute('network'),
    };
  }, [data.utilization, filtersActive, filteredHosts, source]);

  const groups: GroupSummary[] = useMemo(() => {
    const defs: Array<{ key: GroupSummary['key']; name: string; panelClass: string }> = [
      { key: 'PROD', name: 'PRODUCTION', panelClass: 'prod' },
      { key: 'DR', name: 'DISASTER RECOVERY', panelClass: 'dr' },
      { key: 'UAT', name: 'DEVELOPMENT / UAT', panelClass: 'uat' },
    ];
    return defs.map((d) => {
      const hosts = filteredHosts.filter((h) => h.environment === d.key);
      const tiers = (['Tier 1', 'Tier 2', 'Tier 3'] as Tier[]).map((tier) => ({
        name: tier,
        subtitle: TIER_SUBTITLE[tier],
        hosts: hosts.filter((h) => h.tier === tier),
      }));
      return {
        ...d,
        total: hosts.length,
        healthy: hosts.filter((h) => h.health === 'healthy').length,
        warning: hosts.filter((h) => h.health === 'warning').length,
        critical: hosts.filter((h) => h.health === 'critical').length,
        stale: hosts.filter((h) => h.health === 'stale').length,
        maintenance: hosts.filter((h) => h.health === 'maintenance').length,
        unavailable: hosts.filter((h) => h.health === 'unavailable').length,
        tiers,
      };
    });
  }, [filteredHosts]);

  const freshness = useMemo(
    () => ({
      upToDate: filteredHosts.filter((h) => h.dataState === 'upToDate').length,
      stale: filteredHosts.filter((h) => h.dataState === 'stale').length,
      noData: filteredHosts.filter((h) => h.dataState === 'noData').length,
      notMonitored: filteredHosts.filter((h) => h.dataState === 'notMonitored').length,
    }),
    [filteredHosts]
  );

  const serviceRows = useMemo(
    () =>
      data.businessServices.filter((row) => {
        if (filters.businessService !== ALL && row.name !== filters.businessService) {
          return false;
        }
        if (filters.environment === 'PROD') {
          return row.env.includes('PROD') || row.env === 'Mixed';
        }
        if (filters.environment === 'DR') {
          return row.env.includes('DR') || row.env === 'Mixed';
        }
        if (filters.environment === 'UAT') {
          return row.env.includes('UAT') || row.env === 'Mixed';
        }
        return true;
      }),
    [data.businessServices, filters.businessService, filters.environment]
  );

  const topServers = useMemo(() => {
    if (source === 'live') {
      return data.topServers.filter((r) => {
        const h = hostByHostname.get(r.hostname);
        return !h || matchesFilters(h, filters);
      });
    }
    const groupEnv =
      filters.hostGroup === 'Production'
        ? 'PROD'
        : filters.hostGroup === 'Disaster Recovery'
        ? 'DR'
        : filters.hostGroup === 'Development / UAT'
        ? 'UAT'
        : null;
    return data.topServers.filter(
      (r) =>
        (filters.environment === ALL || r.environment === filters.environment) &&
        (filters.tier === ALL || r.tier === filters.tier) &&
        (!groupEnv || r.environment === groupEnv) &&
        (filters.os === ALL || r.os === filters.os) &&
        (filters.businessService === ALL || r.businessService === filters.businessService)
    );
  }, [data.topServers, filters, source, hostByHostname]);

  const inventoryHrefFor = (scope: string, filterSet: Filters, host?: string): string | undefined => {
    if (!canGoLive) {
      return undefined;
    }
    const params = new URLSearchParams({ scope, source: effectiveSource });
    if (host) {
      params.set('host', host);
    }
    (Object.keys(filterSet) as Array<keyof Filters>).forEach((key) => {
      if (filterSet[key] !== ALL) {
        params.set(key, filterSet[key]);
      }
    });
    return `${appSubUrl()}/a/acme-command-center-app/servers?${params.toString()}`;
  };

  const drillHref = (scope: string, host?: string): string | undefined =>
    inventoryHrefFor(scope, filters, host);

  const serviceDrillHref = (row: BusinessServiceRow): string | undefined => {
    const environment =
      row.env === 'PROD' || row.env === 'DR' || row.env === 'UAT' ? row.env : ALL;
    return inventoryHrefFor('total', {
      environment,
      tier: ALL,
      hostGroup: ALL,
      os: ALL,
      businessService: row.name,
    });
  };

  const drDrillHref = (row: DrRow): string | undefined =>
    inventoryHrefFor('total', {
      environment: ALL,
      tier: ALL,
      hostGroup: ALL,
      os: ALL,
      businessService: ALL,
      ...(row.hostFilter || {}),
    });

  const problemCounts: Record<SeverityGroup | 'All', number> = useMemo(
    () => ({
      All: filteredProblems.length,
      Critical: filteredProblems.filter((p) => p.severityGroup === 'Critical').length,
      Warning: filteredProblems.filter((p) => p.severityGroup === 'Warning').length,
      Info: filteredProblems.filter((p) => p.severityGroup === 'Info').length,
    }),
    [filteredProblems]
  );

  return (
    <div className="cc-app">
      <style>{CSS}</style>
      <Header
        filters={filters}
        onChange={onChange}
        options={options}
        now={now}
        source={source}
        onSource={onSource}
        connection={connection}
        version={live?.version}
        hostCount={live?.data.hosts.length}
        lastSync={live?.fetchedAt.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Singapore' })}
        canGoLive={canGoLive}
        sampleEnabled={sampleEnabled}
      />

      {source === 'live' && connection === 'error' ? (
        <div className="cc-banner">
          <strong>ZABBIX UNREACHABLE</strong>
          <span>{liveError || 'Unable to reach the Zabbix API.'}</span>
          <span className="cc-muted" style={{ marginLeft: 'auto' }}>
            {live ? 'Showing last successful sync' : sampleEnabled ? 'Showing sample data' : 'No live data available'}
          </span>
        </div>
      ) : null}

      {source === 'live' && live && data.hosts.length > 0 && filtersActive && filteredHosts.length === 0 ? (
        <div className="cc-banner warn">
          <strong>NO SERVERS MATCH FILTERS</strong>
          <span>
            Active filters exclude all {fmt(data.hosts.length)} live server
            {data.hosts.length === 1 ? '' : 's'}.
          </span>
          <button type="button" className="cc-banner-btn" onClick={() => setFilters({ ...ALL_FILTERS })}>
            Clear filters
          </button>
        </div>
      ) : null}

      <div className="cc-kpis">
        <Kpi
          icon="server"
          label="TOTAL SERVERS"
          value={fmt(total)}
          sub={filtersActive ? 'Filtered inventory' : 'Monitored inventory'}
          tone="blue"
          href={drillHref('total')}
        />
        <Kpi
          icon="check"
          label="AVAILABLE"
          value={fmt(available)}
          sub={pct((available / safeTotal) * 100)}
          delta={data.kpiDeltas.available}
          deltaTone="good"
          tone="green"
          href={drillHref('available')}
        />
        <Kpi
          icon="x"
          label="UNAVAILABLE"
          value={fmt(unavailable)}
          sub={pct((unavailable / safeTotal) * 100)}
          delta={data.kpiDeltas.unavailable}
          deltaTone="bad"
          tone="red"
          href={drillHref('unavailable')}
        />
        <Kpi
          icon="alert"
          label="WARNING"
          value={fmt(warning)}
          sub={pct((warning / safeTotal) * 100)}
          delta={data.kpiDeltas.warning}
          deltaTone="good"
          tone="yellow"
          href={drillHref('warning')}
        />
        <Kpi
          icon="alert"
          label="CRITICAL"
          value={fmt(critical)}
          sub={pct((critical / safeTotal) * 100)}
          delta={data.kpiDeltas.critical}
          deltaTone="bad"
          tone="red"
          href={drillHref('critical')}
        />
        <Kpi
          icon="bell"
          label="TOTAL PROBLEMS"
          value={fmt(totalProblems)}
          sub={`${fmt(unacknowledged)} unacknowledged`}
          tone="purple"
          href={drillHref('problems')}
        />
        <Kpi
          icon="bell-off"
          label="UNACKNOWLEDGED"
          value={fmt(unacknowledged)}
          sub={pct((unacknowledged / safeProblems) * 100)}
          tone="orange"
          href={drillHref('unacknowledged')}
        />
        <Kpi
          icon="wrench"
          label="IN MAINTENANCE"
          value={fmt(maintenance)}
          sub={pct((maintenance / safeTotal) * 100)}
          tone="blue"
          href={drillHref('maintenance')}
        />
        <Kpi
          icon="db"
          label="STALE / NO DATA"
          value={fmt(stale)}
          sub={pct((stale / safeTotal) * 100)}
          tone="gray"
          href={drillHref('stale')}
        />
      </div>

      <div className="cc-util-row">
        <UtilCard
          title="CPU Utilisation (All Servers)"
          sub="All Servers"
          avg={utilization.cpu.avg}
          critical={utilization.cpu.critical}
          warning={utilization.cpu.warning}
          normal={utilization.cpu.normal}
          accent="#2f9bff"
        />
        <UtilCard
          title="Memory Utilisation (All Servers)"
          sub="All Servers"
          avg={utilization.memory.avg}
          critical={utilization.memory.critical}
          warning={utilization.memory.warning}
          normal={utilization.memory.normal}
          accent="#8b5cf6"
        />
        <UtilCard
          title="Disk Utilisation (All Filesystems)"
          sub="All Filesystems"
          avg={utilization.disk.avg}
          critical={utilization.disk.critical}
          warning={utilization.disk.warning}
          normal={utilization.disk.normal}
          accent="#00d47e"
        />
        <UtilCard
          title="Network Utilisation (All Interfaces)"
          sub="All Interfaces"
          avg={utilization.network.avg}
          critical={utilization.network.critical}
          warning={utilization.network.warning}
          normal={utilization.network.normal}
          accent="#00d4ff"
        />
      </div>

      <GroupGrids groups={groups} onSelect={setSelectedHost} />

      <div className="cc-bottom">
        <BusinessServicesTable rows={serviceRows} href={serviceDrillHref} />
        <DrTable rows={data.drComponents} href={drDrillHref} />
        <FreshnessPanel counts={freshness} total={total} />
        <TopServersPanel rows={topServers} resource={resource} onResource={setResource} />
      </div>

      <ProblemsTable
        problems={filteredProblems}
        tab={problemTab}
        onTab={setProblemTab}
        counts={problemCounts}
        source={effectiveSource}
        refreshSeconds={refreshSeconds}
      />

      {activeHost ? (
        <HostDetailModal
          host={activeHost}
          problems={data.problems}
          fleet={fleet}
          source={effectiveSource}
          inventoryHref={drillHref('total', activeHost.hostname)}
          onClose={() => setSelectedHost(null)}
        />
      ) : null}
    </div>
  );
}
