package com.nexcent.training.service.impl;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.uuid.PortalUUIDUtil;
import com.nexcent.training.model.ImportJob;
import com.nexcent.training.service.base.ImportJobLocalServiceBaseImpl;

import java.util.Date;
import java.util.List;

public class ImportJobLocalServiceImpl extends ImportJobLocalServiceBaseImpl {

    public ImportJob addImportJob(
            long userId, long groupId, String externalReferenceCode,
            String fileName, int totalRows, ServiceContext serviceContext)
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
        importJob.setFileName(fileName);
        importJob.setStatus("PENDING");
        importJob.setTotalRows(totalRows);
        importJob.setSuccessRows(0);
        importJob.setFailedRows(0);
        importJob.setErrorMessage("");

        return importJobPersistence.update(importJob);
    }

    public ImportJob completeImportJob(
            long importJobId, int successRows, int failedRows,
            String errorMessage)
        throws PortalException {

        ImportJob importJob = importJobPersistence.findByPrimaryKey(importJobId);

        importJob.setModifiedDate(new Date());
        importJob.setSuccessRows(successRows);
        importJob.setFailedRows(failedRows);
        importJob.setErrorMessage(errorMessage);
        importJob.setStatus(
            failedRows == 0 ? "COMPLETED" : "COMPLETED_WITH_ERRORS");

        return importJobPersistence.update(importJob);
    }

    public ImportJob fetchImportJob(
        long groupId, String externalReferenceCode) {

        return importJobPersistence.fetchByJK_G(
            externalReferenceCode, groupId);
    }

    public List<ImportJob> getImportJobs(long groupId) {
        return importJobPersistence.findByG(groupId);
    }
}
