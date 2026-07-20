# Local Course Runtime Fixture

`configs/local` is the Liferay Workspace environment overlay for the local training bundle.

## Important distinction

Running `./gradlew initBundle` does not generate Nexcent business data from the sample JSON files. It copies this environment overlay into the downloaded Liferay bundle.

Therefore, runtime data can appear after `initBundle` only after a completed and verified Liferay environment has been captured here.

## Current status

```text
Runtime fixture: NOT CAPTURED
```

Do not add fake or hand-written HSQL files. Complete the course on a clean DXP 2026.Q1.1 runtime first.

## Capture procedure

After all labs pass:

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

6. Add a reviewed `configs/local/portal-ext.properties` containing only reproducible lab defaults. Do not commit production credentials.
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

The bundle must start with the expected Nexcent site, pages, content, assets, taxonomy, permissions, and deployed application modules.
