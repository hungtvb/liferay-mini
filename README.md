# Nexcent Figma-to-Liferay FE–BE Project

Build the Nexcent landing page from the supplied Figma design on **Liferay DXP 2026.Q1.1 LTS**. This is a coordinated frontend/backend delivery project, not a general Liferay platform course.

The Figma landing page and its detailed Style Guide are the source of truth. Every visible component is analyzed from both views:

- **FE:** rendering, responsive behavior, accessibility, component states, and Liferay frontend technology.
- **BE:** content ownership, content fields, assets, API contract, validation, migration, and editor workflow.

The previous course is preserved at [`archive/course-v1`](https://github.com/hungtvb/liferay-mini/tree/archive/course-v1).

## 2026.Q1 architecture audit status

The current repository implementation uses **Classic Web Content and Documents and Media as a compatibility baseline**. Those capabilities remain supported in 2026.Q1, but Classic CMS, Web Content, Documents and Media, and Asset Libraries are in maintenance mode.

For a new long-lived implementation, the modernization candidate is **Liferay CMS with Content Structures and Spaces**. Because Liferay CMS is a 2026.Q1 release feature that requires feature flags and has different object, fragment-mapping, API, and selector behavior, it must pass a runtime PoC before replacing the existing baseline.

```text
Current implementation
Classic Web Content + Documents and Media
→ existing Custom Elements, Excel importer, and Batch CE

Modernization PoC
Liferay CMS Content Structures + Spaces
→ object-based mapping and headless APIs
→ adopt only after parity evidence and ADR approval
```

Current evidence boundary:

- The static Vercel deployment is a **visual and data-contract prototype** driven by mock JSON.
- It does not prove a live Liferay Headless integration.
- Its current logo, icons, and illustrations remain placeholders until a generated Figma asset PR passes visual review.
- Source code existing in the repository is not treated as runtime verified until it passes a clean Liferay 2026.Q1.1 deployment test.
- “Deploy once” means one command with observable, rerunnable steps; it is not an atomic transaction.

Audit and task sources:

- [`docs/architecture/liferay-2026-q1-audit.md`](docs/architecture/liferay-2026-q1-audit.md)
- [`docs/tasks/2026-q1-audit-backlog.md`](docs/tasks/2026-q1-audit-backlog.md)
- [`docs/figma-asset-sync.md`](docs/figma-asset-sync.md)

## Original project scope

### Frontend

- Extract the Figma Style Guide and implement it with one unified Nexcent Theme client-extension project.
- Provide Theme CSS, frontend tokens, the `Nexcent Default` Style Book package, Global CSS, Global JavaScript, and a theme favicon.
- Build at least three complete dynamic components using Custom Element Client Extensions.
- Build one externally hosted Community Updates Remote App and register it in Liferay.
- Do not hard-code text, images, services, statistics, testimonials, or blog cards in frontend source.
- Consume the accepted Liferay Headless API contract.
- Implement desktop, tablet, and mobile layouts with loading, empty, and error states.

### Backend

Compatibility baseline:

- Model the complete landing page with Classic Web Content Structures and FreeMarker preview Templates.
- Include Text, Image, Boolean, Number, Select, and HTML/Rich Text fields where appropriate.
- Manage editorial assets in site-scoped Documents and Media.
- Define stable field references and external reference codes as the FE–BE contract.
- Provide the Excel migration contract and browser importer flow.
- Package repeatable data with a real Batch Client Extension and verify Headless Batch Engine export/import behavior.
- Imported records must appear under **Site Content → Web Content** without duplicate ERCs or migration errors.

Modernization gate:

- Enable the documented Liferay CMS release feature flags on the target runtime.
- Prove equivalent Hero and Service Item content with Content Structures and a Nexcent Space.
- Compare page mapping, headless API payloads, permissions, migration, and editor workflow with the compatibility baseline.
- Record an ADR before adopting, deferring, or choosing a hybrid transition.

## Explicit non-goals

The core project does not require OSGi business modules, Gogo Shell, Service Builder, REST Builder BFF, or legacy Liferay Forms. Those technologies are added only when a business requirement needs them.

A new Asset Library is not a mandatory MVP dependency. Shared content is evaluated through Liferay CMS Spaces during the modernization PoC.

## Delivery architecture

```text
Figma Landing Page + Detailed Style Guide
                    ↓
          FE–BE component contracts
                    ↓
client-extensions/nexcent-theme
├── Theme CSS + frontend-token-definition.json
├── Nexcent Default Style Book values
├── Global CSS aliases and OOTB Master Page hooks
├── Global JavaScript utilities
└── Theme favicon
                    ↓
Liferay Content Page / Master Page
├── OOTB Header and Footer composition
├── OOTB Navigation Menus
├── OOTB Newsletter Object Form
├── Hero Custom Element
├── Client Logos collection
├── Services Custom Element
├── Features Custom Element
├── Statistics collection
├── Testimonial collection
├── Community Updates Remote App
└── Final CTA
                    ↓
Accepted content adapter
├── Compatibility baseline: Classic Web Content + Documents and Media
└── Modern candidate: Liferay CMS Content Structures + Spaces

Excel workbook + assets
        ↓
Content Importer Custom Element
        ↓
Accepted content and file APIs

Published NXC content
        ↓
Headless Batch Engine jsont export
        ↓
Batch Client Extension
```

## Theme package

The shared design foundation is maintained in:

```text
client-extensions/nexcent-theme/
├── client-extension.yaml
├── package.json
├── assets/
│   ├── favicon.svg
│   ├── global.css
│   └── global.js
├── src/
│   ├── css/
│   │   ├── _clay_variables.scss
│   │   └── _custom.scss
│   └── frontend-token-definition.json
└── style-book/nexcent-default/
    ├── frontend-tokens-values.json
    └── style-book.json
```

One `client-extension.yaml` defines four entries:

- `nexcent-theme-css`
- `nexcent-global-css`
- `nexcent-global-js`
- `nexcent-theme-favicon`

The Style Book values are versioned beside the Theme CSS. Their clean-instance import and binding to the Theme CSS external reference code remain a runtime acceptance gate.

## Component delivery map

| Figma component | FE delivery | BE ownership |
|---|---|---|
| Style Guide | Unified Theme package and Style Book | Token defaults and editor governance |
| Header | OOTB Master Page composition and Navigation Bar | Site Pages, Navigation Menu, logo, CTA settings |
| Hero | `nexcent-hero` Custom Element | `NXC Landing Hero` Structure and Template; CMS equivalent in PoC |
| Client logos | Collection presentation | `NXC Client Logo` articles |
| Services | `nexcent-services` Custom Element | `NXC Services Intro` and `NXC Service Item`; CMS equivalent in PoC |
| Feature sections | `nexcent-features` Custom Element | Reusable `NXC Feature Item` articles |
| Statistics | Collection presentation | `NXC Statistics Intro` and `NXC Statistic Item` |
| Testimonial | Collection presentation | `NXC Testimonial` articles |
| Community updates | Externally hosted Remote App | `NXC Community Intro` and `NXC Community Card` |
| Final CTA | Mapped page component | `NXC CTA` article |
| Footer | OOTB Master Page composition | Navigation Menus, Object Form, and site settings |
| Excel importer | `nexcent-content-importer` Custom Element | Workbook schema, validation, API permissions |
| Repeatable migration | Deployment verification | Batch Client Extension and Batch Engine payload |

Master Page provisioning, Navigation Menu provisioning, automatic Custom Element placement, and final page composition are marked **PoC required** until clean-instance evidence exists.

See [`docs/contracts/component-contracts.md`](docs/contracts/component-contracts.md) for field-level contracts.

## Figma asset synchronization

PR #11 introduces a dependency-free Figma REST synchronization workflow that:

- discovers explicitly approved nodes through naming, export settings, or node mappings;
- exports SVG, PNG, JPG, or PDF files;
- generates a deterministic asset manifest;
- opens a reviewable GitHub pull request;
- relies on Vercel Preview for visual comparison.

It does not automatically decide which layers are production assets and it does not bypass Figma plan or rate limits. A Personal Access Token requires rotation within its configured lifetime, up to 90 days. See [`docs/figma-asset-sync.md`](docs/figma-asset-sync.md).

## Rebuilt learning path

1. [Project brief and acceptance criteria](docs/course/00-project-brief.md)
2. [Audit the Figma landing page and Style Guide](docs/course/01-figma-audit.md)
3. [Define component-by-component FE–BE contracts](docs/course/02-fe-be-contracts.md)
4. [Build the unified Theme package and Style Book](docs/course/03-design-system.md)
5. [Create Web Content Structures, Templates, assets, and sample data](docs/course/04-content-foundation.md)
6. [Implement Header, Hero, and Client Logos](docs/course/05-header-hero-clients.md)
7. [Implement Services and Feature sections](docs/course/06-services-features.md)
8. [Implement Statistics, Testimonial, Community Updates, CTA, and Footer](docs/course/07-remaining-components.md)
9. [Build and register the externally hosted Remote App](docs/course/08-remote-app.md)
10. [Build the Excel Content Importer](docs/course/09-excel-importer.md)
11. [Build the Batch Client Extension and verify Headless Batch Engine](docs/course/10-batch-migration.md)
12. [Run FE–BE integration, responsive QA, and final demo](docs/course/11-integration-qa.md)
13. [Audit 2026.Q1 architecture and execute modernization PoCs](docs/tasks/2026-q1-audit-backlog.md)

## Repository structure

```text
liferay-mini/
├── client-extensions/
│   ├── nexcent-content-batch/
│   ├── nexcent-landing-elements/
│   ├── nexcent-remote-app-registration/
│   └── nexcent-theme/
├── remote-apps/
│   └── nexcent-community-app/
├── prototypes/
│   └── nexcent-static/
├── docs/
│   ├── architecture/
│   ├── contracts/
│   ├── course/
│   └── tasks/
├── sample-data/
├── scripts/
├── SUBMISSION.md
└── gradle.properties
```

## Local environment

Required tools:

- Git
- Java 21
- Blade CLI
- Node.js 22+
- npm or Yarn

Bootstrap and initialize the bundle:

```bash
./scripts/bootstrap-workspace.sh
./gradlew initBundle
blade server run
```

Portal and API Explorer:

```text
http://localhost:8080
http://localhost:8080/o/api
```

## Evidence labels

Use these labels consistently:

- **VERIFIED:** confirmed by official documentation and, for runtime-specific behavior, by a clean-instance test.
- **IMPLEMENTED / RUNTIME PENDING:** source exists but is not proven on the target runtime.
- **POC REQUIRED:** the platform path is plausible but has not passed acceptance.
- **OUT OF SCOPE:** intentionally excluded.

## Project acceptance criteria

- The implemented page matches the Figma composition and detailed Style Guide using accepted, reviewed assets.
- The unified Theme package deploys Theme CSS, Global CSS, Global JavaScript, and the favicon on Liferay 2026.Q1.1.
- `Nexcent Default` Style Book values map one-to-one to the Theme CSS frontend tokens and bind successfully on a clean instance.
- Header, Footer, Navigation, and Newsletter use Liferay OOTB page-building capabilities.
- Master Page, Navigation Menu, and component placement have clean-instance evidence; they are not assumed from source structure.
- Hero, Services, and Features are complete dynamic Custom Elements.
- Community Updates runs as an externally hosted Remote App registered in Liferay.
- No sample business content is hard-coded in TypeScript, JSX, or CSS.
- All landing-page content can be edited or migrated through the accepted Liferay content model.
- Excel import creates or updates records by ERC and does not create duplicates.
- Batch deployment is repeatable and uses a Batch Engine-generated `jsont` contract.
- Deployment reports the state of each Client Extension and exposes partial failure.
- Desktop, tablet, mobile, keyboard, loading, empty, and error states are demonstrated.
- FE and BE evidence is recorded in [`SUBMISSION.md`](SUBMISSION.md).
- The Classic CMS versus Liferay CMS/Spaces decision is recorded in an ADR after the modernization PoC.

## Branches

- `main`: reviewed project source.
- `final`: reserved for a clean-instance verified reference implementation; documentation alone does not qualify it.
- `archive/course-v1`: preserved previous course before the scope reset.

## Rules

- Do not commit `bundles/`, credentials, tokens, or machine-specific paths.
- Do not use numeric environment IDs as frontend configuration.
- Use explicit field references and stable ERC conventions.
- Do not invent Batch Engine configuration blocks; export them from the running target version.
- Do not infer Site Initializer support from a folder name; verify the corresponding initializer path.
- Do not describe source-only work as runtime verified.
- Do not describe multiple Client Extension deployments as atomic.
- Do not introduce unrelated Liferay technologies merely to expand the syllabus.
