import {afterEach, describe, expect, it, vi} from 'vitest';

import {
    clearHeadlessContentRequestCache,
    loadStructuredContents,
    readContentBoolean,
    readContentImage,
    readContentNumber,
    readContentText,
} from './headlessContentClient';

afterEach(() => {
    clearHeadlessContentRequestCache();
    vi.restoreAllMocks();
});

describe('Headless content client', () => {
    it('resolves a structure identifier and shares cached requests', async () => {
        const fetchMock = vi.fn().mockImplementation(async (input: string) => {
            if (input.includes('/content-structures?pageSize=200')) {
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
                            externalReferenceCode: 'SERVICE-B',
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
                            externalReferenceCode: 'SERVICE-A',
                        },
                    ],
                }),
                ok: true,
                status: 200,
                statusText: 'OK',
            };
        });

        vi.stubGlobal('fetch', fetchMock);

        const options = {
            locale: 'en-US',
            siteId: '20123',
            structureIdentifier: 'NXC-SERVICE',
        };
        const [first, second] = await Promise.all([
            loadStructuredContents(options),
            loadStructuredContents(options),
        ]);

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(first).toBe(second);
        expect(readContentText(first[0], ['title'])).toBe('Service A');
    });

    it('reads nested text, booleans, numbers, and image values', () => {
        const content = {
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
        };

        expect(readContentText(content, ['title'])).toBe('Nested title');
        expect(readContentBoolean(content, ['active'], true)).toBe(false);
        expect(readContentNumber(content, ['sortOrder'])).toBe(42);
        expect(
            readContentImage(content, ['image'], {
                alt: 'Fallback',
                url: '/fallback.png',
            })
        ).toEqual({
            alt: 'Image description',
            url: '/documents/d/nexcent/image',
        });
    });
});
