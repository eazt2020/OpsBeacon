# Changelog

All notable changes to OpsBeacon are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [0.9.40] - 2026-11-09

### Added

- **Animations** setting on the Zabbix connection tab, under Branding: **Follow the system
  setting** (default), **Always animate** or **Always reduce motion**. The setting controls
  the aurora drift, LIVE PROBLEMS marquee, title shimmer, gauge fill and history-chart
  entrance animations.

### Fixed

- Dashboard animations no longer disappear on installations whose browser reports
  `prefers-reduced-motion: reduce`. The plugin previously disabled every animation with a
  global CSS media query, so a production Grafana opened over Windows Remote Desktop (which
  turns animation effects off by default) or on a managed desktop appeared completely
  static, with no way to override it. Motion is now decided in JavaScript from the saved
  preference; the default still follows the system setting, and **Always animate** re-enables
  the animations for wall displays. The static fallbacks for the history charts and gauges
  are still applied whenever motion is disabled.
- The dropdowns on the **Zabbix connection** tab no longer collapse to a thin strip with the
  selected value hidden. Grafana's global stylesheet contains a `select` rule with
  `height: 4px` and `line-height: 4`; the page now restores a 36 px control height and normal
  line box, matching the text inputs. This affects the Authentication, Animations and
  Data mode selects.

## [0.9.39] - 2026-11-09

### Security

- Server inventory CSV export is no longer vulnerable to spreadsheet formula injection.
  Cells beginning with `=`, `+`, `-`, `@`, tab (`0x09`) or carriage return (`0x0D`) are
  exported with a leading apostrophe. Hostnames, host groups, tags, OS, business service
  and the latest problem text are all covered, so opening the export in Excel or Google
  Sheets cannot execute a formula planted in Zabbix host metadata. Quoting and escaping of
  commas, quotes and newlines is unchanged.
- The Zabbix connection tab now shows a warning when a Direct endpoint resolves to plain
  `http://` on a non-local host. In that configuration the API token or login password is
  sent over the network in clear text; the warning points to `https://` or the Proxy
  transport. Localhost, loopback and same-origin relative proxy paths are not flagged.
- README security notes now spell out that Direct-transport credentials are readable by
  every signed-in user who can open the app, including Viewers, and that Proxy transport is
  the way to keep the token server-side.

## [0.9.38] - 2026-11-08

### Fixed

- Live hosts are no longer marked **Stale / No Data** because of the browser's clock.
  Freshness was calculated as `Date.now() - item.lastclock` on the client; a workstation
  clock running about 12 hours fast made every host look more than 10 minutes stale, so
  the Zabbix server disappeared from **Available** and problem durations were inflated
  (`13h 35m` instead of about `1h 20m`). The reference "now" is now the newest item clock
  returned by the Zabbix API. A host is stale when its newest item lags the estate's newest
  item by 5–10 minutes, and no-data beyond 10 minutes. If the newest item in the estate has
  not advanced for 15 minutes (collection stalled while the API still answers), every host
  is marked no-data; that interval is measured with `performance.now()`, which is immune to
  wall-clock skew.
- The live sync timestamp and problem durations use the same Zabbix-derived reference, and
  problem start times are formatted in Asia/Singapore to match the header clock instead of
  the browser's time zone.

## [0.9.37] - 2026-11-08

### Fixed

- Data Center Ops KPI row now uses eight equal columns instead of the inherited
  nine-column grid. With the stale tile gone, the eight remaining tiles fill the row
  edge to edge and line up with the environment panels below. The `:where()` selector
  keeps the same specificity as the base rule, so the responsive 5- and 2-column
  breakpoints still apply.

## [0.9.36] - 2026-11-08

### Changed

- Removed the **STALE / NO DATA** KPI tile from Data Center Ops. The dashboard now shows
  eight fleet KPIs: Total Servers, Available, Unavailable, Warning, Critical, Total
  Problems, Unacknowledged and In Maintenance. Stale-data tracking is unchanged and still
  shown on the Command Center.

## [0.9.35] - 2026-11-09

### Fixed

