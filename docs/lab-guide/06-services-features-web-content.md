# Lab 06 — Model Services and Features Web Content

## Overview

Create reusable Web Content models for the Services grid and alternating Feature sections. The visible section title, descriptions, icons, images, links, order, and variants all come from Liferay content.

## Estimated time

75–100 minutes.

## Prerequisites

- Labs 00–05 are complete.
- The sample assets in `sample-data/assets/` are available.
- You can create Structures, Templates, and Web Content in the course site.

## Part 1: Create the Services Intro Structure

Create:

```text
NXC Services Intro
```

| Label | Field reference | Type | Required |
|---|---|---|---|
| Title | `title` | Text | Yes |
| Description | `description` | Text | Yes |
| Sort Order | `sortOrder` | Numeric or Text | Yes |
| Active | `active` | Boolean | Yes |

Create a FreeMarker Template named `NXC Services Intro Preview`:

```ftl
<header class="nxc-services-intro-preview">
    <h2>${title.getData()}</h2>
    <p>${description.getData()}</p>
</header>
```

Create and publish one article using the values in:

```text
sample-data/csv/services-intro.csv
```

Use this external reference code:

```text
NXC-SERVICES-INTRO-001
```

Separating the intro from the service cards prevents React from hard-coding the section heading while keeping each service independently editable and migration-friendly.

## Part 2: Create the Service Item Structure

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

Use `sample-data/csv/features.csv` and upload:

```text
sample-data/assets/feature-content.svg
sample-data/assets/feature-security.svg
```

Publish both articles.

## Part 4: Verify through Headless Delivery

```bash
curl \
  "$LIFERAY_HOST/o/headless-delivery/v1.0/sites/$LIFERAY_SITE_ID/structured-contents?flatten=true&pageSize=100" \
  --header "Accept: application/json" \
  --request GET \
  --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
```

Verify the response includes:

- One Services Intro article
- Three Service Item articles
- Two Feature Item articles

## Checkpoint

- [ ] `NXC Services Intro` exists and has one published article.
- [ ] `NXC Service Item` exists and has three published articles.
- [ ] `NXC Feature Item` exists and has two published articles.
- [ ] Select values are configured exactly as documented.
- [ ] Field references match the JSON and CSV samples.
- [ ] No visible Services or Features business content must be hard-coded in React.

## Troubleshooting

### A Structure cannot be resolved by the frontend

Check the exact Structure name and its external reference code. The frontend accepts either value but comparisons are case-insensitive only after whitespace is trimmed.

### Images are missing from Headless responses

Publish the article after selecting the Documents and Media asset. Confirm that the Image field reference is `icon` or `image`, not its generated field name.

## Knowledge check

1. Why is the Services intro a separate article instead of repeated in every service row?
2. How does `sortOrder` make migration results deterministic?
3. Why are `imagePosition` and `backgroundVariant` content fields rather than React conditions tied to article IDs?
4. Why should image alt text be stored separately from the asset filename?
