# Figma asset sync

Status: **IMPLEMENTED / FIRST REFERENCE EXPORT ACCEPTED / COMPONENT ASSETS PENDING**

PR #11 added the synchronization mechanism. Workflow [run #1](https://github.com/hungtvb/liferay-mini/actions/runs/29633012081) successfully exported the full-page `Thumbnail` node and a deterministic manifest. GitHub repository settings blocked Actions from opening the PR, so the pushed branch was reviewed through [PR #13](https://github.com/hungtvb/liferay-mini/pull/13) and accepted as visual reference evidence.

No production Figma logo, icon, illustration, testimonial image, or community photo has been accepted yet. Those assets still require component-level prefixes, export settings, or explicit mappings and a separate visual review.

This workflow exports approved assets from the Nexcent Figma frame into the static prototype and opens a pull request for review.

See also:

- [`docs/architecture/liferay-2026-q1-audit.md`](architecture/liferay-2026-q1-audit.md)
- [`docs/tasks/2026-q1-audit-backlog.md`](tasks/2026-q1-audit-backlog.md)

## One-time setup

1. Merge the workflow into the repository default branch so GitHub can expose it under **Actions**.
2. In Figma, create a Personal Access Token with `file_content:read` access to the Nexcent file.
3. Record its expiry date and rotation owner outside source control. Figma Personal Access Tokens have a maximum lifetime of 90 days.
4. In GitHub, open **Settings → Secrets and variables → Actions**.
5. Create a repository secret named `FIGMA_TOKEN`.

Never send the token in chat, commit it, place it in documentation, or print it in workflow logs. The token can only access files that its Figma owner can already access.

## Asset approval is explicit

The script cannot infer that every vector or image inside the frame is a production asset. An asset is eligible only when at least one of these conditions is true:

1. Its layer name follows the project prefix convention.
2. It has an export setting in Figma.
3. Its node ID is explicitly mapped in `figma-assets.config.json`.

Preferred convention:

```text
asset/svg/brand/logo-primary
asset/svg/clients/client-01
asset/svg/icons/service-membership
asset/svg/illustrations/hero
asset/png/testimonial/tim-smith
asset/png/community/community-01
```

The first path segment after `asset/` is the export format. Remaining segments become the repository path under:

```text
prototypes/nexcent-static/assets/figma/
```

The sync also discovers nodes that already have Figma export settings. Those assets are written under `assets/figma/auto/`.

For nodes that cannot be renamed, add explicit mappings to `figma-assets.config.json`:

```json
{
  "nodeId": "123:456",
  "name": "Primary logo",
  "output": "brand/logo-primary",
  "format": "svg"
}
```

## Run the workflow

```text
GitHub → Actions → Sync Figma Assets → Run workflow
```

Inputs:

- `root_node`: frame/node to scan; defaults to `1:2`.
- `prune`: removes stale files from the managed output directory.

The workflow:

1. Reads the configured Figma frame.
2. Discovers prefixed nodes, export-enabled nodes, and explicit mappings.
3. Exports SVG/PNG/JPG/PDF assets through the Figma REST API.
4. Writes files and `manifest.json` with node IDs, hashes, byte sizes, and Figma version metadata.
5. Creates and pushes a review branch when files changed.
6. Attempts to create a pull request. If repository settings prohibit Actions-created PRs, it prints a warning and the manual PR URL without discarding the generated branch.
7. Lets Vercel create a Preview Deployment for visual review.

The workflow never promotes generated files directly to production. Review and merge remain required.

## Local run

```bash
export FIGMA_TOKEN='...'
node scripts/figma-sync.mjs
```

Optional environment overrides:

```text
FIGMA_FILE_KEY
FIGMA_ROOT_NODE
FIGMA_OUTPUT_DIR
FIGMA_MANIFEST_PATH
FIGMA_ASSET_PREFIX
FIGMA_INCLUDE_EXPORT_SETTINGS
FIGMA_RASTER_SCALE
FIGMA_PRUNE
FIGMA_FAIL_ON_EMPTY
```

## Safety rules

- The workflow never commits directly to `main`.
- The token is sent only in the `X-Figma-Token` request header.
- Generated download URLs are not stored in the manifest.
- Duplicate output paths fail the run instead of overwriting an unrelated asset.
- Raster export scale is validated against Figma's supported range of `0.01` to `4`.
- Pruning is limited to `prototypes/nexcent-static/assets/figma/`.
- Placeholder assets are not removed until the generated replacements pass visual review.

## Rate-limit and plan constraints

`GET file nodes` and `GET image` are Tier 1 Figma REST requests. The allowance depends on the seat using the token, the plan containing the target file, and the endpoint tier. Low-access seats can have a very small monthly allowance; the actual limit may be lower than the published maximum.

A normal discovery sync consumes at least:

```text
1 Tier 1 request to read the node tree
+ 1 or more Tier 1 image-render requests grouped by format and scale
```

Therefore:

- Treat the first run as a controlled acceptance test.
- Finalize layer names and mappings before running it.
- Do not repeatedly run discovery to explore the Figma tree.
- Batch node IDs by format and scale.
- Respect `Retry-After` when Figma returns HTTP 429.
- Record rate-limit response headers such as `X-Figma-Plan-Tier`, `X-Figma-Rate-Limit-Type`, and `X-Figma-Upgrade-Link` when available.
- Use a designer-exported ZIP as the fallback when API quota or plan restrictions make automated export impractical.

## First-run acceptance checklist

- [x] PR #11 is merged and the workflow is visible under GitHub Actions.
- [x] `FIGMA_TOKEN` authenticated workflow run #1 without being exposed.
- Token expiry and rotation ownership are recorded outside source control.
- The token owner can view the Nexcent Figma file.
- [x] Run the workflow once with root node `1:2`.
- [x] Confirm the workflow pushes a generated branch rather than modifying `main`.
- [x] Review the first manifest and exported full-page thumbnail.
- [x] Merge the reviewed reference output through PR #13.
- Approved component layers use the naming convention, have export settings, or have explicit node mappings.
- Export and review the production logo, icons, illustrations, testimonial image, and community images.
- Compare desktop and mobile Vercel Preview output against Figma after component assets are wired.
- Record request usage and any rate-limit headers.
- Merge generated assets only after visual acceptance.
