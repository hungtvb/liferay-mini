package com.nexcent.training.article.importer;

public class ArticleImportStatus {

    public static final String COMPLETED = "COMPLETED";
    public static final String COMPLETED_WITH_ERRORS =
        "COMPLETED_WITH_ERRORS";
    public static final String FAILED = "FAILED";
    public static final String INVALID = "INVALID";
    public static final String RUNNING = "RUNNING";
    public static final String UPLOADED = "UPLOADED";
    public static final String VALIDATED = "VALIDATED";
    public static final String VALIDATING = "VALIDATING";

    private ArticleImportStatus() {
    }
}
