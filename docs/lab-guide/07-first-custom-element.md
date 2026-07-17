# Lab 07 — Create and Deploy the First Custom Element

## Overview

Build and deploy the first React Custom Element Client Extension. This starter verifies the complete path from TypeScript source to a widget on a Liferay page.

## Estimated time

45–60 minutes.

## Technology

- React 18.2
- TypeScript
- Vite
- ES modules
- Liferay Custom Element Client Extension

## Step 1: Inspect the project

```text
client-extensions/nexcent-landing-elements/
├── client-extension.yaml
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.tsx
    └── styles.css
```

## Step 2: Understand client-extension.yaml

```yaml
assemble:
    - from: build
      into: static

nexcent-lab-status:
    cssURLs:
        - style.css
    friendlyURLMapping: nexcent-lab-status
    htmlElementName: nexcent-lab-status
    instanceable: false
    name: Nexcent Lab Status
    portletCategoryName: category.client-extensions
    type: customElement
    urls:
        - index.js
    useESM: true
```

`htmlElementName` must match the element registered in JavaScript.

## Step 3: Install dependencies

```bash
cd client-extensions/nexcent-landing-elements
yarn install
```

## Step 4: Build

```bash
yarn build
```

Verify:

```text
build/
├── index.js
└── style.css
```

## Step 5: Understand registration

```tsx
class NexcentLabStatusElement extends HTMLElement {
    connectedCallback() {
        this.root = createRoot(this);
        this.root.render(<App />);
    }

    disconnectedCallback() {
        this.root?.unmount();
    }
}

const ELEMENT_NAME = 'nexcent-lab-status';

if (!customElements.get(ELEMENT_NAME)) {
    customElements.define(ELEMENT_NAME, NexcentLabStatusElement);
}
```

The registration guard prevents errors when Liferay SPA navigation loads the module again.

## Step 6: Deploy

From the Client Extension directory:

macOS or Linux:

```bash
../../gradlew clean deploy
```

Windows:

```powershell
..\..\gradlew.bat clean deploy
```

## Step 7: Add the widget

1. Create or open a Content Page.
2. Click Edit.
3. Open Fragments and Widgets.
4. Select Widgets → Client Extensions.
5. Drag **Nexcent Lab Status** onto the page.
6. Publish.

## Step 8: Test lifecycle behavior

- Refresh the page.
- Navigate away and back using Liferay SPA navigation.
- Remove and re-add the widget.
- Confirm the browser console has no duplicate element error.

## Checkpoint

- [ ] Dependencies install.
- [ ] Vite creates `index.js` and `style.css`.
- [ ] Gradle deploys the Client Extension.
- [ ] The widget appears under Client Extensions.
- [ ] The widget renders on a Content Page.
- [ ] SPA navigation causes no registration error.

## Troubleshooting

### Widget does not appear

Inspect Applications → Client Extensions and the server console.

### CSS file is missing

Run `yarn build` and verify `build/style.css`.

### Duplicate custom element error

Ensure the `customElements.get(ELEMENT_NAME)` guard exists.

### Blank widget

Inspect browser JavaScript requests and console errors.

## Knowledge check

1. What relationship must exist between `htmlElementName` and `customElements.define()`?
2. Why does React unmount in `disconnectedCallback()`?
3. What does the `assemble` block package?
