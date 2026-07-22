package com.nexcent.training.article.importer.internal;

import com.liferay.dynamic.data.mapping.model.DDMStructure;
import com.liferay.dynamic.data.mapping.service.DDMStructureLocalService;
import com.liferay.journal.model.JournalArticle;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.Portal;
import com.nexcent.training.article.importer.ArticleImportManager;
import com.nexcent.training.content.importer.ContentImportHandler;
import com.nexcent.training.content.importer.ContentImportProfile;
import com.nexcent.training.model.ImportJob;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ContentImportHandler.class)
public class ArticleContentImportHandler implements ContentImportHandler {

    @Override
    public ImportJob create(
            long userId, long groupId, String jobKey, long packageFileEntryId,
            ServiceContext serviceContext)
        throws PortalException {

        return _articleImportManager.createFromPackage(
            userId, groupId, jobKey, packageFileEntryId, serviceContext);
    }

    @Override
    public ImportJob execute(long userId, ImportJob importJob)
        throws PortalException {

        return _articleImportManager.execute(
            userId, importJob.getGroupId(), importJob.getJobKey());
    }

    @Override
    public String getImportProfileKey() {
        return _PROFILE_KEY;
    }

    @Override
    public ContentImportProfile getProfile(long groupId) {
        DDMStructure structure =
            _ddmStructureLocalService.fetchStructureByExternalReferenceCode(
                _STRUCTURE_ERC, groupId,
                _portal.getClassNameId(JournalArticle.class.getName()));

        return new ContentImportProfile(
            _PROFILE_KEY, "Article", "1.0", "STRUCTURED_CONTENT",
            _STRUCTURE_ERC, structure != null,
            (structure == null) ? "STRUCTURE_NOT_FOUND" : null);
    }

    @Override
    public ImportJob validate(long userId, ImportJob importJob)
        throws PortalException {

        return _articleImportManager.validate(
            userId, importJob.getGroupId(), importJob.getJobKey());
    }

    private static final String _PROFILE_KEY = "NXC_ARTICLE_V1";
    private static final String _STRUCTURE_ERC = "NXC-STRUCTURE-ARTICLE";

    @Reference
    private ArticleImportManager _articleImportManager;

    @Reference
    private DDMStructureLocalService _ddmStructureLocalService;

    @Reference
    private Portal _portal;
}
