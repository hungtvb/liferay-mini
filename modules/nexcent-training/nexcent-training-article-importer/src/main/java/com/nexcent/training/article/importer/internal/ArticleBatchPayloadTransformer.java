package com.nexcent.training.article.importer.internal;

import com.google.gson.Gson;

import java.nio.charset.StandardCharsets;

import java.time.format.DateTimeFormatter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

class ArticleBatchPayloadTransformer {

    byte[] transform(
        List<ArticleImportRow> rows, long structureId, String scopeERC,
        Map<String, DocumentReference> documentsByERC,
        Map<String, Long> categoryIdsByERC) {

        List<Map<String, Object>> payload = new ArrayList<>();

        for (ArticleImportRow row : rows) {
            if (!"UPSERT".equals(row.operation)) {
                continue;
            }

            DocumentReference document = documentsByERC.get(row.coverImageERC);

            if (document == null) {
                throw new IllegalArgumentException(
                    "No imported document exists for " + row.coverImageERC);
            }

            payload.add(
                _toStructuredContent(
                    row, structureId, scopeERC, document,
                    categoryIdsByERC));
        }

        return _gson.toJson(payload).getBytes(StandardCharsets.UTF_8);
    }

    private Map<String, Object> _contentField(String name, Object value) {
        Map<String, Object> contentFieldValue = new LinkedHashMap<>();

        contentFieldValue.put("data", value);

        Map<String, Object> contentField = new LinkedHashMap<>();

        contentField.put("contentFieldValue", contentFieldValue);
        contentField.put("fieldReference", name);
        contentField.put("name", name);

        return contentField;
    }

    private Map<String, Object> _imageField(
        String name, DocumentReference document, String scopeERC, String alt) {

        Map<String, Object> image = new LinkedHashMap<>();

        image.put("description", alt);
        image.put("externalReferenceCode", document.externalReferenceCode);
        image.put("id", document.id);
        image.put("scopeExternalReferenceCode", scopeERC);

        Map<String, Object> contentFieldValue = new LinkedHashMap<>();

        contentFieldValue.put("image", image);

        Map<String, Object> contentField = new LinkedHashMap<>();

        contentField.put("contentFieldValue", contentFieldValue);
        contentField.put("dataType", "image");
        contentField.put("fieldReference", name);
        contentField.put("name", name);

        return contentField;
    }

    private Long[] _taxonomyCategoryIds(
        ArticleImportRow row, Map<String, Long> categoryIdsByERC) {

        List<Long> ids = new ArrayList<>();

        for (String categoryERC : row.categoryERCs) {
            Long id = categoryIdsByERC.get(categoryERC);

            if (id == null) {
                throw new IllegalArgumentException(
                    "No taxonomy category exists for " + categoryERC);
            }

            ids.add(id);
        }

        return ids.toArray(new Long[0]);
    }

    private Map<String, Object> _toStructuredContent(
        ArticleImportRow row, long structureId, String scopeERC,
        DocumentReference document, Map<String, Long> categoryIdsByERC) {

        Map<String, Object> structuredContent = new LinkedHashMap<>();

        structuredContent.put(
            "contentFields",
            Arrays.asList(
                _contentField("summary", row.summary),
                _contentField("body", row.bodyHtml),
                _imageField("coverImage", document, scopeERC, row.coverImageAlt),
                _contentField("coverImageAlt", row.coverImageAlt),
                _contentField("authorName", row.authorName),
                _contentField("featured", row.featured),
                _contentField("sortOrder", row.sortOrder)));
        structuredContent.put("contentStructureId", structureId);

        if (row.expirationDate != null) {
            structuredContent.put(
                "dateExpired",
                DateTimeFormatter.ISO_INSTANT.format(
                    row.expirationDate.toInstant()));
        }

        structuredContent.put(
            "datePublished",
            DateTimeFormatter.ISO_INSTANT.format(row.publicationDate.toInstant()));
        structuredContent.put("description", row.summary);
        structuredContent.put(
            "externalReferenceCode", row.externalReferenceCode);
        structuredContent.put("friendlyUrlPath", row.friendlyUrlPath);
        structuredContent.put("keywords", row.tags);
        structuredContent.put(
            "taxonomyCategoryIds",
            _taxonomyCategoryIds(row, categoryIdsByERC));
        structuredContent.put("title", row.title);

        return structuredContent;
    }

    static class DocumentReference {

        DocumentReference(long id, String externalReferenceCode) {
            this.externalReferenceCode = externalReferenceCode;
            this.id = id;
        }

        final String externalReferenceCode;
        final long id;
    }

    private final Gson _gson = new Gson();
}
