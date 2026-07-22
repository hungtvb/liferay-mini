/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.model;

import com.liferay.portal.kernel.annotation.ImplementationClassName;
import com.liferay.portal.kernel.model.PersistedModel;
import com.liferay.portal.kernel.util.Accessor;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The extended model interface for the ImportJobItem service. Represents a row in the &quot;NXC_ImportJobItem&quot; database table, with each column mapped to a property of this class.
 *
 * @author Nexcent Training
 * @see ImportJobItemModel
 * @generated
 */
@ImplementationClassName("com.nexcent.training.model.impl.ImportJobItemImpl")
@ProviderType
public interface ImportJobItem extends ImportJobItemModel, PersistedModel {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this interface directly. Add methods to <code>com.nexcent.training.model.impl.ImportJobItemImpl</code> and rerun ServiceBuilder to automatically copy the method declarations to this interface.
	 */
	public static final Accessor<ImportJobItem, Long>
		IMPORT_JOB_ITEM_ID_ACCESSOR = new Accessor<ImportJobItem, Long>() {

			@Override
			public Long get(ImportJobItem importJobItem) {
				return importJobItem.getImportJobItemId();
			}

			@Override
			public Class<Long> getAttributeClass() {
				return Long.class;
			}

			@Override
			public Class<ImportJobItem> getTypeClass() {
				return ImportJobItem.class;
			}

		};

}
// LIFERAY-SERVICE-BUILDER-HASH:-1511390686