- Both command-center dashboards no longer turn into a blank page when left open for a
  while. The repeated `backdrop-filter: blur()` on every KPI card and panel, the large
  `blur()` filter on the three aurora orbs (which drift continuously behind those panels),
  and the animated conic-gradient border on alert cards made the browser re-blur and
  re-rasterise the page on every frame. That continuous GPU work could exhaust the
  compositor/GPU process on a wall display, after which Chrome painted nothing. The panels
  keep their translucent gradient look, the aurora keeps its slow drift and soft radial
  gradients, and the alert sheen is now a static gradient; none of them require a per-frame
  blur.
- Live refreshes can no longer stack. If a Zabbix fetch is still in flight when the next
  refresh tick fires (for example with a 15 s interval and a slow Zabbix), the tick is
  skipped. Previously each tick started another full fetch, so a dashboard left open for
  hours could accumulate concurrent requests and large payloads.
- A render error can no longer blank the plugin: `AppRoot` now wraps each page in an
  error boundary that shows the error and a **Reload dashboard** action, and logs the
  component stack to the browser console.

## [0.9.34] - 2026-11-08

### Changed

- Data Center Ops now counts only **Warning and Critical** problems as unacknowledged:
  acknowledged problems are considered handled and Info items are informational. The
  **UNACKNOWLEDGED** KPI therefore equals **WARNING + CRITICAL** exactly (for example
  18 + 18 = 36), and the **Unacknowledged Problems** panel title, tab counts and
  **LIVE PROBLEMS** marquee use the same set.
- The DCO Unacknowledged Problems panel no longer shows an Info tab; the Command Center
  still shows all four problem severities.

## [0.9.33] - 2026-11-08

### Changed

- The Data Center Ops **WARNING** and **CRITICAL** KPI panels now count only
  **unacknowledged problems** by severity instead of all hosts with that severity. Their
  subtitles show the share of the unacknowledged problem set, so they agree with the
  **UNACKNOWLEDGED** KPI and the **Unacknowledged Problems** panel. The Command Center KPI
  row is unchanged.

## [0.9.32] - 2026-11-08

### Changed

- The **LIVE PROBLEMS** spacer is now a full viewport-width blank sweep instead of a
  120 px gap. Each list is rendered once per loop and followed by the blank sweep, so the
  next copy cannot appear until the current list has scrolled completely away. With a single
  problem this leaves an entirely empty strip before the problem re-enters, and the blank is
  wide enough to keep the strip wider than the screen, so the artificial repetition of short
  lists is no longer needed.

## [0.9.31] - 2026-11-08

### Changed

- The **LIVE PROBLEMS** marquee on both dashboards now leaves a blank gap before the list
  loops back to its first problem. When only one problem is active, each repeated occurrence
  is separated by the gap, so the strip reads as a loop instead of looking like many copies
  of the same problem.
- The gap is an empty 120 px spacer (plus the existing 34 px item gap) between loop
  repetitions, and it is included in the animation width so the scroll speed stays constant.

## [0.9.30] - 2026-11-08

### Added

- The **LIVE PROBLEMS** marquee from the Infrastructure Command Center now also runs on the
  Data Center Ops dashboard, directly under the header. It uses the same severity-ranked
  selection, reading-speed animation and clickable hostnames, but is fed only by
  unacknowledged problems — matching the DCO **Unacknowledged Problems** panel and KPI.

## [0.9.29] - 2026-11-08

### Changed

- The Data Center Ops **Servers in Maintenance** panel now sits to the right of the
  **Production** and **Disaster Recovery** panels in the same row instead of below them.
  The three panels are grid columns that share a row height; the maintenance list scrolls
  inside its card, and size containment stops a long list from stretching the row.
- The maintenance table drops the **Business Service** and **OS** columns in the narrower
  three-column layout so hostname, environment, tier, last data and state stay readable.
- The environment row stacks to one column below 1200 px, matching the Infrastructure group
  panels.

## [0.9.28] - 2026-11-08

### Added

- **Servers in Maintenance** panel on the Data Center Ops dashboard. It lists every host in
  a Zabbix maintenance window that matches the active filters, sorted by environment and
  tier, with hostname, environment, tier, business service, OS, last data age and a
  maintenance state badge. Hostnames open the per-server statistics drawer, and the panel
  total matches the **IN MAINTENANCE** KPI.

