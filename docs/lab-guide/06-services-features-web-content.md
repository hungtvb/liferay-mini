# Lab 06 — Model Services and Features Web Content

## Overview

Create reusable Web Content models for the Services grid and alternating Feature sections. Field references must stay synchronized with the JSON and CSV migration samples.

## Estimated time

60–90 minutes.

## Part 1: Create the Service Item Structure

Create:

```text
NXC Service Item
```

| Label | Field reference | Type | Required |
|---|---|---|---|
| Title | `title` | Text | Yes |
| Description | `descriptionHtml` | HTML | Yes |
| Icon | `icon` | Image | Yes |
| Icon Alt | `iconAlt` | Text | Yes |
| Target URL | `targetUrl` | Text | No |
| Sort Order | `sortOrder` | Numeric or Text | Yes |
| Active | `active` | Boolean | Yes |

Create a FreeMarker Template named `NXC Service Item Preview`:

```ftl
<article class="nxc-service-preview">
    <#if icon.getData()?has_content>
        <img alt="${iconAlt.getData()}" src="${icon.getData()}" />
    </#if>

    <h3>${title.getData()}</h3>
    <div>${descriptionHtml.getData()}</div>

    <#if targetUrl.getData()?has_content>
        <a href="${targetUrl.getData()}">Learn more</a>
    </#if>
</article>
```

## Part 2: Create sample Services

Create and publish:

1. Membership Organisations
2. National Associations
3. Clubs and Groups

Use `sample-data/csv/services.csv` and upload:

```text
sample-data/assets/service-membership.svg
sample-data/assets/service-association.svg
sample-data/assets/service-club.svg
```

## Part 3: Create the Feature Item Structure

Create:

```text
NXC Feature Item
```

| Label | Field reference | Type | Required |
|---|---|---|---|
| Title | `title` | Text | Yes |
| Description | `descriptionHtml` | HTML | Yes |
| Image | `image` | Image | Yes |
| Image Alt | `imageAlt` | Text | Yes |
| CTA Label | `ctaLabel` | Text | No |
| CTA URL | `ctaUrl` | Text | No |
| Image Position | `imagePosition` | Select | Yes |
| Background Variant | `backgroundVariant` | Select | Yes |
| Sort Order | `sortOrder` | Numeric or Text | Yes |
| Active | `active` | Boolean | Yes |

Select values:

```text
imagePosition: left, right
backgroundVariant: white, silver
```

Create `NXC Feature Item Preview`:

```ftl
<section class="nxc-feature-preview nxc-feature-preview--${backgroundVariant.getData()}">
    <img alt="${imageAlt.getData()}" src="${image.getData()}" />

    <div>
        <h2>${title.getData()}</h2>
        <div>${descriptionHtml.getData()}</div>

        <#if ctaLabel.getData()?has_content && ctaUrl.getData()?has_content>
            <a href="${ctaUrl.getData()}">${ctaLabel.getData()}</a>
        </#if>
    </div>
</section>
```

## Part 4: Create sample Features

Use `sample-data/csv/features.csv` and upload:

```text
sample-data/assets/feature-content.svg
sample-data/assets/feature-security.svg
```

Publish both articles.

## Part 5: Verify through Headless Delivery

```bash
curl \
  "$LIFERAY_HOST/o/headless-delivery/v1.0/sites/$LIFERAY_SITE_ID/structured-contents?flatten=true&pageSize=100" \
  --header "Accept: application/json" \
  --request GET \
  --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
```

Verify one Hero, three Services, and two Features are returned.

## Checkpoint

- [ ] `NXC Service Item` exists.
- [ ] Three Service articles are published.
- [ ] `NXC Feature Item` exists.
- [ ] Two Feature articles are published.
- [ ] Select values are configured correctly.
- [ ] Field references match JSON and CSV samples.

## Knowledge check

1. Why should Services be separate articles instead of one large HTML field?
2. How does `sortOrder` help the frontend?
3. Why is `imagePosition` content data rather than CSS hard-coding?
