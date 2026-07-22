# 08 — Build and Register Nexcent Articles

## Delivery status

- **Source ready:** the React/Vite Custom Element reads Web Content through Liferay Headless Delivery, resolves the Article Structure by stable ERC, maps fields by name, and renders loading, empty, error, and populated states.
- **Externally hosted:** production assets are assembled at `https://nexcent-liferay-static.vercel.app/articles/`.
- **Registered in Liferay:** `client-extensions/nexcent-articles-client-extension` defines the `nexcent-articles` Custom Element.
- **Runtime pending:** deploy to a clean DXP 2026.Q1.1 bundle, configure permissions and the Display Page Template, then capture the 1440px, 768px, and 375px acceptance matrix before merge.

The complete installation, import, administration, authoring, troubleshooting, and rollback guide is in [Article Feature Liferay Runbook](../guides/article-feature-liferay-runbook.md).

## Architecture

```text
remote-apps/nexcent-articles
        ↓ build and publish
https://nexcent-liferay-static.vercel.app/articles
        ↓ register
client-extensions/nexcent-articles-client-extension
        ↓
<nexcent-articles>
        ↓ Headless Delivery
NXC-STRUCTURE-ARTICLE
        ↓ contentUrl
Default Article Display Page Template
```

## Stable runtime contract

| Setting | Value |
|---|---|
| Custom Element tag | `nexcent-articles` |
| Structure ERC | `NXC-STRUCTURE-ARTICLE` |
| Hosted base URL | `https://nexcent-liferay-static.vercel.app/articles` |
| Friendly URL mapping | `nexcent-articles` |
| Client Extension | `nexcent-articles-client-extension` |
| Remote application | `remote-apps/nexcent-articles` |

The component accepts these optional element properties:

| Property | Purpose |
|---|---|
| `article-structure-identifier` | Overrides the Structure ERC/key used for lookup |
| `heading` | Section heading |
| `description` | Section introduction |

Do not configure numeric site, structure, or content IDs in source. The component obtains the current site context from Liferay and resolves the runtime Structure ID from its stable identifier.

## Build and preview locally

```bash
cd remote-apps/nexcent-articles
npm ci
npm run typecheck
npm run build
npm run preview -- --host 0.0.0.0 --port 4173
```

The standalone preview verifies the visual shell and build output. Live Article retrieval must be verified inside Liferay because portal context, permissions, workflow, and Display Page URLs are runtime concerns.

## Publish the external assets

The repository-root Vercel assembly publishes:

```text
/
├── index.html
└── articles/
    ├── index.html
    ├── index.js
    └── style.css
```

Run the same assembly locally when checking the deployment artifact:

```bash
npm --prefix remote-apps/nexcent-articles ci
npm --prefix remote-apps/nexcent-articles run build
node scripts/assemble-vercel-output.mjs
```

Deploy or promote the static host before deploying the Liferay registration. Keep the existing hosted version available until the new files return HTTP 200.

## Register in Liferay

The committed registration is:

```yaml
nexcent-articles:
    baseURL: https://nexcent-liferay-static.vercel.app/articles
    cssURLs:
        - /style.css
    friendlyURLMapping: nexcent-articles
    htmlElementName: nexcent-articles
    instanceable: false
    name: Nexcent Articles
    portletCategoryName: category.client-extensions
    type: customElement
    urls:
        - /index.js
    useESM: true
```

Deploy it:

```bash
./gradlew :client-extensions:nexcent-articles-client-extension:deploy
```

For local-only development, temporarily point `baseURL` to `http://localhost:4173`, deploy the Client Extension to the local bundle, and do not commit that environment override.

## Add the widget to a Content Page

1. Create and publish the `NXC Article` Structure with ERC `NXC-STRUCTURE-ARTICLE`.
2. Create a default Article Display Page Template.
3. Publish at least one Article and grant Guest view access where public access is required.
4. Edit the target Content Page.
5. Open **Widgets → Client Extensions** and add **Nexcent Articles**.
6. Configure the heading, description, or Structure identifier only when the page needs an override.
7. Publish the page.

The card link comes from Headless Delivery's `contentUrl`. Do not compose `/w/...` URLs in the frontend.

## Verification

- The widget appears once and the browser has no duplicate custom-element registration error.
- Loading, populated, empty, and API-error states render without horizontal overflow.
- Published Articles visible to the current user appear without rebuilding frontend assets.
- Draft, expired, or unauthorized content does not appear to Guest.
- Cover images use the structured field value and accessible alt text.
- Card links open the default Display Page Template using `contentUrl`.
- Long titles, missing images, and unavailable external assets fail safely.
- The page passes at 1440px, 768px, and 375px.

## Release and rollback

Release order:

1. Build and publish `/articles`.
2. Confirm `index.js` and `style.css` are reachable.
3. Deploy the Client Extension only if its registration contract changed.
4. Verify Liferay runtime states and responsive breakpoints.

Rollback by restoring the previous hosted assets. If the tag, base URL, or asset names changed, also redeploy the previous Client Extension registration. Web Content and import jobs are independent of frontend rollback.
