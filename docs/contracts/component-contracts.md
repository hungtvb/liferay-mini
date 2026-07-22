# Component-by-Component FE–BE Contracts

This document is the implementation contract between frontend and backend for the Nexcent Figma landing page.

Each component defines:

- Figma responsibility.
- Frontend implementation.
- Backend/content implementation.
- Stable data contract.
- Liferay capability selection.
- Acceptance criteria.

## Shared conventions

### External reference codes

```text
NXC-HERO-001
NXC-CLIENT-001
NXC-SERVICES-INTRO-001
NXC-SERVICE-001
NXC-FEATURE-001
NXC-STATS-INTRO-001
NXC-STAT-001
NXC-TESTIMONIAL-001
NXC-COMMUNITY-INTRO-001
NXC-COMMUNITY-001
NXC-CTA-001
```

Rules:

- ERCs are stable across imports.
- Titles are editorial labels and do not replace ERCs.
- Frontend never stores numeric environment IDs.
- Lists are ordered by `sortOrder` and filtered by `active`.

### Media contract

```ts
type MediaValue = {
    alt: string;
    contentType?: string;
    externalReferenceCode?: string;
    title?: string;
    url: string;
};
```

### Link contract

```ts
type LinkValue = {
    label: string;
    target?: '_blank' | '_self';
    url: string;
};
```

### Component state contract

Every dynamic frontend component must support:

```text
loading
ready
empty
error
```

The component must not substitute missing backend content with hard-coded business content.

---

# 1. Style Guide and Design Foundation

## Figma source

The Figma file includes detailed specifications for:

- Neutral, primary, secondary, information, action, shade, and tint colors.
- Headline and body typography.
- Primary, secondary, tertiary, icon, and link button states.
- Shadows and effects.
- Directional and user-interface icons.
- Container and spacing examples.

## FE responsibility

- Implement Theme CSS Client Extension.
- Map editor-facing design values to frontend tokens.
- Build `Nexcent Default` Style Book.
- Build Global CSS aliases and shared component foundations.
- Build Global JavaScript portal utilities.
- Keep section-specific layout inside component styles.

## BE/Liferay responsibility

- Define which tokens editors may change.
- Publish and apply the Style Book.
- Keep production defaults aligned with Figma.
- Restrict editor changes that would break accessibility or layout.

## Token categories

```text
Nexcent Brand
├── Primary
├── Primary hover
├── Primary active
├── Heading
├── Body text
├── Muted text
├── Surface
├── Border
└── White

Nexcent Typography
├── Font family
├── H1
├── H2
├── H3
├── Body regular
└── Body medium

Nexcent Layout
├── Container width
├── Section spacing
├── Small radius
├── Card radius
└── Card shadow
```

## Runtime alias example

```css
:root {
    --nxc-color-primary: var(--nxc-style-primary, #4caf4f);
    --nxc-color-heading: var(--nxc-style-heading, #263238);
    --nxc-container-width: var(--nxc-style-container-width, 72rem);
    --nxc-radius-card: var(--nxc-style-radius-card, 0.75rem);
}
```

## Liferay solution

```text
Theme CSS + Frontend Token Definition + Style Book + Global CSS/JS
```

## Acceptance

- Token changes can be demonstrated without rebuilding React.
- Component source consumes stable aliases.
- Focus states and contrast remain accessible.

---

# 2. Header and Navigation

## Figma anatomy

- Nexcent logo.
- Main navigation links.
- Login action.
- Sign-up or primary CTA.
- Desktop and mobile navigation behavior.

## FE responsibility

- Implement responsive navigation in a Master Page or Fragment.
- Render Liferay navigation instead of a hard-coded link array.
- Implement mobile open/close, keyboard escape, focus return, and visible focus.
- Use site branding for the logo.
- Use Global CSS button and link variants.

## BE/Liferay responsibility

- Create site pages and friendly URLs.
- Configure the Navigation Menu and page order.
- Configure site logo.
- Provide optional header CTA settings only when the CTA is not represented by a page.

## Optional settings model

