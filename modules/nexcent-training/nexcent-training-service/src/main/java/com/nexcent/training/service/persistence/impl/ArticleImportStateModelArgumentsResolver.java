/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence.impl;

import com.liferay.portal.kernel.dao.orm.ArgumentsResolver;
import com.liferay.portal.kernel.dao.orm.FinderPath;
import com.liferay.portal.kernel.model.BaseModel;

import com.nexcent.training.model.ArticleImportStateTable;
import com.nexcent.training.model.impl.ArticleImportStateImpl;
import com.nexcent.training.model.impl.ArticleImportStateModelImpl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.osgi.service.component.annotations.Component;

/**
 * The arguments resolver class for retrieving value from ArticleImportState.
 *
 * @author Nexcent Training
 * @generated
 */
@Component(
	property = {
		"class.name=com.nexcent.training.model.impl.ArticleImportStateImpl",
		"table.name=NXC_ArticleImportState"
	},
	service = ArgumentsResolver.class
)
public class ArticleImportStateModelArgumentsResolver
	implements ArgumentsResolver {

	@Override
	public Object[] getArguments(
		FinderPath finderPath, BaseModel<?> baseModel, boolean checkColumn,
		boolean original) {

		String[] columnNames = finderPath.getColumnNames();

		if ((columnNames == null) || (columnNames.length == 0)) {
			if (baseModel.isNew()) {
				return new Object[0];
			}

			return null;
		}

		ArticleImportStateModelImpl articleImportStateModelImpl =
			(ArticleImportStateModelImpl)baseModel;

		long columnBitmask = articleImportStateModelImpl.getColumnBitmask();

		if (!checkColumn || (columnBitmask == 0)) {
			return _getValue(
				articleImportStateModelImpl, columnNames, original);
		}

		Long finderPathColumnBitmask = _finderPathColumnBitmasksCache.get(
			finderPath);

		if (finderPathColumnBitmask == null) {
			finderPathColumnBitmask = 0L;

			for (String columnName : columnNames) {
				finderPathColumnBitmask |=
					articleImportStateModelImpl.getColumnBitmask(columnName);
			}

			_finderPathColumnBitmasksCache.put(
				finderPath, finderPathColumnBitmask);
		}

		if ((columnBitmask & finderPathColumnBitmask) != 0) {
			return _getValue(
				articleImportStateModelImpl, columnNames, original);
		}

		return null;
	}

	@Override
	public String getClassName() {
		return ArticleImportStateImpl.class.getName();
	}

	@Override
	public String getTableName() {
		return ArticleImportStateTable.INSTANCE.getTableName();
	}

	private static Object[] _getValue(
		ArticleImportStateModelImpl articleImportStateModelImpl,
		String[] columnNames, boolean original) {

		Object[] arguments = new Object[columnNames.length];

		for (int i = 0; i < arguments.length; i++) {
			String columnName = columnNames[i];

			if (original) {
				arguments[i] =
					articleImportStateModelImpl.getColumnOriginalValue(
						columnName);
			}
			else {
				arguments[i] = articleImportStateModelImpl.getColumnValue(
					columnName);
			}
		}

		return arguments;
	}

	private static final Map<FinderPath, Long> _finderPathColumnBitmasksCache =
		new ConcurrentHashMap<>();

}
// LIFERAY-SERVICE-BUILDER-HASH:364795240