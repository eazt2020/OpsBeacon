import React, { useEffect, useState } from 'react';
import { FleetAverage, Health, Host, HostDetail, Problem } from './types';
import { fallbackHostDetail, fetchHostDetail, sampleHostDetail } from './data/hostDetail';

const HEALTH_COLOR: Record<Health, string> = {
  healthy: '#00d47e',
  warning: '#ffc107',
  critical: '#ff4d67',
  stale: '#8ea3bf',
  maintenance: '#5fb0ff',
  unavailable: '#ff8a3d',
};

const BAND_COLOR = (value: number) => (value >= 90 ? '#ff4d67' : value >= 70 ? '#ffc107' : '#00d47e');
const BAND_LABEL = (value: number) => (value >= 90 ? 'Critical' : value >= 70 ? 'Warning' : 'Normal');

type MetricKey = 'cpu' | 'memory' | 'disk' | 'network';

const METRICS: Array<{ key: MetricKey; label: string; accent: string }> = [
  { key: 'cpu', label: 'CPU Utilisation', accent: '#2f9bff' },
  { key: 'memory', label: 'Memory Utilisation', accent: '#8b5cf6' },
  { key: 'disk', label: 'Disk Utilisation', accent: '#00d47e' },
  { key: 'network', label: 'Network Utilisation', accent: '#00d4ff' },
];

function Gauge({ value, color }: { value: number; color: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="cc-gauge">
      <svg viewBox="0 0 120 70" role="img" aria-label={`${v.toFixed(0)} percent`}>
        <path
          d="M 12 60 A 48 48 0 0 1 108 60"
          fill="none"
          stroke="#12233c"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 12 60 A 48 48 0 0 1 108 60"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${v} 100`}
        />
        {[70, 90].map((tick) => {
          const angle = Math.PI * (1 - tick / 100);
          const x1 = 60 + 43 * Math.cos(angle);
          const y1 = 60 - 43 * Math.sin(angle);
          const x2 = 60 + 53 * Math.cos(angle);
          const y2 = 60 - 53 * Math.sin(angle);
          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#dbe7f5"
              strokeWidth="1.4"
              opacity="0.55"
            />
          );
        })}
      </svg>
      <div className="cc-gauge-center">
        <strong>{v.toFixed(0)}</strong>
        <span>%</span>
      </div>
    </div>
  );
}

function Sparkline({ values, color }: { values?: number[]; color: string }) {
  if (!values || values.length < 2) {
    return <div className="cc-detail-spark-empty">no history</div>;
  }
  const w = 160;
  const h = 40;
  const pad = 3;
  const n = values.length;
  const point = (value: number, index: number): [number, number] => [
    pad + (index * (w - pad * 2)) / (n - 1),
    h - pad - (Math.max(0, Math.min(100, value)) / 100) * (h - pad * 2),
  ];
  const points = values.map(point);
  const line = points.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `M ${points[0][0]},${h - pad} L ${line.replace(/ /g, ' L ')} L ${
    points[n - 1][0]
  },${h - pad} Z`;
  const last = points[n - 1];
  return (
    <svg className="cc-detail-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <line
        x1={pad}
        y1={h - pad - 0.9 * (h - pad * 2)}
        x2={w - pad}
        y2={h - pad - 0.9 * (h - pad * 2)}
        stroke="#ff4d67"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.35"
      />
      <path d={area} fill={color} opacity="0.12" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.2" fill={color} />
    </svg>
  );
}

function UsageTrack({ value, color, marker }: { value: number; color: string; marker?: number }) {
  return (
    <div className="cc-usage-track">
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
      {marker !== undefined ? (
        <i style={{ left: `${Math.max(0, Math.min(100, marker))}%` }} title={`Fleet average ${marker.toFixed(1)}%`} />
      ) : null}
    </div>
  );
}

