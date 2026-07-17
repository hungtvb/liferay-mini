# Lab 05 — Model the Hero Web Content

## Overview

Create the first Classic Web Content Structure and Template for the Nexcent Hero component, publish sample content, and inspect it through Headless Delivery.

## Estimated time

45–60 minutes.

## Important 2026 note

Liferay DXP 2026 includes the new object-based Liferay CMS. This exercise intentionally uses Classic Web Content because the project requirement says imported records must appear in **Site Content → Web Content**.

## Step 1: Create the structure

Open:

```text
Site Menu → Site Content → Web Content → Structures
```

Create a structure named:

```text
NXC Landing Hero
```

Add these fields:

| Label | Field reference | Type | Required |
|---|---|---|---|
| Title | `title` | Text | Yes |
| Highlighted Text | `highlightedText` | Text | No |
| Description | `description` | Text | Yes |
| CTA Label | `ctaLabel` | Text | No |
| CTA URL | `ctaUrl` | Text | No |
| Illustration | `illustration` | Image | Yes |
| Illustration Alt | `illustrationAlt` | Text | Yes |
| Sort Order | `sortOrder` | Numeric or Text | Yes |
| Active | `active` | Boolean | Yes |

Set every field reference explicitly in Advanced settings. Field references are API contracts.

## Step 2: Create the preview Template

Create a FreeMarker Template named:

```text
NXC Landing Hero Preview
```

Use this starter snippet:

```ftl
<section class="nxc-hero-preview">
    <div>
        <h1>
            ${title.getData()}
            <span>${highlightedText.getData()}</span>
        </h1>

        <p>${description.getData()}</p>

        <#if ctaLabel.getData()?has_content && ctaUrl.getData()?has_content>
            <a href="${ctaUrl.getData()}">${ctaLabel.getData()}</a>
        </#if>
    </div>

    <#if illustration.getData()?has_content>
        <img
            alt="${illustrationAlt.getData()}"
            src="${illustration.getData()}"
        />
    </#if>
</section>
```

The Template is for editor preview. The final Custom Element renders data returned by the Headless API.

## Step 3: Create sample content

Create an article from `NXC Landing Hero` using:

```text
Display title: Nexcent Hero — Main
Title: Lessons and insights
Highlighted Text: from 8 years
Description: Where to grow your business as a photographer: site or social media?
CTA Label: Register
CTA URL: /register
Illustration Alt: A person working with digital content and analytics
Sort Order: 1
Active: true
```

Upload `sample-data/assets/hero-illustration.svg` for the illustration field.

## Step 4: Find the structure ID

Record the structure ID locally, or list structures through the API:

```bash
curl \
  "$LIFERAY_HOST/o/headless-delivery/v1.0/sites/$LIFERAY_SITE_ID/content-structures" \
  --header "Accept: application/json" \
  --request GET \
  --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
```

## Step 5: Inspect the Hero article

```bash
curl \
  "$LIFERAY_HOST/o/headless-delivery/v1.0/sites/$LIFERAY_SITE_ID/structured-contents?flatten=true" \
  --header "Accept: application/json" \
  --request GET \
  --user "$LIFERAY_USER:$LIFERAY_PASSWORD"
```

Verify the response contains fields like:

```json
{
  "title": "Nexcent Hero — Main",
  "contentStructureId": 12345,
  "contentFields": [
    {
      "name": "title",
      "contentFieldValue": {
        "data": "Lessons and insights"
      }
    }
  ]
}
```

Your numeric IDs will differ.

## Step 6: Compare with migration input

Open:

```text
sample-data/json/landing-content.json
sample-data/csv/heroes.csv
```

Confirm the migration column names match the structure field references.

## Checkpoint

- [ ] `NXC Landing Hero` exists.
- [ ] Field references match the table exactly.
- [ ] The preview Template renders.
- [ ] A Hero article is published.
- [ ] Headless Delivery returns the article.
- [ ] CSV and JSON fields match the Structure.

## Troubleshooting

### A field has a generated API name

Edit the field and set the Advanced Field Reference explicitly.

### Image preview does not render

Confirm the image field contains data. The full image API payload is covered in the asset migration lesson.

### Article does not appear in the API

Confirm the article is published, the site identifier is correct, and the user has permission.

## Knowledge check

1. Why is the field reference more important than the visible label?
2. Why is the FreeMarker Template not used as the React component HTML?
3. Which sample files must remain synchronized with the Structure?
