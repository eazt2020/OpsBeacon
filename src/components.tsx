import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { isGrafanaHosted, pluginAsset } from './data/config';
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
  cyan: { tone: '#00d4ff', bg: 'rgba(0, 212, 255, 0.12)' },
  gray: { tone: '#8ea3bf', bg: 'rgba(142, 163, 191, 0.10)' },
};

const GROUP_COLOR: Record<string, string> = {
  PROD: '#2f9bff',
  DR: '#8b5cf6',
  UAT: '#00d4ff',
};

// Must match the .cc-cell-* fills in styles.ts. Kept together so the grid,
// per-tier counts and the legend can never drift apart.
const HEALTH_COLOR: Record<string, string> = {
  healthy: '#00d47e',
  warning: '#ffc107',
  critical: '#ff3b30',
  stale: '#8f9298',
  maintenance: '#22d3ee',
  unavailable: '#a855f7',
};

const FILTER_KEYS: Array<keyof Filters> = ['environment', 'tier', 'hostGroup', 'os', 'businessService'];

const FILTERS_STORAGE_KEY = 'opsbeacon-filters-open';

// Keep the expanded/collapsed filter state per dashboard, so opening the
// Command Center and Data Center Ops in the same browser does not make one
// page's filter toggle change the other's layout.
function filtersStorageKey(): string {
  if (typeof window === 'undefined') {
    return FILTERS_STORAGE_KEY;
  }
  return `${FILTERS_STORAGE_KEY}:${window.location.pathname}`;
}

const fmt = (n: number) => n.toLocaleString('en-US');
const pct = (n: number) => `${n.toFixed(1)}%`;

/** Bundled beacon artwork, served by Grafana from the plugin folder. */
function defaultLogoUrl(): string {
  return isGrafanaHosted() ? pluginAsset('img/logo.png') : '';
}

/**
 * Brand mark used in both page headers. A logo configured in plugin settings
 * wins; otherwise the bundled beacon is shown. If the image cannot be loaded
 * (for example an older deployment that only replaced module.js) the original
 * three-bar mark is kept as a fallback. The standalone preview has no Grafana
 * boot data, so it uses the three-bar mark too.
 */
export function BrandMark({ logoUrl, className }: { logoUrl?: string; className?: string }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [side, setSide] = useState(0);
  const configured = logoUrl || defaultLogoUrl();
  const src = configured && configured !== failedSrc ? configured : '';

  // Both headers put the title block immediately after the mark. Mirror its
  // height into a square so the logo is exactly as tall as the text beside it.
  useLayoutEffect(() => {
    const box = boxRef.current;
    const text = box && (box.nextElementSibling as HTMLElement | null);
    if (!text) {
      return;
    }
    const measure = () => {
      const height = Math.round(text.getBoundingClientRect().height);
      if (height > 0) {
        setSide(height);
      }
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(text);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className={`cc-logo${src ? ' cc-logo-image' : ''}${className ? ` ${className}` : ''}`}
      style={src && side ? { width: side, height: side } : undefined}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt="" onError={() => setFailedSrc(src)} />
      ) : (
        <>
          <span style={{ background: '#28a9ff' }} />
          <span style={{ background: '#00d47e' }} />
          <span style={{ background: '#ffb020' }} />
        </>
      )}
    </div>
  );
}

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

/**
 * The clock is isolated in its own component so its one-second tick does not
 * re-render the whole dashboard (and, when both command centers are open, does
 * not reconcile thousands of host cells every second).
 */
function HeaderClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
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
    <div className="cc-clock">
      <div className="cc-clock-date">{date}</div>
      <div className="cc-clock-time">{time}</div>
      <div className="cc-clock-zone">(GMT+8)</div>
    </div>
  );
}

