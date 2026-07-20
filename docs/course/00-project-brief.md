# 00 — Project Brief and Acceptance Criteria

## Goal

Deliver the Nexcent Figma landing page as a coordinated frontend/backend project on **Liferay DXP 2026.Q1.1 LTS**.

The visible page must follow the supplied Figma frame and Style Guide, while content ownership, APIs, migration, and editor workflow are modeled explicitly.

## Course alignment policy

The Nexcent course uses official Liferay learning paths and the Clarity labs as implementation references only where they overlap with the mini-project.

```text
Matching Nexcent requirement
→ follow official Liferay terminology, workflow, and best practice

Non-matching Clarity topic
→ do not add it to the required course only for coverage
→ keep it as an optional future enhancement when useful
```

The current submission does not claim to reproduce every Clarity exercise or every official learning-path topic.

## 2026.Q1 content architecture position

The current required implementation uses a **Classic CMS compatibility baseline** with Classic Web Content Structures, FreeMarker preview Templates, and site-scoped Documents and Media.

This baseline must be proven on a clean DXP 2026.Q1.1 runtime. A later Liferay CMS + Spaces comparison remains valuable, but it is an upgrade backlog item and does not block the current course submission.

```text
Current required baseline
Classic Web Content + Documents and Media + Headless Delivery
→ complete and verify the Nexcent project

Future optional upgrade
Liferay CMS + Spaces PoC
→ compare content modeling, permissions, page mapping, and migration
→ record an ADR before changing the accepted architecture
```

See:

- [`../architecture/liferay-2026-q1-audit.md`](../architecture/liferay-2026-q1-audit.md)
- [`../tasks/2026-q1-audit-backlog.md`](../tasks/2026-q1-audit-backlog.md)

## Frontend scope

- Extract the Figma composition and detailed Style Guide.
- Build one unified Nexcent Theme client-extension project containing Theme CSS, frontend tokens, Global CSS, Global JavaScript, and favicon configuration.
- Build Hero, Services, and Features as dynamic Custom Element Client Extensions.
- Build Community Updates as an externally hosted Remote App and register it in Liferay.
- Use Liferay OOTB page-building capabilities for Header, Footer, Navigation, Forms, and shared page composition where they meet the requirement.
- Implement responsive, loading, empty, error, keyboard, and accessibility states.
- Keep rendering independent from the selected content adapter.
- Do not hard-code business content in TypeScript, JSX, JavaScript, or CSS.

## Backend and application scope

### Editorial content baseline

- Model the page with Classic Web Content Structures and FreeMarker preview Templates.
- Use stable field references and external reference codes.
- Store editorial images in Documents and Media.
- Organize shared assets through the Asset Library exercise.
- Classify applicable content and assets with Vocabulary, Categories, and Tags.
- Provide normalized Headless Delivery contracts.
- Define an Excel migration workbook and validation rules.
- Create or update content by ERC without duplicates.
- Generate Batch Client Extension payloads from the target runtime rather than inventing configuration.

### Application Developer labs

- Implement an OSGi component and verify it through Gogo Shell.
- Use Service Builder for operational persistence through the `ImportJob` entity.
- Keep editorial content in the CMS instead of replacing it with Service Builder tables.
- Use REST Builder as the BFF/API layer for the Import Job Console where existing Liferay Headless APIs do not cover the business workflow.
- Demonstrate the complete Custom Element → REST Builder → Service Builder → database flow.

## Asset scope

- Figma is the source of truth for logo, client logos, icons, illustrations, portraits, and community images.
- PR #11 provides the automated Figma REST export mechanism; workflow run #1 and merged PR #13 prove one real full-page reference export and deterministic manifest.
- That accepted thumbnail is comparison evidence only. Component-ready logo, icon, illustration, portrait, and community-image exports are still required before replacing placeholders.
- Approved assets must be named, export-enabled, or mapped explicitly by node ID.
- A generated asset PR must pass visual review before replacing placeholders.
- Immutable application-shell assets belong with Client Extensions or their static host.
- Documents and Media and Asset Library are required learning exercises for the current course.

## Provisioning scope

The target is one observable and rerunnable deployment flow, not an atomic transaction.

Runtime proof is required for:

- each Client Extension archive;
- Style Book import and Theme CSS binding;
- Master Page creation, publication, and application;
- Navigation Menu provisioning;
- placement and configuration of Custom Elements;
- Web Content Structures, Templates, records, and permissions;
- Documents and Media, Asset Library, and taxonomy exercises;
- Contact Form behavior required by the Practitioner track;
- Service Builder schema and REST Builder endpoint availability;
- clean-instance content and asset import;
- Excel and Batch idempotency.

No capability is considered delivered only because a source folder or JSON file exists.

## Scope boundaries and future upgrades

The following topics are not required for the current Nexcent submission unless a later decision explicitly promotes them into scope:

- Manual and Dynamic Collections beyond the current page requirements.
- Search Blueprints and advanced search experiences.
- Publications and advanced editorial workflow.
- Liferay Objects dashboards and advanced object automation.
- Personalization and Page Experiences.
- Commerce, Analytics Cloud, and AI integrations.
- Dedicated JMeter and performance-diagnostics labs.
- Full Liferay CMS + Spaces migration.

These items should remain visible in the backlog, but they do not block the current `final` branch.

## Evidence labels

- **VERIFIED:** official capability plus clean-runtime evidence where applicable.
- **IMPLEMENTED / RUNTIME PENDING:** source exists, runtime proof missing.
- **POC REQUIRED:** integration path not accepted yet.
- **OPTIONAL BACKLOG:** useful future enhancement outside the current submission gate.
- **OUT OF SCOPE:** intentionally excluded.

## Definition of done

- The landing page matches Figma using accepted assets at desktop, tablet, and mobile sizes.
- The static prototype is clearly identified as mock-backed until a Liferay adapter is proven.
- Theme CSS, Global CSS, Global JavaScript, favicon, Custom Elements, Remote App registration, and Batch CE deploy on a clean 2026.Q1.1 instance.
- Header, Footer, Navigation, and Contact Form use the accepted Liferay OOTB composition.
- Master Page and Navigation Menu provisioning have runtime evidence.
- Documents and Media, Asset Library, Vocabulary, Categories, and Tags have runtime evidence.
- The accepted editorial content model is editable through Liferay and consumable through stable APIs.
- OSGi, Service Builder, and REST Builder labs run successfully for the Import Job workflow.
- Excel import is repeatable by ERC.
- Batch migration uses target-runtime-generated `jsont`.
- Partial deployment failure is visible and rerunnable.
- Figma token expiry, rotation, API quota constraints, and generated-asset review are documented.
- Future upgrade topics remain optional and do not falsely block submission readiness.
- Final evidence is recorded in `SUBMISSION.md`.