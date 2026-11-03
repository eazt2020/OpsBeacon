export const CSS = `
.cc-app {
  min-height: 100vh;
  margin: 0;
  padding: 14px 16px 26px;
  background:
    radial-gradient(1200px 500px at 15% -10%, rgba(20, 70, 140, 0.20), transparent 60%),
    radial-gradient(900px 400px at 85% -5%, rgba(0, 120, 90, 0.10), transparent 60%),
    #050a13;
  color: #dbe7f5;
  font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
}
.cc-app * { box-sizing: border-box; }
.cc-app select { font-family: inherit; }

.cc-header { display: flex; gap: 16px; align-items: flex-start; flex-wrap: wrap; margin-bottom: 13px; }
.cc-brand { display: flex; gap: 12px; align-items: center; min-width: 330px; }
.cc-logo { display: flex; gap: 3px; align-items: stretch; height: 38px; }
.cc-logo span { display: block; width: 9px; border-radius: 2px; }
.cc-title { font-size: 26px; font-weight: 800; letter-spacing: 0.4px; line-height: 0.95; white-space: nowrap; }
.cc-subtitle { font-size: 10.5px; color: #8ea3bf; margin-top: 6px; letter-spacing: 0.2px; white-space: nowrap; }
.cc-filters { display: flex; gap: 9px; flex-wrap: wrap; align-items: flex-end; flex: 1; }
.cc-filter { min-width: 104px; }
.cc-filter label { display: block; font-size: 8px; text-transform: uppercase; letter-spacing: 0.7px; color: #7f95b2; margin-bottom: 3px; }
.cc-filter select {
  width: 100%; background: #0b1627; border: 1px solid #203554; color: #dbe7f5;
  border-radius: 5px; padding: 5px 7px; font-size: 10.5px; outline: none; cursor: pointer;
}
.cc-filter select:focus { border-color: #2b6ca3; box-shadow: 0 0 0 2px rgba(43, 108, 163, 0.18); }
.cc-header-right { display: flex; gap: 10px; margin-left: auto; align-items: stretch; }
.cc-clock { text-align: right; padding: 2px 4px; }
.cc-clock-date { font-size: 10px; color: #8ea3bf; }
.cc-clock-time { font-size: 21px; font-weight: 700; line-height: 1.15; font-variant-numeric: tabular-nums; letter-spacing: 0.3px; }
.cc-clock-zone { font-size: 8.5px; color: #7f95b2; }
.cc-zabbix {
  display: flex; align-items: center; gap: 9px; min-width: 158px;
  background: linear-gradient(180deg, rgba(9, 34, 25, 0.82), rgba(6, 20, 16, 0.82));
  border: 1px solid #1c4a36; border-radius: 8px; padding: 7px 10px;
}
.cc-zabbix-dot { width: 8px; height: 8px; border-radius: 50%; background: #00e676; box-shadow: 0 0 10px rgba(0, 230, 118, 0.9); flex: 0 0 auto; }
.cc-zabbix-label { font-size: 12px; font-weight: 800; letter-spacing: 0.6px; color: #9ff3c5; }
.cc-zabbix-sub { font-size: 8.5px; color: #6fbf94; margin-top: 1px; }
.cc-sample-badge {
  font-size: 7.5px; font-weight: 800; letter-spacing: 0.6px; color: #ffc107;
  border: 1px solid #5b4a14; background: rgba(255, 193, 7, 0.08); border-radius: 3px;
  padding: 1px 4px; margin-left: auto;
}
.cc-sample-badge.is-live { color: #00e676; border-color: #1c4a36; background: rgba(0, 230, 118, 0.08); }
.cc-sample-badge.is-error { color: #ff4d67; border-color: #5b1c26; background: rgba(255, 77, 103, 0.08); }
.cc-zabbix.is-error {
  border-color: #5b1c26;
  background: linear-gradient(180deg, rgba(52, 10, 16, 0.82), rgba(26, 6, 9, 0.82));
}
.cc-zabbix.is-error .cc-zabbix-dot { background: #ff4d67; box-shadow: 0 0 10px rgba(255, 77, 103, 0.9); }
.cc-zabbix.is-loading .cc-zabbix-dot { background: #ffc107; box-shadow: 0 0 10px rgba(255, 193, 7, 0.9); animation: cc-pulse 1s infinite; }
.cc-zabbix.is-sample .cc-zabbix-dot { background: #ffc107; box-shadow: 0 0 8px rgba(255, 193, 7, 0.55); }
@keyframes cc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.cc-mode { display: flex; align-self: center; border: 1px solid #1c314e; border-radius: 6px; overflow: hidden; }
.cc-mode button {
  background: #0b1728; color: #8ea3bf; border: 0; padding: 5px 9px;
  font-size: 8.5px; font-weight: 800; letter-spacing: 0.5px; cursor: pointer; font-family: inherit;
}
.cc-mode button:hover { color: #fff; }
.cc-mode button.active { background: #16324f; color: #fff; }
.cc-mode .cc-mode-note {
  padding: 5px 9px; font-size: 8.5px; font-weight: 800; letter-spacing: 0.5px;
  background: #16324f; color: #dfe9f6; white-space: nowrap;
}
.cc-banner {
  display: flex; gap: 8px; align-items: center; margin: 0 0 9px; padding: 7px 10px;
  border: 1px solid #5b1c26; border-radius: 6px; background: rgba(255, 61, 87, 0.08);
  color: #ffb3bf; font-size: 10px;
}
.cc-banner strong { color: #ff4d67; font-weight: 800; }
.cc-banner.warn { border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); color: #ffe08a; }
.cc-banner.warn strong { color: #ffc107; }
.cc-banner-btn {
  margin-left: auto; appearance: none; cursor: pointer; font-family: inherit;
  font-size: 9px; font-weight: 700; color: #ffe08a; background: rgba(255, 193, 7, 0.12);
  border: 1px solid #5b4a14; border-radius: 4px; padding: 4px 9px; white-space: nowrap;
}
.cc-banner-btn:hover { background: rgba(255, 193, 7, 0.2); }

.cc-kpis { display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); gap: 8px; margin-bottom: 9px; }
.cc-kpi {
  position: relative; display: flex; gap: 8px; align-items: center;
  background: linear-gradient(180deg, #0a1526, #07101d);
  border: 1px solid #1a2c48; border-radius: 8px; padding: 8px 9px; min-height: 59px;
  overflow: hidden;
}
.cc-kpi::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
  background: var(--tone); box-shadow: 0 0 12px var(--tone);
}
.cc-kpi-icon {
  width: 27px; height: 27px; border-radius: 5px; display: flex; align-items: center; justify-content: center;
  background: var(--tone-bg); color: var(--tone); flex: 0 0 auto;
}
.cc-kpi-body { min-width: 0; }
.cc-kpi-label { font-size: 7.8px; text-transform: uppercase; letter-spacing: 0.6px; color: #8ea3bf; white-space: nowrap; }
.cc-kpi-value { font-size: 21px; font-weight: 800; line-height: 1.15; font-variant-numeric: tabular-nums; letter-spacing: 0.2px; }
.cc-kpi-sub { font-size: 8.5px; color: #7f95b2; margin-top: 1px; white-space: nowrap; }
.cc-kpi-delta { font-size: 8px; font-weight: 700; margin-left: 3px; }
.cc-delta-up { color: #ff8a3d; }
.cc-delta-down { color: #00d47e; }
.cc-kpi-link {
  color: inherit; text-decoration: none; cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
}
.cc-kpi-link:hover {
  border-color: #2f6ea8;
  background: linear-gradient(180deg, #0d1d33, #081422);
  box-shadow: 0 0 0 1px rgba(47, 155, 255, 0.18), 0 4px 14px rgba(0, 0, 0, 0.35);
}
.cc-kpi-link:focus-visible { outline: 2px solid #2f9bff; outline-offset: 1px; }
.cc-kpi-link::after {
  content: "›"; position: absolute; top: 3px; right: 7px;
  font-size: 12px; line-height: 1; color: #5f83ad; opacity: 0.6;
}
.cc-kpi-link:hover::after { color: #9cc9ff; opacity: 1; }

.cc-util-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }
.cc-panel {
  background: linear-gradient(180deg, #091426, #060e19);
  border: 1px solid #182a44; border-radius: 9px; overflow: hidden;
  min-width: 0;
}
.cc-panel-head {
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  padding: 7px 10px; border-bottom: 1px solid #14253c;
  background: linear-gradient(90deg, rgba(20, 40, 70, 0.35), transparent);
}
.cc-panel-title { font-size: 10.5px; font-weight: 700; letter-spacing: 0.45px; text-transform: uppercase; white-space: nowrap; }
.cc-panel-sub { font-size: 8.5px; color: #6f86a3; white-space: nowrap; }

.cc-util-body { display: flex; gap: 8px; padding: 8px 10px 9px; align-items: center; }
.cc-donut { position: relative; width: 88px; height: 88px; flex: 0 0 auto; }
.cc-donut svg { width: 100%; height: 100%; display: block; }
.cc-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cc-donut-value { font-size: 17px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.cc-donut-unit { font-size: 7.5px; color: #8ea3bf; margin-top: 2px; }
.cc-bars { display: flex; align-items: flex-end; gap: 2px; height: 52px; flex: 1; min-width: 34px; }
.cc-bar { flex: 1; min-width: 2px; border-radius: 1px 1px 0 0; opacity: 0.9; }
.cc-legend { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.cc-legend-row { display: flex; align-items: center; gap: 5px; font-size: 8.5px; color: #9db0c9; }
.cc-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; flex: 0 0 auto; }
.cc-legend-label { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cc-legend-value { font-weight: 700; color: #dbe7f5; font-variant-numeric: tabular-nums; }

.cc-groups { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }
.cc-group { border-top: 2px solid var(--group); }
.cc-group-head { display: flex; align-items: center; gap: 8px; padding: 7px 10px 6px; }
.cc-group-name { font-size: 12.5px; font-weight: 800; letter-spacing: 0.45px; white-space: nowrap; }
.cc-group-total { font-size: 9.5px; color: #8ea3bf; }
.cc-group-chips { display: flex; gap: 5px; margin-left: auto; }
.cc-chip {
  display: inline-flex; align-items: center; gap: 3px; font-size: 8.5px; font-weight: 700;
  padding: 2px 5px; border-radius: 4px; background: #0c1a2c; border: 1px solid #1c314e;
  font-variant-numeric: tabular-nums; white-space: nowrap;
}
.cc-chip-green { color: #00e676; }
.cc-chip-yellow { color: #ffc107; }
.cc-chip-red { color: #ff4d67; }
.cc-chip-gray { color: #8ea3bf; }
.cc-grid-wrap { padding: 6px 10px 7px; }
.cc-tier-row { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px; }
.cc-tier-label { width: 104px; flex: 0 0 auto; }
.cc-tier-title { font-size: 9.5px; font-weight: 700; white-space: nowrap; }
.cc-tier-sub { font-size: 8px; color: #6f86a3; white-space: nowrap; }
.cc-tier-counts { display: flex; gap: 4px; margin-top: 2px; }
.cc-tier-counts span { font-size: 7.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.cc-host-grid { display: flex; flex-wrap: wrap; gap: 2px; flex: 1; align-content: flex-start; min-height: 10px; }
.cc-cell { width: 8px; height: 8px; border-radius: 1.5px; opacity: 0.96; }
.cc-cell:hover { outline: 1px solid #fff; }
.cc-cell-btn {
  appearance: none; border: 0; padding: 0; font: inherit; cursor: pointer;
  transition: transform 0.1s ease;
}
.cc-cell-btn:hover { transform: scale(1.45); position: relative; z-index: 2; }
.cc-cell-btn:focus-visible { outline: 2px solid #fff; outline-offset: 1px; position: relative; z-index: 3; }
.cc-cell-healthy { background: #00d47e; }
.cc-cell-warning { background: #ffc107; }
.cc-cell-critical { background: #ff3d57; }
.cc-cell-stale { background: #67768a; }
.cc-cell-maintenance { background: #3b82f6; }
.cc-cell-unavailable { background: #9f1239; }
.cc-legend-inline {
  display: flex; flex-wrap: wrap; gap: 9px; padding: 5px 10px 7px;
  border-top: 1px solid #13243a; font-size: 7.8px; color: #7f95b2;
}
.cc-legend-inline span { display: inline-flex; align-items: center; gap: 4px; }

.cc-bottom { display: grid; grid-template-columns: 1.08fr 1.18fr 0.55fr 1.12fr; gap: 9px; margin-bottom: 9px; }
.cc-table-wrap { overflow-x: auto; }
.cc-table { width: 100%; border-collapse: collapse; font-size: 9px; }
.cc-table th {
  text-align: left; font-size: 7.4px; text-transform: uppercase; letter-spacing: 0.5px;
  color: #6f86a3; padding: 4px 6px; border-bottom: 1px solid #18304d; white-space: nowrap; font-weight: 700;
}
.cc-table td { padding: 4px 6px; border-bottom: 1px solid #101e31; white-space: nowrap; color: #b9c9dd; }
.cc-table tr:last-child td { border-bottom: 0; }
.cc-table tr:hover td { background: #0c1a2c; }
.cc-table tr.cc-row-link { cursor: pointer; }
.cc-table tr.cc-row-link:hover td { background: #0d2036; }
.cc-table tr.cc-row-link:focus-visible { outline: 2px solid #2f9bff; outline-offset: -2px; }
.cc-row-anchor {
  display: inline-flex; align-items: center; gap: 4px;
  color: #e6f0fb; text-decoration: none; font-weight: 700;
}
.cc-row-anchor:hover { color: #7fc4ff; text-decoration: underline; }
.cc-row-arrow { color: #5f83ad; font-size: 11px; line-height: 1; }
.cc-row-link:hover .cc-row-arrow { color: #9cc9ff; }
.cc-table .num { text-align: right; font-variant-numeric: tabular-nums; }
.cc-status { font-weight: 800; font-size: 8.5px; }
.cc-status-critical { color: #ff4d67; }
.cc-status-high { color: #ff8a3d; }
.cc-status-warning { color: #ffc107; }
.cc-status-healthy { color: #00d47e; }
.cc-muted { color: #6f86a3; }
.cc-strong { color: #e6f0fb; font-weight: 700; }

.cc-freshness-body { display: flex; flex-direction: column; align-items: center; padding: 7px 8px 8px; }
.cc-freshness .cc-donut { width: 108px; height: 108px; }
.cc-freshness-legend { width: 100%; margin-top: 5px; display: flex; flex-direction: column; gap: 3px; }
.cc-freshness-legend .cc-legend-row { font-size: 8px; }

.cc-tabs { display: flex; gap: 4px; padding: 5px 8px; border-bottom: 1px solid #14253c; }
.cc-tab {
  font-size: 8.2px; padding: 3px 8px; border-radius: 4px; border: 1px solid #1c314e;
  background: #0b1728; color: #8ea3bf; cursor: pointer; font-weight: 700;
}
.cc-tab:hover { color: #dbe7f5; border-color: #2b5a86; }
.cc-tab.active { background: #16324f; color: #fff; border-color: #2b5a86; }
.cc-spark { width: 64px; height: 18px; display: block; }
.cc-bar-cell { display: flex; align-items: center; gap: 5px; }
.cc-mini-track { display: inline-block; width: 44px; height: 5px; border-radius: 3px; background: #12233a; overflow: hidden; }
.cc-mini-fill { display: block; height: 100%; border-radius: 3px; background: linear-gradient(90deg, #ffb020, #ff6b35); }

.cc-problems { margin-bottom: 2px; }
.cc-problem-tabs { display: flex; align-items: center; gap: 5px; padding: 6px 9px; border-bottom: 1px solid #14253c; }
.cc-problem-tabs .cc-spacer { flex: 1; }
.cc-problem-table { font-size: 8.8px; }
.cc-problem-table td { padding: 4px 6px; }
.cc-sev { font-weight: 800; text-transform: uppercase; font-size: 8px; letter-spacing: 0.2px; }
.cc-sev-critical { color: #ff4d67; }
.cc-sev-high { color: #ff8a3d; }
.cc-sev-warning { color: #ffc107; }
.cc-sev-info { color: #5fb0ff; }
.cc-duration { color: #ffc107; font-weight: 700; }
.cc-sla-within { color: #00e676; font-weight: 700; }
.cc-sla-risk { color: #ffc107; font-weight: 700; }
.cc-sla-breach { color: #ff4d67; font-weight: 700; }
.cc-ack-yes { color: #00d47e; }
.cc-ack-no { color: #ff4d67; }
.cc-related { color: #7fc4ff; }
.cc-footer { display: flex; justify-content: space-between; color: #5f7591; font-size: 8px; padding: 6px 2px 0; }

.cc-modal-backdrop {
  position: fixed; inset: 0; z-index: 1080; display: flex; align-items: flex-start;
  justify-content: center; padding: 22px 16px; overflow-y: auto;
  background: rgba(2, 7, 14, 0.78); backdrop-filter: blur(3px);
}
.cc-modal {
  position: relative; display: flex; flex-direction: column; width: min(1000px, 100%);
  max-height: calc(100vh - 44px); margin: auto; overflow: hidden;
  background: linear-gradient(180deg, #0a1628, #060e19);
  border: 1px solid #274663; border-radius: 11px;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
  animation: cc-modal-in 0.15s ease-out;
}
@keyframes cc-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(0.99); }
  to { opacity: 1; transform: none; }
}
.cc-modal-head {
  display: flex; gap: 16px; justify-content: space-between; align-items: flex-start;
  padding: 14px 18px 12px; border-bottom: 1px solid #1b3451;
  background: linear-gradient(90deg, rgba(24, 54, 88, 0.45), transparent);
}
.cc-modal-kicker {
  display: flex; align-items: center; gap: 8px; font-size: 8px; font-weight: 800;
  letter-spacing: 1px; color: #7f95b2; text-transform: uppercase;
}
.cc-modal-source {
  font-size: 7.5px; padding: 2px 6px; border-radius: 3px; letter-spacing: 0.6px;
  border: 1px solid #1c4a36; color: #00e676; background: rgba(0, 230, 118, 0.08);
}
.cc-modal-source.sample {
  color: #ffc107; border-color: #5b4a14; background: rgba(255, 193, 7, 0.08);
}
.cc-modal-title {
  font-size: 23px; font-weight: 800; line-height: 1.1; margin-top: 5px;
  letter-spacing: 0.2px; word-break: break-word;
}
.cc-modal-sub { font-size: 9.5px; color: #8ea3bf; margin-top: 5px; }
.cc-modal-close {
  appearance: none; border: 1px solid #24405f; background: #0b1728; color: #9db0c9;
  width: 30px; height: 30px; border-radius: 6px; font-size: 20px; line-height: 1;
  cursor: pointer; flex: 0 0 auto; font-family: inherit;
}
.cc-modal-close:hover { color: #fff; border-color: #2f6ea8; background: #10233a; }
.cc-modal-body { overflow-y: auto; padding: 13px 18px 16px; }
.cc-metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }
.cc-metric-card {
  background: linear-gradient(180deg, #0b182b, #07111e); border: 1px solid #1a2c48;
  border-radius: 8px; padding: 9px 10px 7px; min-width: 0;
}
.cc-gauge { position: relative; width: 100%; max-width: 150px; margin: 0 auto; }
.cc-gauge svg { display: block; width: 100%; height: auto; }
.cc-gauge-center {
  position: absolute; left: 0; right: 0; bottom: 2px; text-align: center;
  display: flex; align-items: baseline; justify-content: center; gap: 2px;
}
.cc-gauge-center strong { font-size: 22px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums; }
.cc-gauge-center span { font-size: 9px; color: #8ea3bf; }
.cc-metric-info { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
.cc-metric-name { font-size: 8.5px; font-weight: 700; color: #dbe7f5; }
.cc-metric-band {
  font-size: 7.5px; font-weight: 800; text-transform: uppercase;
  letter-spacing: 0.4px; margin-left: auto;
}
.cc-metric-fleet { width: 100%; font-size: 8px; color: #7f95b2; }
.cc-detail-spark { width: 100%; height: 38px; display: block; margin-top: 5px; }
.cc-detail-spark-empty {
  height: 38px; display: flex; align-items: center; justify-content: center;
  font-size: 8px; color: #5f7591; border-top: 1px dashed #14253c; margin-top: 5px;
}
.cc-metric-foot { font-size: 7.5px; color: #5f7591; margin-top: 3px; text-align: right; }
.cc-detail-grid { display: grid; grid-template-columns: 1.08fr 1fr 0.86fr; gap: 9px; margin-bottom: 9px; }
.cc-detail-panel-body { padding: 8px 10px 9px; }
.cc-fs-list { display: flex; flex-direction: column; gap: 7px; }
.cc-fs-row { display: flex; align-items: center; gap: 7px; }
.cc-fs-mount {
  width: 52px; flex: 0 0 auto; font-size: 8.5px; color: #b9c9dd;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.cc-fs-value {
  width: 32px; flex: 0 0 auto; text-align: right; font-size: 8.5px;
  font-weight: 800; font-variant-numeric: tabular-nums;
}
.cc-usage-track { position: relative; flex: 1; height: 7px; border-radius: 4px; background: #12233a; overflow: hidden; }
.cc-usage-track > span { display: block; height: 100%; border-radius: 4px; }
.cc-usage-track > i {
  position: absolute; top: -2px; bottom: -2px; width: 1.5px;
  background: #dbe7f5; opacity: 0.7;
}
.cc-fs-legend { display: flex; gap: 10px; margin-top: 4px; font-size: 7.5px; color: #7f95b2; flex-wrap: wrap; }
.cc-fs-legend span { display: inline-flex; align-items: center; gap: 4px; }
.cc-fs-legend i { width: 6px; height: 6px; border-radius: 2px; display: inline-block; }
.cc-cmp-list { display: flex; flex-direction: column; gap: 7px; }
.cc-cmp-row { min-width: 0; }
.cc-cmp-top {
  display: flex; justify-content: space-between; gap: 6px;
  font-size: 8px; color: #b9c9dd; margin-bottom: 3px;
}
.cc-cmp-top .cc-muted { white-space: nowrap; }
.cc-cmp-legend { font-size: 7.5px; color: #5f7591; margin-top: 2px; }
.cc-facts { display: grid; grid-template-columns: 1fr; gap: 0; margin: 0; }
.cc-facts > div {
  display: flex; justify-content: space-between; gap: 8px;
  padding: 3px 0; border-bottom: 1px solid #101e31; font-size: 8.2px;
}
.cc-facts > div:last-child { border-bottom: 0; }
.cc-facts dt { color: #7f95b2; margin: 0; }
.cc-facts dd { color: #dbe7f5; margin: 0; text-align: right; font-weight: 600; }
.cc-modal-health {
  display: inline-block; border: 1px solid; border-radius: 3px; padding: 1px 5px;
  font-size: 7.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;
}
.cc-detail-empty { padding: 16px 8px; text-align: center; font-size: 9px; color: #7f95b2; }
.cc-detail-problems { font-size: 8.6px; }
.cc-detail-problem-name { max-width: 420px; overflow: hidden; text-overflow: ellipsis; }
.cc-modal-foot {
  display: flex; align-items: center; gap: 12px; justify-content: space-between;
  padding: 8px 18px; border-top: 1px solid #1b3451; background: #07111e;
  font-size: 8px; color: #5f7591; flex-wrap: wrap;
}
.cc-detail-note { flex: 1; min-width: 200px; }
.cc-detail-note.error { color: #ffb3bf; }
.cc-detail-note.partial { color: #ffc107; }
.cc-modal-link { color: #7fc4ff; text-decoration: none; font-weight: 700; white-space: nowrap; }
.cc-modal-link:hover { color: #fff; }

@media (max-width: 1000px) {
  .cc-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-detail-grid { grid-template-columns: 1fr; }
}
@media (max-width: 620px) {
  .cc-modal-backdrop { padding: 0; }
  .cc-modal { max-height: 100vh; border-radius: 0; border-left: 0; border-right: 0; }
  .cc-modal-head, .cc-modal-body, .cc-modal-foot { padding-left: 12px; padding-right: 12px; }
  .cc-modal-title { font-size: 18px; }
  .cc-fs-mount { width: 44px; }
}

@media (max-width: 1500px) {
  .cc-kpis { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .cc-bottom { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 1200px) {
  .cc-util-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-groups { grid-template-columns: 1fr; }
  .cc-header-right { margin-left: 0; }
}
@media (max-width: 760px) {
  .cc-app { padding: 10px; }
  .cc-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-util-row, .cc-bottom { grid-template-columns: 1fr; }
  .cc-title { font-size: 20px; white-space: normal; }
  .cc-subtitle { white-space: normal; }
}
`;
