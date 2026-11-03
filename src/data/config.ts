/**
 * Zabbix wiring configuration.
 *
 * The values live in the Grafana plugin settings (jsonData) and are edited on the
 * app's configuration tab: Administration -> Plugins -> Infrastructure Command
 * Center -> Zabbix connection.
 *
 * Two transports are supported:
 *   proxy  - POST to an nginx location that validates the Grafana session and
 *            injects a server-side Zabbix token. The token never reaches the browser.
 *            The nginx upstream is fixed on the Grafana server, so this transport is
 *            for a Zabbix instance reachable from that server (typically localhost).
 *   direct - POST straight to the Zabbix API from the browser. The Zabbix address is
 *            configured here, so the same plugin install can point at a remote Zabbix.
 *            Authentication is either a bearer API token or a username/password that
 *            is exchanged for a session token through user.login.
 */

export const PLUGIN_ID = 'acme-command-center-app';

export type ZabbixTransport = 'proxy' | 'direct';

/** How the direct transport authenticates against Zabbix. */
export type ZabbixAuthMethod = 'token' | 'credentials';

export interface ZabbixConfig {
  /** How the browser reaches the Zabbix API. */
  transport: ZabbixTransport;
  /**
   * Zabbix address for the direct transport: an IP/hostname, a base URL or a full
   * api_jsonrpc.php URL. normalizeApiUrl() expands it to an absolute endpoint.
   */
  apiUrl: string;
  /** Authentication used by the direct transport. */
  authMethod: ZabbixAuthMethod;
  /** Zabbix API token used when authMethod is 'token'. */
  token: string;
  /** Zabbix user used when authMethod is 'credentials'. */
  username: string;
  /**
   * Zabbix password used when authMethod is 'credentials'. It is exchanged for a
   * short-lived session token at connect time; only the session token is sent to
   * the API. The password itself is stored in plugin settings (see README).
   */
  password: string;
  /** nginx location (relative to the Grafana sub-path) that injects the token. */
  proxyPath: string;
  /** nginx location used for apiinfo.version (called without Authorization). */
  publicPath: string;
  /** Dashboard auto-refresh interval, in seconds. */
  refreshSeconds: number;
  /** Whether the built-in sample dataset can be selected in the dashboard. */
  sampleDataEnabled: boolean;
  /** Data mode selected when the page is first opened. */
  defaultSource: 'sample' | 'live';
}

export const DEFAULT_ZABBIX_CONFIG: ZabbixConfig = {
  transport: 'proxy',
  apiUrl: '/api_jsonrpc.php',
  authMethod: 'token',
  token: '',
  username: '',
  password: '',
  proxyPath: 'zabbix-api',
  publicPath: 'zabbix-public',
  refreshSeconds: 60,
  sampleDataEnabled: true,
  defaultSource: 'sample',
};

/**
 * Decide the active data source. Sample data can be disabled by an administrator;
 * in that case Grafana-hosted dashboards are live-only. The standalone preview has
 * no Grafana backend, so it always keeps the sample dataset.
 */
export function resolveSource(
  requested: 'sample' | 'live',
  canGoLive: boolean,
  sampleDataEnabled: boolean
): 'sample' | 'live' {
  if (!canGoLive) {
    return 'sample';
  }
  if (!sampleDataEnabled) {
    return 'live';
  }
  return requested === 'live' ? 'live' : 'sample';
}

export function appSubUrl(): string {
  const g = (globalThis as any).grafanaBootData;
  return (g && g.settings && g.settings.appSubUrl) || '';
}

export function isGrafanaHosted(): boolean {
  return !!(globalThis as any).grafanaBootData;
}

function settingsUrl(): string {
  return `${appSubUrl()}/api/plugins/${PLUGIN_ID}/settings`;
}

function cleanToken(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().replace(/^Bearer\s+/i, '');
}

function cleanPath(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }
  const p = value.trim().replace(/^\/+|\/+$/g, '');
  return /^[A-Za-z0-9._~/-]+$/.test(p) ? p : fallback;
}

