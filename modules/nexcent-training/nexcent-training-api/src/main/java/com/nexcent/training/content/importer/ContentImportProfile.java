package com.nexcent.training.content.importer;

import java.io.Serializable;

public class ContentImportProfile implements Serializable {

    public ContentImportProfile(
        String key, String name, String schemaVersion, String targetType,
        String targetExternalReferenceCode, boolean enabled,
        String disabledReasonCode) {

        _key = key;
        _name = name;
        _schemaVersion = schemaVersion;
        _targetType = targetType;
        _targetExternalReferenceCode = targetExternalReferenceCode;
        _enabled = enabled;
        _disabledReasonCode = disabledReasonCode;
    }

    public String getDisabledReasonCode() {
        return _disabledReasonCode;
    }

    public String getKey() {
        return _key;
    }

    public String getName() {
        return _name;
    }

    public String getSchemaVersion() {
        return _schemaVersion;
    }

    public String getTargetExternalReferenceCode() {
        return _targetExternalReferenceCode;
    }

    public String getTargetType() {
        return _targetType;
    }

    public boolean isEnabled() {
        return _enabled;
    }

    private final String _disabledReasonCode;
    private final boolean _enabled;
    private final String _key;
    private final String _name;
    private final String _schemaVersion;
    private final String _targetExternalReferenceCode;
    private final String _targetType;
}