## [0.9.27] - 2026-11-08

### Changed

- The Data Center Ops problem panel is now **Unacknowledged Problems** and lists only
  problems where `ack` is false. The severity tabs, panel title count and "Showing X of Y"
  counter are computed from the unacknowledged set. The Command Center keeps showing all
  active problems.
- `ProblemsTable` accepts an optional `title` so each dashboard can label the panel.

## [0.9.26] - 2026-11-08

### Changed

- The Data Center Ops **Production** and **Disaster Recovery** panels now reuse the same
  group panels as the Infrastructure Command Center: environment name and total, the
  healthy/warning/critical/other summary, Tier 1–3 lanes with per-tier status counts, the
  clickable host hive grid and the status legend.
- Removed the DCO-specific health-mix donut, status cards and per-panel inventory link.

## [0.9.25] - 2026-11-08

### Changed

- Dashboards are now **fully independent**. Every open dashboard/tab runs its own refresh
  timer and makes its own Zabbix request; opening a second dashboard starts its own refresh
  cycle immediately instead of adopting another tab's snapshot.
- Removed the cross-tab snapshot cache, the fetch lock and the Web Locks coordination. The
  poller no longer reads or writes any `localStorage` key; the keys used by 0.9.22–0.9.24
  are deleted on load.

## [0.9.24] - 2026-11-08

### Fixed

- Opening the Infrastructure Command Center and Data Center Ops in the same browser no
  longer makes both dashboards keep refreshing independently. A shared live snapshot is now
  reused for a full refresh interval instead of a 2.5-second window, so tabs whose refresh
  timers are offset take turns: one fetches per interval and the other adopts its snapshot.
  A per-tab "newer than what I already show" rule keeps a dashboard refreshing every
  interval when it is open on its own.
- The cross-tab fetch lock now uses the Web Locks API, which is atomic across tabs, with the
  localStorage lock kept as a fallback. Two dashboards that tick at the same instant can no
  longer both call Zabbix.
- The Server Inventory **Refresh** button still bypasses the shared snapshot and performs a
  real fetch.

## [0.9.23] - 2026-11-08

### Fixed

- Inventory drill-downs opened from **Data Center Ops** now remember their origin. The
  Server Inventory back link reads the `from=data-center` marker and returns to
  `/data-center` with a **← Data Center Ops** label; inventory opened from the Command
  Center still returns to the Command Center.

## [0.9.22] - 2026-11-08

### Fixed

- Opening the Command Center and Data Center Ops in the same browser no longer makes
  them fight over live refreshes. Live data is now cached per Zabbix connection and Grafana
  user, and a fetch lock ensures one tab calls Zabbix per interval while the other reuses
  the snapshot. This also avoids duplicate `user.login` calls with username/password auth.
- Background refreshes keep the previous snapshot on screen and the header in its LIVE
  state; the SYNC/Connecting state is shown only on the initial load.
- The header clock was isolated into its own component, so the one-second tick no longer
  re-renders the entire dashboard (and does not reconcile thousands of host cells per
  second when both command centers are open).
- The filter panel's expanded/collapsed state is now stored per dashboard instead of being
  shared between the Command Center and Data Center Ops.

## [0.9.21] - 2026-11-08

### Changed

- The **Production** and **Disaster Recovery** panels on the Data Center Operation
  dashboard now use the same host **hive grid** as the Infrastructure Command Center,
  grouped into Tier 1–3 lanes. Each square is clickable and opens that server's statistics
  drawer; the tier status counts match the main dashboard.
- Replaced the thin tier health bars in those panels with the hive grid.

## [0.9.20] - 2026-11-08

### Added

- **Data Center Operation Command Center** dashboard, available from the plugin navigation
  as **Data Center Ops**. It shows nine KPI panels (Total Servers, Available, Unavailable,
  Warning, Critical, Total Problems, Unacknowledged, In Maintenance and Stale / No Data),
  dedicated **Production** and **Disaster Recovery** environment panels with a health-mix
  donut, per-status counts and tier health bars, and the Active Problems table.
