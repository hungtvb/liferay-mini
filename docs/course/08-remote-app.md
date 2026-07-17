# 08 — Build and Register the Externally Hosted Remote App

## Goal

Implement Community Updates as a React application hosted outside Liferay while registered as a Custom Element widget.

## Architecture

```text
remote-apps/nexcent-community-app
        ↓ build and serve from external host
http://localhost:4173 or production CDN
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
    baseURL: http://localhost:4173
    cssURLs:
        - /assets/index.css
    friendlyURLMapping: nexcent-community
    htmlElementName: nexcent-community-app
    instanceable: false
    name: Nexcent Community Remote App
    portletCategoryName: category.client-extensions
    type: customElement
    urls:
        - /assets/index.js
    useESM: true
```

Use an environment-appropriate `baseURL` for shared environments.

## Local run

```bash
cd remote-apps/nexcent-community-app
npm install
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

Then deploy only the Liferay registration:

```bash
./gradlew :client-extensions:nexcent-remote-app-registration:deploy
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
