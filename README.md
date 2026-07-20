# Nexcent Liferay Training Master Track

Build the Nexcent landing page on **Liferay DXP 2026.Q1.1 LTS** using the official Liferay learning paths and Clarity course labs as best-practice references where they match the project scope:

1. [Practitioner](https://learn.liferay.com/learning-path/practitioner)
2. [Frontend Developer](https://learn.liferay.com/learning-path/frontend-developer)
3. [Liferay Application Developer](https://learn.liferay.com/learning-path/liferay-application-developer)

This is not a full reproduction of the Clarity course. The project adopts the official workflow, terminology, and recommended Liferay implementation for overlapping topics, while keeping the curriculum focused on the Nexcent mini-project requirements.

The project combines site administration, modern frontend development, content modeling, OSGi, Service Builder, REST Builder, API integration, Excel import, and Batch Client Extensions.

Public frontend preview: `https://nexcent-liferay-static.vercel.app`

## Source of truth

- Training roadmap: [`docs/master-track/README.md`](docs/master-track/README.md)
- Copy–paste frontend labs: [`docs/master-track/01-frontend-code-labs.md`](docs/master-track/01-frontend-code-labs.md)
- Content and FreeMarker labs: [`docs/master-track/02-content-code-labs.md`](docs/master-track/02-content-code-labs.md)
- OSGi, Service Builder, and REST Builder labs: [`docs/master-track/03-application-code-labs.md`](docs/master-track/03-application-code-labs.md)
- Migration labs: [`docs/master-track/04-migration-code-labs.md`](docs/master-track/04-migration-code-labs.md)
- FE–BE field contracts: [`docs/contracts/component-contracts.md`](docs/contracts/component-contracts.md)
- Theme source: [`client-extensions/nexcent-theme`](client-extensions/nexcent-theme)
- Application lab source: [`modules/nexcent-training`](modules/nexcent-training)
- Copyable training assets: [`training/master-track-code-labs`](training/master-track-code-labs)
- 2026.Q1 architecture audit: [`docs/architecture/liferay-2026-q1-audit.md`](docs/architecture/liferay-2026-q1-audit.md)
- Previous delivery-oriented course: [`archive/course-v1`](https://github.com/hungtvb/liferay-mini/tree/archive/course-v1)

## Scope alignment

Use the following decision rule when adapting official Liferay or Clarity labs:

```text
Topic matches a Nexcent requirement
→ follow the official Liferay flow and best practice

Topic does not match the current project
→ keep it out of the required curriculum
→ record it as an optional future enhancement when useful
```

Current required scope includes:

- Workspace, `initBundle`, clean runtime, and API Explorer.
- Sites, pages, navigation, Master Pages, Fragments, assets, Asset Library, taxonomy, Forms, roles, and permissions required by the Nexcent flow.
- Theme CSS, Style Books, Global CSS/JS, favicon, Custom Elements, and Remote App.
- Web Content Structures, Templates, ERCs, Documents and Media, and Headless Delivery.
- OSGi, Gogo Shell, Service Builder, and REST Builder BFF for the `ImportJob` business flow.
- Excel import, Batch Client Extension, integration QA, and final runtime evidence.

Collections, Search Blueprints, Publications, advanced workflow, Objects dashboards, personalization, Commerce, Analytics Cloud, and performance labs are optional future upgrades. They do not block the current course or the `final` submission.

## Learning principles

- Use Liferay OOTB and low-code capabilities before custom code.
- Use Content Pages, Master Pages, Fragments, Navigation Menus, Documents and Media, Asset Libraries, Forms, and permissions in the Practitioner track.
- Use Theme CSS, Style Books, Global CSS/JS, Custom Elements, and Remote Apps for modern frontend delivery.
- Keep editorial landing content in Web Content or the accepted CMS model.
- Use Service Builder for operational or business persistence, not as a replacement for editorial CMS content.
- Use REST Builder when existing Headless APIs are insufficient or a BFF/orchestration layer is required.
- Never commit environment-specific numeric IDs as frontend configuration.
- Use stable Structure identifiers and external reference codes.

## Delivery architecture

```text
Figma Design
      ↓
Theme CSS + Frontend Tokens + Style Book
      ↓
Master Page + Fragments + Navigation + Forms
      ↓
Custom Elements + Remote App
      ↓
Headless Delivery / Objects / REST Builder BFF
      ↓
Web Content + Documents and Media + Service Builder
      ↓
Database

Excel / Batch Engine export
      ↓
Importer + Batch Client Extension
      ↓
Assets + Web Content + ImportJob status
```

## Repository structure

```text
liferay-mini/
├── client-extensions/
│   ├── nexcent-content-batch/
│   ├── nexcent-landing-elements/
│   ├── nexcent-remote-app-registration/
│   ├── nexcent-theme/
│   └── nexcent-training-batch-lab/
├── modules/
│   └── nexcent-training/
│       ├── nexcent-training-api/
│       ├── nexcent-training-service/
│       ├── nexcent-training-osgi/
│       ├── nexcent-training-rest-api/
│       └── nexcent-training-rest-impl/
├── remote-apps/
│   └── nexcent-community-app/
├── prototypes/
│   └── nexcent-static/
├── training/
│   └── master-track-code-labs/
│       ├── fragments/
│       ├── sample-data/
│       ├── scripts/
│       └── web-content-templates/
├── docs/
│   ├── architecture/
│   ├── contracts/
│   ├── course/
│   ├── master-track/
│   └── tasks/
├── sample-data/
├── scripts/
└── SUBMISSION.md
```

## Local environment

Required:

- Git
- Java 21
- Node.js 22+
- Blade CLI for local Gogo commands and server management

Initialize and start the bundle:

```bash
./scripts/bootstrap-workspace.sh
./gradlew initBundle
blade server run
```

Open:

```text
Portal:       http://localhost:8080
API Explorer: http://localhost:8080/o/api
```

## Code generation and build

Generate Service Builder source:

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
```

Generate REST Builder source:

```bash
./gradlew :modules:nexcent-training:nexcent-training-rest-impl:buildREST
```

Build the training modules:

```bash
./gradlew \
  :modules:nexcent-training:nexcent-training-osgi:build \
  :modules:nexcent-training:nexcent-training-api:build \
  :modules:nexcent-training:nexcent-training-service:build \
  :modules:nexcent-training:nexcent-training-rest-api:build \
  :modules:nexcent-training:nexcent-training-rest-impl:build
```

Validate the code lab kit and data contracts:

```bash
node training/master-track-code-labs/scripts/validate-lab-kit.mjs
```

## Execution order

1. Runtime foundation.
2. Practitioner site, pages, navigation, assets, Asset Library, Forms, roles, and permissions required by Nexcent.
3. Theme CSS, Style Book, Master Page, and OOTB header/footer.
4. Fragments and configurable wrappers.
5. Hero, Services, and Features Custom Elements with mock data.
6. Web Content Structures, Templates, assets, permissions, and live Headless integration.
7. Community Remote App.
8. OSGi and Gogo Shell.
9. Service Builder.
10. REST Builder BFF.
11. Excel importer and Batch Client Extension.
12. Integration QA and final demonstration.

## Evidence labels

- **VERIFIED:** confirmed by official documentation and clean target-runtime evidence.
- **SOURCE READY / RUNTIME PENDING:** source and instructions exist but runtime proof is incomplete.
- **POC REQUIRED:** architecture is plausible but needs controlled runtime evidence.
- **OUT OF SCOPE:** intentionally excluded by an explicit decision.

Source code alone is not runtime verification.

## Branches

- `main`: reviewed project source and course development history.
- `final`: the course submission branch; it may be updated throughout the course but is not submission-ready until `submission/READY` exists.
- `archive/course-v1`: preserved course before the Master Track realignment.
- `archive/final-pre-master-track-20260720`: preserved pre-Master-Track `final` state.

See [`FINAL-SUBMISSION.md`](FINAL-SUBMISSION.md) for the submission lifecycle and runtime fixture requirements.

## Rules

- Do not commit `bundles/`, credentials, tokens, generated secrets, or environment-specific numeric IDs.
- Do not hard-code business content in TypeScript, JSX, CSS, or Java.
- Keep Header, Footer, Navigation, mobile collapse, and Forms on supported Liferay OOTB paths unless an accepted business requirement proves otherwise.
- Follow official Liferay best practices for topics that overlap with the current Nexcent scope.
- Build and review changes through a feature branch and pull request.