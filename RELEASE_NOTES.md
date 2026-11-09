# OpsBeacon release notes

Release notes for every published version, newest first. The detailed change history,
including fixes not called out here, is in [CHANGELOG.md](CHANGELOG.md).

## 0.9.40

- **Dashboard animations now have an explicit setting.** The aurora drift, LIVE PROBLEMS
  marquee, title shimmer, gauge fill and history-chart animations could appear completely
  static on a production Grafana because the browser reported
  `prefers-reduced-motion: reduce`. Windows Remote Desktop sessions and desktops with
  animation effects turned off report that by default, and the plugin previously honoured it
  with a global media query that nothing could override.
- The **Zabbix connection** tab now has an **Animations** control under **Branding**:
  **Follow the system setting** (default), **Always animate** and **Always reduce motion**.
  Choose **Always animate** for a wall display that must keep moving; the default keeps the
  accessibility behaviour for everyone else.
- Static fallbacks for history charts and gauges still apply whenever motion is reduced, so
  no chart is left hidden.
- Fixed the **Zabbix connection** dropdowns: they no longer collapse to a thin strip with the
  selected value hidden. Grafana's global stylesheet gives every `select` a 4 px height; the
  page now restores a normal 36 px control height, so Authentication, Animations and
  Data mode show their current value.

## 0.9.39

- Security review fixes. **Server inventory CSV export** now neutralises spreadsheet formula
  injection: a hostname, tag, business service or problem text beginning with `=`, `+`, `-`,
  `@`, tab or carriage return is exported with a leading apostrophe, so Excel and Google
  Sheets display it as text instead of executing it.
- The **Zabbix connection** tab warns when a Direct endpoint uses plain `http://` to a
  non-local address, because the API token or login password would cross the network
  unencrypted. Use `https://` or the Proxy transport.
- The README security notes now state explicitly that Direct-transport credentials are
  readable by any signed-in user who can open the app, including Viewers, and that Proxy
  transport keeps the token server-side.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.38

- Fixed live hosts being shown as **Stale / No Data** while Zabbix was delivering data
  every minute. Data freshness was measured with the browser's clock; on a workstation
  whose clock ran about 12 hours fast, every item looked more than 10 minutes old, so the
  Zabbix server was excluded from **Available** and its problem durations read `13h 35m`
  instead of about an hour. Freshness and durations are now measured against the newest
  item timestamp Zabbix itself returns. A host is stale when its data lags the estate by
  5–10 minutes (no data beyond 10), and if the whole estate stops advancing for 15 minutes
  every host is shown as no data — the elapsed check uses a monotonic timer, so a wrong
  system clock cannot affect it.
- Problem **Time** values are now formatted in Asia/Singapore like the header clock,
  instead of the workstation's own time zone.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.37

- Data Center Ops now lays its eight KPIs out in eight equal columns, so the row
  stretches edge to edge like the panels below it instead of leaving an empty slot
  where the removed stale tile used to sit.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.36

- Removed the **STALE / NO DATA** KPI tile from Data Center Ops, leaving it with eight
  fleet KPIs. The stale-data value is still tracked by the shared data hook and remains
  visible on the Command Center.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.35

- Fixed the dashboards (Command Center and Data Center Ops) going blank after being left
  open for a while. The translucent panels no longer use `backdrop-filter` over the moving
  aurora background, the aurora orbs no longer carry a large `blur()` filter, and the
  alert-card border sheen is static. Those effects forced the browser to re-blur and
  re-rasterise the whole page every frame, which eventually exhausted the GPU process and
  left the tab painting nothing on wall displays.
- Live refresh cycles no longer stack: if a Zabbix response is slower than the configured
  interval, the next tick is skipped instead of starting a second full fetch, so a
  dashboard left open for hours cannot accumulate in-flight requests and memory.
- Added a render error boundary around each dashboard page. If a render exception ever
  occurs, the page shows a readable error card with **Reload dashboard** instead of
  unmounting into a blank page.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.34

- Data Center Ops now counts only **Warning and Critical** problems as unacknowledged
  (acknowledged problems are handled, Info items are informational). The **UNACKNOWLEDGED**
  KPI equals **WARNING + CRITICAL** exactly, and the Unacknowledged Problems panel and
  marquee use the same set. The panel no longer shows an Info tab.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.33

- In Data Center Ops, the **WARNING** and **CRITICAL** KPI panels now count only
  unacknowledged problems by severity, with their subtitle showing the share of the
  unacknowledged problem set. They now agree with the **UNACKNOWLEDGED** panel and the
  Unacknowledged Problems table. The Command Center is unchanged.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.32

