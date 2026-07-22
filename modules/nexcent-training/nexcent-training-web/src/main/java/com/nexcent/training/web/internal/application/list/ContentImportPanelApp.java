package com.nexcent.training.web.internal.application.list;

import com.liferay.application.list.BasePanelApp;
import com.liferay.application.list.PanelApp;
import com.liferay.application.list.constants.PanelCategoryKeys;
import com.liferay.portal.kernel.model.Portlet;
import com.nexcent.training.web.internal.constants.NexcentTrainingPortletKeys;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(
    property = {
        "panel.app.order:Integer=750",
        "panel.category.key=" + PanelCategoryKeys.SITE_ADMINISTRATION_CONTENT
    },
    service = PanelApp.class
)
public class ContentImportPanelApp extends BasePanelApp {

    @Override
    public Portlet getPortlet() {
        return _portlet;
    }

    @Override
    public String getPortletId() {
        return NexcentTrainingPortletKeys.CONTENT_IMPORT;
    }

    @Reference(
        target = "(jakarta.portlet.name=" +
            NexcentTrainingPortletKeys.CONTENT_IMPORT + ")"
    )
    private Portlet _portlet;
}
