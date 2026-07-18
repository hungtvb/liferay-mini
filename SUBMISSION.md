# Nexcent Figma-to-Liferay Project Submission

> Runtime evidence worksheet. Keep placeholders until the corresponding check is captured in a clean Liferay environment; do not convert source or preview checks into runtime claims.

## 0. Current Verified Delivery (2026-07-18)

| Area | Status | Evidence |
|---|---|---|
| Full implementation delivery | In review | [PR #12](https://github.com/hungtvb/liferay-mini/pull/12) |
| Figma reference sync | Merged | [workflow run #29633012081](https://github.com/hungtvb/liferay-mini/actions/runs/29633012081), [PR #13](https://github.com/hungtvb/liferay-mini/pull/13), generated manifest and SHA-256 |
| Landing Elements and Excel importer | Pass | Unit tests, typecheck, production build, workbook generation, **Landing Elements Check** |
| External Remote App | Pass | Typecheck, production build, **Remote App Check**, and `https://nexcent-liferay-static.vercel.app/remote-app/` |
| Static landing preview | Pass | `https://nexcent-liferay-static.vercel.app/`; browser QA at 375/768/1440 px |
| Design system and project contract | Pass | **Design System Check** and **Project Contract Check** |
| Clean Liferay integration | Pending | Requires Java 21 plus a running `dxp-2026.q1.1-lts` bundle; capture the runtime-only rows in this worksheet |

The production static preview defaults to deterministic mock data and offers an opt-in Classic Headless adapter. It verifies frontend composition and responsive behavior, not live Liferay registration, permissions, content reads, or migration results.

## 1. Team and Scope

| Role | Name | Responsibility |
|---|---|---|
| Frontend | `<name>` | Figma decomposition, Custom Elements, Remote App, responsive UI |
| Design System | `<name>` | Theme CSS, Style Book, Global CSS/JS |
| Backend | `<name>` | Web Content, Templates, assets, APIs, Excel and Batch migration |
| QA/Demo | `<name>` | Contract verification, evidence, final demo |

Scope deviations:

```text
<none or approved explanation>
```

## 2. Environment

| Item | Value |
|---|---|
| Liferay | `dxp-2026.q1.1-lts` |
| Java | `<java -version>` |
| Node.js | `<node --version>` |
| Browser | `<browser/version>` |
| OS | `<OS>` |
| Site ID/ERC | `<site>` |
| Theme CSS | `Nexcent Theme CSS` |
| Style Book | `Nexcent Default` |
| Remote App host | `<URL>` |

## 3. Repository Evidence

- Repository: `https://github.com/hungtvb/liferay-mini`
- Submission commit: `<full SHA>`
- Reference branch: `main`
- Delivery PR: `https://github.com/hungtvb/liferay-mini/pull/12`
- Figma sync PR: `https://github.com/hungtvb/liferay-mini/pull/13`
- Figma workflow: `https://github.com/hungtvb/liferay-mini/actions/runs/29633012081`

## 4. Figma Audit and Design System

Attach:

- Landing-page section inventory.
- Style Guide screenshots or node links.
- Color, typography, button, shadow, radius, icon, spacing, and breakpoint mapping.
- Asset manifest.
- Responsive decisions not explicitly shown in Figma.

| Check | Result | Evidence |
|---|---|---|
| Theme CSS deployed | `<pass/fail>` | `<link>` |
| `clay.css` and `main.css` generated | `<pass/fail>` | `<link>` |
| `Nexcent Default` published | `<pass/fail>` | `<link>` |
| Style Book applied to page | `<pass/fail>` | `<link>` |
| Runtime `--nxc-style-primary` | `<value>` | `<link>` |
| Global alias follows Style Book | `<pass/fail>` | `<link>` |
| Token change required no FE rebuild | `<pass/fail>` | `<link>` |

## 5. Component-by-Component FE–BE Evidence

| Component | FE delivery | BE source | Ready | Evidence |
|---|---|---|---:|---|
| Header | Master Page/Fragment | Navigation Menu and site branding | `<yes/no>` | `<link>` |
| Hero | Custom Element | `NXC Landing Hero` | `<yes/no>` | `<link>` |
| Client Logos | Collection presentation | `NXC Clients Intro` + `NXC Client Logo` | `<yes/no>` | `<link>` |
| Services | Custom Element | `NXC Services Intro` + `NXC Service Item` | `<yes/no>` | `<link>` |
| Features | Custom Element | `NXC Feature Item` | `<yes/no>` | `<link>` |
| Statistics | Collection presentation | `NXC Statistics Intro` + `NXC Statistic Item` | `<yes/no>` | `<link>` |
| Testimonial | Collection presentation | `NXC Testimonial` | `<yes/no>` | `<link>` |
| Community Updates | External Remote App | `NXC Community Intro` + `NXC Community Card` | `<yes/no>` | `<link>` |
| Final CTA | Mapped component | `NXC CTA` | `<yes/no>` | `<link>` |
| Footer | Master Page/Fragment | Navigation Menus and settings | `<yes/no>` | `<link>` |

For each component provide:

- Figma node/frame.
- Desktop/tablet/mobile screenshot.
- Web Content or Liferay configuration screenshot.
- API response example.
- Loading, empty, and error evidence when applicable.
- One backend edit reflected without rebuilding FE.

## 6. Web Content Models

| Structure | Expected records | Template | Actual |
|---|---:|---|---:|
| `NXC Landing Hero` | 1 | `NXC Landing Hero Preview` | `<count>` |
| `NXC Clients Intro` | 1 | `<template>` | `<count>` |
| `NXC Client Logo` | Figma count | `<template>` | `<count>` |
| `NXC Services Intro` | 1 | `<template>` | `<count>` |
| `NXC Service Item` | 3 | `<template>` | `<count>` |
| `NXC Feature Item` | 2 | `<template>` | `<count>` |
| `NXC Statistics Intro` | 1 | `<template>` | `<count>` |
| `NXC Statistic Item` | 4 | `<template>` | `<count>` |
| `NXC Testimonial` | 1+ | `<template>` | `<count>` |
| `NXC Community Intro` | 1 | `<template>` | `<count>` |
| `NXC Community Card` | 3 | `<template>` | `<count>` |
| `NXC CTA` | 1 | `<template>` | `<count>` |

Evidence must show explicit field references, Templates, Web Content records, Documents and Media assets, and stable ERCs.

## 7. Custom Elements

| Custom Element | Loading | Empty | Error | Responsive | Dynamic content |
|---|---:|---:|---:|---:|---:|
| `nexcent-hero` | `<pass>` | `<pass>` | `<pass>` | `<pass>` | `<pass>` |
| `nexcent-services` | `<pass>` | `<pass>` | `<pass>` | `<pass>` | `<pass>` |
| `nexcent-features` | `<pass>` | `<pass>` | `<pass>` | `<pass>` | `<pass>` |
| `nexcent-content-importer` | `<pass>` | N/A | `<pass>` | `<pass>` | `<pass>` |

No sample business content is hard-coded in TypeScript/JSX: `<yes/no>`.

## 8. Remote App

| Check | Result | Evidence |
|---|---|---|
| Assets hosted outside Liferay | `<pass/fail>` | `<link>` |
| Registration Client Extension deployed | `<pass/fail>` | `<link>` |
| Widget renders in Liferay | `<pass/fail>` | `<link>` |
| Headless content loads | `<pass/fail>` | `<link>` |
| Independent app release demonstrated | `<pass/fail>` | `<link>` |
| External host stopped → error state | `<pass/fail>` | `<link>` |
| External host restarted → recovery | `<pass/fail>` | `<link>` |

## 9. Headless API Evidence

Record requests and successful responses for:

```text
GET /o/headless-delivery/v1.0/sites/{site}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{id}/structured-contents
GET /o/headless-delivery/v1.0/sites/{site}/documents
```

No numeric environment ID is committed in frontend source: `<yes/no>`.

## 10. Excel Importer

Workbook:

```text
sample-data/excel/nexcent-content.xlsx
```

Expected sheets:

```text
Instructions
Heroes
ClientsIntro
Clients
ServicesIntro
Services
Features
StatisticsIntro
Statistics
Testimonials
CommunityIntro
CommunityCards
CTA
```

| Test | Expected | Actual | Evidence |
|---|---|---|---|
| First import | All expected records created | `<result>` | `<link>` |
| Second import | Updated, zero duplicate ERC | `<result>` | `<link>` |
| Missing asset | Blocked before mutation | `<result>` | `<link>` |
| Duplicate ERC | Blocked | `<result>` | `<link>` |
| Invalid select value | Blocked | `<result>` | `<link>` |
| Invalid URL | Blocked | `<result>` | `<link>` |
| Unsafe HTML | Blocked | `<result>` | `<link>` |
| Partial CTA pair | Blocked | `<result>` | `<link>` |

## 11. Batch Client Extension and Headless Batch

Generated payloads:

```text
client-extensions/nexcent-content-batch/batch/*.batch-engine-data.json
```

| Check | Result | Evidence |
|---|---|---|
| Export format is `jsont` | `<pass/fail>` | `<link>` |
| Configuration generated by running Liferay | `<pass/fail>` | `<link>` |
| Only approved `NXC-*` ERCs | `<pass/fail>` | `<link>` |
| Dependency order documented | `<pass/fail>` | `<link>` |
| First deployment succeeds | `<pass/fail>` | `<link>` |
| Second deployment creates no duplicates | `<pass/fail>` | `<link>` |
| Failed-item behavior documented | `<pass/fail>` | `<link>` |

## 12. Responsive and Accessibility QA

| Check | Result | Notes |
|---|---|---|
| Mobile 320–390 px | `<pass/fail>` | `<notes>` |
| Tablet 768 px | `<pass/fail>` | `<notes>` |
| Desktop 1024 px | `<pass/fail>` | `<notes>` |
| Desktop 1440 px | `<pass/fail>` | `<notes>` |
| Keyboard navigation | `<pass/fail>` | `<notes>` |
| Visible focus | `<pass/fail>` | `<notes>` |
| Heading hierarchy | `<pass/fail>` | `<notes>` |
| Image alt text | `<pass/fail>` | `<notes>` |
| Color contrast | `<pass/fail>` | `<notes>` |
| Reduced motion | `<pass/fail>` | `<notes>` |
| Long content | `<pass/fail>` | `<notes>` |
| Broken image | `<pass/fail>` | `<notes>` |

## 13. Automated Checks

```bash
node scripts/verify-course.mjs

cd client-extensions/nexcent-landing-elements
npm ci
npm test
npm run typecheck
npm run build
npm run generate:workbook

cd ../../remote-apps/nexcent-community-app
npm ci
npm run typecheck
npm run build
```

CI status:

```text
Landing Elements Check: <pass/fail>
Remote App Check: <pass/fail>
Design System Check: <pass/fail>
Project Contract Check: <pass/fail>
```

## 14. Final Demo

1. Show Figma landing page and detailed Style Guide.
2. Show component FE–BE contract.
3. Change one Style Book token without rebuilding FE.
4. Demonstrate Header, Hero, Services, and Features.
5. Demonstrate Community Updates running from the external host.
6. Stop and restore the Remote App host.
7. Edit backend content and refresh the page.
8. Run Excel validation and import twice.
9. Show Batch payload and repeat deployment.
10. Show responsive, accessibility, and CI evidence.

Target duration: 12–18 minutes.

## 15. Known Limitations and Retrospective

Known limitations:

```text
- <limitation>
```

What worked well:

```text
<answer>
```

Hardest FE–BE contract issue:

```text
<answer>
```

What the team would improve:

```text
<answer>
```
