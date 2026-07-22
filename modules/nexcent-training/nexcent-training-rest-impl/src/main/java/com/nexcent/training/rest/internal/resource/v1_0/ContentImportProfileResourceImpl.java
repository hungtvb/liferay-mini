package com.nexcent.training.rest.internal.resource.v1_0;

import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.kernel.security.permission.PermissionThreadLocal;
import com.liferay.portal.kernel.service.permission.GroupPermissionUtil;
import com.liferay.portal.vulcan.pagination.Page;
import com.nexcent.training.content.importer.ContentImportJobManager;
import com.nexcent.training.rest.dto.v1_0.ContentImportProfile;
import com.nexcent.training.rest.resource.v1_0.ContentImportProfileResource;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ServiceScope;

@Component(
    properties =
        "OSGI-INF/liferay/rest/v1_0/content-import-profile.properties",
    scope = ServiceScope.PROTOTYPE,
    service = ContentImportProfileResource.class
)
public class ContentImportProfileResourceImpl
    extends BaseContentImportProfileResourceImpl {

    @Override
    public Page<ContentImportProfile> getSiteContentImportProfilesPage(
            Long siteId)
        throws Exception {

        _checkPermission(siteId);

        return Page.of(
            transform(
                _contentImportJobManager.getProfiles(siteId), profile -> {
                    ContentImportProfile dto = new ContentImportProfile();

                    dto.setDisabledReasonCode(
                        profile.getDisabledReasonCode());
                    dto.setEnabled(profile.isEnabled());
                    dto.setKey(profile.getKey());
                    dto.setName(profile.getName());
                    dto.setSchemaVersion(profile.getSchemaVersion());
                    dto.setTargetExternalReferenceCode(
                        profile.getTargetExternalReferenceCode());
                    dto.setTargetType(profile.getTargetType());

                    return dto;
                }));
    }

    private void _checkPermission(long groupId) throws Exception {
        GroupPermissionUtil.check(
            PermissionThreadLocal.getPermissionChecker(), groupId,
            ActionKeys.UPDATE);
    }

    @Reference
    private ContentImportJobManager _contentImportJobManager;
}
