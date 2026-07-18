# Nexcent delivery backlog after the 2026.Q1 audit

Updated: 2026-07-18

Source of truth for factual constraints: [`docs/architecture/liferay-2026-q1-audit.md`](../architecture/liferay-2026-q1-audit.md)

## P0 — Required before claiming a production-ready final source

### NXC-AUD-01 — Run the first controlled Figma asset sync

Status: **PARTIALLY COMPLETE — reference export accepted; component assets pending**

Evidence:

- Workflow run #1 authenticated successfully and exported node `204:686` plus a deterministic manifest.
- The generated branch was pushed even though repository settings blocked GitHub Actions from opening the PR automatically.
- [PR #13](https://github.com/hungtvb/liferay-mini/pull/13) was created through the GitHub connector, visually reviewed, and merged as reference evidence.
- The accepted file is a full-page thumbnail, not the production component asset set.

Acceptance criteria:

- PR #11 is merged.
- `FIGMA_TOKEN` exists as a GitHub Actions secret and is never printed or committed.
- Token expiry date and rotation owner are recorded outside source control.
- Approved layers use `asset/<format>/<path>`, existing export settings, or explicit node mappings.
- One workflow run pushes a generated branch and either opens a PR or prints the manual PR URL when repository settings prohibit Actions-created PRs.
- Generated logo, icons, illustrations, photos, and manifest are visually compared with Figma.
- Placeholder files are replaced only after review.
- Tier 1 request consumption and any 429 response headers are recorded.

### NXC-AUD-02 — Prove the current Classic CMS baseline on Liferay 2026.Q1.1

Status: **RUNTIME PENDING**

Acceptance criteria:

- Clean 2026.Q1.1 bundle starts successfully with Java 21.
- Theme CSS, Global CSS, Global JS, favicon, Custom Elements, Remote App registration, and Batch CE deploy without unresolved errors.
- Existing Web Content structures/templates and sample content can be created or imported.
- Excel import creates entries on first run and updates by ERC on second run.
- Headless Delivery calls return normalized content for Hero, Services, and Features.
- Evidence is added to `SUBMISSION.md`.

### NXC-AUD-03 — Build a Site Initializer bootstrap PoC

Status: **POC REQUIRED**

Scope:

- Site configuration.
- Content page and page template definitions.
- Fragment set and Style Book values.
- Site-scoped documents and sample content supported by the initializer.

Acceptance criteria:

- A clean instance receives the site from source.
- Every included asset type is backed by a documented Liferay initializer import path.
- The PoC is idempotent or documents non-idempotent behavior precisely.
- Partial failure is visible and rerunnable.
- No numeric environment IDs are committed.

### NXC-AUD-04 — Prove Master Page, header/footer, and Navigation Menu provisioning

Status: **POC REQUIRED**

Acceptance criteria:

- Master Page is created, published, and applied to the landing page on a clean instance.
- Header and footer use OOTB fragments/page-building capabilities.
- Menu items are editor-managed through Navigation Menus.
- Desktop and mobile hamburger behavior passes keyboard and screen-size tests.
- Required 2026.Q1 navigation import feature flags are documented when LAR/batch import is used.
- Staging limitations are documented.
- Unsupported Site Initializer assumptions are removed.

### NXC-AUD-05 — Evaluate Liferay CMS + Spaces as the modern content target

Status: **POC REQUIRED**

Acceptance criteria:

- Enable and record `LPD-34594`, `LPD-11235`, and `LPD-17564` on 2026.Q1.
- Create a Nexcent Space and equivalent content structures for at least Hero and Service Item.
- Create sample CMS content and files.
- Prove one page mapping flow and one headless API flow.
- Document selectors/fragments that are incompatible with CMS objects.
- Compare editor workflow, permissions, API payload, migration effort, and rollback against Classic CMS.
- Produce an ADR: adopt, hybrid, or defer.

## P1 — Required for end-to-end delivery quality

### NXC-AUD-06 — Replace placeholder assets and wire the manifest

Status: **BLOCKED — component-level Figma mappings/exports required**

Acceptance criteria:

- Static prototype uses generated logo, client logos, service/stat icons, illustrations, testimonial image, community images, and social icons.
- Broken or missing generated files fail CI.
- Asset paths are centralized through the manifest or a deterministic adapter.
- Vercel Preview is visually compared with the Figma reference at desktop and mobile widths.

### NXC-AUD-07 — Replace static mock loading with a Liferay data adapter

Status: **IMPLEMENTED / TARGET RUNTIME PENDING**

Evidence:

- `prototypes/nexcent-static/headless-adapter.mjs` resolves Structures and normalizes all landing-page content groups.
- Mock mode remains available and Headless mode is selected through explicit query parameters.
- Node tests cover the normalized Classic Headless Delivery contract.
- Missing portal/site configuration produces an actionable retry state.

Acceptance criteria:

- Rendering remains independent from the data source.
- Mock mode remains available for frontend development.
- Liferay mode supports the accepted Classic CMS or CMS/Spaces contract.
- Loading, empty, error, authentication, and malformed-content states are demonstrated.
- No site ID, structure ID, file entry ID, or content ID is hard-coded.

### NXC-AUD-08 — Create the content and asset strategy ADR

Status: **NOT STARTED**

Decision options:

- Classic CMS baseline only.
- Liferay CMS + Spaces.
- Hybrid transition.

The ADR must explicitly address maintenance mode, feature flags, page mapping, headless APIs, Excel import, Batch CE, permissions, multi-site reuse, and clean-environment bootstrap.

### NXC-AUD-09 — Add clean-environment verification automation

Status: **PARTIAL — source, CI, and browser checks implemented; clean Liferay deployment pending**

Acceptance criteria:

- One command builds all packages.
- Deployment status is checked per Client Extension.
- Site/page/content existence is checked after provisioning.
- API smoke tests verify normalized contracts.
- Browser smoke tests verify rendering and hamburger interaction.
- The pipeline reports partial success instead of treating deployment as atomic.

## P2 — Optional automation after the baseline is stable

### NXC-AUD-10 — Improve Figma sync quota handling

Status: **BACKLOG**

Candidate work:

- Explicit-node-only mode that skips the node-tree discovery request.
- Read and report `X-Figma-Plan-Tier`, `X-Figma-Rate-Limit-Type`, `Retry-After`, and `X-Figma-Upgrade-Link` on 429.
- Stop rather than sleeping beyond the workflow timeout.
- Cache the last Figma version and skip rendering when unchanged, where the API budget permits.
- Add script tests for path safety, duplicate outputs, manifests, and 429 handling.

### NXC-AUD-11 — Trigger sync from an approved Figma event

Status: **DEFERRED**

Only consider a file webhook or Dev Mode status workflow after:

- the Figma plan and seat provide a practical request budget;
- manual sync is reliable;
- token rotation is operational;
- generated PR review is retained.

## Explicitly removed claims

The project must not claim any of the following without runtime evidence:

- Asset Library creation and site connection are automatically provisioned.
- Navigation Menus are automatically created by the Site Initializer.
- Master Page composition is automatically imported and published.
- Custom Elements are automatically placed and configured on the final page.
- A single deployment command is atomic.
- The static Vercel prototype proves a live Liferay integration.
- The first Figma reference thumbnail represents the complete production component asset set.
