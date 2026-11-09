import React from 'react';

interface BoundaryState {
  error: Error | null;
}

/**
 * Without a boundary, a single exception during a dashboard render makes React
 * unmount the whole plugin tree and Grafana shows an empty page — the "dashboard
 * went blank" failure. Keep the last rendered dashboard where possible and show a
 * readable, reloadable error card instead.
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  BoundaryState
> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Leave a trace for wall-display operators: the error no longer blanks the
    // page, but it should still be visible in the browser console.
    // eslint-disable-next-line no-console
    console.error('OpsBeacon dashboard render failed', error, info.componentStack);
  }

  render(): React.ReactNode {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#04080f',
          color: '#dbe7f5',
          fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            width: '100%',
            padding: '22px 24px',
            border: '1px solid #5b1c26',
            borderRadius: '14px',
            background: 'linear-gradient(180deg, rgba(40, 12, 18, 0.9), rgba(12, 8, 14, 0.95))',
            boxShadow: '0 18px 50px -30px rgba(255, 61, 87, 0.6)',
          }}
        >
          <div
            style={{
              color: '#ff4d67',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              marginBottom: '10px',
            }}
          >
            DASHBOARD RENDER ERROR
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' }}>
            The dashboard hit an unexpected error and stopped rendering. The Zabbix data
            connection is unaffected; reloading restores the dashboard.
          </div>
          <pre
            style={{
              margin: '0 0 16px',
              padding: '10px 12px',
              maxHeight: '180px',
              overflow: 'auto',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.35)',
              color: '#ffb3bf',
              fontSize: '11px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {error.message || String(error)}
          </pre>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                appearance: 'none',
                cursor: 'pointer',
                padding: '8px 14px',
                border: '1px solid rgba(255, 77, 103, 0.4)',
                borderRadius: '8px',
                background: 'rgba(255, 61, 87, 0.14)',
                color: '#ffd7dd',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'inherit',
              }}
            >
              Reload dashboard
            </button>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              style={{
                appearance: 'none',
                cursor: 'pointer',
                padding: '8px 14px',
                border: '1px solid rgba(96, 165, 250, 0.28)',
                borderRadius: '8px',
                background: 'rgba(47, 155, 255, 0.1)',
                color: '#cfe3ff',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'inherit',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}
