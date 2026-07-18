#!/usr/bin/env node

import {createHash} from 'node:crypto';
import {mkdir, readFile, readdir, rm, stat, writeFile} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const API_BASE = 'https://api.figma.com/v1';
const SUPPORTED_FORMATS = new Set(['svg', 'png', 'jpg', 'pdf']);
const CONFIG_PATH = process.env.FIGMA_ASSET_CONFIG ?? 'figma-assets.config.json';

function envBoolean(name, fallback) {
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function envNumber(name, fallback) {
  const value = process.env[name];
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be a number.`);
  return parsed;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

function normalizeNodeId(value) {
  return String(value).replace('-', ':');
}

function slugSegment(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '') || 'asset';
}

function safeRelativePath(value) {
  const normalized = value
    .split('/')
    .filter(Boolean)
    .map(slugSegment)
    .join('/');

  if (!normalized || normalized.startsWith('../') || path.isAbsolute(normalized)) {
    throw new Error(`Unsafe output path: ${value}`);
  }
  return normalized;
}

function toFormat(value) {
  const format = String(value).toLowerCase();
  if (!SUPPORTED_FORMATS.has(format)) {
    throw new Error(`Unsupported format "${value}". Use svg, png, jpg, or pdf.`);
  }
  return format;
}

function flatten(node, ancestors = [], output = []) {
  output.push({node, ancestors});
  for (const child of node.children ?? []) {
    flatten(child, [...ancestors, node], output);
  }
  return output;
}

function exportSettingToAsset(setting, node, ancestors, outputDir) {
  const format = toFormat(setting.format);
  const suffix = setting.suffix ? slugSegment(setting.suffix) : '';
  const ancestorName = ancestors.at(-1)?.name ? slugSegment(ancestors.at(-1).name) : 'auto';
  const baseName = `${slugSegment(node.name)}${suffix}`;
  const relativePath = safeRelativePath(`auto/${ancestorName}/${baseName}.${format}`);
  const scale = setting.constraint?.type === 'SCALE' ? Number(setting.constraint.value) : undefined;

  return {
    nodeId: normalizeNodeId(node.id),
    sourceName: node.name,
    format,
    scale,
    relativePath,
    outputPath: path.join(outputDir, relativePath),
    discovery: 'export-setting',
  };
}

function prefixedNodeToAsset(node, prefix, defaultRasterScale, outputDir) {
  if (!node.name?.startsWith(prefix)) return null;

  const declaration = node.name.slice(prefix.length);
  const [formatRaw, ...pathParts] = declaration.split('/').filter(Boolean);
  if (!formatRaw || pathParts.length === 0) {
    throw new Error(
      `Layer "${node.name}" must follow ${prefix}<format>/<path>, for example ${prefix}svg/brand/logo-primary.`,
    );
  }

  const format = toFormat(formatRaw);
  const relativeWithoutExtension = safeRelativePath(pathParts.join('/'));
  const relativePath = relativeWithoutExtension.endsWith(`.${format}`)
    ? relativeWithoutExtension
    : `${relativeWithoutExtension}.${format}`;

  return {
    nodeId: normalizeNodeId(node.id),
    sourceName: node.name,
    format,
    scale: format === 'svg' || format === 'pdf' ? undefined : defaultRasterScale,
    relativePath,
    outputPath: path.join(outputDir, relativePath),
    discovery: 'prefix',
  };
}

function explicitAssetToAsset(entry, defaultRasterScale, outputDir) {
  if (!entry.nodeId || !entry.output || !entry.format) {
    throw new Error('Each explicit asset needs nodeId, output, and format.');
  }

  const format = toFormat(entry.format);
  const outputWithoutLeadingSlash = String(entry.output).replace(/^\/+/, '');
  const relativePath = safeRelativePath(
    outputWithoutLeadingSlash.endsWith(`.${format}`)
      ? outputWithoutLeadingSlash
      : `${outputWithoutLeadingSlash}.${format}`,
  );

  return {
    nodeId: normalizeNodeId(entry.nodeId),
    sourceName: entry.name ?? entry.output,
    format,
    scale: format === 'svg' || format === 'pdf' ? undefined : Number(entry.scale ?? defaultRasterScale),
    relativePath,
    outputPath: path.join(outputDir, relativePath),
    discovery: 'config',
  };
}

function assertUniqueAssets(assets) {
  const byPath = new Map();
  const unique = [];

  for (const asset of assets) {
    const key = asset.relativePath.toLowerCase();
    const previous = byPath.get(key);
    if (previous) {
      if (previous.nodeId === asset.nodeId && previous.format === asset.format) continue;
      throw new Error(
        `Multiple Figma nodes map to ${asset.relativePath}: ${previous.nodeId} and ${asset.nodeId}.`,
      );
    }
    byPath.set(key, asset);
    unique.push(asset);
  }

  return unique;
}

async function fetchWithRetry(url, options = {}, attempts = 4) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;

      const body = await response.text();
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt === attempts) {
        throw new Error(`Figma request failed (${response.status}): ${body.slice(0, 500)}`);
      }

      const retryAfter = Number(response.headers.get('retry-after'));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 1000 * 2 ** (attempt - 1);
      console.warn(`Figma returned ${response.status}; retrying in ${waitMs}ms...`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
      const waitMs = 1000 * 2 ** (attempt - 1);
      console.warn(`Request error; retrying in ${waitMs}ms: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  throw lastError;
}

async function figmaJson(endpoint, token) {
  const response = await fetchWithRetry(`${API_BASE}${endpoint}`, {
    headers: {'X-Figma-Token': token},
  });
  return response.json();
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function groupByExportOptions(assets) {
  const groups = new Map();
  for (const asset of assets) {
    const scale = asset.format === 'svg' || asset.format === 'pdf' ? 1 : asset.scale;
    const key = `${asset.format}:${scale}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(asset);
  }
  return groups;
}

async function discoverAssets(config, token) {
  const explicitAssets = (config.assets ?? []).map((entry) =>
    explicitAssetToAsset(entry, config.defaults.rasterScale, config.outputDir),
  );

  const needsDiscovery = config.discovery.prefix || config.discovery.includeExportSettings;
  if (!needsDiscovery) return {assets: explicitAssets, file: {}};

  const query = new URLSearchParams({ids: config.rootNode});
  const payload = await figmaJson(`/files/${config.fileKey}/nodes?${query}`, token);
  const root = payload.nodes?.[config.rootNode]?.document;
  if (!root) {
    throw new Error(`Figma root node ${config.rootNode} was not found in file ${config.fileKey}.`);
  }

  const discovered = [];
  for (const {node, ancestors} of flatten(root)) {
    if (config.discovery.prefix) {
      const asset = prefixedNodeToAsset(
        node,
        config.discovery.prefix,
        config.defaults.rasterScale,
        config.outputDir,
      );
      if (asset) discovered.push(asset);
    }

    if (config.discovery.includeExportSettings && !node.name?.startsWith(config.discovery.prefix)) {
      for (const setting of node.exportSettings ?? []) {
        if (!SUPPORTED_FORMATS.has(String(setting.format).toLowerCase())) continue;
        discovered.push(exportSettingToAsset(setting, node, ancestors, config.outputDir));
      }
    }
  }

  return {
    assets: [...explicitAssets, ...discovered],
    file: {
      name: payload.name,
      version: payload.version,
      lastModified: payload.lastModified,
    },
  };
}

async function downloadAssets(assets, config, token) {
  const results = [];
  const groups = groupByExportOptions(assets);

  for (const groupedAssets of groups.values()) {
    for (const batch of chunk(groupedAssets, 50)) {
      const {format} = batch[0];
      const scale = format === 'svg' || format === 'pdf' ? undefined : batch[0].scale;
      const query = new URLSearchParams({
        ids: batch.map((asset) => asset.nodeId).join(','),
        format,
        contents_only: 'true',
      });

      if (scale != null) query.set('scale', String(scale));
      if (format === 'svg') {
        query.set('svg_outline_text', String(config.defaults.svgOutlineText));
        query.set('svg_include_id', String(config.defaults.svgIncludeId));
        query.set('svg_simplify_stroke', String(config.defaults.svgSimplifyStroke));
      }

      const payload = await figmaJson(`/images/${config.fileKey}?${query}`, token);

      for (const asset of batch) {
        const downloadUrl = payload.images?.[asset.nodeId];
        if (!downloadUrl) {
          throw new Error(`Figma could not render node ${asset.nodeId} (${asset.sourceName}).`);
        }

        const response = await fetchWithRetry(downloadUrl);
        const bytes = Buffer.from(await response.arrayBuffer());
        await mkdir(path.dirname(asset.outputPath), {recursive: true});
        await writeFile(asset.outputPath, bytes);

        results.push({
          ...asset,
          bytes: bytes.length,
          sha256: createHash('sha256').update(bytes).digest('hex'),
        });
        console.log(`✓ ${asset.nodeId} → ${asset.relativePath}`);
      }
    }
  }

  return results;
}

async function listFilesRecursive(directory) {
  const files = [];
  let entries;
  try {
    entries = await readdir(directory, {withFileTypes: true});
  } catch (error) {
    if (error.code === 'ENOENT') return files;
    throw error;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFilesRecursive(fullPath));
    else files.push(fullPath);
  }
  return files;
}

async function pruneManagedFiles(outputDir, keepPaths, manifestPath) {
  const files = await listFilesRecursive(outputDir);
  for (const filePath of files) {
    const normalized = path.resolve(filePath);
    if (normalized === path.resolve(manifestPath)) continue;
    if (!keepPaths.has(normalized)) {
      await rm(filePath, {force: true});
      console.log(`− removed stale asset ${path.relative(outputDir, filePath)}`);
    }
  }
}

async function loadConfig() {
  const raw = await readJson(CONFIG_PATH);
  const outputDir = process.env.FIGMA_OUTPUT_DIR ?? raw.outputDir ?? 'prototypes/nexcent-static/assets/figma';
  const manifestPath = process.env.FIGMA_MANIFEST_PATH ?? raw.manifestPath ?? path.join(outputDir, 'manifest.json');

  return {
    fileKey: process.env.FIGMA_FILE_KEY ?? raw.fileKey,
    rootNode: normalizeNodeId(process.env.FIGMA_ROOT_NODE ?? raw.rootNode ?? '1:2'),
    outputDir,
    manifestPath,
    discovery: {
      prefix: process.env.FIGMA_ASSET_PREFIX ?? raw.discovery?.prefix ?? 'asset/',
      includeExportSettings: envBoolean(
        'FIGMA_INCLUDE_EXPORT_SETTINGS',
        raw.discovery?.includeExportSettings ?? true,
      ),
    },
    defaults: {
      rasterScale: envNumber('FIGMA_RASTER_SCALE', raw.defaults?.rasterScale ?? 2),
      svgOutlineText: envBoolean('FIGMA_SVG_OUTLINE_TEXT', raw.defaults?.svgOutlineText ?? true),
      svgIncludeId: envBoolean('FIGMA_SVG_INCLUDE_ID', raw.defaults?.svgIncludeId ?? false),
      svgSimplifyStroke: envBoolean(
        'FIGMA_SVG_SIMPLIFY_STROKE',
        raw.defaults?.svgSimplifyStroke ?? true,
      ),
    },
    prune: envBoolean('FIGMA_PRUNE', raw.prune ?? true),
    failOnEmpty: envBoolean('FIGMA_FAIL_ON_EMPTY', raw.failOnEmpty ?? true),
    assets: raw.assets ?? [],
  };
}

async function main() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) throw new Error('FIGMA_TOKEN is required. Store it in GitHub Actions secrets.');

  const config = await loadConfig();
  if (!config.fileKey) throw new Error('FIGMA_FILE_KEY is required in config or environment.');
  if (config.defaults.rasterScale < 0.01 || config.defaults.rasterScale > 4) {
    throw new Error('FIGMA_RASTER_SCALE must be between 0.01 and 4.');
  }

  const discovery = await discoverAssets(config, token);
  const assets = assertUniqueAssets(discovery.assets);

  if (assets.length === 0) {
    const message = `No assets found under node ${config.rootNode}. Prefix layers with ${config.discovery.prefix}<format>/<path>, add Figma export settings, or list node IDs in ${CONFIG_PATH}.`;
    if (config.failOnEmpty) throw new Error(message);
    console.log(message);
    return;
  }

  console.log(`Syncing ${assets.length} asset(s) from Figma file ${config.fileKey}, node ${config.rootNode}...`);
  await mkdir(config.outputDir, {recursive: true});
  const downloaded = await downloadAssets(assets, config, token);

  const keepPaths = new Set(downloaded.map((asset) => path.resolve(asset.outputPath)));
  if (config.prune) await pruneManagedFiles(config.outputDir, keepPaths, config.manifestPath);

  const manifest = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      provider: 'figma',
      fileKey: config.fileKey,
      rootNode: config.rootNode,
      fileName: discovery.file.name ?? null,
      version: discovery.file.version ?? null,
      lastModified: discovery.file.lastModified ?? null,
    },
    assets: downloaded
      .sort((left, right) => left.relativePath.localeCompare(right.relativePath))
      .map(({outputPath, ...asset}) => asset),
  };

  await mkdir(path.dirname(config.manifestPath), {recursive: true});
  await writeFile(config.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const manifestStats = await stat(config.manifestPath);
  console.log(`Manifest written to ${config.manifestPath} (${manifestStats.size} bytes).`);
}

main().catch((error) => {
  console.error(`Figma asset sync failed: ${error.message}`);
  process.exitCode = 1;
});
