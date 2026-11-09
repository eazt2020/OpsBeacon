import React, { useEffect, useRef, useState } from 'react';
import {
  FleetAverage,
  Health,
  HistoryPoint,
  HistoryRangeKey,
  Host,
  HostDetail,
  HostHistory,
  Problem,
} from './types';
import {
  HISTORY_RANGES,
  HISTORY_RANGE_KEYS,
  fallbackHostDetail,
  fetchHostDetail,
  fetchHostHistory,
  sampleHostDetail,
  sampleHostHistory,
} from './data/hostDetail';

const HEALTH_COLOR: Record<Health, string> = {
  healthy: '#00d47e',
  warning: '#ffc107',
  critical: '#ff3b30',
  stale: '#8f9298',
  maintenance: '#22d3ee',
  unavailable: '#a855f7',
};

const BAND_COLOR = (value: number) => (value >= 90 ? '#ff3b30' : value >= 70 ? '#ffc107' : '#00d47e');
const BAND_LABEL = (value: number) => (value >= 90 ? 'Critical' : value >= 70 ? 'Warning' : 'Normal');

type MetricKey = 'cpu' | 'memory' | 'disk' | 'network';

const METRICS: Array<{ key: MetricKey; label: string; accent: string }> = [
  { key: 'cpu', label: 'CPU Utilisation', accent: '#2f9bff' },
  { key: 'memory', label: 'Memory Utilisation', accent: '#8b5cf6' },
  { key: 'disk', label: 'Disk Utilisation', accent: '#00d47e' },
  { key: 'network', label: 'Network Utilisation', accent: '#00d4ff' },
];

type HistoryTab = MetricKey | 'filesystems';

const HISTORY_TABS: Array<{ key: HistoryTab; label: string; color: string }> = [
  { key: 'cpu', label: 'CPU', color: '#2f9bff' },
  { key: 'memory', label: 'Memory', color: '#8b5cf6' },
  { key: 'disk', label: 'Disk', color: '#00d47e' },
  { key: 'network', label: 'Network', color: '#00d4ff' },
  { key: 'filesystems', label: 'Filesystems', color: '#8f9298' },
];

/** Categorical slots validated against the dark chart surface (adjacent pairs). */
const HISTORY_COLORS = [
  '#3987e5',
  '#d95926',
  '#199e70',
  '#c98500',
  '#d55181',
  '#008300',
  '#9085e9',
  '#e66767',
];

function formatAxisTime(t: number, range: HistoryRangeKey): string {
  const date = new Date(t * 1000);
  if (range === '6h' || range === '24h') {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  if (range === '7d') {
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit' });
  }
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function formatTooltipTime(t: number): string {
  return new Date(t * 1000).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface ChartSeries {
  key: string;
  label: string;
  color: string;
  points: HistoryPoint[];
}

/** Series can have different gaps; align the hover readout by timestamp. */
function nearestPoint(points: HistoryPoint[], t: number): HistoryPoint {
  return points.reduce(
    (best, point) => (Math.abs(point.t - t) < Math.abs(best.t - t) ? point : best),
    points[0]
  );
}

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
          className="cc-gauge-fill"
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
  const w = 240;
  const h = 40;
  const pad = 4;
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
  const maxIndex = values.indexOf(Math.max(...values));
  const minIndex = values.indexOf(Math.min(...values));
  const maxPoint = points[maxIndex];
  const minPoint = points[minIndex];
  const timeLabel = (index: number) => (index === n - 1 ? 'now' : `${n - 1 - index}h ago`);
  return (
    <svg className="cc-detail-spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <line
        x1={pad}
        y1={h - pad - 0.9 * (h - pad * 2)}
        x2={w - pad}
        y2={h - pad - 0.9 * (h - pad * 2)}
        stroke="#ff3b30"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity="0.35"
      />
      <path d={area} fill={color} opacity="0.12" />
      <polyline
        className="cc-spark-line"
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Every sample gets a dot so the line reads point-to-point. */}
      {points.map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r="1.5" fill={color} opacity="0.95">
          <title>{`${values[index].toFixed(1)}% · ${timeLabel(index)}`}</title>
        </circle>
      ))}
      {/* Peak and trough are larger and colour-coded, so the high and low
          points are identifiable without hovering. */}
      <circle
        cx={maxPoint[0]}
        cy={maxPoint[1]}
        r="3"
        fill="#ff3b30"
        stroke="#0a1424"
        strokeWidth="1.2"
      >
        <title>{`Peak ${values[maxIndex].toFixed(1)}% · ${timeLabel(maxIndex)}`}</title>
      </circle>
      <circle
        cx={minPoint[0]}
        cy={minPoint[1]}
        r="3"
        fill="#00d47e"
        stroke="#0a1424"
        strokeWidth="1.2"
      >
        <title>{`Low ${values[minIndex].toFixed(1)}% · ${timeLabel(minIndex)}`}</title>
      </circle>
    </svg>
  );
}

