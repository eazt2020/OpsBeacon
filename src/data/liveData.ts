import { fetchZabbixData, LiveResult } from './zabbixData';

/**
 * Live data is deliberately per-dashboard.
 *
 * Every open dashboard/tab runs its own refresh timer and makes its own Zabbix
 * request. Nothing is cached or locked in browser storage, so one tab can never
 * reuse, delay or suppress another tab's refresh — opening the Command Center
 * and Data Center Ops in two tabs gives each one an independent refresh cycle.
 */

// Keys used by earlier releases that coordinated refreshes across tabs. They
// are removed so no stale snapshot or lock is left behind in the browser.
const LEGACY_KEYS = ['opsbeacon-live-snapshot-v1', 'opsbeacon-live-fetch-lock-v1'];

function clearLegacyCache(): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    for (const key of LEGACY_KEYS) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    /* localStorage may be unavailable; nothing else depends on it. */
  }
}

clearLegacyCache();

export async function fetchLiveData(): Promise<LiveResult> {
  return fetchZabbixData();
}
