package com.nexcent.training.article.importer.internal;

import com.nexcent.training.article.importer.ArticleImportException;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

class XlsxArticleParser {

    static final List<String> HEADERS = Collections.unmodifiableList(
        Arrays.asList(
            "operation", "externalReferenceCode", "locale", "title",
            "friendlyUrlPath", "summary", "bodyHtml", "coverImageKey",
            "coverImageAlt", "authorName", "publicationDate",
            "expirationDate", "categoryERCs", "tags", "featured",
            "sortOrder", "publish"));

    List<ArticleImportRow> parse(byte[] bytes) throws ArticleImportException {
        return parseWorkbook(bytes).articleRows;
    }

    ArticleWorkbookData parseWorkbook(byte[] bytes)
        throws ArticleImportException {

        try (Workbook workbook = new XSSFWorkbook(
                new ByteArrayInputStream(bytes))) {

            if (workbook.getNumberOfSheets() > _MAX_SHEETS) {
                throw new ArticleImportException(
                    "TOO_MANY_SHEETS", "Workbook may contain at most " +
                        _MAX_SHEETS + " sheets");
            }

            Sheet sheet = workbook.getSheet("Articles");
            Sheet assetsSheet = workbook.getSheet("Assets");

            if ((sheet == null) || (assetsSheet == null)) {
                throw new ArticleImportException(
                    "MISSING_SHEET", "Sheets Articles and Assets are required");
            }

            Map<String, ArticleAssetRow> assetsByKey = _readAssets(
                assetsSheet);

            int headerRowIndex = _findHeaderRow(sheet);
            Map<String, Integer> indexes = _readHeaders(
                sheet.getRow(headerRowIndex));
            List<ArticleImportRow> rows = new ArrayList<>();

            for (int i = headerRowIndex + 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if ((row == null) || _isEmpty(row, indexes)) {
                    continue;
                }

                if (rows.size() >= _MAX_ROWS) {
                    throw new ArticleImportException(
                        "TOO_MANY_ROWS", "Workbook may contain at most " +
                            _MAX_ROWS + " Article rows");
                }

                _rejectFormulas(row, indexes);
                rows.add(_toArticleImportRow(row, indexes, assetsByKey));
            }

            if (rows.isEmpty()) {
                throw new ArticleImportException(
                    "EMPTY_WORKBOOK", "Sheet Articles has no data rows");
            }

            return new ArticleWorkbookData(rows, assetsByKey);
        }
        catch (ArticleImportException articleImportException) {
            throw articleImportException;
        }
        catch (IOException | RuntimeException exception) {
            throw new ArticleImportException(
                "INVALID_XLSX", "Workbook cannot be parsed", exception);
        }
    }

    private Map<String, ArticleAssetRow> _readAssets(Sheet sheet)
        throws ArticleImportException {

        List<String> headers = Arrays.asList(
            "imageKey", "filePath", "documentERC", "title", "altText",
            "folderERC");
        int headerRowIndex = _findHeaderRow(sheet, "imageKey");
        Map<String, Integer> indexes = _readHeaders(
            sheet.getRow(headerRowIndex), headers, "Asset");
        Map<String, ArticleAssetRow> assets = new HashMap<>();
        Set<String> documentERCs = new HashSet<>();

        for (int i = headerRowIndex + 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);

            if ((row == null) || _isEmpty(row, indexes)) {
                continue;
            }

            _rejectFormulas(row, indexes);
            ArticleAssetRow asset = new ArticleAssetRow(
                row.getRowNum() + 1, _required(row, indexes, "imageKey"),
                _required(row, indexes, "filePath"),
                _required(row, indexes, "documentERC"),
                _required(row, indexes, "title"),
                _required(row, indexes, "altText"),
                _required(row, indexes, "folderERC"));

            if ((assets.put(asset.imageKey, asset) != null) ||
                !documentERCs.add(asset.documentERC)) {

                throw new ArticleImportException(
                    "DUPLICATE_DOCUMENT_ERC",
                    "Duplicate Asset key or document ERC at row " +
                        asset.rowNumber);
            }
        }

