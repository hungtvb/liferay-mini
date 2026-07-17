# Generated Batch Payload

Lab 13 generates this file from a live Liferay `jsont` export:

```text
10-structured-content.batch-engine-data.json
```

Do not invent this payload by copying REST responses or by entering numeric IDs manually. Use the export scripts in `scripts/batch/` so the configuration block matches the Batch Engine version running in your local Liferay instance.

Before deployment, the folder must contain at least one file whose name ends with:

```text
.batch-engine-data.json
```

Liferay processes multiple batch files in alphanumeric filename order. Numeric prefixes make dependencies explicit.
