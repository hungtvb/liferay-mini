package com.nexcent.training.article.importer;

import com.liferay.portal.kernel.exception.PortalException;

public class ArticleImportException extends PortalException {

    public ArticleImportException(String code, String message) {
        super(code + ": " + message);

        _code = code;
    }

    public ArticleImportException(
        String code, String message, Throwable throwable) {

        super(code + ": " + message, throwable);

        _code = code;
    }

    public String getCode() {
        return _code;
    }

    private final String _code;
}
