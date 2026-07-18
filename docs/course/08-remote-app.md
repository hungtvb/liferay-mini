# 08 — Build and Register the Externally Hosted Remote App

## Goal

Implement Community Updates as a React application hosted outside Liferay while registered as a Custom Element widget.

## Architecture

```text
remote-apps/nexcent-community-app
        ↓ build and serve from external host
https://nexcent-liferay-static.vercel.app/remote-app
        ↓
client-extensions/nexcent-remote-app-registration
        ↓
Liferay Custom Element widget
        ↓
Headless Delivery API
        ↓
NXC Community Intro + NXC Community Card[]
```

## FE tasks

1. Build the React/Vite application independently from the Liferay bundle.
2. Register `<nexcent-community-app>` with a duplicate-registration guard.
3. Read optional widget properties from element attributes.
4. Resolve current portal context through `window.Nexcent` or `Liferay.ThemeDisplay`.
5. Fetch Community content from Liferay.
6. Implement loading, empty, error, long-title, broken-image, and external-host-unavailable states.
7. Configure development and production asset URLs.
8. Document cache invalidation and release sequence.

## BE/Liferay tasks

1. Publish Community Intro and Card content.
2. Configure guest or authenticated API permissions.
3. Deploy the registration Client Extension with the external `baseURL`.
4. Add the widget to the Content Page.
5. Verify the external host is allowed by environment networking and security policy.

## Registration contract

```yaml
nexcent-community-remote-app:
    baseURL: https://nexcent-liferay-static.vercel.app/remote-app
    cssURLs:
        - /style.css
    friendlyURLMapping: nexcent-community
    htmlElementName: nexcent-community-app
    instanceable: false
    name: Nexcent Community Remote App
    portletCategoryName: category.client-extensions
    type: customElement
    urls:
        - /index.js
    useESM: true
```

The committed registration targets the external Vercel host. For local-only development, temporarily use `http://localhost:4173`, deploy the registration to the local bundle, and do not commit that override.

## Local run

```bash
cd remote-apps/nexcent-community-app
npm ci
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Then deploy only the Liferay registration:

```bash
./gradlew :client-extensions:nexcent-remote-app-registration:deploy
```

The repository-root Vercel build publishes the landing page and Remote App together while preserving independent Remote App assets:

```text
/
├── index.html
└── remote-app/
    ├── index.html
    ├── index.js
    └── style.css
```

## Verification

- Stop the external host and confirm the page shows an actionable failure state.
- Restart the host without redeploying Liferay and confirm recovery.
- Change Community Web Content and confirm the Remote App updates.
- Build a new app version and confirm independent release behavior.

## Checkpoint

- [ ] Application assets are not served by Liferay.
- [ ] Widget registration appears in Liferay.
- [ ] The app calls Headless Delivery successfully.
- [ ] External-host failure is visible and does not break the page.
- [ ] The app can be released independently.