```text
NXC Site Settings
├── headerCtaLabel: Text
├── headerCtaUrl: Text
└── headerCtaTarget: Select
```

## Data contract

```ts
type NavigationItem = {
    active: boolean;
    children?: NavigationItem[];
    label: string;
    url: string;
};
```

## Liferay solution

```text
Master Page or Fragment + Navigation Menu + Site Branding
```

## Acceptance

- Navigation labels and URLs are not hard-coded in React.
- Mobile menu is keyboard accessible.
- Current page state is visually identified.

---

# 3. Hero

## Figma anatomy

- Main heading.
- Green highlighted text.
- Supporting copy.
- Primary CTA.
- Illustration.
- Two-column desktop layout and stacked mobile layout.

## FE responsibility

- Implement `nexcent-hero` Custom Element.
- Resolve the Structure by stable identifier/ERC, not numeric ID.
- Map Headless Delivery fields into a typed view model.
- Implement loading, empty, error, missing CTA, and broken image behavior.
- Match desktop, tablet, and mobile layouts.

## BE responsibility

Structure: `NXC Landing Hero`

| Field reference | Type | Required | FE usage |
|---|---|---:|---|
| `title` | Text | Yes | Main heading |
| `highlightedText` | Text | No | Green highlighted line |
| `description` | Text | Yes | Supporting copy |
| `ctaLabel` | Text | No | CTA label |
| `ctaUrl` | Text | No | CTA URL |
| `ctaTarget` | Select | No | Link target |
| `illustration` | Image | Yes | Hero media |
| `illustrationAlt` | Text | Yes | Accessible alt text |
| `sortOrder` | Number | Yes | Selection/order |
| `active` | Boolean | Yes | Visibility |

Template: `NXC Landing Hero Preview`

## Data contract

```ts
type HeroContent = {
    active: boolean;
    cta?: LinkValue;
    description: string;
    highlightedText?: string;
    illustration: MediaValue;
    title: string;
};
```

## Liferay solution

```text
Custom Element → Headless Delivery → NXC Landing Hero
```

## Acceptance

- Editing Hero Web Content updates the page without rebuilding FE.
- Missing optional CTA does not leave an empty button.
- Illustration is supplied by Documents and Media.

---

# 4. Client Logos

## Figma anatomy

- Section heading and supporting copy.
- Horizontal or wrapped set of client logos.

## FE responsibility

- Implement a responsive logo grid.
- Preserve visual balance across different aspect ratios.
- Lazy-load images.
- Render links only when `websiteUrl` is valid.

## BE responsibility

Structure: `NXC Client Logo`

| Field reference | Type | Required |
|---|---|---:|
| `name` | Text | Yes |
| `logo` | Image | Yes |
| `logoAlt` | Text | Yes |
| `websiteUrl` | Text | No |
| `sortOrder` | Number | Yes |
| `active` | Boolean | Yes |

Optional section content: `NXC Clients Intro`

| Field reference | Type | Required |
|---|---|---:|
| `heading` | Text | Yes |
| `description` | Text | No |

## Data contract

```ts
type ClientLogo = {
    active: boolean;
    logo: MediaValue;
    name: string;
    sortOrder: number;
    websiteUrl?: string;
};
```

## Liferay solution

```text
Collection Display or lightweight mapped component
```

## Acceptance

- Logo list is data-driven.
- Removing an active article removes the logo from the page.
- No logo URL is copied from Figma.

---

# 5. Services

## Figma anatomy

- Intro heading and description.
- Three service cards with icons, titles, and descriptions.

## FE responsibility

- Implement `nexcent-services` Custom Element.
- Load intro and item articles.
- Sort by `sortOrder` and filter by `active`.
- Render equal-height accessible cards.
- Implement responsive 3/2/1 column behavior.
- Treat decorative icons with empty alt text when appropriate.

## BE responsibility

Structure: `NXC Services Intro`

| Field reference | Type | Required |
|---|---|---:|
| `heading` | Text | Yes |
| `description` | Text | No |

Structure: `NXC Service Item`

