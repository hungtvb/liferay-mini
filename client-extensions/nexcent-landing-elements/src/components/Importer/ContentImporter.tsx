import {useId, useMemo, useState} from 'react';

import {getPortalContext, getSiteId} from '../../liferay/global';
import {importMigrationWorkbook} from './migrationApi';
import {
    type ImportResult,
    type MigrationWorkbook,
    type ValidationIssue,
} from './types';
import {validateWorkbook} from './validation';
import {parseMigrationWorkbook} from './workbook';

import './importer.css';

type ImporterStatus =
    | 'idle'
    | 'validating'
    | 'ready'
    | 'importing'
    | 'done'
    | 'error';

export function ContentImporter() {
    const workbookInputId = useId();
    const assetsInputId = useId();
    const [workbookFile, setWorkbookFile] = useState<File>();
    const [assetFiles, setAssetFiles] = useState<File[]>([]);
    const [workbook, setWorkbook] = useState<MigrationWorkbook>();
    const [issues, setIssues] = useState<ValidationIssue[]>([]);
    const [results, setResults] = useState<ImportResult[]>([]);
    const [status, setStatus] = useState<ImporterStatus>('idle');
    const [statusMessage, setStatusMessage] = useState(
        'Select the Excel workbook and all referenced image assets.'
    );
    const portalContext = getPortalContext();
    const hasErrors = issues.some((issue) => issue.level === 'error');
    const counts = useMemo(
        () =>
            workbook
                ? [
                      ['Heroes', workbook.heroes.length],
                      ['Clients intro', workbook.clientsIntro.length],
                      ['Clients', workbook.clients.length],
                      ['Services intro', workbook.servicesIntro.length],
                      ['Services', workbook.services.length],
                      ['Features', workbook.features.length],
                      ['Statistics intro', workbook.statisticsIntro.length],
                      ['Statistics', workbook.statistics.length],
                      ['Testimonials', workbook.testimonials.length],
                      ['Community intro', workbook.communityIntro.length],
                      ['Community cards', workbook.communityCards.length],
                      ['CTA', workbook.cta.length],
                  ] as Array<[string, number]>
                : undefined,
        [workbook]
    );
    const totalCount = counts?.reduce((total, [, count]) => total + count, 0);
    const importSummary = useMemo(
        () => ({
            created: results.filter((result) => result.action === 'created').length,
            failed: results.filter((result) => result.action === 'failed').length,
            skipped: 0,
            updated: results.filter((result) => result.action === 'updated').length,
        }),
        [results]
    );

    const resetValidation = () => {
        setWorkbook(undefined);
        setIssues([]);
        setResults([]);
        setStatus('idle');
        setStatusMessage('Files changed. Validate the migration package again.');
    };

    const validate = async () => {
        if (!workbookFile) {
            setIssues([
                {
                    level: 'error',
                    message: 'Select an .xlsx workbook before validation.',
                },
            ]);
            setStatus('error');
            return;
        }

        setStatus('validating');
        setStatusMessage('Parsing and validating the Excel workbook...');
        setResults([]);

        try {
            const rawWorkbook = await parseMigrationWorkbook(workbookFile);
            const validation = validateWorkbook(rawWorkbook, assetFiles);

            setIssues(validation.issues);
            setWorkbook(validation.data);
            setStatus(validation.data ? 'ready' : 'error');
            setStatusMessage(
                validation.data
                    ? 'Validation passed. Review the counts before importing.'
                    : 'Validation failed. Correct every error and try again.'
            );
        }
        catch (error: unknown) {
            setWorkbook(undefined);
            setIssues([
                {
                    level: 'error',
                    message:
                        error instanceof Error
                            ? error.message
                            : 'The workbook could not be parsed.',
                },
            ]);
            setStatus('error');
            setStatusMessage('The workbook could not be parsed.');
        }
    };

    const runImport = async () => {
        if (!workbook || hasErrors) {
            return;
        }

        if (!portalContext.signedIn) {
            setIssues((current) => [
                ...current,
                {
                    level: 'error',
                    message: 'Sign in to Liferay before running the importer.',
                },
            ]);
            setStatus('error');
            return;
        }

        setStatus('importing');
        setStatusMessage('Starting migration...');
        setResults([]);

        try {
            const imported = await importMigrationWorkbook(
                getSiteId(),
                workbook,
                assetFiles,
                setStatusMessage
            );

            setResults(imported);
            const failureCount = imported.filter(
                (result) => result.action === 'failed'
            ).length;

            setStatus(failureCount ? 'error' : 'done');
            setStatusMessage(
                failureCount
                    ? `Migration completed with ${failureCount} failure(s). Download the report for details.`
                    : `Migration completed: ${imported.length} articles processed.`
            );
        }
        catch (error: unknown) {
            setStatus('error');
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : 'The migration failed unexpectedly.'
            );
        }
    };

    const downloadReport = () => {
        const report = {
            completedAt: new Date().toISOString(),
            results,
            siteId: getSiteId(),
            summary: importSummary,
            workbook: workbookFile?.name,
        };
        const url = URL.createObjectURL(
            new Blob([JSON.stringify(report, null, 2)], {
                type: 'application/json',
            })
        );
        const anchor = document.createElement('a');

        anchor.download = `nexcent-import-report-${Date.now()}.json`;
        anchor.href = url;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    return (
        <section className="nxc-importer" aria-labelledby="nxc-importer-title">
            <div className="nxc-importer__header">
                <span className="nxc-importer__eyebrow">Migration Lab</span>
                <h2 id="nxc-importer-title">Excel to Liferay Web Content</h2>
                <p>
                    Validate the workbook, upload missing assets, and create or
                    update Web Content using stable external reference codes.
                </p>
            </div>

            {!portalContext.signedIn && (
                <div className="nxc-importer__notice" role="alert">
                    Sign in to Liferay with permission to manage Web Content and
                    Documents and Media before importing.
                </div>
            )}

            <div className="nxc-importer__inputs">
                <div className="nxc-importer__field">
                    <label htmlFor={workbookInputId}>Excel workbook</label>
                    <input
                        accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        id={workbookInputId}
                        onChange={(event) => {
                            setWorkbookFile(event.target.files?.[0]);
                            resetValidation();
                        }}
                        type="file"
                    />
                    <small>
                        Required sheets: all 12 landing-page content groups.
                    </small>
                </div>

                <div className="nxc-importer__field">
                    <label htmlFor={assetsInputId}>Referenced image assets</label>
                    <input
                        accept="image/*,.svg"
                        id={assetsInputId}
                        multiple
                        onChange={(event) => {
                            setAssetFiles(Array.from(event.target.files ?? []));
                            resetValidation();
                        }}
                        type="file"
                    />
                    <small>
                        Select every file referenced by imageFile or iconFile.
                    </small>
                </div>
            </div>

            <div className="nxc-importer__actions">
                <button
                    className="nxc-button nxc-button--primary"
                    disabled={!workbookFile || status === 'validating' || status === 'importing'}
                    onClick={() => void validate()}
                    type="button"
                >
                    {status === 'validating' ? 'Validating…' : 'Validate package'}
                </button>

                <button
                    className="nxc-button nxc-importer__secondary-button"
                    disabled={
                        !workbook ||
                        hasErrors ||
                        !portalContext.signedIn ||
                        status === 'importing'
                    }
                    onClick={() => void runImport()}
                    type="button"
                >
                    {status === 'importing' ? 'Importing…' : 'Import Web Content'}
                </button>
            </div>

            <div
                aria-live="polite"
                className={`nxc-importer__status nxc-importer__status--${status}`}
            >
                {statusMessage}
            </div>

            {counts && (
                <dl className="nxc-importer__counts">
                    {counts.map(([label, count]) => (
                        <div key={label}><dt>{label}</dt><dd>{count}</dd></div>
                    ))}
                    <div className="nxc-importer__count-total">
                        <dt>Total</dt><dd>{totalCount}</dd>
                    </div>
                </dl>
            )}

            {issues.length > 0 && (
                <div className="nxc-importer__issues">
                    <h3>Validation report</h3>
                    <ul>
                        {issues.map((issue, index) => (
                            <li
                                className={`nxc-importer__issue nxc-importer__issue--${issue.level}`}
                                key={`${issue.sheet}-${issue.row}-${index}`}
                            >
                                <strong>{issue.level.toUpperCase()}</strong>{' '}
                                {issue.sheet && `${issue.sheet}`}
                                {issue.row && ` row ${issue.row}`}
                                {(issue.sheet || issue.row) && ': '}
                                {issue.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {results.length > 0 && (
                <div className="nxc-importer__results">
                    <div className="nxc-importer__report-header">
                        <div>
                            <h3>Import report</h3>
                            <p>
                                Created {importSummary.created} · Updated{' '}
                                {importSummary.updated} · Skipped{' '}
                                {importSummary.skipped} · Failed{' '}
                                {importSummary.failed}
                            </p>
                        </div>
                        <button
                            className="nxc-button nxc-importer__secondary-button"
                            onClick={downloadReport}
                            type="button"
                        >
                            Download report
                        </button>
                    </div>
                    <div className="nxc-importer__table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>External reference code</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((result) => (
                                    <tr key={result.externalReferenceCode}>
                                        <td>{result.action}</td>
                                        <td>{result.type}</td>
                                        <td>{result.title}</td>
                                        <td><code>{result.externalReferenceCode}</code></td>
                                        <td>{result.message ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