/**
 * Turn what an operator types into a full Zabbix API endpoint.
 *
 * Accepted forms:
 *   zabbix.example                 -> http://zabbix.example/api_jsonrpc.php
 *   zabbix.example:8080/zabbix     -> http://zabbix.example:8080/zabbix/api_jsonrpc.php
 *   https://zabbix.example         -> https://zabbix.example/api_jsonrpc.php
 *   http://host/api_jsonrpc.php    -> unchanged
 *   /api_jsonrpc.php               -> unchanged (same-origin / nginx setup)
 */
export function normalizeApiUrl(value: unknown, fallback: string = DEFAULT_ZABBIX_CONFIG.apiUrl): string {
  if (typeof value !== 'string') {
    return fallback;
  }
  let v = value.trim();
  if (!v) {
    return fallback;
  }
  if (v.startsWith('/')) {
    v = v.replace(/\/+$/, '');
    return /\/api_jsonrpc\.php$/i.test(v) ? v : `${v}/api_jsonrpc.php`;
  }
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) {
    v = `http://${v}`;
  }
  let parsed: URL;
  try {
    parsed = new URL(v);
  } catch {
    return fallback;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return fallback;
  }
  let path = parsed.pathname.replace(/\/+$/, '');
  if (!/\/api_jsonrpc\.php$/i.test(path)) {
    path = `${path}/api_jsonrpc.php`;
  }
  return `${parsed.origin}${path.replace(/\/{2,}/g, '/')}`;
}

export function normalizeConfig(raw: unknown): ZabbixConfig {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const parsed = parseInt(String(r.refreshSeconds ?? ''), 10);
  const refreshSeconds = Number.isFinite(parsed)
    ? Math.min(3600, Math.max(15, parsed))
    : DEFAULT_ZABBIX_CONFIG.refreshSeconds;
  return {
    transport: r.transport === 'direct' ? 'direct' : 'proxy',
    apiUrl: normalizeApiUrl(r.apiUrl, DEFAULT_ZABBIX_CONFIG.apiUrl),
    authMethod: r.authMethod === 'credentials' ? 'credentials' : 'token',
    token: cleanToken(r.token),
    username: typeof r.username === 'string' ? r.username.trim() : '',
    // Do not trim passwords: leading/trailing spaces can be significant.
    password: typeof r.password === 'string' ? r.password : '',
    proxyPath: cleanPath(r.proxyPath, DEFAULT_ZABBIX_CONFIG.proxyPath),
    publicPath: cleanPath(r.publicPath, DEFAULT_ZABBIX_CONFIG.publicPath),
    refreshSeconds,
    // Enabled unless the stored setting is explicitly false.
    sampleDataEnabled: r.sampleDataEnabled !== false && r.sampleDataEnabled !== 'false',
    defaultSource: r.defaultSource === 'live' ? 'live' : 'sample',
  };
}

export function toJsonData(config: ZabbixConfig): Record<string, unknown> {
  const direct = config.transport === 'direct';
  const useCredentials = direct && config.authMethod === 'credentials';
  return {
    transport: config.transport,
    apiUrl: normalizeApiUrl(config.apiUrl),
    authMethod: config.authMethod,
    // Only persist the secret that the selected transport/method actually uses.
    token: direct && !useCredentials ? cleanToken(config.token) : '',
    username: useCredentials ? config.username.trim() : '',
    password: useCredentials ? config.password : '',
    proxyPath: config.proxyPath,
    publicPath: config.publicPath,
    refreshSeconds: config.refreshSeconds,
    sampleDataEnabled: config.sampleDataEnabled,
    // Live-only mode cannot open on the sample dataset.
    defaultSource: config.sampleDataEnabled ? config.defaultSource : 'live',
  };
}

let cache: { config: ZabbixConfig; at: number } | null = null;
const CACHE_TTL_MS = 10_000;

export function invalidateConfigCache(): void {
  cache = null;
}

/**
 * Read the plugin settings from the Grafana API. Viewers have `plugins.app:access`
 * for this app, so the same configuration is delivered to every signed-in user.
 */
