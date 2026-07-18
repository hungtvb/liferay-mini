# 11 — Run FE–BE Integration, Responsive QA, and Final Demo

## Current evidence snapshot (2026-07-18)

| Scope | Result | Evidence boundary |
|---|---|---|
| Source contracts and generated workbook | Pass | `node scripts/verify-course.mjs` and the committed workbook fixture |
| Landing Elements | Pass | Unit tests, typecheck, production build, and **Landing Elements Check** on [PR #12](https://github.com/hungtvb/liferay-mini/pull/12) |
| External Remote App | Pass | Typecheck, production build, Vercel `/remote-app/` assembly, and **Remote App Check** |
| Static responsive preview | Pass | Browser checks at 375, 768, and 1440 px with no console, HTTP, image, or horizontal-overflow failures |
| Design-system and repository contract | Pass | **Design System Check** and **Project Contract Check** |
| Figma reference sync | Pass, reference-only | [workflow run #29633012081](https://github.com/hungtvb/liferay-mini/actions/runs/29633012081) and merged [PR #13](https://github.com/hungtvb/liferay-mini/pull/13); component-ready exports are still pending |
| Clean Liferay runtime | Pending | Registration, real Headless reads, first/second Excel import, batch deployment, and backend-edit proof must be captured in `dxp-2026.q1.1-lts` with Java 21 |

The static preview uses mock data by default and has an opt-in Classic Headless adapter. Its browser result is valid frontend/responsive evidence, but it is not a substitute for the pending Liferay runtime acceptance.

## Goal

Verify the complete landing page, content lifecycle, migration flows, and team handoff.

## Page composition

```text
Master Page
├── Header
├── Main
│   ├── Hero Custom Element
│   ├── Client Logos
│   ├── Services Custom Element
│   ├── Feature Item 1
│   ├── Statistics
│   ├── Feature Item 2
│   ├── Testimonial
│   ├── Community Updates Remote App
│   └── Final CTA
└── Footer
```

## FE QA

- Figma visual comparison.
- Style Book token propagation.
- 320–390 px mobile.
- 768 px tablet.
- 1024 px small desktop.
- 1440 px design desktop.
- Keyboard navigation and visible focus.
- Heading hierarchy and landmarks.
- Image alt text.
- Reduced motion.
- Loading, empty, error, long-content, and broken-image states.
- External Remote App host unavailable and restored.

## BE QA

- All Structures and Templates exist.
- All field references match the contract.
- Expected content and assets exist.
- Permissions support the intended audience.
- FE receives no hidden dependency on numeric IDs.
- Excel first/second import results are correct.
- Batch first/second deployment results are correct.
- Failed migration scenarios have actionable reports.

## Joint component demo

For each component:

1. Show its Figma source.
2. Show FE implementation and responsive behavior.
3. Show its Web Content or Liferay configuration.
4. Edit one backend field and refresh the page.
5. Show loading/empty/error evidence.
6. Show its workbook row and ERC.

## Required demo flow

1. Figma Style Guide → Theme CSS → Style Book.
2. Header/navigation configuration.
3. Hero, Services, and Features Custom Elements.
4. Community Updates external Remote App.
5. Web Content and Documents and Media.
6. Excel validation and first import.
7. Second Excel import with zero duplicates.
8. Batch payload and repeat deployment.
9. Responsive and accessibility proof.
10. CI and final submission evidence.

## Final acceptance

- [x] Original FE/BE assignment is represented in source, contracts, and runbooks.
- [x] Unrelated Liferay technologies are not required by the core project.
- [ ] All visible business content is verified as backend-managed in a running Liferay site.
- [x] Remote App assets are genuinely externally hosted.
- [ ] Excel and Batch migration idempotency is verified against a running Liferay site.
- [x] `SUBMISSION.md` separates captured evidence from runtime evidence still required.