| Field reference | Type | Required | FE usage |
|---|---|---:|---|
| `title` | Text | Yes | Card heading |
| `description` | Text | Yes | Card body |
| `icon` | Image | Yes | Card icon |
| `iconAlt` | Text | No | Alt text when meaningful |
| `linkLabel` | Text | No | Optional card CTA |
| `linkUrl` | Text | No | Optional card URL |
| `sortOrder` | Number | Yes | Ordering |
| `active` | Boolean | Yes | Visibility |

Templates:

```text
NXC Services Intro Preview
NXC Service Item Preview
```

## Data contract

```ts
type ServicesData = {
    intro: {
        description?: string;
        heading: string;
    };
    items: Array<{
        active: boolean;
        description: string;
        icon: MediaValue;
        link?: LinkValue;
        sortOrder: number;
        title: string;
    }>;
};
```

## Liferay solution

```text
Custom Element → Headless Delivery → Intro + Service Items
```

## Acceptance

- No service list exists in frontend source.
- Adding a fourth active service renders it without a FE rebuild.
- Duplicate ERCs and duplicate sort order are rejected by importer validation.

---

# 6. Reusable Feature Sections

## Figma anatomy

The design contains multiple image-and-content sections with alternating image position, rich copy, and optional CTA.

## FE responsibility

- Implement one reusable `FeatureSection` renderer inside `nexcent-features`.
- Support left/right image positions and background variants.
- Render approved rich text safely.
- Avoid duplicate components for visually similar sections.
- Stack content predictably on mobile.

## BE responsibility

Structure: `NXC Feature Item`

| Field reference | Type | Required | FE usage |
|---|---|---:|---|
| `title` | Text | Yes | Feature heading |
| `descriptionHTML` | HTML/Rich Text | Yes | Rich copy |
| `image` | Image | Yes | Feature media |
| `imageAlt` | Text | Yes | Accessible alt |
| `ctaLabel` | Text | No | CTA label |
| `ctaUrl` | Text | No | CTA URL |
| `imagePosition` | Select | Yes | `left` or `right` |
| `backgroundVariant` | Select | Yes | `default` or `muted` |
| `sortOrder` | Number | Yes | Ordering |
| `active` | Boolean | Yes | Visibility |

Template: `NXC Feature Item Preview`

## Data contract

```ts
type FeatureItem = {
    active: boolean;
    backgroundVariant: 'default' | 'muted';
    cta?: LinkValue;
    descriptionHtml: string;
    image: MediaValue & {position: 'left' | 'right'};
    sortOrder: number;
    title: string;
};
```

## Liferay solution

```text
Custom Element → Headless Delivery → NXC Feature Item[]
```

## Acceptance

- Both Figma feature sections use the same renderer.
- Rich Text is provided by BE and sanitized/controlled.
- Mobile order matches the agreed responsive specification.

---

# 7. Statistics

## Figma anatomy

- Intro copy.
- KPI tiles with icon, value, and label.

## FE responsibility

- Render locale-aware numeric formatting.
- Support optional suffix such as `+`.
- Implement responsive two-column and single-column layouts.
- Respect reduced-motion preferences if count animation is used.

## BE responsibility

Structure: `NXC Statistics Intro`

| Field reference | Type | Required |
|---|---|---:|
| `heading` | Text | Yes |
| `highlightedText` | Text | No |
| `description` | Text | No |

Structure: `NXC Statistic Item`

| Field reference | Type | Required |
|---|---|---:|
| `label` | Text | Yes |
| `value` | Number | Yes |
| `valueSuffix` | Text | No |
| `icon` | Image | Yes |
| `iconAlt` | Text | No |
| `sortOrder` | Number | Yes |
| `active` | Boolean | Yes |

## Data contract

```ts
type StatisticItem = {
    active: boolean;
    icon: MediaValue;
    label: string;
    sortOrder: number;
    value: number;
    valueSuffix?: string;
};
```

## Liferay solution

```text
Collection presentation backed by Web Content
```

## Acceptance

