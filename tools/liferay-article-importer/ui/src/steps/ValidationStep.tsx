import {AlertTriangle, Check, Download, Info, Upload} from 'lucide-react';
import {useMemo, useState, type ChangeEvent} from 'react';
import {Button} from '../components/Button';
import type {AsyncStatus, ValidationIssue, ValidationResult, ValidationRow} from '../types';

interface ValidationStepProps {
  validation: ValidationResult;
  reportStatus: AsyncStatus;
  onBack: () => void;
  onContinue: () => void;
  onDownloadReport: () => void;
}

function issueRows(validation: ValidationResult) {
  const issues: ValidationIssue[] = [...validation.errors, ...validation.warnings];
  return issues.map((issue, index) => {
    const validationRow = validation.rowResultsPreview.find((item) => item.row === issue.row);
    return {
      id: `${issue.code}-${issue.row ?? 'global'}-${index}`,
      row: issue.row ?? '—',
      erc: validationRow?.externalReferenceCode || '—',
      title: validationRow?.title || '',
      friendlyUrlPath: validationRow?.friendlyUrlPath || '',
      code: issue.code,
      field: issue.field || 'workbook',
      message: issue.message,
      status: issue.severity === 'warning' ? 'WARNING' : 'BLOCKED'
    };
  });
}

function previewRows(validation: ValidationResult) {
  return validation.rowResultsPreview.map((row: ValidationRow) => ({
    id: `row-${row.row}`,
    row: row.row,
    erc: row.externalReferenceCode || '—',
    title: row.title || '',
    friendlyUrlPath: row.friendlyUrlPath || '',
    code: row.status,
    field: '—',
    message: row.status === 'VALID'
      ? `Friendly URL: ${row.friendlyUrlPath || 'not resolved'}`
      : 'Review row validation details.',
    status: row.status
  }));
}

export function ValidationStep({validation, reportStatus, onBack, onContinue, onDownloadReport}: ValidationStepProps) {
  const [payloadOpen, setPayloadOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'issues' | 'preview'>('issues');

  const rows = useMemo(() => {
    const source = filter === 'issues' ? issueRows(validation) : previewRows(validation);
    const normalized = query.trim().toLowerCase();
    if (!normalized) return source;
    return source.filter((row) => [row.erc, row.title, row.friendlyUrlPath, row.code, row.field, row.message].some((value) => String(value).toLowerCase().includes(normalized)));
  }, [filter, query, validation]);

  const issueCount = validation.errors.length + validation.warnings.length;
  const collisionCount = validation.ercCollisions?.length || 0;

  return (
    <section className="screen-content" aria-labelledby="validation-heading">
      <header className="page-header compact-heading">
        <h1 id="validation-heading" tabIndex={-1}>Review validation</h1>
      </header>

      <div className={`alert ${validation.canImport ? 'alert-success' : 'alert-error'}`} role="status">
        {validation.canImport ? <Check size={20} /> : <AlertTriangle size={20} />}
        <div>
          <strong>{validation.canImport ? 'Validation passed' : 'Validation blocked'}</strong>
          <p>{validation.canImport
            ? `${validation.stats.validRows} rows are ready for import.`
            : `${validation.stats.invalidRows} rows must be corrected before import can proceed. ${validation.stats.validRows} rows passed.`}</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric"><span>Total rows</span><strong>{validation.stats.totalRows}</strong></div>
        <div className="metric metric-success"><span>Valid</span><strong>{validation.stats.validRows}</strong></div>
        <div className={`metric ${validation.stats.invalidRows ? 'metric-error' : ''}`}><span>Blocked</span><strong>{validation.stats.invalidRows}</strong></div>
        <div className="metric"><span>Image refs</span><strong>{validation.imageSummary?.distinctReferenceCount || 0}</strong></div>
        <div className="metric"><span>ERC matches</span><strong>{collisionCount}</strong></div>
      </div>

      <section className="table-card">
        <div className="table-toolbar">
          <h2>{filter === 'issues' ? `Issues (${issueCount})` : 'Row preview'}</h2>
          <div className="table-filters">
            <input value={query} onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)} type="search" placeholder="Search ERC or friendly URL..." aria-label="Search validation rows" />
            <select value={filter} onChange={(event: ChangeEvent<HTMLSelectElement>) => setFilter(event.target.value as 'issues' | 'preview')} aria-label="Validation row filter">
              <option value="issues">Status: Issues</option>
              <option value="preview">All preview rows</option>
            </select>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead><tr><th>Row</th><th>ERC</th><th>Issue Details</th><th>Status</th></tr></thead>
            <tbody>
              {rows.length ? rows.map((row) => (
                <tr key={row.id}>
                  <td className="tabular">{row.row}</td>
                  <td><code>{row.erc}</code></td>
                  <td><strong>{row.code} {row.field !== '—' && <><span>·</span> {row.field}</>}</strong><small>{row.message}</small></td>
                  <td><span className={`row-badge ${row.status === 'VALID' ? 'is-valid' : row.status === 'WARNING' ? 'is-warning' : 'is-blocked'}`}>{row.status}</span></td>
                </tr>
              )) : <tr><td className="empty-cell" colSpan={4}>No rows match the current filter.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span>Showing {rows.length} preview rows</span><span>Export includes all workbook rows</span></div>
      </section>

      <section className="payload-disclosure">
        <button type="button" onClick={() => setPayloadOpen((open) => !open)} aria-expanded={payloadOpen}>
          <span><Info size={16} /> View generated payload preview</span><span>{payloadOpen ? '−' : '+'}</span>
        </button>
        {payloadOpen && <pre>{JSON.stringify(validation.payloadPreview, null, 2)}</pre>}
      </section>

      <div className="page-actions">
        <Button variant="ghost" icon={Upload} onClick={onBack}>Upload corrected workbook</Button>
        <div className="action-cluster">
          <Button variant="secondary" icon={Download} loading={reportStatus === 'loading'} onClick={onDownloadReport}>
            {reportStatus === 'loading' ? 'Exporting...' : 'Export validation report'}
          </Button>
          <Button onClick={onContinue} disabled={!validation.canImport}>Continue to import</Button>
        </div>
      </div>
    </section>
  );
}
