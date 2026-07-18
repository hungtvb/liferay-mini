# Nexcent static landing page

A framework-free landing page derived from the audited Nexcent Figma composition. It renders one normalized page model from either version-controlled mock JSON or live Liferay Headless Delivery content.

## Run

Serve from this directory; `fetch()` will not work reliably through `file://`.

```bash
cd prototypes/nexcent-static
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Vercel deployment

The Vercel project is connected to `hungtvb/liferay-mini` with:

```text
Production branch: main
Root directory: repository root
Framework preset: Other
```

Production URL: `https://nexcent-liferay-static.vercel.app`

Pull requests should create Preview Deployments; changes merged to `main` should create Production Deployments. The repository build also publishes the independently built Community Remote App at `/remote-app/`.

## Data boundary

- `data/mock-content.json` is normalized mock page data.
- `data/headless-config.json` records the Liferay delivery owner, Structure identifiers and endpoint templates for each section.
- `headless-adapter.mjs` discovers Structures by name/ERC, fetches their Structured Content, and maps `contentFields` into the same normalized shape.
- `app.js` renders only the normalized shape.

Mock mode is the default. Live Headless mode requires a portal base URL and site ID:

```text
http://localhost:4173/?source=headless&liferayBaseURL=http://localhost:8080&siteId=20117
```

When served from another origin, configure Liferay CORS and cookie/auth policy for that preview origin. The production Liferay page normally uses the Custom Elements and Collection Displays directly; this switch exists for contract integration and visual comparison.

Run the adapter contract test with:

```bash
node --test prototypes/nexcent-static/headless-adapter.test.mjs
```

## Figma scope

The supplied 480px frame is a proportional duplicate rather than a complete responsive specification. Desktop follows the audited Nexcent composition; tablet and mobile use content-driven responsive behavior.