export function Header({
  filters,
  onChange,
  options,
  source,
  onSource,
  connection,
  version,
  hostCount,
  lastSync,
  canGoLive,
  sampleEnabled = true,
  brandName = 'OPSBEACON',
  brandTagline = 'REAL-TIME INFRASTRUCTURE HEALTH',
  logoUrl,
  title = 'INFRASTRUCTURE OPERATIONS COMMAND CENTER',
  subtitle = 'All Servers  |  500 - 1,500 Servers  |  Real-time Infrastructure Health from Zabbix',
}: {
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  options: FilterOptions;
  source: 'sample' | 'live';
  onSource: (s: 'sample' | 'live') => void;
  connection: ConnectionState;
  version?: string;
  hostCount?: number;
  lastSync?: string;
  canGoLive: boolean;
  sampleEnabled?: boolean;
  brandName?: string;
  brandTagline?: string;
  logoUrl?: string;
  title?: string;
  subtitle?: string;
}) {
  const [filtersOpen, setFiltersOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    try {
      return window.localStorage.getItem(filtersStorageKey()) !== 'closed';
    } catch (e) {
      return true;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(filtersStorageKey(), filtersOpen ? 'open' : 'closed');
    } catch (e) {
      /* localStorage can be unavailable inside embedded previews. */
    }
  }, [filtersOpen]);
  const activeValues = FILTER_KEYS.map((key) => filters[key]).filter((value) => value !== 'All');
  const filtersActive = activeValues.length > 0;
  const resetFilters = () => FILTER_KEYS.forEach((key) => onChange(key, 'All'));

  return (
    <div className="cc-header">
      <div className="cc-brand">
        <BrandMark logoUrl={logoUrl} />
        <div>
          <div className="cc-eyebrow">
            {brandName} <span>·</span> {brandTagline}
          </div>
          <div className="cc-title">{title}</div>
          <div className="cc-subtitle">{subtitle}</div>
        </div>
      </div>

      <div
        className={`cc-header-filters${filtersOpen ? '' : ' collapsed'}${filtersActive ? ' is-filtered' : ''}`}
        role="group"
        aria-label="Dashboard filters"
      >
        <button
          type="button"
          className="cc-filter-toggle"
          aria-expanded={filtersOpen}
          title={filtersOpen ? 'Hide filters' : 'Show filters'}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <span className="cc-filter-caret" aria-hidden="true">▾</span>
          <span>Filters</span>
          {filtersActive ? <span className="cc-filter-badge">{activeValues.length}</span> : null}
        </button>
        <span className="cc-filter-summary" hidden={!filtersActive}>
          {activeValues.join(' · ')}
        </span>
        <div className="cc-filter-controls">
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
          <button type="button" className="cc-filter-reset" title="Reset filters" onClick={resetFilters}>
            Reset
          </button>
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
        <HeaderClock />
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

const SEVERITY_RANK: Record<string, number> = { Critical: 0, High: 1, Warning: 2, Info: 3 };

/**
 * Marquee strip of active problems that sits directly under the header, matching
 * the concept build. Problems are ordered by severity then recency, and the list
 * is repeated so a narrow track still loops seamlessly.
 */
export function LiveProblemsTicker({
  problems,
  onHost,
}: {
  problems: Problem[];
  onHost?: (hostname: string) => void;
}) {
  const ranked = useMemo(() => {
    const sorted = [...problems].sort(
      (a, b) =>
        (SEVERITY_RANK[a.severity] ?? 9) - (SEVERITY_RANK[b.severity] ?? 9) ||
        b.minutesAgo - a.minutesAgo
    );
    // Lead with the worst offenders but keep a couple of lower severities in
    // view, the way the concept strip mixes Critical and Warning items.
    const take = (group: SeverityGroup, n: number) =>
      sorted.filter((p) => p.severityGroup === group).slice(0, n);
    const picks = [...take('Critical', 10), ...take('Warning', 3), ...take('Info', 1)];
    const seen = new Set(picks.map((p) => p.id));
    for (const p of sorted) {
      if (picks.length >= 14) {
        break;
      }
      if (!seen.has(p.id)) {
        picks.push(p);
        seen.add(p.id);
      }
    }
    return picks;
  }, [problems]);
  // One pass of the ranked list per loop. The list is followed by a
  // viewport-wide blank spacer, so the strip is always wider than the screen
  // even with a single problem, and each restart is preceded by a full empty
  // sweep instead of running straight into the next copy.
  const items = ranked;

  // Drive the marquee at a constant reading speed instead of a fixed loop
  // time: with 14 long problem rows a 38s loop races past the viewport.
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(80);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const measure = () => {
      // Two identical sets make up the track, so one set is half its width.
      const setWidth = track.scrollWidth / 2;
      if (setWidth > 0) {
        setDuration(Math.min(400, Math.max(45, Math.round(setWidth / 46))));
      }
    };
    // scrollWidth forces a synchronous layout of the whole dashboard. On the
    // first render the host hive is still being committed, so wait until after
    // the first paint instead of extending the mount task by ~100 ms.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(measure);
    });
    if (typeof ResizeObserver === 'undefined') {
      return () => cancelAnimationFrame(frame);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

  const renderSet = (hidden: boolean) => (
    <div className="cc-ticker-set" aria-hidden={hidden ? 'true' : undefined}>
      {items.map((p, i) => (
        <span className="cc-ticker-item" key={`${p.id}-${i}`}>
          <span className={`cc-sev cc-ticker-sev cc-sev-${p.severity.toLowerCase()}`}>{p.severity}</span>
          {p.problem}
          {onHost ? (
            <button
              type="button"
              className="cc-ticker-host"
              tabIndex={hidden ? -1 : undefined}
              onClick={() => onHost(p.hostname)}
            >
              {p.hostname}
            </button>
          ) : (
            <b>{p.hostname}</b>
          )}
          <em>{p.duration}</em>
        </span>
      ))}
      {/* Full-width blank sweep before the strip loops back to the first problem. */}
      <span className="cc-ticker-gap" key="gap-end" aria-hidden="true" />
    </div>
  );

  return (
    <div className="cc-ticker" aria-label="Active problems">
      <div className="cc-ticker-label">
        <span className="cc-live-dot amber" aria-hidden="true" />
        LIVE PROBLEMS
      </div>
      <div className="cc-ticker-viewport">
        <div className="cc-ticker-track" ref={trackRef} style={{ animationDuration: `${duration}s` }}>
          {renderSet(false)}
          {renderSet(true)}
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
  const alert = tone === 'red';
  const className = `cc-kpi${alert ? ' cc-kpi-alert' : ''}`;
  const beam = alert ? <span className="cc-beam" aria-hidden="true" /> : null;
  if (href) {
    return (
      <a
        className={`${className} cc-kpi-link`}
        style={style}
        data-tone={tone}
        href={href}
        title={`Open the server list for ${label.toLowerCase()}`}
      >
        {beam}
        {body}
      </a>
    );
  }
  return (
    <div className={className} style={style} data-tone={tone}>
      {beam}
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
  const rounded = Math.round(avg);
  const band =
    avg >= 90
      ? { color: '#ff4d67', label: 'Critical' }
      : avg >= 70
      ? { color: '#ffc107', label: 'Warning' }
      : { color: '#00d47e', label: 'Normal' };
  return (
    <div className="cc-panel" style={{ '--accent': accent } as React.CSSProperties}>
      <div className="cc-panel-head">
        <div className="cc-panel-title">{title}</div>
        <div className="cc-panel-sub">{sub}</div>
      </div>
      <div className="cc-util-body">
        <div
          className="cc-ring"
          style={{ '--p': rounded, '--fill': band.color } as React.CSSProperties}
          role="img"
          aria-label={`${title}: ${rounded}% average, ${band.label} band`}
        >
          <div className="cc-ring-inner">
            <strong>{rounded}%</strong>
            <span>avg</span>
          </div>
        </div>
        <div className="cc-util-right">
          <div
            className="cc-stackbar"
            role="img"
            aria-label={`${fmt(critical)} critical, ${fmt(warning)} warning, ${fmt(normal)} normal`}
          >
            <span className="cc-seg crit" style={{ flexGrow: critical }} />
            <span className="cc-seg warn" style={{ flexGrow: warning }} />
            <span className="cc-seg ok" style={{ flexGrow: normal }} />
          </div>
          <div className="cc-legend">
            <div className="cc-legend-row">
              <span className="cc-dot" style={{ background: '#ff4d67' }} />
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

export function GroupPanel({
  group: g,
  onSelect,
}: {
  group: GroupSummary;
  onSelect?: (host: Host) => void;
}) {
  const c = groupCounts(g.tiers.flatMap((t) => t.hosts));
  return (
    <div className="cc-panel cc-group" style={{ '--group': GROUP_COLOR[g.key] } as React.CSSProperties}>
      <div className="cc-group-head">
        <div className="cc-group-name">
          <span className={`cc-env-dot ${g.key.toLowerCase()}`} aria-hidden="true" />
          {g.name}
          <span className="cc-group-total">{fmt(g.total)}</span>
        </div>
        <div className="cc-group-legend">
          <span className="cc-lg ok"><i />{fmt(c.healthy)} healthy</span>
          <span className="cc-lg warn"><i />{fmt(c.warning)} warning</span>
          <span className="cc-lg crit"><i />{fmt(c.critical)} critical</span>
          <span className="cc-lg other"><i />{fmt(c.stale + c.maintenance + c.unavailable)} other</span>
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
                  <span style={{ color: HEALTH_COLOR.healthy }} title={`${tc.healthy} healthy`}>{tc.healthy}</span>
                  <span style={{ color: HEALTH_COLOR.warning }} title={`${tc.warning} warning`}>{tc.warning}</span>
                  <span style={{ color: HEALTH_COLOR.critical }} title={`${tc.critical} critical`}>{tc.critical}</span>
                  <span style={{ color: HEALTH_COLOR.stale }} title={`${tc.stale} stale`}>{tc.stale}</span>
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
        <span><i className="cc-dot" style={{ background: HEALTH_COLOR.healthy }} /> Healthy</span>
        <span><i className="cc-dot" style={{ background: HEALTH_COLOR.warning }} /> Warning</span>
        <span><i className="cc-dot" style={{ background: HEALTH_COLOR.critical }} /> Critical</span>
        <span><i className="cc-dot cc-dot-stale" /> Stale</span>
        <span><i className="cc-dot" style={{ background: HEALTH_COLOR.maintenance }} /> Maintenance</span>
        <span><i className="cc-dot" style={{ background: HEALTH_COLOR.unavailable }} /> Unavailable</span>
      </div>
    </div>
  );
}

// The hive renders one button per monitored host (over a thousand on a large
// estate). Memoising it keeps the grid out of unrelated re-renders such as
// opening the host drawer, where only the selected host changes.
export const GroupGrids = React.memo(function GroupGrids({
  groups,
  onSelect,
}: {
  groups: GroupSummary[];
  onSelect?: (host: Host) => void;
}) {
  return (
    <div className="cc-groups">
      {groups.map((g) => (
        <GroupPanel key={g.key} group={g} onSelect={onSelect} />
      ))}
    </div>
  );
});

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
  onHost,
}: {
  rows: TopServerRow[];
  resource: ResourceKey;
  onResource: (r: ResourceKey) => void;
  onHost?: (hostname: string) => void;
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
                <td className="cc-strong">
                  {onHost ? (
                    <button type="button" className="cc-host-link" onClick={() => onHost(r.hostname)}>
                      {r.hostname}
                    </button>
                  ) : (
                    r.hostname
                  )}
                </td>
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

const ENV_ORDER: Record<string, number> = { PROD: 0, DR: 1, UAT: 2 };

/**
 * Servers currently in a Zabbix maintenance window. Used by the Data Center
 * Operations dashboard so the maintenance KPI can be inspected host by host.
 */
export function MaintenanceTable({
  hosts,
  onHost,
}: {
  hosts: Host[];
  onHost?: (hostname: string) => void;
}) {
  const rows = [...hosts].sort(
    (a, b) =>
      (ENV_ORDER[a.environment] ?? 9) - (ENV_ORDER[b.environment] ?? 9) ||
      a.tier.localeCompare(b.tier) ||
      a.hostname.localeCompare(b.hostname)
  );
  return (
    <div className="cc-panel">
      <div className="cc-panel-head">
        <div className="cc-panel-title">Servers in Maintenance ({fmt(hosts.length)})</div>
        <div className="cc-panel-sub">Not counted as available while the maintenance window is active</div>
      </div>
      <div className="cc-maintenance-scroll">
        <div className="cc-table-wrap">
          <table className="cc-table cc-maintenance-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Hostname</th>
                <th>Environment</th>
                <th>Tier</th>
                <th className="cc-col-secondary">Business Service</th>
                <th className="cc-col-secondary">OS</th>
                <th>Last Data</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((h, i) => (
                <tr key={h.id}>
                  <td className="cc-muted">{i + 1}</td>
                  <td className="cc-strong">
                    {onHost ? (
                      <button type="button" className="cc-host-link" onClick={() => onHost(h.hostname)}>
                        {h.hostname}
                      </button>
                    ) : (
                      h.hostname
                    )}
                  </td>
                  <td className="cc-muted">{h.environment}</td>
                  <td className="cc-muted">{h.tier.replace('Tier ', 'T')}</td>
                  <td className="cc-muted cc-col-secondary">{h.businessService}</td>
                  <td className="cc-muted cc-col-secondary">{h.os}</td>
                  <td className="cc-muted">{fmt(h.lastSeenMin)}m ago</td>
                  <td>
                    <span className="cc-maintenance-state">
                      <i aria-hidden="true" />
                      Maintenance
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="cc-muted">
                    No servers are in maintenance for the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
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
  onHost,
  title = 'Active Problems',
  tabs = ['All', 'Critical', 'Warning', 'Info'],
}: {
  problems: Problem[];
  tab: SeverityGroup | 'All';
  onTab: (t: SeverityGroup | 'All') => void;
  counts: Record<SeverityGroup | 'All', number>;
  source: 'sample' | 'live';
  refreshSeconds?: number;
  onHost?: (hostname: string) => void;
  title?: string;
  tabs?: Array<SeverityGroup | 'All'>;
}) {
  const refreshLabel =
    refreshSeconds && refreshSeconds >= 60 && refreshSeconds % 60 === 0
      ? `${refreshSeconds / 60}m`
      : `${refreshSeconds || 60}s`;
  const visible = problems.filter((p) => tab === 'All' || p.severityGroup === tab);
  const shown = visible;
  return (
    <div className="cc-panel cc-problems">
      <div className="cc-panel-head">
        <div className="cc-panel-title">{title} ({fmt(problems.length)})</div>
        <div className="cc-panel-sub">{source === 'live' ? 'Live Zabbix API · read-only' : 'Sample data mode · read-only'}</div>
      </div>
      <div className="cc-problem-tabs">
        {tabs.map((t) => (
          <button key={t} type="button" className={`cc-tab ${tab === t ? 'active' : ''}`} onClick={() => onTab(t)}>
            {t} ({fmt(counts[t] ?? 0)})
          </button>
        ))}
        <span className="cc-spacer" />
        <span className="cc-muted" style={{ fontSize: 8 }}>Showing {fmt(shown.length)} of {fmt(problems.length)}</span>
      </div>
      <div className="cc-problem-scroll">
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
                <td className="cc-strong">
                  {onHost ? (
                    <button type="button" className="cc-host-link" onClick={() => onHost(p.hostname)}>
                      {p.hostname}
                    </button>
                  ) : (
                    p.hostname
                  )}
                </td>
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
