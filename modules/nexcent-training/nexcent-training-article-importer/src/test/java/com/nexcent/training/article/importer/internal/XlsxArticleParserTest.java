package com.nexcent.training.article.importer.internal;

import com.nexcent.training.article.importer.ArticleImportException;

import java.io.ByteArrayOutputStream;

import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.junit.Assert;
import org.junit.Test;

public class XlsxArticleParserTest {

    @Test
    public void testParsesArticleContract() throws Exception {
        byte[] bytes = _workbook(false);

        List<ArticleImportRow> rows = new XlsxArticleParser().parse(bytes);

        Assert.assertEquals(1, rows.size());
        Assert.assertEquals("NXC-ARTICLE-001", rows.get(0).externalReferenceCode);
        Assert.assertEquals("en-US", rows.get(0).locale);
        Assert.assertEquals("cover-1", rows.get(0).coverImageKey);
        Assert.assertEquals("NXC-DOC-001", rows.get(0).coverImageERC);
        Assert.assertEquals(2, rows.get(0).categoryERCs.size());
        Assert.assertFalse(rows.get(0).publish);
    }

    @Test
    public void testRejectsFormulaCells() throws Exception {
        try {
            new XlsxArticleParser().parse(_workbook(true));

            Assert.fail("Expected formula rejection");
        }
        catch (ArticleImportException articleImportException) {
            Assert.assertEquals(
                "FORMULA_NOT_ALLOWED", articleImportException.getCode());
        }
    }

    private byte[] _workbook(boolean formula) throws Exception {
        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Articles");
            Row header = sheet.createRow(3);

            for (int i = 0; i < XlsxArticleParser.HEADERS.size(); i++) {
                header.createCell(i).setCellValue(
                    XlsxArticleParser.HEADERS.get(i));
            }

            Row row = sheet.createRow(4);
            Object[] values = {
                "UPSERT", "NXC-ARTICLE-001", "en-US", "Article title",
                "article-title",
                "This summary is deliberately longer than forty characters.",
                "<p>Safe body</p>", "cover-1", "Cover alt",
                "Nexcent Editorial Team", new Date(1782867600000L), "",
                "NXC-TOPIC-1;NXC-TOPIC-2", "one;two", true, 10, false
            };

            for (int i = 0; i < values.length; i++) {
                Object value = values[i];

                if (value instanceof Boolean) {
                    row.createCell(i).setCellValue((Boolean)value);
                }
                else if (value instanceof Date) {
                    row.createCell(i).setCellValue((Date)value);
                }
                else if (value instanceof Number) {
                    row.createCell(i).setCellValue(
                        ((Number)value).doubleValue());
                }
                else {
                    row.createCell(i).setCellValue(String.valueOf(value));
                }
            }

            if (formula) {
                row.getCell(3).setCellFormula("\"Injected title\"");
            }

            Sheet assets = workbook.createSheet("Assets");
            Row assetHeader = assets.createRow(0);
            String[] assetHeaders = {
                "imageKey", "filePath", "documentERC", "title", "altText",
                "folderERC"
            };

            for (int i = 0; i < assetHeaders.length; i++) {
                assetHeader.createCell(i).setCellValue(assetHeaders[i]);
            }

            Row asset = assets.createRow(1);
            String[] assetValues = {
                "cover-1", "assets/cover.webp", "NXC-DOC-001",
                "Cover image", "Cover alt", "NXC-FOLDER-ARTICLE-MEDIA"
            };

            for (int i = 0; i < assetValues.length; i++) {
                asset.createCell(i).setCellValue(assetValues[i]);
            }

            try (ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream()) {

                workbook.write(outputStream);

                return outputStream.toByteArray();
            }
        }
    }
}
