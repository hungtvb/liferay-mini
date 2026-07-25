import type {ChangeEvent} from 'react';
import {Check} from 'lucide-react';
import {Button} from '../components/Button';
import type {
  AsyncStatus,
  ConnectionPayload,
  FolderSummary,
  ImporterConfig,
  Selection,
  StructureAnalysis,
  ViewableBy
} from '../types';

interface ConfigureStepProps {
  config: ImporterConfig;
  connection: ConnectionPayload;
  analysis: StructureAnalysis | null;
  analysisStatus: AsyncStatus;
  imageFolders: FolderSummary[];
  imageFoldersStatus: AsyncStatus;
  selection: Selection;
  onSelectionChange: (patch: Partial<Selection>) => void;
  onBack: () => void;
  onNext: () => void;
}

function optionLabel(item: FolderSummary) {
  return item.path || item.name;
}

export function ConfigureStep({
  config,
  connection,
  analysis,
  analysisStatus,
  imageFolders,
  imageFoldersStatus,
  selection,
  onSelectionChange,
  onBack,
  onNext
}: ConfigureStepProps) {
  const ready = Boolean(
    selection.structureId &&
    selection.folderId &&
    analysis?.status !== 'UNSUPPORTED' &&
    analysisStatus === 'success' &&
    imageFoldersStatus === 'success'
  );

  return (
    <section className="screen-content" aria-labelledby="configure-heading">
      <header className="page-header compact-heading">
        <h1 id="configure-heading" tabIndex={-1}>Configure import</h1>
      </header>

      <section className="site-context" aria-label="Current Site context">
        <div>
          <span>Current Site Context</span>
          <strong>{connection.site?.name || 'Configured Current Site'}</strong>
        </div>
        <div className="site-context-meta">
          <span className="badge">Site ID: {config.siteId}</span>
          <small>Destination restricted to this site.</small>
        </div>
      </section>

      <section className="form-card">
        <div className="form-group">
          <label htmlFor="structureSelect">Content Structure <b>*</b></label>
          <select
            id="structureSelect"
            value={selection.structureId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectionChange({structureId: event.target.value})}
          >
            <option value="">Select a structure...</option>
            {connection.structures.map((structure) => (
              <option key={structure.id} value={String(structure.id)} disabled={structure.status === 'UNSUPPORTED'}>
                {structure.name}{structure.status === 'UNSUPPORTED' ? ' · Unsupported' : ''}
              </option>
            ))}
          </select>
          {analysisStatus === 'loading' && <p className="field-status">Analyzing Structure…</p>}
          {analysisStatus === 'error' && <p className="field-status field-status-error">Structure analysis failed.</p>}
          {analysisStatus === 'success' && analysis && (
            <p className={`field-status ${analysis.status === 'UNSUPPORTED' ? 'field-status-error' : 'field-status-success'}`}>
              <Check size={13} /> {analysis.status} · {analysis.supportedFields.length} importable fields
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="targetFolderSelect">Target Web Content folder <b>*</b></label>
          <select
            id="targetFolderSelect"
            value={selection.folderId}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectionChange({folderId: event.target.value})}
          >
            <option value="">Select destination folder...</option>
            {connection.folders.map((folder) => (
              <option key={folder.id} value={String(folder.id)}>{optionLabel(folder)}</option>
            ))}
          </select>
        </div>

        <fieldset className="form-group">
          <legend>Content visibility <b>*</b></legend>
          <div className="radio-list">
            {config.viewableByOptions.map((value: ViewableBy) => (
              <label className="radio-row" key={value}>
                <input
                  type="radio"
                  name="visibility"
                  value={value}
                  checked={selection.viewableBy === value}
                  onChange={() => onSelectionChange({viewableBy: value})}
                />
                <span><strong>{value === 'Anyone' ? 'Anyone (Guest Role)' : value === 'Members' ? 'Site Members' : 'Owner only'}</strong></span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-divider" />

        <div className="form-group no-margin">
          <label htmlFor="imageFolderSelect">Documents and Media folder (Optional)</label>
          <select
            id="imageFolderSelect"
            value={selection.imageFolderId}
            disabled={imageFoldersStatus === 'loading'}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectionChange({imageFolderId: event.target.value})}
          >
            <option value="">Site root — include nested folders</option>
            {imageFolders.map((folder) => (
              <option key={folder.id} value={String(folder.id)}>{optionLabel(folder)}</option>
            ))}
          </select>
          <p className="helper-text">
            Image references in the workbook must use exact file names or external reference codes.<br />
            Examples: <code>file:article-cover.webp</code> or <code>erc:NXC_ARTICLE_COVER</code>
          </p>
        </div>
      </section>

      <div className="page-actions">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button onClick={onNext} disabled={!ready}>Continue to workbook</Button>
      </div>
    </section>
  );
}
