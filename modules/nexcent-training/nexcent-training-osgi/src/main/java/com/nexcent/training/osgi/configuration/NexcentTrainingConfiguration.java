package com.nexcent.training.osgi.configuration;

import com.liferay.portal.configuration.metatype.annotations.ExtendedObjectClassDefinition;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ExtendedObjectClassDefinition(
    category = "nexcent-training",
    scope = ExtendedObjectClassDefinition.Scope.SYSTEM
)
@ObjectClassDefinition(
    id = "com.nexcent.training.osgi.configuration.NexcentTrainingConfiguration",
    name = "Nexcent Training Configuration"
)
public @interface NexcentTrainingConfiguration {

    @AttributeDefinition(
        description = "Label returned by the training status component.",
        name = "Site Label",
        required = false
    )
    public String siteLabel() default "Nexcent Training Site";
}
