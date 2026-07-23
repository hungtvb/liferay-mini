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
    it('uses server pagination and Structure-field sorting with cached requests', async () => {
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

        expect(structuredContentRequest).toContain('pageSize=1');
        expect(structuredContentRequest).toContain(
            'sort=contentFields%2FsortOrder%3Aasc'
        );
        expect(structuredContentRequest).not.toContain('pageSize=100');
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
