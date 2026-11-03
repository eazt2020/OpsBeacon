# Changelog

All notable changes to OpsBeacon are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

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
