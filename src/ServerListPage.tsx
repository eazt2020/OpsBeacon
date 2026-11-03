import React, { useEffect, useMemo, useRef, useState } from 'react';
import { buildSampleData, matchesFilters } from './data/sampleData';
import { appSubUrl, isGrafanaHosted, loadZabbixConfig, resolveSource, ZabbixConfig } from './data/config';
import { fetchZabbixData, LiveResult } from './data/zabbixData';
import { CSS } from './styles';
import { Filters, Health, Host, Problem } from './types';

const ALL = 'All';
const PAGE_SIZES = [25, 50, 100, 250];

const ALL_FILTERS: Filters = {
  environment: ALL,
  tier: ALL,
  hostGroup: ALL,
  os: ALL,
  businessService: ALL,
};

type Scope =
  | 'total'
  | 'available'
  | 'unavailable'
  | 'warning'
  | 'critical'
  | 'problems'
  | 'unacknowledged'
  | 'maintenance'
  | 'stale';

const SCOPE_META: Record<Scope, { title: string; blurb: string; problems?: 'all' | 'unack' }> = {
  total: { title: 'All monitored servers', blurb: 'Every monitored host matching the active filters.' },
  available: {
    title: 'Available servers',
    blurb: 'Servers that are not unavailable, not in maintenance and not stale.',
  },
  unavailable: {
    title: 'Unavailable servers',
    blurb: 'The host or one of its interfaces is reported as unavailable by Zabbix.',
  },
  warning: {
    title: 'Servers in warning',
    blurb: 'The highest active trigger priority is Warning or Average (2–3).',
  },
  critical: {
    title: 'Servers in critical',
    blurb: 'The highest active trigger priority is High or Disaster (4–5).',
  },
  problems: {
    title: 'Servers with active problems',
    blurb: 'Servers with at least one active Zabbix problem.',
    problems: 'all',
  },
  unacknowledged: {
    title: 'Servers with unacknowledged problems',
    blurb: 'Servers with at least one active problem that has not been acknowledged.',
    problems: 'unack',
  },
  maintenance: { title: 'Servers in maintenance', blurb: 'Hosts currently inside a Zabbix maintenance window.' },
  stale: {
    title: 'Servers with stale / no data',
    blurb: 'Newest item value is 5–10 minutes old (stale) or older than 10 minutes (no data).',
  },
};

const HEALTH_CLASS: Record<Health, string> = {
  healthy: 'cc-h-healthy',
  warning: 'cc-h-warning',
  critical: 'cc-h-critical',
  stale: 'cc-h-stale',
  maintenance: 'cc-h-maintenance',
  unavailable: 'cc-h-unavailable',
};

const DATA_STATE_LABEL: Record<Host['dataState'], string> = {
  upToDate: 'Up to date',
  stale: 'Stale',
  noData: 'No data',
  notMonitored: 'Not monitored',
};

