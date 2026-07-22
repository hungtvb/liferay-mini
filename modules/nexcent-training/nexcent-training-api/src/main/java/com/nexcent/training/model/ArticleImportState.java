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
 * The extended model interface for the ArticleImportState service. Represents a row in the &quot;NXC_ArticleImportState&quot; database table, with each column mapped to a property of this class.
 *
 * @author Nexcent Training
 * @see ArticleImportStateModel
 * @generated
 */
@ImplementationClassName(
	"com.nexcent.training.model.impl.ArticleImportStateImpl"
)
@ProviderType
public interface ArticleImportState
	extends ArticleImportStateModel, PersistedModel {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this interface directly. Add methods to <code>com.nexcent.training.model.impl.ArticleImportStateImpl</code> and rerun ServiceBuilder to automatically copy the method declarations to this interface.
	 */
	public static final Accessor<ArticleImportState, Long>
		ARTICLE_IMPORT_STATE_ID_ACCESSOR =
			new Accessor<ArticleImportState, Long>() {

				@Override
				public Long get(ArticleImportState articleImportState) {
					return articleImportState.getArticleImportStateId();
				}

				@Override
				public Class<Long> getAttributeClass() {
					return Long.class;
				}

				@Override
				public Class<ArticleImportState> getTypeClass() {
					return ArticleImportState.class;
				}

			};

}
// LIFERAY-SERVICE-BUILDER-HASH:-314302768