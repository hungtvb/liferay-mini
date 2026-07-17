# Lab 04 — Explore the Site and Headless APIs

## Overview

Identify your Liferay site, inspect REST services in API Explorer, and make your first authenticated requests.

## Estimated time

30–45 minutes.

## Learning objectives

- Find the site ID and external reference code.
- List sites with the Headless Admin Site API.
- List Web Content with the Headless Delivery API.
- Understand local Basic Auth versus production OAuth2.

## Step 1: Open API Explorer

Open:

```text
http://localhost:8080/o/api
```

Find these REST applications:

- Headless Admin Site
- Headless Delivery

## Step 2: Find the site ID in the UI

Open the Site Menu, then go to:

```text
Configuration → Site Settings → Site Configuration
```

Record the site ID, external reference code, and key/name locally. Do not commit an environment-specific numeric site ID.

## Step 3: Prepare local shell variables

macOS or Linux:

```bash
export LIFERAY_HOST="http://localhost:8080"
export LIFERAY_USER="your-admin-email@example.com"
read -s LIFERAY_PASSWORD
```

## Step 4: List sites

```bash
curl \
  "$LIFERAY_HOST/o/headless-admin-site/v1.0/sites" \
  --header "Accept: application/json" \
  --request GET \
  --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
```

Compare `id`, `externalReferenceCode`, `key`, and `name` with the UI.

## Step 5: Store the site identifier

```bash
export LIFERAY_SITE_ID="REPLACE_WITH_YOUR_SITE_ID"
```

In Liferay DXP 2025.Q3+, many endpoints accepting `{siteId}` can also resolve the site key or external reference code. This course starts with the numeric ID for clarity.

## Step 6: List Web Content

```bash
curl \
  "$LIFERAY_HOST/o/headless-delivery/v1.0/sites/$LIFERAY_SITE_ID/structured-contents?flatten=true" \
  --header "Accept: application/json" \
  --request GET \
  --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
```

`flatten=true` includes Web Content stored inside folders.

A new site may return:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalCount": 0
}
```

## Authentication rule

Basic Auth is used only for local learning exercises. Production applications must use OAuth2 or another approved authentication flow.

## Checkpoint

- [ ] API Explorer opens.
- [ ] The site ID and external reference code are recorded locally.
- [ ] The sites endpoint returns HTTP 200.
- [ ] The structured contents endpoint returns HTTP 200.

## Troubleshooting

### HTTP 401

Verify the email and password.

### HTTP 403

The account is authenticated but lacks permission for the resource.

### Empty Web Content response

An empty response is valid before sample Web Content is created.

## Knowledge check

1. Why should numeric site IDs not be committed?
2. What does `flatten=true` change?
3. Why is Basic Auth unsuitable for production?
