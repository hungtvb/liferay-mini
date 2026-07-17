# Lab 08 — Build the Shared Headless API Client

## Overview

Create a reusable API layer for all landing-page components. The client resolves the current site at runtime, calls Liferay through the signed-in browser session, resolves Web Content Structures, and converts `contentFields` into typed values.

## Estimated time

60–75 minutes.

## Learning objectives

- Avoid hard-coded numeric site and Structure IDs.
- Add same-origin credentials and the Liferay CSRF token.
- Handle non-success HTTP responses consistently.
- Resolve a Structure by name or external reference code.
- Parse text, number, boolean, and image fields.

## Step 1: Inspect the shared files

```text
src/
├── api/
│   ├── http.ts
│   └── structuredContent.ts
└── liferay/
    └── global.ts
```

## Step 2: Resolve the current site

```ts
export function getSiteId(): string {
    const siteId = getLiferay()?.ThemeDisplay?.getScopeGroupId?.();

    if (siteId === undefined || siteId === null || siteId === '') {
        throw new Error('Unable to resolve the current Liferay site.');
    }

    return String(siteId);
}
```

## Step 3: Create the authenticated HTTP helper

```ts
export async function portalFetch<T>(
    path: string,
    init: RequestInit = {}
): Promise<T> {
    const headers = new Headers(init.headers);
    const authToken = getLiferay()?.authToken;

    headers.set('Accept', 'application/json');

    if (authToken) {
        headers.set('x-csrf-token', authToken);
    }

    const response = await fetch(new URL(path, window.location.origin), {
        credentials: 'same-origin',
        ...init,
        headers,
    });

    if (!response.ok) {
        throw new ApiError(
            `Liferay API request failed with HTTP ${response.status}.`,
            response.status,
            await response.text()
        );
    }

    return (await response.json()) as T;
}
```

Never embed local usernames or passwords in frontend code.

## Step 4: Resolve a Structure

```ts
const heroStructure = await resolveContentStructure(
    siteId,
    'NXC Landing Hero'
);
```

The resolver accepts the Structure name or external reference code and discovers the numeric ID at runtime.

## Step 5: Load Structure-scoped content

```ts
const items = await listStructuredContents(heroStructure.id);
```

Endpoint:

```text
/o/headless-delivery/v1.0/content-structures/{contentStructureId}/structured-contents?flatten=true&pageSize=100
```

## Step 6: Parse contentFields

```ts
const fields = flattenContentFields(item.contentFields);
const title = readText(fields, 'title');
const active = readBoolean(fields, 'active');
const sortOrder = readNumber(fields, 'sortOrder');
const image = readImage(fields, 'illustration');
```

Use field references, not translated labels.

## Step 7: Verify from the widget

```bash
yarn build
../../gradlew clean deploy
```

Expected states:

- `Checking…` while loading.
- `N structure(s)` after success.
- A visible error message after a failed request.

## Step 8: Check for committed credentials

```bash
git grep -n "password\|Basic " -- client-extensions
```

Review every match.

## Checkpoint

- [ ] Site ID comes from `ThemeDisplay`.
- [ ] Requests use same-origin credentials.
- [ ] CSRF token support is centralized.
- [ ] HTTP errors use `ApiError`.
- [ ] Structure IDs are resolved at runtime.
- [ ] Parsers handle text, number, boolean, and image.
- [ ] The status widget reports the Structure count.

## Troubleshooting

### HTTP 401 or 403

Confirm the user is signed in and has content permission.

### Structure count is zero

Confirm the page and Structures belong to the same site.

### Structure cannot be resolved

Compare the exact name and external reference code returned by the API.

## Knowledge check

1. Why are Structure IDs resolved at runtime?
2. What does `credentials: 'same-origin'` do?
3. Why should field parsing live outside React components?
