# Liferay Training Master Track — Code Lab Kit

This directory is the copy–paste–deploy companion for the Nexcent Master Track roadmap.

The roadmap is **Clarity-aligned where applicable**. It follows official Liferay best practices for topics that match the mini-project, but it does not attempt to reproduce every Clarity exercise or every official learning-path topic.

## Scope rule

```text
Required by Nexcent
→ include the lab
→ follow the official Liferay workflow and terminology

Not required by Nexcent
→ do not add it only for course coverage
→ keep it as optional backlog when useful
```

Required labs currently cover:

- Runtime and Liferay Workspace foundation.
- Site, Pages, Navigation, Master Page, Fragments, assets, Asset Library, taxonomy, Forms, roles, and permissions needed by Nexcent.
- Theme CSS, Style Book, Global CSS/JS, Custom Elements, and Remote App.
- Web Content, Documents and Media, ERC, Headless Delivery, Article Display Pages, and the ZIP-based Excel + image pipeline.
- OSGi, Gogo Shell, Service Builder, REST Builder, and a native Site Administration App for durable Article import jobs.
- Batch Client Extension, QA, and final submission evidence.

Optional future upgrades include Collections, Search Blueprints, Publications, advanced workflow, Objects dashboards, personalization, Commerce, Analytics Cloud, performance labs, and migration to the newer Liferay Headless CMS after its release-feature behavior is validated for the target update.

## Local training identity

The local course instance uses email-address authentication with the `nexcent.com` web ID.

```text
Administrator: admin@nexcent.com
Password:      learn
```

Role-specific users are created during the Practitioner exercise and also use the `@nexcent.com` domain. See [Local Runtime Login](00-local-runtime-login.md).

## Status labels

- **SOURCE READY:** files and commands are present in GitHub.
- **DESIGN READY:** contract and lab sequence are approved, but implementation is not yet complete.
- **RUNTIME PENDING:** the source still requires deployment on a clean Liferay DXP 2026.Q1.1 instance.
- **VERIFIED:** reserved for evidence captured from the target runtime.
- **OPTIONAL BACKLOG:** useful enhancement outside the current submission gate.

The existing modules are **SOURCE READY / RUNTIME PENDING**. The Article pipeline target is **DESIGN READY / IMPLEMENTATION AND RUNTIME QA PENDING**. The current branch has the Service Builder job/row foundation and a transitional multipart-XLSX REST endpoint; ZIP + assets, media-first execution, standard Documents API handoff, and the Site Administration App are not yet complete.

## Lab map

| Track | Lab | Copy source | Build or deploy |
|---|---|---|---|
| Runtime | Nexcent local instance and `@nexcent.com` login | `configs/local/portal-ext.properties` | Run `./gradlew initBundle`, start the server, and sign in as `admin@nexcent.com` |
| Frontend | Theme CSS, Style Book, Global CSS/JS | `client-extensions/nexcent-theme` | `../../gradlew clean build` |
| Frontend | Hero, Services, Features Custom Elements | `client-extensions/nexcent-landing-elements` | `npm ci && npm run build && ../../gradlew clean build` |
| Frontend | Configurable section Fragment | `training/master-track-code-labs/fragments/nexcent-section-wrapper` | ZIP the fragment files and import in Site Menu → Design → Fragments |
| Frontend | Community Remote App | `remote-apps/nexcent-community-app` and `client-extensions/nexcent-remote-app-registration` | Build app, host assets, deploy registration CE |
| Content | Hero and Service preview templates | `training/master-track-code-labs/web-content-templates` | Create Liferay Web Content Templates and paste FreeMarker code |
| Article | Structure, taxonomy, DPT, ZIP package, images, Site Admin App, import, list, and detail | `06-article-pipeline-code-labs.md` | Complete ART-01 through ART-10 and capture runtime evidence |
| Practitioner | Vocabulary, Categories, Tags, and asset classification | `training/master-track-code-labs/sample-data/nexcent-taxonomy.json` | Configure in Site Menu → Categorization and capture runtime evidence |
| Application | OSGi and Gogo Shell | `modules/nexcent-training/nexcent-training-osgi` | `./gradlew :modules:nexcent-training:nexcent-training-osgi:deploy` |
| Application | Service Builder foundation | `modules/nexcent-training/nexcent-training-api` and `nexcent-training-service` | Run `buildService`, then deploy API and service modules |
| Application | REST Builder foundation | `modules/nexcent-training/nexcent-training-rest-api` and `nexcent-training-rest-impl` | Run `buildREST`, then deploy all dependent modules |
| Migration | Article package | `nexcent-article-import.zip` generated from workbook + assets | Upload ZIP to restricted D&M folder → Validate → Execute in Site Menu → Content & Data |
| Migration | Batch Client Extension | `client-extensions/nexcent-training-batch-lab` | Package a version-generated Batch Engine export, then build the CE |

## Documents

1. [Local runtime login and lab identities](00-local-runtime-login.md)
2. [Frontend code labs](01-frontend-code-labs.md)
3. [Content model and FreeMarker labs](02-content-code-labs.md)
4. [OSGi, Service Builder, and REST Builder labs](03-application-code-labs.md)
5. [Batch and migration labs](04-migration-code-labs.md)
6. [Vocabulary, Categories, Tags, and asset classification](05-taxonomy-and-asset-classification.md)
7. [Article pipeline code labs](06-article-pipeline-code-labs.md)

Related contracts:

- [Article solution and detailed design](../architecture/article-content-pipeline.md)
- [Article FE–BE contract](../contracts/article-contract.md)

## Golden path

```text
Create stable content schema and ERCs
    ↓
Build or generate code
    ↓
Deploy to clean Liferay
    ↓
Upload ZIP → create job → Validate → Execute
    ↓
Verify list, Display Page detail, API, and permissions
    ↓
Capture 1440px, 768px, and 375px evidence
```

Do not copy generated numeric IDs into frontend configuration. Use stable Structure identifiers and external reference codes.

The Header/Footer and Article pipelines have independent screenshot gates. No merge occurs until both gates pass. Optional backlog items may be added later without invalidating the completed course.
