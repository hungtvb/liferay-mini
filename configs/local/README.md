# Local Course Runtime Fixture

`configs/local` is the Liferay Workspace environment overlay for the local training bundle.

## Local login defaults

`portal-ext.properties` follows the project-specific login convention used by the Liferay Clarity course environment.

```text
Default virtual instance web ID: nexcent.com
Authentication type:            email address
Administrator email:            admin@nexcent.com
Administrator password:         learn
Administrator screen name:      nexcentadmin
```

The administrator email is composed from:

```properties
default.admin.email.address.prefix=admin
company.default.web.id=nexcent.com
```

The portal properties are applied when Liferay initializes a new database. They do not rename a user already persisted in an existing database.

All additional lab users must also use the `@nexcent.com` domain and are created during the Users, Roles, and Permissions exercise rather than being silently seeded:

```text
site.manager@nexcent.com
content.author@nexcent.com
content.reviewer@nexcent.com
```

See [`../../docs/master-track/00-local-runtime-login.md`](../../docs/master-track/00-local-runtime-login.md).

## Important distinction

Running `./gradlew initBundle` does not generate Nexcent business data from the sample JSON files. It copies this environment overlay into the downloaded Liferay bundle.

Therefore, runtime data can appear after `initBundle` only after a completed and verified Liferay environment has been captured here.

The local `portal-ext.properties` can bootstrap the default virtual instance and administrator on an empty database, but it does not create the Nexcent Site, pages, content, assets, taxonomy, or application data.

## Current status

```text
Local portal defaults: CONFIGURED
Runtime fixture:       NOT CAPTURED
```

Do not add fake or hand-written HSQL files. Complete the course on a clean DXP 2026.Q1.1 runtime first.

## Capture procedure

After all required Nexcent labs pass:

1. Stop Liferay cleanly.
2. Confirm no Java process is writing to the database or document store.
3. Remove runtime-only logs, temporary files, lock files, search indexes, caches, and secrets.
4. Copy the embedded database:

```bash
mkdir -p configs/local/data
cp -R bundles/data/hypersonic configs/local/data/
```

5. Copy the matching Documents and Media binary store:

```bash
cp -R bundles/data/document_library configs/local/data/
```

6. Review `configs/local/portal-ext.properties` and keep only reproducible local lab defaults. Do not commit production credentials.
7. Run the final submission verifier.
8. Delete `bundles/` and run a clean-clone acceptance test before marking the submission ready.

## Required synchronization rule

The database and document library are one fixture:

```text
configs/local/data/hypersonic
+
configs/local/data/document_library
```

Never update or commit only one side. The database contains file metadata while `document_library` contains the file binaries.

## Do not commit

- `logs/`
- `work/`
- `temp/`
- lock files
- Elasticsearch/OpenSearch indexes
- production JDBC passwords
- OAuth secrets or access tokens
- personal accounts or personal content

## Final acceptance

From a clean checkout of `final`:

```bash
./gradlew initBundle
blade server run
```

The bundle must start with the expected `admin@nexcent.com` login and the captured Nexcent site, pages, content, assets, taxonomy, permissions, and deployed application modules.
