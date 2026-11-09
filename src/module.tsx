import React from 'react';
import { AppPlugin, AppRootProps } from '@grafana/data';
import { CommandCenterPage } from './CommandCenterPage';
import { DataCenterPage } from './DataCenterPage';
import { ErrorBoundary } from './ErrorBoundary';
import { ServerListPage } from './ServerListPage';
import { ZabbixConfigPage } from './ZabbixConfigPage';
import { normalizeConfig } from './data/config';

// Grafana renders the app root page for every /a/<pluginId>/* subpath and passes
// the subpath plus the parsed query string. Use that to serve the KPI drill-down
// server list without a backend route.
function AppRoot(props?: AppRootProps) {
  const rawPath =
    (props && props.path) ||
    (typeof window !== 'undefined' ? window.location.pathname : '');
  const path = String(rawPath).split('?')[0].split('#')[0];
  // Grafana passes the plugin meta (including jsonData) to the app root, so the
  // stored sample-data switch is honoured on the very first render.
  const initialConfig = normalizeConfig(((props as any)?.meta?.jsonData) || undefined);
  let page: React.ReactNode;
  if (/\/servers\/?$/.test(path)) {
    page = <ServerListPage query={props && props.query} initialConfig={initialConfig} />;
  } else if (/\/data-center\/?$/.test(path)) {
    page = <DataCenterPage initialConfig={initialConfig} />;
  } else {
    page = <CommandCenterPage initialConfig={initialConfig} />;
  }
  // Keyed by route: a crash on one dashboard cannot poison the others, and a
  // render exception shows the recoverable error card instead of a blank page.
  return <ErrorBoundary key={path}>{page}</ErrorBoundary>;
}

export const plugin = new AppPlugin<{}>()
  .setRootPage(AppRoot)
  .addConfigPage({
    id: 'zabbix',
    title: 'Zabbix connection',
    icon: 'database',
    body: ZabbixConfigPage,
  });
