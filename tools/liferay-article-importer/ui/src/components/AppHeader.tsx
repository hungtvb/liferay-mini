import type {ImporterConfig} from '../types';

interface AppHeaderProps {
  config: ImporterConfig | null;
  connected: boolean;
}

export function AppHeader({config, connected}: AppHeaderProps) {
  let host = config?.baseUrl || 'Liferay instance';

  try {
    host = config?.baseUrl ? new URL(config.baseUrl).host : host;
  }
  catch {
    // Keep the configured value when it is not a fully qualified URL.
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><i /></span>
          <span className="brand-name">Nexcent</span>
        </div>
        <span className="topbar-divider" aria-hidden="true" />
        <strong className="product-name">Web Content Importer</strong>
        <span className="tool-badge">Local migration tool</span>
      </div>

      <div className={`connection-context ${connected ? 'is-connected' : ''}`}>
        <span className="connection-dot" aria-hidden="true" />
        <span className="connection-label">{connected ? host : 'Not connected'}</span>
        {connected && <strong>Site: {config?.siteId}</strong>}
      </div>
    </header>
  );
}
