import React, { useMemo, useState } from 'react';
import {
  BusinessServicesTable,
  DrTable,
  GroupGrids,
  Header,
  Kpi,
  LiveProblemsTicker,
  ProblemsTable,
  TopServersPanel,
  UtilCard,
} from './components';
import { HostDetailModal } from './HostDetailModal';
import { ZabbixConfig } from './data/config';
import { matchesFilters } from './data/sampleData';
import { CSS } from './styles';
import { BusinessServiceRow, DrRow, Host, ResourceKey, SeverityGroup } from './types';
import { useOpsData } from './useOpsData';

const ALL = 'All';

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (n: number) => `${n.toFixed(1)}%`;

export function CommandCenterPage({ initialConfig }: { initialConfig?: ZabbixConfig } = {}) {
  const {
    data,
    effectiveSource,
    source,
    onSource,
    connection,
    live,
    liveError,
    sampleEnabled,
    refreshSeconds,
    brandName,
    brandTagline,
    logoUrl,
    canGoLive,
    filters,
    setFilters,
    onChange,
    options,
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
  } = useOpsData(initialConfig);
  const [resource, setResource] = useState<ResourceKey>('cpu');
  const [problemTab, setProblemTab] = useState<SeverityGroup | 'All'>('All');
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  const activeHost = selectedHost ? data.hosts.find((h) => h.id === selectedHost.id) || null : null;

  // Any hostname rendered in a table or the ticker opens that host's drawer.
  const openHost = (hostname: string) => {
    const host = hostByHostname.get(hostname);
    if (host) {
      setSelectedHost(host);
    }
  };

  const safeTotal = total || 1;
  const safeProblems = totalProblems || 1;


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

  return (
    <div className="cc-app">
      <style>{CSS}</style>
      <div className="cc-aurora a1" aria-hidden="true" />
      <div className="cc-aurora a2" aria-hidden="true" />
      <div className="cc-aurora a3" aria-hidden="true" />
      <Header
        filters={filters}
        onChange={onChange}
        options={options}
        source={source}
        onSource={onSource}
        connection={connection}
        version={live?.version}
        hostCount={live?.data.hosts.length}
        lastSync={live?.fetchedAt.toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Singapore' })}
        canGoLive={canGoLive}
        sampleEnabled={sampleEnabled}
        brandName={brandName}
        brandTagline={brandTagline}
        logoUrl={logoUrl}
      />

      <LiveProblemsTicker problems={filteredProblems} onHost={openHost} />

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
          tone="cyan"
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
          title="CPU utilisation"
          sub="All servers"
          avg={utilization.cpu.avg}
          critical={utilization.cpu.critical}
          warning={utilization.cpu.warning}
          normal={utilization.cpu.normal}
          accent="#2f9bff"
        />
        <UtilCard
          title="Memory utilisation"
          sub="All servers"
          avg={utilization.memory.avg}
          critical={utilization.memory.critical}
          warning={utilization.memory.warning}
          normal={utilization.memory.normal}
          accent="#8b5cf6"
        />
        <UtilCard
          title="Disk utilisation"
          sub="All filesystems"
          avg={utilization.disk.avg}
          critical={utilization.disk.critical}
          warning={utilization.disk.warning}
          normal={utilization.disk.normal}
          accent="#00d47e"
        />
        <UtilCard
          title="Network utilisation"
          sub="All interfaces"
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
        <TopServersPanel rows={topServers} resource={resource} onResource={setResource} onHost={openHost} />
      </div>

      <ProblemsTable
        problems={filteredProblems}
        tab={problemTab}
        onTab={setProblemTab}
        counts={problemCounts}
        source={effectiveSource}
        refreshSeconds={refreshSeconds}
        onHost={openHost}
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