        if (assets.size() > 500) {
            throw new ArticleImportException(
                "PACKAGE_LIMIT_EXCEEDED", "Workbook has more than 500 assets");
        }

        return assets;
    }

    private boolean _boolean(
            Row row, Map<String, Integer> indexes, String name,
            boolean defaultValue)
        throws ArticleImportException {

        String value = _value(row, indexes, name);

        if (value.isEmpty()) {
            return defaultValue;
        }

        if ("true".equalsIgnoreCase(value) || "1".equals(value)) {
            return true;
        }

        if ("false".equalsIgnoreCase(value) || "0".equals(value)) {
            return false;
        }

        throw new ArticleImportException(
            "INVALID_BOOLEAN", _message(row, name, value));
    }

    private Date _date(
            Row row, Map<String, Integer> indexes, String name,
            boolean required)
        throws ArticleImportException {

        Cell cell = row.getCell(indexes.get(name));

        if ((cell != null) && (cell.getCellType() == CellType.NUMERIC)) {
            return cell.getDateCellValue();
        }

        String value = _value(row, indexes, name);

        if (value.isEmpty()) {
            if (required) {
                throw new ArticleImportException(
                    "REQUIRED_FIELD", _message(row, name, value));
            }

            return null;
        }

        try {
            return Date.from(Instant.parse(value));
        }
        catch (RuntimeException runtimeException) {
            try {
                return Date.from(OffsetDateTime.parse(value).toInstant());
            }
            catch (RuntimeException offsetException) {
                try {
                    return Date.from(
                        LocalDateTime.parse(value).toInstant(ZoneOffset.UTC));
                }
                catch (RuntimeException localDateTimeException) {
                    try {
                        return Date.from(
                            LocalDate.parse(value).atStartOfDay().toInstant(
                                ZoneOffset.UTC));
                    }
                    catch (RuntimeException localDateException) {
                        throw new ArticleImportException(
                            "INVALID_TIMESTAMP", _message(row, name, value));
                    }
                }
            }
        }
    }

    private int _findHeaderRow(Sheet sheet) throws ArticleImportException {
        return _findHeaderRow(sheet, "operation");
    }

    private int _findHeaderRow(Sheet sheet, String firstHeader)
        throws ArticleImportException {

        int last = Math.min(sheet.getLastRowNum(), _HEADER_SCAN_ROWS - 1);

        for (int i = 0; i <= last; i++) {
            Row row = sheet.getRow(i);

            if ((row != null) &&
                firstHeader.equals(
                    _formatter.formatCellValue(row.getCell(0)))) {

                return i;
            }
        }

        throw new ArticleImportException(
            "INVALID_HEADER", "Could not find header row beginning with " +
                firstHeader);
    }

    private int _integer(
            Row row, Map<String, Integer> indexes, String name)
        throws ArticleImportException {

        String value = _value(row, indexes, name);

        try {
            return Integer.parseInt(value.replace(".0", ""));
        }
        catch (NumberFormatException numberFormatException) {
            throw new ArticleImportException(
                "INVALID_INTEGER", _message(row, name, value));
        }
    }

    private boolean _isEmpty(Row row, Map<String, Integer> indexes) {
        for (Integer index : indexes.values()) {
            if (!_formatter.formatCellValue(row.getCell(index)).trim().isEmpty()) {
                return false;
            }
        }

        return true;
    }

    private List<String> _list(
        Row row, Map<String, Integer> indexes, String name) {

        String value = _value(row, indexes, name);

        if (value.isEmpty()) {
            return Collections.emptyList();
        }

        List<String> values = new ArrayList<>();

        for (String item : value.split(";")) {
            String normalized = item.trim();

            if (!normalized.isEmpty() && !values.contains(normalized)) {
                values.add(normalized);
            }
        }

        return values;
    }

    private String _message(Row row, String name, String value) {
        return "Row " + (row.getRowNum() + 1) + ", field " + name +
            " has invalid value '" + value + "'";
    }

    private Map<String, Integer> _readHeaders(Row row)
        throws ArticleImportException {

        return _readHeaders(row, HEADERS, "Article");
    }

    private Map<String, Integer> _readHeaders(
            Row row, List<String> expectedHeaders, String contractName)
        throws ArticleImportException {

        Map<String, Integer> indexes = new HashMap<>();
        Set<String> duplicates = new HashSet<>();

        for (int i = 0; i < row.getLastCellNum(); i++) {
            String header = _formatter.formatCellValue(row.getCell(i)).trim();

            if (header.isEmpty()) {
                continue;
            }

            if (indexes.put(header, i) != null) {
                duplicates.add(header);
            }
        }

        if (!duplicates.isEmpty() || !indexes.keySet().equals(
                new HashSet<>(expectedHeaders))) {

            throw new ArticleImportException(
                "INVALID_HEADER", "Headers must match the " + contractName +
                    " contract: " + String.join(",", expectedHeaders));
        }

        return indexes;
    }

    private String _required(
            Row row, Map<String, Integer> indexes, String name)
        throws ArticleImportException {

        String value = _value(row, indexes, name);

        if (value.isEmpty()) {
            throw new ArticleImportException(
                "REQUIRED_FIELD", _message(row, name, value));
        }

        return value;
    }

    private void _rejectFormulas(Row row, Map<String, Integer> indexes)
        throws ArticleImportException {

        for (Map.Entry<String, Integer> entry : indexes.entrySet()) {
            Cell cell = row.getCell(entry.getValue());

            if ((cell != null) &&
                (cell.getCellType() == CellType.FORMULA)) {

                throw new ArticleImportException(
                    "FORMULA_NOT_ALLOWED",
                    "Row " + (row.getRowNum() + 1) + ", field " +
                        entry.getKey() + " contains a formula");
            }
        }
    }

    private ArticleImportRow _toArticleImportRow(
            Row row, Map<String, Integer> indexes,
            Map<String, ArticleAssetRow> assetsByKey)
        throws ArticleImportException {

        String operation = _required(row, indexes, "operation").toUpperCase(
            Locale.ROOT);
        boolean archive = "ARCHIVE".equals(operation);

        if (!archive && !"UPSERT".equals(operation)) {
            throw new ArticleImportException(
                "INVALID_OPERATION", _message(row, "operation", operation));
        }

        String coverImageKey = archive ?
            _value(row, indexes, "coverImageKey") :
                _required(row, indexes, "coverImageKey");
        ArticleAssetRow asset = assetsByKey.get(coverImageKey);

        return new ArticleImportRow(
            row.getRowNum() + 1, operation,
            _required(row, indexes, "externalReferenceCode"),
            _required(row, indexes, "locale"),
            archive ? _value(row, indexes, "title") :
                _required(row, indexes, "title"),
            archive ? _value(row, indexes, "friendlyUrlPath") :
                _required(row, indexes, "friendlyUrlPath"),
            archive ? _value(row, indexes, "summary") :
                _required(row, indexes, "summary"),
            archive ? _value(row, indexes, "bodyHtml") :
                _required(row, indexes, "bodyHtml"),
            coverImageKey, (asset == null) ? null : asset.documentERC,
            archive ? _value(row, indexes, "coverImageAlt") :
                _required(row, indexes, "coverImageAlt"),
            archive ? _value(row, indexes, "authorName") :
                _required(row, indexes, "authorName"),
            archive ? null : _date(row, indexes, "publicationDate", true),
            _date(row, indexes, "expirationDate", false),
            _list(row, indexes, "categoryERCs"),
            _list(row, indexes, "tags"),
            _boolean(row, indexes, "featured", false),
            archive ? 0 : _integer(row, indexes, "sortOrder"),
            _boolean(row, indexes, "publish", false));
    }

    private String _value(
        Row row, Map<String, Integer> indexes, String name) {

        return _formatter.formatCellValue(
            row.getCell(indexes.get(name))).trim();
    }

    private static final int _HEADER_SCAN_ROWS = 20;
    private static final int _MAX_ROWS = 5000;
    private static final int _MAX_SHEETS = 10;

    private final DataFormatter _formatter = new DataFormatter(Locale.ROOT);
}
