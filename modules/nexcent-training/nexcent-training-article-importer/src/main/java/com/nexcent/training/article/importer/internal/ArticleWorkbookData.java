package com.nexcent.training.article.importer.internal;

import java.util.Collections;
import java.util.List;
import java.util.Map;

class ArticleWorkbookData {

    ArticleWorkbookData(
        List<ArticleImportRow> articleRows,
        Map<String, ArticleAssetRow> assetsByKey) {

        this.articleRows = Collections.unmodifiableList(articleRows);
        this.assetsByKey = Collections.unmodifiableMap(assetsByKey);
    }

    final List<ArticleImportRow> articleRows;
    final Map<String, ArticleAssetRow> assetsByKey;
}
