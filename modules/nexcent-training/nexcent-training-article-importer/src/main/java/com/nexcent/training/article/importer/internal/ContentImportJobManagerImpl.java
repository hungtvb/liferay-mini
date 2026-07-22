package com.nexcent.training.article.importer.internal;

import com.liferay.document.library.kernel.service.DLAppLocalService;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.repository.model.FileEntry;
import com.liferay.portal.kernel.repository.model.Folder;
import com.liferay.portal.kernel.service.ServiceContext;
import com.nexcent.training.content.importer.ContentImportException;
import com.nexcent.training.content.importer.ContentImportHandler;
import com.nexcent.training.content.importer.ContentImportHandlerRegistry;
import com.nexcent.training.content.importer.ContentImportJobManager;
import com.nexcent.training.content.importer.ContentImportProfile;
import com.nexcent.training.model.ImportJob;
import com.nexcent.training.service.ImportJobLocalService;

import java.io.InputStream;

import java.security.MessageDigest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.locks.ReentrantLock;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ContentImportJobManager.class)
public class ContentImportJobManagerImpl implements ContentImportJobManager {

    @Override
    public ImportJob create(
            long userId, long groupId, String jobKey, long packageFileEntryId,
            String importProfileKey, ServiceContext serviceContext)
        throws PortalException {

        if ((jobKey == null) ||
            !jobKey.matches("NXC-CONTENT-IMPORT-[A-Z0-9._-]+")) {

            throw new ContentImportException("INVALID_JOB_ERC", jobKey);
        }

        return _withJobLock(
            groupId, jobKey,
            () -> {
                ImportJob existing = _importJobLocalService.fetchImportJob(
                    groupId, jobKey);

                if ((existing != null) &&
                    _ACTIVE_STATUSES.contains(existing.getStatus())) {

                    throw new ContentImportException(
                        "IMPORT_JOB_ACTIVE",
                        "An active job cannot be reset: " + jobKey);
                }

                ContentImportHandler handler =
                    _contentImportHandlerRegistry.getHandler(importProfileKey);
                ContentImportProfile profile = handler.getProfile(groupId);

                if (!profile.isEnabled()) {
                    throw new ContentImportException(
                        profile.getDisabledReasonCode(), importProfileKey);
                }

                _validatePackageLocation(groupId, packageFileEntryId);

                return handler.create(
                    userId, groupId, jobKey, packageFileEntryId,
                    serviceContext);
            });
    }

    @Override
    public ImportJob execute(long userId, long groupId, String jobKey)
        throws PortalException {

        return _withJobLock(
            groupId, jobKey,
            () -> {
                ImportJob importJob = _getImportJob(groupId, jobKey);

                _assertPackageUnchanged(importJob);

                return _contentImportHandlerRegistry.getHandler(
                    importJob.getImportProfileKey()).execute(
                        userId, importJob);
            });
    }

    @Override
    public List<ContentImportProfile> getProfiles(long groupId)
        throws PortalException {

        List<ContentImportProfile> profiles = new ArrayList<>();
        Set<String> registeredKeys = new HashSet<>();

        for (ContentImportHandler handler :
                _contentImportHandlerRegistry.getHandlers()) {

            profiles.add(handler.getProfile(groupId));
            registeredKeys.add(handler.getImportProfileKey());
        }

        for (String[] planned : _PLANNED_PROFILES) {
            if (!registeredKeys.contains(planned[0])) {
                profiles.add(
                    new ContentImportProfile(
                        planned[0], planned[1], "1.0", "STRUCTURED_CONTENT",
                        planned[2], false, "HANDLER_NOT_REGISTERED"));
            }
        }

        return profiles;
    }

    @Override
    public ImportJob retry(long userId, long groupId, String jobKey)
        throws PortalException {

        return _withJobLock(
            groupId, jobKey,
            () -> {
                ImportJob importJob = _getImportJob(groupId, jobKey);
                String status = importJob.getStatus();

                if (!Arrays.asList(
                        "FAILED", "INVALID", "COMPLETED_WITH_ERRORS").contains(
                            status)) {

                    throw new ContentImportException(
                        "INVALID_STATE",
                        "Retry requires a failed or invalid job");
                }

                _assertPackageUnchanged(importJob);

                ServiceContext serviceContext = new ServiceContext();

                serviceContext.setCompanyId(importJob.getCompanyId());
                serviceContext.setScopeGroupId(groupId);
                serviceContext.setUserId(userId);

                ContentImportHandler handler =
                    _contentImportHandlerRegistry.getHandler(
                        importJob.getImportProfileKey());

                importJob = handler.create(
                    userId, groupId, jobKey, importJob.getFileEntryId(),
                    serviceContext);
                importJob = handler.validate(userId, importJob);

                if ("VALIDATED".equals(importJob.getStatus())) {
                    importJob = handler.execute(userId, importJob);
                }

                return importJob;
            });
    }

