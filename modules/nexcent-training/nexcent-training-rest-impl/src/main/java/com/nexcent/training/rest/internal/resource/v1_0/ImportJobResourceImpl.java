package com.nexcent.training.rest.internal.resource.v1_0;

import com.liferay.portal.kernel.service.ServiceContext;
import com.nexcent.training.rest.dto.v1_0.ImportJob;
import com.nexcent.training.rest.resource.v1_0.ImportJobResource;
import com.nexcent.training.service.ImportJobLocalService;

import jakarta.ws.rs.NotFoundException;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

@Component(
    properties = "OSGI-INF/liferay/rest/v1_0/import-job.properties",
    scope = ServiceScope.PROTOTYPE,
    service = ImportJobResource.class
)
public class ImportJobResourceImpl extends BaseImportJobResourceImpl {

    @Override
    public ImportJob getSiteImportJob(
        Long siteId, String externalReferenceCode) {

        com.nexcent.training.model.ImportJob model =
            _importJobLocalService.fetchImportJob(
                siteId, externalReferenceCode);

        if (model == null) {
            throw new NotFoundException(
                "No import job exists for ERC " + externalReferenceCode);
        }

        return _toDTO(model);
    }

    @Override
    public ImportJob postSiteImportJob(Long siteId, ImportJob importJob)
        throws Exception {

        ServiceContext serviceContext = new ServiceContext();

        serviceContext.setCompanyId(contextCompany.getCompanyId());
        serviceContext.setScopeGroupId(siteId);
        serviceContext.setUserId(contextUser.getUserId());

        com.nexcent.training.model.ImportJob model =
            _importJobLocalService.addImportJob(
                contextUser.getUserId(), siteId,
                importJob.getExternalReferenceCode(), importJob.getFileName(),
                importJob.getTotalRows(), serviceContext);

        return _toDTO(model);
    }

    private ImportJob _toDTO(
        com.nexcent.training.model.ImportJob model) {

        ImportJob dto = new ImportJob();

        dto.setErrorMessage(model.getErrorMessage());
        dto.setExternalReferenceCode(model.getJobKey());
        dto.setFailedRows(model.getFailedRows());
        dto.setFileName(model.getFileName());
        dto.setId(model.getImportJobId());
        dto.setStatus(model.getStatus());
        dto.setSuccessRows(model.getSuccessRows());
        dto.setTotalRows(model.getTotalRows());

        return dto;
    }

    @Reference
    private ImportJobLocalService _importJobLocalService;
}