function HistoryChart({
  series,
  from,
  to,
  range,
}: {
  series: ChartSeries[];
  from: number;
  to: number;
  range: HistoryRangeKey;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const width = 720;
  const height = 300;
  const margin = { top: 18, right: 18, bottom: 34, left: 46 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const span = Math.max(1, to - from);
  const xFor = (t: number) => margin.left + ((t - from) / span) * plotW;
  const yFor = (v: number) => margin.top + (1 - Math.max(0, Math.min(100, v)) / 100) * plotH;
  const grid = [0, 25, 50, 75, 100];
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => from + f * span);
  const basePoints = series[0] ? series[0].points : [];
  const count = basePoints.length;
  const hoverIndex = hover !== null && count ? Math.min(hover, count - 1) : null;
  const hoveredT = hoverIndex !== null ? basePoints[hoverIndex].t : null;

  if (!series.length || !count) {
    return <div className="cc-history-empty">No samples in this window.</div>;
  }

  const single = series.length === 1 ? series[0] : null;
  const peakIndex = single
    ? single.points.reduce((best, p, i, arr) => (p.v > arr[best].v ? i : best), 0)
    : -1;
  const lowIndex = single
    ? single.points.reduce((best, p, i, arr) => (p.v < arr[best].v ? i : best), 0)
    : -1;
  const areaPath = single
    ? `M ${xFor(single.points[0].t)},${yFor(0)} L ${single.points
        .map((p) => `${xFor(p.t).toFixed(1)},${yFor(p.v).toFixed(1)}`)
        .join(' L ')} L ${xFor(single.points[single.points.length - 1].t)},${yFor(0)} Z`
    : '';

  return (
    <div className="cc-history-plot">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`History chart for ${series.map((s) => s.label).join(', ')} across ${range}`}
      >
        {grid.map((value) => (
          <g key={value}>
            <line
              x1={margin.left}
              y1={yFor(value)}
              x2={width - margin.right}
              y2={yFor(value)}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
            <text
              x={margin.left - 8}
              y={yFor(value) + 3}
              textAnchor="end"
              className="cc-history-axis-label"
            >
              {value}%
            </text>
          </g>
        ))}

        {single ? (
          <>
            <line
              x1={margin.left}
              y1={yFor(90)}
              x2={width - margin.right}
              y2={yFor(90)}
              stroke="#ff3b30"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.35"
            />
            <line
              x1={margin.left}
              y1={yFor(70)}
              x2={width - margin.right}
              y2={yFor(70)}
              stroke="#ffc107"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.28"
            />
          </>
        ) : null}

        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />
        {xTicks.map((t, index) => (
          <text
            key={index}
            x={xFor(t)}
            y={height - 12}
            textAnchor={index === 0 ? 'start' : index === xTicks.length - 1 ? 'end' : 'middle'}
            className="cc-history-axis-label"
          >
            {formatAxisTime(t, range)}
          </text>
        ))}

        {single ? <path className="cc-history-area" d={areaPath} fill={single.color} /> : null}
        {series.map((s, index) => (
          <polyline
            key={s.key}
            className="cc-history-line"
            pathLength={1}
            points={s.points
              .map((p) => `${xFor(p.t).toFixed(1)},${yFor(p.v).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ animationDelay: `${index * 0.07}s` }}
          />
        ))}

        {single ? (
          <g className="cc-history-dots">
            {single.points.map((point, index) => (
              <circle
                key={index}
                cx={xFor(point.t)}
                cy={yFor(point.v)}
                r="1.7"
                fill={single.color}
                opacity="0.85"
              />
            ))}
          </g>
        ) : null}

        {single && single.points.length ? (
          <g className="cc-history-latest">
            <circle
              cx={xFor(single.points[single.points.length - 1].t)}
              cy={yFor(single.points[single.points.length - 1].v)}
              r="7"
              fill="none"
              stroke={single.color}
              strokeWidth="1.3"
            />
            <circle
              cx={xFor(single.points[single.points.length - 1].t)}
              cy={yFor(single.points[single.points.length - 1].v)}
              r="3"
              fill={single.color}
              stroke="#0a1424"
              strokeWidth="1.2"
            />
          </g>
        ) : null}

        {single ? (
          <>
            <circle
              cx={xFor(single.points[peakIndex].t)}
              cy={yFor(single.points[peakIndex].v)}
              r="3.5"
              fill="#ff3b30"
              stroke="#0a1424"
              strokeWidth="1.4"
            >
              <title>{`Peak ${single.points[peakIndex].v.toFixed(1)}% · ${formatTooltipTime(
                single.points[peakIndex].t
              )}`}</title>
            </circle>
            <circle
              cx={xFor(single.points[lowIndex].t)}
              cy={yFor(single.points[lowIndex].v)}
              r="3.5"
              fill="#00d47e"
              stroke="#0a1424"
              strokeWidth="1.4"
            >
              <title>{`Low ${single.points[lowIndex].v.toFixed(1)}% · ${formatTooltipTime(
                single.points[lowIndex].t
              )}`}</title>
            </circle>
          </>
        ) : null}

        {hoveredT !== null && hoverIndex !== null ? (
          <g>
            <line
              x1={xFor(hoveredT)}
              y1={margin.top}
              x2={xFor(hoveredT)}
              y2={height - margin.bottom}
              stroke="rgba(219,231,245,0.5)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {series.map((s) => {
              const point = nearestPoint(s.points, hoveredT);
              return (
                <circle
                  key={s.key}
                  cx={xFor(point.t)}
                  cy={yFor(point.v)}
                  r="3"
                  fill={s.color}
                  stroke="#0a1424"
                  strokeWidth="1.2"
                />
              );
            })}
          </g>
        ) : null}

        <rect
          x={margin.left}
          y={margin.top}
          width={plotW}
          height={plotH}
          fill="transparent"
          pointerEvents="all"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            if (!rect.width) {
              return;
            }
            const fraction = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
            setHover(Math.round(fraction * (count - 1)));
          }}
          onMouseLeave={() => setHover(null)}
        />
      </svg>

      {hoveredT !== null && hoverIndex !== null ? (
        <div
          className="cc-history-tip"
          style={{
            left: `${Math.min(92, Math.max(8, (xFor(hoveredT) / width) * 100))}%`,
          }}
        >
          <div className="cc-history-tip-time">{formatTooltipTime(hoveredT)}</div>
          {series.map((s) => {
            const point = nearestPoint(s.points, hoveredT);
            return (
              <div className="cc-history-tip-row" key={s.key}>
                <i style={{ background: s.color }} />
                <span>{s.label}</span>
                <b>{point.v.toFixed(1)}%</b>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
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
  const [historyTab, setHistoryTab] = useState<HistoryTab | null>(null);
  const [historyRange, setHistoryRange] = useState<HistoryRangeKey>('24h');
  const [history, setHistory] = useState<HostHistory | null>(null);
  const [historyState, setHistoryState] = useState<'idle' | 'loading' | 'ready' | 'error'>(
    'idle'
  );
  const historyCache = useRef(new Map<HistoryRangeKey, HostHistory>());

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
    historyCache.current.clear();
    setHistoryTab(null);
    setHistory(null);
    setHistoryState('idle');
  }, [host.id, host.hostname]);

  useEffect(() => {
    if (!historyTab) {
      return;
    }
    if (source === 'sample') {
      setHistory(sampleHostHistory(host, historyRange));
      setHistoryState('ready');
      return;
    }
    const cached = historyCache.current.get(historyRange);
    if (cached) {
      setHistory(cached);
      setHistoryState('ready');
      return;
    }
    let cancelled = false;
    const now = Math.floor(Date.now() / 1000);
    setHistory(null);
    setHistoryState('loading');
    fetchHostHistory(host, historyRange)
      .then((result) => {
        if (!cancelled) {
          historyCache.current.set(historyRange, result);
          setHistory(result);
          setHistoryState('ready');
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setHistoryState('error');
          setHistory({
            range: historyRange,
            from: now - HISTORY_RANGES[historyRange].seconds,
            to: now,
            series: {},
            filesystems: [],
            source: 'live',
            partial: true,
            note: `Live history unavailable: ${err.message}`,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [
    historyTab,
    historyRange,
    source,
    host.id,
    host.hostname,
    host.cpu,
    host.memory,
    host.disk,
    host.network,
  ]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (historyTab) {
          setHistoryTab(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, historyTab]);

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

  const historyMeta = METRICS.find((metric) => metric.key === historyTab);
  const historyLabel =
    historyTab === 'filesystems' ? 'All filesystems' : historyMeta ? historyMeta.label : '';
  const chartSeries: ChartSeries[] = [];
  if (history) {
    if (historyTab === 'filesystems') {
      history.filesystems.forEach((fs, index) => {
        chartSeries.push({
          key: fs.mount,
          label: fs.mount,
          color: HISTORY_COLORS[index % HISTORY_COLORS.length],
          points: fs.points,
        });
      });
    } else if (historyTab) {
      const points = history.series[historyTab];
      if (points && points.length && historyMeta) {
        chartSeries.push({
          key: historyTab,
          label: historyMeta.label.replace(' Utilisation', ''),
          color: historyMeta.accent,
          points,
        });
      }
    }
  }
  const singleValues = chartSeries.length === 1 ? chartSeries[0].points.map((p) => p.v) : [];
  const singlePeak = singleValues.length ? Math.max(...singleValues) : 0;
  const singleLow = singleValues.length ? Math.min(...singleValues) : 0;
  const singleAvg = singleValues.length
    ? singleValues.reduce((sum, value) => sum + value, 0) / singleValues.length
    : 0;

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
        <div className="cc-modal-aurora a1" aria-hidden="true" />
        <div className="cc-modal-aurora a2" aria-hidden="true" />
        <div className="cc-modal-beam" aria-hidden="true" />
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
          {historyTab ? (
            <div className="cc-history">
              <div className="cc-history-head">
                <button
                  type="button"
                  className="cc-history-back"
                  onClick={() => setHistoryTab(null)}
                >
                  ← Overview
                </button>
                <div className="cc-history-heading">
                  <div className="cc-history-title">{historyLabel} history</div>
                  <div className="cc-history-sub">
                    {HISTORY_RANGES[historyRange].full}
                    {historyState === 'loading'
                      ? ' · loading from Zabbix…'
                      : history && history.source === 'sample'
                      ? ' · sample dataset'
                      : ' · point-to-point samples'}
                  </div>
                </div>
                <div className="cc-history-ranges" role="group" aria-label="History time range">
                  {HISTORY_RANGE_KEYS.map((key) => (
                    <button
                      type="button"
                      key={key}
                      className={`cc-history-range${key === historyRange ? ' active' : ''}`}
                      aria-pressed={key === historyRange}
                      onClick={() => setHistoryRange(key)}
                    >
                      {HISTORY_RANGES[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cc-history-tabs" role="tablist" aria-label="History metric">
                {HISTORY_TABS.map((tab) => (
                  <button
                    type="button"
                    role="tab"
                    key={tab.key}
                    aria-selected={historyTab === tab.key}
                    className={`cc-history-tab${historyTab === tab.key ? ' active' : ''}`}
                    onClick={() => setHistoryTab(tab.key)}
                  >
                    <i style={{ background: tab.color }} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="cc-panel cc-history-panel">
                <div className="cc-history-panel-head">
                  <div>
                    <div className="cc-history-panel-title">
                      {historyTab === 'filesystems'
                        ? 'Filesystem utilisation'
                        : `${historyLabel.replace(' Utilisation', '')} utilisation`}
                    </div>
                    <div className="cc-history-panel-sub">
                      {HISTORY_RANGES[historyRange].full} · 0–100% scale
                    </div>
                  </div>
                  {singleValues.length ? (
                    <div className="cc-history-stats">
                      <span className="peak">
                        peak <b>{singlePeak.toFixed(1)}%</b>
                      </span>
                      <span className="low">
                        low <b>{singleLow.toFixed(1)}%</b>
                      </span>
                      <span>
                        avg <b>{singleAvg.toFixed(1)}%</b>
                      </span>
                    </div>
                  ) : chartSeries.length ? (
                    <div className="cc-history-stats">
                      <span>
                        <b>{chartSeries.length}</b> series
                      </span>
                    </div>
                  ) : null}
                </div>

                {historyState === 'loading' && !history ? (
                  <div className="cc-history-loading">Loading {HISTORY_RANGES[historyRange].full} from Zabbix…</div>
                ) : (
                  <HistoryChart
                    key={`${historyTab}-${historyRange}`}
                    series={chartSeries}
                    from={history ? history.from : 0}
                    to={history ? history.to : 0}
                    range={historyRange}
                  />
                )}

                {chartSeries.length > 1 ? (
                  <div className="cc-history-legend">
                    {chartSeries.map((s) => {
                      const latest = s.points[s.points.length - 1];
                      return (
                        <span key={s.key}>
                          <i style={{ background: s.color }} />
                          {s.label}
                          {latest ? (
                            <b style={{ color: BAND_COLOR(latest.v) }}>{latest.v.toFixed(0)}%</b>
                          ) : null}
                        </span>
                      );
                    })}
                  </div>
                ) : null}

                {history ? <div className="cc-history-note">{history.note}</div> : null}
              </div>
            </div>
          ) : (
            <>
          <div className="cc-metric-grid">
            {METRICS.map((metric) => {
              const value = host[metric.key];
              const trend = detail ? detail.trends[metric.key] : undefined;
              const hasTrend = !!trend && trend.length > 1;
              const peak = hasTrend ? Math.max(...trend) : 0;
              const low = hasTrend ? Math.min(...trend) : 0;
              return (
                <div
                  className="cc-metric-card cc-metric-click"
                  key={metric.key}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${metric.label} history`}
                  onClick={() => setHistoryTab(metric.key)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setHistoryTab(metric.key);
                    }
                  }}
                >
                  <span className="cc-metric-open" aria-hidden="true">
                    history ↗
                  </span>
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
                    {hasTrend ? (
                      <>
                        <span className="cc-metric-range">
                          <b className="peak">peak {peak.toFixed(0)}%</b>
                          <em>·</em>
                          <b className="low">low {low.toFixed(0)}%</b>
                        </span>
                        <span>last 24 h</span>
                      </>
                    ) : (
                      <span>current snapshot</span>
                    )}
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
                      <i style={{ background: '#ff3b30' }} /> ≥ 90%
                    </span>
                  </div>
                  <button
                    type="button"
                    className="cc-fs-history"
                    onClick={() => setHistoryTab('filesystems')}
                  >
                    View filesystem history →
                  </button>
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
            </>
          )}
        </div>

        <div className="cc-modal-foot">
          <span
            className={`cc-detail-note ${
              state === 'error' || historyState === 'error'
                ? 'error'
                : (!historyTab && detail && detail.partial) || (historyTab && history && history.partial)
                ? 'partial'
                : ''
            }`}
          >
            {historyTab
              ? historyState === 'loading'
                ? 'Loading history from Zabbix…'
                : history
                ? history.note
                : ''
              : detail
              ? detail.note
              : state === 'loading'
              ? 'Loading live details from Zabbix…'
              : ''}
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
