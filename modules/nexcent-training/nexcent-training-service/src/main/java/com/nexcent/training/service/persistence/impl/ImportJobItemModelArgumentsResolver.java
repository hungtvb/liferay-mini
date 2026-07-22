/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence.impl;

import com.liferay.portal.kernel.dao.orm.ArgumentsResolver;
import com.liferay.portal.kernel.dao.orm.FinderPath;
import com.liferay.portal.kernel.model.BaseModel;

import com.nexcent.training.model.ImportJobItemTable;
import com.nexcent.training.model.impl.ImportJobItemImpl;
import com.nexcent.training.model.impl.ImportJobItemModelImpl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.osgi.service.component.annotations.Component;

/**
 * The arguments resolver class for retrieving value from ImportJobItem.
 *
 * @author Nexcent Training
 * @generated
 */
@Component(
	property = {
		"class.name=com.nexcent.training.model.impl.ImportJobItemImpl",
		"table.name=NXC_ImportJobItem"
	},
	service = ArgumentsResolver.class
)
public class ImportJobItemModelArgumentsResolver implements ArgumentsResolver {

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

		ImportJobItemModelImpl importJobItemModelImpl =
			(ImportJobItemModelImpl)baseModel;

		long columnBitmask = importJobItemModelImpl.getColumnBitmask();

		if (!checkColumn || (columnBitmask == 0)) {
			return _getValue(importJobItemModelImpl, columnNames, original);
		}

		Long finderPathColumnBitmask = _finderPathColumnBitmasksCache.get(
			finderPath);

		if (finderPathColumnBitmask == null) {
			finderPathColumnBitmask = 0L;

			for (String columnName : columnNames) {
				finderPathColumnBitmask |=
					importJobItemModelImpl.getColumnBitmask(columnName);
			}

			if (finderPath.isBaseModelResult() &&
				(ImportJobItemPersistenceImpl.
					FINDER_CLASS_NAME_LIST_WITHOUT_PAGINATION ==
						finderPath.getCacheName())) {

				finderPathColumnBitmask |= _ORDER_BY_COLUMNS_BITMASK;
			}

			_finderPathColumnBitmasksCache.put(
				finderPath, finderPathColumnBitmask);
		}

		if ((columnBitmask & finderPathColumnBitmask) != 0) {
			return _getValue(importJobItemModelImpl, columnNames, original);
		}

		return null;
	}

	@Override
	public String getClassName() {
		return ImportJobItemImpl.class.getName();
	}

	@Override
	public String getTableName() {
		return ImportJobItemTable.INSTANCE.getTableName();
	}

	private static Object[] _getValue(
		ImportJobItemModelImpl importJobItemModelImpl, String[] columnNames,
		boolean original) {

		Object[] arguments = new Object[columnNames.length];

		for (int i = 0; i < arguments.length; i++) {
			String columnName = columnNames[i];

			if (original) {
				arguments[i] = importJobItemModelImpl.getColumnOriginalValue(
					columnName);
			}
			else {
				arguments[i] = importJobItemModelImpl.getColumnValue(
					columnName);
			}
		}

		return arguments;
	}

	private static final Map<FinderPath, Long> _finderPathColumnBitmasksCache =
		new ConcurrentHashMap<>();

	private static final long _ORDER_BY_COLUMNS_BITMASK;

	static {
		long orderByColumnsBitmask = 0;

		orderByColumnsBitmask |= ImportJobItemModelImpl.getColumnBitmask(
			"rowNumber");

		_ORDER_BY_COLUMNS_BITMASK = orderByColumnsBitmask;
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:-74154385