import React, { useEffect, useMemo, useState } from 'react';
import type { AppPluginMeta, PluginConfigPageProps } from '@grafana/data';
import {
  appSubUrl,
  DEFAULT_ZABBIX_CONFIG,
  loadZabbixConfig,
  MotionPreference,
  normalizeConfig,
  saveZabbixConfig,
  testZabbixConnection,
  ZabbixConfig,
  zabbixEndpoint,
} from './data/config';

type Status = { tone: 'ok' | 'error' | 'info'; text: string } | null;

/** Logos are embedded in plugin settings, so keep the upload small. */
const MAX_LOGO_BYTES = 256 * 1024;
const LOGO_TYPES = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml';

const CFG_CSS = `
.cc-cfg {
  max-width: 820px;
  color: var(--text-color, #d8d9da);
  font-size: 14px;
  line-height: 1.45;
}
.cc-cfg h2 {
  font-size: 20px;
  font-weight: 500;
  margin: 4px 0 6px;
  color: var(--text-color, #d8d9da);
}
.cc-cfg-intro {
  margin: 0 0 18px;
  color: var(--text-color-secondary, #9da5b3);
}
.cc-cfg fieldset {
  border: 1px solid var(--border-weak, #34363e);
  border-radius: 4px;
  margin: 0 0 16px;
  padding: 12px 16px 14px;
}
.cc-cfg legend {
  padding: 0 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-color-secondary, #9da5b3);
}
.cc-cfg label {
  display: block;
  margin: 10px 0 4px;
  font-weight: 500;
}
.cc-cfg label.inline {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  margin: 8px 0;
}
.cc-cfg input[type="text"],
.cc-cfg input[type="password"],
.cc-cfg input[type="number"],
.cc-cfg select {
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
  padding: 6px 9px;
  border: 1px solid var(--border-medium, #4a4d57);
  border-radius: 2px;
  background: var(--input-background, #111217);
  color: var(--text-color, #d8d9da);
  font-size: 14px;
}
/* Grafana's global stylesheet contains a select, input[type="file"] rule with
   height: 4px and line-height: 4 (used for its file-input trick). It wins over
   the natural height here, collapsing every select on this page to a sliver
   with the option text clipped. Restore a normal control height and line box. */
.cc-cfg select {
  height: 36px;
  padding: 0 9px;
  line-height: normal;
}
.cc-cfg select option {
  background: var(--input-background, #111217);
  color: var(--text-color, #d8d9da);
}
.cc-cfg input[type="number"] {
  max-width: 140px;
}
.cc-cfg input:focus,
.cc-cfg select:focus {
  outline: 2px solid var(--primary, #3d71d9);
  outline-offset: -1px;
}
.cc-cfg .help {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--text-color-secondary, #9da5b3);
}
.cc-cfg code {
  background: var(--code-background, #1b1d23);
  padding: 1px 5px;
  border-radius: 2px;
  font-size: 12px;
}
.cc-cfg-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 6px 0 4px;
}
.cc-cfg-logo-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 56px;
  padding: 7px;
  border: 1px dashed var(--border-weak, #34363e);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.02);
}
.cc-cfg-logo-preview img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.cc-cfg-logo-preview span { color: var(--text-color-secondary, #9da5b3); font-size: 11px; }
.cc-cfg-logo-actions { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
.cc-cfg-file {
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin: 0 !important;
  padding: 6px 12px;
  border: 1px solid var(--border-weak, #34363e);
  border-radius: 4px;
  background: var(--button-background, #2e3035);
  color: var(--text-color, #d8d9da);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.cc-cfg-file:hover { border-color: var(--border-medium, #5a5d67); }
.cc-cfg-file input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.cc-cfg-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}
.cc-cfg button {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  background: var(--primary, #3d71d9);
  color: #fff;
}
.cc-cfg button.secondary {
  background: transparent;
  border-color: var(--border-medium, #4a4d57);
  color: var(--text-color, #d8d9da);
}
.cc-cfg button:disabled {
  opacity: 0.55;
  cursor: default;
}
.cc-cfg .status {
  margin-top: 14px;
  padding: 9px 12px;
  border-radius: 3px;
  border-left: 3px solid;
  font-size: 13px;
}
.cc-cfg .status.ok { border-color: #00b36b; background: rgba(0, 179, 107, 0.1); }
.cc-cfg .status.error { border-color: #e0226e; background: rgba(224, 34, 110, 0.1); }
.cc-cfg .status.info { border-color: #3d71d9; background: rgba(61, 113, 217, 0.1); }
.cc-cfg .warn {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 3px;
  background: rgba(255, 176, 32, 0.1);
  border-left: 3px solid #ffb020;
  font-size: 12px;
  color: var(--text-color-secondary, #d8d9da);
}
.cc-cfg .endpoint {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-color-secondary, #9da5b3);
  word-break: break-all;
}
`;

