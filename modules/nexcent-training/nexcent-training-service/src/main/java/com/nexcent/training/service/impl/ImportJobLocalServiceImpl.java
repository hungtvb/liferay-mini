package com.nexcent.training.service.impl;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.uuid.PortalUUIDUtil;
import com.nexcent.training.model.ImportJob;
import com.nexcent.training.service.base.ImportJobLocalServiceBaseImpl;

import java.util.Date;
import java.util.List;

public class ImportJobLocalServiceImpl extends ImportJobLocalServiceBaseImpl {

    public ImportJob addOrResetImportJob(
            long userId, long groupId, String externalReferenceCode,
            long fileEntryId, String fileName, String sha256,
            String structureERC, ServiceContext serviceContext)
        throws PortalException {

        User user = userLocalService.getUser(userId);
        Date now = new Date();

        ImportJob importJob = importJobPersistence.fetchByJK_G(
            externalReferenceCode, groupId);

        if (importJob == null) {
            importJob = importJobPersistence.create(
                counterLocalService.increment(ImportJob.class.getName()));

            importJob.setUuid(PortalUUIDUtil.generate());
            importJob.setCreateDate(now);
        }

        importJob.setCompanyId(serviceContext.getCompanyId());
        importJob.setGroupId(groupId);
        importJob.setUserId(userId);
        importJob.setUserName(user.getFullName());
        importJob.setModifiedDate(now);
        importJob.setJobKey(externalReferenceCode);
        importJob.setFileEntryId(fileEntryId);
        importJob.setFileName(fileName);
        importJob.setSha256(sha256);
        importJob.setStructureERC(structureERC);
        importJob.setStatus("UPLOADED");
        importJob.setTotalRows(0);
        importJob.setCreatedRows(0);
        importJob.setUpdatedRows(0);
        importJob.setSkippedRows(0);
        importJob.setFailedRows(0);
        importJob.setStartedDate(null);
        importJob.setCompletedDate(null);
        importJob.setErrorMessage(StringPool.BLANK);

        return importJobPersistence.update(importJob);
    }

    public ImportJob fetchImportJob(
        long groupId, String externalReferenceCode) {

        return importJobPersistence.fetchByJK_G(
            externalReferenceCode, groupId);
    }

    public List<ImportJob> getImportJobs(
        long groupId, int start, int end) {

        return importJobPersistence.findByG(groupId, start, end);
    }

    public int getImportJobsCount(long groupId) {
        return importJobPersistence.countByG(groupId);
    }

    public ImportJob transitionImportJob(
            long importJobId, String expectedStatus, String newStatus)
        throws PortalException {

        ImportJob importJob = importJobPersistence.findByPrimaryKey(
            importJobId);

        if (!expectedStatus.equals(importJob.getStatus())) {
            throw new PortalException(
                "INVALID_STATE: expected " + expectedStatus + " but was " +
                    importJob.getStatus());
        }

        Date now = new Date();

        importJob.setModifiedDate(now);
        importJob.setStatus(newStatus);

        if ("RUNNING".equals(newStatus)) {
            importJob.setStartedDate(now);
        }

        return importJobPersistence.update(importJob);
    }

    public ImportJob updateImportJobResult(
            long importJobId, String status, int totalRows, int createdRows,
            int updatedRows, int skippedRows, int failedRows,
            String errorMessage, boolean completed)
        throws PortalException {

        ImportJob importJob = importJobPersistence.findByPrimaryKey(
            importJobId);

        Date now = new Date();

        importJob.setModifiedDate(now);
        importJob.setStatus(status);
        importJob.setTotalRows(totalRows);
        importJob.setCreatedRows(createdRows);
        importJob.setUpdatedRows(updatedRows);
        importJob.setSkippedRows(skippedRows);
        importJob.setFailedRows(failedRows);
        importJob.setErrorMessage(errorMessage);

        if (completed) {
            importJob.setCompletedDate(now);
        }

        return importJobPersistence.update(importJob);
    }
}
