# OpsBeacon 0.8.1

OpsBeacon is an Infrastructure Operations Command Center for Grafana and Zabbix. This
release fixes the empty live dashboard seen after disabling the sample dataset and adds the
portable Zabbix connection settings.

## Highlights

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

## Install

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
