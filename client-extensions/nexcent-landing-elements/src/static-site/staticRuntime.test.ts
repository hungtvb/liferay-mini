import {describe, expect, it} from 'vitest';

import {normalizeCssDeclarationValue} from '../build/cssContract';
import {staticElementNames} from './registerStaticElements';

describe('Nexcent React runtime', () => {
    it('registers unique custom element names', () => {
        expect(new Set(staticElementNames).size).toBe(staticElementNames.length);
        expect(staticElementNames.every((name) => name.includes('-'))).toBe(true);
    });

    it('preserves the reference 62.5 percent rem scale at build time', () => {
        expect(normalizeCssDeclarationValue('1.6rem -0.25rem')).toBe(
            '16px -2.5px'
        );
    });

    it('maps brand colors to inherited Style Book variables at build time', () => {
        expect(normalizeCssDeclarationValue('#4caf4f #fff')).toBe(
            'var(--nxc-color-primary, #4caf4f) var(--nxc-color-white, #fff)'
        );
    });
});
