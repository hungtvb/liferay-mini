package com.nexcent.training.article.importer.internal;

import com.liferay.asset.kernel.model.AssetCategory;
import com.liferay.asset.kernel.service.AssetCategoryLocalService;
import com.liferay.document.library.kernel.model.DLVersionNumberIncrease;
import com.liferay.document.library.kernel.model.FileEntry;
import com.liferay.document.library.kernel.service.DLAppLocalService;
import com.liferay.dynamic.data.mapping.model.DDMStructure;
import com.liferay.dynamic.data.mapping.service.DDMStructureLocalService;
import com.liferay.headless.delivery.dto.v1_0.ContentDocument;
import com.liferay.headless.delivery.dto.v1_0.ContentField;
import com.liferay.headless.delivery.dto.v1_0.ContentFieldValue;
import com.liferay.headless.delivery.dto.v1_0.StructuredContent;
import com.liferay.headless.delivery.resource.v1_0.StructuredContentResource;
import com.liferay.journal.model.JournalArticle;
import com.liferay.journal.service.JournalArticleLocalService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.ContentTypes;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.StringPool;
import com.liferay.portal.kernel.workflow.WorkflowConstants;
import com.nexcent.training.article.importer.ArticleImportException;
import com.nexcent.training.article.importer.ArticleImportManager;
import com.nexcent.training.article.importer.ArticleImportStatus;
import com.nexcent.training.model.ArticleImportState;
import com.nexcent.training.model.ImportJob;
import com.nexcent.training.model.ImportJobItem;
import com.nexcent.training.service.ArticleImportStateLocalService;
import com.nexcent.training.service.ImportJobItemLocalService;
import com.nexcent.training.service.ImportJobLocalService;

import java.io.InputStream;

import java.nio.charset.StandardCharsets;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ArticleImportManager.class)
public class ArticleImportManagerImpl implements ArticleImportManager {

    @Override
    public ImportJob execute(
            long userId, long groupId, String externalReferenceCode)
        throws PortalException {

        ImportJob importJob = _getImportJob(
            groupId, externalReferenceCode);

        _importJobLocalService.transitionImportJob(
            importJob.getImportJobId(), ArticleImportStatus.VALIDATED,
            ArticleImportStatus.RUNNING);

        int createdRows = 0;
        int updatedRows = 0;
        int skippedRows = 0;
        int failedRows = 0;

        try {
            List<ArticleImportRow> rows = _parser.parse(
                _readWorkbook(importJob));
            Map<Integer, ImportJobItem> items = _getItems(importJob);

            for (ArticleImportRow row : rows) {
                ImportJobItem item = items.get(row.rowNumber);

                if (item == null) {
                    throw new ArticleImportException(
                        "VALIDATION_RESULT_MISSING",
                        "No validation result exists for row " +
                            row.rowNumber);
                }

                if ("NO_CHANGE".equals(item.getResult())) {
                    skippedRows++;
                    continue;
                }

                try {
                    if ("ARCHIVE".equals(row.operation)) {
                        _archive(userId, groupId, row);
                        _markItem(item, "ARCHIVE", "INFO", StringPool.BLANK,
                            "Article expired");
                    }
                    else {
                        _upsert(userId, importJob, row);

                        if ("CREATE".equals(item.getResult())) {
                            createdRows++;
                        }
                        else {
                            updatedRows++;
                        }

                        _articleImportStateLocalService.
                            updateArticleImportState(
                                importJob.getCompanyId(), groupId,
                                row.externalReferenceCode, row.locale,
                                item.getPayloadHash(),
                                importJob.getImportJobId());
                        _markItem(
                            item, item.getResult(), "INFO", StringPool.BLANK,
                            "Article imported");
                    }
                }
                catch (Exception exception) {
                    failedRows++;
                    _markItem(
                        item, "ERROR", "ERROR", "EXECUTION_FAILED",
                        _safeMessage(exception));
                }
            }

            String status = (failedRows == 0) ?
                ArticleImportStatus.COMPLETED :
                    ArticleImportStatus.COMPLETED_WITH_ERRORS;

            return _importJobLocalService.updateImportJobResult(
                importJob.getImportJobId(), status, rows.size(), createdRows,
                updatedRows, skippedRows, failedRows, StringPool.BLANK, true);
        }
        catch (Exception exception) {
            _importJobLocalService.updateImportJobResult(
                importJob.getImportJobId(), ArticleImportStatus.FAILED,
                importJob.getTotalRows(), createdRows, updatedRows,
                skippedRows, failedRows, _safeMessage(exception), true);

            if (exception instanceof PortalException) {
                throw (PortalException)exception;
            }

            throw new ArticleImportException(
                "EXECUTION_FAILED", "Article import execution failed",
                exception);
        }
    }

