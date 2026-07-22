package com.nexcent.training.article.importer.internal;

import com.nexcent.training.content.importer.ContentImportException;

import java.io.ByteArrayOutputStream;

import java.nio.charset.StandardCharsets;

import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.junit.Assert;
import org.junit.Test;

public class SafeZipPackageReaderTest {

    @Test
    public void testReadsManifestAndWorkbook() throws Exception {
        byte[] workbook = {1, 2, 3};
        ArticleImportPackage articleImportPackage =
            new SafeZipPackageReader().read(
                _zip("articles.xlsx", workbook));

        Assert.assertEquals(
            "NXC_ARTICLE_V1", articleImportPackage.importProfileKey);
        Assert.assertEquals("1.0", articleImportPackage.schemaVersion);
        Assert.assertArrayEquals(workbook, articleImportPackage.workbook);
    }

    @Test
    public void testRejectsTraversal() throws Exception {
        try {
            new SafeZipPackageReader().read(_zip("../articles.xlsx", new byte[1]));

            Assert.fail("Expected unsafe entry rejection");
        }
        catch (ContentImportException contentImportException) {
            Assert.assertEquals(
                "UNSAFE_ZIP_ENTRY", contentImportException.getCode());
        }
    }

    private byte[] _zip(String workbookName, byte[] workbook) throws Exception {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
             ZipOutputStream zipOutputStream = new ZipOutputStream(
                 outputStream)) {

            _write(
                zipOutputStream, "manifest.json",
                ("{\"schemaVersion\":\"1.0\"," +
                    "\"importProfileKey\":\"NXC_ARTICLE_V1\"," +
                    "\"siteExternalReferenceCode\":" +
                        "\"NEXCENT-PUBLIC-WEBSITE\"," +
                    "\"mode\":\"UPSERT\"}").getBytes(
                        StandardCharsets.UTF_8));
            _write(zipOutputStream, workbookName, workbook);
            zipOutputStream.finish();

            return outputStream.toByteArray();
        }
    }

    private void _write(
            ZipOutputStream zipOutputStream, String name, byte[] bytes)
        throws Exception {

        zipOutputStream.putNextEntry(new ZipEntry(name));
        zipOutputStream.write(bytes);
        zipOutputStream.closeEntry();
    }
}
