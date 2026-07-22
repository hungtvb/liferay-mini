package com.nexcent.training.content.importer;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.service.ServiceContext;
import com.nexcent.training.model.ImportJob;

import java.util.List;

public interface ContentImportJobManager {

    public ImportJob create(
            long userId, long groupId, String jobKey, long packageFileEntryId,
            String importProfileKey, ServiceContext serviceContext)
        throws PortalException;

    public ImportJob execute(
            long userId, long groupId, String jobKey)
        throws PortalException;

    public List<ContentImportProfile> getProfiles(long groupId)
        throws PortalException;

    public ImportJob retry(long userId, long groupId, String jobKey)
        throws PortalException;

    public ImportJob validate(
            long userId, long groupId, String jobKey)
        throws PortalException;
}
