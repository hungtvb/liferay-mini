import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

const API_BASE = '/o/nexcent-training/v1.0';
const HEADLESS_BASE = '/o/headless-delivery/v1.0';
const MAX_PACKAGE_BYTES = 25 * 1024 * 1024;
const PACKAGE_FOLDER_BY_PROFILE = {
    NXC_ARTICLE_V1: 'NXC-FOLDER-ARTICLE-IMPORT-PACKAGES',
};
const RETRYABLE_STATUSES = new Set([
    'COMPLETED_WITH_ERRORS',
    'FAILED',
    'INVALID',
]);

async function requestJson(url, options = {}) {
    const {headers = {}, ...requestOptions} = options;
    const response = await fetch(url, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-csrf-token': Liferay.authToken,
            ...headers,
        },
        ...requestOptions,
    });

    if (!response.ok) {
        const raw = await response.text();
        let message = raw || response.statusText;

        try {
            const payload = JSON.parse(raw);

            message =
                payload.detail ||
                payload.message ||
                payload.title ||
                message;
        }
        catch (error) {
            // The endpoint may return a plain-text PortalException.
        }

        throw new Error(message);
    }

    return response.status === 204 ? null : response.json();
}

const api = (path, options) => requestJson(`${API_BASE}${path}`, options);
const headlessApi = (path, options) =>
    requestJson(`${HEADLESS_BASE}${path}`, options);

function StatusBadge({status}) {
    const tone = ['COMPLETED'].includes(status)
        ? 'success'
        : ['FAILED', 'INVALID', 'COMPLETED_WITH_ERRORS'].includes(status)
            ? 'danger'
            : ['RUNNING', 'VALIDATING'].includes(status)
                ? 'info'
                : 'neutral';

    return (
        <span className={`nxc-content-import__status nxc-content-import__status--${tone}`}>
            {status || 'UNKNOWN'}
        </span>
    );
}

function Summary({job}) {
    if (!job) {
        return null;
    }

    return (
        <dl className="nxc-content-import__summary">
            <div><dt>Total</dt><dd>{job.totalRows || 0}</dd></div>
            <div><dt>Created</dt><dd>{job.createdRows || 0}</dd></div>
            <div><dt>Updated</dt><dd>{job.updatedRows || 0}</dd></div>
            <div><dt>Skipped</dt><dd>{job.skippedRows || 0}</dd></div>
            <div><dt>Failed</dt><dd>{job.failedRows || 0}</dd></div>
        </dl>
    );
}

