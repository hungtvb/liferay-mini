import React, {type ReactNode} from 'react';
import {createRoot, type Root} from 'react-dom/client';

import {Articles} from './components/Articles/Articles';
import {Clients} from './components/Clients/Clients';
import {Community} from './components/Community/Community';
import {Cta} from './components/Cta/Cta';
import {Feature} from './components/Feature/Feature';
import {Footer} from './components/Footer/Footer';
import {Header} from './components/Header/Header';
import {StaticHero} from './components/Hero';
import {Statistics} from './components/Statistics/Statistics';
import {Testimonial} from './components/Testimonial/Testimonial';
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
    'nexcent-react-articles',
    'nexcent-react-cta',
    'nexcent-react-footer',
] as const;

function registerShadowReactElement(name: string, renderer: StaticRenderer) {
    if (customElements.get(name)) {
        return;
    }

    class NexcentReactElement extends HTMLElement {
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

    customElements.define(name, NexcentReactElement);
}

export function registerStaticElements() {
    registerShadowReactElement('nexcent-react-page', () => <StaticPage />);
    registerShadowReactElement('nexcent-react-header', (element) => (
        <Header host={element} />
    ));
    registerShadowReactElement('nexcent-react-hero', (element) => (
        <StaticHero host={element} />
    ));
    registerShadowReactElement('nexcent-react-clients', (element) => (
        <Clients host={element} />
    ));
    registerShadowReactElement('nexcent-react-community', (element) => (
        <Community host={element} />
    ));
    registerShadowReactElement('nexcent-react-feature-primary', (element) => (
        <Feature featureKey="primary" host={element} />
    ));
    registerShadowReactElement('nexcent-react-statistics', (element) => (
        <Statistics host={element} />
    ));
    registerShadowReactElement('nexcent-react-feature-secondary', (element) => (
        <Feature featureKey="secondary" host={element} />
    ));
    registerShadowReactElement('nexcent-react-testimonial', (element) => (
        <Testimonial host={element} />
    ));

    const renderArticles = (element: HTMLElement) => <Articles host={element} />;
    registerShadowReactElement('nexcent-react-marketing', renderArticles);
    registerShadowReactElement('nexcent-react-articles', renderArticles);

    registerShadowReactElement('nexcent-react-cta', (element) => (
        <Cta host={element} />
    ));
    registerShadowReactElement('nexcent-react-footer', (element) => (
        <Footer host={element} />
    ));
}
