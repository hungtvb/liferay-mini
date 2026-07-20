package com.nexcent.training.osgi.internal;

import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.service.UserLocalService;
import com.liferay.portal.kernel.util.GetterUtil;
import com.nexcent.training.osgi.configuration.NexcentTrainingConfiguration;

import java.util.Map;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.metatype.annotations.Designate;

@Component(
    configurationPid = "com.nexcent.training.osgi.configuration.NexcentTrainingConfiguration",
    immediate = true,
    property = {
        "osgi.command.function=status",
        "osgi.command.scope=nexcent"
    },
    service = NexcentTrainingStatusComponent.class
)
@Designate(ocd = NexcentTrainingConfiguration.class)
public class NexcentTrainingStatusComponent {

    public String getSummary() {
        return String.format(
            "%s is active. Portal user count: %d",
            _siteLabel, _userLocalService.getUsersCount());
    }

    public String status() {
        return getSummary();
    }

    @Activate
    @Modified
    protected void activate(Map<String, Object> properties) {
        _siteLabel = GetterUtil.getString(
            properties.get("siteLabel"), "Nexcent Training Site");

        if (_log.isInfoEnabled()) {
            _log.info(getSummary());
        }
    }

    private static final Log _log = LogFactoryUtil.getLog(
        NexcentTrainingStatusComponent.class);

    private volatile String _siteLabel;

    @Reference
    private UserLocalService _userLocalService;
}
