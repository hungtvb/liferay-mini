#!/usr/bin/env node

import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {spawnSync} from 'node:child_process';

const API_BASE = 'https://api.figma.com/v1';
const SOURCE_CONFIG = process.env.FIGMA_ASSET_CONFIG ?? 'figma-assets.config.json';
const GENERATED_CONFIG = '.figma-assets.style-guide.generated.json';
const RENDERABLE_TYPES = new Set([
  'BOOLEAN_OPERATION',
  'COMPONENT',
  'COMPONENT_SET',
  'FRAME',
  'GROUP',
  'INSTANCE',
  'SECTION',
  'VECTOR',
]);
const CATEGORY_PATTERNS = [
  ['brand', /\b(brand|logo|logotype|wordmark|symbol|mark)\b/i],
  ['clients', /\b(client|customer|partner|company|companies)\b/i],
  ['icons', /\b(icon|icons|pictogram|glyph|service|stat|statistics)\b/i],
  ['illustrations', /\b(illustration|illustrations|hero|feature|graphic|artwork)\b/i],
  ['social', /\b(social|facebook|instagram|linkedin|twitter|youtube|dribbble|behance)\b/i],
];
const CATEGORY_ORDER = ['brand', 'illustrations', 'clients', 'social', 'icons', 'misc'];
const CATEGORY_WEIGHTS = new Map([
  ['brand', 0.15],
  ['illustrations', 0.25],
  ['clients', 0.20],
  ['social', 0.10],
  ['icons', 0.30],
]);
const ASSET_NAME_PATTERN = /\b(logo|logotype|wordmark|icon|pictogram|glyph|illustration|client|customer|partner|social|facebook|instagram|linkedin|twitter|youtube|membership|association|club|event|payment|people|user|stat|hero|feature)\b/i;
const CATEGORY_CONTAINER_PATTERN = /^\s*(brand( assets?)?|logos?|client logos?|clients?|customer logos?|partners?|icons?|service icons?|stat(istic)? icons?|illustrations?|social( icons?)?)\s*$/i;
const EXCLUDE_PATTERN = /\b(thumbnail|style guide|styleguide|background|container|wrapper|section|grid|spacing|typography|font|palette|color|shadow|radius|button|input|header|footer|navbar|navigation|desktop|mobile|tablet)\b/i;

function normalizeNodeId(value) {
  return String(value).replace('-', ':');
}

function slug(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '') || 'asset';
}

function flatten(node, ancestors = [], output = []) {
  output.push({node, ancestors});
  for (const child of node.children ?? []) {
    flatten(child, [...ancestors, node], output);
  }
  return output;
}

function classify(names) {
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (names.some((name) => pattern.test(name))) return category;
  }
  return 'misc';
}

