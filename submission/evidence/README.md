# Final Submission Evidence

Store only reviewed submission evidence here. Large screenshots may be linked from `SUBMISSION.md`; this folder holds the machine-readable manifest and any small supporting artifacts that belong in Git.

## Required manifest

Copy:

```text
submission/evidence/manifest.template.json
```

to:

```text
submission/evidence/manifest.json
```

Then replace every pending value with runtime evidence from the clean DXP 2026.Q1.1 environment.

## Required evidence groups

- clean `initBundle` and startup;
- Nexcent Site, pages, navigation, Master Page, and Style Book;
- Web Content Structures, Templates, Articles, and stable ERCs;
- Documents and Media plus Asset Library;
- Vocabulary, Categories, and Tags;
- Guest permissions and public rendering;
- Custom Elements with live Headless Delivery data;
- Remote App runtime behavior;
- OSGi/Gogo evidence;
- Service Builder table and business operation;
- REST Builder API called from a Custom Element;
- Excel import first run and idempotent second run;
- generated Batch Engine payload and repeated deployment;
- responsive and accessibility checks;
- all required GitHub Actions checks.

## Naming convention

Use stable, sortable names when a file is committed:

```text
01-clean-startup.txt
02-site-pages.md
03-content-models.md
04-assets-taxonomy.md
05-headless-api.md
06-rest-service-builder.md
07-migration.md
08-responsive-accessibility.md
```

Do not commit credentials, session cookies, CSRF tokens, or personal data in screenshots, API responses, logs, or exported files.