export function ZabbixConfigPage({ plugin }: PluginConfigPageProps<AppPluginMeta>) {
  const [config, setConfig] = useState<ZabbixConfig>(() =>
    normalizeConfig((plugin && (plugin.meta as any)?.jsonData) || DEFAULT_ZABBIX_CONFIG)
  );
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadZabbixConfig(true)
      .then((loaded) => {
        if (!cancelled) {
          setConfig(loaded);
        }
      })
      .catch(() => {
        // defaults are already displayed
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const patch = (partial: Partial<ZabbixConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
    setStatus(null);
  };

  const onLogoFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files && input.files[0];
    input.value = '';
    if (!file) {
      return;
    }
    if (!/^image\/(png|jpe?g|gif|webp|svg\+xml)$/i.test(file.type)) {
      setStatus({ tone: 'error', text: 'Unsupported logo format. Use PNG, SVG, JPEG, WebP or GIF.' });
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setStatus({
        tone: 'error',
        text: `Logo is ${Math.round(file.size / 1024)} KB; the limit is 256 KB.`,
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => patch({ logoUrl: String(reader.result || '') });
    reader.onerror = () => setStatus({ tone: 'error', text: 'Could not read the selected file.' });
    reader.readAsDataURL(file);
  };

  const endpoint = useMemo(() => zabbixEndpoint(config, 'api'), [config]);
  // A plaintext http:// endpoint sends the bearer token (or login password) over
  // the network in the clear. Same-origin relative paths are proxied by Grafana
  // and localhost is exempt so a co-located development Zabbix is not flagged.
  const insecureHttpEndpoint =
    config.transport === 'direct' &&
    /^http:\/\//i.test(endpoint) &&
    !/^http:\/\/(?:localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:\/|$)/i.test(endpoint);
  const proxyBase = appSubUrl() || '';

  const onSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const saved = await saveZabbixConfig(config);
      setConfig(saved);
      const adjusted = saved.refreshSeconds !== config.refreshSeconds;
      setStatus({
        tone: 'ok',
        text: adjusted
          ? `Settings saved. The refresh interval was adjusted to ${saved.refreshSeconds} s (allowed range 15–3600 s). The Command Center and Server Inventory apply them on their next load.`
          : 'Connection settings saved. The Command Center and Server Inventory apply them on their next load; reload an open page to switch to a new refresh interval.',
      });
    } catch (err) {
      setStatus({ tone: 'error', text: `Could not save settings: ${(err as Error).message}` });
    } finally {
      setSaving(false);
    }
  };

  const onTest = async () => {
    setTesting(true);
    setStatus({ tone: 'info', text: 'Contacting Zabbix…' });
    try {
      const result = await testZabbixConnection(config);
      setStatus({
        tone: 'ok',
        text: `Connected to Zabbix ${result.version} — ${result.hostCount} monitored host${
          result.hostCount === 1 ? '' : 's'
        } at ${result.endpoint} as ${result.account}.`,
      });
    } catch (err) {
      setStatus({ tone: 'error', text: `Connection test failed: ${(err as Error).message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="cc-cfg">
      <style>{CFG_CSS}</style>
      <h2>Zabbix connection</h2>
      <p className="cc-cfg-intro">
        These settings are stored in Grafana plugin settings for this organisation and are used by the
        Command Center dashboard to load live data. The sample dataset is unaffected.
      </p>

      <fieldset>
        <legend>Transport</legend>
        <label className="inline">
          <input
            type="radio"
            name="cc-transport"
            checked={config.transport === 'proxy'}
            onChange={() => patch({ transport: 'proxy' })}
          />
          Grafana server proxy <span className="help">(recommended — token stays on the server)</span>
        </label>
        <p className="help">
          Requests go to <code>{proxyBase}/{config.proxyPath}/</code>. nginx validates the Grafana
          session, adds the Zabbix API token and forwards to the Zabbix upstream configured on this
          Grafana server. The upstream is fixed in <code>/etc/nginx/conf.d/zabbix.conf</code>, so use
          this transport when Zabbix is reachable from this server (typically localhost).
        </p>
        <label className="inline">
          <input
            type="radio"
            name="cc-transport"
            checked={config.transport === 'direct'}
            onChange={() => patch({ transport: 'direct' })}
          />
          Direct API call from the browser <span className="help">(remote Zabbix)</span>
        </label>
        <p className="help">
          The browser calls the configured Zabbix address itself, so the same plugin install can run on
          any Grafana server and connect to a remote Zabbix. The Zabbix API must allow CORS from this
          Grafana origin.
        </p>
      </fieldset>

      {config.transport === 'direct' ? (
        <fieldset>
          <legend>Zabbix server</legend>
          <label htmlFor="cc-api-url">Zabbix address (IP, hostname or URL)</label>
          <input
            id="cc-api-url"
            type="text"
            value={config.apiUrl}
            placeholder="zabbix.example.com"
            onChange={(e) => patch({ apiUrl: e.target.value })}
          />
          <p className="help">
            Enter the Zabbix server IP or hostname; <code>/api_jsonrpc.php</code> is appended
            automatically (HTTP is assumed when no scheme is given). A full endpoint such as{' '}
            <code>https://zabbix.example/zabbix/api_jsonrpc.php</code> or a same-origin{' '}
            <code>/api_jsonrpc.php</code> is also accepted. Effective endpoint:{' '}
            <code>{endpoint}</code>
          </p>
          {insecureHttpEndpoint ? (
            <div className="warn">
              This endpoint uses plain <code>http://</code>, so the API token or login password
              travels across the network unencrypted and can be read by anyone who can observe the
              traffic. Use <code>https://</code> (for example through a reverse proxy with a
              certificate) or the server proxy transport.
            </div>
          ) : null}

          <label htmlFor="cc-auth-method">Authentication</label>
          <select
            id="cc-auth-method"
            value={config.authMethod}
            onChange={(e) =>
              patch({ authMethod: e.target.value === 'credentials' ? 'credentials' : 'token' })
            }
          >
            <option value="token">API token</option>
            <option value="credentials">Username and password</option>
          </select>

          {config.authMethod === 'credentials' ? (
            <>
              <label htmlFor="cc-username">Zabbix username</label>
              <input
                id="cc-username"
                type="text"
                autoComplete="username"
                value={config.username}
                placeholder="grafana-cc"
                onChange={(e) => patch({ username: e.target.value })}
              />
              <label htmlFor="cc-password">Zabbix password</label>
              <input
                id="cc-password"
                type="password"
                autoComplete="off"
                value={config.password}
                placeholder="Zabbix password"
                onChange={(e) => patch({ password: e.target.value })}
              />
              <p className="help">
                The plugin calls <code>user.login</code> with these credentials and keeps the returned
                session token in browser memory for 15 minutes; it logs in again automatically when the
                session expires. Use a dedicated read-only Zabbix user.
              </p>
              <div className="warn">
                The password is stored in the plugin settings (Grafana database, not encrypted) so
                that the browser can log in to Zabbix. Any signed-in user who can open this app can
                read it, including Viewers. Prefer an API token where possible, and only grant the
                read-only role.
              </div>
            </>
          ) : (
            <>
              <label htmlFor="cc-token">API token</label>
              <input
                id="cc-token"
                type="password"
                autoComplete="off"
                value={config.token}
                placeholder="Zabbix API token"
                onChange={(e) => patch({ token: e.target.value })}
              />
              <p className="help">
                Create a dedicated Zabbix user with a read-only role and generate a token for it. Write
                methods are unnecessary.
              </p>
              <div className="warn">
                The token is stored in the plugin settings (Grafana database, not encrypted) so that
                the browser can use it. Any signed-in user who can open this app can read it, including
                Viewers. Only use a read-only token. Prefer the server proxy transport when the token
                must stay server-side.
              </div>
            </>
          )}
        </fieldset>
      ) : (
        <fieldset>
          <legend>Proxy locations</legend>
          <label htmlFor="cc-proxy-path">Authenticated proxy path</label>
          <input
            id="cc-proxy-path"
            type="text"
            value={config.proxyPath}
            onChange={(e) => patch({ proxyPath: e.target.value })}
          />
          <p className="help">
            Relative to the Grafana sub-path. Effective endpoint:{' '}
            <code>{proxyBase}/{config.proxyPath}/</code>
          </p>

          <label htmlFor="cc-public-path">Unauthenticated version path</label>
          <input
            id="cc-public-path"
            type="text"
            value={config.publicPath}
            onChange={(e) => patch({ publicPath: e.target.value })}
          />
          <p className="help">
            Used for <code>apiinfo.version</code>, which Zabbix rejects when an Authorization header is
            present. Still guarded by the Grafana session check.
          </p>
        </fieldset>
      )}

      <fieldset>
        <legend>Branding</legend>
        <label htmlFor="cc-brand-name">Brand name</label>
        <input
          id="cc-brand-name"
          type="text"
          maxLength={40}
          value={config.brandName}
          onChange={(e) => patch({ brandName: e.target.value })}
        />
        <p className="help">Shown in the Command Center and Server Inventory header. Defaults to OPSBEACON.</p>

        <label htmlFor="cc-brand-tagline">Tagline</label>
        <input
          id="cc-brand-tagline"
          type="text"
          maxLength={80}
          value={config.brandTagline}
          onChange={(e) => patch({ brandTagline: e.target.value })}
        />
        <p className="help">Displayed after the brand name in the header eyebrow.</p>

        <label htmlFor="cc-logo-file">Logo</label>
        <div className="cc-cfg-logo">
          <div className="cc-cfg-logo-preview">
            {config.logoUrl ? <img src={config.logoUrl} alt="Brand logo preview" /> : <span>No logo</span>}
          </div>
          <div className="cc-cfg-logo-actions">
            <label className="cc-cfg-file" htmlFor="cc-logo-file">
              Upload logo…
              <input id="cc-logo-file" type="file" accept={LOGO_TYPES} onChange={onLogoFile} />
            </label>
            {config.logoUrl ? (
              <button type="button" className="secondary" onClick={() => patch({ logoUrl: '' })}>
                Remove logo
              </button>
            ) : null}
          </div>
        </div>
        <p className="help">
          PNG, SVG, JPEG, WebP or GIF up to 256 KB. The image replaces the default three-bar mark and is
          contained within a 40 px-high header slot.
        </p>

        <label htmlFor="cc-logo-url">Or logo URL</label>
        <input
          id="cc-logo-url"
          type="text"
          placeholder="https://example.com/logo.svg"
          value={config.logoUrl.startsWith('data:') ? '' : config.logoUrl}
          onChange={(e) => patch({ logoUrl: e.target.value })}
        />
        <p className="help">
          {config.logoUrl.startsWith('data:')
            ? 'Currently using an uploaded image embedded in plugin settings. Enter a URL to replace it.'
            : 'An absolute http(s) URL to an image. Leave blank to use the default mark.'}
        </p>

        <label htmlFor="cc-motion">Animations</label>
        <select
          id="cc-motion"
          value={config.motion}
          onChange={(e) => patch({ motion: e.target.value as MotionPreference })}
        >
          <option value="system">Follow the system setting (recommended)</option>
          <option value="full">Always animate</option>
          <option value="reduced">Always reduce motion</option>
        </select>
        <p className="help">
          Controls the aurora drift, LIVE PROBLEMS marquee, title shimmer, gauge and history
          animations. The system setting disables them when the browser reports{' '}
          <code>prefers-reduced-motion</code>, which is common on Windows RDP sessions and
          desktops with animation effects turned off. Choose <strong>Always animate</strong>{' '}
          for a wall display that must keep moving.
        </p>
      </fieldset>

      <fieldset>
        <legend>Dashboard behaviour</legend>
        <label className="inline" htmlFor="cc-sample-data">
          <input
            id="cc-sample-data"
            type="checkbox"
            checked={config.sampleDataEnabled}
            onChange={(e) =>
              patch(
                e.target.checked
                  ? { sampleDataEnabled: true }
                  : { sampleDataEnabled: false, defaultSource: 'live' }
              )
            }
          />
          Enable sample dataset
        </label>
        <p className="help">
          When enabled, users can switch between SAMPLE and LIVE in the dashboard header. When
          disabled, Grafana-hosted dashboards are live-only: the SAMPLE button is hidden, sample
          drill-down links fall back to live data, and the page always opens in live mode. The
          standalone preview has no Grafana settings and keeps sample data.
        </p>

        <label htmlFor="cc-refresh">Live refresh interval (seconds)</label>
        <input
          id="cc-refresh"
          type="number"
          min={15}
          max={3600}
          step={5}
          value={config.refreshSeconds}
          onChange={(e) => patch({ refreshSeconds: parseInt(e.target.value, 10) || DEFAULT_ZABBIX_CONFIG.refreshSeconds })}
        />
        <p className="help">Between 15 s and 1 hour. The header shows the last successful sync time.</p>

        <label htmlFor="cc-default-source">Data mode when the page opens</label>
        <select
          id="cc-default-source"
          value={config.sampleDataEnabled ? config.defaultSource : 'live'}
          disabled={!config.sampleDataEnabled}
          onChange={(e) => patch({ defaultSource: e.target.value === 'live' ? 'live' : 'sample' })}
        >
          <option value="sample">Sample dataset</option>
          <option value="live">Live Zabbix data</option>
        </select>
        <p className="help">
          {config.sampleDataEnabled
            ? 'Users can still switch between SAMPLE and LIVE in the dashboard header.'
            : 'Sample data is disabled, so the page always opens in live mode.'}
        </p>
      </fieldset>

      <div className="cc-cfg-actions">
        <button type="button" onClick={onSave} disabled={saving || testing}>
          {saving ? 'Saving…' : 'Save connection'}
        </button>
        <button type="button" className="secondary" onClick={onTest} disabled={saving || testing}>
          {testing ? 'Testing…' : 'Test connection'}
        </button>
      </div>

      <div className="endpoint">
        Effective API endpoint: <code>{endpoint}</code>
      </div>

      {status ? <div className={`status ${status.tone}`}>{status.text}</div> : null}
    </div>
  );
}
