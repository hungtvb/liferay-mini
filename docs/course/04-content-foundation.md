# 04 — Create Web Content Structures, Templates, Assets, and Sample Data

## Goal

Model all backend-managed landing-page content before FE integration.

## Required Structures

```text
NXC Landing Hero
NXC Clients Intro
NXC Client Logo
NXC Services Intro
NXC Service Item
NXC Feature Item
NXC Statistics Intro
NXC Statistic Item
NXC Testimonial
NXC Community Intro
NXC Community Card
NXC CTA
```

Field-level definitions are maintained in [`../contracts/component-contracts.md`](../contracts/component-contracts.md).

## BE tasks

- Create every Structure with explicit field references.
- Create a FreeMarker preview Template for every editor-facing Structure.
- Use Text, Image, Boolean, Number, Select, Date, and HTML/Rich Text fields according to the contract.
- Upload optimized assets to Documents and Media.
- Assign stable ERCs to content and assets.
- Publish representative sample records.
- Configure guest/read permissions needed by the frontend.

## FE tasks

- Inspect API Explorer schemas.
- Capture valid Headless Delivery responses.
- Build typed mappers from `contentFields` to component view models.
- Identify invalid or missing field behavior before UI implementation.

## Headless verification

```text
GET /o/headless-delivery/v1.0/sites/{site}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{id}/structured-contents
GET /o/headless-delivery/v1.0/sites/{site}/structured-contents?flatten=true
GET /o/headless-delivery/v1.0/sites/{site}/documents
```

Numeric IDs may be inspected locally but are not committed as frontend configuration.

## Sample-data requirements

- One Hero.
- Seven client logos or the amount shown in Figma.
- One Services intro and three services.
- Two reusable Feature articles.
- One Statistics intro and four KPI items.
- At least one Testimonial.
- One Community intro and three cards.
- One CTA.

## Checkpoint

- [ ] Structures and Templates exist.
- [ ] Field references match the contract exactly.
- [ ] Sample content appears in Site Content → Web Content.
- [ ] Images appear in Documents and Media.
- [ ] Headless responses contain all required fields.
- [ ] No FE source change is needed to edit sample content.
