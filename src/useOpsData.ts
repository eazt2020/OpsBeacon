import { useEffect, useMemo, useRef, useState } from 'react';
import type { FilterOptions } from './components';
import {
  appSubUrl,
  DEFAULT_ZABBIX_CONFIG,
  isGrafanaHosted,
  loadZabbixConfig,
  MotionPreference,
  resolveSource,
  ZabbixConfig,
} from './data/config';
import { fetchLiveData } from './data/liveData';
import { buildSampleData, emptySampleData, matchesFilters } from './data/sampleData';
import { LiveResult } from './data/zabbixData';
import { Filters, FleetAverage, GroupSummary, Tier } from './types';

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

/**
 * Shared data plumbing for the Command Center dashboards: sample/live source,
 * Grafana plugin configuration, filters and the derived fleet counts.
 */
export function useOpsData(initialConfig?: ZabbixConfig) {
  const sample = useMemo(() => buildSampleData(), []);
  const empty = useMemo(() => emptySampleData(), []);
  const canGoLive = useMemo(() => isGrafanaHosted(), []);
  const [sampleEnabled, setSampleEnabled] = useState(
    initialConfig ? initialConfig.sampleDataEnabled : true
  );
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
  const liveRef = useRef<LiveResult | null>(null);
  // Guards against stacking refresh cycles. With a short interval (for example
  // 15 s) a slow Zabbix response would otherwise start a second full fetch
  // before the first one finishes; left open for hours that accumulates
  // in-flight requests and payloads until the tab runs out of memory.
  const fetchingRef = useRef(false);
  const [refreshSeconds, setRefreshSeconds] = useState(
    initialConfig ? initialConfig.refreshSeconds : DEFAULT_ZABBIX_CONFIG.refreshSeconds
  );
  const [brandName, setBrandName] = useState(
    initialConfig ? initialConfig.brandName : DEFAULT_ZABBIX_CONFIG.brandName
  );
  const [brandTagline, setBrandTagline] = useState(
    initialConfig ? initialConfig.brandTagline : DEFAULT_ZABBIX_CONFIG.brandTagline
  );
  const [logoUrl, setLogoUrl] = useState(
    initialConfig ? initialConfig.logoUrl : DEFAULT_ZABBIX_CONFIG.logoUrl
  );
  const [motion, setMotion] = useState<MotionPreference>(
    initialConfig ? initialConfig.motion : DEFAULT_ZABBIX_CONFIG.motion
  );
  const sourceTouched = useRef(false);
  const staleFiltersCleared = useRef(isStaleSampleLink(initialConfig));
  // Filters are session state only: returning from a drill-down or reloading
  // the page starts from an unfiltered fleet. The inventory deep link still
  // carries filters in its own URL.
  const [filters, setFilters] = useState<Filters>(() => ({ ...ALL_FILTERS }));

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
        setBrandName(config.brandName);
        setBrandTagline(config.brandTagline);
        setLogoUrl(config.logoUrl);
        setMotion(config.motion);
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
    if (source !== 'live' || fetchingRef.current) {
      return;
    }
    let cancelled = false;
    fetchingRef.current = true;
    // Background refreshes keep the previous snapshot on screen and the header
    // in its LIVE state; only a cold start shows the loading state.
    if (!liveRef.current) {
      setLiveState('loading');
    }
    setLiveError(null);
    fetchLiveData()
      .then((result) => {
        if (!cancelled) {
          liveRef.current = result;
          setLive(result);
          setLiveState('ready');
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setLiveError(err.message || 'Unable to reach the Zabbix API');
          setLiveState('error');
        }
      })
      .finally(() => {
        fetchingRef.current = false;
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
    source !== 'live'
      ? 'sample'
      : liveState === 'ready'
      ? 'ready'
      : liveState === 'error'
      ? 'error'
      : 'loading';

  const filtersInitialised = useRef(false);
  useEffect(() => {
    if (!filtersInitialised.current) {
      filtersInitialised.current = true;
      return;
    }
    setFilters({ ...ALL_FILTERS });
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

  const filteredHosts = useMemo(
    () => data.hosts.filter((h) => matchesFilters(h, filters)),
    [data.hosts, filters]
  );
  const hostByHostname = useMemo(
    () => new Map(data.hosts.map((h) => [h.hostname, h])),
    [data.hosts]
  );
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

  const filtersActive = Object.values(filters).some((v) => v !== ALL);

  // The KPI strip touches every host and problem. Counting them in one pass keeps
  // this off the critical path when the page re-renders for unrelated state such
  // as opening the host drawer or switching a problem tab.
  const counts = useMemo(() => {
    let unavailable = 0;
    let maintenance = 0;
    let stale = 0;
    let warning = 0;
    let critical = 0;
    let available = 0;
    for (const host of filteredHosts) {
      const down = host.connectivity === 'unavailable';
      if (down) unavailable += 1;
      if (host.maintenance) maintenance += 1;
      if (host.stale) stale += 1;
      if (host.severity === 'warning') warning += 1;
      if (host.severity === 'critical') critical += 1;
      if (!down && !host.maintenance && !host.stale) available += 1;
    }
    let unacknowledged = 0;
    for (const problem of filteredProblems) {
      if (!problem.ack) unacknowledged += 1;
    }
    return {
      total: filteredHosts.length,
      unavailable,
      maintenance,
      stale,
      warning,
      critical,
      available,
      totalProblems: filteredProblems.length,
      unacknowledged,
    };
  }, [filteredHosts, filteredProblems]);

  const { total, unavailable, maintenance, stale, warning, critical, available, totalProblems, unacknowledged } = counts;

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

  const problemCounts = useMemo(
    () => ({
      All: filteredProblems.length,
      Critical: filteredProblems.filter((p) => p.severityGroup === 'Critical').length,
      Warning: filteredProblems.filter((p) => p.severityGroup === 'Warning').length,
      Info: filteredProblems.filter((p) => p.severityGroup === 'Info').length,
    }),
    [filteredProblems]
  );

  const inventoryHrefFor = (scope: string, filterSet: Filters, host?: string): string | undefined => {
    if (!canGoLive) {
      return undefined;
    }
    const params = new URLSearchParams({ scope, source: effectiveSource });
    if (host) {
      params.set('host', host);
    }
    // Remember which dashboard opened the inventory so its back link returns
    // to the Data Center Ops page rather than always to the Command Center.
    const onDataCenter =
      typeof window !== 'undefined' && /\/data-center\/?$/.test(window.location.pathname);
    if (onDataCenter) {
      params.set('from', 'data-center');
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

  return {
    sampleEnabled,
    source,
    onSource,
    live,
    liveState,
    liveError,
    connection,
    refreshSeconds,
    brandName,
    brandTagline,
    logoUrl,
    motion,
    canGoLive,
    filters,
    setFilters,
    onChange,
    options,
    data,
    effectiveSource,
    filteredHosts,
    filteredProblems,
    hostByHostname,
    fleet,
    groups,
    utilization,
    filtersActive,
    total,
    available,
    unavailable,
    maintenance,
    stale,
    warning,
    critical,
    totalProblems,
    unacknowledged,
    problemCounts,
    inventoryHrefFor,
    drillHref,
  };
}
