# Lab 14 — Final Integration, QA, and Submission

## Overview

Assemble the complete Nexcent landing page, reproduce the project from a clean checkout, execute functional and migration tests, record evidence, and prepare the final group submission.

This lab does not introduce another feature. It proves that all previous work functions as one maintainable Liferay solution.

## Estimated time

180–240 minutes.

## Prerequisites

- Labs 00–13 are complete.
- All feature pull requests are merged.
- The repository has no uncommitted secrets or local bundle files.
- At least one team member can demonstrate the project on a clean local bundle.

## Final deliverables

```text
Repository
├── Labs 00–14
├── Global CSS and JavaScript Client Extensions
├── Hero, Services, Features, and Importer Custom Elements
├── Excel/JSON/CSV sample data
├── Batch Client Extension
├── Automated checks
└── SUBMISSION.md

Liferay
├── Four Web Content Structures and Templates
├── Seven published sample articles
├── Six Documents and Media assets
├── Final responsive landing page
└── Private migration administration page
```

---

## Part 1 — Reproduce the environment

### Step 1 — Use a clean checkout

Clone into a new directory or use a second machine:

```bash
git clone https://github.com/hungtvb/liferay-mini.git
cd liferay-mini
```

Do not reuse an old `bundles/` directory for the reproducibility test.

### Step 2 — Verify tools

```bash
git version
java -version
javac -version
blade version
node --version
npm --version
```

Expected Java major version: `21`.

### Step 3 — Bootstrap the Workspace

macOS/Linux:

```bash
chmod +x scripts/bootstrap-workspace.sh
./scripts/bootstrap-workspace.sh
./gradlew initBundle
```

Windows:

```powershell
Set-ExecutionPolicy Bypass -Scope Process
.\scripts\bootstrap-workspace.ps1
.\gradlew.bat initBundle
```

### Step 4 — Start Liferay

```bash
blade server run
```

Complete the initial setup and create the course site.

Record:

- Liferay build information
- Java version
- Operating system
- Site name and external reference code

---

## Part 2 — Recreate backend content

### Step 5 — Create Structures and Templates

Recreate the models from Labs 05–06:

```text
NXC Landing Hero
NXC Services Intro
NXC Service Item
NXC Feature Item
```

Verify every field reference exactly. Labels may be translated, but API field references must not change.

### Step 6 — Deploy Global Client Extensions

```bash
./gradlew :client-extensions:nexcent-global-assets:deploy
```

Verify in the browser console:

```js
window.Nexcent
window.Nexcent.getPortalContext()
getComputedStyle(document.documentElement)
    .getPropertyValue('--nxc-color-primary')
    .trim()
```

Expected primary token:

```text
#4caf4f
```

### Step 7 — Build and deploy frontend Custom Elements

```bash
cd client-extensions/nexcent-landing-elements
npm install
npm run typecheck
npm run build
npm run generate:workbook
cd ../..

./gradlew :client-extensions:nexcent-landing-elements:deploy
```

Expected widgets:

```text
Nexcent Hero
Nexcent Services
Nexcent Features
Nexcent Content Importer
Nexcent Lab Status
```

### Step 8 — Import content

Add **Nexcent Content Importer** to a private administration page.

Select:

```text
sample-data/excel/nexcent-content.xlsx
sample-data/assets/*
```

Validate and import. Confirm seven created articles.

Run it again and confirm seven updated articles with no duplicate ERCs.

---

## Part 3 — Assemble the final page

### Step 9 — Create the landing page

Add widgets in this order:

```text
1. Nexcent Hero
2. Nexcent Services
3. Nexcent Features
```

Use a full-width page layout so each component controls its internal `72rem` content container.

### Step 10 — Confirm dynamic behavior

Perform these editor tests:

1. Change the Hero highlighted text.
2. Publish the article.
3. Refresh the page without rebuilding the Client Extension.
4. Add a fourth Service with `sortOrder=4`.
5. Set one Feature to `backgroundVariant=silver`.
6. Set one article to `active=false` and verify it disappears.
7. Restore the original sample state before submission.

