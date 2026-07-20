# Final Submission Branch

This file defines the contract for the `final` branch.

## Purpose

`final` is the course submission branch. It must contain both:

1. the reviewed project source; and
2. the clean-runtime evidence and local course fixture produced after every required lab has been completed on Liferay DXP 2026.Q1.1 LTS.

The branch may exist while the course is still in progress, but it is not considered submission-ready until `submission/READY` is committed.

## Current status

```text
SOURCE READY
RUNTIME PENDING
SUBMISSION NOT READY
```

The current branch contains the source, code labs, sample contracts, and CI checks. It does not yet contain a verified HSQL database snapshot, Documents and Media file store, generated Batch Engine payloads, or complete runtime evidence.

## Branch lifecycle

```text
main / feature branches
        ↓
reviewed source and labs
        ↓
final
        ↓
complete all labs on a clean bundle
        ↓
capture runtime evidence
        ↓
snapshot configs/local/data
        ↓
complete SUBMISSION.md
        ↓
add submission/READY
        ↓
submission-ready final branch
```

## Required completion flow

1. Checkout `final`.
2. Remove any previous local bundle.
3. Run `./gradlew initBundle`.
4. Start Liferay DXP 2026.Q1.1 LTS with Java 21.
5. Complete every Practitioner, Frontend Developer, Application Developer, content, migration, and integration lab.
6. Verify the public Nexcent site as Guest and as an administrator.
7. Verify Custom Element → REST Builder → Service Builder persistence.
8. Generate Batch Engine exports from the same runtime version.
9. Complete all runtime placeholders in `SUBMISSION.md`.
10. Stop Liferay cleanly.
11. Copy the verified local runtime fixture into `configs/local` as documented in `configs/local/README.md`.
12. Fill `submission/evidence/manifest.json` using the template.
13. Run `node scripts/verify-final-submission.mjs`.
14. Create `submission/READY` only after every readiness check passes.
15. Re-run the clean-clone acceptance test.

## Submission-ready contents

The finished branch must include:

- all reviewed Client Extensions and Java modules;
- completed `SUBMISSION.md` with no placeholder values;
- `configs/local/portal-ext.properties` for the reproducible local lab environment;
- `configs/local/data/hypersonic/` from the verified stopped runtime;
- `configs/local/data/document_library/` matching the database snapshot;
- generated `*.batch-engine-data.json` payloads from DXP 2026.Q1.1;
- `submission/evidence/manifest.json` with every required check marked `PASS`;
- `submission/READY` as the explicit release switch.

## Clean-clone acceptance test

The final proof is not the existing developer bundle. Test from a fresh checkout:

```bash
git clone https://github.com/hungtvb/liferay-mini.git
cd liferay-mini
git checkout final
./gradlew initBundle
blade server run
```

Expected result:

```text
Liferay starts without the setup wizard
→ the Nexcent Training Site exists
→ pages, navigation, Web Content, assets, taxonomy, and permissions exist
→ the landing page renders with live Liferay data
→ Service Builder and REST Builder modules are available
→ the submission evidence matches the runtime
```

## Data safety rules

Do not commit:

- production credentials or API tokens;
- external database passwords;
- server logs, temporary files, lock files, or search indexes;
- personal user accounts;
- a database snapshot without its matching `document_library`;
- runtime claims that were only verified in the static preview.

## Readiness switch

`submission/READY` is intentionally absent while the project is incomplete. Once it exists, Final Submission CI changes from scaffold validation to strict runtime-package validation.
