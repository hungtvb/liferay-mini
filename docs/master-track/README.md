# Liferay Training Master Track — Code Lab Kit

This directory is the copy–paste–deploy companion for the official Master Track roadmap.

## Status labels

- **SOURCE READY:** files and commands are present in GitHub.
- **RUNTIME PENDING:** the source still requires deployment on a clean Liferay DXP 2026.Q1.1 instance.
- **VERIFIED:** reserved for evidence captured from the target runtime.

The modules in this kit are **SOURCE READY / RUNTIME PENDING**.

## Lab map

| Track | Lab | Copy source | Build or deploy |
|---|---|---|---|
| Frontend | Theme CSS, Style Book, Global CSS/JS | `client-extensions/nexcent-theme` | `../../gradlew clean build` |
| Frontend | Hero, Services, Features Custom Elements | `client-extensions/nexcent-landing-elements` | `npm ci && npm run build && ../../gradlew clean build` |
| Frontend | Configurable section Fragment | `training/master-track-code-labs/fragments/nexcent-section-wrapper` | ZIP the fragment files and import in Site Menu → Design → Fragments |
| Frontend | Community Remote App | `remote-apps/nexcent-community-app` and `client-extensions/nexcent-remote-app-registration` | Build app, host assets, deploy registration CE |
| Content | Hero and Service preview templates | `training/master-track-code-labs/web-content-templates` | Create Liferay Web Content Templates and paste FreeMarker code |
| Application | OSGi and Gogo Shell | `modules/nexcent-training/nexcent-training-osgi` | `./gradlew :modules:nexcent-training:nexcent-training-osgi:deploy` |
| Application | Service Builder | `modules/nexcent-training/nexcent-training-api` and `nexcent-training-service` | Run `buildService`, then deploy API and service modules |
| Application | REST Builder | `modules/nexcent-training/nexcent-training-rest-api` and `nexcent-training-rest-impl` | Run `buildREST`, then deploy all dependent modules |
| Migration | Batch Client Extension | `client-extensions/nexcent-training-batch-lab` | Package a version-generated Batch Engine export, then build the CE |
| Migration | Sample content | `training/master-track-code-labs/sample-data` | Use mock JSON first; use CSV as the Excel import source |

## Documents

1. [Frontend code labs](01-frontend-code-labs.md)
2. [Content model and FreeMarker labs](02-content-code-labs.md)
3. [OSGi, Service Builder, and REST Builder labs](03-application-code-labs.md)
4. [Batch and migration labs](04-migration-code-labs.md)

## Golden path

```text
Copy source
    ↓
Build or generate code
    ↓
Deploy to clean Liferay
    ↓
Verify in UI / Gogo / API Explorer
    ↓
Capture evidence
```

Do not copy generated numeric IDs into frontend configuration. Use stable Structure identifiers and external reference codes.