function ContentImportApp({siteId}) {
    const [profiles, setProfiles] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(null);
    const [notice, setNotice] = useState(null);
    const [busyAction, setBusyAction] = useState('');
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        const data = await api(
            `/sites/${siteId}/content-import-jobs?page=1&pageSize=50`
        );

        setJobs(data.items || []);
    };

    useEffect(() => {
        let active = true;

        setLoading(true);
        Promise.all([
            api(`/sites/${siteId}/content-import-profiles`),
            api(`/sites/${siteId}/content-import-jobs?page=1&pageSize=50`),
        ])
            .then(([profileData, jobData]) => {
                if (!active) {
                    return;
                }

                const values = profileData.items || [];

                setProfiles(values);
                setJobs(jobData.items || []);
                setSelectedProfile(
                    values.find((item) => item.enabled)?.key || ''
                );
            })
            .catch((error) => {
                if (active) {
                    setNotice({message: error.message, tone: 'danger'});
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [siteId]);

    const showJob = async (job) => {
        setSelectedJob(job);
        setItems([]);

        try {
            const values = [];
            let page = 1;

            while (true) {
                const data = await api(
                    `/sites/${siteId}/content-import-jobs/` +
                        `${job.externalReferenceCode}/items?page=${page}&pageSize=200`
                );
                const batch = data.items || [];
                const totalCount = Number(data.totalCount);

                values.push(...batch);

                if (
                    !batch.length ||
                    (Number.isFinite(totalCount) &&
                        values.length >= totalCount) ||
                    batch.length < 200
                ) {
                    break;
                }

                page += 1;
            }

            setItems(values);
        }
        catch (error) {
            setNotice({message: error.message, tone: 'danger'});
        }
    };

    const validateFile = () => {
        if (!file || !selectedProfile) {
            throw new Error('Select an enabled content type and ZIP package.');
        }

        if (!file.name.toLowerCase().endsWith('.zip')) {
            throw new Error('The package must be a .zip file.');
        }

        if (!file.size || file.size > MAX_PACKAGE_BYTES) {
            throw new Error('The ZIP package must be between 1 byte and 25 MiB.');
        }
    };

    const resolvePackageFolder = async () => {
        const folderERC = PACKAGE_FOLDER_BY_PROFILE[selectedProfile];

        if (!folderERC) {
            throw new Error(
                `No package folder is configured for ${selectedProfile}.`
            );
        }

        const data = await headlessApi(
            `/sites/${siteId}/document-folders?page=1&pageSize=200`
        );
        const folder = (data.items || []).find(
            (item) => item.externalReferenceCode === folderERC
        );

        if (!folder) {
            throw new Error(
                `Documents and Media folder not found: ${folderERC}.`
            );
        }

        return folder;
    };

    const uploadPackage = async () => {
        setBusyAction('upload');
        setNotice({message: 'Uploading and validating package…', tone: 'info'});

        try {
            validateFile();
            const folder = await resolvePackageFolder();
            const packageERC = `NXC-IMPORT-PACKAGE-${Date.now()}`;
            const form = new FormData();

            form.append('file', file);
            form.append(
                'document',
                JSON.stringify({
                    externalReferenceCode: packageERC,
                    title: file.name,
                })
            );

            const documentResponse = await fetch(
                `${HEADLESS_BASE}/document-folders/${folder.id}/documents`,
                {
                    body: form,
                    credentials: 'same-origin',
                    headers: {'x-csrf-token': Liferay.authToken},
                    method: 'POST',
                }
            );

            if (!documentResponse.ok) {
                throw new Error(
                    (await documentResponse.text()) ||
                        'The package could not be uploaded.'
                );
            }

            const document = await documentResponse.json();
            const jobERC = `NXC-CONTENT-IMPORT-${Date.now()}`;

            await api(`/sites/${siteId}/content-import-jobs`, {
                body: JSON.stringify({
                    externalReferenceCode: jobERC,
                    importProfileKey: selectedProfile,
                    packageFileEntryId: document.id,
                }),
                method: 'POST',
            });

            const job = await api(
                `/sites/${siteId}/content-import-jobs/${jobERC}/validate`,
                {body: '{}', method: 'POST'}
            );

            await loadJobs();
            await showJob(job);
            setNotice({
                message:
                    job.status === 'VALIDATED'
                        ? 'Package validated. Review the result before execution.'
                        : `Validation finished with status ${job.status}.`,
                tone: job.status === 'VALIDATED' ? 'success' : 'danger',
            });
        }
        catch (error) {
            setNotice({message: error.message, tone: 'danger'});
        }
        finally {
            setBusyAction('');
        }
    };

    const action = async (name) => {
        if (!selectedJob) {
            return;
        }

        setBusyAction(name);
        setNotice({
            message: `${name === 'execute' ? 'Import' : 'Retry'} in progress…`,
            tone: 'info',
        });

        try {
            const job = await api(
                `/sites/${siteId}/content-import-jobs/` +
                    `${selectedJob.externalReferenceCode}/${name}`,
                {body: '{}', method: 'POST'}
            );

            await loadJobs();
            await showJob(job);
            setNotice({
                message: `${name === 'execute' ? 'Import' : 'Retry'} finished with status ${job.status}.`,
                tone: job.status === 'COMPLETED' ? 'success' : 'danger',
            });
        }
        catch (error) {
            setNotice({message: error.message, tone: 'danger'});
        }
        finally {
            setBusyAction('');
        }
    };

    const selectedProfileData = profiles.find(
        (profile) => profile.key === selectedProfile
    );
    const isBusy = Boolean(busyAction);

    return (
        <main className="nxc-content-import">
            <header className="nxc-content-import__page-header">
                <div>
                    <p className="nxc-content-import__eyebrow">Site administration</p>
                    <h1>Nexcent Content Import</h1>
                    <p>Validate a versioned package before writing content to this site.</p>
                </div>
            </header>

            {notice ? (
                <div
                    aria-live="polite"
                    className={`nxc-content-import__notice nxc-content-import__notice--${notice.tone}`}
                    role={notice.tone === 'danger' ? 'alert' : 'status'}
                >
                    {notice.message}
                </div>
            ) : null}

            <section
                aria-labelledby="nxc-import-upload-heading"
                className="nxc-content-import__panel"
            >
                <div className="nxc-content-import__section-heading">
                    <span>1</span>
                    <div>
                        <h2 id="nxc-import-upload-heading">Upload and validate</h2>
                        <p>Only enabled profiles can be executed.</p>
                    </div>
                </div>

                <div className="nxc-content-import__form">
                    <label htmlFor="nxc-import-profile">
                        <span>Content type</span>
                        <select
                            className="form-control"
                            disabled={isBusy || loading}
                            id="nxc-import-profile"
                            onChange={(event) => {
                                setSelectedProfile(event.target.value);
                                setFile(null);
                            }}
                            value={selectedProfile}
                        >
                            {!selectedProfile ? (
                                <option value="">No enabled profile</option>
                            ) : null}
                            {profiles.map((profile) => (
                                <option
                                    disabled={!profile.enabled}
                                    key={profile.key}
                                    value={profile.key}
                                >
                                    {profile.name}
                                    {!profile.enabled
                                        ? ` — ${profile.disabledReasonCode}`
                                        : ''}
                                </option>
                            ))}
                        </select>
                        {selectedProfileData ? (
                            <small>
                                Schema {selectedProfileData.schemaVersion} ·{' '}
                                {selectedProfileData.targetType}
                            </small>
                        ) : null}
                    </label>

                    <label htmlFor="nxc-import-package">
                        <span>ZIP package</span>
                        <input
                            accept=".zip,application/zip"
                            className="form-control"
                            disabled={isBusy}
                            id="nxc-import-package"
                            key={selectedProfile}
                            onChange={(event) =>
                                setFile(event.target.files[0] || null)
                            }
                            type="file"
                        />
                        <small>Maximum 25 MiB. Includes manifest, workbook and images.</small>
                    </label>
                </div>

                <div className="nxc-content-import__actions">
                    <button
                        className="btn btn-primary"
                        disabled={isBusy || loading || !selectedProfile}
                        onClick={uploadPackage}
                        type="button"
                    >
                        {busyAction === 'upload'
                            ? 'Uploading and validating…'
                            : 'Upload and validate'}
                    </button>
                </div>
            </section>

            <section
                aria-labelledby="nxc-import-history-heading"
                className="nxc-content-import__panel"
            >
                <div className="nxc-content-import__section-heading">
                    <span>2</span>
                    <div>
                        <h2 id="nxc-import-history-heading">Job history</h2>
                        <p>Select a job to inspect its validation results.</p>
                    </div>
                </div>

                {loading ? (
                    <p aria-busy="true" className="nxc-content-import__empty">
                        Loading import jobs…
                    </p>
                ) : jobs.length ? (
                    <div className="nxc-content-import__table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th scope="col">Job</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Rows</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((job) => (
                                    <tr
                                        className={
                                            selectedJob?.id === job.id
                                                ? 'is-selected'
                                                : ''
                                        }
                                        key={job.id}
                                    >
                                        <td data-label="Job">
                                            <button
                                                className="nxc-content-import__job-link"
                                                onClick={() => showJob(job)}
                                                type="button"
                                            >
                                                {job.externalReferenceCode}
                                            </button>
                                        </td>
                                        <td data-label="Profile">{job.importProfileKey}</td>
                                        <td data-label="Status"><StatusBadge status={job.status} /></td>
                                        <td data-label="Rows">{job.totalRows || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="nxc-content-import__empty">
                        No import jobs have been created for this site.
                    </p>
                )}
            </section>

            {selectedJob ? (
                <section
                    aria-labelledby="nxc-import-detail-heading"
                    className="nxc-content-import__panel"
                >
                    <div className="nxc-content-import__detail-header">
                        <div className="nxc-content-import__section-heading">
                            <span>3</span>
                            <div>
                                <h2 id="nxc-import-detail-heading">Review and execute</h2>
                                <p>{selectedJob.externalReferenceCode}</p>
                            </div>
                        </div>
                        <StatusBadge status={selectedJob.status} />
                    </div>

                    <Summary job={selectedJob} />

                    <div className="nxc-content-import__actions">
                        <button
                            className="btn btn-primary"
                            disabled={
                                isBusy || selectedJob.status !== 'VALIDATED'
                            }
                            onClick={() => action('execute')}
                            type="button"
                        >
                            {busyAction === 'execute' ? 'Executing…' : 'Execute import'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            disabled={
                                isBusy ||
                                !RETRYABLE_STATUSES.has(selectedJob.status)
                            }
                            onClick={() => action('retry')}
                            type="button"
                        >
                            {busyAction === 'retry' ? 'Retrying…' : 'Retry'}
                        </button>
                        {selectedJob.failedRows > 0 ? (
                            <a
                                className="btn btn-link"
                                href={
                                    `${API_BASE}/sites/${siteId}/content-import-jobs/` +
                                    `${selectedJob.externalReferenceCode}/error-report`
                                }
                            >
                                Download error report
                            </a>
                        ) : null}
                    </div>

                    {items.length ? (
                        <div className="nxc-content-import__table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Sheet / row</th>
                                        <th scope="col">Target</th>
                                        <th scope="col">Result</th>
                                        <th scope="col">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id}>
                                            <td data-label="Sheet / row">
                                                {item.sheetName} / {item.rowNumber}
                                            </td>
                                            <td data-label="Target">
                                                <strong>{item.targetType}</strong>
                                                <br />
                                                {item.targetExternalReferenceCode}
                                            </td>
                                            <td data-label="Result">
                                                <StatusBadge status={item.result} />
                                            </td>
                                            <td data-label="Message">
                                                {item.messageCode ? (
                                                    <code>{item.messageCode}</code>
                                                ) : null}{' '}
                                                {item.message}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="nxc-content-import__empty">
                            This job has no persisted row results.
                        </p>
                    )}
                </section>
            ) : null}
        </main>
    );
}

export default function main({rootId, siteId}) {
    const rootElement = document.getElementById(rootId);

    if (!rootElement) {
        throw new Error(`Content Import root not found: ${rootId}`);
    }

    createRoot(rootElement).render(<ContentImportApp siteId={siteId} />);
}
