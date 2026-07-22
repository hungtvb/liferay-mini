/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.rest.internal.graphql.query.v1_0;

import com.liferay.petra.function.UnsafeConsumer;
import com.liferay.petra.function.UnsafeFunction;
import com.liferay.portal.kernel.service.GroupLocalService;
import com.liferay.portal.kernel.service.ResourceActionLocalService;
import com.liferay.portal.kernel.service.ResourcePermissionLocalService;
import com.liferay.portal.kernel.service.RoleLocalService;
import com.liferay.portal.vulcan.accept.language.AcceptLanguage;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;
import com.liferay.portal.vulcan.pagination.Page;

import com.nexcent.training.rest.dto.v1_0.ArticleImportJob;
import com.nexcent.training.rest.dto.v1_0.ArticleImportJobItem;
import com.nexcent.training.rest.resource.v1_0.ArticleImportJobItemResource;
import com.nexcent.training.rest.resource.v1_0.ArticleImportJobResource;

import jakarta.annotation.Generated;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import jakarta.validation.constraints.NotEmpty;

import jakarta.ws.rs.core.UriInfo;

import java.util.Map;
import java.util.function.BiFunction;

import org.osgi.service.component.ComponentServiceObjects;

/**
 * @author Nexcent Training
 * @generated
 */
@Generated("")
public class Query {

	public static void setArticleImportJobResourceComponentServiceObjects(
		ComponentServiceObjects<ArticleImportJobResource>
			articleImportJobResourceComponentServiceObjects) {

		_articleImportJobResourceComponentServiceObjects =
			articleImportJobResourceComponentServiceObjects;
	}

	public static void setArticleImportJobItemResourceComponentServiceObjects(
		ComponentServiceObjects<ArticleImportJobItemResource>
			articleImportJobItemResourceComponentServiceObjects) {

		_articleImportJobItemResourceComponentServiceObjects =
			articleImportJobItemResourceComponentServiceObjects;
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {articleImportJob(externalReferenceCode: ___, siteKey: ___){completedDate, createdRows, errorMessage, externalReferenceCode, failedRows, fileEntryId, fileName, id, sha256, skippedRows, startedDate, status, structureExternalReferenceCode, totalRows, updatedRows}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public ArticleImportJob articleImportJob(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("externalReferenceCode") String externalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			articleImportJobResource ->
				articleImportJobResource.getSiteArticleImportJob(
					Long.valueOf(siteKey), externalReferenceCode));
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {articleImportJobs(siteKey: ___){items {__}, page, pageSize, totalCount}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public ArticleImportJobPage articleImportJobs(
			@GraphQLName("siteKey") @NotEmpty String siteKey)
		throws Exception {

		return _applyComponentServiceObjects(
			_articleImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			articleImportJobResource -> new ArticleImportJobPage(
				articleImportJobResource.getSiteArticleImportJobsPage(
					Long.valueOf(siteKey))));
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {articleImportJobItems(externalReferenceCode: ___, siteKey: ___){items {__}, page, pageSize, totalCount}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public ArticleImportJobItemPage articleImportJobItems(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("externalReferenceCode") String externalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_articleImportJobItemResourceComponentServiceObjects,
			this::_populateResourceContext,
			articleImportJobItemResource -> new ArticleImportJobItemPage(
				articleImportJobItemResource.getSiteArticleImportJobItemsPage(
					Long.valueOf(siteKey), externalReferenceCode)));
	}

	@GraphQLName("ArticleImportJobPage")
	public class ArticleImportJobPage {

		public ArticleImportJobPage(Page articleImportJobPage) {
			actions = articleImportJobPage.getActions();

			items = articleImportJobPage.getItems();
			lastPage = articleImportJobPage.getLastPage();
			page = articleImportJobPage.getPage();
			pageSize = articleImportJobPage.getPageSize();
			totalCount = articleImportJobPage.getTotalCount();
		}

		@GraphQLField
		protected Map<String, Map<String, String>> actions;

		@GraphQLField
		protected java.util.Collection<ArticleImportJob> items;

		@GraphQLField
		protected long lastPage;

		@GraphQLField
		protected long page;

		@GraphQLField
		protected long pageSize;

		@GraphQLField
		protected long totalCount;

	}

	@GraphQLName("ArticleImportJobItemPage")
	public class ArticleImportJobItemPage {

		public ArticleImportJobItemPage(Page articleImportJobItemPage) {
			actions = articleImportJobItemPage.getActions();

			items = articleImportJobItemPage.getItems();
			lastPage = articleImportJobItemPage.getLastPage();
			page = articleImportJobItemPage.getPage();
			pageSize = articleImportJobItemPage.getPageSize();
			totalCount = articleImportJobItemPage.getTotalCount();
		}

		@GraphQLField
		protected Map<String, Map<String, String>> actions;

		@GraphQLField
		protected java.util.Collection<ArticleImportJobItem> items;

		@GraphQLField
		protected long lastPage;

		@GraphQLField
		protected long page;

		@GraphQLField
		protected long pageSize;

		@GraphQLField
		protected long totalCount;

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
		articleImportJobResource.setResourceActionLocalService(
			_resourceActionLocalService);
		articleImportJobResource.setResourcePermissionLocalService(
			_resourcePermissionLocalService);
		articleImportJobResource.setRoleLocalService(_roleLocalService);
	}

	private void _populateResourceContext(
			ArticleImportJobItemResource articleImportJobItemResource)
		throws Exception {

		articleImportJobItemResource.setContextAcceptLanguage(_acceptLanguage);
		articleImportJobItemResource.setContextCompany(_company);
		articleImportJobItemResource.setContextHttpServletRequest(
			_httpServletRequest);
		articleImportJobItemResource.setContextHttpServletResponse(
			_httpServletResponse);
		articleImportJobItemResource.setContextUriInfo(_uriInfo);
		articleImportJobItemResource.setContextUser(_user);
		articleImportJobItemResource.setGroupLocalService(_groupLocalService);
		articleImportJobItemResource.setResourceActionLocalService(
			_resourceActionLocalService);
		articleImportJobItemResource.setResourcePermissionLocalService(
			_resourcePermissionLocalService);
		articleImportJobItemResource.setRoleLocalService(_roleLocalService);
	}

	private static ComponentServiceObjects<ArticleImportJobResource>
		_articleImportJobResourceComponentServiceObjects;
	private static ComponentServiceObjects<ArticleImportJobItemResource>
		_articleImportJobItemResourceComponentServiceObjects;

	private AcceptLanguage _acceptLanguage;
	private com.liferay.portal.kernel.model.Company _company;
	private BiFunction
		<Object, String, com.liferay.portal.kernel.search.filter.Filter>
			_filterBiFunction;
	private GroupLocalService _groupLocalService;
	private HttpServletRequest _httpServletRequest;
	private HttpServletResponse _httpServletResponse;
	private ResourceActionLocalService _resourceActionLocalService;
	private ResourcePermissionLocalService _resourcePermissionLocalService;
	private RoleLocalService _roleLocalService;
	private BiFunction<Object, String, com.liferay.portal.kernel.search.Sort[]>
		_sortsBiFunction;
	private UriInfo _uriInfo;
	private com.liferay.portal.kernel.model.User _user;

}
// LIFERAY-REST-BUILDER-HASH:1828402176