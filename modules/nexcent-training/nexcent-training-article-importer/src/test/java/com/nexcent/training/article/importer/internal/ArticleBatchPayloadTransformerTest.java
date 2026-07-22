package com.nexcent.training.article.importer.internal;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.nio.charset.StandardCharsets;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;

public class ArticleBatchPayloadTransformerTest {

    @Test
    public void testCreatesStructuredContentPayload() {
        ArticleImportRow row = new ArticleImportRow(
            5, "UPSERT", "NXC-ARTICLE-001", "en-US", "Article title",
            "article-title",
            "This summary is deliberately longer than forty characters.",
            "<p>Safe body</p>", "cover-1", "NXC-DOC-001", "Cover alt",
            "Nexcent Editorial Team", new Date(1782867600000L), null,
            Collections.singletonList("NXC-TOPIC-1"),
            Collections.singletonList("training"), true, 10, false);
        Map<String, ArticleBatchPayloadTransformer.DocumentReference>
            documents = new HashMap<>();

        documents.put(
            "NXC-DOC-001",
            new ArticleBatchPayloadTransformer.DocumentReference(
                1234, "NXC-DOC-001"));

        Map<String, Long> categories = new HashMap<>();

        categories.put("NXC-TOPIC-1", 5678L);

        byte[] bytes = new ArticleBatchPayloadTransformer().transform(
            Collections.singletonList(row), 9001, "NXC-SITE", documents,
            categories);
        JsonArray payload = JsonParser.parseString(
            new String(bytes, StandardCharsets.UTF_8)
        ).getAsJsonArray();
        JsonObject item = payload.get(0).getAsJsonObject();

        Assert.assertEquals(1, payload.size());
        Assert.assertEquals(
            "NXC-ARTICLE-001",
            item.get("externalReferenceCode").getAsString());
        Assert.assertEquals(9001, item.get("contentStructureId").getAsLong());
        Assert.assertEquals(
            "article-title", item.get("friendlyUrlPath").getAsString());
        Assert.assertEquals(
            5678,
            item.getAsJsonArray("taxonomyCategoryIds").get(0).getAsLong());

        JsonObject imageField = item.getAsJsonArray(
            "contentFields"
        ).get(
            2
        ).getAsJsonObject();
        JsonObject image = imageField.getAsJsonObject(
            "contentFieldValue"
        ).getAsJsonObject(
            "image"
        );

        Assert.assertEquals("coverImage", imageField.get("name").getAsString());
        Assert.assertEquals(1234, image.get("id").getAsLong());
        Assert.assertEquals(
            "NXC-DOC-001",
            image.get("externalReferenceCode").getAsString());
        Assert.assertEquals(
            "NXC-SITE", image.get("scopeExternalReferenceCode").getAsString());
    }

    @Test
    public void testSkipsArchiveRows() {
        ArticleImportRow archive = new ArticleImportRow(
            6, "ARCHIVE", "NXC-ARTICLE-001", "en-US", "", "", "", "",
            "", null, "", "", null, null, Collections.emptyList(),
            Collections.emptyList(), false, 0, false);

        byte[] bytes = new ArticleBatchPayloadTransformer().transform(
            Collections.singletonList(archive), 9001, "NXC-SITE",
            Collections.emptyMap(), Collections.emptyMap());

        Assert.assertEquals(
            0,
            JsonParser.parseString(
                new String(bytes, StandardCharsets.UTF_8)
            ).getAsJsonArray().size());
    }
}
