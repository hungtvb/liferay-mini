/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.rest.internal.graphql.servlet.v1_0;

import com.liferay.portal.kernel.util.ObjectValuePair;
import com.liferay.portal.vulcan.graphql.servlet.ServletData;

import com.nexcent.training.rest.internal.graphql.mutation.v1_0.Mutation;
import com.nexcent.training.rest.internal.graphql.query.v1_0.Query;
import com.nexcent.training.rest.internal.resource.v1_0.ContentImportJobItemResourceImpl;
import com.nexcent.training.rest.internal.resource.v1_0.ContentImportJobResourceImpl;
import com.nexcent.training.rest.internal.resource.v1_0.ContentImportProfileResourceImpl;
import com.nexcent.training.rest.resource.v1_0.ContentImportJobItemResource;
import com.nexcent.training.rest.resource.v1_0.ContentImportJobResource;
import com.nexcent.training.rest.resource.v1_0.ContentImportProfileResource;

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
		Mutation.setContentImportJobResourceComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects);

		Query.setContentImportJobResourceComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects);
		Query.setContentImportJobItemResourceComponentServiceObjects(
			_contentImportJobItemResourceComponentServiceObjects);
		Query.setContentImportProfileResourceComponentServiceObjects(
			_contentImportProfileResourceComponentServiceObjects);
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
						"mutation#createSiteContentImportJob",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"postSiteContentImportJob"));
					put(
						"mutation#createSiteContentImportJobBatch",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"postSiteContentImportJobBatch"));
					put(
						"mutation#createSiteContentImportJobExecute",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"postSiteContentImportJobExecute"));
					put(
						"mutation#createSiteContentImportJobRetry",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"postSiteContentImportJobRetry"));
					put(
						"mutation#createSiteContentImportJobValidate",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"postSiteContentImportJobValidate"));

					put(
						"query#contentImportJob",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"getSiteContentImportJob"));
					put(
						"query#contentImportJobErrorReport",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"getSiteContentImportJobErrorReport"));
					put(
						"query#contentImportJobs",
						new ObjectValuePair<>(
							ContentImportJobResourceImpl.class,
							"getSiteContentImportJobsPage"));
					put(
						"query#contentImportJobItems",
						new ObjectValuePair<>(
							ContentImportJobItemResourceImpl.class,
							"getSiteContentImportJobItemsPage"));
					put(
						"query#contentImportProfiles",
						new ObjectValuePair<>(
							ContentImportProfileResourceImpl.class,
							"getSiteContentImportProfilesPage"));
				}
			};

	@Reference(scope = ReferenceScope.PROTOTYPE_REQUIRED)
	private ComponentServiceObjects<ContentImportJobResource>
		_contentImportJobResourceComponentServiceObjects;

	@Reference(scope = ReferenceScope.PROTOTYPE_REQUIRED)
	private ComponentServiceObjects<ContentImportJobItemResource>
		_contentImportJobItemResourceComponentServiceObjects;

	@Reference(scope = ReferenceScope.PROTOTYPE_REQUIRED)
	private ComponentServiceObjects<ContentImportProfileResource>
		_contentImportProfileResourceComponentServiceObjects;

}
// LIFERAY-REST-BUILDER-HASH:73269794