The frontend must react only to content changes.

### Step 11 — Compare with Figma

Check:

- Green brand color
- Inter typography or configured fallback
- Hero two-column composition
- Three-card Services desktop grid
- Alternating Feature media/content layout
- Silver and white section variants
- Consistent buttons, radii, shadows, and spacing

Document intentional differences from the Figma source.

---

## Part 4 — Functional QA

### Step 12 — Test component states

For each data component, capture evidence for:

| State | How to trigger |
|---|---|
| Loading | Throttle the Headless API request |
| Ready | Publish valid content |
| Empty | Set every article for the Structure to inactive |
| Error | Temporarily configure an invalid Structure identifier |

Restore valid configuration after recording the evidence.

### Step 13 — Test signed-in and signed-out views

Public page:

- Hero, Services, and Features render for a guest.
- No administration controls or credentials appear.

Importer page:

- Signed-out user sees a warning.
- Import action is disabled.
- Signed-in authorized user can validate and import.

### Step 14 — Test URLs and content ordering

Verify:

- CTA and Service links are clickable.
- Relative URLs remain on the Liferay host.
- `sortOrder` controls all collections.
- `active=false` filters records.
- Invalid Feature variants fall back safely.

---

## Part 5 — Responsive and accessibility QA

### Step 15 — Test viewport matrix

| Viewport | Expected layout |
|---:|---|
| 320 px | One-column content, readable controls |
| 390 px | Mobile layout, image-first Feature sections |
| 768 px | Tablet Services grid with two columns |
| 1024 px | Full navigation/content rhythm |
| 1440 px | Desktop layout with centered container |

Check for horizontal overflow at every width.

### Step 16 — Keyboard test

Using only the keyboard:

1. Navigate through CTA and service links.
2. Confirm a visible focus ring.
3. Operate both importer buttons.
4. Select workbook and asset files.
5. Confirm focus order matches visual order.

### Step 17 — Semantic and image test

Verify:

- One page-level `h1` in Hero.
- Section headings use `h2`.
- Service titles use `h3`.
- Every meaningful image has editor-managed alt text.
- Decorative images use an empty alt value only when intentional.
- Validation errors use readable text, not color alone.
- Import progress is announced through `aria-live`.

### Step 18 — Reduced motion

Enable the operating system's reduced-motion preference. Skeleton and button behavior must not rely on continuous animation.

---

## Part 6 — Migration and Batch QA

### Step 19 — Test Excel validation cases

Create temporary workbook copies and verify these failures occur before any write:

1. Remove the `ServicesIntro` sheet.
2. Duplicate an ERC.
3. Enter `sortOrder=abc`.
4. Enter `imagePosition=center`.
5. Add `<script>alert(1)</script>` to an HTML field.
6. Omit one selected image file.

Record one screenshot containing sheet, row, and error message.

### Step 20 — Generate the Batch payload

Set local environment variables and run:

```bash
./scripts/batch/export-structured-content.sh
```

or:

```powershell
.\scripts\batch\export-structured-content.ps1
```

Verify:

```text
client-extensions/nexcent-content-batch/batch/10-structured-content.batch-engine-data.json
```

contains exactly seven `NXC-*` items.

### Step 21 — Build and deploy Batch

```bash
./gradlew :client-extensions:nexcent-content-batch:build
./gradlew :client-extensions:nexcent-content-batch:deploy
```

Capture:

- Archive contents
- Deployment log
- Imported/updated item count
- Second deployment result

---

## Part 7 — Run automated checks

### Step 22 — Verify the course contract

```bash
node scripts/verify-course.mjs
```

Expected:

```text
Course contract verification passed.
```

The script verifies:

- DXP 2026.Q1.1 LTS baseline
- Labs 00–14
- Four required Custom Elements
- Global CSS and JavaScript
- Batch extension/OAuth scopes
- Seven unique sample ERCs
- No sample business content hard-coded in frontend source
- No Docker Compose course baseline

### Step 23 — Run frontend checks

