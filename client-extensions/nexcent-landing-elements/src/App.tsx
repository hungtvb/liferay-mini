import {useEffect, useState} from 'react';

import {listContentStructures} from './api/structuredContent';
import {getPortalContext} from './liferay/global';

type ApiState =
    | {status: 'loading'}
    | {count: number; status: 'ready'}
    | {message: string; status: 'error'};

export function App() {
    const context = getPortalContext();
    const [apiState, setApiState] = useState<ApiState>({status: 'loading'});

    useEffect(() => {
        let active = true;

        if (context.scopeGroupId === 'unknown') {
            setApiState({
                message: 'Current site could not be resolved.',
                status: 'error',
            });

            return () => {
                active = false;
            };
        }

        listContentStructures(context.scopeGroupId)
            .then((structures) => {
                if (active) {
                    setApiState({count: structures.length, status: 'ready'});
                }
            })
            .catch((error: unknown) => {
                if (active) {
                    setApiState({
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Unknown API error.',
                        status: 'error',
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [context.scopeGroupId]);

    const apiStatus =
        apiState.status === 'loading'
            ? 'Checking…'
            : apiState.status === 'ready'
              ? `${apiState.count} structure(s)`
              : apiState.message;

    return (
        <section className="nxc-lab-status" aria-labelledby="nxc-lab-title">
            <div className="nxc-lab-status__badge">Client Extension ready</div>

            <h2 id="nxc-lab-title">Nexcent Landing Page Lab</h2>

            <p>
                React is mounted inside a Liferay Custom Element. The shared
                API client now checks the current site&apos;s Web Content
                Structures without a hard-coded site ID.
            </p>

            <dl className="nxc-lab-status__details">
                <div>
                    <dt>Host</dt>
                    <dd>{context.host}</dd>
                </div>
                <div>
                    <dt>Signed in</dt>
                    <dd>{context.signedIn ? 'Yes' : 'No'}</dd>
                </div>
                <div>
                    <dt>Language</dt>
                    <dd>{context.languageId}</dd>
                </div>
                <div>
                    <dt>Scope group</dt>
                    <dd>{context.scopeGroupId}</dd>
                </div>
                <div>
                    <dt>Headless API</dt>
                    <dd
                        className={
                            apiState.status === 'error'
                                ? 'nxc-lab-status__error'
                                : undefined
                        }
                    >
                        {apiStatus}
                    </dd>
                </div>
            </dl>
        </section>
    );
}