- The **LIVE PROBLEMS** spacer is now a full viewport-width blank sweep, replacing the
  120 px gap. Each list is rendered once per loop, then the strip stays completely empty
  until the list re-enters — a single problem now gets a clean, full-width pause instead of
  appearing to repeat back to back.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.31

- The **LIVE PROBLEMS** marquee on both dashboards now leaves a blank gap before looping
  back to its first problem, so a repeated list — especially a single problem — cannot be
  mistaken for extra rows.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.30

- Added the **LIVE PROBLEMS** marquee to Data Center Ops, directly under the header. It
  behaves like the Command Center marquee — severity-ranked, constant reading speed,
  clickable hostnames — but lists only unacknowledged problems, matching the DCO
  Unacknowledged Problems panel.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.29

- Moved the **Servers in Maintenance** panel to the right of Production and Disaster
  Recovery, in the same row. All three panels stretch to a common height, the maintenance
  list scrolls inside its card, and the Business Service and OS columns are hidden in the
  narrower column. The row stacks on screens narrower than 1200 px.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.28

- Added a **Servers in Maintenance** panel to Data Center Ops. It lists every host in a
  Zabbix maintenance window that matches the active filters, with environment, tier,
  business service, OS, last data age and a maintenance state badge; hostnames open the
  per-server statistics drawer.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.27

- The Data Center Ops problem panel is now **Unacknowledged Problems**: it lists only
  problems that have not been acknowledged, and its severity tabs, panel total and
  "Showing X of Y" counter are computed from that filtered set. The main Command Center
  still shows all active problems.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.26

- The Data Center Ops **Production** and **Disaster Recovery** panels now use the same
  group panels as the Infrastructure Command Center — environment header with totals, the
  healthy/warning/critical/other summary, Tier 1–3 lanes with per-tier counts, the
  clickable host hive grid and the status legend.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.25

- Dashboards are now **fully independent**. Every open dashboard or tab runs its own
  refresh timer and makes its own Zabbix request; nothing is shared, cached or locked in
  browser storage, so opening Data Center Ops in a second tab gives it its own refresh
  cycle immediately.
- Removed the cross-tab snapshot cache, the fetch lock and the Web Locks coordination
  introduced in 0.9.22–0.9.24, along with their leftover `localStorage` keys.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.9.23

- Added the **Data Center Ops** dashboard: nine fleet KPI panels, Production and Disaster
  Recovery environment panels and the Active Problems table.
- Production and Disaster Recovery use the same clickable host **hive grid** as the
  Infrastructure Command Center, with each square opening that server's statistics drawer.
- Live refreshes run in the background: the previous snapshot stays on screen and the header
  stays in its LIVE state, and the header clock no longer re-renders the whole page every
  second.
- Server Inventory remembers which dashboard opened it: drill-downs from Data Center Ops
  show a **← Data Center Ops** back link, while Command Center drill-downs return to the
  Command Center.
- See [CHANGELOG.md](CHANGELOG.md) for details.

## 0.8.1

OpsBeacon is an Infrastructure Operations Command Center for Grafana and Zabbix. This
release fixes the empty live dashboard seen after disabling the sample dataset and adds the
portable Zabbix connection settings.

### Highlights

- **Stale filter fix** — SAMPLE-mode URL filters are ignored once the sample dataset is
  disabled, so live hosts are no longer hidden by an old `source=sample&businessService=…`
  link.
- **Clear filters banner** — a `NO SERVERS MATCH FILTERS` banner appears when the active
  filters exclude every host, with a one-click reset.
- **Remote Zabbix** — set the Zabbix address, transport (proxy or direct) and authentication
  (API token or username/password) on the plugin's **Zabbix connection** tab.
- **Live-only mode** — clear **Enable sample dataset** to hide the SAMPLE switch and always
  open on live data.
- **Drill-downs** — every KPI count, Business Services row and DR Readiness row opens the
  matching server inventory; every host square opens that server's statistics drawer.

### Install

Download `acme-command-center-app-0.8.1.zip`, then on the Grafana server:

```bash
sudo mkdir -p /var/lib/grafana/plugins
sudo unzip acme-command-center-app-0.8.1.zip -d /var/lib/grafana/plugins
sudo chown -R grafana:grafana /var/lib/grafana/plugins/acme-command-center-app
sudo systemctl restart grafana-server
```

Allow the unsigned plugin in `grafana.ini`:

```ini
[plugins]
allow_loading_unsigned_plugins = acme-command-center-app
```

Requirements: Grafana >= 11.6.0, Zabbix 7.0 JSON-RPC API. See the README for configuration,
Zabbix tagging and security notes.
