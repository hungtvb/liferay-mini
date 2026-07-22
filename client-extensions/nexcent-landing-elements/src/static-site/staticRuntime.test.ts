import {describe, expect, it} from 'vitest';

import {staticElementNames} from './registerStaticElements';
import {normalizeStaticCss} from './StaticStyleBoundary';

describe('Nexcent static React runtime', () => {
    it('registers unique custom element names', () => {
        expect(new Set(staticElementNames).size).toBe(staticElementNames.length);
        expect(staticElementNames.every((name) => name.includes('-'))).toBe(true);
    });

    it('preserves the prototype 62.5 percent rem scale inside Shadow DOM', () => {
        expect(normalizeStaticCss('padding: 1.6rem; margin: -0.25rem;')).toBe(
            'padding: 16px; margin: -2.5px;'
        );
    });

    it('removes the prototype source map comment', () => {
        expect(
            normalizeStaticCss('a{}/*# sourceMappingURL=style.css.map */')
        ).toBe('a{}');
    });
});