- KPI values are backend-managed.
- Long values do not break the layout.
- No fake fallback numbers are rendered.

---

# 8. Testimonial

## Figma anatomy

- Customer image.
- Quote.
- Customer identity and company.
- Related client logos and CTA.

## FE responsibility

- Use semantic `<blockquote>` markup.
- Support one or multiple testimonials without assuming a carousel.
- Implement accessible customer image and responsive layout.
- Add carousel behavior only when explicitly accepted.

## BE responsibility

Structure: `NXC Testimonial`

| Field reference | Type | Required |
|---|---|---:|
| `quote` | Text or Rich Text | Yes |
| `customerName` | Text | Yes |
| `customerRole` | Text | No |
| `customerCompany` | Text | No |
| `customerImage` | Image | Yes |
| `customerImageAlt` | Text | Yes |
| `ctaLabel` | Text | No |
| `ctaUrl` | Text | No |
| `sortOrder` | Number | Yes |
| `active` | Boolean | Yes |

## Data contract

```ts
type Testimonial = {
    active: boolean;
    cta?: LinkValue;
    customer: {
        company?: string;
        image: MediaValue;
        name: string;
        role?: string;
    };
    quote: string;
    sortOrder: number;
};
```

## Liferay solution

```text
Collection presentation backed by Web Content
```

## Acceptance

- Quote and customer identity are editable.
- Decorative logo relationships do not duplicate assets unnecessarily.

---

# 9. Community Updates Remote App

## Figma anatomy

- Section heading and supporting copy.
- Three image cards with title and read-more action.

## FE responsibility

- Implement an externally hosted React application under `remote-apps/nexcent-community-app`.
- Register the external assets with `nexcent-remote-app-registration`.
- Fetch Community content through Headless Delivery.
- Implement loading, empty, error, long-title, broken-image, and responsive states.
- Keep the application independently buildable and deployable.
- Document local `baseURL`, production `baseURL`, CORS, cache invalidation, and failure behavior.

## BE responsibility

Structure: `NXC Community Intro`

| Field reference | Type | Required |
|---|---|---:|
| `heading` | Text | Yes |
| `description` | Text | No |

Structure: `NXC Community Card`

| Field reference | Type | Required |
|---|---|---:|
| `title` | Text | Yes |
| `summary` | Text | No |
| `thumbnail` | Image | Yes |
| `thumbnailAlt` | Text | Yes |
| `targetUrl` | Text | Yes |
| `publishedDate` | Date | No |
| `sortOrder` | Number | Yes |
| `active` | Boolean | Yes |

## Data contract

```ts
type CommunityCard = {
    active: boolean;
    publishedDate?: string;
    sortOrder: number;
    summary?: string;
    targetUrl: string;
    thumbnail: MediaValue;
    title: string;
};
```

## Liferay solution

```text
External React host → Remote Custom Element registration → Liferay page
```

## Acceptance

- The JavaScript and CSS assets are served outside Liferay.
- Liferay renders the registered widget.
- The app can be released independently.
- A clear error state appears when the external host is unavailable.

---

# 10. Final CTA

## FE responsibility

- Build the visual component using shared typography and button variants.
- Support responsive heading and optional visual variant.

## BE responsibility

Structure: `NXC CTA`

| Field reference | Type | Required |
|---|---|---:|
| `heading` | Text | Yes |
| `ctaLabel` | Text | Yes |
| `ctaUrl` | Text | Yes |
| `ctaTarget` | Select | No |
| `backgroundVariant` | Select | No |
| `active` | Boolean | Yes |

## Data contract

```ts
type CtaContent = {
    active: boolean;
    backgroundVariant?: string;
    cta: LinkValue;
    heading: string;
};
```

## Liferay solution

```text
Mapped page component backed by Web Content
```

## Acceptance

- CTA content is editor-managed.
- Invalid links are blocked by migration validation.

---

# 11. Footer

## Figma anatomy

- Logo and copyright.
- Social links.
- Multiple navigation columns.
- Optional newsletter field shown in the design.

## FE responsibility