- The environment panels link to the server inventory scoped to that environment and every
  KPI drills down to the matching host list.

### Changed

- Page source, configuration, filters and derived data now come from a shared `useOpsData`
  hook used by both the Command Center and Data Center Operation dashboards.
- The dashboard header accepts custom title and subtitle text.

## [0.9.19] - 2026-11-08

### Changed

- Sample inventory now uses **RHEL**, **Solaris**, **Windows** and **AS400** as OS labels,
  and AS400 sample hosts use IBM i IFS-style mounts (`/`, `/QIBM/ProdData`, `/QOpenSys`,
  `/home`).

## [0.9.18] - 2026-11-08

### Added

- IBM i / AS/400 monitoring support. OS detection recognises `IBM i`, `AS/400`, `OS/400`,
  `i5/OS` and `iSeries` in host inventory or `system.uname`, and treats any `as400.*` item
  as an IBM i host.
- CPU fallbacks for the AS/400 agent emulator aggregate key `proc.cpu.util[,,total,,,]` and
  for SNMP per-core `hrProcessorLoad` items, which are averaged on the dashboard and in
  historical charts.
- Memory fallbacks for `vm.memory.size[pfree]` and for `available`/`free` ÷ `total` pairs,
  converted to a used percentage in both snapshot data and history.
- Disk and filesystem support for IBM i `as400.disk.size[<unit>,pused]` alongside the
  existing `vfs.fs.size[...pused]` keys.
- SNMP interface counters (`ifInOctets`/`ifOutOctets` and 64-bit variants) are used for
  network utilisation when the item units are bit rates.
- IBM i hosts and IFS-style mounts in the sample dataset, and README coverage of both IBM i
  monitoring routes.

## [0.9.17] - 2026-11-08

### Added

- Server Statistics historical view: clicking any CPU, memory, disk or network panel opens
  point-to-point history charts with peak/low markers, 70 % and 90 % threshold lines, axis
  labels and a hover crosshair tooltip.
- History range filters for hours, days and months: **6H**, **24H**, **7D**, **30D**,
  **90D** and **6M**. Raw history serves ranges up to 24 hours; hourly trends serve longer
  ranges, with a fallback to history when trends are unavailable.
- Filesystems tab plotting every filesystem on one chart (up to eight mounts) with a
  colour legend and latest value per mount, plus a **View filesystem history** link from the
  filesystem usage panel.
- Keyboard support for the history view: metric cards are focusable and open on Enter or
  Space; **Esc** returns to the overview before closing the drawer.
- Motion in the history chart: the trend draws left-to-right, the area and per-point dots
  fade in, a beacon pulses on the latest sample, and each series is slightly staggered.
  The animation replays when the range or metric tab changes and is disabled under
  `prefers-reduced-motion`.

## [0.8.1] - 2026-11-03

### Fixed

- Stale SAMPLE-mode URL filters no longer hide live hosts after the sample dataset is
  disabled. When sample data is off, the dashboard and server inventory ignore
  `source=sample` deep-link filters.
- Added a `NO SERVERS MATCH FILTERS` banner with a **Clear filters** action so a zero-match
  filter combination is visible instead of an apparently empty dashboard.

### Added

- Configurable Zabbix address, transport (proxy or direct) and authentication (API token or
  username/password), allowing the plugin to run on a different Grafana server and point at
  a remote Zabbix.
- **Enable sample dataset** setting. When cleared, Grafana-hosted pages are live-only and
  the SAMPLE switch is replaced by a `LIVE ONLY` badge.
- **Server inventory** page with free-text search and KPI, Business Services and DR
  Readiness drill-downs.
- Per-server statistics drawer with CPU, memory, disk and network gauges, 24-hour history,
  filesystem usage, fleet comparison, host facts and active problems.

### Changed

- README expanded with installation, configuration, panel-to-Zabbix mapping, security,
  troubleshooting and release guidance.

## [0.8.0] - 2026-11-03

- Initial public build of the Command Center dashboard, deterministic sample dataset and
  live Zabbix data mapping.