const SRV_CSS = `
.cc-srv { padding-top: 18px; }
.cc-srv-head { display: flex; gap: 14px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 14px; }
.cc-srv-back {
  display: inline-flex; align-items: center; gap: 5px; color: #7fc4ff; text-decoration: none;
  font-size: 11px; padding: 6px 9px; border: 1px solid #1c314e; border-radius: 5px;
  background: #0b1728; white-space: nowrap;
}
.cc-srv-back:hover { border-color: #2b6ca3; color: #fff; }
.cc-srv-titles { min-width: 240px; }
.cc-srv-title { font-size: 20px; font-weight: 800; letter-spacing: 0.5px; line-height: 1; }
.cc-srv-sub { font-size: 10px; color: #8ea3bf; margin-top: 6px; max-width: 760px; }
.cc-srv-sub strong { color: #dbe7f5; }
.cc-srv-actions { margin-left: auto; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.cc-srv-btn {
  appearance: none; font-family: inherit; cursor: pointer; font-size: 9.5px; font-weight: 700;
  color: #dbe7f5; background: #0b1728; border: 1px solid #1c314e; border-radius: 5px;
  padding: 6px 10px; letter-spacing: 0.2px;
}
.cc-srv-btn:hover { border-color: #2b6ca3; background: #10233a; }
.cc-srv-btn:disabled { opacity: 0.5; cursor: default; }
.cc-srv-badge {
  font-size: 8px; font-weight: 800; letter-spacing: 0.6px; padding: 3px 7px;
  border-radius: 3px; border: 1px solid #1c314e; color: #8ea3bf;
}
.cc-srv-badge.live { color: #00e676; border-color: #1c4a36; background: rgba(0, 230, 118, 0.08); }
.cc-srv-badge.sample { color: #ffc107; border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); }
.cc-srv-filters { display: flex; gap: 9px; align-items: flex-end; flex-wrap: wrap; margin-bottom: 10px; }
.cc-srv-search { min-width: 230px; }
.cc-srv-search label { display: block; font-size: 8px; text-transform: uppercase; letter-spacing: 0.7px; color: #7f95b2; margin-bottom: 3px; }
.cc-srv-search input {
  width: 100%; background: #0b1627; border: 1px solid #203554; color: #dbe7f5;
  border-radius: 5px; padding: 5px 7px; font-size: 10.5px; outline: none; font-family: inherit;
}
.cc-srv-search input:focus { border-color: #2b6ca3; box-shadow: 0 0 0 2px rgba(43, 108, 163, 0.18); }
.cc-srv-hostchip {
  display: inline-flex; align-items: center; gap: 5px; font-size: 9px; color: #9db0c9;
  background: #0b1728; border: 1px solid #24405f; border-radius: 5px;
  padding: 5px 6px 5px 8px;
}
.cc-srv-hostchip strong { color: #dbe7f5; }
.cc-srv-hostchip button {
  appearance: none; border: 0; background: transparent; color: #7fc4ff; cursor: pointer;
  font-size: 13px; line-height: 1; padding: 0 2px; font-family: inherit;
}
.cc-srv-table { font-size: 9.5px; }
.cc-srv-table td { padding: 5px 7px; }
.cc-srv-table .hostname { color: #e6f0fb; font-weight: 700; }
.cc-srv-health { font-weight: 800; font-size: 8.3px; text-transform: uppercase; letter-spacing: 0.2px; }
.cc-h-healthy { color: #00d47e; }
.cc-h-warning { color: #ffc107; }
.cc-h-critical { color: #ff4d67; }
.cc-h-stale { color: #8ea3bf; }
.cc-h-maintenance { color: #5fb0ff; }
.cc-h-unavailable { color: #ff8a3d; }
.cc-srv-util { text-align: right; font-variant-numeric: tabular-nums; }
.cc-srv-util.hot { color: #ff4d67; font-weight: 700; }
.cc-srv-util.warm { color: #ffc107; }
.cc-srv-problem { max-width: 300px; overflow: hidden; text-overflow: ellipsis; }
.cc-srv-pager {
  display: flex; align-items: center; gap: 10px; justify-content: flex-end; flex-wrap: wrap;
  padding: 7px 10px; border-top: 1px solid #14253c; color: #8ea3bf; font-size: 9px;
}
.cc-srv-pager select {
  background: #0b1627; border: 1px solid #203554; color: #dbe7f5; border-radius: 5px;
  padding: 3px 6px; font-size: 9px; font-family: inherit; cursor: pointer;
}
.cc-srv-empty { padding: 34px 20px; text-align: center; color: #8ea3bf; font-size: 11px; }
.cc-srv-error { color: #ffb3bf; }
`;

function queryParam(query: Record<string, unknown> | undefined, key: string): string | null {
  const value = query ? query[key] : undefined;
  if (Array.isArray(value)) {
    return value.length ? String(value[0]) : null;
  }
  if (value !== undefined && value !== null) {
    return String(value);
  }
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search).get(key);
  }
  return null;
}

function parseScope(value: string | null): Scope {
  return value && Object.prototype.hasOwnProperty.call(SCOPE_META, value) ? (value as Scope) : 'total';
}

