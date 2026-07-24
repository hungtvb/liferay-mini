import {describe, expect, it} from 'vitest';

import {resolveArticleDetailURL} from './ArticleSection';

describe('Article detail URL', () => {
    it('builds the default Web Content display-page URL inside a Site', () => {
        expect(
            resolveArticleDetailURL(
                'http://localhost:8080/web/nexcent-public-website',
                'test-nexcent-article'
            )
        ).toBe(
            'http://localhost:8080/web/nexcent-public-website/w/test-nexcent-article'
        );
    });

    it('supports virtual-host Site URLs and normalized slashes', () => {
        expect(
            resolveArticleDetailURL(
                'https://nexcent.example.com/',
                '/news/test-nexcent-article/'
            )
        ).toBe('https://nexcent.example.com/w/news/test-nexcent-article');
    });

    it('does not create a link without both Site URL and friendly path', () => {
        expect(resolveArticleDetailURL('', 'article')).toBe('');
        expect(resolveArticleDetailURL('/web/nexcent', '')).toBe('');
    });
});