export async function loadZabbixConfig(force = false): Promise<ZabbixConfig> {
  if (!isGrafanaHosted()) {
    return { ...DEFAULT_ZABBIX_CONFIG };
  }
  if (!force && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.config;
  }
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller
      ? (setTimeout(() => controller.abort(), 10000) as unknown as number)
      : 0;
    let res: Response;
    try {
      res = await fetch(settingsUrl(), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal: controller ? controller.signal : undefined,
      });
    } finally {
      if (timer) {
        clearTimeout(timer);
      }
    }
    if (!res.ok) {
      return { ...DEFAULT_ZABBIX_CONFIG };
    }
    const body = (await res.json()) as { jsonData?: unknown };
    const config = normalizeConfig(body.jsonData);
    cache = { config, at: Date.now() };
    return config;
  } catch {
    return { ...DEFAULT_ZABBIX_CONFIG };
  }
}

export async function saveZabbixConfig(config: ZabbixConfig): Promise<void> {
  const res = await fetch(settingsUrl(), {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ enabled: true, pinned: true, jsonData: toJsonData(config) }),
  });
  if (!res.ok) {
    let message = `Grafana returned HTTP ${res.status}`;
    try {
      const body = (await res.json()) as { message?: string };
      if (body && body.message) {
        message = body.message;
      }
    } catch {
      // keep the HTTP status message
    }
    throw new Error(message);
  }
  invalidateConfigCache();
  cache = { config: { ...config }, at: Date.now() };
}

export function zabbixEndpoint(config: ZabbixConfig, route: 'api' | 'public'): string {
  if (config.transport === 'direct') {
    return normalizeApiUrl(config.apiUrl);
  }
  const location = route === 'api' ? config.proxyPath : config.publicPath;
  return `${appSubUrl()}/${location}/`;
}

interface RpcError {
  code: number;
  message: string;
  data?: string;
}

interface RpcResponse<T> {
  result?: T;
  error?: RpcError;
}

/** Raised when Zabbix rejects the credentials/session; credentials mode retries once. */
class ZabbixAuthError extends Error {}

const SESSION_TTL_MS = 15 * 60_000;
let sessionCache: { key: string; token: string; at: number } | null = null;
let loginInFlight: { key: string; promise: Promise<string> } | null = null;

function sessionKey(config: ZabbixConfig): string {
  return `${zabbixEndpoint(config, 'api')}|${config.username.trim()}`;
}

function clearSession(): void {
  sessionCache = null;
}

function isAuthMessage(message: string): boolean {
  return /not authorized|session terminated|re-?login|please log ?in|permission denied/i.test(message);
}

function authHint(config: ZabbixConfig): string {
  if (config.transport !== 'direct') {
    return 'Grafana session expired — reload the page and sign in again.';
  }
  return config.authMethod === 'credentials'
    ? 'Zabbix rejected the session. Check the username and password in the plugin configuration.'
    : 'Zabbix rejected the API token. Check the token in the plugin configuration.';
}

/** Authenticate with user.login and cache the session token in memory only. */
function loginWithCredentials(config: ZabbixConfig, force = false): Promise<string> {
  if (!config.username.trim() || !config.password) {
    return Promise.reject(
      new Error(
        'No Zabbix username/password configured. Open Administration → Plugins → Infrastructure Command Center → Zabbix connection and add them.'
      )
    );
  }
  const key = sessionKey(config);
  if (force) {
    clearSession();
  }
  if (sessionCache && sessionCache.key === key && Date.now() - sessionCache.at < SESSION_TTL_MS) {
    return Promise.resolve(sessionCache.token);
  }
  if (loginInFlight && loginInFlight.key === key) {
    return loginInFlight.promise;
  }
  const promise = postRpc<string>(
    config,
    'user.login',
    { username: config.username.trim(), password: config.password },
    'public',
    undefined
  ).then((result) => {
    const token = typeof result === 'string' ? result : '';
    if (!token) {
      throw new Error('Zabbix returned an empty session token for user.login.');
    }
    sessionCache = { key, token, at: Date.now() };
    return token;
  });
  loginInFlight = { key, promise };
  const clear = () => {
    if (loginInFlight && loginInFlight.promise === promise) {
      loginInFlight = null;
    }
  };
  promise.then(clear, clear);
  return promise;
}

