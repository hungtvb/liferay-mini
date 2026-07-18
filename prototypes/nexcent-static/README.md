# Nexcent static landing page

A framework-free static prototype derived from the Nexcent Figma composition already audited for this project.

## Run

Serve from this directory; `fetch()` will not work reliably through `file://`.

```bash
cd prototypes/nexcent-static
python3 -m http.server 4173
```

Open `http://localhost:4173`.

## Data boundary

- `data/mock-content.json` is normalized mock page data.
- `data/headless-config.json` records the Liferay delivery owner, Structure identifiers and endpoint templates for each section.
- `app.js` renders only the normalized shape. A future Headless adapter should map Liferay `contentFields` into that shape.

Use `?source=headless` to exercise the data-source selection branch. It currently logs the Headless contract and falls back to mock data because this prototype has no live Liferay runtime.

## Figma scope

The supplied 480px frame is a proportional duplicate rather than a complete responsive specification. Desktop follows the audited Nexcent composition; tablet and mobile use content-driven responsive behavior.
