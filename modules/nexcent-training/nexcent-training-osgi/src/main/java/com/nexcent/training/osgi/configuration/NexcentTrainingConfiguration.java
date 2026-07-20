package com.nexcent.training.osgi.configuration;

import aQute.bnd.annotation.metatype.Meta;

import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;

@ExtendedObjectClassDefinition(
    category = "nexcent-training",
    scope = ExtendedObjectClassDefinition.Scope.SYSTEM
)
@Meta.OCD(
    id = "com.nexcent.training.osgi.configuration.NexcentTrainingConfiguration",
    name = "Nexcent Training Configuration"
)
public interface NexcentTrainingConfiguration {

    @Meta.AD(
        deflt = "Nexcent Training Site",
        description = "Label returned by the training status component.",
        name = "Site Label",
        required = false
    )
    public String siteLabel();
}
