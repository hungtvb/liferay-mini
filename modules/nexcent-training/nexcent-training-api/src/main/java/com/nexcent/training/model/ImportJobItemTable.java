/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.model;

import com.liferay.petra.sql.dsl.Column;
import com.liferay.petra.sql.dsl.base.BaseTable;

import java.sql.Types;

import java.util.Date;

/**
 * The table class for the &quot;NXC_ImportJobItem&quot; database table.
 *
 * @author Nexcent Training
 * @see ImportJobItem
 * @generated
 */
public class ImportJobItemTable extends BaseTable<ImportJobItemTable> {

	public static final ImportJobItemTable INSTANCE = new ImportJobItemTable();

	public final Column<ImportJobItemTable, Long> importJobItemId =
		createColumn(
			"importJobItemId", Long.class, Types.BIGINT, Column.FLAG_PRIMARY);
	public final Column<ImportJobItemTable, Long> groupId = createColumn(
		"groupId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, Long> companyId = createColumn(
		"companyId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, Date> createDate = createColumn(
		"createDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, Date> modifiedDate = createColumn(
		"modifiedDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, Long> importJobId = createColumn(
		"importJobId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, Integer> rowNumber = createColumn(
		"rowNumber", Integer.class, Types.INTEGER, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> targetType = createColumn(
		"targetType", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> targetERC = createColumn(
		"targetERC", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> sheetName = createColumn(
		"sheetName", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> locale = createColumn(
		"locale", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> operation = createColumn(
		"operation", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> result = createColumn(
		"result", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> severity = createColumn(
		"severity", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> messageCode = createColumn(
		"messageCode", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> message = createColumn(
		"message", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobItemTable, String> payloadHash = createColumn(
		"payloadHash", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);

	private ImportJobItemTable() {
		super("NXC_ImportJobItem", ImportJobItemTable::new);
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:-344274812