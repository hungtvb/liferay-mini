# Liferay DXP 2026.Q1 architecture audit

Audit date: 2026-07-18

Target runtime: **Liferay DXP 2026.Q1.1 LTS**

This document separates official platform capabilities, repository implementation, runtime evidence, and items that still require a proof of concept. A feature is not treated as delivered merely because its configuration or source code exists.

## Executive decision

The project keeps the current Classic CMS implementation as a **supported compatibility baseline** because the existing Web Content structures, FreeMarker preview templates, Excel importer, and Batch Client Extension already target that model.

However, Classic CMS, Web Content, Documents and Media, and Asset Libraries are in maintenance mode in Liferay DXP 2026.Q1. For a new long-lived implementation, the official forward path is **Liferay CMS**, based on content structures, objects, and Spaces. Liferay CMS is a 2026.Q1 release feature and must be activated with feature flags, so the project will not replace the working baseline until a runtime PoC proves the required authoring, page mapping, API, migration, and permission flows.

```text
Compatibility baseline
Classic Web Content + Documents and Media
        ↓
Current Custom Elements, Excel importer, and Batch CE

Modernization PoC
Liferay CMS Content Structures + Spaces
        ↓
Object-based mapping and headless APIs
        ↓
Adopt only after parity evidence
```

## Verified platform facts

| Topic | Verified position | Project impact |
|---|---|---|
| Liferay CMS | Released in DXP 2026.Q1, object-based, headless-first, and recommended for new implementations | Add a modernization PoC before declaring the final content architecture |
| CMS activation | Requires release feature flags `LPD-34594`, `LPD-11235`, and `LPD-17564` on 2026.Q1 | Environment bootstrap must record and verify flags |
| Classic CMS | Fully supported but in maintenance mode from 2026.Q1 | Keep as compatibility baseline, not as an unqualified future default |
| Web Content | Maintenance mode from 2026.Q1 | Existing labs remain valid but must be labeled as Classic CMS |
| Documents and Media | Maintenance mode from 2026.Q1 | Do not make it the long-term design-resource host for Client Extensions |
| Asset Libraries | Maintenance mode from 2026.Q1 | Do not make a new Asset Library a mandatory MVP dependency |
| Spaces | Primary organizational unit in Liferay CMS and connectable to sites | Preferred modern shared-content candidate, subject to PoC |
| Client Extensions | Theme CSS, CSS, JavaScript, favicon, sprite map, static content, Custom Element, IFrame, Batch, and Site Initializer are official types | Current frontend packaging direction is valid |
| Custom Elements | Register external JavaScript applications as Liferay widgets | Registration is supported; placement and instance configuration still need runtime evidence |
| Site Initializer | Can create or update a site with supported pages, content, and configuration | Use only documented/supported asset types and verify each imported type |
| Site Initializer support | An asset is unsupported when the relevant Liferay initializer has no import path for it | Never infer support solely from a folder name |
| Pages and page templates | Supported Site Initializer asset categories with page definitions | Page bootstrap is a valid target |
| Master pages | OOTB and exportable as page template definitions | Exact clean-instance provisioning remains a PoC gate |
| Navigation menus | OOTB; 2026.Q1 LAR/batch export-import requires feature flags and is unavailable in staging | Do not claim Site Initializer provisioning until tested on 2026.Q1.1 |
| Batch Client Extension | Uses Batch Engine exports and requires `jsont` for batch payload preparation | Current rule to export from the target runtime is correct |
| Multi-extension deploy | All client extensions can be submitted from the workspace | This is one command, not an atomic transaction |

## Current repository truth

### Implemented in source

- Unified Theme CSS, Global CSS, Global JavaScript, and favicon Client Extensions.
- Hero, Services, Features, and Content Importer Custom Elements.
- Community Remote App source and Liferay registration scaffold.
- Classic Web Content contracts, sample data, Excel import flow, and Batch CE flow.
- Static Nexcent prototype with mock JSON and a Vercel deployment.
- PR #11 adds a Figma REST asset-sync workflow.

### Not yet proven on a clean Liferay 2026.Q1.1 runtime

- Deployment and activation of every Client Extension archive.
- Site creation and page composition from a Site Initializer.
- Master Page provisioning and publication.
- Navigation Menu provisioning and responsive header binding.
- Style Book import and binding to the Theme CSS external reference code.
- Automatic placement and configuration of Custom Elements on the landing page.
- Newsletter Object definition, form placement, and persistence.
- Repeatable clean-instance import of content, files, and permissions.
- Liferay CMS/Spaces parity with the Classic CMS baseline.

