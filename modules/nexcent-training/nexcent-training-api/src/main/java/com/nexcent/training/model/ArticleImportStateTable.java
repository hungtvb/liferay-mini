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
 * The table class for the &quot;NXC_ArticleImportState&quot; database table.
 *
 * @author Nexcent Training
 * @see ArticleImportState
 * @generated
 */
public class ArticleImportStateTable
	extends BaseTable<ArticleImportStateTable> {

	public static final ArticleImportStateTable INSTANCE =
		new ArticleImportStateTable();

	public final Column<ArticleImportStateTable, Long> articleImportStateId =
		createColumn(
			"articleImportStateId", Long.class, Types.BIGINT,
			Column.FLAG_PRIMARY);
	public final Column<ArticleImportStateTable, Long> groupId = createColumn(
		"groupId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ArticleImportStateTable, Long> companyId = createColumn(
		"companyId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);
	public final Column<ArticleImportStateTable, Date> createDate =
		createColumn(
			"createDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ArticleImportStateTable, Date> modifiedDate =
		createColumn(
			"modifiedDate", Date.class, Types.TIMESTAMP, Column.FLAG_DEFAULT);
	public final Column<ArticleImportStateTable, String> articleERC =
		createColumn(
			"articleERC", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ArticleImportStateTable, String> locale = createColumn(
		"locale", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ArticleImportStateTable, String> payloadHash =
		createColumn(
			"payloadHash", String.class, Types.VARCHAR, Column.FLAG_DEFAULT);
	public final Column<ArticleImportStateTable, Long> lastImportJobId =
		createColumn(
			"lastImportJobId", Long.class, Types.BIGINT, Column.FLAG_DEFAULT);

	private ArticleImportStateTable() {
		super("NXC_ArticleImportState", ArticleImportStateTable::new);
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:-108101555