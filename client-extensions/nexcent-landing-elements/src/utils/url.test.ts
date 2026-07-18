import {describe, expect, it} from 'vitest';

import {safeLinkUrl} from './url';

describe('safeLinkUrl', () => {
    it('allows portal-relative, anchor, HTTP, and HTTPS links', () => {
        expect(safeLinkUrl('/community')).toBe('/community');
        expect(safeLinkUrl('#features')).toBe('#features');
        expect(safeLinkUrl('https://example.com/path')).toBe(
            'https://example.com/path'
        );
        expect(safeLinkUrl('http://localhost:8080')).toBe(
            'http://localhost:8080'
        );
    });

    it('rejects executable and unsupported URL schemes', () => {
        expect(safeLinkUrl('javascript:alert(1)')).toBe('');
        expect(safeLinkUrl('data:text/html,unsafe')).toBe('');
        expect(safeLinkUrl('ftp://example.com/file')).toBe('');
        expect(safeLinkUrl('relative-without-a-leading-slash')).toBe('');
    });
});
