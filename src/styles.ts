export const CSS = `
/* ── Magic UI design tokens ─────────────────────────────────── */

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.cc-app {
  --bg: #04080f;
  --panel: #0b1627;
  --panel-2: #0e1c31;
  --border: #14253c;
  --border-soft: rgba(20, 37, 60, 0.6);
  --ink: #dbe7f5;
  --ink-2: #9fb3cc;
  --muted: #7d92ad;
  --blue: #2f9bff;
  --cyan: #00d4ff;
  --purple: #8b5cf6;
  --green: #00d47e;
  --amber: #ffc107;
  --orange: #ff8a3d;
  --red: #ff4d67;
  --surface: #0a1526;

  position: relative;
  isolation: isolate;
  min-height: 100vh;
  margin: 0;
  padding: 14px 18px 28px;
  overflow-x: hidden;
  background:
    radial-gradient(1100px 480px at 12% -12%, rgba(20, 70, 140, 0.24), transparent 62%),
    radial-gradient(900px 420px at 88% -6%, rgba(120, 60, 220, 0.14), transparent 60%),
    radial-gradient(760px 380px at 50% 108%, rgba(0, 140, 150, 0.1), transparent 65%),
    var(--bg);
  color: var(--ink);
  font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 12px;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

.cc-app *,
.cc-app *::before,
.cc-app *::after { box-sizing: border-box; }

/* Grafana sets a 1.5 line-height on body; without this reset it leaks into
   fixed-height selects/inputs and pushes their single line of text down into
   the bottom border. The concept build uses the browser default. */
.cc-app select,
.cc-app input,
.cc-app textarea {
  font-family: inherit;
  line-height: normal;
}

.cc-app::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(120, 170, 255, 0.1) 1px, transparent 1px);
  background-size: 22px 22px;
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.7) 55%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, rgba(0, 0, 0, 0.7) 55%, transparent 100%);
}

/* Lift page content above the aurora backdrop, but leave fixed overlays
   (the host-detail drawer) alone — this selector otherwise out-specifies
   their position: fixed and renders them inline at the bottom of the page. */
.cc-app > :not(.cc-aurora):not(.cc-modal-backdrop):not(style) {
  position: relative;
  z-index: 1;
}

/* Drifting aurora orbs (Magic UI backdrop). */
/* The orbs are already soft radial gradients. An animated element with a
   blur() filter forces the browser to re-rasterise the filter every frame; on
   an always-on wall display that exhausts the GPU process and the tab ends up
   blank after a while. Keep the soft gradient, drop the filter. */
.cc-aurora {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.55;
}

.cc-aurora.a1 {
  top: -180px;
  left: -160px;
  width: 700px;
  height: 420px;
  background: radial-gradient(circle, rgba(47, 155, 255, 0.36), transparent 65%);
  animation: cc-drift-a 19s ease-in-out infinite alternate;
}

.cc-aurora.a2 {
  top: 60px;
  right: -200px;
  width: 640px;
  height: 460px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 66%);
  animation: cc-drift-b 23s ease-in-out infinite alternate;
}

.cc-aurora.a3 {
  top: 520px;
  left: 38%;
  width: 560px;
  height: 380px;
  opacity: 0.35;
  background: radial-gradient(circle, rgba(0, 212, 255, 0.18), transparent 68%);
  animation: cc-drift-a 27s ease-in-out infinite alternate-reverse;
}

/* ── Header ────────────────────────────────────────────────── */

.cc-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 16px 22px;
  margin-bottom: 14px;
}

.cc-brand {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  min-width: 0;
}

.cc-logo {
  display: flex;
  flex: none;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 40px;
  height: 40px;
  padding: 0 10px;
  border: 1px solid rgba(96, 165, 250, 0.3);
  border-radius: 11px;
  background: linear-gradient(145deg, rgba(47, 155, 255, 0.24), rgba(139, 92, 246, 0.14));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 8px 26px -12px rgba(47, 155, 255, 0.8);
}

.cc-logo span {
  display: block;
  width: 100%;
  height: 3px;
  border-radius: 2px;
}

/* Configured logo: a square slot. BrandMark measures the header text block
   beside it and sets both dimensions inline, so the mark is exactly as tall as
   the title block at every viewport width. The image is absolutely positioned
   and contained so artwork with a non-square aspect ratio is not distorted. */
.cc-logo.cc-logo-image {
  position: relative;
  min-width: 0;
  max-width: none;
  padding: 0;
  background: rgba(8, 18, 33, 0.55);
}

.cc-logo-image img {
  position: absolute;
  top: 4px;
  left: 4px;
  display: block;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  max-width: none;
  max-height: none;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(47, 155, 255, 0.35));
}

.cc-eyebrow {
  color: var(--muted);
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  white-space: nowrap;
}

.cc-eyebrow span { opacity: 0.5; }

.cc-title {
  margin: 4px 0 5px;
  font-size: clamp(17px, 1.55vw, 22px);
  font-weight: 700;
  letter-spacing: 0.045em;
  line-height: 1.1;
  white-space: nowrap;
  background: linear-gradient(90deg, #9bd0ff 0%, #e8f4ff 24%, #c4b5fd 50%, #7fc4ff 76%, #9bd0ff 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: cc-title-shine 9s linear infinite;
}

.cc-subtitle {
  margin-top: 1px;
  color: var(--ink-2);
  font-size: 10.5px;
  letter-spacing: 0.02em;
}

/* ── Header filters (collapsible, compact grid) ────────────── */

.cc-header-filters {
  display: flex;
  flex: 1 1 520px;
  align-items: center;
  gap: 10px;
  align-self: center;
  min-width: 0;
  max-width: 640px;
  margin: 0 2px;
}

.cc-filter-toggle {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 9px;
  border: 1px solid rgba(148, 184, 230, 0.26);
  border-radius: 7px;
  background: rgba(47, 155, 255, 0.1);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 10.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.cc-filter-toggle:hover {
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.16);
  color: var(--ink);
}

.cc-filter-toggle:focus-visible {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.2);
}

.cc-filter-caret {
  font-size: 10px;
  line-height: 1;
  transition: transform 0.18s ease;
}

.cc-header-filters.collapsed .cc-filter-caret { transform: rotate(-90deg); }

.cc-filter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 5px;
  border-radius: 999px;
  background: rgba(47, 155, 255, 0.28);
  color: #d6ecff;
  font-size: 9px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.cc-filter-summary {
  display: none;
  max-width: 30vw;
  overflow: hidden;
  color: var(--muted);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-filter-summary[hidden] { display: none; }

.cc-header-filters.collapsed .cc-filter-summary { display: inline-block; }
.cc-header-filters.collapsed .cc-filter-controls { display: none; }

/* When collapsed, the group must shrink to just the toggle + active summary.
   Keeping the expanded flex-basis here steals the width the clock/Zabbix
   cluster needs and pushes it onto a second header row. */
.cc-header-filters.collapsed {
  flex: 0 0 auto;
  max-width: none;
}

.cc-filter-controls {
  display: grid;
  flex: 1 1 auto;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: end;
  gap: 7px 9px;
  min-width: 0;
}

.cc-filter {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.cc-filter label {
  overflow: hidden;
  color: var(--muted);
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.09em;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-transform: uppercase;
  margin: 0;
}

.cc-filter select {
  width: 100%;
  height: 26px;
  padding: 0 22px 0 8px;
  border: 1px solid rgba(148, 184, 230, 0.22);
  border-radius: 7px;
  outline: none;
  background-color: rgba(6, 12, 22, 0.85);
  background-image:
    linear-gradient(45deg, transparent 50%, rgba(219, 231, 245, 0.65) 50%),
    linear-gradient(135deg, rgba(219, 231, 245, 0.65) 50%, transparent 50%);
  background-position: calc(100% - 14px) 50%, calc(100% - 9px) 50%;
  background-repeat: no-repeat;
  background-size: 5px 5px, 5px 5px;
  color: var(--ink);
  font-size: 10.5px;
  /* With appearance:none the single line of text is laid out in a line box;
     matching it to the 24px content height keeps the option text centred
     instead of sitting on the bottom border. */
  line-height: 24px;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.cc-filter select:hover { border-color: rgba(127, 196, 255, 0.4); }

.cc-filter select:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.2);
}

.cc-filter select option { background: #0b1424; color: var(--ink); }

.cc-filter-reset {
  width: 100%;
  height: 26px;
  padding: 0 10px;
  border: 1px solid rgba(148, 184, 230, 0.24);
  border-radius: 6px;
  background: rgba(148, 184, 230, 0.08);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.cc-filter-reset:hover {
  border-color: rgba(127, 196, 255, 0.45);
  background: rgba(47, 155, 255, 0.14);
  color: var(--ink);
}

.cc-filter-reset:focus-visible {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(47, 155, 255, 0.2);
}

.cc-header-filters.is-filtered .cc-filter-reset {
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.16);
  color: var(--ink);
}

/* ── Header right cluster ──────────────────────────────────── */

.cc-header-right {
  display: flex;
  flex: none;
  align-items: flex-start;
  gap: 12px;
  margin-left: auto;
}

.cc-mode {
  display: flex;
  align-self: center;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.18);
  border-radius: 7px;
  background: rgba(10, 20, 36, 0.6);
}

.cc-mode button {
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 5px 9px;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.18s ease, background 0.18s ease;
}

.cc-mode button:hover { color: var(--ink); }
.cc-mode button.active { background: rgba(47, 155, 255, 0.22); color: #fff; }

.cc-mode .cc-mode-note {
  padding: 5px 9px;
  font-size: 8.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
  background: rgba(47, 155, 255, 0.16);
  color: #dfe9f6;
  white-space: nowrap;
}

.cc-clock { text-align: right; padding: 2px 2px; }

.cc-clock-date { color: var(--muted); font-size: 9px; letter-spacing: 0.04em; }

.cc-clock-time {
  margin-top: 1px;
  color: var(--ink);
  font-size: 19px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
  line-height: 1.1;
}

.cc-clock-zone { margin-left: 5px; color: var(--muted); font-size: 9px; font-weight: 400; }

.cc-zabbix {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 158px;
  padding: 7px 10px;
  border: 1px solid rgba(0, 212, 126, 0.24);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(9, 34, 25, 0.72), rgba(6, 20, 16, 0.72));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  /* Deliberately no backdrop-filter: it re-blurs the animated aurora behind
     this element on every frame and eventually blanks the GPU process. */
}

.cc-zabbix-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 0 rgba(0, 212, 126, 0.45);
  animation: cc-live-pulse 2.4s ease-out infinite;
}

.cc-zabbix-label { font-size: 11px; font-weight: 800; letter-spacing: 0.6px; color: #9ff3c5; }
.cc-zabbix-sub { margin-top: 1px; font-size: 8.5px; color: #6fbf94; }

.cc-sample-badge {
  margin-left: auto;
  padding: 1px 4px;
  border: 1px solid #5b4a14;
  border-radius: 3px;
  background: rgba(255, 193, 7, 0.08);
  color: var(--amber);
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.cc-sample-badge.is-live { color: var(--green); border-color: #1c4a36; background: rgba(0, 230, 118, 0.08); }
.cc-sample-badge.is-error { color: var(--red); border-color: #5b1c26; background: rgba(255, 77, 103, 0.08); }

.cc-zabbix.is-error {
  border-color: #5b1c26;
  background: linear-gradient(180deg, rgba(52, 10, 16, 0.72), rgba(26, 6, 9, 0.72));
}

.cc-zabbix.is-error .cc-zabbix-dot { background: var(--red); box-shadow: 0 0 0 0 rgba(255, 77, 103, 0.45); animation-name: cc-live-pulse-red; }
.cc-zabbix.is-loading .cc-zabbix-dot { background: var(--amber); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.45); animation-name: cc-live-pulse-amber; }
.cc-zabbix.is-sample .cc-zabbix-dot { background: var(--amber); box-shadow: none; animation: none; opacity: 0.85; }

/* ── Banners ───────────────────────────────────────────────── */

.cc-banner {
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 10px;
  padding: 8px 11px;
  border: 1px solid #5b1c26;
  border-radius: 10px;
  background: rgba(255, 61, 87, 0.08);
  color: #ffb3bf;
  font-size: 10px;
  /* Deliberately no backdrop-filter: it re-blurs the animated aurora behind
     this element on every frame and eventually blanks the GPU process. */
}

.cc-banner strong { color: var(--red); font-weight: 800; }
.cc-banner.warn { border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); color: #ffe08a; }
.cc-banner.warn strong { color: var(--amber); }

.cc-banner-btn {
  margin-left: auto;
  appearance: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 9px;
  font-weight: 700;
  color: #ffe08a;
  background: rgba(255, 193, 7, 0.12);
  border: 1px solid #5b4a14;
  border-radius: 5px;
  padding: 4px 9px;
  white-space: nowrap;
}

.cc-banner-btn:hover { background: rgba(255, 193, 7, 0.2); }

/* ── Live problems ticker ──────────────────────────────────── */

.cc-ticker {
  display: flex;
  align-items: stretch;
  height: 44px;
  margin: 0 0 14px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 13px;
  background: rgba(10, 20, 36, 0.68);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  overflow: hidden;
  /* Deliberately no backdrop-filter: it re-blurs the animated aurora behind
     this element on every frame and eventually blanks the GPU process. */
}

.cc-ticker-label {
  display: flex;
  flex: none;
  align-items: center;
  gap: 7px;
  padding: 0 16px;
  border-right: 1px solid rgba(255, 193, 7, 0.16);
  background: linear-gradient(90deg, rgba(255, 193, 7, 0.1), transparent);
  color: #ffd27a;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  white-space: nowrap;
}

.cc-live-dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 0 rgba(0, 212, 126, 0.45);
  animation: cc-live-pulse 2.4s ease-out infinite;
}

.cc-live-dot.amber {
  background: var(--amber);
  box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.45);
  animation-name: cc-live-pulse-amber;
}

.cc-ticker-viewport {
  display: flex;
  flex: 1;
  align-items: center;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 3%, #000 97%, transparent);
}

.cc-ticker-track {
  display: flex;
  width: max-content;
  animation: cc-marquee 80s linear infinite;
}

.cc-ticker:hover .cc-ticker-track { animation-play-state: paused; }

.cc-ticker-set {
  display: flex;
  align-items: center;
  gap: 34px;
  padding-right: 34px;
}

/* Blank sweep between loops of the problem list. A full viewport width of
   empty space means the next copy cannot appear until the current one has
   scrolled away, so a repeated list — especially a single repeated problem —
   reads as a restart instead of a run-on row. */
.cc-ticker-gap {
  flex: 0 0 auto;
  width: 100vw;
}

.cc-ticker-item {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--ink-2);
  font-size: 12.5px;
  white-space: nowrap;
}

.cc-ticker-item b { color: var(--ink); font-weight: 600; }
.cc-ticker-item em { color: var(--muted); font-style: normal; font-variant-numeric: tabular-nums; }

/* Severity chip: the table renders severity as coloured text, but the ticker
   uses the concept's pill treatment with a leading status dot. */
.cc-ticker .cc-ticker-sev {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 7px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  white-space: nowrap;
}

.cc-ticker .cc-ticker-sev::before {
  content: '';
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
}

.cc-ticker .cc-ticker-sev.cc-sev-critical {
  border-color: rgba(255, 77, 103, 0.24);
  background: rgba(255, 77, 103, 0.1);
  color: #ff8a9b;
}
.cc-ticker .cc-ticker-sev.cc-sev-critical::before { background: var(--red); }

.cc-ticker .cc-ticker-sev.cc-sev-high {
  border-color: rgba(255, 138, 61, 0.24);
  background: rgba(255, 138, 61, 0.1);
  color: #ffb07a;
}
.cc-ticker .cc-ticker-sev.cc-sev-high::before { background: var(--orange); }

.cc-ticker .cc-ticker-sev.cc-sev-warning {
  border-color: rgba(255, 193, 7, 0.24);
  background: rgba(255, 193, 7, 0.09);
  color: #ffd45e;
}
.cc-ticker .cc-ticker-sev.cc-sev-warning::before { background: var(--amber); }

.cc-ticker .cc-ticker-sev.cc-sev-info {
  border-color: rgba(47, 155, 255, 0.24);
  background: rgba(47, 155, 255, 0.1);
  color: #8ecbff;
}
.cc-ticker .cc-ticker-sev.cc-sev-info::before { background: var(--blue); }

/* ── KPI row (MagicCard tiles) ─────────────────────────────── */

.cc-kpis {
  display: grid;
  grid-template-columns: repeat(9, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-kpi {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-height: 60px;
  padding: 11px 11px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.78), rgba(7, 14, 26, 0.86));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 50px -30px rgba(0, 80, 180, 0.9);
  /* No backdrop-filter: the panels are opaque enough without paying for a
     per-frame blur of the animated backdrop (see the aurora note above). */
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.cc-kpi > * { position: relative; z-index: 1; }

.cc-kpi::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(280px circle at 30% 0%, rgba(96, 165, 250, 0.13), transparent 65%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.cc-kpi:hover {
  transform: translateY(-1px);
  border-color: rgba(127, 196, 255, 0.3);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 22px 60px -30px rgba(47, 155, 255, 0.75);
}

.cc-kpi:hover::after { opacity: 1; }

.cc-kpi-alert {
  border-color: rgba(255, 77, 103, 0.26);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 50px -30px rgba(255, 61, 87, 0.6);
}

.cc-beam {
  position: absolute;
  inset: 0;
  z-index: 0;
  padding: 1px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    transparent 0 68%,
    var(--red) 86%,
    #ffffff 92%,
    var(--red) 96%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  /* Static sheen: animating a conic-gradient's angle repaints the whole card
     border every frame, which is the other per-frame rasterisation cost. */
  pointer-events: none;
}

.cc-kpi-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 27px;
  height: 27px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  box-shadow: inset 0 0 16px rgba(47, 155, 255, 0.08);
  color: var(--tone);
}

.cc-kpi-body { min-width: 0; }

.cc-kpi-label {
  overflow: hidden;
  color: var(--muted);
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
}

.cc-kpi-value {
  margin-top: 1px;
  color: var(--ink);
  font-size: clamp(19px, 1.55vw, 23px);
  font-weight: 700;
  line-height: 1.08;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  text-shadow: 0 0 22px rgba(127, 196, 255, 0.18);
}

/* Semantic counts: red = down/critical, amber = attention, green = healthy. */
.cc-kpi[data-tone="green"] .cc-kpi-value { color: var(--green); }
.cc-kpi[data-tone="red"] .cc-kpi-value { color: var(--red); }
.cc-kpi[data-tone="yellow"] .cc-kpi-value,
.cc-kpi[data-tone="orange"] .cc-kpi-value { color: var(--amber); }
.cc-kpi[data-tone="purple"] .cc-kpi-value { color: #fff; }
.cc-kpi[data-tone="gray"] .cc-kpi-value { color: var(--red); }
.cc-kpi[data-tone="cyan"] .cc-kpi-value { color: var(--blue); }

.cc-kpi-sub {
  overflow: hidden;
  margin-top: 2px;
  color: var(--ink-2);
  font-size: 8.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-kpi-delta { margin-left: 3px; font-size: 8px; font-weight: 700; }
.cc-delta-up { color: var(--orange); }
.cc-delta-down { color: var(--green); }

.cc-kpi-link { color: inherit; text-decoration: none; cursor: pointer; }
.cc-kpi-link:focus-visible { outline: 2px solid var(--blue); outline-offset: 1px; }

.cc-kpi-link::before {
  content: "›";
  position: absolute;
  top: 4px;
  right: 8px;
  z-index: 2;
  color: #5f83ad;
  font-size: 12px;
  line-height: 1;
  opacity: 0.6;
}

.cc-kpi-link:hover::before { color: #9cc9ff; opacity: 1; }

/* ── Panels (glass cards) ──────────────────────────────────── */

.cc-panel {
  position: relative;
  min-width: 0;
  padding: 13px 14px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.78), rgba(7, 14, 26, 0.86));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 50px -30px rgba(0, 80, 180, 0.9);
  /* No backdrop-filter: the panels are opaque enough without paying for a
     per-frame blur of the animated backdrop (see the aurora note above). */
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.cc-panel > * { position: relative; z-index: 1; }

.cc-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(320px circle at 30% 0%, rgba(96, 165, 250, 0.1), transparent 68%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.cc-panel:hover {
  border-color: rgba(127, 196, 255, 0.28);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 22px 60px -30px rgba(47, 155, 255, 0.75);
}

.cc-panel:hover::after { opacity: 1; }

.cc-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 0;
  border: 0;
  background: none;
}

.cc-panel-title {
  color: var(--ink);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.cc-panel-sub { margin-top: 2px; color: var(--muted); font-size: 8.5px; }

/* ── Utilisation ring cards ────────────────────────────────── */

.cc-util-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-util-body {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0;
  margin-top: 11px;
}

.cc-ring {
  --p: 0;
  --fill: var(--green);
  position: relative;
  flex: none;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: conic-gradient(var(--fill) calc(var(--p) * 1%), rgba(255, 255, 255, 0.07) 0);
  box-shadow: 0 0 24px -6px rgba(127, 196, 255, 0.35);
  transition: --p 1.1s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.cc-ring::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: var(--surface);
}

.cc-ring-inner {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.cc-ring-inner strong {
  color: var(--ink);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.cc-ring-inner span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.cc-util-right { flex: 1; min-width: 0; }

.cc-stackbar {
  display: flex;
  gap: 2px;
  width: 100%;
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.cc-seg { display: block; height: 100%; border-radius: 2px; transition: flex-grow 0.4s ease; }
.cc-seg:first-child { border-radius: 4px 2px 2px 4px; }
.cc-seg:last-child { border-radius: 2px 4px 4px 2px; }
.cc-seg.crit { background: var(--red); }
.cc-seg.warn { background: var(--amber); }
.cc-seg.ok { background: var(--green); }

.cc-legend { display: grid; gap: 4px; margin-top: 8px; }

.cc-legend-row {
  display: grid;
  grid-template-columns: 7px 1fr auto;
  gap: 6px;
  align-items: center;
  color: var(--ink-2);
  font-size: 8.5px;
}

.cc-legend-label { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.cc-legend-value { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }
.cc-dot { display: inline-block; width: 6px; height: 6px; border-radius: 2px; flex: 0 0 auto; }
.cc-dot.cc-dot-stale { background: transparent; box-shadow: inset 0 0 0 1.5px #8f9298; }

/* ── Host group matrix ─────────────────────────────────────── */

.cc-groups {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-group { padding: 12px 14px; }

.cc-group-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  padding: 0;
}

.cc-group-name {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--ink);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.cc-env-dot { display: inline-block; width: 7px; height: 7px; border-radius: 2px; flex: 0 0 auto; }
.cc-env-dot.prod { background: var(--blue); box-shadow: 0 0 10px rgba(47, 155, 255, 0.7); }
.cc-env-dot.dr { background: var(--purple); box-shadow: 0 0 10px rgba(139, 92, 246, 0.7); }
.cc-env-dot.uat { background: var(--cyan); box-shadow: 0 0 10px rgba(0, 212, 255, 0.6); }

.cc-group-total { color: var(--muted); font-size: 9px; font-weight: 500; letter-spacing: 0.02em; }

.cc-group-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 3px 9px;
  color: var(--muted);
  font-size: 8px;
}

.cc-lg { display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; }
.cc-lg i { display: inline-block; width: 5px; height: 5px; border-radius: 1.5px; }
.cc-lg.ok i { background: var(--green); }
.cc-lg.warn i { background: var(--amber); }
.cc-lg.crit i { background: #ff3b30; }
.cc-lg.other i { background: #8f9298; }

.cc-grid-wrap { padding: 0; }

.cc-tier-row {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  padding: 7px 0;
  margin: 0;
  border-top: 1px dashed rgba(20, 37, 60, 0.75);
}

.cc-tier-row:nth-of-type(1) { border-top: 0; }

.cc-tier-label { width: auto; min-width: 0; padding-top: 1px; }

.cc-tier-title {
  color: var(--ink);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.cc-tier-sub {
  overflow: hidden;
  color: var(--muted);
  font-size: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cc-tier-counts { display: flex; gap: 4px; margin-top: 2px; }
.cc-tier-counts span { font-size: 7.5px; font-weight: 700; font-variant-numeric: tabular-nums; }

.cc-host-grid {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 2px;
  align-content: flex-start;
  min-height: 8px;
}

.cc-cell {
  position: relative;
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 1.5px;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.cc-cell-btn { appearance: none; border: 0; padding: 0; font: inherit; cursor: pointer; }
.cc-cell-btn:hover { z-index: 5; transform: scale(2.6); box-shadow: 0 0 0 1px #fff, 0 0 10px 2px rgba(255, 255, 255, 0.35); }
.cc-cell-btn:focus-visible { outline: 2px solid #fff; outline-offset: 1px; z-index: 6; }

/* Solid, high-contrast fills: at 7px the diagonal stripe treatment blurred
   together and made stale / maintenance / unavailable indistinguishable. */
/* Health palette, tuned for 7px solid squares on the dark panel:
   critical is a true red (not pink), unavailable a clearly violet fuchsia,
   stale a neutral grey with no blue cast, maintenance a saturated azure. */
.cc-cell-healthy { background: rgba(0, 212, 126, 0.55); }
.cc-cell-warning { background: #ffc107; }
.cc-cell-critical { background: #ff3b30; box-shadow: 0 0 0 1px rgba(255, 59, 48, 0.4); }
/* Stale is hollow rather than filled: shape carries the state even when the
   grey and cyan read close at 7px on a blue-tinted panel. */
.cc-cell-stale { background: rgba(143, 146, 152, 0.1); box-shadow: inset 0 0 0 1.5px #8f9298; }
.cc-cell-maintenance { background: #22d3ee; box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35); }
.cc-cell-unavailable { background: #a855f7; box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.5); }

.cc-cell-critical::after {
  content: "";
  position: absolute;
  inset: -1px;
  border: 1px solid rgba(255, 59, 48, 0.75);
  border-radius: inherit;
  pointer-events: none;
  animation: cc-cell-ring 2.4s ease-in-out infinite;
}

.cc-legend-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  padding: 7px 0 0;
  margin-top: 6px;
  border-top: 1px solid rgba(20, 37, 60, 0.6);
  color: var(--muted);
  font-size: 7.8px;
}

.cc-legend-inline span { display: inline-flex; align-items: center; gap: 4px; }

/* ── Bottom row (3 panels) ─────────────────────────────────── */

.cc-bottom {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.cc-table-wrap { overflow-x: auto; }

.cc-table {
  width: 100%;
  margin-top: 9px;
  border-collapse: collapse;
  font-size: 9.5px;
}

.cc-table th {
  padding: 0 6px 5px 0;
  border-bottom: 1px solid var(--border);
  color: var(--muted);
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.cc-table td {
  padding: 5.5px 6px 5.5px 0;
  border-bottom: 1px solid var(--border-soft);
  color: var(--ink-2);
  white-space: nowrap;
  vertical-align: middle;
}

.cc-table tbody tr:last-child td { border-bottom: 0; }
.cc-table tbody tr:hover td { background: rgba(47, 155, 255, 0.05); }
.cc-table tr.cc-row-link { cursor: pointer; }
.cc-table tr.cc-row-link:hover td { background: rgba(47, 155, 255, 0.08); }
.cc-table tr.cc-row-link:focus-visible { outline: 2px solid var(--blue); outline-offset: -2px; }

.cc-row-anchor { display: inline-flex; align-items: center; gap: 4px; color: #e6f0fb; text-decoration: none; font-weight: 700; }
.cc-row-anchor:hover { color: #7fc4ff; text-decoration: underline; }

/* Hostnames open the per-server statistics drawer wherever they appear. */
.cc-host-link {
  appearance: none;
  border: 0;
  padding: 0;
  background: none;
  font: inherit;
  font-weight: 700;
  color: inherit;
  text-align: left;
  cursor: pointer;
}
.cc-host-link:hover { color: #7fc4ff; text-decoration: underline; }
.cc-host-link:focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; border-radius: 3px; }

.cc-ticker-host {
  appearance: none;
  border: 0;
  padding: 0;
  background: none;
  font: inherit;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
}
.cc-ticker-host:hover { color: #9bd0ff; text-decoration: underline; }
.cc-ticker-host:focus-visible { outline: 2px solid var(--blue); outline-offset: 1px; border-radius: 3px; }
.cc-row-arrow { color: #5f83ad; font-size: 11px; line-height: 1; }
.cc-row-link:hover .cc-row-arrow { color: #9cc9ff; }
.cc-table .num { text-align: right; font-variant-numeric: tabular-nums; }

.cc-status { font-weight: 800; font-size: 8.5px; }
.cc-status-critical { color: var(--red); }
.cc-status-high { color: var(--orange); }
.cc-status-warning { color: var(--amber); }
.cc-status-healthy { color: var(--green); }
.cc-muted { color: #6f86a3; }
.cc-strong { color: #e6f0fb; font-weight: 700; }

.cc-tabs {
  display: flex;
  flex: none;
  gap: 2px;
  padding: 2px;
  margin-top: 9px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 7px;
  background: rgba(10, 20, 36, 0.6);
}

.cc-tab {
  padding: 4px 8px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--muted);
  font-family: inherit;
  font-size: 8.5px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
}

.cc-tab:hover { color: var(--ink); }
.cc-tab.active { color: var(--ink); background: rgba(47, 155, 255, 0.14); box-shadow: inset 0 0 0 1px rgba(47, 155, 255, 0.28); }

.cc-spark { display: block; width: 64px; height: 18px; }
.cc-bar-cell { display: flex; align-items: center; gap: 5px; }
.cc-mini-track { display: inline-block; width: 44px; height: 5px; overflow: hidden; border-radius: 3px; background: #12233a; }
.cc-mini-fill { display: block; height: 100%; border-radius: 3px; }

/* ── Problems panel ────────────────────────────────────────── */

.cc-problems { margin-bottom: 2px; }

.cc-problem-tabs {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 0 9px;
  border-bottom: 0;
}

.cc-problem-tabs .cc-spacer { flex: 1; }

.cc-problem-tabs .cc-tab {
  padding: 3px 9px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 999px;
  background: rgba(10, 20, 36, 0.5);
}

.cc-problem-tabs .cc-tab.active {
  border-color: rgba(47, 155, 255, 0.4);
  background: rgba(47, 155, 255, 0.16);
  box-shadow: none;
}

.cc-problem-scroll {
  max-height: 430px;
  overflow: auto;
  border-radius: 8px;
}

.cc-problem-scroll .cc-table-wrap { overflow: visible; }

.cc-problem-table { font-size: 8.8px; }
.cc-problem-table td { padding: 4px 6px; }

.cc-problem-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #0a1526;
  box-shadow: 0 1px 0 var(--border);
}

.cc-sev { font-weight: 800; text-transform: uppercase; font-size: 8px; letter-spacing: 0.2px; }
.cc-sev-critical { color: var(--red); }
.cc-sev-high { color: var(--orange); }
.cc-sev-warning { color: var(--amber); }
.cc-sev-info { color: var(--blue); }

.cc-duration { color: var(--amber); font-weight: 700; }
.cc-sla-within { color: var(--green); font-weight: 700; }
.cc-sla-risk { color: var(--amber); font-weight: 700; }
.cc-sla-breach { color: var(--red); font-weight: 700; }
.cc-ack-yes { color: var(--green); }
.cc-ack-no { color: var(--red); }
.cc-related { color: #7fc4ff; }

/* .cc-table td sets a base ink colour and out-specifies the semantic
   classes, so severity / SLA / ack cells rendered plain white. Re-assert
   them at cell specificity. */
.cc-table td.cc-sev-critical { color: var(--red); }
.cc-table td.cc-sev-high { color: var(--orange); }
.cc-table td.cc-sev-warning { color: var(--amber); }
.cc-table td.cc-sev-info { color: var(--blue); }
.cc-table td.cc-duration { color: var(--amber); }
.cc-table td.cc-sla-within { color: var(--green); }
.cc-table td.cc-sla-risk { color: var(--amber); }
.cc-table td.cc-sla-breach { color: var(--red); }
.cc-table td.cc-ack-yes { color: var(--green); }
.cc-table td.cc-ack-no { color: var(--red); }
.cc-table td.cc-related { color: #7fc4ff; }
.cc-table td.cc-muted { color: #6f86a3; }
.cc-table td.cc-strong { color: #e6f0fb; }

.cc-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 2px 0;
  color: #5f7591;
  font-size: 8px;
}

/* ── Host detail drawer ────────────────────────────────────── */

.cc-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 22px 16px;
  overflow-y: auto;
  /* Opaque overlay instead of a full-screen backdrop blur; the drawer still
     reads as a layer above the dashboard. */
  background: rgba(2, 7, 14, 0.88);
}

.cc-modal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(1000px, 100%);
  max-height: calc(100vh - 44px);
  margin: auto;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.24);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.96), rgba(7, 14, 26, 0.98));
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  animation: cc-modal-in 0.15s ease-out;
  isolation: isolate;
}

/* Keep the drawer's content above the aurora blobs and border beam. */
.cc-modal > :not(.cc-modal-aurora):not(.cc-modal-beam) { position: relative; z-index: 1; }

.cc-modal-aurora {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.5;
}

.cc-modal-aurora.a1 {
  top: -150px;
  left: -120px;
  width: 460px;
  height: 320px;
  background: radial-gradient(circle, rgba(47, 155, 255, 0.4), transparent 65%);
  animation: cc-drift-a 17s ease-in-out infinite alternate;
}

.cc-modal-aurora.a2 {
  top: 30px;
  right: -150px;
  width: 420px;
  height: 300px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.32), transparent 66%);
  animation: cc-drift-b 21s ease-in-out infinite alternate;
}

.cc-modal-beam {
  position: absolute;
  inset: 0;
  z-index: 2;
  padding: 1.5px;
  border-radius: inherit;
  background: conic-gradient(
    from var(--angle),
    transparent 0 58%,
    rgba(47, 155, 255, 0.95) 72%,
    #c4b5fd 83%,
    rgba(0, 212, 255, 0.95) 92%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

.cc-modal-head {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 18px 12px;
  border-bottom: 1px solid rgba(27, 52, 81, 0.8);
  background: linear-gradient(90deg, rgba(24, 54, 88, 0.35), transparent);
}

.cc-modal-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.cc-modal-source {
  padding: 2px 6px;
  border: 1px solid #1c4a36;
  border-radius: 3px;
  background: rgba(0, 230, 118, 0.08);
  color: var(--green);
  font-size: 7.5px;
  letter-spacing: 0.6px;
}

.cc-modal-source.sample { color: var(--amber); border-color: #5b4a14; background: rgba(255, 193, 7, 0.08); }

.cc-modal-title {
  margin-top: 5px;
  font-size: 23px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.02em;
  word-break: break-word;
  background: linear-gradient(90deg, #9bd0ff 0%, #e8f4ff 26%, #c4b5fd 52%, #7fc4ff 78%, #9bd0ff 100%);
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: cc-title-shine 9s linear infinite;
}

.cc-modal-sub { margin-top: 5px; color: var(--ink-2); font-size: 9.5px; }

.cc-modal-close {
  flex: 0 0 auto;
  width: 30px;
  height: 30px;
  border: 1px solid rgba(96, 165, 250, 0.22);
  border-radius: 8px;
  background: rgba(10, 20, 36, 0.7);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.cc-modal-close:hover { color: #fff; border-color: rgba(127, 196, 255, 0.5); background: rgba(47, 155, 255, 0.12); }

.cc-modal-body { overflow-y: auto; padding: 13px 18px 16px; }

.cc-metric-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-bottom: 9px; }

.cc-metric-card {
  position: relative;
  min-width: 0;
  padding: 9px 10px 7px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.14);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(17, 33, 56, 0.7), rgba(7, 14, 26, 0.8));
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.cc-metric-card > * { position: relative; z-index: 1; }

.cc-metric-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background: radial-gradient(220px circle at 30% 0%, rgba(96, 165, 250, 0.16), transparent 70%);
  opacity: 0;
  transition: opacity 0.35s ease;
  pointer-events: none;
}

.cc-metric-card:hover {
  border-color: rgba(127, 196, 255, 0.32);
  box-shadow: 0 14px 40px -24px rgba(47, 155, 255, 0.8);
  transform: translateY(-1px);
}

.cc-metric-card:hover::after { opacity: 1; }

.cc-gauge-fill { animation: cc-gauge-draw 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both; }

.cc-spark-line {
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  animation: cc-spark-draw 1.3s ease 0.15s forwards;
}

.cc-usage-track > span {
  transform-origin: left center;
  animation: cc-usage-grow 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.cc-gauge { position: relative; width: 100%; max-width: 150px; margin: 0 auto; }
.cc-gauge svg { display: block; width: 100%; height: auto; }

.cc-gauge-center {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  text-align: center;
}

.cc-gauge-center strong { font-size: 22px; line-height: 1; font-weight: 800; font-variant-numeric: tabular-nums; }
.cc-gauge-center span { font-size: 9px; color: var(--muted); }

.cc-metric-info { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.cc-metric-name { color: var(--ink); font-size: 8.5px; font-weight: 700; }
.cc-metric-band { margin-left: auto; font-size: 7.5px; font-weight: 800; letter-spacing: 0.4px; text-transform: uppercase; }
.cc-metric-fleet { width: 100%; color: var(--muted); font-size: 8px; }
.cc-detail-spark { display: block; width: 100%; height: 38px; margin-top: 5px; }

.cc-detail-spark-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  margin-top: 5px;
  border-top: 1px dashed var(--border);
  color: #5f7591;
  font-size: 8px;
}

.cc-metric-foot {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px;
  margin-top: 3px;
  color: #5f7591;
  font-size: 7.5px;
}
.cc-metric-foot > span:last-child { margin-left: auto; }
.cc-metric-range { display: inline-flex; align-items: baseline; gap: 4px; white-space: nowrap; }
.cc-metric-range b { font-weight: 700; font-variant-numeric: tabular-nums; }
.cc-metric-range b.peak { color: #ff6b62; }
.cc-metric-range b.low { color: #00d47e; }
.cc-metric-range em { color: #3f5470; font-style: normal; }

.cc-detail-grid { display: grid; grid-template-columns: 1.08fr 1fr 0.86fr; gap: 9px; margin-bottom: 9px; }
.cc-detail-panel-body { padding: 2px 0 0; }

.cc-fs-list { display: flex; flex-direction: column; gap: 7px; }
.cc-fs-row { display: flex; align-items: center; gap: 7px; }

.cc-fs-mount {
  width: 52px;
  flex: 0 0 auto;
  overflow: hidden;
  color: var(--ink-2);
  font-size: 8.5px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.cc-fs-value {
  width: 32px;
  flex: 0 0 auto;
  text-align: right;
  font-size: 8.5px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.cc-usage-track { position: relative; flex: 1; height: 7px; overflow: hidden; border-radius: 4px; background: #12233a; }
.cc-usage-track > span { display: block; height: 100%; border-radius: 4px; }
.cc-usage-track > i { position: absolute; top: -2px; bottom: -2px; width: 1.5px; background: var(--ink); opacity: 0.7; }

.cc-fs-legend { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; color: var(--muted); font-size: 7.5px; }
.cc-fs-legend span { display: inline-flex; align-items: center; gap: 4px; }
.cc-fs-legend i { display: inline-block; width: 6px; height: 6px; border-radius: 2px; }

.cc-fs-history {
  align-self: flex-start;
  margin-top: 2px;
  padding: 3px 0;
  border: 0;
  background: none;
  color: #7fb6ff;
  font-family: inherit;
  font-size: 8px;
  font-weight: 700;
  cursor: pointer;
}
.cc-fs-history:hover { color: #dbe7f5; }

/* Clickable metric cards open the historical view. */
.cc-metric-card.cc-metric-click { cursor: pointer; }
.cc-metric-card.cc-metric-click:focus-visible {
  outline: 2px solid rgba(127, 196, 255, 0.75);
  outline-offset: 2px;
}
.cc-metric-open {
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 2;
  padding: 1px 5px;
  border: 1px solid rgba(96, 165, 250, 0.24);
  border-radius: 999px;
  background: rgba(8, 18, 33, 0.75);
  color: #8fb8e8;
  font-size: 6.8px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  opacity: 0.75;
  transition: opacity 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  pointer-events: none;
}
.cc-metric-click:hover .cc-metric-open,
.cc-metric-click:focus-visible .cc-metric-open {
  opacity: 1;
  color: #dbe7f5;
  border-color: rgba(127, 196, 255, 0.55);
}

/* Historical view inside the Server Statistics drawer. */
.cc-history { display: flex; flex-direction: column; gap: 9px; }
.cc-history-head { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.cc-history-back {
  padding: 4px 9px;
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 7px;
  background: rgba(8, 18, 33, 0.62);
  color: var(--ink-2);
  font-family: inherit;
  font-size: 8.5px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}
.cc-history-back:hover {
  color: #fff;
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.12);
}
.cc-history-heading { flex: 1; min-width: 150px; }
.cc-history-title { color: var(--ink); font-size: 12.5px; font-weight: 800; letter-spacing: 0.2px; }
.cc-history-sub { margin-top: 2px; color: var(--muted); font-size: 8.5px; }

.cc-history-ranges {
  display: inline-flex;
  gap: 3px;
  padding: 3px;
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 9px;
  background: rgba(8, 18, 33, 0.6);
}
.cc-history-range {
  min-width: 34px;
  padding: 4px 7px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  font-family: inherit;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}
.cc-history-range:hover { color: var(--ink); background: rgba(47, 155, 255, 0.1); }
.cc-history-range.active {
  background: linear-gradient(135deg, rgba(47, 155, 255, 0.92), rgba(34, 211, 238, 0.78));
  color: #041020;
  box-shadow: 0 6px 18px -10px rgba(47, 155, 255, 0.9);
}

.cc-history-tabs { display: flex; flex-wrap: wrap; gap: 5px; }
.cc-history-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 9px;
  border: 1px solid rgba(96, 165, 250, 0.15);
  border-radius: 999px;
  background: rgba(8, 18, 33, 0.5);
  color: var(--muted);
  font-family: inherit;
  font-size: 8.5px;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;
}
.cc-history-tab i { display: inline-block; width: 6px; height: 6px; border-radius: 50%; }
.cc-history-tab:hover { color: var(--ink); border-color: rgba(127, 196, 255, 0.35); }
.cc-history-tab.active {
  color: var(--ink);
  border-color: rgba(127, 196, 255, 0.5);
  background: rgba(47, 155, 255, 0.14);
  box-shadow: 0 0 20px -10px rgba(47, 155, 255, 0.9);
}

.cc-history-panel { padding: 11px 12px 9px; overflow: visible; }
.cc-history-panel-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.cc-history-panel-title { color: var(--ink); font-size: 10px; font-weight: 800; }
.cc-history-panel-sub { margin-top: 2px; color: var(--muted); font-size: 8px; }
.cc-history-stats { display: flex; flex-wrap: wrap; gap: 9px; color: var(--muted); font-size: 8px; }
.cc-history-stats b { color: var(--ink); font-variant-numeric: tabular-nums; }
.cc-history-stats .peak b { color: #ff6b62; }
.cc-history-stats .low b { color: #00d47e; }

.cc-history-plot { position: relative; width: 100%; }
.cc-history-plot svg { display: block; width: 100%; height: auto; overflow: visible; }
.cc-history-axis-label { fill: #7f8ea6; font-size: 9px; font-family: inherit; }

/* A small entrance animation: the trend draws left-to-right, then the dots and
   latest-sample beacon settle in. Range and tab switches replay it. */
.cc-history-line {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: cc-history-draw 1.15s cubic-bezier(0.33, 0, 0.2, 1) forwards;
}
.cc-history-area { opacity: 0; animation: cc-history-area-in 1.1s ease 0.15s forwards; }
.cc-history-dots { opacity: 0; animation: cc-history-fade-in 0.7s ease 0.55s forwards; }
.cc-history-latest { opacity: 0; animation: cc-history-fade-in 0.5s ease 1.1s forwards; }
.cc-history-latest > circle:first-child {
  transform-box: fill-box;
  transform-origin: center;
  animation: cc-history-pulse 2.4s ease-out 1.3s infinite;
}

@keyframes cc-history-draw { to { stroke-dashoffset: 0; } }
@keyframes cc-history-area-in { to { opacity: 0.12; } }
@keyframes cc-history-fade-in { to { opacity: 1; } }
@keyframes cc-history-pulse {
  0% { transform: scale(0.55); opacity: 0.85; }
  70%, 100% { transform: scale(1.5); opacity: 0; }
}
.cc-history-tip {
  position: absolute;
  top: 4px;
  z-index: 3;
  min-width: 118px;
  padding: 6px 8px;
  border: 1px solid rgba(127, 196, 255, 0.3);
  border-radius: 8px;
  background: rgba(5, 12, 23, 0.94);
  box-shadow: 0 14px 32px -16px rgba(0, 0, 0, 0.9);
  transform: translateX(-50%);
  pointer-events: none;
}
.cc-history-tip-time { margin-bottom: 3px; color: var(--muted); font-size: 7.5px; }
.cc-history-tip-row { display: flex; align-items: center; gap: 5px; color: var(--ink-2); font-size: 8px; white-space: nowrap; }
.cc-history-tip-row i { flex: 0 0 auto; width: 7px; height: 7px; border-radius: 2px; }
.cc-history-tip-row span { flex: 1; }
.cc-history-tip-row b { color: var(--ink); font-variant-numeric: tabular-nums; }

.cc-history-legend { display: flex; flex-wrap: wrap; gap: 5px 12px; margin-top: 7px; color: var(--muted); font-size: 8px; }
.cc-history-legend span { display: inline-flex; align-items: center; gap: 5px; }
.cc-history-legend i { display: inline-block; width: 8px; height: 3px; border-radius: 2px; }
.cc-history-legend b { font-variant-numeric: tabular-nums; }
.cc-history-note { margin-top: 6px; color: #5f7591; font-size: 7.5px; }
.cc-history-loading,
.cc-history-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border: 1px dashed var(--border);
  border-radius: 10px;
  color: #5f7591;
  font-size: 9px;
}

.cc-cmp-list { display: flex; flex-direction: column; gap: 7px; }
.cc-cmp-row { min-width: 0; }
.cc-cmp-top { display: flex; justify-content: space-between; gap: 6px; margin-bottom: 3px; color: var(--ink-2); font-size: 8px; }
.cc-cmp-top .cc-muted { white-space: nowrap; }
.cc-cmp-legend { margin-top: 2px; color: #5f7591; font-size: 7.5px; }

.cc-facts { display: grid; grid-template-columns: 1fr; gap: 0; margin: 0; }
.cc-facts > div { display: flex; justify-content: space-between; gap: 8px; padding: 3px 0; border-bottom: 1px solid var(--border-soft); font-size: 8.2px; }
.cc-facts > div:last-child { border-bottom: 0; }
.cc-facts dt { margin: 0; color: var(--muted); }
.cc-facts dd { margin: 0; color: var(--ink); font-weight: 600; text-align: right; }

.cc-modal-health {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid;
  border-radius: 3px;
  font-size: 7.5px;
  font-weight: 800;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.cc-detail-empty { padding: 16px 8px; color: var(--muted); font-size: 9px; text-align: center; }
.cc-detail-problems { font-size: 8.6px; }
.cc-detail-problem-name { max-width: 420px; overflow: hidden; text-overflow: ellipsis; }

.cc-modal-foot {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  padding: 8px 18px;
  border-top: 1px solid rgba(27, 52, 81, 0.8);
  background: rgba(7, 17, 30, 0.9);
  color: #5f7591;
  font-size: 8px;
}

.cc-detail-note { flex: 1; min-width: 200px; }
.cc-detail-note.error { color: #ffb3bf; }
.cc-detail-note.partial { color: var(--amber); }
.cc-modal-link { color: #7fc4ff; text-decoration: none; font-weight: 700; white-space: nowrap; }
.cc-modal-link:hover { color: #fff; }

/* ── Freshness (kept for the inventory page) ───────────────── */

.cc-freshness-body { display: flex; flex-direction: column; align-items: center; padding: 7px 8px 8px; }
.cc-freshness .cc-donut { width: 108px; height: 108px; }
.cc-freshness-legend { width: 100%; margin-top: 5px; display: flex; flex-direction: column; gap: 3px; }
.cc-freshness-legend .cc-legend-row { font-size: 8px; }

.cc-donut { position: relative; width: 88px; height: 88px; flex: 0 0 auto; }
.cc-donut svg { width: 100%; height: 100%; display: block; }
.cc-donut-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cc-donut-value { font-size: 17px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
.cc-donut-unit { margin-top: 2px; color: var(--muted); font-size: 7.5px; }

.cc-bars { display: flex; align-items: flex-end; gap: 2px; height: 52px; flex: 1; min-width: 34px; }
.cc-bar { flex: 1; min-width: 2px; border-radius: 1px 1px 0 0; opacity: 0.9; }

/* ── Motion ────────────────────────────────────────────────── */

@keyframes cc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes cc-live-pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 212, 126, 0.45); }
  70% { box-shadow: 0 0 0 7px rgba(0, 212, 126, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 212, 126, 0); }
}
@keyframes cc-live-pulse-amber {
  0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.45); }
  70% { box-shadow: 0 0 0 7px rgba(255, 193, 7, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
}
@keyframes cc-live-pulse-red {
  0% { box-shadow: 0 0 0 0 rgba(255, 77, 103, 0.45); }
  70% { box-shadow: 0 0 0 7px rgba(255, 77, 103, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 77, 103, 0); }
}
@keyframes cc-title-shine { to { background-position: -220% 0; } }
@keyframes cc-marquee { to { transform: translateX(-50%); } }
@keyframes cc-gauge-draw { from { stroke-dasharray: 0 100; } }
@keyframes cc-spark-draw { to { stroke-dashoffset: 0; } }
@keyframes cc-usage-grow { from { transform: scaleX(0); } }
@keyframes cc-cell-ring {
  0%, 100% { opacity: 0; }
  45% { opacity: 1; }
}
@keyframes cc-modal-in {
  from { opacity: 0; transform: translateY(8px) scale(0.99); }
  to { opacity: 1; transform: none; }
}
@keyframes cc-drift-a { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(70px, 50px, 0) scale(1.05); } }
@keyframes cc-drift-b { from { transform: translate3d(0, 0, 0) scale(1); } to { transform: translate3d(-70px, 50px, 0) scale(0.95); } }

/* Motion is decided in JavaScript (see motionAllowed in data/config.ts) so an
   administrator can override a system prefers-reduced-motion setting for an
   always-on wall display. Without the override class the animations run. */
.cc-app.cc-motion-off,
.cc-app.cc-motion-off *,
.cc-app.cc-motion-off *::before,
.cc-app.cc-motion-off *::after {
  animation: none !important;
  transition: none !important;
}

/* ── Readability pass — match the Magic UI concept build ───────
   The first port kept the dense wall-display type sizes. The
   concept build later raised type, spacing and control sizes;
   these overrides bring the plugin to the same scale. */

.cc-eyebrow { font-size: 9.5px; }
.cc-title { font-size: clamp(22px, 1.75vw, 28px); }
.cc-subtitle { font-size: 12px; }

.cc-clock-date { font-size: 10.5px; }
.cc-clock-time { font-size: 23px; }
.cc-clock-zone { font-size: 10px; }

.cc-mode button { font-size: 11px; }
.cc-zabbix-label { font-size: 13px; }
.cc-zabbix-sub { font-size: 9.5px; }
.cc-sample-badge { font-size: 9px; }
.cc-banner { font-size: 11px; }
.cc-banner-btn { font-size: 10px; }

.cc-kpis { gap: 10px; margin-bottom: 14px; }
.cc-kpi { gap: 11px; min-height: 112px; padding: 15px 14px; }
.cc-kpi-icon { width: 32px; height: 32px; border-radius: 9px; }
.cc-kpi-label { font-size: 9.5px; letter-spacing: 0.06em; }
.cc-kpi-value { font-size: clamp(23px, 1.75vw, 27px); }
.cc-kpi-sub {
  overflow: visible;
  margin-top: 3px;
  font-size: 10px;
  line-height: 1.35;
  text-overflow: clip;
  white-space: normal;
}
.cc-kpi-delta { font-size: 9px; }
.cc-kpi-link::before { font-size: 13px; }

.cc-panel { padding: 15px 16px; }
.cc-panel-title { font-size: 13.5px; }
.cc-panel-sub { margin-top: 3px; font-size: 10.5px; }

.cc-util-row { gap: 12px; margin-bottom: 14px; }
.cc-util-body { gap: 16px; margin-top: 13px; }
.cc-ring { width: 92px; height: 92px; }
.cc-ring::before { inset: 9px; }
.cc-ring-inner strong { font-size: 18px; }
.cc-ring-inner span { font-size: 8.5px; }
.cc-stackbar { height: 9px; }
.cc-legend { gap: 5px; margin-top: 10px; }
.cc-legend-row { grid-template-columns: 8px 1fr auto; gap: 7px; font-size: 9.5px; }
.cc-dot { width: 7px; height: 7px; }

.cc-groups { gap: 12px; margin-bottom: 14px; }
.cc-group { padding: 14px 16px; }
.cc-group-head { margin-bottom: 6px; }
.cc-group-name { gap: 8px; font-size: 12.5px; }
.cc-group-total { font-size: 10px; }
.cc-group-legend { gap: 4px 11px; font-size: 9.5px; }
.cc-lg i { width: 6px; height: 6px; }
.cc-tier-row { grid-template-columns: 98px minmax(0, 1fr); gap: 10px; padding: 9px 0; }
.cc-tier-title { font-size: 11.5px; }
.cc-tier-sub { font-size: 9.5px; }
.cc-tier-counts span { font-size: 9.5px; }
.cc-host-grid { gap: 2.5px; }
.cc-cell { width: 7px; height: 7px; border-radius: 2px; }
.cc-legend-inline { font-size: 9.5px; }

.cc-bottom { gap: 12px; margin-bottom: 14px; }
.cc-table { margin-top: 11px; font-size: 11.5px; }
.cc-table th { padding-bottom: 7px; font-size: 9px; }
.cc-table td { padding: 7px 7px 7px 0; }
.cc-tabs { padding: 3px; border-radius: 8px; margin-top: 10px; }
.cc-tab { padding: 5px 10px; border-radius: 6px; font-size: 10px; }
.cc-status { font-size: 9.5px; }
.cc-row-arrow { font-size: 12px; }

.cc-problem-tabs { padding: 8px 0 10px; }
.cc-problem-table { min-width: 1460px; font-size: 10.5px; }
.cc-problem-table td { padding: 8px 9px 8px 0; }
.cc-problem-table thead th { padding-bottom: 7px; font-size: 9px; }
.cc-sev { font-size: 9.5px; }
.cc-footer { padding-top: 12px; font-size: 9.5px; }

.cc-modal-kicker { font-size: 10.5px; letter-spacing: 0.14em; }
.cc-modal-source { font-size: 9.5px; }
.cc-modal-sub { font-size: 11.5px; }
.cc-modal-close { font-size: 22px; }
.cc-gauge-center strong { font-size: 24px; }
.cc-gauge-center span { font-size: 10px; }
.cc-metric-name { font-size: 9.5px; }
.cc-metric-band { font-size: 8.5px; }
.cc-metric-fleet { font-size: 9px; }
.cc-metric-foot { font-size: 8.5px; }
.cc-detail-spark-empty { font-size: 9px; }
.cc-fs-mount { font-size: 9.5px; }
.cc-fs-value { font-size: 9.5px; }
.cc-fs-legend { font-size: 8.5px; }
.cc-cmp-top { font-size: 9px; }
.cc-cmp-legend { font-size: 8.5px; }
.cc-facts > div { font-size: 9.2px; }
.cc-modal-health { font-size: 8.5px; }
.cc-detail-empty { font-size: 10px; }
.cc-detail-problems { font-size: 9.5px; }
.cc-modal-foot { font-size: 9px; }
.cc-freshness-legend .cc-legend-row { font-size: 9px; }
.cc-donut-value { font-size: 18px; }
.cc-donut-unit { font-size: 8.5px; }

/* ── Data Center Operation dashboard ───────────────────────── */

/* DCO shows eight KPIs (no stale tile), so it gets eight equal columns and
   fills the row edge to edge. The :where() wrapper keeps this at the same
   specificity as the base .cc-kpis rule so the responsive column counts
   defined later still win. */
:where(.cc-dc) .cc-kpis {
  grid-template-columns: repeat(8, minmax(0, 1fr));
}

/* Production, Disaster Recovery and Servers in Maintenance share one row:
   the two Infrastructure group panels on the left, the maintenance list on
   the right. All three stretch to the row height. */
.cc-dc-envs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 14px;
}

/* The maintenance list is capped by the environment panels, not by its own
   length: size containment keeps a long list from making the row taller. */
.cc-dc-envs > .cc-panel:not(.cc-group) {
  display: flex;
  flex-direction: column;
  min-height: 0;
  contain: size;
}

.cc-maintenance-scroll {
  flex: 1 1 auto;
  min-height: 0;
  max-height: 520px;
  overflow: auto;
  margin-top: 9px;
  border-radius: 8px;
}

.cc-maintenance-scroll .cc-table-wrap { overflow: visible; }

.cc-dc-envs .cc-maintenance-table .cc-col-secondary { display: none; }

.cc-maintenance-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #0a1526;
  box-shadow: 0 1px 0 var(--border);
}

.cc-maintenance-state {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--cyan);
  white-space: nowrap;
}

.cc-maintenance-state i {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 2px;
  background: var(--cyan);
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.7);
}

/* ── Responsive ────────────────────────────────────────────── */

@media (max-width: 1500px) {
  .cc-kpis { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .cc-bottom { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 1400px) {
  .cc-title { white-space: normal; }
  .cc-header-filters { order: 3; flex: 1 1 100%; max-width: none; margin-top: 2px; }
}

@media (max-width: 1200px) {
  .cc-util-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-groups { grid-template-columns: 1fr; }
  .cc-dc-envs { grid-template-columns: 1fr; }
  /* Stacked, the maintenance panel sets its own height again. */
  .cc-dc-envs > .cc-panel:not(.cc-group) { contain: none; }
  .cc-maintenance-scroll { max-height: 360px; }
  .cc-header-right { margin-left: 0; }

}

@media (max-width: 1000px) {
  .cc-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-detail-grid { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .cc-filter-controls { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .cc-app { padding: 10px; }
  .cc-kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cc-util-row, .cc-bottom { grid-template-columns: 1fr; }
  .cc-title { font-size: 18px; }
  .cc-subtitle { white-space: normal; }
  .cc-header-filters { order: 0; flex: 0 0 auto; width: 100%; margin-top: 0; }
}

@media (max-width: 620px) {
  .cc-ticker-label { display: none; }
  .cc-modal-backdrop { padding: 0; }
  .cc-modal { max-height: 100vh; border-radius: 0; border-left: 0; border-right: 0; }
  .cc-modal-head, .cc-modal-body, .cc-modal-foot { padding-left: 12px; padding-right: 12px; }
  .cc-modal-title { font-size: 18px; }
  .cc-fs-mount { width: 44px; }
}

/* Static fallbacks for entrance animations whose initial state is hidden; the
   class is added when motion is disabled, whether by the system preference or
   by the plugin's own Animations setting. */
.cc-app.cc-motion-off .cc-ticker-track,
.cc-app.cc-motion-off .cc-modal-beam,
.cc-app.cc-motion-off .cc-modal-aurora,
.cc-app.cc-motion-off .cc-title,
.cc-app.cc-motion-off .cc-srv-title,
.cc-app.cc-motion-off .cc-modal-title,
.cc-app.cc-motion-off .cc-gauge-fill,
.cc-app.cc-motion-off .cc-usage-track > span { animation: none; }
.cc-app.cc-motion-off .cc-spark-line { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
.cc-app.cc-motion-off .cc-history-line { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
.cc-app.cc-motion-off .cc-history-area { animation: none; opacity: 0.12; }
.cc-app.cc-motion-off .cc-history-dots,
.cc-app.cc-motion-off .cc-history-latest { animation: none; opacity: 1; }
.cc-app.cc-motion-off .cc-history-latest > circle:first-child { animation: none; opacity: 0.35; }
`;
