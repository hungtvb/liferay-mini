/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.rest.internal.graphql.mutation.v1_0;

import com.liferay.petra.function.UnsafeConsumer;
import com.liferay.petra.function.UnsafeFunction;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.vulcan.accept.language.AcceptLanguage;
import com.liferay.portal.vulcan.batch.engine.resource.VulcanBatchEngineImportTaskResource;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;

import com.nexcent.training.rest.dto.v1_0.ContentImportJob;
import com.nexcent.training.rest.dto.v1_0.ContentImportJobRequest;
import com.nexcent.training.rest.resource.v1_0.ContentImportJobResource;

import jakarta.annotation.Generated;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.validation.constraints.NotEmpty;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import java.util.function.BiFunction;

import org.osgi.service.component.ComponentServiceObjects;

/**
 * @author Nexcent Training
 * @generated
 */
@Generated("")
public class Mutation {

	public static void setContentImportJobResourceComponentServiceObjects(
		ComponentServiceObjects<ContentImportJobResource>
			contentImportJobResourceComponentServiceObjects) {

		_contentImportJobResourceComponentServiceObjects =
			contentImportJobResourceComponentServiceObjects;
	}

	@GraphQLField
	public ContentImportJob createSiteContentImportJob(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("contentImportJobRequest") ContentImportJobRequest
				contentImportJobRequest)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource ->
				contentImportJobResource.postSiteContentImportJob(
					Long.valueOf(siteKey), contentImportJobRequest));
	}

	@GraphQLField
	public Response createSiteContentImportJobBatch(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("contentImportJobRequest") ContentImportJobRequest
				contentImportJobRequest,
			@GraphQLName("callbackURL") String callbackURL,
			@GraphQLName("object") Object object)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource ->
				contentImportJobResource.postSiteContentImportJobBatch(
					Long.valueOf(siteKey), contentImportJobRequest, callbackURL,
					object));
	}

	@GraphQLField
	public ContentImportJob createSiteContentImportJobExecute(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("jobExternalReferenceCode") String
				jobExternalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource ->
				contentImportJobResource.postSiteContentImportJobExecute(
					Long.valueOf(siteKey), jobExternalReferenceCode));
	}

	@GraphQLField
	public ContentImportJob createSiteContentImportJobRetry(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("jobExternalReferenceCode") String
				jobExternalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource ->
				contentImportJobResource.postSiteContentImportJobRetry(
					Long.valueOf(siteKey), jobExternalReferenceCode));
	}

	@GraphQLField
	public ContentImportJob createSiteContentImportJobValidate(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("jobExternalReferenceCode") String
				jobExternalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource ->
				contentImportJobResource.postSiteContentImportJobValidate(
					Long.valueOf(siteKey), jobExternalReferenceCode));
	}

	private <T, R, E1 extends Throwable, E2 extends Throwable> R
			_applyComponentServiceObjects(
				ComponentServiceObjects<T> componentServiceObjects,
				UnsafeConsumer<T, E1> unsafeConsumer,
				UnsafeFunction<T, R, E2> unsafeFunction)
		throws E1, E2 {

		T resource = componentServiceObjects.getService();

		try {
			unsafeConsumer.accept(resource);

			return unsafeFunction.apply(resource);
		}
		finally {
			componentServiceObjects.ungetService(resource);
		}
	}

	private <T, E1 extends Throwable, E2 extends Throwable> void
			_applyVoidComponentServiceObjects(
				ComponentServiceObjects<T> componentServiceObjects,
				UnsafeConsumer<T, E1> unsafeConsumer,
				UnsafeConsumer<T, E2> unsafeFunction)
		throws E1, E2 {

		T resource = componentServiceObjects.getService();

		try {
			unsafeConsumer.accept(resource);

			unsafeFunction.accept(resource);
		}
		finally {
			componentServiceObjects.ungetService(resource);
		}
	}

	private void _populateResourceContext(
			ContentImportJobResource contentImportJobResource)
		throws Exception {

		contentImportJobResource.setContextAcceptLanguage(_acceptLanguage);
		contentImportJobResource.setContextCompany(_company);
		contentImportJobResource.setContextHttpServletRequest(
			_httpServletRequest);
		contentImportJobResource.setContextHttpServletResponse(
			_httpServletResponse);
		contentImportJobResource.setContextUriInfo(_uriInfo);
		contentImportJobResource.setContextUser(_user);
		contentImportJobResource.setGroupLocalService(_groupLocalService);
		contentImportJobResource.setRoleLocalService(_roleLocalService);

		contentImportJobResource.setVulcanBatchEngineImportTaskResource(
			_vulcanBatchEngineImportTaskResource);
	}

	private static ComponentServiceObjects<ContentImportJobResource>
		_contentImportJobResourceComponentServiceObjects;

	private AcceptLanguage _acceptLanguage;
	private com.liferay.portal.kernel.model.Company _company;
	private GroupLocalService _groupLocalService;
	private HttpServletRequest _httpServletRequest;
	private HttpServletResponse _httpServletResponse;
	private RoleLocalService _roleLocalService;
	private BiFunction<Object, String, com.liferay.portal.kernel.search.Sort[]>
		_sortsBiFunction;
	private UriInfo _uriInfo;
	private com.liferay.portal.kernel.model.User _user;
	private VulcanBatchEngineImportTaskResource
		_vulcanBatchEngineImportTaskResource;

}
// LIFERAY-REST-BUILDER-HASH:-1673565435