    @Override
    public ImportJob upload(
            long userId, long companyId, long groupId,
            String externalReferenceCode, String structureERC,
            String fileName, String contentType, byte[] bytes,
            ServiceContext serviceContext)
        throws PortalException {

        _validateUpload(
            externalReferenceCode, fileName, contentType, bytes);

        serviceContext.setAddGuestPermissions(false);
        serviceContext.setAddGroupPermissions(false);

        FileEntry fileEntry =
            _dlAppLocalService.fetchFileEntryByExternalReferenceCode(
                groupId, externalReferenceCode);

        if (fileEntry == null) {
            fileEntry = _dlAppLocalService.addFileEntry(
                externalReferenceCode, userId, groupId, 0, fileName,
                _XLSX_MIME_TYPE, bytes, null, null, null, serviceContext);
        }
        else {
            fileEntry = _dlAppLocalService.updateFileEntry(
                userId, fileEntry.getFileEntryId(), fileName,
                _XLSX_MIME_TYPE, fileName, null,
                "Nexcent Article import workbook", "Workbook re-upload",
                DLVersionNumberIncrease.MAJOR, bytes, null, null, null,
                serviceContext);
        }

        return _importJobLocalService.addOrResetImportJob(
            userId, groupId, externalReferenceCode,
            fileEntry.getFileEntryId(), fileName, _sha256(bytes),
            structureERC, serviceContext);
    }

    @Override
    public ImportJob validate(
            long userId, long groupId, String externalReferenceCode)
        throws PortalException {

        ImportJob importJob = _getImportJob(
            groupId, externalReferenceCode);
        String status = importJob.getStatus();

        if (!ArticleImportStatus.UPLOADED.equals(status) &&
            !ArticleImportStatus.INVALID.equals(status)) {

            throw new ArticleImportException(
                "INVALID_STATE", "Validation requires UPLOADED or INVALID");
        }

        _importJobLocalService.transitionImportJob(
            importJob.getImportJobId(), status,
            ArticleImportStatus.VALIDATING);
        _importJobItemLocalService.deleteImportJobItems(
            importJob.getImportJobId());

        try {
            List<ArticleImportRow> rows = _parser.parse(
                _readWorkbook(importJob));
            ValidationContext context = _validationContext(importJob);
            Set<String> identities = new HashSet<>();
            Set<String> slugs = new HashSet<>();
            int failedRows = 0;
            int skippedRows = 0;

            for (ArticleImportRow row : rows) {
                List<ValidationError> errors = _validateRow(
                    context, row, identities, slugs);
                String payloadHash = _payloadHash(row);
                String result = _classify(context, row, payloadHash, errors);

                if (!errors.isEmpty()) {
                    failedRows++;
                }
                else if ("NO_CHANGE".equals(result)) {
                    skippedRows++;
                }

                _importJobItemLocalService.addImportJobItem(
                    importJob.getCompanyId(), groupId,
                    importJob.getImportJobId(), row.rowNumber,
                    row.externalReferenceCode, row.locale, row.operation,
                    result, errors.isEmpty() ? "INFO" : "ERROR",
                    _codes(errors), _messages(errors), payloadHash);
            }

            String newStatus = (failedRows == 0) ?
                ArticleImportStatus.VALIDATED : ArticleImportStatus.INVALID;

            return _importJobLocalService.updateImportJobResult(
                importJob.getImportJobId(), newStatus, rows.size(), 0, 0,
                skippedRows, failedRows, StringPool.BLANK, false);
        }
        catch (Exception exception) {
            _importJobLocalService.updateImportJobResult(
                importJob.getImportJobId(), ArticleImportStatus.INVALID, 0, 0,
                0, 0, 1, _safeMessage(exception), false);

            if (exception instanceof PortalException) {
                throw (PortalException)exception;
            }

            throw new ArticleImportException(
                "VALIDATION_FAILED", "Article validation failed", exception);
        }
    }

