package com.nexcent.training.rest.internal.resource.v1_0;

import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.permission.GroupPermissionUtil;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;
import com.nexcent.training.model.ImportJob;
import com.nexcent.training.model.ImportJobItem;
import com.nexcent.training.rest.dto.v1_0.ArticleImportJobItem;
import com.nexcent.training.rest.resource.v1_0.ArticleImportJobItemResource;
import com.nexcent.training.service.ImportJobItemLocalService;
import com.nexcent.training.service.ImportJobLocalService;

import jakarta.ws.rs.NotFoundException;

import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

@Component(
    properties =
        "OSGI-INF/liferay/rest/v1_0/article-import-job-item.properties",
    scope = ServiceScope.PROTOTYPE,
    service = ArticleImportJobItemResource.class
)
public class ArticleImportJobItemResourceImpl
    extends BaseArticleImportJobItemResourceImpl {

    @Override
    public Page<ArticleImportJobItem> getSiteArticleImportJobItemsPage(
            Long siteId, String externalReferenceCode, Pagination pagination)
        throws Exception {

        GroupPermissionUtil.check(
            PermissionThreadLocal.getPermissionChecker(), siteId,
            ActionKeys.UPDATE);

        ImportJob importJob = _importJobLocalService.fetchImportJob(
            siteId, externalReferenceCode);

        if (importJob == null) {
            throw new NotFoundException(
                "No Article import job exists for ERC " +
                    externalReferenceCode);
        }

        List<ImportJobItem> models =
            _importJobItemLocalService.getImportJobItems(
                importJob.getImportJobId(), pagination.getStartPosition(),
                pagination.getEndPosition());

        return Page.of(
            transform(models, this::_toDTO), pagination,
            _importJobItemLocalService.getImportJobItemsCount(
                importJob.getImportJobId()));
    }

    private ArticleImportJobItem _toDTO(ImportJobItem model) {
        ArticleImportJobItem dto = new ArticleImportJobItem();

        dto.setArticleExternalReferenceCode(model.getArticleERC());
        dto.setId(model.getImportJobItemId());
        dto.setLocale(model.getLocale());
        dto.setMessage(model.getMessage());
        dto.setMessageCode(model.getMessageCode());
        dto.setOperation(model.getOperation());
        dto.setPayloadHash(model.getPayloadHash());
        dto.setResult(model.getResult());
        dto.setRowNumber(model.getRowNumber());
        dto.setSeverity(model.getSeverity());

        return dto;
    }

    @Reference
    private ImportJobItemLocalService _importJobItemLocalService;

    @Reference
    private ImportJobLocalService _importJobLocalService;
}