```bash
cd client-extensions/nexcent-landing-elements
npm install
npm run typecheck
npm run build
npm run generate:workbook
```

### Step 24 — Confirm GitHub Actions

Required green workflows:

```text
Frontend Check
Global Assets Check
Batch Client Extension Check
Course Contract Check
```

Do not submit with a cancelled, skipped, or failing required workflow.

---

## Part 8 — Prepare the demo

### Step 25 — Use an 8–12 minute script

Recommended order:

1. Show Figma and the final page.
2. Explain the architecture in 30–45 seconds.
3. Edit Hero Web Content and show the page updating dynamically.
4. Show responsive Services and Features.
5. Show Global CSS tokens and `window.Nexcent`.
6. Validate and run the Excel importer.
7. Run the same package again and show updates rather than duplicates.
8. Show the Batch payload and deployment evidence.
9. Show all green CI checks.

Avoid spending demo time installing software or waiting for `initBundle`.

### Step 26 — Prepare fallback evidence

Record screenshots or a short backup video for:

- Final desktop and mobile page
- Seven Web Content records
- Import created/updated reports
- Batch deployment result
- Green GitHub checks

A live demo remains primary, but evidence protects the presentation from local network or machine issues.

---

## Part 9 — Complete the submission

### Step 27 — Fill `SUBMISSION.md`

Replace every placeholder with:

- Team and environment data
- Submission SHA
- PR and CI links
- Screenshots
- API evidence
- Migration results
- Accessibility matrix
- Known limitations
- Retrospective

### Step 28 — Review secrets and generated data

Before committing:

```bash
git status
git grep -n "LIFERAY_PASSWORD"
git grep -n "Authorization: Basic"
```

Environment variable names and local-lab examples are allowed. Real passwords, tokens, cookies, and machine paths are not.

Never commit:

```text
bundles/
node_modules/
.env
browser cookies
OAuth client secrets
personal access tokens
```

### Step 29 — Create the final commit

```bash
git add .
git commit -m "docs: complete Liferay mini project submission"
git push
```

Record the full SHA:

```bash
git rev-parse HEAD
```

### Step 30 — Use the reference branch

The maintained course source remains on `main`. After all checks are green, create or update the `final` branch to the verified submission commit.

The `final` branch is the stable reference solution, not a place for new unreviewed work.

---

## Acceptance criteria mapped to the assignment

### Frontend

- [ ] At least three complete components: Hero, Services, Features.
- [ ] Text, images, and lists come from Liferay Headless APIs.
- [ ] Global CSS and JavaScript manage shared behavior and styles.
- [ ] Layout follows Figma and is basically responsive.
- [ ] Components implement loading, empty, and error states.

### Backend

- [ ] Structures and Templates cover Text, Image, and HTML data.
- [ ] Excel sample covers all landing page content.
- [ ] Runtime importer parses, validates, uploads, and creates Web Content.
- [ ] Imported data appears under Site Content → Web Content.
- [ ] Re-import does not create duplicate ERCs.
- [ ] A real Batch Client Extension packages `*.batch-engine-data.json`.

### Quality

- [ ] A clean machine can reproduce the solution.
- [ ] Automated checks are green.
- [ ] Basic keyboard and responsive tests pass.
- [ ] No credentials or environment-specific numeric IDs are committed to frontend configuration.
- [ ] Known limitations are documented honestly.

## Definition of done

The project is complete when another developer can clone the repository, follow Labs 00–14, reproduce the page and migration flow, and verify the result without relying on undocumented knowledge from the original team.

## Knowledge check

1. Which project concern was hardest to reproduce from a clean checkout?
2. What evidence proves the frontend is not hard-coded?
3. What evidence proves migration is idempotent?
4. Why is a green build insufficient without runtime Liferay verification?
5. Which dependencies make Structured Content batch migration difficult across clean environments?
6. What belongs in `main`, and what is the purpose of `final`?

## Final challenge

Reproduce the full project on a second clean Liferay bundle and record every manual prerequisite. Convert any undocumented prerequisite into a new automated check or course instruction.