    private void _archive(long userId, long groupId, ArticleImportRow row)
        throws PortalException {

        JournalArticle article =
            _journalArticleLocalService.
                fetchLatestArticleByExternalReferenceCode(
                    groupId, row.externalReferenceCode);

        if (article == null) {
            throw new ArticleImportException(
                "ARTICLE_NOT_FOUND", row.externalReferenceCode);
        }

        ServiceContext serviceContext = new ServiceContext();

        serviceContext.setCompanyId(article.getCompanyId());
        serviceContext.setScopeGroupId(groupId);
        serviceContext.setUserId(userId);

        _journalArticleLocalService.expireArticle(
            userId, groupId, article.getArticleId(), null, serviceContext);
    }

    private String _classify(
        ValidationContext context, ArticleImportRow row, String payloadHash,
        List<ValidationError> errors) {

        if (!errors.isEmpty()) {
            return "ERROR";
        }

        JournalArticle article =
            _journalArticleLocalService.
                fetchLatestArticleByExternalReferenceCode(
                    context.groupId, row.externalReferenceCode);

        if ("ARCHIVE".equals(row.operation)) {
            return (article == null) ? "ERROR" : "ARCHIVE";
        }

        ArticleImportState state =
            _articleImportStateLocalService.fetchArticleImportState(
                context.groupId, row.externalReferenceCode, row.locale);

        if ((state != null) && payloadHash.equals(state.getPayloadHash()) &&
            (article != null)) {

            return "NO_CHANGE";
        }

        return (article == null) ? "CREATE" : "UPDATE";
    }

    private String _codes(List<ValidationError> errors) {
        List<String> values = new ArrayList<>();

        for (ValidationError error : errors) {
            values.add(error.code);
        }

        return String.join(";", values);
    }

    private ContentField _dataField(String name, String value) {
        ContentFieldValue contentFieldValue = new ContentFieldValue();

        contentFieldValue.setData(value);

        ContentField contentField = new ContentField();

        contentField.setContentFieldValue(contentFieldValue);
        contentField.setFieldReference(name);
        contentField.setName(name);

        return contentField;
    }

    private ImportJob _getImportJob(
            long groupId, String externalReferenceCode)
        throws ArticleImportException {

        ImportJob importJob = _importJobLocalService.fetchImportJob(
            groupId, externalReferenceCode);

        if (importJob == null) {
            throw new ArticleImportException(
                "IMPORT_JOB_NOT_FOUND", externalReferenceCode);
        }

        return importJob;
    }

    private Map<Integer, ImportJobItem> _getItems(ImportJob importJob) {
        Map<Integer, ImportJobItem> items = new HashMap<>();

        for (ImportJobItem item :
                _importJobItemLocalService.getImportJobItems(
                    importJob.getImportJobId(), 0, Integer.MAX_VALUE)) {

            items.put(item.getRowNumber(), item);
        }

        return items;
    }

    private ContentField _imageField(
        String name, FileEntry fileEntry, Group group, String alt) {

        ContentDocument contentDocument = new ContentDocument();

        contentDocument.setDescription(alt);
        contentDocument.setExternalReferenceCode(
            fileEntry.getExternalReferenceCode());
        contentDocument.setId(fileEntry.getFileEntryId());
        contentDocument.setScopeExternalReferenceCode(
            group.getExternalReferenceCode());

        ContentFieldValue contentFieldValue = new ContentFieldValue();

        contentFieldValue.setImage(contentDocument);

        ContentField contentField = new ContentField();

        contentField.setContentFieldValue(contentFieldValue);
        contentField.setDataType("image");
        contentField.setFieldReference(name);
        contentField.setName(name);

        return contentField;
    }

    private void _markItem(
            ImportJobItem item, String result, String severity,
            String messageCode, String message)
        throws PortalException {

        _importJobItemLocalService.updateImportJobItemResult(
            item.getImportJobItemId(), result, severity, messageCode, message);
    }

