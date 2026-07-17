# 02 — Define Component-by-Component FE–BE Contracts

## Goal

Freeze the integration contract before FE and BE work in parallel.

Use [`../contracts/component-contracts.md`](../contracts/component-contracts.md) as the source of truth.

## Contract template

For each Figma component record:

```text
Component name
Figma node/frame
FE delivery technology
BE content owner
Structure name
Template name
Field references and types
Required/optional fields
Allowed select values
ERC convention
Headless API source
Loading/empty/error behavior
Desktop/tablet/mobile behavior
Accessibility requirements
Migration sheet
Acceptance evidence
```

## Required decisions

| Component | Delivery decision |
|---|---|
| Header/Footer | Master Page or Fragment + Navigation Menus |
| Hero | Custom Element |
| Client Logos | Collection presentation |
| Services | Custom Element |
| Feature sections | Custom Element with reusable renderer |
| Statistics | Collection presentation |
| Testimonial | Collection presentation |
| Community Updates | Externally hosted Remote App |
| CTA | Mapped content component |
| Importer | Custom Element |
| Batch migration | Batch Client Extension |

## FE rules

- Generate typed view models from the agreed fields.
- Do not directly depend on field labels; use field references.
- Do not commit numeric Structure or site IDs.
- Do not add business-content fallbacks.

## BE rules

- Field references are API contracts and cannot change silently.
- Lists use separate articles rather than one giant HTML field.
- Rich Text is used only when formatting is required.
- Media and link validation are explicit.
- ERCs remain stable across environments.

## Integration fixture

BE provides one valid API response example for every component. FE stores sanitized fixtures for unit tests, not production fallback content.

## Checkpoint

- [ ] Every component has one delivery technology and one content owner.
- [ ] FE types and BE fields match.
- [ ] Workbook columns match field references.
- [ ] Open contract questions are resolved before component coding.