### Static prototype boundary

The Vercel site is a visual and data-contract prototype. It currently loads `data/mock-content.json`; it is not evidence of a live Liferay Headless API integration. The committed illustrations, logos, and icons remain placeholders until a real Figma export PR replaces them.

## Asset strategy

### Current baseline

```text
Classic CMS track
Site-scoped Documents and Media
→ Classic Web Content image fields
→ existing Headless Delivery adapter
```

This remains usable for the current training implementation, but its maintenance-mode status must be visible in documentation.

### Modern target

```text
Liferay CMS track
Nexcent Space
→ CMS files and content structures
→ object-based fragment/page mapping or headless APIs
```

Do not introduce a new shared Asset Library unless a real multi-site reuse requirement appears. Spaces are the preferred modernization candidate for 2026.Q1+, but some legacy selectors are not compatible with CMS objects, so component-by-component parity must be tested.

### Client Extension resources

CSS, JavaScript, icons used by the application shell, and other immutable design resources should be packaged with their Client Extensions or static host. They should not depend on editor-managed Documents and Media entries.

## Header and mobile navigation

The intended implementation remains:

```text
Liferay Navigation Menu
→ Navigation Bar or Menu Display in a Master Page
→ Theme/Global CSS for responsive layout
→ minimal Global JavaScript only when OOTB behavior is insufficient
```

The menu data must remain editor-managed. Do not hard-code production links inside React or Global JavaScript. The hamburger interaction is feasible, but the final Master Page and menu provisioning are not considered automated until a clean-instance test passes.

## Site bootstrap and “deploy once” definition

The delivery goal is **one command with observable, repeatable steps**, not an atomic transaction.

```text
Build and deploy Client Extensions
→ verify each archive is STARTED/available
→ run Site Initializer for supported assets
→ run Batch CE for exported data contracts
→ apply environment configuration and secrets
→ execute smoke tests
```

A partial deployment must be detectable and rerunnable. Runtime evidence must record the status of each Client Extension, site/page existence, API responses, content counts, and browser smoke tests.

## Figma automation audit

PR #11 is directionally valid, with these constraints:

- A Personal Access Token needs the granular `file_content:read` scope and only accesses files already visible to its owner.
- Personal Access Tokens have a maximum lifetime of 90 days and require rotation.
- `GET file nodes` and `GET image` are Tier 1 requests. Limits depend on seat type, endpoint tier, and the plan containing the file.
- Low-access seats can be limited to as few as six Tier 1 requests per month; actual allowance may be lower.
- One sync consumes at least one node-tree request plus one or more batched image-render requests.
- The script cannot infer which visual layers are approved assets. Layers must use the naming convention, have Figma export settings, or be mapped by node ID.
- No real Figma asset has been committed until a generated PR is visually reviewed.

The first real sync is therefore a controlled acceptance test, not a repeatedly runnable discovery loop.

## Evidence states

Use these labels in project documents and tasks:

- **VERIFIED:** confirmed by official documentation and, when runtime-specific, by a clean-instance test.
- **IMPLEMENTED / RUNTIME PENDING:** source exists but has not been proven on the target runtime.
- **POC REQUIRED:** platform capability or integration path is plausible but not yet accepted.
- **OUT OF SCOPE:** intentionally excluded from the current delivery.

## Official references

- Liferay CMS overview: https://learn.liferay.com/w/dxp/content-management-system/liferay-headless-content-management-system
- CMS Spaces: https://learn.liferay.com/w/dxp/content-management-system/liferay-headless-content-management-system/spaces
- Classic CMS maintenance mode: https://learn.liferay.com/w/dxp/content-management-system/classic-content-management-system
- Asset Libraries: https://learn.liferay.com/w/dxp/content-management-system/asset-libraries
- Client Extension reference: https://learn.liferay.com/w/dxp/development/client-extensions/client-extension-reference
- Site Initializers: https://learn.liferay.com/w/dxp/development/importing-exporting-data/site-initializers
- Navigation Menus: https://learn.liferay.com/w/dxp/sites/site-navigation/using-the-navigation-menus-application
- Master Page Templates: https://learn.liferay.com/w/dxp/sites/creating-pages/defining-headers-and-footers/managing-master-page-templates
- Figma scopes: https://developers.figma.com/docs/rest-api/scopes/
- Figma rate limits: https://developers.figma.com/docs/rest-api/rate-limits/
- Figma file endpoints: https://developers.figma.com/docs/rest-api/file-endpoints/
- Figma changelog: https://developers.figma.com/docs/rest-api/changelog/
