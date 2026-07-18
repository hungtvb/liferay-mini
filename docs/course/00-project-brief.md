# 00 — Project Brief and Acceptance Criteria

## Goal

Deliver the Nexcent Figma landing page as a coordinated frontend/backend project on **Liferay DXP 2026.Q1.1 LTS**.

The visible page must follow the supplied Figma frame and Style Guide, while content ownership, APIs, migration, and editor workflow are modeled explicitly.

## 2026.Q1 content architecture position

The source currently implements a **Classic CMS compatibility baseline** using Classic Web Content Structures, FreeMarker preview Templates, and site-scoped Documents and Media. These capabilities remain supported, but they are in maintenance mode from 2026.Q1.

The project therefore includes a required modernization gate:

```text
Classic CMS baseline
→ prove the current implementation on a clean 2026.Q1.1 runtime

Liferay CMS + Spaces PoC
→ enable the required release feature flags
→ model equivalent Hero and Service Item content
→ prove page mapping and headless delivery
→ compare migration, permissions, and editor workflow
→ record an ADR before changing the final architecture
```

See:

- [`../architecture/liferay-2026-q1-audit.md`](../architecture/liferay-2026-q1-audit.md)
- [`../tasks/2026-q1-audit-backlog.md`](../tasks/2026-q1-audit-backlog.md)

## Frontend scope

- Extract the Figma composition and detailed Style Guide.
- Build one unified Nexcent Theme client-extension project containing Theme CSS, frontend tokens, Global CSS, Global JavaScript, and favicon configuration.
- Build Hero, Services, and Features as dynamic Custom Element Client Extensions.
- Build Community Updates as an externally hosted Remote App and register it in Liferay.
- Use Liferay OOTB page-building capabilities for Header, Footer, Navigation, and Newsletter where they meet the requirement.
- Implement responsive, loading, empty, error, keyboard, and accessibility states.
- Keep rendering independent from the selected content adapter.
- Do not hard-code business content in TypeScript, JSX, JavaScript, or CSS.

## Backend scope

### Compatibility baseline

- Model the page with Classic Web Content Structures and FreeMarker preview Templates.
- Use stable field references and external reference codes.
- Store editorial images in site-scoped Documents and Media.
- Provide normalized Headless Delivery contracts.
- Define an Excel migration workbook and validation rules.
- Create or update content by ERC without duplicates.
- Generate Batch Client Extension payloads from the target runtime rather than inventing configuration.

### Modernization PoC

- Activate Liferay CMS release feature flags on the 2026.Q1 test runtime.
- Create a Nexcent Space.
- Create equivalent CMS Content Structures and sample content for Hero and Service Item.
- Prove one fragment/page mapping flow and one headless API flow.
- Identify incompatible legacy selectors or components.
- Produce an ADR: adopt, hybrid transition, or defer.

## Asset scope

- Figma is the source of truth for logo, client logos, icons, illustrations, portraits, and community images.
- PR #11 provides the automated Figma REST export mechanism; workflow run #1 and merged PR #13 prove one real full-page reference export and deterministic manifest.
- That accepted thumbnail is comparison evidence only. Component-ready logo, icon, illustration, portrait, and community-image exports are still required before replacing placeholders.
- Approved assets must be named, export-enabled, or mapped explicitly by node ID.
- A generated asset PR must pass visual review before replacing placeholders.
- Immutable application-shell assets belong with Client Extensions or their static host.
- A new Asset Library is not a mandatory MVP dependency.

## Provisioning scope

The target is one observable and rerunnable deployment flow, not an atomic transaction.

Runtime proof is required for:

- each Client Extension archive;
- Style Book import and Theme CSS binding;
- Site Initializer-supported assets;
- Master Page creation/publication/application;
- Navigation Menu provisioning;
- placement and configuration of Custom Elements;
- Newsletter Object/Form behavior;
- clean-instance content and asset import.

No capability is considered delivered only because a source folder or JSON file exists.

## Explicit non-goals

The core delivery does not require:

- OSGi business modules;
- Gogo Shell exercises;
- Service Builder;
- REST Builder BFF;
- legacy Liferay Forms;
- a new shared Asset Library without a demonstrated multi-site requirement.

## Evidence labels

- **VERIFIED:** official capability plus clean-runtime evidence where applicable.
- **IMPLEMENTED / RUNTIME PENDING:** source exists, runtime proof missing.
- **POC REQUIRED:** integration path not accepted yet.
- **OUT OF SCOPE:** intentionally excluded.

## Definition of done

- The landing page matches Figma using accepted assets at desktop, tablet, and mobile sizes.
- The static prototype is clearly identified as mock-backed until a Liferay adapter is proven.
- Theme CSS, Global CSS, Global JavaScript, favicon, Custom Elements, Remote App registration, and Batch CE deploy on a clean 2026.Q1.1 instance.
- Header, Footer, Navigation, and Newsletter use the accepted Liferay OOTB composition.
- Master Page and Navigation Menu provisioning have runtime evidence.
- The accepted content model is editable through Liferay and consumable through stable APIs.
- Excel import is repeatable by ERC.
- Batch migration uses target-runtime-generated `jsont`.
- Partial deployment failure is visible and rerunnable.
- Figma token expiry, rotation, API quota constraints, and generated-asset review are documented.
- The Classic CMS versus Liferay CMS/Spaces decision is recorded in an ADR.
- Final evidence is recorded in `SUBMISSION.md`.
