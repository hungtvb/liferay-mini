package com.nexcent.training.rest.internal.resource.v1_0;

import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.permission.GroupPermissionUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.vulcan.multipart.BinaryFile;
import com.liferay.portal.vulcan.multipart.MultipartBody;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;
import com.nexcent.training.article.importer.ArticleImportManager;
import com.nexcent.training.model.ImportJob;
import com.nexcent.training.rest.dto.v1_0.ArticleImportJob;
import com.nexcent.training.rest.resource.v1_0.ArticleImportJobResource;
import com.nexcent.training.service.ImportJobLocalService;

import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

@Component(
    properties = "OSGI-INF/liferay/rest/v1_0/article-import-job.properties",
    scope = ServiceScope.PROTOTYPE,
    service = ArticleImportJobResource.class
)
public class ArticleImportJobResourceImpl
    extends BaseArticleImportJobResourceImpl {

    @Override
    public ArticleImportJob getSiteArticleImportJob(
            Long siteId, String externalReferenceCode)
        throws Exception {

        _checkPermission(siteId);

        return _toDTO(_getImportJob(siteId, externalReferenceCode));
    }

    @Override
    public Page<ArticleImportJob> getSiteArticleImportJobsPage(
            Long siteId, Pagination pagination)
        throws Exception {

        _checkPermission(siteId);

        List<ImportJob> models = _importJobLocalService.getImportJobs(
            siteId, pagination.getStartPosition(),
            pagination.getEndPosition());

        return Page.of(
            transform(models, this::_toDTO), pagination,
            _importJobLocalService.getImportJobsCount(siteId));
    }

    @Override
    public ArticleImportJob postSiteArticleImportJob(
            Long siteId, MultipartBody multipartBody)
        throws Exception {

        _checkPermission(siteId);

        if (multipartBody == null) {
            throw new BadRequestException("Multipart body is required");
        }

        BinaryFile binaryFile = multipartBody.getBinaryFile("file");
        String externalReferenceCode = multipartBody.getValueAsString(
            "externalReferenceCode");
        String structureExternalReferenceCode =
            multipartBody.getValueAsString(
                "structureExternalReferenceCode");

        if (binaryFile == null) {
            throw new BadRequestException("Multipart file is required");
        }

        if (Validator.isNull(structureExternalReferenceCode)) {
            structureExternalReferenceCode = "NXC-STRUCTURE-ARTICLE";
        }

        ServiceContext serviceContext = _serviceContext(siteId);
        ImportJob importJob = _articleImportManager.upload(
            contextUser.getUserId(), contextCompany.getCompanyId(), siteId,
            externalReferenceCode, structureExternalReferenceCode,
            binaryFile.getFileName(), binaryFile.getContentType(),
            multipartBody.getBinaryFileAsBytes("file"), serviceContext);

        return _toDTO(importJob);
    }

    @Override
    public ArticleImportJob postSiteArticleImportJobExecute(
            Long siteId, String externalReferenceCode)
        throws Exception {

        _checkPermission(siteId);

        return _toDTO(
            _articleImportManager.execute(
                contextUser.getUserId(), siteId, externalReferenceCode));
    }

    @Override
    public ArticleImportJob postSiteArticleImportJobValidate(
            Long siteId, String externalReferenceCode)
        throws Exception {

        _checkPermission(siteId);

        return _toDTO(
            _articleImportManager.validate(
                contextUser.getUserId(), siteId, externalReferenceCode));
    }

    private void _checkPermission(long groupId) throws Exception {
        GroupPermissionUtil.check(
            PermissionThreadLocal.getPermissionChecker(), groupId,
            ActionKeys.UPDATE);
    }

    private ImportJob _getImportJob(
        long groupId, String externalReferenceCode) {

        ImportJob importJob = _importJobLocalService.fetchImportJob(
            groupId, externalReferenceCode);

        if (importJob == null) {
            throw new NotFoundException(
                "No Article import job exists for ERC " +
                    externalReferenceCode);
        }

        return importJob;
    }

    private ServiceContext _serviceContext(long groupId) {
        ServiceContext serviceContext = new ServiceContext();

        serviceContext.setCompanyId(contextCompany.getCompanyId());
        serviceContext.setScopeGroupId(groupId);
        serviceContext.setUserId(contextUser.getUserId());

        return serviceContext;
    }

    private ArticleImportJob _toDTO(ImportJob model) {
        ArticleImportJob dto = new ArticleImportJob();

        dto.setCompletedDate(model.getCompletedDate());
        dto.setCreatedRows(model.getCreatedRows());
        dto.setErrorMessage(model.getErrorMessage());
        dto.setExternalReferenceCode(model.getJobKey());
        dto.setFailedRows(model.getFailedRows());
        dto.setFileEntryId(model.getFileEntryId());
        dto.setFileName(model.getFileName());
        dto.setId(model.getImportJobId());
        dto.setSha256(model.getSha256());
        dto.setSkippedRows(model.getSkippedRows());
        dto.setStartedDate(model.getStartedDate());
        dto.setStatus(model.getStatus());
        dto.setStructureExternalReferenceCode(model.getStructureERC());
        dto.setTotalRows(model.getTotalRows());
        dto.setUpdatedRows(model.getUpdatedRows());

        return dto;
    }

    @Reference
    private ArticleImportManager _articleImportManager;

    @Reference
    private ImportJobLocalService _importJobLocalService;
}
