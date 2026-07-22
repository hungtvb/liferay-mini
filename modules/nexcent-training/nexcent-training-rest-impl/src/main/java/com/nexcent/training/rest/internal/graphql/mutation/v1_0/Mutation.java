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
import com.liferay.portal.vulcan.multipart.MultipartBody;

import com.nexcent.training.rest.dto.v1_0.ArticleImportJob;
import com.nexcent.training.rest.resource.v1_0.ArticleImportJobResource;

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

	public static void setArticleImportJobResourceComponentServiceObjects(
		ComponentServiceObjects<ArticleImportJobResource>
			articleImportJobResourceComponentServiceObjects) {

		_articleImportJobResourceComponentServiceObjects =
			articleImportJobResourceComponentServiceObjects;
	}

	@GraphQLField(
		description = "Uploads an XLSX workbook. Multipart fields are file, externalReferenceCode, and optional structureExternalReferenceCode."
	)
	@GraphQLName(
		description = "Uploads an XLSX workbook. Multipart fields are file, externalReferenceCode, and optional structureExternalReferenceCode.",
		value = "postSiteArticleImportJobSiteIdMultipartBody"
	)
	public ArticleImportJob createSiteArticleImportJob(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("multipartBody") MultipartBody multipartBody)
		throws Exception {

		return _applyComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			articleImportJobResource ->
				articleImportJobResource.postSiteArticleImportJob(
					Long.valueOf(siteKey), multipartBody));
	}

	@GraphQLField
	public Response createSiteArticleImportJobBatch(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("multipartBody") MultipartBody multipartBody,
			@GraphQLName("callbackURL") String callbackURL,
			@GraphQLName("object") Object object)
		throws Exception {

		return _applyComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			articleImportJobResource ->
				articleImportJobResource.postSiteArticleImportJobBatch(
					Long.valueOf(siteKey), multipartBody, callbackURL, object));
	}

	@GraphQLField
	public ArticleImportJob createSiteArticleImportJobExecute(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("externalReferenceCode") String externalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			articleImportJobResource ->
				articleImportJobResource.postSiteArticleImportJobExecute(
					Long.valueOf(siteKey), externalReferenceCode));
	}

	@GraphQLField
	public ArticleImportJob createSiteArticleImportJobValidate(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("externalReferenceCode") String externalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			articleImportJobResource ->
				articleImportJobResource.postSiteArticleImportJobValidate(
					Long.valueOf(siteKey), externalReferenceCode));
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
			ArticleImportJobResource articleImportJobResource)
		throws Exception {

		articleImportJobResource.setContextAcceptLanguage(_acceptLanguage);
		articleImportJobResource.setContextCompany(_company);
		articleImportJobResource.setContextHttpServletRequest(
			_httpServletRequest);
		articleImportJobResource.setContextHttpServletResponse(
			_httpServletResponse);
		articleImportJobResource.setContextUriInfo(_uriInfo);
		articleImportJobResource.setContextUser(_user);
		articleImportJobResource.setGroupLocalService(_groupLocalService);
		articleImportJobResource.setRoleLocalService(_roleLocalService);

		articleImportJobResource.setVulcanBatchEngineImportTaskResource(
			_vulcanBatchEngineImportTaskResource);
	}

	private static ComponentServiceObjects<ArticleImportJobResource>
		_articleImportJobResourceComponentServiceObjects;

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
// LIFERAY-REST-BUILDER-HASH:660357735