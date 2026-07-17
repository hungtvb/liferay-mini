import React from 'react';
import {Root, createRoot} from 'react-dom/client';

import {App} from './App';
import './styles.css';

class NexcentLabStatusElement extends HTMLElement {
    private root?: Root;

    connectedCallback() {
        if (this.root) {
            return;
        }

        this.root = createRoot(this);
        this.root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    }

    disconnectedCallback() {
        this.root?.unmount();
        this.root = undefined;
    }
}

const ELEMENT_NAME = 'nexcent-lab-status';

if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, NexcentLabStatusElement);
}
