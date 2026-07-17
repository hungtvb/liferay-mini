# 00 — Project Brief and Acceptance Criteria

## Goal

Deliver the Nexcent Figma landing page as a coordinated FE–BE Liferay project.

The assignment is successful only when:

- The visual result follows the landing-page composition and detailed Style Guide.
- Content is editable in Liferay and not hard-coded in frontend source.
- FE and BE agree on stable component contracts before implementation.
- At least three complete Custom Elements and one externally hosted Remote App are demonstrated.
- Excel and Batch migration flows are repeatable.

## Roles

### Frontend

- Figma decomposition and responsive specification.
- Theme CSS, Style Book, Global CSS/JS.
- Custom Elements and Remote App.
- Loading, empty, error, and accessibility states.

### Backend

- Web Content Structures and Templates.
- Documents and Media.
- Headless API contracts and permissions.
- Excel schema, validation, importer support, and Batch Client Extension.

### Joint

- Component contracts.
- ERC conventions.
- Sample content.
- Integration tests and evidence.

## Core technologies

```text
Liferay DXP 2026.Q1.1 LTS
Java 21
Liferay Workspace 16.0.3
React + TypeScript + Vite
Theme CSS / Style Book
Global CSS / Global JavaScript
Custom Element Client Extensions
Remote Custom Element application
Classic Web Content
Headless Delivery
Documents and Media
ExcelJS
Batch Client Extension
Headless Batch Engine
```

## Non-goals

The core assignment does not require:

- OSGi business modules.
- Gogo Shell exercises.
- Service Builder.
- REST Builder BFF.
- Liferay Forms.

These are introduced only when a real requirement needs them.

## Required deliverables

1. Figma audit and asset manifest.
2. Style Guide token mapping.
3. Component-by-component FE–BE contract.
4. Web Content models and Templates.
5. Hero, Services, and Features Custom Elements.
6. Community Updates Remote App.
7. Excel importer.
8. Batch Client Extension.
9. Responsive and accessibility evidence.
10. Final demo and submission report.

## Definition of Done

- No business copy or content arrays are hard-coded in FE source.
- No numeric environment IDs are committed as configuration.
- Every content item has a stable ERC.
- First Excel import creates; second import updates without duplicates.
- Batch payload is generated from Batch Engine `jsont`.
- Desktop, tablet, mobile, loading, empty, error, and signed-out behavior are demonstrated.
