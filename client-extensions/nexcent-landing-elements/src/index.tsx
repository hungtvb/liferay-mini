import React, {type ReactNode} from 'react';
import {createRoot, type Root} from 'react-dom/client';

import {App} from './App';
import {Features} from './components/Features/Features';
import {Hero} from './components/Hero/Hero';
import {ContentImporter} from './components/Importer/ContentImporter';
import {Services} from './components/Services/Services';
import {registerStaticElements} from './static-site/registerStaticElements';
import './styles.css';

type ElementRenderer = (element: HTMLElement) => ReactNode;

function registerReactElement(name: string, renderer: ElementRenderer) {
    if (customElements.get(name)) {
        return;
    }

    class LiferayReactElement extends HTMLElement {
        private root?: Root;

        connectedCallback() {
            if (this.root) {
                return;
            }

            this.root = createRoot(this);
            this.root.render(
                <React.StrictMode>{renderer(this)}</React.StrictMode>
            );
        }

        disconnectedCallback() {
            this.root?.unmount();
            this.root = undefined;
        }
    }

    customElements.define(name, LiferayReactElement);
}

registerReactElement('nexcent-lab-status', () => <App />);
registerReactElement('nexcent-content-importer', () => <ContentImporter />);

registerReactElement('nexcent-hero', (element) => (
    <Hero
        structureIdentifier={
            element.getAttribute('structure-identifier') ?? 'NXC Landing Hero'
        }
    />
));

registerReactElement('nexcent-services', (element) => (
    <Services
        introStructureIdentifier={
            element.getAttribute('intro-structure-identifier') ??
            'NXC Services Intro'
        }
        itemStructureIdentifier={
            element.getAttribute('item-structure-identifier') ??
            'NXC Service Item'
        }
    />
));

registerReactElement('nexcent-features', (element) => (
    <Features
        structureIdentifier={
            element.getAttribute('structure-identifier') ?? 'NXC Feature Item'
        }
    />
));

registerStaticElements();