- Implement responsive footer layout in Master Page/Fragment.
- Use Navigation Menus for link groups.
- Implement accessible social links.
- Do not implement a fake newsletter submission.

## BE/Liferay responsibility

- Configure footer Navigation Menus.
- Configure site branding and social links.
- Confirm whether newsletter submission is a real business requirement.
- Add a Forms or external marketing integration only after a submission contract exists.

## Data contract

```ts
type FooterData = {
    copyright: string;
    navigationGroups: Array<{
        items: Array<{label: string; url: string}>;
        title: string;
    }>;
    socialLinks: Array<{
        label: string;
        type: string;
        url: string;
    }>;
};
```

## Liferay solution

```text
Master Page/Fragment + Navigation Menus + Site Settings
```

## Acceptance

- Footer links can be reordered without changing FE source.
- Newsletter is explicitly marked out of scope until its backend destination is defined.

---

# 12. Content Import Site Administration App

## UI responsibility

- Deliver a React UI inside the `nexcent-training-web` MVC Portlet.
- Register it through `PanelApp` under Site Menu → Content & Data.
- Discover enabled import profiles from REST and render a content-type/profile selector.
- Accept the selected profile's ZIP package containing `manifest.json`, workbook, and `assets/`.
- Upload the package to the restricted Documents and Media import folder.
- Display package, asset, and Article row validation before mutation.
- Display durable job history, progress, created/updated/skipped/failed counts, row errors, retry, and error-report download.
- Derive the current site from Liferay context; never ask editors for numeric IDs.
- Never render the importer on the public landing page.

## Backend responsibility

- Own the generic profile registry, package schema, ZIP-safety limits, MIME/checksum validation, permissions, and state transitions.
- Delegate workbook schema, field mapping, and business validation to the selected `ContentImportHandler`.
- Upsert Documents and Media by stable document ERC before dependent Web Content.
- Upsert Structured Content by Article ERC.
- Persist operational jobs and row results through Service Builder.
- Expose profile discovery and generic job orchestration through REST Builder; reuse the standard Documents API for the package binary.
- Validate allowed HTML, URLs, taxonomy, locales, workflow, and publish permission.

## Package contract

```text
<selected-profile>-import.zip
├── manifest.json
├── content.xlsx
└── assets/
    └── <image files>
```

Workbook sheets:

```text
Articles
Assets
Taxonomy
Instructions
```

## Acceptance

- `NXC_ARTICLE_V1` is the first enabled implementation and creates media plus Draft Articles.
- Second identical import reports `NO_CHANGE` and creates no duplicate ERC or unnecessary version.
- Missing asset, duplicate ERC, invalid select value, unsafe HTML, unsafe ZIP path, corrupt image, and invalid URL are blocked before mutation.
- Guest and ordinary site members cannot access the app or execute its API.
- Registering another valid handler adds its profile to the dropdown without changing generic UI or REST resource code.
- Imported images live in the Article media folder; source ZIPs remain in a separate restricted folder.

---

# 13. Batch Client Extension and Headless Batch Engine

## FE responsibility

- No browser Batch Engine implementation is required.
- The importer remains a separate Custom Element.

## BE responsibility

- Export published content using Headless Batch Engine `jsont`.
- Preserve the version-generated configuration block.
- Filter records by stable `NXC-` ERC.
- Package payload files under the Batch Client Extension `batch/` directory.
- Configure the OAuth headless server scopes.
- Verify import/deploy twice.

## Acceptance

- Batch Client Extension uses `type: batch`.
- Payload is generated by the running Liferay version.
- Deployment is repeatable.
- Failures and missing dependencies are documented.

---

# Joint FE–BE Definition of Done

For every component:

- Figma node/section is identified.
- Desktop, tablet, and mobile behavior is agreed.
- Content ownership is explicit.
- Structure name and field references are documented.
- ERC convention is documented.
- API response example is recorded.
- Loading, empty, error, and accessibility behavior is accepted.
- Sample content exists.
- Migration row exists in the workbook.
- Component evidence is added to `SUBMISSION.md`.
