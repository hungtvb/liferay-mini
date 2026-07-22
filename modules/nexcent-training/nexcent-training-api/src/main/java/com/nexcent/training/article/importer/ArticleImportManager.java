package com.nexcent.training.article.importer;

import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.service.ServiceContext;
import com.nexcent.training.model.ImportJob;

public interface ArticleImportManager {

    public ImportJob execute(
            long userId, long groupId, String externalReferenceCode)
        throws PortalException;

    public ImportJob upload(
            long userId, long companyId, long groupId,
            String externalReferenceCode, String structureERC,
            String fileName, String contentType, byte[] bytes,
            ServiceContext serviceContext)
        throws PortalException;

    public ImportJob validate(
            long userId, long groupId, String externalReferenceCode)
        throws PortalException;
}
