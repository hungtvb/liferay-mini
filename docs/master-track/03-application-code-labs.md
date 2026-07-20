# Application Developer Code Labs

These labs run on the self-hosted local Liferay DXP bundle. Generate code before compiling Service Builder and REST Builder modules.

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
- typed OSGi configuration;
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

Expected command output resembles:

```text
Nexcent Training Site is active. Portal user count: 2
```

The actual count depends on the runtime.

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

## Files to create

Copy:

```text
modules/nexcent-training/nexcent-training-api/
modules/nexcent-training/nexcent-training-service/
```

The source entity is defined in:

```text
modules/nexcent-training/nexcent-training-service/service.xml
```

The custom business methods are in:

```text
modules/nexcent-training/nexcent-training-service/src/main/java/com/nexcent/training/service/impl/ImportJobLocalServiceImpl.java
```

`ImportJob` stores operational migration status. It does not replace editorial Web Content.

## Generate Service Builder code

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
```

Inspect generated source under both API and service modules. Do not manually edit generated base classes.

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

Check server logs for schema creation or upgrade errors. The generated table uses the `NXC` namespace.

## Checkpoint

- `buildService` generates model, persistence, service, and exception classes.
- API and service bundles are Active.
- No unsatisfied reference remains.
- The `NXC_ImportJob` table is created in the configured database.
- Re-running `buildService` is deterministic and does not overwrite custom code in `ImportJobLocalServiceImpl`.

---

# Lab APP-03 — REST Builder API Calling Service Builder

## Files to create

Copy:

```text
modules/nexcent-training/nexcent-training-rest-api/
modules/nexcent-training/nexcent-training-rest-impl/
```

Contracts:

```text
nexcent-training-rest-impl/rest-config.yaml
nexcent-training-rest-impl/rest-openapi.yaml
```

Implementation:

```text
nexcent-training-rest-impl/src/main/java/com/nexcent/training/rest/internal/resource/v1_0/ImportJobResourceImpl.java
```

## Generate REST Builder source

Run Service Builder first, then REST Builder:

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

POST the same ERC a second time. The Local Service resets the existing record rather than creating a duplicate.

## Checkpoint

- `buildREST` generates DTOs, resources, schemas, and application scaffolding.
- API appears in API Explorer.
- POST persists through Service Builder.
- GET reads the same record.
- Repeating the same ERC does not create duplicate records.
- Invalid or unknown ERC returns an explicit error instead of an empty success response.

## Troubleshooting

### Generated packages are missing

Run both generation tasks again:

```bash
./gradlew :modules:nexcent-training:nexcent-training-service:buildService
./gradlew :modules:nexcent-training:nexcent-training-rest-impl:buildREST
```

### REST implementation bundle is unresolved

```bash
blade sh 'lb | grep "Nexcent Training"'
blade sh 'diag <BUNDLE_ID>'
blade sh 'ds:unsatisfied <BUNDLE_ID>'
```

Confirm the API, Service Builder API, and Service Builder service bundles are Active before the REST implementation.
