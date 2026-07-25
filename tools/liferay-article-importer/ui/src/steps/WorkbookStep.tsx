import {Download, FileSpreadsheet, Upload, X} from 'lucide-react';
import {useRef, useState, type ChangeEvent, type DragEvent, type MouseEvent} from 'react';
import {Button} from '../components/Button';
import type {AsyncStatus, Selection} from '../types';

interface WorkbookStepProps {
  selection: Selection;
  structureLabel: string;
  folderLabel: string;
  locale: string;
  file: File | null;
  downloadStatus: AsyncStatus;
  validationStatus: AsyncStatus;
  validationMessage?: string;
  onFileChange: (file: File | null) => void;
  onDownload: () => void;
  onValidate: () => void;
  onBack: () => void;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.ceil(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function WorkbookStep({
  selection,
  structureLabel,
  folderLabel,
  locale,
  file,
  downloadStatus,
  validationStatus,
  validationMessage,
  onFileChange,
  onDownload,
  onValidate,
  onBack
}: WorkbookStepProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  function acceptFile(nextFile?: File) {
    if (!nextFile) return;
    if (!nextFile.name.toLowerCase().endsWith('.xlsx')) return;
    onFileChange(nextFile);
  }

  return (
    <section className="screen-content" aria-labelledby="workbook-heading">
      <header className="page-header compact-heading">
        <h1 id="workbook-heading" tabIndex={-1}>Prepare workbook</h1>
      </header>

      <section className="workbook-card">
        <div className="workbook-section">
          <div className="workbook-heading-row">
            <div>
              <h2>Download template</h2>
              <p>The template is generated from the selected Structure and bound to the current import configuration.</p>
              <div className="summary-chips">
                <span className="badge">Structure: {structureLabel}</span>
                <span className="badge">Target: {folderLabel}</span>
                <span className="badge">Locale: {locale}</span>
                <span className="badge">Visibility: {selection.viewableBy}</span>
              </div>
            </div>
            <Button
              variant="secondary"
              icon={Download}
              loading={downloadStatus === 'loading'}
              onClick={onDownload}
            >
              {downloadStatus === 'loading' ? 'Generating...' : 'Download Excel template'}
            </Button>
          </div>
        </div>

        <div className="workbook-section workbook-upload-section">
          <h2>Upload completed workbook</h2>
          {!file ? (
            <label
              className={`upload-zone ${dragging ? 'is-dragging' : ''}`}
              onDragEnter={(event: DragEvent<HTMLLabelElement>) => {event.preventDefault(); setDragging(true);}}
              onDragOver={(event: DragEvent<HTMLLabelElement>) => event.preventDefault()}
              onDragLeave={(event: DragEvent<HTMLLabelElement>) => {event.preventDefault(); setDragging(false);}}
              onDrop={(event: DragEvent<HTMLLabelElement>) => {
                event.preventDefault();
                setDragging(false);
                acceptFile(event.dataTransfer.files[0]);
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                onChange={(event: ChangeEvent<HTMLInputElement>) => acceptFile(event.target.files?.[0])}
              />
              <span className="upload-icon"><FileSpreadsheet size={24} /></span>
              <strong>Drop an .xlsx file here</strong>
              <small>Maximum file size is controlled by the local server.</small>
              <Button variant="secondary" icon={Upload} onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                inputRef.current?.click();
              }}>Browse file</Button>
            </label>
          ) : (
            <div className="selected-file">
              <div className="selected-file-main">
                <span className="selected-file-icon"><FileSpreadsheet size={20} /></span>
                <span><strong>{file.name}</strong><small>{formatSize(file.size)}</small></span>
              </div>
              <button className="icon-button" type="button" aria-label="Remove workbook" onClick={() => onFileChange(null)}><X size={17} /></button>
            </div>
          )}
        </div>
      </section>

      <div className="page-actions">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <div className="action-cluster">
          {validationMessage && <span className={`inline-status ${validationStatus === 'error' ? 'is-error' : ''}`}>{validationMessage}</span>}
          <Button
            onClick={onValidate}
            loading={validationStatus === 'loading'}
            disabled={!file}
          >
            {validationStatus === 'loading' ? 'Validating...' : 'Validate workbook'}
          </Button>
        </div>
      </div>
    </section>
  );
}
