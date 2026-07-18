# Figma asset sync

This workflow exports approved assets from the Nexcent Figma frame into the static prototype and opens a pull request for review.

## One-time setup

1. In Figma, create a Personal Access Token with `file_content:read` access to the Nexcent file.
2. In GitHub, open **Settings → Secrets and variables → Actions**.
3. Create a repository secret named `FIGMA_TOKEN`.

Never commit the token to this repository.

## Mark assets in Figma

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
5. Creates a branch and pull request when files changed.
6. Lets Vercel create a Preview Deployment for visual review.

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

## Rate limits

Figma applies REST API rate limits according to plan, seat, endpoint tier, and file ownership. Avoid repeatedly running the workflow while testing layer names. A normal sync uses one node-tree request plus batched render requests grouped by format and scale.

## First-run checklist

- Add the `FIGMA_TOKEN` GitHub secret.
- Rename approved layers with the `asset/<format>/<path>` convention or configure export settings.
- Run the workflow with root node `1:2`.
- Review generated assets, manifest, and Vercel Preview.
- Merge only after visual comparison with the Figma frame.
