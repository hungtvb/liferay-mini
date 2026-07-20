# Application Developer Code Labs

> **Source status:** CI VERIFIED / RUNTIME PENDING
>
> The repository contains the complete generated Service Builder source. Learners copy the full modules, regenerate to verify the contract, and deploy. They do not start from an empty hand-made Service Builder module.

These labs run on the self-hosted Liferay DXP 2026.Q1.1 bundle.

---

# Lab APP-01 — OSGi `@Component`, `@Reference`, Configuration, and Gogo

## Files to create

Copy this directory exactly:

```text
modules/nexcent-training/nexcent-training-osgi/
```

Important source files:

```text
build.gradle
bnd.bnd
src/main/java/com/nexcent/training/osgi/configuration/NexcentTrainingConfiguration.java
src/main/java/com/nexcent/training/osgi/internal/NexcentTrainingStatusComponent.java
```

The component demonstrates:

- immediate Declarative Services activation;
- `@Reference` injection of `UserLocalService`;
- typed OSGi configuration with `Meta.OCD` and `ConfigurableUtil`;
- `@Activate` and `@Modified`;
- a Gogo command named `nexcent:status`.

## Build and deploy

```bash
./gradlew :modules:nexcent-training:nexcent-training-osgi:clean \
    :modules:nexcent-training:nexcent-training-osgi:deploy
```

## Verify in Gogo Shell

```bash
blade sh 'lb | grep "Nexcent Training OSGi"'
```

Copy the bundle ID, then run:

```bash
blade sh 'scr:list <BUNDLE_ID>'
blade sh 'ds:unsatisfied <BUNDLE_ID>'
blade sh 'nexcent:status'
```

Expected output resembles:

```text
Nexcent Training Site is active. Portal user count: 2
```

The actual user count depends on the runtime.

## Update configuration

Open:

```text
Global Menu
→ Control Panel
→ System Settings
→ Platform
→ Nexcent Training Configuration
```

Change `Site Label`, save, and run `nexcent:status` again. This verifies the `@Modified` lifecycle.

## Checkpoint

- Bundle state is Active.
- `ds:unsatisfied` returns no unresolved component for this bundle.
- `nexcent:status` executes.
- A configuration update changes the returned label without rebuilding the module.

---

# Lab APP-02 — Service Builder Persistence

## Copy the complete modules

Copy both directories, including their generated source:

```text
modules/nexcent-training/nexcent-training-api/
modules/nexcent-training/nexcent-training-service/
```

The entity contract is:

```text
modules/nexcent-training/nexcent-training-service/service.xml
```

The custom implementation is:

```text
modules/nexcent-training/nexcent-training-service/
└── src/main/java/com/nexcent/training/service/impl/
    └── ImportJobLocalServiceImpl.java
```

`ImportJob` stores operational migration status. Editorial landing content remains in Web Content.

## Persistence contract

The public REST/import contract calls the stable value `externalReferenceCode`. The operational table stores that value in `jobKey` and enforces uniqueness with the `JK_G` finder:

```text
jobKey + groupId → one ImportJob
```

This keeps repeat imports idempotent without using an environment-specific numeric identifier.

## Regenerate and verify

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
```

The task regenerates model, persistence, local-service, table, SQL, and exception source from `service.xml` while preserving custom code in:

```text
ImportJobImpl.java
ImportJobLocalServiceImpl.java
```

Do not edit generated base, persistence, util, wrapper, table, or model-interface files manually.

## Compile

```bash
./gradlew \
    :modules:nexcent-training:nexcent-training-api:build \
    :modules:nexcent-training:nexcent-training-service:build
```

## Deploy in dependency order

```bash
./gradlew \
    :modules:nexcent-training:nexcent-training-api:deploy \
    :modules:nexcent-training:nexcent-training-service:deploy
