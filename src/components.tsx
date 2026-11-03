import React from 'react';
import {
  BusinessServiceRow,
  DrRow,
  Filters,
  GroupSummary,
  Host,
  Problem,
  ResourceKey,
  SeverityGroup,
  TopServerRow,
} from './types';

export interface FilterOptions {
  environments: Array<{ value: string; label: string }>;
  tiers: string[];
  groups: string[];
  os: string[];
  services: string[];
}

const TONE: Record<string, { tone: string; bg: string }> = {
  blue: { tone: '#2f9bff', bg: 'rgba(47, 155, 255, 0.12)' },
  green: { tone: '#00e676', bg: 'rgba(0, 230, 118, 0.12)' },
  red: { tone: '#ff3d57', bg: 'rgba(255, 61, 87, 0.12)' },
  yellow: { tone: '#ffc107', bg: 'rgba(255, 193, 7, 0.12)' },
  orange: { tone: '#ff8a3d', bg: 'rgba(255, 138, 61, 0.12)' },
  purple: { tone: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  gray: { tone: '#8ea3bf', bg: 'rgba(142, 163, 191, 0.10)' },
};

const GROUP_COLOR: Record<string, string> = {
  PROD: '#ff3d57',
  DR: '#2f9bff',
  UAT: '#8b5cf6',
};

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (n: number) => `${n.toFixed(1)}%`;

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'server':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="6" rx="1.6" />
          <rect x="3" y="14" width="18" height="6" rx="1.6" />
          <path d="M7 7h.01M7 17h.01M11 7h.01M11 17h.01" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.6 2.6L16 9" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m9 9 6 6M15 9l-6 6" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...common}>
          <path d="M10.3 3.8 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </svg>
      );
    case 'bell-off':
      return (
        <svg {...common}>
          <path d="M13.7 21a2 2 0 0 1-3.4 0M18 8a6 6 0 0 0-9.3-5.2M6 8c0 7-3 9-3 9h13" />
          <path d="m2 2 20 20" />
        </svg>
      );
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.6-.7-.7-2.6Z" />
        </svg>
      );
    case 'db':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
          <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export type ConnectionState = 'sample' | 'loading' | 'ready' | 'error';

