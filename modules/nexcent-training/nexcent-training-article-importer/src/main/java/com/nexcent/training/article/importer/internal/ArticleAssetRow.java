package com.nexcent.training.article.importer.internal;

class ArticleAssetRow {

    ArticleAssetRow(
        int rowNumber, String imageKey, String filePath, String documentERC,
        String title, String altText, String folderERC) {

        this.rowNumber = rowNumber;
        this.imageKey = imageKey;
        this.filePath = filePath;
        this.documentERC = documentERC;
        this.title = title;
        this.altText = altText;
        this.folderERC = folderERC;
    }

    final String altText;
    final String documentERC;
    final String filePath;
    final String folderERC;
    final String imageKey;
    final int rowNumber;
    final String title;
}
