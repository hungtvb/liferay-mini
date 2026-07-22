package com.nexcent.training.article.importer.internal;

import java.util.Collections;
import java.util.Map;

class ArticleImportPackage {

    ArticleImportPackage(
        String schemaVersion, String importProfileKey,
        String siteExternalReferenceCode, String mode, byte[] workbook,
        Map<String, byte[]> entries) {

        this.schemaVersion = schemaVersion;
        this.importProfileKey = importProfileKey;
        this.siteExternalReferenceCode = siteExternalReferenceCode;
        this.mode = mode;
        this.workbook = workbook;
        this.entries = Collections.unmodifiableMap(entries);
    }

    final Map<String, byte[]> entries;
    final String importProfileKey;
    final String mode;
    final String schemaVersion;
    final String siteExternalReferenceCode;
    final byte[] workbook;
}
