import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

const api = (path, options = {}) =>
    fetch(`/o/nexcent-training/v1.0${path}`, {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-csrf-token': Liferay.authToken,
            ...(options.headers || {}),
        },
        ...options,
    }).then(async (response) => {
        if (!response.ok) {
            throw new Error((await response.text()) || response.statusText);
        }

        return response.status === 204 ? null : response.json();
    });

function ContentImportApp({siteId}) {
    const [profiles, setProfiles] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [items, setItems] = useState([]);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);

    const loadJobs = () =>
        api(`/sites/${siteId}/content-import-jobs?page=1&pageSize=50`).then(
            (data) => setJobs(data.items || [])
        );

    useEffect(() => {
        api(`/sites/${siteId}/content-import-profiles`).then((data) => {
            const values = data.items || [];

            setProfiles(values);
            setSelectedProfile(values.find((item) => item.enabled)?.key || '');
        });
        loadJobs();
    }, [siteId]);

    const uploadPackage = async () => {
        if (!file || !selectedProfile) {
            setMessage('Select an enabled profile and ZIP package.');
            return;
        }

        setBusy(true);
        setMessage('Uploading package…');

        try {
            const folder = await api(
                `/sites/${siteId}/documents-folder/by-external-reference-code/` +
                    'NXC-FOLDER-ARTICLE-IMPORT-PACKAGES'
            );
            const packageERC = `NXC-IMPORT-PACKAGE-${Date.now()}`;
            const form = new FormData();

            form.append('file', file);
            form.append(
                'document',
                JSON.stringify({externalReferenceCode: packageERC, title: file.name})
            );

            const documentResponse = await fetch(
                `/o/headless-delivery/v1.0/document-folders/${folder.id}/documents`,
                {
                    body: form,
                    credentials: 'same-origin',
                    headers: {'x-csrf-token': Liferay.authToken},
                    method: 'POST',
                }
            );

            if (!documentResponse.ok) {
                throw new Error(await documentResponse.text());
            }

            const document = await documentResponse.json();
            const jobERC = `NXC-CONTENT-IMPORT-${Date.now()}`;
            let job = await api(`/sites/${siteId}/content-import-jobs`, {
                body: JSON.stringify({
                    externalReferenceCode: jobERC,
                    importProfileKey: selectedProfile,
                    packageFileEntryId: document.id,
                }),
                method: 'POST',
            });

            job = await api(
                `/sites/${siteId}/content-import-jobs/${jobERC}/validate`,
                {body: '{}', method: 'POST'}
            );
            setMessage(`Validation finished with status ${job.status}.`);
            await loadJobs();
            await showJob(job);
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy(false);
        }
    };

    const showJob = async (job) => {
        setSelectedJob(job);
        const data = await api(
            `/sites/${siteId}/content-import-jobs/` +
                `${job.externalReferenceCode}/items?page=1&pageSize=200`
        );

        setItems(data.items || []);
    };

    const action = async (name) => {
        setBusy(true);

        try {
            const job = await api(
                `/sites/${siteId}/content-import-jobs/` +
                    `${selectedJob.externalReferenceCode}/${name}`,
                {body: '{}', method: 'POST'}
            );

            await loadJobs();
            await showJob(job);
            setMessage(`${name} finished with status ${job.status}.`);
        }
        catch (error) {
            setMessage(error.message);
        }
        finally {
            setBusy(false);
        }
    };

    return (
        <main className="nxc-content-import">
            <div className="nxc-content-import__header">
                <div>
                    <h1>Nexcent Content Import</h1>
                    <p>Profile-driven ZIP import for the current site.</p>
                </div>
            </div>

            <section className="nxc-content-import__panel">
                <h2>Upload and validate</h2>
                <div className="nxc-content-import__form">
                    <label>
                        Content type
                        <select
                            onChange={(event) => setSelectedProfile(event.target.value)}
                            value={selectedProfile}
                        >
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
                    </label>
                    <label>
                        ZIP package
                        <input
                            accept=".zip,application/zip"
                            onChange={(event) => setFile(event.target.files[0])}
                            type="file"
                        />
                    </label>
                </div>
                <div className="nxc-content-import__actions">
                    <button
                        className="btn btn-primary"
                        disabled={busy}
                        onClick={uploadPackage}
                        type="button"
                    >
                        Upload and validate
                    </button>
                    <span aria-live="polite">{message}</span>
                </div>
            </section>

            <section className="nxc-content-import__panel">
                <h2>Job history</h2>
                <div className="nxc-content-import__table-wrap">
                    <table>
                        <thead><tr><th>Job</th><th>Profile</th><th>Status</th><th>Rows</th></tr></thead>
                        <tbody>
                            {jobs.map((job) => (
                                <tr key={job.id}>
                                    <td><button className="btn btn-link" onClick={() => showJob(job)}>{job.externalReferenceCode}</button></td>
                                    <td>{job.importProfileKey}</td><td>{job.status}</td><td>{job.totalRows}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {selectedJob && (
                <section className="nxc-content-import__panel">
                    <div className="nxc-content-import__header">
                        <h2>Job detail: {selectedJob.externalReferenceCode}</h2>
                        <div className="nxc-content-import__actions">
                            <button className="btn btn-primary" disabled={busy || selectedJob.status !== 'VALIDATED'} onClick={() => action('execute')}>Execute</button>
                            <button className="btn btn-secondary" disabled={busy} onClick={() => action('retry')}>Retry</button>
                        </div>
                    </div>
                    <div className="nxc-content-import__table-wrap">
                        <table><thead><tr><th>Sheet/row</th><th>Target</th><th>Result</th><th>Message</th></tr></thead>
                            <tbody>{items.map((item) => <tr key={item.id}><td>{item.sheetName}/{item.rowNumber}</td><td>{item.targetType}: {item.targetExternalReferenceCode}</td><td>{item.result}</td><td>{item.messageCode} {item.message}</td></tr>)}</tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>
    );
}

export default function main({rootId, siteId}) {
    ReactDOM.render(<ContentImportApp siteId={siteId} />, document.getElementById(rootId));
}