function parseFilters(query: Record<string, unknown> | undefined): Filters {
  const pick = (key: string, allowed?: string[]) => {
    const value = queryParam(query, key);
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

function isUnavailable(host: Host): boolean {
  return host.connectivity === 'unavailable';
}

function inScope(host: Host, scope: Scope, problems: Problem[]): boolean {
  switch (scope) {
    case 'total':
      return true;
    case 'available':
      return !isUnavailable(host) && !host.maintenance && !host.stale;
    case 'unavailable':
      return isUnavailable(host);
    case 'warning':
      return host.severity === 'warning';
    case 'critical':
      return host.severity === 'critical';
    case 'problems':
      return problems.length > 0;
    case 'unacknowledged':
      return problems.some((p) => !p.ack);
    case 'maintenance':
      return host.maintenance;
    case 'stale':
      return host.stale;
    default:
      return true;
  }
}

function utilClass(value: number): string {
  if (value >= 90) {
    return 'cc-srv-util hot';
  }
  if (value >= 70) {
    return 'cc-srv-util warm';
  }
  return 'cc-srv-util';
}

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function ServerListPage({
  query,
  initialConfig,
}: {
  query?: Record<string, unknown>;
  initialConfig?: ZabbixConfig;
}) {
  const scope = useMemo(() => parseScope(queryParam(query, 'scope')), [query]);
  const requestedSource = queryParam(query, 'source') === 'live' ? 'live' : 'sample';
  const canGoLive = useMemo(() => isGrafanaHosted(), []);
  const [sampleEnabled, setSampleEnabled] = useState(
    initialConfig ? initialConfig.sampleDataEnabled : true
  );

  useEffect(() => {
    if (!canGoLive) {
      return;
    }
    let cancelled = false;
    loadZabbixConfig()
      .then((config) => {
        if (!cancelled) {
          setSampleEnabled(config.sampleDataEnabled);
        }
      })
      .catch(() => {
        // keep the sample-enabled default
      });
    return () => {
      cancelled = true;
    };
  }, [canGoLive]);

  const source = resolveSource(requestedSource, canGoLive, sampleEnabled);

  const sample = useMemo(() => buildSampleData(), []);
  const [live, setLive] = useState<LiveResult | null>(null);
  const [liveState, setLiveState] = useState<'loading' | 'ready' | 'error'>(
    source === 'live' ? 'loading' : 'ready'
  );
  const [liveError, setLiveError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

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
  }, [source, tick]);

  const data = source === 'live' ? (live ? live.data : null) : sample;

  // A sample-mode inventory link carries sample-specific filters. When sample data is
  // disabled those filters would hide the live hosts, so ignore them.
  const staleSampleLink = useRef(
    requestedSource === 'sample' && !(initialConfig ? initialConfig.sampleDataEnabled : true)
  );
  const [filters, setFilters] = useState<Filters>(() =>
    staleSampleLink.current ? { ...ALL_FILTERS } : parseFilters(query)
  );
  const [hostFilter, setHostFilter] = useState<string | null>(() =>
    staleSampleLink.current ? null : queryParam(query, 'host')
  );

  useEffect(() => {
    if (!sampleEnabled && requestedSource === 'sample' && !staleSampleLink.current) {
      staleSampleLink.current = true;
      setFilters({ ...ALL_FILTERS });
      setHostFilter(null);
    }
  }, [sampleEnabled, requestedSource]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const hosts = data ? data.hosts : [];
  const problems = data ? data.problems : [];

  const filteredHosts = useMemo(() => hosts.filter((h) => matchesFilters(h, filters)), [hosts, filters]);
  const hostByHostname = useMemo(() => new Map(hosts.map((h) => [h.hostname, h])), [hosts]);
  const filteredProblems = useMemo(
    () =>
      problems.filter((p) => {
        const host = hostByHostname.get(p.hostname);
        return !!host && matchesFilters(host, filters);
      }),
    [problems, hostByHostname, filters]
  );

  const problemsByHost = useMemo(() => {
    const map = new Map<string, Problem[]>();
    for (const problem of filteredProblems) {
      const list = map.get(problem.hostname) || [];
      list.push(problem);
      map.set(problem.hostname, list);
    }
    return map;
  }, [filteredProblems]);

  const scopedHosts = useMemo(() => {
    const list = filteredHosts.filter((h) => inScope(h, scope, problemsByHost.get(h.hostname) || []));
    const countFor = (h: Host) => (problemsByHost.get(h.hostname) || []).length;
    const sorted = list.slice();
    if (scope === 'problems' || scope === 'unacknowledged' || scope === 'warning' || scope === 'critical') {
      sorted.sort((a, b) => countFor(b) - countFor(a) || a.hostname.localeCompare(b.hostname));
    } else if (scope === 'stale') {
      sorted.sort((a, b) => b.lastSeenMin - a.lastSeenMin || a.hostname.localeCompare(b.hostname));
    } else {
      sorted.sort((a, b) => a.hostname.localeCompare(b.hostname));
    }
    return sorted;
  }, [filteredHosts, scope, problemsByHost]);

  const hostScoped = useMemo(
    () => (hostFilter ? scopedHosts.filter((h) => h.hostname === hostFilter) : scopedHosts),
    [scopedHosts, hostFilter]
  );

  const visibleHosts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) {
      return hostScoped;
    }
    return hostScoped.filter((h) =>
      [h.hostname, h.hostGroup, h.businessService, h.os, h.environment, h.tier]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    );
  }, [hostScoped, search]);

  const pageCount = Math.max(1, Math.ceil(visibleHosts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = visibleHosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const scopeProblems =
    scope === 'problems'
      ? filteredProblems
      : scope === 'unacknowledged'
      ? filteredProblems.filter((p) => !p.ack)
      : [];

  const groupOptions = useMemo(
    () => Array.from(new Set(hosts.map((h) => h.hostGroup))).sort((a, b) => a.localeCompare(b)),
    [hosts]
  );
  const osOptions = useMemo(
    () => Array.from(new Set(hosts.map((h) => h.os))).sort((a, b) => a.localeCompare(b)),
    [hosts]
  );
  const serviceOptions = useMemo(
    () => Array.from(new Set(hosts.map((h) => h.businessService))).sort((a, b) => a.localeCompare(b)),
    [hosts]
  );

  const changeFilter = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    setPage(1);
    if (typeof window !== 'undefined' && window.history) {
      const params = new URLSearchParams(window.location.search);
      Object.entries(next).forEach(([name, val]) => {
        if (val && val !== ALL) {
          params.set(name, val);
        } else {
          params.delete(name);
        }
      });
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  const clearHostFilter = () => {
    setHostFilter(null);
    setPage(1);
    if (typeof window !== 'undefined' && window.history) {
      const params = new URLSearchParams(window.location.search);
      params.delete('host');
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  const resetFilters = () => {
    setFilters({ environment: ALL, tier: ALL, hostGroup: ALL, os: ALL, businessService: ALL });
    setHostFilter(null);
    setSearch('');
    setPage(1);
    if (typeof window !== 'undefined' && window.history) {
      const params = new URLSearchParams(window.location.search);
      ['environment', 'tier', 'hostGroup', 'os', 'businessService', 'host'].forEach((key) =>
        params.delete(key)
      );
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
  };

  const backParams = new URLSearchParams({ source });
  (Object.keys(filters) as Array<keyof Filters>).forEach((key) => {
    if (filters[key] !== ALL) {
      backParams.set(key, filters[key]);
    }
  });
  const backHref = `${appSubUrl()}/a/acme-command-center-app/command-center?${backParams.toString()}`;

  const exportCsv = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const header = [
      'Hostname',
      'Environment',
      'Tier',
      'Host group',
      'OS',
      'Business service',
      'Health',
      'Data state',
      'Last seen (min)',
      'CPU %',
      'Memory %',
      'Disk %',
      'Network %',
      'Active problems',
      'Unacknowledged',
      'Latest problem',
    ];
    const rows = visibleHosts.map((h) => {
      const hostProblems = problemsByHost.get(h.hostname) || [];
      const latest = hostProblems
        .slice()
        .sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
      return [
        h.hostname,
        h.environment,
        h.tier,
        h.hostGroup,
        h.os,
        h.businessService,
        h.health,
        DATA_STATE_LABEL[h.dataState],
        h.lastSeenMin >= 9999 ? '' : h.lastSeenMin,
        h.cpu,
        h.memory,
        h.disk,
        h.network,
        hostProblems.length,
        hostProblems.filter((p) => !p.ack).length,
        latest ? `${latest.severity}: ${latest.problem}` : '',
      ].map(csvCell);
    });
    const csv = [header.map(csvCell).join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `servers-${scope}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const meta = SCOPE_META[scope];
  const sourceBadge = source === 'live' ? 'LIVE' : 'SAMPLE';

  const header = (
    <div className="cc-srv-head">
      <a className="cc-srv-back" href={backHref}>
        ← Command Center
      </a>
      <div className="cc-srv-titles">
        <div className="cc-srv-title">SERVER INVENTORY</div>
        <div className="cc-srv-sub">
          <strong>{meta.title}</strong> — {meta.blurb}{' '}
          {scopeProblems.length > 0 || meta.problems ? (
            <>
              <strong>{scopeProblems.length}</strong> problem{scopeProblems.length === 1 ? '' : 's'} across{' '}
              <strong>{visibleHosts.length}</strong> server{visibleHosts.length === 1 ? '' : 's'}.
            </>
          ) : (
            <>
              <strong>{visibleHosts.length}</strong> server{visibleHosts.length === 1 ? '' : 's'}.
            </>
          )}
        </div>
      </div>
      <div className="cc-srv-actions">
        <span className={`cc-srv-badge ${source === 'live' ? 'live' : 'sample'}`}>{sourceBadge}</span>
        {live ? (
          <span className="cc-muted" style={{ fontSize: 9 }}>
            sync {live.fetchedAt.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Singapore' })}
          </span>
        ) : null}
        {source === 'live' ? (
          <button type="button" className="cc-srv-btn" onClick={() => setTick((t) => t + 1)} disabled={liveState === 'loading'}>
            {liveState === 'loading' ? 'Refreshing…' : 'Refresh'}
          </button>
        ) : null}
        <button type="button" className="cc-srv-btn" onClick={exportCsv} disabled={!data || visibleHosts.length === 0}>
          Export CSV
        </button>
      </div>
    </div>
  );

  const filterBar = (
    <div className="cc-srv-filters">
      <div className="cc-filter" style={{ minWidth: 120 }}>
        <label>Environment</label>
        <select value={filters.environment} onChange={(e) => changeFilter('environment', e.target.value)}>
          <option value="All">All</option>
          <option value="PROD">PROD</option>
          <option value="DR">DR</option>
          <option value="UAT">DEV / UAT</option>
        </select>
      </div>
      <div className="cc-filter" style={{ minWidth: 110 }}>
        <label>System Tier</label>
        <select value={filters.tier} onChange={(e) => changeFilter('tier', e.target.value)}>
          <option value="All">All</option>
          <option value="Tier 1">Tier 1</option>
          <option value="Tier 2">Tier 2</option>
          <option value="Tier 3">Tier 3</option>
        </select>
      </div>
      <div className="cc-filter" style={{ minWidth: 150 }}>
        <label>Host Group</label>
        <select value={filters.hostGroup} onChange={(e) => changeFilter('hostGroup', e.target.value)}>
          <option value="All">All</option>
          {groupOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="cc-filter" style={{ minWidth: 110 }}>
        <label>OS Type</label>
        <select value={filters.os} onChange={(e) => changeFilter('os', e.target.value)}>
          <option value="All">All</option>
          {osOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="cc-filter" style={{ minWidth: 160 }}>
        <label>Business Service</label>
        <select
          value={filters.businessService}
          onChange={(e) => changeFilter('businessService', e.target.value)}
        >
          <option value="All">All</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="cc-srv-search">
        <label>Search</label>
        <input
          type="text"
          value={search}
          placeholder="Hostname, group, service, OS…"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      {hostFilter ? (
        <span className="cc-srv-hostchip">
          Host: <strong>{hostFilter}</strong>
          <button type="button" onClick={clearHostFilter} aria-label="Clear host filter">
            ×
          </button>
        </span>
      ) : null}
      <button type="button" className="cc-srv-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );

  const body = !data ? (
    <div className="cc-panel">
      <div className={`cc-srv-empty ${liveState === 'error' ? 'cc-srv-error' : ''}`}>
        {liveState === 'error' ? (
          <>
            Could not load live Zabbix data: {liveError}
            <div style={{ marginTop: 12 }}>
              <button type="button" className="cc-srv-btn" onClick={() => setTick((t) => t + 1)}>
                Retry
              </button>
            </div>
          </>
        ) : (
          'Loading live data from Zabbix…'
        )}
      </div>
    </div>
  ) : (
    <div className="cc-panel">
      <div className="cc-panel-head">
        <div className="cc-panel-title">{meta.title}</div>
        <div className="cc-panel-sub">
          {visibleHosts.length} server{visibleHosts.length === 1 ? '' : 's'}
          {scopeProblems.length > 0 ? ` · ${scopeProblems.length} problem${scopeProblems.length === 1 ? '' : 's'}` : ''}
        </div>
      </div>
      <div className="cc-table-wrap">
        <table className="cc-table cc-srv-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Hostname</th>
              <th>Environment</th>
              <th>Tier</th>
              <th>Host Group</th>
              <th>OS</th>
              <th>Business Service</th>
              <th>Health</th>
              <th>Data</th>
              <th>Last Seen</th>
              <th className="num">CPU</th>
              <th className="num">Memory</th>
              <th className="num">Disk</th>
              <th className="num">Network</th>
              <th className="num">Problems</th>
              <th>Latest Problem</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((h, index) => {
              const hostProblems = problemsByHost.get(h.hostname) || [];
              const unack = hostProblems.filter((p) => !p.ack).length;
              const latest = hostProblems.slice().sort((a, b) => a.minutesAgo - b.minutesAgo)[0];
              return (
                <tr key={h.id} className="cc-srv-row">
                  <td className="cc-muted">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="hostname">{h.hostname}</td>
                  <td>{h.environment}</td>
                  <td>{h.tier}</td>
                  <td>{h.hostGroup}</td>
                  <td>{h.os}</td>
                  <td>{h.businessService}</td>
                  <td>
                    <span className={`cc-srv-health ${HEALTH_CLASS[h.health]}`}>{h.health}</span>
                  </td>
                  <td>{DATA_STATE_LABEL[h.dataState]}</td>
                  <td className="cc-muted">{h.lastSeenMin >= 9999 ? '—' : `${h.lastSeenMin}m`}</td>
                  <td className={utilClass(h.cpu)}>{h.cpu.toFixed(0)}%</td>
                  <td className={utilClass(h.memory)}>{h.memory.toFixed(0)}%</td>
                  <td className={utilClass(h.disk)}>{h.disk.toFixed(0)}%</td>
                  <td className={utilClass(h.network)}>{h.network.toFixed(1)}%</td>
                  <td className="num">
                    {hostProblems.length}
                    {unack > 0 ? <span className="cc-muted"> ({unack} unack)</span> : null}
                  </td>
                  <td className="cc-srv-problem">
                    {latest ? (
                      <span className={`cc-sev cc-sev-${latest.severity.toLowerCase()}`} title={`${latest.problem} · ${latest.time} · ${latest.duration}`}>
                        {latest.problem}
                      </span>
                    ) : (
                      <span className="cc-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={16}>
                  <div className="cc-srv-empty">No servers match this view and the active filters.</div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="cc-srv-pager">
        <span>
          Showing {visibleHosts.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
          {Math.min(currentPage * pageSize, visibleHosts.length)} of {visibleHosts.length}
        </span>
        <span>
          Page size{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value, 10) || 50);
              setPage(1);
            }}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </span>
        <button
          type="button"
          className="cc-srv-btn"
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          Prev
        </button>
        <span>
          {currentPage} / {pageCount}
        </span>
        <button
          type="button"
          className="cc-srv-btn"
          onClick={() => setPage(Math.min(pageCount, currentPage + 1))}
          disabled={currentPage >= pageCount}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="cc-app cc-srv">
      <style>{CSS}</style>
      <style>{SRV_CSS}</style>
      {header}
      {filterBar}
      {source === 'live' && liveState === 'error' && live ? (
        <div className="cc-banner">
          <strong>ZABBIX UNREACHABLE</strong>
          <span>{liveError || 'Unable to reach the Zabbix API.'}</span>
          <span className="cc-muted" style={{ marginLeft: 'auto' }}>
            Showing last successful sync
          </span>
        </div>
      ) : null}
      {body}
    </div>
  );
}
