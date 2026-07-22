package com.nexcent.training.article.importer.internal;

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

import java.util.regex.Matcher;
import java.util.regex.Pattern;

class SafeZipPackageReader {

    ArticleImportPackage read(byte[] bytes) throws ContentImportException {
        if ((bytes == null) || (bytes.length < 4) ||
            (bytes.length > _MAX_COMPRESSED_BYTES) || (bytes[0] != 'P') ||
            (bytes[1] != 'K')) {

            throw new ContentImportException(
                "INVALID_PACKAGE_LAYOUT", "Package must be a ZIP up to 100 MiB");
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

                if (zipEntry.isDirectory()) {
                    continue;
                }

                if (names.size() > _MAX_ENTRIES) {
                    throw new ContentImportException(
                        "PACKAGE_LIMIT_EXCEEDED", "Package has too many entries");
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
                            "Expanded package exceeds 250 MiB");
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
            (workbook.length > _MAX_WORKBOOK_BYTES)) {

            throw new ContentImportException(
                "INVALID_PACKAGE_LAYOUT",
                "Package requires manifest.json and articles.xlsx");
        }

        try {
            String manifest = new String(
                manifestBytes, StandardCharsets.UTF_8);
            String schemaVersion = _jsonString(manifest, "schemaVersion");
            String profileKey = _jsonString(manifest, "importProfileKey");
            String siteERC = _jsonString(
                manifest, "siteExternalReferenceCode");
            String mode = _jsonString(manifest, "mode").toUpperCase(
                Locale.ROOT);

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
        catch (RuntimeException runtimeException) {
            throw new ContentImportException(
                "INVALID_MANIFEST", "manifest.json is invalid",
                runtimeException);
        }
    }

    private String _jsonString(String json, String name)
        throws ContentImportException {

        Pattern pattern = Pattern.compile(
            "\\\"" + Pattern.quote(name) +
                "\\\"\\s*:\\s*\\\"([^\\\"]*)\\\"");
        Matcher matcher = pattern.matcher(json);

        if (!matcher.find()) {
            throw new ContentImportException(
                "INVALID_MANIFEST", "Manifest field " + name +
                    " must occur exactly once");
        }

        String value = matcher.group(1);

        if (matcher.find()) {
            throw new ContentImportException(
                "INVALID_MANIFEST", "Manifest field " + name +
                    " must occur exactly once");
        }

        return value;
    }

    private String _normalize(String name) throws ContentImportException {
        String normalized = name.replace('\\', '/');

        if (normalized.startsWith("/") || normalized.contains("../") ||
            normalized.equals("..") || normalized.contains("/./") ||
            normalized.indexOf('\0') >= 0 || normalized.contains(":")) {

            throw new ContentImportException(
                "UNSAFE_ZIP_ENTRY", "Unsafe ZIP entry " + name);
        }

        return normalized;
    }

    private static final int _MAX_COMPRESSED_BYTES = 100 * 1024 * 1024;
    private static final int _MAX_ENTRIES = 512;
    private static final int _MAX_EXPANDED_BYTES = 250 * 1024 * 1024;
    private static final int _MAX_WORKBOOK_BYTES = 10 * 1024 * 1024;
}
