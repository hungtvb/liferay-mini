import React, {type ReactNode} from 'react';
import {createRoot, type Root} from 'react-dom/client';

import {
    StaticClients,
    StaticCommunity,
    StaticCta,
    StaticFeature,
    StaticMarketing,
    StaticStatistics,
    StaticTestimonial,
} from './components/ContentSections';
import {StaticFooter} from './components/Footer';
import {StaticHeader} from './components/Header';
import {StaticHero} from './components/Hero';
import {StaticPage} from './StaticPage';
import {StaticRuntimeOverrides} from './StaticRuntimeOverrides';
import {StaticStyleBoundary} from './StaticStyleBoundary';

type StaticRenderer = (element: HTMLElement) => ReactNode;

export const staticElementNames = [
    'nexcent-react-page',
    'nexcent-react-header',
    'nexcent-react-hero',
    'nexcent-react-clients',
    'nexcent-react-community',
    'nexcent-react-feature-primary',
    'nexcent-react-statistics',
    'nexcent-react-feature-secondary',
    'nexcent-react-testimonial',
    'nexcent-react-marketing',
    'nexcent-react-cta',
    'nexcent-react-footer',
] as const;

function registerShadowReactElement(name: string, renderer: StaticRenderer) {
    if (customElements.get(name)) {
        return;
    }

    class NexcentStaticReactElement extends HTMLElement {
        private root?: Root;

        connectedCallback() {
            if (this.root) {
                return;
            }

            const shadowRoot =
                this.shadowRoot ?? this.attachShadow({mode: 'open'});

            this.root = createRoot(shadowRoot);
            this.root.render(
                <React.StrictMode>
                    <StaticStyleBoundary>
                        <StaticRuntimeOverrides>
                            {renderer(this)}
                        </StaticRuntimeOverrides>
                    </StaticStyleBoundary>
                </React.StrictMode>
            );
        }

        disconnectedCallback() {
            this.root?.unmount();
            this.root = undefined;
        }
    }

    customElements.define(name, NexcentStaticReactElement);
}

export function registerStaticElements() {
    registerShadowReactElement('nexcent-react-page', () => <StaticPage />);
    registerShadowReactElement('nexcent-react-header', (element) => (
        <StaticHeader host={element} />
    ));
    registerShadowReactElement('nexcent-react-hero', (element) => (
        <StaticHero host={element} />
    ));
    registerShadowReactElement('nexcent-react-clients', (element) => (
        <StaticClients host={element} />
    ));
    registerShadowReactElement('nexcent-react-community', (element) => (
        <StaticCommunity host={element} />
    ));
    registerShadowReactElement('nexcent-react-feature-primary', (element) => (
        <StaticFeature featureKey="primary" host={element} />
    ));
    registerShadowReactElement('nexcent-react-statistics', (element) => (
        <StaticStatistics host={element} />
    ));
    registerShadowReactElement('nexcent-react-feature-secondary', (element) => (
        <StaticFeature featureKey="secondary" host={element} />
    ));
    registerShadowReactElement('nexcent-react-testimonial', (element) => (
        <StaticTestimonial host={element} />
    ));
    registerShadowReactElement('nexcent-react-marketing', (element) => (
        <StaticMarketing host={element} />
    ));
    registerShadowReactElement('nexcent-react-cta', (element) => (
        <StaticCta host={element} />
    ));
    registerShadowReactElement('nexcent-react-footer', (element) => (
        <StaticFooter host={element} />
    ));
}
