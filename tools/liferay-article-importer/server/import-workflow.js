import {IMAGE_SOURCE_TYPES, VIEWABLE_BY_VALUES} from './config.js';
import {assert} from './errors.js';
import {ImageResolver} from './image-resolver.js';
import {analyzeStructure} from './structure-analyzer.js';
import {validateAndBuildPayload} from './validation.js';
import {buildTemplateWorkbook, parseTemplateWorkbook} from './workbook.js';

function normalizeLocale(value) {
  return String(value || '').trim().replace('_', '-').toLowerCase();
}

function normalizeViewableBy(value, fallback) {
  const normalized = String(value || fallback || '').trim();
  assert(VIEWABLE_BY_VALUES.includes(normalized), 400, 'VISIBILITY_INVALID', `Content visibility must be one of: ${VIEWABLE_BY_VALUES.join(', ')}`);
  return normalized;
}

export function imageSourceInput(input = {}) {
  return {
    folderId: input.imageSourceFolderId || null,
    id: input.imageSourceId,
    type: input.imageSourceType
  };
}

export class ImportWorkflow {
  constructor({config, liferay}) {
    this.config = config;
    this.liferay = liferay;
  }

  async connect() {
    return this.liferay.connect();
  }

  async resolveSelection({folderId, structureId, viewableBy, ...scopeInput}) {
    assert(structureId, 400, 'STRUCTURE_REQUIRED', 'Select a Content Structure');
    assert(folderId, 400, 'TARGET_FOLDER_REQUIRED', 'Select a target Web Content folder');

    const scope = imageSourceInput(scopeInput);
    assert(IMAGE_SOURCE_TYPES.includes(scope.type), 400, 'IMAGE_SOURCE_INVALID', `Image source type must be one of: ${IMAGE_SOURCE_TYPES.join(', ')}`);

    const [structure, folder, imageSource] = await Promise.all([
      this.liferay.getContentStructure(structureId),
      this.liferay.getStructuredContentFolder(folderId),
      this.liferay.resolveImageSource(scope)
    ]);

    const selectedLocale = this.config.defaultLocale;
    const analysis = analyzeStructure(structure, selectedLocale);
    assert(analysis.status !== 'UNSUPPORTED', 409, 'STRUCTURE_UNSUPPORTED', 'Selected Structure is not supported by the flat importer', {blockingFields: analysis.blockingFields});
    assert(String(structure.siteId ?? '') === String(this.config.siteId), 400, 'STRUCTURE_SITE_MISMATCH', 'Selected Structure does not belong to the configured Site');

    const languages = analysis.availableLanguages.map(normalizeLocale);
    assert(languages.length === 0 || languages.includes(normalizeLocale(selectedLocale)), 400, 'DEFAULT_LOCALE_UNSUPPORTED', `Default locale ${selectedLocale} is not available for the selected Structure`);

    if (folder.siteId != null) {
      assert(String(folder.siteId) === String(this.config.siteId), 400, 'TARGET_FOLDER_CHANGED', 'Selected folder does not belong to the configured Site');
    }

    return {
      analysis,
      folder: {externalReferenceCode: folder.externalReferenceCode || null, id: folder.id, name: folder.name, siteId: folder.siteId},
      imageSource,
      locale: selectedLocale,
      structure,
      viewableBy: normalizeViewableBy(viewableBy, this.config.defaultViewableBy)
    };
  }

  async buildTemplate(selectionInput) {
    const selection = await this.resolveSelection(selectionInput);
    const template = await buildTemplateWorkbook({
      folder: selection.folder,
      imageSource: selection.imageSource,
      locale: selection.locale,
      siteId: this.config.siteId,
      structure: selection.structure,
      viewableBy: selection.viewableBy
    });
    return {selection, template};
  }

  async parseWorkbook(buffer, selection) {
    const workbook = await parseTemplateWorkbook(buffer, {
      folder: selection.folder,
      imageSource: selection.imageSource,
      locale: selection.locale,
      siteId: this.config.siteId,
      structure: selection.structure,
      viewableBy: selection.viewableBy
    });
    assert(workbook.rows.length <= this.config.maxImportRows, 400, 'MAX_ROWS_EXCEEDED', `Workbook contains ${workbook.rows.length} rows; limit is ${this.config.maxImportRows}`);
    return workbook;
  }

  async validate(workbook, selection) {
    const existingContents = await this.liferay.listSiteStructuredContents();
    const imageResolver = new ImageResolver({imageSource: selection.imageSource, liferay: this.liferay});

    return validateAndBuildPayload({
      existingContents,
      folder: selection.folder,
      imageResolver,
      locale: selection.locale,
      mapping: workbook.mapping,
      rowNumbers: workbook.rowNumbers,
      rows: workbook.rows,
      structure: selection.structure,
      targets: workbook.targets,
      viewableBy: selection.viewableBy
    });
  }

  async validateBuffer(buffer, selectionInput) {
    const selection = await this.resolveSelection(selectionInput);
    const workbook = await this.parseWorkbook(buffer, selection);
    const validation = await this.validate(workbook, selection);
    return {selection, validation, workbook};
  }

  async revalidate(workbook, selectionInput) {
    const selection = await this.resolveSelection(selectionInput);
    const validation = await this.validate(workbook, selection);
    return {selection, validation};
  }
}