function Section({
  title,
  sub,
  className,
  children,
}: {
  title: string;
  sub?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`cc-panel cc-detail-panel ${className || ''}`}>
      <div className="cc-panel-head">
        <div className="cc-panel-title">{title}</div>
        {sub ? <div className="cc-panel-sub">{sub}</div> : null}
      </div>
      <div className="cc-detail-panel-body">{children}</div>
    </div>
  );
}

export function HostDetailModal({
  host,
  problems,
  fleet,
  source,
  inventoryHref,
  onClose,
}: {
  host: Host;
  problems: Problem[];
  fleet: FleetAverage;
  source: 'sample' | 'live';
  inventoryHref?: string;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<HostDetail | null>(() =>
    source === 'sample' ? sampleHostDetail(host) : null
  );
  const [state, setState] = useState<'loading' | 'ready' | 'error'>(
    source === 'sample' ? 'ready' : 'loading'
  );

  useEffect(() => {
    if (source === 'sample') {
      setDetail(sampleHostDetail(host));
      setState('ready');
      return;
    }
    let cancelled = false;
    setDetail(null);
    setState('loading');
    fetchHostDetail(host)
      .then((result) => {
        if (!cancelled) {
          setDetail(result);
          setState('ready');
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setDetail(fallbackHostDetail(host, `Live detail unavailable: ${err.message}`));
          setState('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [host.id, host.hostname, host.cpu, host.memory, host.disk, host.network, source]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const hostProblems = problems
    .filter((p) => p.hostname === host.hostname)
    .slice()
    .sort((a, b) => a.minutesAgo - b.minutesAgo);
  const filesystems = detail ? detail.filesystems : [];
  const healthColor = HEALTH_COLOR[host.health];

  return (
    <div
      className="cc-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="cc-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cc-host-detail-title"
      >
        <div className="cc-modal-head">
          <div>
            <div className="cc-modal-kicker">
              SERVER STATISTICS
              <span className={`cc-modal-source ${source}`}>{source.toUpperCase()}</span>
            </div>
            <div className="cc-modal-title" id="cc-host-detail-title">
              {host.hostname}
            </div>
            <div className="cc-modal-sub">
              {host.environment} · {host.tier} · {host.hostGroup} · {host.os} · {host.businessService}
            </div>
          </div>
          <button type="button" className="cc-modal-close" onClick={onClose} aria-label="Close server statistics">
            ×
          </button>
        </div>

        <div className="cc-modal-body">
          <div className="cc-metric-grid">
            {METRICS.map((metric) => {
              const value = host[metric.key];
              const trend = detail ? detail.trends[metric.key] : undefined;
              return (
                <div className="cc-metric-card" key={metric.key}>
                  <Gauge value={value} color={BAND_COLOR(value)} />
                  <div className="cc-metric-info">
                    <div className="cc-metric-name">{metric.label}</div>
                    <div className="cc-metric-band" style={{ color: BAND_COLOR(value) }}>
                      {BAND_LABEL(value)}
                    </div>
                    <div className="cc-metric-fleet">Fleet avg {fleet[metric.key].toFixed(1)}%</div>
                  </div>
                  <Sparkline values={trend} color={metric.accent} />
                  <div className="cc-metric-foot">
                    {trend && trend.length > 1 ? 'last 24 h' : 'current snapshot'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cc-detail-grid">
            <Section
              title="Filesystem usage"
              sub={
                filesystems.length
                  ? `${filesystems.length} filesystem${filesystems.length === 1 ? '' : 's'}`
                  : undefined
              }
            >
              {!detail ? (
                <div className="cc-detail-empty">Loading filesystem data from Zabbix…</div>
              ) : (
                <div className="cc-fs-list">
                  {filesystems.map((fs) => (
                    <div className="cc-fs-row" key={fs.mount}>
                      <span className="cc-fs-mount" title={fs.mount}>
                        {fs.mount}
                      </span>
                      <UsageTrack value={fs.used} color={BAND_COLOR(fs.used)} />
                      <span className="cc-fs-value" style={{ color: BAND_COLOR(fs.used) }}>
                        {fs.used.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                  <div className="cc-fs-legend">
                    <span>
                      <i style={{ background: '#00d47e' }} /> &lt; 70%
                    </span>
                    <span>
                      <i style={{ background: '#ffc107' }} /> 70–90%
                    </span>
                    <span>
                      <i style={{ background: '#ff4d67' }} /> ≥ 90%
                    </span>
                  </div>
                </div>
              )}
            </Section>

            <Section title="This host vs fleet" sub={`${fleet.hosts} server${fleet.hosts === 1 ? '' : 's'} in view`}>
              <div className="cc-cmp-list">
                {METRICS.map((metric) => (
                  <div className="cc-cmp-row" key={metric.key}>
                    <div className="cc-cmp-top">
                      <span>{metric.label.replace(' Utilisation', '')}</span>
                      <span className="cc-muted">
                        host {host[metric.key].toFixed(1)}% · fleet {fleet[metric.key].toFixed(1)}%
                      </span>
                    </div>
                    <UsageTrack
                      value={host[metric.key]}
                      color={metric.accent}
                      marker={fleet[metric.key]}
                    />
                  </div>
                ))}
                <div className="cc-cmp-legend">Bar = this host · tick = fleet average</div>
              </div>
            </Section>

            <Section title="Host facts">
              <dl className="cc-facts">
                <div>
                  <dt>Health</dt>
                  <dd>
                    <span className="cc-modal-health" style={{ color: healthColor, borderColor: healthColor }}>
                      {host.health}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Connectivity</dt>
                  <dd>{host.connectivity}</dd>
                </div>
                <div>
                  <dt>Data state</dt>
                  <dd>{host.dataState}</dd>
                </div>
                <div>
                  <dt>Last seen</dt>
                  <dd>{host.lastSeenMin >= 9999 ? 'never / not monitored' : `${host.lastSeenMin} min ago`}</dd>
                </div>
                <div>
                  <dt>Maintenance</dt>
                  <dd>{host.maintenance ? 'in maintenance' : 'no'}</dd>
                </div>
                <div>
                  <dt>DR role</dt>
                  <dd>{host.drRole}</dd>
                </div>
                <div>
                  <dt>Active problems</dt>
                  <dd>{hostProblems.length}</dd>
                </div>
                <div>
                  <dt>Zabbix host id</dt>
                  <dd>{host.id}</dd>
                </div>
              </dl>
            </Section>
          </div>

          <Section
            title="Active problems on this server"
            sub={`${hostProblems.length} problem${hostProblems.length === 1 ? '' : 's'}`}
          >
            {hostProblems.length === 0 ? (
              <div className="cc-detail-empty">No active problems for this host.</div>
            ) : (
              <div className="cc-table-wrap">
                <table className="cc-table cc-detail-problems">
                  <thead>
                    <tr>
                      <th>Severity</th>
                      <th>Problem</th>
                      <th>Current</th>
                      <th>Age</th>
                      <th>Ack</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostProblems.map((problem) => (
                      <tr key={problem.id}>
                        <td>
                          <span className={`cc-sev cc-sev-${problem.severity.toLowerCase()}`}>
                            {problem.severity}
                          </span>
                        </td>
                        <td className="cc-detail-problem-name">{problem.problem}</td>
                        <td>{problem.currentValue || '—'}</td>
                        <td>{problem.duration}</td>
                        <td className={problem.ack ? 'cc-ack-yes' : 'cc-ack-no'}>
                          {problem.ack ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>
        </div>

        <div className="cc-modal-foot">
          <span
            className={`cc-detail-note ${
              state === 'error' ? 'error' : detail && detail.partial ? 'partial' : ''
            }`}
          >
            {detail ? detail.note : state === 'loading' ? 'Loading live details from Zabbix…' : ''}
          </span>
          {inventoryHref ? (
            <a className="cc-modal-link" href={inventoryHref}>
              Open in server inventory →
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
