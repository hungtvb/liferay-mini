import {AlertCircle, Loader2, Server} from 'lucide-react';
import {Button} from '../components/Button';
import type {AsyncStatus, ImporterConfig} from '../types';

interface ConnectStepProps {
  config: ImporterConfig | null;
  status: AsyncStatus;
  error?: string | null;
  onConnect: () => void;
}

function environmentRows(config: ImporterConfig | null) {
  return [
    ['Liferay URL', config?.baseUrl || 'Loading…'],
    ['Site ID', config?.siteId ?? '—'],
    ['Default locale', config?.defaultLocale || '—'],
    ['Maximum rows', config ? `${config.maxImportRows.toLocaleString()} per batch` : '—'],
    ['Maximum upload size', config ? `${config.maxUploadMb} MB` : '—'],
    ['Local server address', config ? `http://${config.host}:${location.port || '4174'}` : '—']
  ];
}

export function ConnectStep({config, status, error, onConnect}: ConnectStepProps) {
  const connected = status === 'success';

  return (
    <section className="screen-content" aria-labelledby="connect-heading">
      <header className="page-header">
        <h1 id="connect-heading" tabIndex={-1}>Connect to Liferay</h1>
        <p>Authenticate with the configured OAuth2 client and load migration metadata from the Current Site.</p>
      </header>

      {status === 'error' && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={20} />
          <div><strong>Connection error</strong><p>{error || 'Could not connect to Liferay.'}</p></div>
        </div>
      )}

      <section className="panel">
        <div className="panel-heading">
          <Server size={18} aria-hidden="true" />
          <h2>Environment Configuration</h2>
        </div>
        <dl className="environment-list">
          {environmentRows(config).map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className="environment-value">{String(value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="page-actions page-actions-end">
        <Button
          onClick={onConnect}
          loading={status === 'loading'}
          disabled={!config || connected}
          icon={status === 'loading' ? Loader2 : undefined}
        >
          {status === 'loading' ? 'Connecting...' : connected ? 'Connected' : 'Connect to Liferay'}
        </Button>
      </div>
    </section>
  );
}
