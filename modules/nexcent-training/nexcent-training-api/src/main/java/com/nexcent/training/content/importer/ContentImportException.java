package com.nexcent.training.content.importer;

import com.liferay.portal.kernel.exception.PortalException;

public class ContentImportException extends PortalException {

    public ContentImportException(String code, String message) {
        super(code + ": " + message);

        _code = code;
    }

    public ContentImportException(
        String code, String message, Throwable throwable) {

        super(code + ": " + message, throwable);

        _code = code;
    }

    public String getCode() {
        return _code;
    }

    private final String _code;
}
