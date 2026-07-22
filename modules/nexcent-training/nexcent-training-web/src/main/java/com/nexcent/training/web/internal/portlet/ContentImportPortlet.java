package com.nexcent.training.web.internal.portlet;

import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.nexcent.training.web.internal.constants.NexcentTrainingPortletKeys;

import jakarta.portlet.Portlet;

import org.osgi.service.component.annotations.Component;

@Component(
    property = {
        "com.liferay.portlet.display-category=category.hidden",
        "com.liferay.portlet.header-portlet-css=/css/main.css",
        "com.liferay.portlet.instanceable=false",
        "jakarta.portlet.init-param.template-path=/",
        "jakarta.portlet.init-param.view-template=/view.jsp",
        "jakarta.portlet.name=" + NexcentTrainingPortletKeys.CONTENT_IMPORT,
        "jakarta.portlet.resource-bundle=content.Language",
        "jakarta.portlet.security-role-ref=power-user,user"
    },
    service = Portlet.class
)
public class ContentImportPortlet extends MVCPortlet {
}