    @Override
    public ImportJob validate(long userId, long groupId, String jobKey)
        throws PortalException {

        return _withJobLock(
            groupId, jobKey,
            () -> {
                ImportJob importJob = _getImportJob(groupId, jobKey);

                _assertPackageUnchanged(importJob);

                return _contentImportHandlerRegistry.getHandler(
                    importJob.getImportProfileKey()).validate(
                        userId, importJob);
            });
    }

    private void _assertPackageUnchanged(ImportJob importJob)
        throws PortalException {

        String expectedSha256 = importJob.getSha256();

        if ((expectedSha256 == null) || expectedSha256.isBlank()) {
            throw new ContentImportException(
                "PACKAGE_FINGERPRINT_MISSING",
                "Re-upload the package before validation or execution");
        }

        _validatePackageLocation(
            importJob.getGroupId(), importJob.getFileEntryId());

        FileEntry fileEntry = _dlAppLocalService.getFileEntry(
            importJob.getFileEntryId());
        String actualSha256 = _sha256(fileEntry);

        if (!expectedSha256.equals(actualSha256)) {
            throw new ContentImportException(
                "PACKAGE_CHANGED_AFTER_JOB_CREATED",
                "The Documents and Media package changed after the job was " +
                    "created; create a new job and validate it again");
        }
    }

    private ImportJob _getImportJob(long groupId, String jobKey)
        throws ContentImportException {

        ImportJob importJob = _importJobLocalService.fetchImportJob(
            groupId, jobKey);

        if (importJob == null) {
            throw new ContentImportException("IMPORT_JOB_NOT_FOUND", jobKey);
        }

        return importJob;
    }

    private String _sha256(FileEntry fileEntry) throws ContentImportException {
        try (InputStream inputStream = fileEntry.getContentStream()) {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int read;

            while ((read = inputStream.read(buffer)) != -1) {
                messageDigest.update(buffer, 0, read);
            }

            StringBuilder sb = new StringBuilder();

            for (byte value : messageDigest.digest()) {
                sb.append(String.format("%02x", value));
            }

            return sb.toString();
        }
        catch (Exception exception) {
            throw new ContentImportException(
                "PACKAGE_FINGERPRINT_FAILED", fileEntry.getFileName(),
                exception);
        }
    }

    private void _validatePackageLocation(
            long groupId, long packageFileEntryId)
        throws PortalException {

        FileEntry fileEntry = _dlAppLocalService.getFileEntry(
            packageFileEntryId);

        if (fileEntry.getGroupId() != groupId) {
            throw new ContentImportException(
                "INVALID_PACKAGE_SCOPE", "Package belongs to another site");
        }

        Folder folder = _dlAppLocalService.getFolder(fileEntry.getFolderId());

        if (!_PACKAGE_FOLDER_ERC.equals(folder.getExternalReferenceCode())) {
            throw new ContentImportException(
                "INVALID_PACKAGE_FOLDER", _PACKAGE_FOLDER_ERC);
        }
    }

    private ImportJob _withJobLock(
            long groupId, String jobKey, JobOperation jobOperation)
        throws PortalException {

        String lockKey = groupId + ":" + jobKey;
        ReentrantLock lock = _jobLocks.computeIfAbsent(
            lockKey, key -> new ReentrantLock());

        lock.lock();

        try {
            return jobOperation.execute();
        }
        finally {
            lock.unlock();
        }
    }

    private static final Set<String> _ACTIVE_STATUSES = Set.of(
        "RUNNING", "VALIDATING");

    private static final String _PACKAGE_FOLDER_ERC =
        "NXC-FOLDER-ARTICLE-IMPORT-PACKAGES";

    private static final String[][] _PLANNED_PROFILES = {
        {"NXC_HERO_V1", "Hero Slide", "NXC-STRUCTURE-HERO"},
        {"NXC_SERVICE_V1", "Service Item", "NXC-STRUCTURE-SERVICE"},
        {"NXC_FEATURE_V1", "Feature Item", "NXC-STRUCTURE-FEATURE"},
        {"NXC_TESTIMONIAL_V1", "Testimonial", "NXC-STRUCTURE-TESTIMONIAL"},
        {"NXC_COMMUNITY_CARD_V1", "Community Card",
            "NXC-STRUCTURE-COMMUNITY-CARD"}
    };

    @Reference
    private ContentImportHandlerRegistry _contentImportHandlerRegistry;

    @Reference
    private DLAppLocalService _dlAppLocalService;

    @Reference
    private ImportJobLocalService _importJobLocalService;

    private final ConcurrentMap<String, ReentrantLock> _jobLocks =
        new ConcurrentHashMap<>();

    @FunctionalInterface
    private interface JobOperation {

        ImportJob execute() throws PortalException;
    }
}
