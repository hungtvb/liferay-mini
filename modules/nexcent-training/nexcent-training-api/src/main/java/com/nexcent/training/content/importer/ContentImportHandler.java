package com.nexcent.training.content.importer;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.service.ServiceContext;
import com.nexcent.training.model.ImportJob;

public interface ContentImportHandler {

    public ImportJob create(
            long userId, long groupId, String jobKey, long packageFileEntryId,
            ServiceContext serviceContext)
        throws PortalException;

    public ImportJob execute(long userId, ImportJob importJob)
        throws PortalException;

    public ContentImportProfile getProfile(long groupId)
        throws PortalException;

    public String getImportProfileKey();

    public ImportJob validate(long userId, ImportJob importJob)
        throws PortalException;
}