async function directAuthToken(config: ZabbixConfig, force = false): Promise<string> {
  if (config.authMethod === 'credentials') {
    return loginWithCredentials(config, force);
  }
  if (!config.token) {
    throw new Error(
      'No Zabbix API token configured. Open Administration → Plugins → Infrastructure Command Center → Zabbix connection and add a token, or switch to username/password.'
    );
  }
  return config.token;
}

async function postRpc<T>(
  config: ZabbixConfig,
  method: string,
  params: unknown,
  route: 'api' | 'public',
  token: string | undefined
): Promise<T> {
  const url = zabbixEndpoint(config, route);
  const headers: Record<string, string> = { 'Content-Type': 'application/json-rpc' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller
    ? (setTimeout(() => controller.abort(), 20000) as unknown as number)
    : 0;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      signal: controller ? controller.signal : undefined,
    });
  } catch (err) {
    const reason = (err as Error)?.name === 'AbortError' ? 'timed out after 20s' : 'unreachable';
    if (config.transport === 'direct') {
      const origin = typeof location !== 'undefined' ? location.origin : 'this Grafana origin';
      throw new Error(
        `Zabbix API ${reason} at ${url}. The Zabbix server must be reachable from ${origin}; for a remote Zabbix enable CORS for this Grafana origin (or use a same-origin reverse proxy).`
      );
    }
    throw new Error(`Grafana proxy ${reason} at ${url}. Check nginx and the Zabbix API.`);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }

  if (res.status === 401) {
    throw new ZabbixAuthError(authHint(config));
  }
  if (!res.ok) {
    throw new Error(`Zabbix API returned HTTP ${res.status} from ${url}`);
  }

  let body: RpcResponse<T>;
  try {
    body = (await res.json()) as RpcResponse<T>;
  } catch {
    throw new Error(`Unexpected non-JSON response from ${url}`);
  }
  if (body.error) {
    const detail = `${body.error.message}${body.error.data ? ` — ${body.error.data}` : ''}`.trim();
    if (isAuthMessage(body.error.message)) {
      throw new ZabbixAuthError(`${detail}. ${authHint(config)}`.trim());
    }
    if (method === 'user.login') {
      throw new Error(`${detail}. Check the Zabbix username and password.`);
    }
    throw new Error(detail);
  }
  return body.result as T;
}

export async function zabbixRpc<T>(
  config: ZabbixConfig,
  method: string,
  params: unknown,
  route: 'api' | 'public' = 'api'
): Promise<T> {
  const directApi = config.transport === 'direct' && route === 'api';
  const token = directApi ? await directAuthToken(config) : undefined;
  try {
    return await postRpc<T>(config, method, params, route, token);
  } catch (err) {
    const retry =
      directApi &&
      config.authMethod === 'credentials' &&
      method !== 'user.login' &&
      err instanceof ZabbixAuthError;
    if (!retry) {
      throw err;
    }
    // The cached session token expired or was revoked: log in again and retry once.
    const fresh = await directAuthToken(config, true);
    return postRpc<T>(config, method, params, route, fresh);
  }
}

export interface ZabbixTestResult {
  version: string;
  hostCount: number;
  endpoint: string;
  account: string;
}

/** Used by the configuration page's "Test connection" button. */
export async function testZabbixConnection(config: ZabbixConfig): Promise<ZabbixTestResult> {
  const version = await zabbixRpc<string>(config, 'apiinfo.version', {}, 'public');
  const count = await zabbixRpc<string | number>(
    config,
    'host.get',
    { countOutput: true, monitored: true },
    'api'
  );
  return {
    version: version || 'unknown',
    hostCount: parseInt(String(count), 10) || 0,
    endpoint: zabbixEndpoint(config, 'api'),
    account:
      config.transport !== 'direct'
        ? 'Grafana proxy'
        : config.authMethod === 'credentials'
        ? `user ${config.username}`
        : 'API token',
  };
}