    private String _messages(List<ValidationError> errors) {
        List<String> values = new ArrayList<>();

        for (ValidationError error : errors) {
            values.add(error.message);
        }

        return String.join(" | ", values);
    }

    private String _payloadHash(ArticleImportRow row) {
        StringBuilder sb = new StringBuilder();

        _append(sb, row.operation);
        _append(sb, row.externalReferenceCode);
        _append(sb, row.locale);
        _append(sb, row.title);
        _append(sb, row.friendlyUrlPath);
        _append(sb, row.summary);
        _append(sb, row.bodyHtml);
        _append(sb, row.coverImageERC);
        _append(sb, row.coverImageAlt);
        _append(sb, row.authorName);
        _append(sb, row.publicationDate);
        _append(sb, row.expirationDate);
        _append(sb, row.categoryERCs);
        _append(sb, row.tags);
        _append(sb, row.featured);
        _append(sb, row.sortOrder);
        _append(sb, row.publish);

        return _sha256(sb.toString().getBytes(StandardCharsets.UTF_8));
    }

    private byte[] _readWorkbook(ImportJob importJob)
        throws ArticleImportException {

        try {
            FileEntry fileEntry = _dlAppLocalService.getFileEntry(
                importJob.getFileEntryId());

            try (InputStream inputStream = fileEntry.getContentStream()) {
                return inputStream.readAllBytes();
            }
        }
        catch (Exception exception) {
            throw new ArticleImportException(
                "WORKBOOK_NOT_FOUND", importJob.getFileName(), exception);
        }
    }

    private String _safeMessage(Exception exception) {
        String message = exception.getMessage();

        if (message == null) {
            return exception.getClass().getSimpleName();
        }

        if (message.length() > 1000) {
            return message.substring(0, 1000);
        }

        return message;
    }

    private String _sha256(byte[] bytes) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(bytes);
            StringBuilder sb = new StringBuilder(digest.length * 2);

            for (byte value : digest) {
                sb.append(String.format("%02x", value));
            }

