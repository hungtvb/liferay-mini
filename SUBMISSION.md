# Liferay Mini Project Submission

> Replace every placeholder before submitting the group project.

## 1. Team

| Role | Name | Responsibility |
|---|---|---|
| Frontend | `<name>` | Custom Elements, responsive UI, Global CSS/JS |
| Backend | `<name>` | Web Content models, APIs, Excel migration, Batch CE |
| QA/Demo | `<name>` | Test evidence, demo flow, final report |

## 2. Environment

| Item | Value |
|---|---|
| Liferay product | `dxp-2026.q1.1-lts` |
| Java | `<java -version>` |
| Node.js | `<node --version>` |
| Browser | `<browser/version>` |
| Operating system | `<OS>` |
| Site name/ERC | `<site>` |

## 3. Repository Evidence

- Repository: `https://github.com/hungtvb/liferay-mini`
- Submission commit: `<full SHA>`
- Reference branch: `final`
- Pull requests: `<links>`
- CI runs: `<links>`

## 4. Architecture Summary

```text
Liferay Page
├── Nexcent Global CSS
├── Nexcent Global JavaScript
├── Nexcent Hero
├── Nexcent Services
└── Nexcent Features

Custom Elements → Headless Delivery → Classic Web Content

Excel Importer → Documents and Media + Structured Content APIs

Batch Engine jsont export → Nexcent Batch Client Extension
```

Describe any deviations:

```text
<none or explanation>
```

## 5. Frontend Components

| Component | Data source | Loading | Empty | Error | Responsive |
|---|---|---:|---:|---:|---:|
| Hero | `NXC Landing Hero` | ✅ | ✅ | ✅ | ✅ |
| Services | `NXC Services Intro` + `NXC Service Item` | ✅ | ✅ | ✅ | ✅ |
| Features | `NXC Feature Item` | ✅ | ✅ | ✅ | ✅ |
| Content Importer | Excel + Headless APIs | ✅ | N/A | ✅ | ✅ |

Evidence:

- Desktop screenshot: `<path/link>`
- Tablet screenshot: `<path/link>`
- Mobile screenshot: `<path/link>`
- Signed-out error state: `<path/link>`
- Missing-content empty state: `<path/link>`

## 6. Web Content Models

| Structure | Article count | Template |
|---|---:|---|
| `NXC Landing Hero` | 1 | `NXC Landing Hero Preview` |
| `NXC Services Intro` | 1 | `NXC Services Intro Preview` |
| `NXC Service Item` | 3 | `NXC Service Item Preview` |
| `NXC Feature Item` | 2 | `NXC Feature Item Preview` |

Attach screenshots showing:

- Structure fields and field references
- Template preview
- Seven articles under **Site Content → Web Content**
- Six assets under Documents and Media

## 7. Headless API Evidence

Record successful responses for:

```text
GET /o/headless-delivery/v1.0/sites/{site}/content-structures
GET /o/headless-delivery/v1.0/content-structures/{id}/structured-contents
GET /o/headless-delivery/v1.0/sites/{site}/documents
```

Evidence file or Postman collection:

```text
<path/link>
```

No numeric environment ID is committed in frontend source: `✅ / ❌`

## 8. Excel Migration Results

Workbook:

```text
sample-data/excel/nexcent-content.xlsx
```

| Test | Expected | Actual | Evidence |
|---|---|---|---|
| First import | 7 created | `<result>` | `<link>` |
| Second import | 7 updated, 0 duplicates | `<result>` | `<link>` |
| Missing asset | Validation blocked | `<result>` | `<link>` |
| Duplicate ERC | Validation blocked | `<result>` | `<link>` |
| Unsafe HTML | Validation blocked | `<result>` | `<link>` |

## 9. Batch Client Extension Results

Generated payload:

```text
client-extensions/nexcent-content-batch/batch/10-structured-content.batch-engine-data.json
```

| Check | Result |
|---|---|
| Export format is `jsont` | `<pass/fail>` |
| Exactly seven `NXC-*` items | `<pass/fail>` |
| Payload packaged under `batch/` | `<pass/fail>` |
| First deployment succeeds | `<pass/fail>` |
| Second deployment creates no duplicate ERC | `<pass/fail>` |

Tomcat/batch evidence:

```text
<path/link>
```

## 10. Accessibility and Responsive QA

| Check | Result | Notes |
|---|---|---|
| Keyboard navigation | `<pass/fail>` | `<notes>` |
| Visible focus | `<pass/fail>` | `<notes>` |
| Image alt text | `<pass/fail>` | `<notes>` |
| Heading hierarchy | `<pass/fail>` | `<notes>` |
| Mobile 320–390 px | `<pass/fail>` | `<notes>` |
| Tablet 768 px | `<pass/fail>` | `<notes>` |
| Desktop 1440 px | `<pass/fail>` | `<notes>` |
| Reduced motion | `<pass/fail>` | `<notes>` |

## 11. Automated Checks

Run and paste results:

```bash
node scripts/verify-course.mjs

cd client-extensions/nexcent-landing-elements
npm install
npm run typecheck
npm run build
npm run generate:workbook
```

CI status:

```text
Frontend Check: <pass/fail>
Global Assets Check: <pass/fail>
Batch Client Extension Check: <pass/fail>
Course Contract Check: <pass/fail>
```

## 12. Demo Script

1. Show the Figma design and final Liferay page.
2. Edit Hero Web Content and refresh the page without rebuilding frontend code.
3. Add a Service article and show the grid updating dynamically.
4. Show responsive desktop and mobile layouts.
5. Open the Excel importer and validate the sample package.
6. Run import twice and compare `created` versus `updated` reports.
7. Show the Batch Client Extension payload and deployment evidence.
8. Show all green GitHub checks.

Target duration: 8–12 minutes.

## 13. Known Limitations

```text
- <limitation>
- <limitation>
```

## 14. Retrospective

### What worked well

```text
<answer>
```

### Hardest technical problem

```text
<answer>
```

### What the team would improve next

```text
<answer>
```
