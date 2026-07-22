/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.rest.internal.graphql.servlet.v1_0;

import com.liferay.portal.kernel.util.ObjectValuePair;
import com.liferay.portal.vulcan.graphql.servlet.ServletData;

import com.nexcent.training.rest.internal.graphql.mutation.v1_0.Mutation;
import com.nexcent.training.rest.internal.graphql.query.v1_0.Query;
import com.nexcent.training.rest.internal.resource.v1_0.ArticleImportJobItemResourceImpl;
import com.nexcent.training.rest.internal.resource.v1_0.ArticleImportJobResourceImpl;
import com.nexcent.training.rest.resource.v1_0.ArticleImportJobItemResource;
import com.nexcent.training.rest.resource.v1_0.ArticleImportJobResource;

import jakarta.annotation.Generated;

import java.util.HashMap;
import java.util.Map;

import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentServiceObjects;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceScope;

/**
 * @author Nexcent Training
 * @generated
 */
@Component(service = ServletData.class)
@Generated("")
public class ServletDataImpl implements ServletData {

	@Activate
	public void activate(BundleContext bundleContext) {
		Mutation.setArticleImportJobResourceComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects);

		Query.setArticleImportJobResourceComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects);
		Query.setArticleImportJobItemResourceComponentServiceObjects(
			_articleImportJobItemResourceComponentServiceObjects);
	}

	public String getApplicationName() {
		return "Liferay.Nexcent.Training";
	}

	@Override
	public Mutation getMutation() {
		return new Mutation();
	}

	@Override
	public String getPath() {
		return "/nexcent-training-graphql/v1_0";
	}

	@Override
	public Query getQuery() {
		return new Query();
	}

	public ObjectValuePair<Class<?>, String> getResourceMethodObjectValuePair(
		String methodName, boolean mutation) {

		if (mutation) {
			return _resourceMethodObjectValuePairs.get(
				"mutation#" + methodName);
		}

		return _resourceMethodObjectValuePairs.get("query#" + methodName);
	}

	private static final Map<String, ObjectValuePair<Class<?>, String>>
		_resourceMethodObjectValuePairs =
			new HashMap<String, ObjectValuePair<Class<?>, String>>() {
				{
					put(
						"mutation#createSiteArticleImportJob",
						new ObjectValuePair<>(
							ArticleImportJobResourceImpl.class,
							"postSiteArticleImportJob"));
					put(
						"mutation#createSiteArticleImportJobBatch",
						new ObjectValuePair<>(
							ArticleImportJobResourceImpl.class,
							"postSiteArticleImportJobBatch"));
					put(
						"mutation#createSiteArticleImportJobExecute",
						new ObjectValuePair<>(
							ArticleImportJobResourceImpl.class,
							"postSiteArticleImportJobExecute"));
					put(
						"mutation#createSiteArticleImportJobValidate",
						new ObjectValuePair<>(
							ArticleImportJobResourceImpl.class,
							"postSiteArticleImportJobValidate"));

					put(
						"query#articleImportJob",
						new ObjectValuePair<>(
							ArticleImportJobResourceImpl.class,
							"getSiteArticleImportJob"));
					put(
						"query#articleImportJobs",
						new ObjectValuePair<>(
							ArticleImportJobResourceImpl.class,
							"getSiteArticleImportJobsPage"));
					put(
						"query#articleImportJobItems",
						new ObjectValuePair<>(
							ArticleImportJobItemResourceImpl.class,
							"getSiteArticleImportJobItemsPage"));
				}
			};

	@Reference(scope = ReferenceScope.PROTOTYPE_REQUIRED)
	private ComponentServiceObjects<ArticleImportJobResource>
		_articleImportJobResourceComponentServiceObjects;

	@Reference(scope = ReferenceScope.PROTOTYPE_REQUIRED)
	private ComponentServiceObjects<ArticleImportJobItemResource>
		_articleImportJobItemResourceComponentServiceObjects;

}
// LIFERAY-REST-BUILDER-HASH:1766419112