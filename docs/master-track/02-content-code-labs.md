# Content Modeling and Template Code Labs

> **Article track:** `NXC Community Card` below remains a landing-page exercise. For the production Article model, Excel import, Headless list, and Display Page detail, use [Article Pipeline Code Labs](06-article-pipeline-code-labs.md).

# Lab C-01 — Create `NXC Landing Hero`

## Step 1 — Create the Structure

Create a Web Content Structure named:

```text
NXC Landing Hero
```

Add the following fields and set each **Field Reference** exactly as shown:

| Label | Field Reference | Type | Required |
|---|---|---|---:|
| Title | `title` | Text | Yes |
| Highlighted Text | `highlightedText` | Text | No |
| Description | `description` | Text | Yes |
| CTA Label | `ctaLabel` | Text | No |
| CTA URL | `ctaUrl` | Text | No |
| CTA Target | `ctaTarget` | Select | No |
| Illustration | `illustration` | Image | Yes |
| Illustration Alt | `illustrationAlt` | Text | Yes |
| Sort Order | `sortOrder` | Number | Yes |
| Active | `active` | Boolean | Yes |

Use these target values for `ctaTarget`:

```text
_self
_blank
```

## Step 2 — Create the Preview Template

Create a Web Content Template named:

```text
NXC Landing Hero Preview
```

Associate it with `NXC Landing Hero`, then copy the complete FreeMarker source from:

```text
training/master-track-code-labs/web-content-templates/nxc-landing-hero.ftl
```

## Step 3 — Create sample content

Use the `hero` object in:

```text
training/master-track-code-labs/sample-data/nexcent-landing.mock.json
```

Create one article and assign this external reference code:

```text
NXC-HERO-001
```

Upload the referenced image to Documents and Media and replace the mock URL with the real selected file.

## Step 4 — Permissions

Grant Guest `View` permission only for content that must render publicly. Do not grant Guest update or permission-management actions.

## Step 5 — Verify Headless Delivery

Use API Explorer or authenticated curl:

```text
GET /o/headless-delivery/v1.0/sites/{siteId}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{structureId}/structured-contents
GET /o/headless-delivery/v1.0/sites/{siteId}/structured-contents?flatten=true
```

Numeric IDs are allowed during local inspection but are not frontend configuration.

## Checkpoint

- The preview template renders escaped text and the selected image.
- Optional CTA fields can be empty without rendering an empty button.
- The Headless response contains every required field reference.
- Editing the article changes the page without rebuilding the Custom Element.

---

# Lab C-02 — Create `NXC Service Item`

## Step 1 — Create the Structure

| Label | Field Reference | Type | Required |
|---|---|---|---:|
| Title | `title` | Text | Yes |
| Description | `description` | Text | Yes |
| Icon | `icon` | Image | Yes |
| Icon Alt | `iconAlt` | Text | No |
| Link Label | `linkLabel` | Text | No |
| Link URL | `linkUrl` | Text | No |
| Sort Order | `sortOrder` | Number | Yes |
| Active | `active` | Boolean | Yes |

## Step 2 — Create the Template

Create `NXC Service Item Preview` and paste:

```text
training/master-track-code-labs/web-content-templates/nxc-service-item.ftl
```

## Step 3 — Create sample records

Use the `services` array in:

```text
training/master-track-code-labs/sample-data/nexcent-landing.mock.json
```

Create three records:

```text
NXC-SERVICE-001
NXC-SERVICE-002
NXC-SERVICE-003
```

Use sort orders `10`, `20`, and `30`.

## Checkpoint

- The three cards render in the expected order.
- Setting one article to `active=false` removes it from the frontend after refresh.
- Adding a fourth article does not require an FE source change.
- Empty link fields do not render an empty anchor.

---

# Lab C-03 — Complete Landing Content Data

Use the rest of:

```text
training/master-track-code-labs/sample-data/nexcent-landing.mock.json
```

Create content for:

```text
NXC Clients Intro
NXC Client Logo
NXC Services Intro
NXC Feature Item
NXC Statistics Intro
NXC Statistic Item
NXC Testimonial
NXC Community Intro
NXC Community Card
NXC CTA
```

Field-level contracts remain in:

```text
docs/contracts/component-contracts.md
```

## Data rules

- All ERCs start with `NXC-`.
- ERCs do not change between environments.
- Lists use `sortOrder` gaps of 10.
- List items contain `active`.
- Images are selected from Documents and Media; mock URLs are not production values.
- Rich text is authored only in fields defined as HTML/Rich Text.

## Final checkpoint

- All required articles appear in Site Content → Web Content.
- All assets appear in Documents and Media.
- Guest can read only published public content.
- Hero, Services, and Features run with live API data.
- Mock data can be disabled without producing hidden hard-coded fallback content.
