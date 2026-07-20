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
 * The extended model interface for the ImportJob service. Represents a row in the &quot;NXC_ImportJob&quot; database table, with each column mapped to a property of this class.
 *
 * @author Nexcent Training
 * @see ImportJobModel
 * @generated
 */
@ImplementationClassName("com.nexcent.training.model.impl.ImportJobImpl")
@ProviderType
public interface ImportJob extends ImportJobModel, PersistedModel {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this interface directly. Add methods to <code>com.nexcent.training.model.impl.ImportJobImpl</code> and rerun ServiceBuilder to automatically copy the method declarations to this interface.
	 */
	public static final Accessor<ImportJob, Long> IMPORT_JOB_ID_ACCESSOR =
		new Accessor<ImportJob, Long>() {

			@Override
			public Long get(ImportJob importJob) {
				return importJob.getImportJobId();
			}

			@Override
			public Class<Long> getAttributeClass() {
				return Long.class;
			}

			@Override
			public Class<ImportJob> getTypeClass() {
				return ImportJob.class;
			}

		};

}
// LIFERAY-SERVICE-BUILDER-HASH:-1908171429