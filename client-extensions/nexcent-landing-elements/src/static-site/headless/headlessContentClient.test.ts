import {afterEach, describe, expect, it, vi} from 'vitest';

import {
    clearHeadlessContentRequestCache,
    type HeadlessStructuredContent,
    loadStructuredContents,
    readContentBoolean,
    readContentImage,
    readContentNumber,
    readContentText,
} from './headlessContentClient';

afterEach(() => {
    clearHeadlessContentRequestCache();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('Headless content client', () => {
    it('loads flattened content once and sorts optional Structure order on the client', async () => {
        const fetchMock = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
            const url = String(input);

            if (url.includes('/content-structures?pageSize=200')) {
                return {
                    json: async () => ({
                        items: [
                            {
                                externalReferenceCode: 'NXC-SERVICE',
                                id: 456,
                                name: 'Nexcent Service',
                            },
                        ],
                    }),
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                };
            }

            return {
                json: async () => ({
                    items: [
                        {
                            contentFields: [
                                {
                                    contentFieldValue: {data: 'Service B'},
                                    name: 'title',
                                },
                                {
                                    contentFieldValue: {data: 20},
                                    name: 'sortOrder',
                                },
                            ],
                            contentStructureId: 456,
                            externalReferenceCode: 'SERVICE-B',
                            id: 2,
                            title: 'Service B',
                        },
                        {
                            contentFields: [
                                {
                                    contentFieldValue: {data: 'Service A'},
                                    name: 'title',
                                },
                                {
                                    contentFieldValue: {data: 10},
                                    name: 'sortOrder',
                                },
                            ],
                            contentStructureId: 456,
                            externalReferenceCode: 'SERVICE-A',
                            id: 1,
                            title: 'Service A',
                        },
                    ],
                }),
                ok: true,
                status: 200,
                statusText: 'OK',
            };
        });

        vi.stubGlobal('window', {
            Liferay: undefined,
            location: {origin: 'http://localhost:8080'},
        });
        vi.stubGlobal('fetch', fetchMock);

        const options = {
            locale: 'en-US',
            pageSize: 1,
            siteId: '20123',
            structureIdentifier: 'NXC-SERVICE',
        };
        const [first, second] = await Promise.all([
            loadStructuredContents(options),
            loadStructuredContents(options),
        ]);

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(first).toEqual(second);
        expect(first).toHaveLength(1);
        expect(readContentText(first[0], ['title'])).toBe('Service A');

        const structuredContentRequest = String(fetchMock.mock.calls[1]?.[0]);

        expect(structuredContentRequest).toContain('pageSize=100');
        expect(structuredContentRequest).toContain('flatten=true');
        expect(structuredContentRequest).not.toContain('sort=');
        expect(structuredContentRequest).not.toContain('contentFields%2FsortOrder');
    });

    it('uses Article system URLs and orders Articles by publish date without sortOrder', async () => {
        const fetchMock = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
            const url = String(input);

            if (url.includes('/content-structures?pageSize=200')) {
                return {
                    json: async () => ({
                        items: [
                            {
                                externalReferenceCode: 'NXC_ARTICLE',
                                id: 789,
                                name: 'NXC Article',
                            },
                        ],
                    }),
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                };
            }

            return {
                json: async () => ({
                    items: [
                        {
                            contentFields: [],
                            contentStructureId: 789,
                            contentUrl: '/web/nexcent-public-website/w/older',
                            datePublished: '2026-07-20T00:00:00Z',
                            externalReferenceCode: 'ARTICLE-OLDER',
                            id: 1,
                            title: 'Older',
                        },
                        {
                            contentFields: [
                                {
                                    contentFieldValue: {
                                        image: {
                                            contentUrl: '/documents/d/nexcent/cover',
                                            description: 'Article cover description',
                                        },
                                    },
                                    name: 'coverImage',
                                },
                            ],
                            contentStructureId: 789,
                            contentUrl: '/web/nexcent-public-website/w/newer',
                            datePublished: '2026-07-24T00:00:00Z',
                            externalReferenceCode: 'ARTICLE-NEWER',
                            id: 2,
                            title: 'Newer',
                        },
                    ],
                }),
                ok: true,
                status: 200,
                statusText: 'OK',
            };
        });

        vi.stubGlobal('window', {
            Liferay: undefined,
            location: {origin: 'http://localhost:8080'},
        });
        vi.stubGlobal('fetch', fetchMock);

        const articles = await loadStructuredContents({
            locale: 'en-US',
            pageSize: 3,
            siteId: '20123',
            structureIdentifier: 'NXC_ARTICLE',
        });

        expect(articles.map((item) => item.title)).toEqual(['Newer', 'Older']);
        expect(readContentText(articles[0], ['targetUrl'], '')).toBe(
            '/web/nexcent-public-website/w/newer'
        );
        expect(
            readContentImage(articles[0], ['thumbnail'], {
                alt: 'Fallback',
                url: '/fallback.png',
            })
        ).toEqual({
            alt: 'Article cover description',
            url: '/documents/d/nexcent/cover',
        });
    });

    it('reads nested text, booleans, numbers, and image values', () => {
        const structuredContent: HeadlessStructuredContent = {
            contentFields: [
                {
                    name: 'group',
                    nestedContentFields: [
                        {
                            contentFieldValue: {data: 'Nested title'},
                            name: 'title',
                        },
                        {
                            contentFieldValue: {data: 'false'},
                            name: 'active',
                        },
                        {
                            contentFieldValue: {data: '42'},
                            name: 'sortOrder',
                        },
                        {
                            contentFieldValue: {
                                image: {
                                    contentUrl: '/documents/d/nexcent/image',
                                    description: 'Image description',
                                },
                            },
                            name: 'image',
                        },
                    ],
                },
            ],
            contentStructureId: 456,
            externalReferenceCode: 'TEST-CONTENT',
            id: 1,
            title: 'Test content',
        };

        expect(readContentText(structuredContent, ['title'])).toBe('Nested title');
        expect(readContentBoolean(structuredContent, ['active'], true)).toBe(false);
        expect(readContentNumber(structuredContent, ['sortOrder'])).toBe(42);
        expect(
            readContentImage(structuredContent, ['image'], {
                alt: 'Fallback',
                url: '/fallback.png',
            })
        ).toEqual({
            alt: 'Image description',
            url: '/documents/d/nexcent/image',
        });
    });
});
