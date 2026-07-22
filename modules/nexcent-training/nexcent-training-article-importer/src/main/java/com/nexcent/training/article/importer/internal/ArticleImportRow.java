package com.nexcent.training.article.importer.internal;

import java.util.Date;
import java.util.List;

class ArticleImportRow {

    ArticleImportRow(
        int rowNumber, String operation, String externalReferenceCode,
        String locale, String title, String friendlyUrlPath, String summary,
        String bodyHtml, String coverImageERC, String coverImageAlt,
        String authorName, Date publicationDate, Date expirationDate,
        List<String> categoryERCs, List<String> tags, boolean featured,
        int sortOrder, boolean publish) {

        this.rowNumber = rowNumber;
        this.operation = operation;
        this.externalReferenceCode = externalReferenceCode;
        this.locale = locale;
        this.title = title;
        this.friendlyUrlPath = friendlyUrlPath;
        this.summary = summary;
        this.bodyHtml = bodyHtml;
        this.coverImageERC = coverImageERC;
        this.coverImageAlt = coverImageAlt;
        this.authorName = authorName;
        this.publicationDate = publicationDate;
        this.expirationDate = expirationDate;
        this.categoryERCs = categoryERCs;
        this.tags = tags;
        this.featured = featured;
        this.sortOrder = sortOrder;
        this.publish = publish;
    }

    final String authorName;
    final String bodyHtml;
    final List<String> categoryERCs;
    final String coverImageAlt;
    final String coverImageERC;
    final Date expirationDate;
    final String externalReferenceCode;
    final boolean featured;
    final String friendlyUrlPath;
    final String locale;
    final String operation;
    final Date publicationDate;
    final boolean publish;
    final int rowNumber;
    final int sortOrder;
    final String summary;
    final List<String> tags;
    final String title;
}