function categoryRank(category) {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function compareCandidates(left, right) {
  const categoryDifference = categoryRank(left.category) - categoryRank(right.category);
  if (categoryDifference !== 0) return categoryDifference;

  const depthDifference = left.ancestors.length - right.ancestors.length;
  if (depthDifference !== 0) return depthDifference;

  return String(left.node.name ?? '').localeCompare(String(right.node.name ?? ''));
}

function hasRasterImage(node) {
  const queue = [node];
  while (queue.length) {
    const current = queue.shift();
    if ((current.fills ?? []).some((fill) => fill?.type === 'IMAGE' && fill.visible !== false)) return true;
    queue.push(...(current.children ?? []));
  }
  return false;
}

function dimensions(node) {
  const box = node.absoluteBoundingBox ?? node.size;
  if (!box) return null;
  return {width: Number(box.width ?? 0), height: Number(box.height ?? 0)};
}

function isReasonableAssetSize(node) {
  const box = dimensions(node);
  if (!box) return true;
  if (box.width <= 0 || box.height <= 0) return false;
  return box.width <= 1600 && box.height <= 1600;
}

function buildCategoryQuotas(maxAssets) {
  const quotas = new Map();
  for (const [category, weight] of CATEGORY_WEIGHTS) {
    quotas.set(category, Math.max(1, Math.floor(maxAssets * weight)));
  }
  return quotas;
}

function selectCandidates(raw, maxAssets) {
  const ordered = [...raw].sort(compareCandidates);
  const selected = [];
  const selectedIds = new Set();

  function trySelect(candidate) {
    if (selected.length >= maxAssets) return false;

    const nodeId = normalizeNodeId(candidate.node.id);
    if (selectedIds.has(nodeId)) return false;

    const ancestorSelected = candidate.ancestors.some((ancestor) =>
      selectedIds.has(normalizeNodeId(ancestor.id)),
    );
    if (ancestorSelected) return false;

    selected.push(candidate);
    selectedIds.add(nodeId);
    return true;
  }

  const quotas = buildCategoryQuotas(maxAssets);
  for (const category of CATEGORY_ORDER) {
    const quota = quotas.get(category) ?? 0;
    if (quota <= 0) continue;

    let categoryCount = 0;
    for (const candidate of ordered) {
      if (candidate.category !== category) continue;
      if (trySelect(candidate)) categoryCount += 1;
      if (categoryCount >= quota || selected.length >= maxAssets) break;
    }
  }

  // Fill unused quota from the remaining candidates while preserving category priority.
  for (const candidate of ordered) {
    if (selected.length >= maxAssets) break;
    trySelect(candidate);
  }

  return selected;
}

function discoverCandidates(root, maxAssets) {
  const flattened = flatten(root);
  const directCategoryChildren = new Set();

  for (const {node} of flattened) {
    const category = classify([node.name ?? '']);
    if (category !== 'misc' && (node.children?.length ?? 0) > 0) {
      for (const child of node.children) directCategoryChildren.add(normalizeNodeId(child.id));
    }
  }

  const raw = [];
  for (const {node, ancestors} of flattened) {
    const nodeId = normalizeNodeId(node.id);
    const name = node.name ?? '';
    const ancestorNames = ancestors.map((ancestor) => ancestor.name ?? '');
    const names = [...ancestorNames, name];
    const category = classify(names);
    const directChildOfCategory = directCategoryChildren.has(nodeId);
    const namedAsset = ASSET_NAME_PATTERN.test(name);
    const insideStyleGuide = names.some((value) => /style\s*guide/i.test(value));
    const hasExistingExport = (node.exportSettings?.length ?? 0) > 0;
    const genericCategoryContainer = CATEGORY_CONTAINER_PATTERN.test(name) && (node.children?.length ?? 0) > 1;

    if (!insideStyleGuide) continue;
    if (!RENDERABLE_TYPES.has(node.type)) continue;
    if (node.visible === false) continue;
    if (!isReasonableAssetSize(node)) continue;
    if (hasExistingExport) continue;
    if (genericCategoryContainer) continue;
    if (!(directChildOfCategory || namedAsset)) continue;
    if (EXCLUDE_PATTERN.test(name) && !namedAsset) continue;
    if (category === 'misc' && !namedAsset) continue;

    raw.push({
      node,
      ancestors,
      category,
      reason: directChildOfCategory ? 'direct-child-of-asset-category' : 'asset-name-match',
    });
  }

  const selected = selectCandidates(raw, maxAssets);
  const usedPaths = new Set();

  return selected.map(({node, ancestors, category, reason}) => {
    const format = hasRasterImage(node) ? 'png' : 'svg';
    const base = slug(node.name);
    let output = `auto/style-guide/${category}/${base}`;
    if (usedPaths.has(`${output}.${format}`)) {
      output = `${output}-${slug(normalizeNodeId(node.id))}`;
    }
    usedPaths.add(`${output}.${format}`);

    return {
      nodeId: normalizeNodeId(node.id),
      name: node.name,
      output,
      format,
      scale: format === 'png' ? 2 : undefined,
      category,
      reason,
      type: node.type,
      dimensions: dimensions(node),
      ancestry: ancestors.map((ancestor) => ancestor.name).filter(Boolean),
    };
  });
}

async function main() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) throw new Error('FIGMA_TOKEN is required.');

  const source = JSON.parse(await readFile(SOURCE_CONFIG, 'utf8'));
  const fileKey = process.env.FIGMA_FILE_KEY ?? source.fileKey;
  const rootNode = normalizeNodeId(process.env.FIGMA_ROOT_NODE ?? source.rootNode ?? '1:2');
  const maxAssets = Number(process.env.FIGMA_STYLE_GUIDE_MAX_ASSETS ?? 80);
  if (!Number.isInteger(maxAssets) || maxAssets < 1 || maxAssets > 200) {
    throw new Error('FIGMA_STYLE_GUIDE_MAX_ASSETS must be an integer from 1 to 200.');
  }

  const query = new URLSearchParams({ids: rootNode});
  const response = await fetch(`${API_BASE}/files/${fileKey}/nodes?${query}`, {
    headers: {'X-Figma-Token': token},
  });
  if (!response.ok) {
    throw new Error(`Figma tree request failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
  }

  const payload = await response.json();
  const root = payload.nodes?.[rootNode]?.document;
  if (!root) throw new Error(`Figma root node ${rootNode} was not found.`);

  const candidates = discoverCandidates(root, maxAssets);
  if (candidates.length === 0) {
    throw new Error('No Style Guide logo/icon/illustration candidates were discovered.');
  }

  const generated = {
    ...source,
    fileKey,
    rootNode,
    assets: [
      ...(source.assets ?? []),
      ...candidates.map(({category, reason, type, dimensions: size, ancestry, ...asset}) => asset),
    ],
  };
  await writeFile(GENERATED_CONFIG, `${JSON.stringify(generated, null, 2)}\n`);

  const result = spawnSync(process.execPath, ['scripts/figma-sync.mjs'], {
    env: {...process.env, FIGMA_ASSET_CONFIG: GENERATED_CONFIG},
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);

  const outputDir = process.env.FIGMA_OUTPUT_DIR ?? source.outputDir ?? 'prototypes/nexcent-static/assets/figma';
  const inventoryPath = path.join(outputDir, 'candidate-inventory.json');
  const byCategory = Object.fromEntries(
    CATEGORY_ORDER
      .map((category) => [category, candidates.filter((candidate) => candidate.category === category).length])
      .filter(([, count]) => count > 0),
  );

  await writeFile(inventoryPath, `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    fileKey,
    rootNode,
    total: candidates.length,
    byCategory,
    candidates,
  }, null, 2)}\n`);

  console.log(`✓ discovered and exported ${candidates.length} Style Guide candidates`);
  console.log(`✓ category allocation ${JSON.stringify(byCategory)}`);
  console.log(`✓ inventory written to ${inventoryPath}`);
}

main().catch((error) => {
  console.error(`Figma Style Guide sync failed: ${error.message}`);
  process.exit(1);
});
