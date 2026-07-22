package com.nexcent.training.article.importer.internal;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.nexcent.training.content.importer.ContentImportException;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.nio.charset.StandardCharsets;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

class SafeZipPackageReader {

    ArticleImportPackage read(byte[] bytes) throws ContentImportException {
        if ((bytes == null) || (bytes.length < 4) ||
            (bytes.length > _MAX_COMPRESSED_BYTES) || (bytes[0] != 'P') ||
            (bytes[1] != 'K')) {

            throw new ContentImportException(
                "INVALID_PACKAGE_LAYOUT", "Package must be a ZIP up to 25 MiB");
        }

        Map<String, byte[]> entries = new HashMap<>();
        Set<String> names = new HashSet<>();
        long expandedBytes = 0;

        try (ZipInputStream zipInputStream = new ZipInputStream(
                new ByteArrayInputStream(bytes))) {

            ZipEntry zipEntry;

            while ((zipEntry = zipInputStream.getNextEntry()) != null) {
                String name = _normalize(zipEntry.getName());

                if (!names.add(name)) {
                    throw new ContentImportException(
                        "UNSAFE_ZIP_ENTRY", "Duplicate ZIP entry " + name);
                }

                if (names.size() > _MAX_ENTRIES) {
                    throw new ContentImportException(
                        "PACKAGE_LIMIT_EXCEEDED", "Package has too many entries");
                }

                if (zipEntry.isDirectory()) {
                    continue;
                }

                ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();
                byte[] buffer = new byte[8192];
                int read;

                while ((read = zipInputStream.read(buffer)) != -1) {
                    expandedBytes += read;

                    if (expandedBytes > _MAX_EXPANDED_BYTES) {
                        throw new ContentImportException(
                            "PACKAGE_LIMIT_EXCEEDED",
                            "Expanded package exceeds 64 MiB");
                    }

                    if ((outputStream.size() + read) > _MAX_ENTRY_BYTES) {
                        throw new ContentImportException(
                            "PACKAGE_LIMIT_EXCEEDED",
                            "ZIP entry exceeds 15 MiB: " + name);
                    }

                    outputStream.write(buffer, 0, read);
                }

                entries.put(name, outputStream.toByteArray());
            }
        }
        catch (ContentImportException contentImportException) {
            throw contentImportException;
        }
        catch (IOException | RuntimeException exception) {
            throw new ContentImportException(
                "INVALID_PACKAGE_LAYOUT", "Package cannot be read", exception);
        }

        byte[] manifestBytes = entries.get("manifest.json");
        byte[] workbook = entries.get("articles.xlsx");

        if ((manifestBytes == null) || (workbook == null) ||
            (manifestBytes.length > _MAX_MANIFEST_BYTES) ||
            (workbook.length > _MAX_WORKBOOK_BYTES)) {

            throw new ContentImportException(
                "INVALID_PACKAGE_LAYOUT",
                "Package requires manifest.json and articles.xlsx");
        }

        try {
            JsonObject manifest = JsonParser.parseString(
                new String(
                    manifestBytes, StandardCharsets.UTF_8)).getAsJsonObject();
            String schemaVersion = _jsonString(
                manifest, "schemaVersion");
            String profileKey = _jsonString(
                manifest, "importProfileKey");
            String siteERC = _jsonString(
                manifest, "siteExternalReferenceCode");
            String mode = _jsonString(
                manifest, "mode").toUpperCase(Locale.ROOT);

            if (schemaVersion.isEmpty() || profileKey.isEmpty() ||
                siteERC.isEmpty() || !"UPSERT".equals(mode)) {

                throw new ContentImportException(
                    "INVALID_MANIFEST", "Manifest fields are missing or invalid");
            }

            return new ArticleImportPackage(
                schemaVersion, profileKey, siteERC, mode, workbook, entries);
        }
        catch (ContentImportException contentImportException) {
            throw contentImportException;
        }
        catch (Exception exception) {
            throw new ContentImportException(
                "INVALID_MANIFEST", "manifest.json is invalid", exception);
        }
    }

    private String _jsonString(JsonObject jsonObject, String name)
        throws ContentImportException {

        JsonElement jsonElement = jsonObject.get(name);

        if ((jsonElement == null) || !jsonElement.isJsonPrimitive() ||
            !jsonElement.getAsJsonPrimitive().isString()) {

            throw new ContentImportException(
                "INVALID_MANIFEST",
                "Manifest field " + name + " must be a string");
        }

        return jsonElement.getAsString().trim();
    }

    private String _normalize(String name) throws ContentImportException {
        String normalized = name.replace('\\', '/');

        if (normalized.isBlank() || normalized.startsWith("/") ||
            normalized.contains("../") || normalized.equals("..") ||
            normalized.contains("/./") || normalized.endsWith("/..") ||
            normalized.indexOf('\0') >= 0 || normalized.contains(":")) {

            throw new ContentImportException(
                "UNSAFE_ZIP_ENTRY", "Unsafe ZIP entry " + name);
        }

        return normalized;
    }

    private static final int _MAX_COMPRESSED_BYTES = 25 * 1024 * 1024;
    private static final int _MAX_ENTRIES = 256;
    private static final int _MAX_ENTRY_BYTES = 15 * 1024 * 1024;
    private static final int _MAX_EXPANDED_BYTES = 64 * 1024 * 1024;
    private static final int _MAX_MANIFEST_BYTES = 64 * 1024;
    private static final int _MAX_WORKBOOK_BYTES = 10 * 1024 * 1024;
}