export function Header({
  filters,
  onChange,
  options,
  now,
  source,
  onSource,
  connection,
  version,
  hostCount,
  lastSync,
  canGoLive,
  sampleEnabled = true,
}: {
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  options: FilterOptions;
  now: Date;
  source: 'sample' | 'live';
  onSource: (s: 'sample' | 'live') => void;
  connection: ConnectionState;
  version?: string;
  hostCount?: number;
  lastSync?: string;
  canGoLive: boolean;
  sampleEnabled?: boolean;
}) {
  const date = now.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Singapore',
  });
  const time = now.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Singapore',
  });
  return (
    <div className="cc-header">
      <div className="cc-brand">
        <div className="cc-logo">
          <span style={{ background: '#28a9ff' }} />
          <span style={{ background: '#00d47e' }} />
          <span style={{ background: '#ffb020' }} />
        </div>
        <div>
          <div className="cc-title">INFRASTRUCTURE OPERATIONS COMMAND CENTER</div>
          <div className="cc-subtitle">All Servers&nbsp;&nbsp;|&nbsp;&nbsp;500 - 1,500 Servers&nbsp;&nbsp;|&nbsp;&nbsp;Real-time Infrastructure Health from Zabbix</div>
        </div>
      </div>

      <div className="cc-filters">
        <div className="cc-filter">
          <label>Environment</label>
          <select value={filters.environment} onChange={(e) => onChange('environment', e.target.value)}>
            <option value="All">All</option>
            {options.environments.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="cc-filter">
          <label>System Tier</label>
          <select value={filters.tier} onChange={(e) => onChange('tier', e.target.value)}>
            <option value="All">All</option>
            {options.tiers.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="cc-filter">
          <label>Host Group</label>
          <select value={filters.hostGroup} onChange={(e) => onChange('hostGroup', e.target.value)}>
            <option value="All">All</option>
            {options.groups.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="cc-filter">
          <label>OS Type</label>
          <select value={filters.os} onChange={(e) => onChange('os', e.target.value)}>
            <option value="All">All</option>
            {options.os.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="cc-filter">
          <label>Business Service</label>
          <select value={filters.businessService} onChange={(e) => onChange('businessService', e.target.value)}>
            <option value="All">All</option>
            {options.services.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="cc-header-right">
        {canGoLive ? (
          sampleEnabled ? (
            <div className="cc-mode">
              <button
                type="button"
                className={source === 'sample' ? 'active' : ''}
                onClick={() => onSource('sample')}
              >
                SAMPLE
              </button>
              <button
                type="button"
                className={source === 'live' ? 'active' : ''}
                onClick={() => onSource('live')}
              >
                LIVE
              </button>
            </div>
          ) : (
            <div className="cc-mode" title="Sample data is disabled in the plugin configuration">
              <span className="cc-mode-note">LIVE ONLY</span>
            </div>
          )
        ) : null}
        <div className="cc-clock">
          <div className="cc-clock-date">{date}</div>
          <div className="cc-clock-time">{time}</div>
          <div className="cc-clock-zone">(GMT+8)</div>
        </div>
        <div className={`cc-zabbix is-${connection}`}>
          <span className="cc-zabbix-dot" />
          <div>
            <div className="cc-zabbix-label">ZABBIX</div>
            <div className="cc-zabbix-sub">
              {connection === 'sample'
                ? 'Sample dataset · no API calls'
                : connection === 'loading'
                ? 'Connecting to Zabbix API…'
                : connection === 'ready'
                ? `v${version || '?'} · ${fmt(hostCount || 0)} hosts · sync ${lastSync || '—'}`
                : 'Connection failed'}
            </div>
          </div>
          <span
            className={`cc-sample-badge ${connection === 'ready' ? 'is-live' : ''} ${
              connection === 'error' ? 'is-error' : ''
            }`}
          >
            {connection === 'sample' ? 'SAMPLE' : connection === 'loading' ? 'SYNC' : connection === 'ready' ? 'LIVE' : 'ERROR'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Kpi({
  icon,
  label,
  value,
  sub,
  delta,
  deltaTone,
  tone,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  sub: string;
  delta?: string;
  deltaTone?: 'good' | 'bad';
  tone: keyof typeof TONE;
  href?: string;
}) {
  const t = TONE[tone];
  const body = (
    <>
      <div className="cc-kpi-icon">
        <Icon name={icon} size={15} />
      </div>
      <div className="cc-kpi-body">
        <div className="cc-kpi-label">{label}</div>
        <div className="cc-kpi-value">{value}</div>
        <div className="cc-kpi-sub">
          {sub}
          {delta ? (
            <span className="cc-kpi-delta" style={{ color: deltaTone === 'good' ? '#00d47e' : '#ff8a3d' }}>
              {delta}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
  const style = { '--tone': t.tone, '--tone-bg': t.bg } as React.CSSProperties;
  if (href) {
    return (
      <a
        className="cc-kpi cc-kpi-link"
        style={style}
        href={href}
        title={`Open the server list for ${label.toLowerCase()}`}
      >
        {body}
      </a>
    );
  }
  return (
    <div className="cc-kpi" style={style}>
      {body}
    </div>
  );
}

export function Donut({
  segments,
  size = 88,
  centerValue,
  centerLabel,
}: {
  segments: Array<{ value: number; color: string }>;
  size?: number;
  centerValue: string;
  centerLabel: string;
}) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  let offset = 0;
  return (
    <div className="cc-donut" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#12233c" strokeWidth="10" />
        {segments.map((s, i) => {
          const length = (s.value / total) * circumference;
          const dash = Math.max(0, length - 1.2);
          const circle = (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="10"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
            />
          );
          offset += length;
          return circle;
        })}
      </svg>
      <div className="cc-donut-center">
        <div className="cc-donut-value">{centerValue}</div>
        <div className="cc-donut-unit">{centerLabel}</div>
      </div>
    </div>
  );
}

export function UtilCard({
  title,
  sub,
  avg,
  critical,
  warning,
  normal,
  accent,
}: {
  title: string;
  sub: string;
  avg: number;
  critical: number;
  warning: number;
  normal: number;
  accent: string;
}) {
  const bars = Array.from({ length: 36 }, (_, i) => {
    const wave = Math.abs(Math.sin(i * 0.63 + avg * 0.12));
    return 16 + wave * 66 + ((i * 7) % 11);
  });
  return (
    <div className="cc-panel">
      <div className="cc-panel-head">
        <div className="cc-panel-title">{title}</div>
        <div className="cc-panel-sub">{sub}</div>
      </div>
      <div className="cc-util-body">
        <Donut
          segments={[
            { value: critical, color: '#ff3d57' },
            { value: warning, color: '#ffc107' },
            { value: normal, color: '#00d47e' },
          ]}
          size={88}
          centerValue={`${Math.round(avg)}%`}
          centerLabel="Avg"
        />
        <div className="cc-bars">
          {bars.map((h, i) => (
            <span
              key={i}
              className="cc-bar"
              style={{
                height: `${Math.min(100, h)}%`,
                background: `linear-gradient(180deg, ${i % 3 === 0 ? accent : '#2f6fff'}, rgba(20, 60, 130, 0.35))`,
              }}
            />
          ))}
        </div>
        <div className="cc-legend">
          <div className="cc-legend-row">
            <span className="cc-dot" style={{ background: '#ff3d57' }} />
            <span className="cc-legend-label">Critical (≥ 90%)</span>
            <span className="cc-legend-value">{fmt(critical)}</span>
          </div>
          <div className="cc-legend-row">
            <span className="cc-dot" style={{ background: '#ffc107' }} />
            <span className="cc-legend-label">Warning (70–90%)</span>
            <span className="cc-legend-value">{fmt(warning)}</span>
          </div>
          <div className="cc-legend-row">
            <span className="cc-dot" style={{ background: '#00d47e' }} />
            <span className="cc-legend-label">Normal (&lt; 70%)</span>
            <span className="cc-legend-value">{fmt(normal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function groupCounts(hosts: Host[]) {
  return {
    healthy: hosts.filter((h) => h.health === 'healthy').length,
    warning: hosts.filter((h) => h.health === 'warning').length,
    critical: hosts.filter((h) => h.health === 'critical').length,
    stale: hosts.filter((h) => h.health === 'stale').length,
    maintenance: hosts.filter((h) => h.health === 'maintenance').length,
    unavailable: hosts.filter((h) => h.health === 'unavailable').length,
  };
}

export function GroupGrids({
  groups,
  onSelect,
}: {
  groups: GroupSummary[];
  onSelect?: (host: Host) => void;
}) {
  return (
    <div className="cc-groups">
      {groups.map((g) => {
        const c = groupCounts(g.tiers.flatMap((t) => t.hosts));
        return (
          <div className="cc-panel cc-group" key={g.key} style={{ '--group': GROUP_COLOR[g.key] } as React.CSSProperties}>
            <div className="cc-group-head">
              <div className="cc-group-name">{g.name}</div>
              <div className="cc-group-total">({fmt(g.total)})</div>
              <div className="cc-group-chips">
                <span className="cc-chip cc-chip-green">● {c.healthy}</span>
                <span className="cc-chip cc-chip-yellow">● {c.warning}</span>
                <span className="cc-chip cc-chip-red">● {c.critical}</span>
                <span className="cc-chip cc-chip-gray">● {c.stale}</span>
              </div>
            </div>
            <div className="cc-grid-wrap">
              {g.tiers.map((tier) => {
                const tc = groupCounts(tier.hosts);
                return (
                  <div className="cc-tier-row" key={tier.name}>
                    <div className="cc-tier-label">
                      <div className="cc-tier-title">{tier.name}</div>
                      <div className="cc-tier-sub">
                        {tier.subtitle} ({fmt(tier.hosts.length)})
                      </div>
                      <div className="cc-tier-counts">
                        <span style={{ color: '#00e676' }}>{tc.healthy}</span>
                        <span style={{ color: '#ffc107' }}>{tc.warning}</span>
                        <span style={{ color: '#ff3d57' }}>{tc.critical}</span>
                        <span style={{ color: '#8ea3bf' }}>{tc.stale}</span>
                      </div>
                    </div>
                    <div className="cc-host-grid">
                      {tier.hosts.map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          className={`cc-cell cc-cell-btn cc-cell-${h.health}`}
                          title={`${h.hostname} · ${h.health} · CPU ${h.cpu}% · Memory ${h.memory}% · Disk ${h.disk}%`}
                          aria-label={`Open server statistics for ${h.hostname}, health ${h.health}`}
                          tabIndex={-1}
                          onClick={() => onSelect && onSelect(h)}
                        />
                      ))}
                      {tier.hosts.length === 0 ? <span className="cc-muted" style={{ fontSize: 8 }}>No hosts match filters</span> : null}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cc-legend-inline">
              <span><i className="cc-dot" style={{ background: '#00d47e' }} /> Healthy</span>
              <span><i className="cc-dot" style={{ background: '#ffc107' }} /> Warning</span>
              <span><i className="cc-dot" style={{ background: '#ff3d57' }} /> Critical</span>
              <span><i className="cc-dot" style={{ background: '#67768a' }} /> Stale</span>
              <span><i className="cc-dot" style={{ background: '#3b82f6' }} /> Maintenance</span>
              <span><i className="cc-dot" style={{ background: '#9f1239' }} /> Unavailable</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function rowLinkProps(href?: string) {
  if (!href) {
    return {};
  }
  const open = () => {
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };
  return {
    className: 'cc-row-link',
    role: 'link',
    tabIndex: 0,
    title: 'Open the server list for this row',
    onClick: open,
    onKeyDown: (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    },
  };
}

export function BusinessServicesTable({
  rows,
  href,
}: {
  rows: BusinessServiceRow[];
  href?: (row: BusinessServiceRow) => string | undefined;
}) {
  return (
    <div className="cc-panel">
      <div className="cc-panel-head">
        <div className="cc-panel-title">Business Services Impact</div>
        <div className="cc-panel-sub">{rows.length} services</div>
      </div>
      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Business Service</th>
              <th>Env</th>
              <th className="num">Servers</th>
              <th>Status</th>
              <th className="num">Active Problems</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const link = href ? href(r) : undefined;
              return (
                <tr key={r.name} {...rowLinkProps(link)}>
                  <td className="cc-muted">{i + 1}</td>
                  <td className="cc-strong">
                    {link ? (
                      <a
                        className="cc-row-anchor"
                        href={link}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {r.name}
                        <span className="cc-row-arrow">›</span>
                      </a>
                    ) : (
                      r.name
                    )}
                  </td>
                  <td className="cc-muted">{r.env}</td>
                  <td className="num">{fmt(r.servers)}</td>
                  <td className={`cc-status cc-status-${r.status.toLowerCase()}`}>{r.status}</td>
                  <td className="num" style={{ color: r.activeProblems > 0 ? '#ff8a3d' : '#00d47e' }}>{r.activeProblems}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="cc-muted">No services match the current filters.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function statusClass(status: string) {
  return `cc-status cc-status-${status.toLowerCase()}`;
}

export function DrTable({
  rows,
  href,
}: {
  rows: DrRow[];
  href?: (row: DrRow) => string | undefined;
}) {
  return (
    <div className="cc-panel">
      <div className="cc-panel-head">
        <div className="cc-panel-title">DR Readiness &amp; Replication Health</div>
        <div className="cc-panel-sub">{rows.length} components</div>
      </div>
      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>Service / Component</th>
              <th>PROD Status</th>
              <th>DR Status</th>
              <th>Replication Lag</th>
              <th>Last Sync</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const link = href ? href(r) : undefined;
              return (
                <tr key={r.name} {...rowLinkProps(link)}>
                  <td className="cc-strong">
                    {link ? (
                      <a
                        className="cc-row-anchor"
                        href={link}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {r.name}
                        <span className="cc-row-arrow">›</span>
                      </a>
                    ) : (
                      r.name
                    )}
                  </td>
                  <td className={statusClass(r.prodStatus)}>{r.prodStatus}</td>
                  <td className={statusClass(r.drStatus)}>{r.drStatus}</td>
                  <td style={{ color: r.replicationLag.includes('1h') ? '#ff4d67' : '#b9c9dd' }}>{r.replicationLag}</td>
                  <td className="cc-muted">{r.lastSync}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="cc-muted">No DR components are defined in Zabbix.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FreshnessPanel({
  counts,
  total,
}: {
  counts: { upToDate: number; stale: number; noData: number; notMonitored: number };
  total: number;
}) {
  const safeTotal = total || 1;
  return (
    <div className="cc-panel cc-freshness">
      <div className="cc-panel-head">
        <div className="cc-panel-title">Monitoring Data Freshness</div>
      </div>
      <div className="cc-freshness-body">
        <Donut
          segments={[
            { value: counts.upToDate, color: '#00d47e' },
            { value: counts.stale, color: '#ffc107' },
            { value: counts.noData, color: '#ff3d57' },
            { value: counts.notMonitored, color: '#5f7591' },
          ]}
          size={108}
          centerValue={fmt(total)}
          centerLabel="Total Hosts"
        />
        <div className="cc-freshness-legend">
          <div className="cc-legend-row">
            <span className="cc-dot" style={{ background: '#00d47e' }} />
            <span className="cc-legend-label">Up to date</span>
            <span className="cc-legend-value">{fmt(counts.upToDate)} ({pct((counts.upToDate / safeTotal) * 100)})</span>
          </div>
          <div className="cc-legend-row">
            <span className="cc-dot" style={{ background: '#ffc107' }} />
            <span className="cc-legend-label">Stale (5–10m)</span>
            <span className="cc-legend-value">{fmt(counts.stale)} ({pct((counts.stale / safeTotal) * 100)})</span>
          </div>
          <div className="cc-legend-row">
            <span className="cc-dot" style={{ background: '#ff3d57' }} />
            <span className="cc-legend-label">No data (&gt;10m)</span>
            <span className="cc-legend-value">{fmt(counts.noData)} ({pct((counts.noData / safeTotal) * 100)})</span>
          </div>
          <div className="cc-legend-row">
            <span className="cc-dot" style={{ background: '#5f7591' }} />
            <span className="cc-legend-label">Not monitored</span>
            <span className="cc-legend-value">{fmt(counts.notMonitored)} ({pct((counts.notMonitored / safeTotal) * 100)})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 64;
  const h = 18;
  const n = values.length || 1;
  const points = values
    .map((v, i) => `${(i / Math.max(1, n - 1)) * w},${h - (Math.max(0, Math.min(100, v)) / 100) * h}`)
    .join(' ');
  return (
    <svg className="cc-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

const RESOURCE_LABEL: Record<ResourceKey, string> = {
  cpu: 'CPU',
  memory: 'Memory',
  disk: 'Disk',
};

const RESOURCE_COLOR: Record<ResourceKey, string> = {
  cpu: '#ffb020',
  memory: '#8b5cf6',
  disk: '#00d47e',
};

export function TopServersPanel({
  rows,
  resource,
  onResource,
}: {
  rows: TopServerRow[];
  resource: ResourceKey;
  onResource: (r: ResourceKey) => void;
}) {
  const value = (r: TopServerRow) => r[resource];
  return (
    <div className="cc-panel">
      <div className="cc-panel-head">
        <div className="cc-panel-title">Top 10 Servers by Resource Utilisation</div>
        <div className="cc-panel-sub">{RESOURCE_LABEL[resource]}</div>
      </div>
      <div className="cc-tabs">
        {(['cpu', 'memory', 'disk'] as ResourceKey[]).map((r) => (
          <button
            key={r}
            type="button"
            className={`cc-tab ${resource === r ? 'active' : ''}`}
            onClick={() => onResource(r)}
          >
            {RESOURCE_LABEL[r]}
          </button>
        ))}
      </div>
      <div className="cc-table-wrap">
        <table className="cc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Hostname</th>
              <th>Env</th>
              <th>Tier</th>
              <th className="num">{RESOURCE_LABEL[resource]}</th>
              <th>Trend (24h)</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 10).map((r, i) => (
              <tr key={r.hostname}>
                <td className="cc-muted">{i + 1}</td>
                <td className="cc-strong">{r.hostname}</td>
                <td className="cc-muted">{r.environment}</td>
                <td className="cc-muted">{r.tier.replace('Tier ', 'T')}</td>
                <td>
                  <div className="cc-bar-cell">
                    <span className="cc-mini-track">
                      <span className="cc-mini-fill" style={{ width: `${value(r)}%`, background: RESOURCE_COLOR[resource] }} />
                    </span>
                    <span style={{ color: RESOURCE_COLOR[resource], fontWeight: 700 }}>{value(r)}%</span>
                  </div>
                </td>
                <td>
                  <Sparkline values={r.trends[resource]} color={RESOURCE_COLOR[resource]} />
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="cc-muted">No hosts match the current filters.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function severityClass(s: string) {
  return `cc-sev cc-sev-${s.toLowerCase()}`;
}

function slaClass(s: string) {
  if (s === 'Within SLA') return 'cc-sla-within';
  if (s === 'At Risk') return 'cc-sla-risk';
  if (s === 'Not tracked') return 'cc-muted';
  return 'cc-sla-breach';
}

export function ProblemsTable({
  problems,
  tab,
  onTab,
  counts,
  source,
  refreshSeconds,
}: {
  problems: Problem[];
  tab: SeverityGroup | 'All';
  onTab: (t: SeverityGroup | 'All') => void;
  counts: Record<SeverityGroup | 'All', number>;
  source: 'sample' | 'live';
  refreshSeconds?: number;
}) {
  const refreshLabel =
    refreshSeconds && refreshSeconds >= 60 && refreshSeconds % 60 === 0
      ? `${refreshSeconds / 60}m`
      : `${refreshSeconds || 60}s`;
  const visible = problems.filter((p) => tab === 'All' || p.severityGroup === tab);
  const shown = visible.slice(0, 10);
  return (
    <div className="cc-panel cc-problems">
      <div className="cc-panel-head">
        <div className="cc-panel-title">Active Zabbix Problems ({fmt(problems.length)})</div>
        <div className="cc-panel-sub">{source === 'live' ? 'Live Zabbix API · read-only' : 'Sample data mode · read-only'}</div>
      </div>
      <div className="cc-problem-tabs">
        {(['All', 'Critical', 'Warning', 'Info'] as Array<SeverityGroup | 'All'>).map((t) => (
          <button key={t} type="button" className={`cc-tab ${tab === t ? 'active' : ''}`} onClick={() => onTab(t)}>
            {t} ({fmt(counts[t] ?? 0)})
          </button>
        ))}
        <span className="cc-spacer" />
        <span className="cc-muted" style={{ fontSize: 8 }}>Showing {shown.length} of {visible.length}</span>
      </div>
      <div className="cc-table-wrap">
        <table className="cc-table cc-problem-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Time</th>
              <th>Severity</th>
              <th>Hostname</th>
              <th>Environment</th>
              <th>Tier</th>
              <th>Business Service</th>
              <th>Problem</th>
              <th>Current Value</th>
              <th>Threshold</th>
              <th>Duration</th>
              <th>SLA Status</th>
              <th>Ack</th>
              <th>Maintenance</th>
              <th>Related / Impact</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p, i) => (
              <tr key={p.id}>
                <td className="cc-muted">{i + 1}</td>
                <td className="cc-muted">{p.time}</td>
                <td className={severityClass(p.severity)}>{p.severity}</td>
                <td className="cc-strong">{p.hostname}</td>
                <td className="cc-muted">{p.environment}</td>
                <td className="cc-muted">{p.tier.replace('Tier ', 'T')}</td>
                <td className="cc-muted">{p.businessService}</td>
                <td>{p.problem}</td>
                <td className="cc-strong">{p.currentValue}</td>
                <td className="cc-muted">{p.threshold}</td>
                <td className="cc-duration">{p.duration}</td>
                <td className={slaClass(p.sla)}>{p.sla}</td>
                <td className={p.ack ? 'cc-ack-yes' : 'cc-ack-no'}>{p.ack ? 'Yes' : 'No'}</td>
                <td className={p.maintenance ? 'cc-ack-yes' : 'cc-muted'}>{p.maintenance ? 'Yes' : 'No'}</td>
                <td className="cc-related">↳ {p.related}</td>
              </tr>
            ))}
            {shown.length === 0 ? (
              <tr><td colSpan={15} className="cc-muted">No problems in this view.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="cc-footer">
        <span>
          {source === 'live'
            ? `Data source: Zabbix API · read-only · refresh: ${refreshLabel}`
            : 'Data source: deterministic sample dataset (1,268 hosts, 76 problems) · no Zabbix calls'}
        </span>
        <span>Time zone: GMT+8</span>
      </div>
    </div>
  );
}