```

## Verify

```bash
blade sh 'lb | grep "Nexcent Training"'
blade sh 'ds:unsatisfied'
```

Check the server log for schema creation or upgrade errors. The generated table is:

```text
NXC_ImportJob
```

## Important first-generation rule

For this course, copy the complete modules from GitHub. Do not delete all generated source and reconstruct the project as an empty folder before running `buildService`.

When creating a different Service Builder project from scratch, generate the official project scaffold with Blade/Liferay Workspace first, then edit `service.xml`. The complete scaffold gives the generator the custom model and local-service extension points it expects.

## Checkpoint

- `buildService` completes without modifying custom implementation logic.
- API and service modules compile.
- API and service bundles are Active after deployment.
- No unsatisfied reference remains.
- `NXC_ImportJob` is created in the configured database.
- Repeating the same `jobKey` within a site updates one operational job instead of creating a duplicate.

---

# Lab APP-03 — REST Builder API Calling Service Builder

## Copy the complete modules

```text
modules/nexcent-training/nexcent-training-rest-api/
modules/nexcent-training/nexcent-training-rest-impl/
```

Contracts:

```text
modules/nexcent-training/nexcent-training-rest-impl/rest-config.yaml
modules/nexcent-training/nexcent-training-rest-impl/rest-openapi.yaml
```

Custom resource implementation:

```text
modules/nexcent-training/nexcent-training-rest-impl/
└── src/main/java/com/nexcent/training/rest/internal/resource/v1_0/
    └── ImportJobResourceImpl.java
```

## Generate source

Run Service Builder first because the REST implementation depends on its API, then run REST Builder:

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
./gradlew :modules:nexcent-training:nexcent-training-rest-impl:buildREST
```

## Compile all dependencies

```bash
./gradlew \
    :modules:nexcent-training:nexcent-training-api:build \
    :modules:nexcent-training:nexcent-training-service:build \
    :modules:nexcent-training:nexcent-training-rest-api:build \
    :modules:nexcent-training:nexcent-training-rest-impl:build
```

## Deploy

```bash
./gradlew \
    :modules:nexcent-training:nexcent-training-api:deploy \
    :modules:nexcent-training:nexcent-training-service:deploy \
    :modules:nexcent-training:nexcent-training-rest-api:deploy \
    :modules:nexcent-training:nexcent-training-rest-impl:deploy
```

## Verify API Explorer

Open:

```text
http://localhost:8080/o/api
```

Find `Liferay.Nexcent.Training` and test:

```text
POST /o/nexcent-training/v1.0/sites/{siteId}/import-jobs
GET  /o/nexcent-training/v1.0/sites/{siteId}/import-jobs/{externalReferenceCode}
```

Sample request:

```json
{
  "externalReferenceCode": "NXC-IMPORT-20260720-001",
  "fileName": "community-articles.xlsx",
  "totalRows": 3
}
```

Authenticated curl example:

```bash
curl \
  --user '<ADMIN_EMAIL>:<PASSWORD>' \
  --header 'Content-Type: application/json' \
  --request POST \
  --data '{"externalReferenceCode":"NXC-IMPORT-20260720-001","fileName":"community-articles.xlsx","totalRows":3}' \
  'http://localhost:8080/o/nexcent-training/v1.0/sites/<SITE_ID>/import-jobs'
```

Read the record back:

```bash
curl \
  --user '<ADMIN_EMAIL>:<PASSWORD>' \
  'http://localhost:8080/o/nexcent-training/v1.0/sites/<SITE_ID>/import-jobs/NXC-IMPORT-20260720-001'
```

## Idempotency exercise

POST the same external reference code a second time. The REST resource passes it to `ImportJobLocalService`, which maps it to the internal `jobKey` and resets the existing record rather than inserting a duplicate.

## Checkpoint

- `buildREST` completes.
- API, service, REST API, and REST implementation modules compile.
- API appears in API Explorer after deployment.
- POST persists through Service Builder.
- GET reads the same operational record.
- Repeating the same external reference code does not create a duplicate.
- Unknown keys return an explicit not-found response.

## Troubleshooting

### Generated packages are missing

Confirm that the complete API and implementation modules were copied from GitHub, then run:

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
./gradlew :modules:nexcent-training:nexcent-training-rest-impl:buildREST
```

### A bundle is unresolved

```bash
blade sh 'lb | grep "Nexcent Training"'
blade sh 'diag <BUNDLE_ID>'
blade sh 'ds:unsatisfied <BUNDLE_ID>'
```

Confirm this activation order:

```text
Nexcent Training API
→ Nexcent Training Service
→ Nexcent Training REST API
→ Nexcent Training REST Impl
```
