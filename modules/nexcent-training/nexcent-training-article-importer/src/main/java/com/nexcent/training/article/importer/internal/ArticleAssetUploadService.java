package com.nexcent.training.article.importer.internal;

import com.liferay.document.library.kernel.model.DLVersionNumberIncrease;
import com.liferay.document.library.kernel.service.DLAppLocalService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.repository.model.Folder;
import com.liferay.portal.kernel.service.ServiceContext;
import com.nexcent.training.article.importer.ArticleImportException;
import com.nexcent.training.model.ImportJob;

import java.io.InputStream;

import java.security.MessageDigest;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ArticleAssetUploadService.class)
public class ArticleAssetUploadService {

    public Result upload(
            long userId, ImportJob importJob,
            ArticleImportPackage articleImportPackage,
            Map<String, ArticleAssetRow> assetsByKey)
        throws PortalException {

        Result result = new Result();

        for (ArticleAssetRow asset : assetsByKey.values()) {
            byte[] bytes = articleImportPackage.entries.get(asset.filePath);
            String mimeType = _imageMimeType(asset.filePath, bytes);
            Folder folder =
                _dlAppLocalService.fetchFolderByExternalReferenceCode(
                    asset.folderERC, importJob.getGroupId());

            if (folder == null) {
                throw new ArticleImportException(
                    "ASSET_FOLDER_NOT_FOUND", asset.folderERC);
            }

            String fileName = asset.filePath.substring(
                asset.filePath.lastIndexOf('/') + 1);
            FileEntry fileEntry =
                _dlAppLocalService.fetchFileEntryByExternalReferenceCode(
                    importJob.getGroupId(), asset.documentERC);
            ServiceContext serviceContext = _serviceContext(
                importJob, userId);

            if (fileEntry == null) {
                fileEntry = _dlAppLocalService.addFileEntry(
                    asset.documentERC, userId, importJob.getGroupId(),
                    folder.getFolderId(), fileName, mimeType, bytes, null, null,
                    null, serviceContext);
                fileEntry = _dlAppLocalService.updateFileEntry(
                    userId, fileEntry.getFileEntryId(), fileName, mimeType,
                    asset.title, asset.altText,
                    "Imported by " + importJob.getJobKey(),
                    "Nexcent Article asset metadata",
                    DLVersionNumberIncrease.MINOR, bytes, null, null, null,
                    serviceContext);
                result.created++;
            }
            else {
                if (fileEntry.getFolderId() != folder.getFolderId()) {
                    throw new ArticleImportException(
                        "ASSET_ERC_FOLDER_CONFLICT",
                        asset.documentERC +
                            " already exists in another folder");
                }

                boolean binaryChanged = !_sha256(bytes).equals(
                    _sha256(_read(fileEntry)));
                boolean metadataChanged =
                    !asset.title.equals(fileEntry.getTitle()) ||
                        !asset.altText.equals(fileEntry.getDescription());

                if (binaryChanged || metadataChanged) {
                    fileEntry = _dlAppLocalService.updateFileEntry(
                        userId, fileEntry.getFileEntryId(), fileName, mimeType,
                        asset.title, asset.altText,
                        "Imported by " + importJob.getJobKey(),
                        "Nexcent Article asset update",
                        DLVersionNumberIncrease.MAJOR, bytes, null, null, null,
                        serviceContext);
                    result.updated++;
                }
                else {
                    result.skipped++;
                }
            }

            result.documentsByERC.put(
                asset.documentERC,
                new ArticleBatchPayloadTransformer.DocumentReference(
                    fileEntry.getFileEntryId(),
                    fileEntry.getExternalReferenceCode()));
        }

        return result;
    }

    private String _imageMimeType(String path, byte[] bytes)
        throws ArticleImportException {

        if ((bytes == null) || (bytes.length < 12) ||
            !path.startsWith("assets/")) {

            throw new ArticleImportException("IMAGE_FILE_NOT_FOUND", path);
        }

        String lowerPath = path.toLowerCase(Locale.ROOT);

        if (lowerPath.endsWith(".png") && (bytes[0] == (byte)0x89) &&
            (bytes[1] == 'P') && (bytes[2] == 'N') && (bytes[3] == 'G')) {

            return "image/png";
        }

        if ((lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) &&
            (bytes[0] == (byte)0xff) && (bytes[1] == (byte)0xd8)) {

            return "image/jpeg";
        }

        if (lowerPath.endsWith(".webp") && (bytes[0] == 'R') &&
            (bytes[1] == 'I') && (bytes[2] == 'F') && (bytes[3] == 'F') &&
            (bytes[8] == 'W') && (bytes[9] == 'E') && (bytes[10] == 'B') &&
            (bytes[11] == 'P')) {

            return "image/webp";
        }

        throw new ArticleImportException("INVALID_IMAGE_TYPE", path);
    }

    private byte[] _read(FileEntry fileEntry) throws PortalException {
        try (InputStream inputStream = fileEntry.getContentStream()) {
            return inputStream.readAllBytes();
        }
        catch (Exception exception) {
            throw new ArticleImportException(
                "FILE_ENTRY_READ_FAILED", fileEntry.getFileName(), exception);
        }
    }

    private ServiceContext _serviceContext(ImportJob importJob, long userId) {
        ServiceContext serviceContext = new ServiceContext();

        serviceContext.setAddGuestPermissions(false);
        serviceContext.setAddGroupPermissions(false);
        serviceContext.setCompanyId(importJob.getCompanyId());
        serviceContext.setScopeGroupId(importJob.getGroupId());
        serviceContext.setUserId(userId);

        return serviceContext;
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
        catch (Exception exception) {
            throw new IllegalStateException(exception);
        }
    }

    static class Result {

        int created;
        int skipped;
        int updated;
        final Map<String, ArticleBatchPayloadTransformer.DocumentReference>
            documentsByERC = new HashMap<>();
    }

    @Reference
    private DLAppLocalService _dlAppLocalService;
}
