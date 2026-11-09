import React, { useState } from 'react';
import { GroupPanel, Header, Kpi, LiveProblemsTicker, MaintenanceTable, ProblemsTable } from './components';
import { HostDetailModal } from './HostDetailModal';
import { motionAllowed, ZabbixConfig } from './data/config';
import { CSS } from './styles';
import type { Host, SeverityGroup } from './types';
import { useOpsData } from './useOpsData';

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (n: number) => `${n.toFixed(1)}%`;

export function DataCenterPage({ initialConfig }: { initialConfig?: ZabbixConfig } = {}) {
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
    motion,
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
    filtersActive,
    total,
    available,
    unavailable,
    maintenance,
    totalProblems,
    drillHref,
  } = useOpsData(initialConfig);
  const [problemTab, setProblemTab] = useState<SeverityGroup | 'All'>('All');
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  const activeHost = selectedHost ? data.hosts.find((h) => h.id === selectedHost.id) || null : null;

  const openHost = (hostname: string) => {
    const host = hostByHostname.get(hostname);
    if (host) {
      setSelectedHost(host);
    }
  };

  const safeTotal = total || 1;
  const safeProblems = totalProblems || 1;
  // Same group panels as the Infrastructure Command Center, limited to the two
  // data-center environments this dashboard reports on.
  const envGroups = groups.filter((group) => group.key === 'PROD' || group.key === 'DR');

  // The DCO problem panel only lists unacknowledged Warning and Critical
  // problems. Acknowledged problems are considered handled, and Info items are
  // informational rather than actionable, so the UNACKNOWLEDGED KPI equals the
  // WARNING + CRITICAL panel total exactly.
  const unacknowledgedProblems = filteredProblems.filter(
    (p) => !p.ack && p.severityGroup !== 'Info'
  );
  const unacknowledgedCounts = {
    All: unacknowledgedProblems.length,
    Critical: unacknowledgedProblems.filter((p) => p.severityGroup === 'Critical').length,
    Warning: unacknowledgedProblems.filter((p) => p.severityGroup === 'Warning').length,
    Info: unacknowledgedProblems.filter((p) => p.severityGroup === 'Info').length,
  };
  const safeUnacknowledged = unacknowledgedProblems.length || 1;

  // Hosts inside a Zabbix maintenance window, matching the IN MAINTENANCE KPI.
  const maintenanceHosts = filteredHosts.filter((h) => h.maintenance);

  return (
    <div className={`cc-app cc-dc${motionAllowed(motion) ? '' : ' cc-motion-off'}`}>
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
        lastSync={live?.fetchedAt.toLocaleTimeString('en-GB', {
          hour12: false,
          timeZone: 'Asia/Singapore',
        })}
        canGoLive={canGoLive}
        sampleEnabled={sampleEnabled}
        brandName={brandName}
        brandTagline={brandTagline}
        logoUrl={logoUrl}
        title="DATA CENTER OPERATION COMMAND CENTER"
        subtitle="Production  |  Disaster Recovery  |  Real-time Data Center Health from Zabbix"
      />

      {/* Same marquee as the Command Center, limited to unacknowledged problems. */}
      <LiveProblemsTicker problems={unacknowledgedProblems} onHost={openHost} />

      {source === 'live' && connection === 'error' ? (
        <div className="cc-banner">
          <strong>ZABBIX UNREACHABLE</strong>
          <span>{liveError || 'Unable to reach the Zabbix API.'}</span>
          <span className="cc-muted" style={{ marginLeft: 'auto' }}>
            {live
              ? 'Showing last successful sync'
              : sampleEnabled
              ? 'Showing sample data'
              : 'No live data available'}
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
          <button
            type="button"
            className="cc-banner-btn"
            onClick={() => setFilters({ ...filters, environment: 'All', tier: 'All', hostGroup: 'All', os: 'All', businessService: 'All' })}
          >
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
          value={fmt(unacknowledgedCounts.Warning)}
          sub={`${pct((unacknowledgedCounts.Warning / safeUnacknowledged) * 100)} unacknowledged`}
          tone="yellow"
          href={drillHref('warning')}
        />
        <Kpi
          icon="alert"
          label="CRITICAL"
          value={fmt(unacknowledgedCounts.Critical)}
          sub={`${pct((unacknowledgedCounts.Critical / safeUnacknowledged) * 100)} unacknowledged`}
          tone="red"
          href={drillHref('critical')}
        />
        <Kpi
          icon="bell"
          label="TOTAL PROBLEMS"
          value={fmt(totalProblems)}
          sub={`${fmt(unacknowledgedProblems.length)} unacknowledged`}
          tone="purple"
          href={drillHref('problems')}
        />
        <Kpi
          icon="bell-off"
          label="UNACKNOWLEDGED"
          value={fmt(unacknowledgedProblems.length)}
          sub={pct((unacknowledgedProblems.length / safeProblems) * 100)}
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
      </div>

      {/* Environment panels and the maintenance list share one row: Production,
          Disaster Recovery and Servers in Maintenance, left to right. */}
      <div className="cc-dc-envs">
        {envGroups.map((group) => (
          <GroupPanel key={group.key} group={group} onSelect={setSelectedHost} />
        ))}
        <MaintenanceTable hosts={maintenanceHosts} onHost={openHost} />
      </div>

      <ProblemsTable
        problems={unacknowledgedProblems}
        tab={problemTab}
        onTab={setProblemTab}
        counts={unacknowledgedCounts}
        source={effectiveSource}
        refreshSeconds={refreshSeconds}
        onHost={openHost}
        title="Unacknowledged Problems"
        tabs={['All', 'Critical', 'Warning']}
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