            return sb.toString();
        }
        catch (NoSuchAlgorithmException noSuchAlgorithmException) {
            throw new IllegalStateException(noSuchAlgorithmException);
        }
    }

    private void _upsert(
            long userId, ImportJob importJob, ArticleImportRow row)
        throws Exception {

        User user = _userLocalService.getUser(userId);
        Locale locale = LocaleUtil.fromLanguageId(row.locale);
        ValidationContext context = _validationContext(importJob);
        FileEntry image =
            _dlAppLocalService.fetchFileEntryByExternalReferenceCode(
                importJob.getGroupId(), row.coverImageERC);
        Group group = _groupLocalService.getGroup(importJob.getGroupId());
        StructuredContent structuredContent = new StructuredContent();

        structuredContent.setContentFields(
            new ContentField[] {
                _dataField("summary", row.summary),
                _dataField("body", row.bodyHtml),
                _imageField("coverImage", image, group, row.coverImageAlt),
                _dataField("coverImageAlt", row.coverImageAlt),
                _dataField("authorName", row.authorName),
                _dataField("featured", String.valueOf(row.featured)),
                _dataField("sortOrder", String.valueOf(row.sortOrder))
            });
        structuredContent.setContentStructureId(
            context.structure.getStructureId());
        structuredContent.setDateExpired(row.expirationDate);
        structuredContent.setDatePublished(row.publicationDate);
        structuredContent.setDescription(row.summary);
        structuredContent.setExternalReferenceCode(
            row.externalReferenceCode);
        structuredContent.setFriendlyUrlPath(row.friendlyUrlPath);
        structuredContent.setKeywords(row.tags.toArray(new String[0]));
        structuredContent.setTaxonomyCategoryIds(
            _taxonomyCategoryIds(importJob.getGroupId(), row.categoryERCs));
        structuredContent.setTitle(row.title);
        structuredContent.setViewableBy(StructuredContent.ViewableBy.ANYONE);

        StructuredContentResource resource =
            _structuredContentResourceFactory.create(
            ).checkPermissions(
                true
            ).preferredLocale(
                locale
            ).user(
                user
            ).build();

        resource.putSiteStructuredContentByExternalReferenceCode(
            importJob.getGroupId(), row.externalReferenceCode,
            structuredContent);

        if (!row.publish) {
            JournalArticle article =
                _journalArticleLocalService.
                    fetchLatestArticleByExternalReferenceCode(
                        importJob.getGroupId(), row.externalReferenceCode);
            ServiceContext serviceContext = new ServiceContext();

            serviceContext.setCompanyId(importJob.getCompanyId());
            serviceContext.setScopeGroupId(importJob.getGroupId());
            serviceContext.setUserId(userId);

            _journalArticleLocalService.updateStatus(
                userId, article, WorkflowConstants.STATUS_DRAFT, null,
                serviceContext, Collections.emptyMap());
        }
    }

    private ValidationContext _validationContext(ImportJob importJob)
        throws ArticleImportException {

        long classNameId = _portal.getClassNameId(
            JournalArticle.class.getName());
        DDMStructure structure =
            _ddmStructureLocalService.fetchStructureByExternalReferenceCode(
                importJob.getStructureERC(), importJob.getGroupId(),
                classNameId);

        if (structure == null) {
            throw new ArticleImportException(
                "STRUCTURE_ERC_NOT_FOUND", importJob.getStructureERC());
        }

        return new ValidationContext(importJob.getGroupId(), structure);
    }

    private List<ValidationError> _validateRow(
        ValidationContext context, ArticleImportRow row,
        Set<String> identities, Set<String> slugs) {

        List<ValidationError> errors = new ArrayList<>();
        String identity = row.externalReferenceCode + "|" + row.locale;

        if (!identities.add(identity)) {
            errors.add(new ValidationError(
                "DUPLICATE_ERC_LOCALE", identity));
        }

        if (!row.externalReferenceCode.matches("NXC-ARTICLE-[A-Z0-9._-]+")) {
            errors.add(new ValidationError(
                "INVALID_ERC", row.externalReferenceCode));
        }

        if (!LanguageUtil.isAvailableLocale(context.groupId, row.locale)) {
            errors.add(new ValidationError("INVALID_LOCALE", row.locale));
        }

        if ("ARCHIVE".equals(row.operation)) {
            if (_journalArticleLocalService.
                    fetchLatestArticleByExternalReferenceCode(
                        context.groupId, row.externalReferenceCode) == null) {

                errors.add(new ValidationError(
                    "ARTICLE_NOT_FOUND", row.externalReferenceCode));
            }

            return errors;
        }

        String slug = row.locale + "|" + row.friendlyUrlPath;

        if (!slugs.add(slug)) {
            errors.add(new ValidationError(
                "DUPLICATE_FRIENDLY_URL", row.friendlyUrlPath));
        }

        if (!row.friendlyUrlPath.matches("[a-z0-9]+(?:-[a-z0-9]+)*")) {
            errors.add(new ValidationError(
                "INVALID_FRIENDLY_URL", row.friendlyUrlPath));
        }

        if ((row.summary.length() < 40) || (row.summary.length() > 320)) {
            errors.add(new ValidationError(
                "INVALID_SUMMARY_LENGTH", String.valueOf(row.summary.length())));
        }

        if (_containsUnsafeHtml(row.bodyHtml)) {
            errors.add(new ValidationError("UNSAFE_HTML", "bodyHtml"));
        }

        if ((row.expirationDate != null) &&
            !row.expirationDate.after(row.publicationDate)) {

            errors.add(new ValidationError(
                "INVALID_DATE_RANGE", "expirationDate"));
        }

        if ((row.sortOrder < 0) || (row.sortOrder > 999999)) {
            errors.add(new ValidationError(
                "INVALID_SORT_ORDER", String.valueOf(row.sortOrder)));
        }

        try {
            if (_dlAppLocalService.fetchFileEntryByExternalReferenceCode(
                    context.groupId, row.coverImageERC) == null) {

                errors.add(new ValidationError(
                    "IMAGE_ERC_NOT_FOUND", row.coverImageERC));
            }
        }
        catch (PortalException portalException) {
            errors.add(new ValidationError(
                "IMAGE_ERC_NOT_FOUND", row.coverImageERC));
        }

        for (String categoryERC : row.categoryERCs) {
            if (_assetCategoryLocalService.
                    fetchAssetCategoryByExternalReferenceCode(
                        categoryERC, context.groupId) == null) {

                errors.add(new ValidationError(
                    "CATEGORY_ERC_NOT_FOUND", categoryERC));
            }
        }

        return errors;
    }

    private void _validateUpload(
            String externalReferenceCode, String fileName, String contentType,
            byte[] bytes)
        throws ArticleImportException {

        if ((externalReferenceCode == null) ||
            !externalReferenceCode.matches("NXC-ARTICLE-IMPORT-[A-Z0-9._-]+")) {

            throw new ArticleImportException(
                "INVALID_JOB_ERC", String.valueOf(externalReferenceCode));
        }

        if ((fileName == null) ||
            !fileName.toLowerCase(Locale.ROOT).endsWith(".xlsx")) {

            throw new ArticleImportException(
                "INVALID_FILE_TYPE", "Only .xlsx is accepted");
        }

        if ((bytes == null) || (bytes.length == 0) ||
            (bytes.length > _MAX_FILE_SIZE)) {

            throw new ArticleImportException(
                "INVALID_FILE_SIZE", "Workbook must be 1 byte to 10 MiB");
        }

        if ((bytes.length < 4) || (bytes[0] != 'P') || (bytes[1] != 'K')) {
            throw new ArticleImportException(
                "INVALID_XLSX", "Workbook does not have a ZIP signature");
        }

        if ((contentType != null) && !contentType.isEmpty() &&
            !_XLSX_MIME_TYPE.equals(contentType) &&
            !ContentTypes.APPLICATION_OCTET_STREAM.equals(contentType)) {

            throw new ArticleImportException(
                "INVALID_MIME_TYPE", contentType);
        }
    }

    private void _append(StringBuilder sb, Object value) {
        sb.append(value == null ? StringPool.BLANK : value.toString());
        sb.append('\u001f');
    }

    private boolean _containsUnsafeHtml(String html) {
        String normalized = html.toLowerCase(Locale.ROOT);

        return normalized.contains("<script") ||
            normalized.contains("<iframe") ||
            normalized.contains("javascript:") ||
            normalized.matches("(?s).*\\son[a-z]+\\s*=.*");
    }

    private Long[] _taxonomyCategoryIds(
        long groupId, List<String> categoryERCs) {

        List<Long> ids = new ArrayList<>();

        for (String categoryERC : categoryERCs) {
            AssetCategory category =
                _assetCategoryLocalService.
                    fetchAssetCategoryByExternalReferenceCode(
                        categoryERC, groupId);

            ids.add(category.getCategoryId());
        }

        return ids.toArray(new Long[0]);
    }

    private static final int _MAX_FILE_SIZE = 10 * 1024 * 1024;
    private static final String _XLSX_MIME_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    @Reference
    private ArticleImportStateLocalService _articleImportStateLocalService;

    @Reference
    private AssetCategoryLocalService _assetCategoryLocalService;

    @Reference
    private DDMStructureLocalService _ddmStructureLocalService;

    @Reference
    private DLAppLocalService _dlAppLocalService;

    @Reference
    private GroupLocalService _groupLocalService;

    @Reference
    private ImportJobItemLocalService _importJobItemLocalService;

    @Reference
    private ImportJobLocalService _importJobLocalService;

    @Reference
    private JournalArticleLocalService _journalArticleLocalService;

    @Reference
    private Portal _portal;

    @Reference
    private StructuredContentResource.Factory
        _structuredContentResourceFactory;

    @Reference
    private UserLocalService _userLocalService;

    private final XlsxArticleParser _parser = new XlsxArticleParser();

    private static class ValidationContext {

        private ValidationContext(long groupId, DDMStructure structure) {
            this.groupId = groupId;
            this.structure = structure;
        }

        private final long groupId;
        private final DDMStructure structure;
    }

    private static class ValidationError {

        private ValidationError(String code, String message) {
            this.code = code;
            this.message = message;
        }

        private final String code;
        private final String message;
    }
}
