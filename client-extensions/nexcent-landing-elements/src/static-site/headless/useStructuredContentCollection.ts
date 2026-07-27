import {useEffect, useState} from 'react';

import {readLocale, readStringSetting} from '../runtime/fragmentSettings';
import {
    type HeadlessStructuredContent,
    loadStructuredContents,
} from './headlessContentClient';

export type HeadlessContentStatus =
    | 'empty'
    | 'error'
    | 'loading'
    | 'preview'
    | 'ready';

type HeadlessCollectionState<T> = {
    error?: Error;
    items: T[];
    status: HeadlessContentStatus;
};

type UseStructuredContentCollectionOptions<T> = {
    host?: HTMLElement;
    mapContent: (content: HeadlessStructuredContent, index: number) => T;
    maxItems: number;
    previewItems?: T[];
    structureIdentifier: string;
};

function applyHostState(
    host: HTMLElement | undefined,
    status: HeadlessContentStatus,
    error?: Error
) {
    if (!host) {
        return;
    }

    host.dataset.contentState = status;

    if (error) {
        host.dataset.contentError = error.message;
    }
    else {
        delete host.dataset.contentError;
    }
}

export function useStructuredContentCollection<T>({
    host,
    mapContent,
    maxItems,
    previewItems = [],
    structureIdentifier,
}: UseStructuredContentCollectionOptions<T>): HeadlessCollectionState<T> {
    const [state, setState] = useState<HeadlessCollectionState<T>>(() => ({
        items: host ? [] : previewItems.slice(0, maxItems),
        status: host ? 'loading' : 'preview',
    }));

    useEffect(() => {
        if (!host) {
            setState({
                items: previewItems.slice(0, maxItems),
                status: previewItems.length ? 'preview' : 'empty',
            });
            return;
        }

        const siteId = readStringSetting(host, 'site-id');
        const locale = readLocale(host);

        if (!siteId || !structureIdentifier) {
            const error = new Error(
                !siteId
                    ? 'Missing site-id for Headless Delivery request.'
                    : 'Missing content structure identifier.'
            );

            applyHostState(host, 'error', error);
            setState({error, items: [], status: 'error'});
            return;
        }

        let active = true;

        applyHostState(host, 'loading');
        setState({items: [], status: 'loading'});

        loadStructuredContents({
            locale,
            pageSize: maxItems,
            siteId,
            structureIdentifier,
        })
            .then((contents) => {
                if (!active) {
                    return;
                }

                const items = contents.map((content, index) =>
                    mapContent(content, index)
                );

                if (items.length === 0) {
                    applyHostState(host, 'empty');
                    setState({items: [], status: 'empty'});
                    return;
                }

                applyHostState(host, 'ready');
                setState({items, status: 'ready'});
            })
            .catch((cause: unknown) => {
                if (!active) {
                    return;
                }

                const error =
                    cause instanceof Error
                        ? cause
                        : new Error('Unable to load Headless Delivery content.');

                applyHostState(host, 'error', error);
                setState({error, items: [], status: 'error'});
            });

        return () => {
            active = false;
        };
    }, [host, mapContent, maxItems, previewItems, structureIdentifier]);

    return state;
}
