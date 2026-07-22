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
 * The table class for the &quot;NXC_ImportJob&quot; database table.
 *
 * @author Nexcent Training
 * @see ImportJob
 * @generated
 */
public class ImportJobTable extends BaseTable<ImportJobTable> {

	public static final ImportJobTable INSTANCE = new ImportJobTable();

	public final Column<ImportJobTable, String> uuid = createColumn(
		"uuid_", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Long> importJobId = createColumn(
		"importJobId", Long.class, Types.BIGINT, Column.FLAG_PRIMARY);
	public final Column<ImportJobTable, Long> groupId = createColumn(
		"groupId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Long> companyId = createColumn(
		"companyId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Long> userId = createColumn(
		"userId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, String> userName = createColumn(
		"userName", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Date> createDate = createColumn(
		"createDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Date> modifiedDate = createColumn(
		"modifiedDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, String> jobKey = createColumn(
		"jobKey", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Long> fileEntryId = createColumn(
		"fileEntryId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, String> fileName = createColumn(
		"fileName", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, String> sha256 = createColumn(
		"sha256", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, String> structureERC = createColumn(
		"structureERC", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, String> status = createColumn(
		"status", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Integer> totalRows = createColumn(
		"totalRows", Integer.class, Types.INTEGER, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Integer> createdRows = createColumn(
		"createdRows", Integer.class, Types.INTEGER, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Integer> updatedRows = createColumn(
		"updatedRows", Integer.class, Types.INTEGER, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Integer> skippedRows = createColumn(
		"skippedRows", Integer.class, Types.INTEGER, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Integer> failedRows = createColumn(
		"failedRows", Integer.class, Types.INTEGER, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Date> startedDate = createColumn(
		"startedDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, Date> completedDate = createColumn(
		"completedDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ImportJobTable, String> errorMessage = createColumn(
		"errorMessage", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);

	private ImportJobTable() {
		super("NXC_ImportJob", ImportJobTable::new);
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:-72986407