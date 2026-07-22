package com.nexcent.training.rest.internal.resource.v1_0;

import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.permission.GroupPermissionUtil;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;
import com.nexcent.training.content.importer.ContentImportJobManager;
import com.nexcent.training.model.ImportJob;
import com.nexcent.training.model.ImportJobItem;
import com.nexcent.training.rest.dto.v1_0.ContentImportJob;
import com.nexcent.training.rest.dto.v1_0.ContentImportJobRequest;
import com.nexcent.training.rest.resource.v1_0.ContentImportJobResource;
import com.nexcent.training.service.ImportJobItemLocalService;
import com.nexcent.training.service.ImportJobLocalService;

import jakarta.ws.rs.NotFoundException;

import java.util.List;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

@Component(
    properties = "OSGI-INF/liferay/rest/v1_0/content-import-job.properties",
    scope = ServiceScope.PROTOTYPE,
    service = ContentImportJobResource.class
)
public class ContentImportJobResourceImpl
    extends BaseContentImportJobResourceImpl {

    @Override
    public ContentImportJob getSiteContentImportJob(
            Long siteId, String jobExternalReferenceCode)
        throws Exception {

        _checkPermission(siteId);

        return _toDTO(_getImportJob(siteId, jobExternalReferenceCode));
    }

    @Override
    public String getSiteContentImportJobErrorReport(
            Long siteId, String jobExternalReferenceCode)
        throws Exception {

        _checkPermission(siteId);
        ImportJob importJob = _getImportJob(
            siteId, jobExternalReferenceCode);
        StringBuilder report = new StringBuilder(
            "sheet,row,targetType,targetERC,severity,code,message\n");

        for (ImportJobItem item :
                _importJobItemLocalService.getImportJobItems(
                    importJob.getImportJobId(), 0, Integer.MAX_VALUE)) {

            if (!"ERROR".equals(item.getSeverity())) {
                continue;
            }

            _csv(report, item.getSheetName());
            report.append(',').append(item.getRowNumber()).append(',');
            _csv(report, item.getTargetType());
            report.append(',');
            _csv(report, item.getTargetERC());
            report.append(',');
            _csv(report, item.getSeverity());
            report.append(',');
            _csv(report, item.getMessageCode());
            report.append(',');
            _csv(report, item.getMessage());
            report.append('\n');
        }

        return report.toString();
    }

    @Override
    public Page<ContentImportJob> getSiteContentImportJobsPage(
            Long siteId, Pagination pagination)
        throws Exception {

        _checkPermission(siteId);
        List<ImportJob> models = _importJobLocalService.getImportJobs(
            siteId, pagination.getStartPosition(), pagination.getEndPosition());

        return Page.of(
            transform(models, this::_toDTO), pagination,
            _importJobLocalService.getImportJobsCount(siteId));
    }

    @Override
    public ContentImportJob postSiteContentImportJob(
            Long siteId, ContentImportJobRequest request)
        throws Exception {

        _checkPermission(siteId);
        ServiceContext serviceContext = _serviceContext(siteId);

        return _toDTO(
            _contentImportJobManager.create(
                contextUser.getUserId(), siteId,
                request.getExternalReferenceCode(),
                request.getPackageFileEntryId(), request.getImportProfileKey(),
                serviceContext));
    }

    @Override
    public ContentImportJob postSiteContentImportJobExecute(
            Long siteId, String jobExternalReferenceCode)
        throws Exception {

        _checkPermission(siteId);

        return _toDTO(
            _contentImportJobManager.execute(
                contextUser.getUserId(), siteId, jobExternalReferenceCode));
    }

    @Override
    public ContentImportJob postSiteContentImportJobRetry(
            Long siteId, String jobExternalReferenceCode)
        throws Exception {

        _checkPermission(siteId);

        return _toDTO(
            _contentImportJobManager.retry(
                contextUser.getUserId(), siteId, jobExternalReferenceCode));
    }

    @Override
    public ContentImportJob postSiteContentImportJobValidate(
            Long siteId, String jobExternalReferenceCode)
        throws Exception {

        _checkPermission(siteId);

        return _toDTO(
            _contentImportJobManager.validate(
                contextUser.getUserId(), siteId, jobExternalReferenceCode));
    }

    private void _checkPermission(long groupId) throws Exception {
        GroupPermissionUtil.check(
            PermissionThreadLocal.getPermissionChecker(), groupId,
            ActionKeys.UPDATE);
    }

    private void _csv(StringBuilder sb, String value) {
        sb.append('"');
        sb.append(
            (value == null ? StringPool.BLANK : value).replace("\"", "\"\""));
        sb.append('"');
    }

    private ImportJob _getImportJob(long groupId, String jobKey) {
        ImportJob importJob = _importJobLocalService.fetchImportJob(
            groupId, jobKey);

        if (importJob == null) {
            throw new NotFoundException("No content import job " + jobKey);
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

    private ContentImportJob _toDTO(ImportJob model) {
        ContentImportJob dto = new ContentImportJob();

        dto.setCompletedDate(model.getCompletedDate());
        dto.setCreatedRows(model.getCreatedRows());
        dto.setErrorMessage(model.getErrorMessage());
        dto.setExternalReferenceCode(model.getJobKey());
        dto.setFailedRows(model.getFailedRows());
        dto.setFileEntryId(model.getFileEntryId());
        dto.setFileName(model.getFileName());
        dto.setId(model.getImportJobId());
        dto.setImportProfileKey(model.getImportProfileKey());
        dto.setPackageSchemaVersion(model.getPackageSchemaVersion());
        dto.setSha256(model.getSha256());
        dto.setSkippedRows(model.getSkippedRows());
        dto.setStartedDate(model.getStartedDate());
        dto.setStatus(model.getStatus());
        dto.setTotalRows(model.getTotalRows());
        dto.setUpdatedRows(model.getUpdatedRows());

        return dto;
    }

    @Reference
    private ContentImportJobManager _contentImportJobManager;

    @Reference
    private ImportJobItemLocalService _importJobItemLocalService;

    @Reference
    private ImportJobLocalService _importJobLocalService;
}
