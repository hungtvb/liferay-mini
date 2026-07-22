package com.nexcent.training.internal.upgrade;

import com.liferay.portal.upgrade.registry.UpgradeStepRegistrator;

import org.osgi.service.component.annotations.Component;

@Component(service = UpgradeStepRegistrator.class)
public class ArticleImportUpgradeStepRegistrator
    implements UpgradeStepRegistrator {

    @Override
    public void register(Registry registry) {
        registry.register(
            "1.0.0", "2.0.0", new ArticleImportUpgradeProcess());
    }
}
