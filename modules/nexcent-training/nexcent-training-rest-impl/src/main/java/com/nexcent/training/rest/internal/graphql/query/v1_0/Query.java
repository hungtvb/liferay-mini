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
import com.liferay.portal.vulcan.pagination.Pagination;

import com.nexcent.training.rest.dto.v1_0.ContentImportJob;
import com.nexcent.training.rest.dto.v1_0.ContentImportJobItem;
import com.nexcent.training.rest.dto.v1_0.ContentImportProfile;
import com.nexcent.training.rest.resource.v1_0.ContentImportJobItemResource;
import com.nexcent.training.rest.resource.v1_0.ContentImportJobResource;
import com.nexcent.training.rest.resource.v1_0.ContentImportProfileResource;

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

	public static void setContentImportJobResourceComponentServiceObjects(
		ComponentServiceObjects<ContentImportJobResource>
			contentImportJobResourceComponentServiceObjects) {

		_contentImportJobResourceComponentServiceObjects =
			contentImportJobResourceComponentServiceObjects;
	}

	public static void setContentImportJobItemResourceComponentServiceObjects(
		ComponentServiceObjects<ContentImportJobItemResource>
			contentImportJobItemResourceComponentServiceObjects) {

		_contentImportJobItemResourceComponentServiceObjects =
			contentImportJobItemResourceComponentServiceObjects;
	}

	public static void setContentImportProfileResourceComponentServiceObjects(
		ComponentServiceObjects<ContentImportProfileResource>
			contentImportProfileResourceComponentServiceObjects) {

		_contentImportProfileResourceComponentServiceObjects =
			contentImportProfileResourceComponentServiceObjects;
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {contentImportJob(jobExternalReferenceCode: ___, siteKey: ___){completedDate, createdRows, errorMessage, externalReferenceCode, failedRows, fileEntryId, fileName, id, importProfileKey, packageSchemaVersion, sha256, skippedRows, startedDate, status, totalRows, updatedRows}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public ContentImportJob contentImportJob(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("jobExternalReferenceCode") String
				jobExternalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource ->
				contentImportJobResource.getSiteContentImportJob(
					Long.valueOf(siteKey), jobExternalReferenceCode));
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {contentImportJobErrorReport(jobExternalReferenceCode: ___, siteKey: ___){}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public String contentImportJobErrorReport(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("jobExternalReferenceCode") String
				jobExternalReferenceCode)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource ->
				contentImportJobResource.getSiteContentImportJobErrorReport(
					Long.valueOf(siteKey), jobExternalReferenceCode));
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {contentImportJobs(page: ___, pageSize: ___, siteKey: ___){items {__}, page, pageSize, totalCount}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public ContentImportJobPage contentImportJobs(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("pageSize") int pageSize,
			@GraphQLName("page") int page)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobResource -> new ContentImportJobPage(
				contentImportJobResource.getSiteContentImportJobsPage(
					Long.valueOf(siteKey), Pagination.of(page, pageSize))));
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {contentImportJobItems(jobExternalReferenceCode: ___, page: ___, pageSize: ___, siteKey: ___){items {__}, page, pageSize, totalCount}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public ContentImportJobItemPage contentImportJobItems(
			@GraphQLName("siteKey") @NotEmpty String siteKey,
			@GraphQLName("jobExternalReferenceCode") String
				jobExternalReferenceCode,
			@GraphQLName("pageSize") int pageSize,
			@GraphQLName("page") int page)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportJobItemResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportJobItemResource -> new ContentImportJobItemPage(
				contentImportJobItemResource.getSiteContentImportJobItemsPage(
					Long.valueOf(siteKey), jobExternalReferenceCode,
					Pagination.of(page, pageSize))));
	}

	/**
	 * Invoke this method with the command line:
	 *
	 * curl -H 'Content-Type: text/plain; charset=utf-8' -X 'POST' 'http://localhost:8080/o/graphql' -d $'{"query": "query {contentImportProfiles(siteKey: ___){items {__}, page, pageSize, totalCount}}"}' -u 'test@liferay.com:test'
	 */
	@GraphQLField
	public ContentImportProfilePage contentImportProfiles(
			@GraphQLName("siteKey") @NotEmpty String siteKey)
		throws Exception {

		return _applyComponentServiceObjects(
			_contentImportProfileResourceComponentServiceObjects,
			this::_populateResourceContext,
			contentImportProfileResource -> new ContentImportProfilePage(
				contentImportProfileResource.getSiteContentImportProfilesPage(
					Long.valueOf(siteKey))));
	}

	@GraphQLName("ContentImportJobPage")
	public class ContentImportJobPage {

		public ContentImportJobPage(Page contentImportJobPage) {
			actions = contentImportJobPage.getActions();

			items = contentImportJobPage.getItems();
			lastPage = contentImportJobPage.getLastPage();
			page = contentImportJobPage.getPage();
			pageSize = contentImportJobPage.getPageSize();
			totalCount = contentImportJobPage.getTotalCount();
		}

		@GraphQLField
		protected Map<String, Map<String, String>> actions;

		@GraphQLField
		protected java.util.Collection<ContentImportJob> items;

		@GraphQLField
		protected long lastPage;

		@GraphQLField
		protected long page;

		@GraphQLField
		protected long pageSize;

		@GraphQLField
		protected long totalCount;

	}

	@GraphQLName("ContentImportJobItemPage")
	public class ContentImportJobItemPage {

		public ContentImportJobItemPage(Page contentImportJobItemPage) {
			actions = contentImportJobItemPage.getActions();

			items = contentImportJobItemPage.getItems();
			lastPage = contentImportJobItemPage.getLastPage();
			page = contentImportJobItemPage.getPage();
			pageSize = contentImportJobItemPage.getPageSize();
			totalCount = contentImportJobItemPage.getTotalCount();
		}

		@GraphQLField
		protected Map<String, Map<String, String>> actions;

		@GraphQLField
		protected java.util.Collection<ContentImportJobItem> items;

		@GraphQLField
		protected long lastPage;

		@GraphQLField
		protected long page;

		@GraphQLField
		protected long pageSize;

		@GraphQLField
		protected long totalCount;

	}

	@GraphQLName("ContentImportProfilePage")
	public class ContentImportProfilePage {

		public ContentImportProfilePage(Page contentImportProfilePage) {
			actions = contentImportProfilePage.getActions();

			items = contentImportProfilePage.getItems();
			lastPage = contentImportProfilePage.getLastPage();
			page = contentImportProfilePage.getPage();
			pageSize = contentImportProfilePage.getPageSize();
			totalCount = contentImportProfilePage.getTotalCount();
		}

		@GraphQLField
		protected Map<String, Map<String, String>> actions;

		@GraphQLField
		protected java.util.Collection<ContentImportProfile> items;

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
		contentImportJobResource.setResourceActionLocalService(
			_resourceActionLocalService);
		contentImportJobResource.setResourcePermissionLocalService(
			_resourcePermissionLocalService);
		contentImportJobResource.setRoleLocalService(_roleLocalService);
	}

	private void _populateResourceContext(
			ContentImportJobItemResource contentImportJobItemResource)
		throws Exception {

		contentImportJobItemResource.setContextAcceptLanguage(_acceptLanguage);
		contentImportJobItemResource.setContextCompany(_company);
		contentImportJobItemResource.setContextHttpServletRequest(
			_httpServletRequest);
		contentImportJobItemResource.setContextHttpServletResponse(
			_httpServletResponse);
		contentImportJobItemResource.setContextUriInfo(_uriInfo);
		contentImportJobItemResource.setContextUser(_user);
		contentImportJobItemResource.setGroupLocalService(_groupLocalService);
		contentImportJobItemResource.setResourceActionLocalService(
			_resourceActionLocalService);
		contentImportJobItemResource.setResourcePermissionLocalService(
			_resourcePermissionLocalService);
		contentImportJobItemResource.setRoleLocalService(_roleLocalService);
	}

	private void _populateResourceContext(
			ContentImportProfileResource contentImportProfileResource)
		throws Exception {

		contentImportProfileResource.setContextAcceptLanguage(_acceptLanguage);
		contentImportProfileResource.setContextCompany(_company);
		contentImportProfileResource.setContextHttpServletRequest(
			_httpServletRequest);
		contentImportProfileResource.setContextHttpServletResponse(
			_httpServletResponse);
		contentImportProfileResource.setContextUriInfo(_uriInfo);
		contentImportProfileResource.setContextUser(_user);
		contentImportProfileResource.setGroupLocalService(_groupLocalService);
		contentImportProfileResource.setResourceActionLocalService(
			_resourceActionLocalService);
		contentImportProfileResource.setResourcePermissionLocalService(
			_resourcePermissionLocalService);
		contentImportProfileResource.setRoleLocalService(_roleLocalService);
	}

	private static ComponentServiceObjects<ContentImportJobResource>
		_contentImportJobResourceComponentServiceObjects;
	private static ComponentServiceObjects<ContentImportJobItemResource>
		_contentImportJobItemResourceComponentServiceObjects;
	private static ComponentServiceObjects<ContentImportProfileResource>
		_contentImportProfileResourceComponentServiceObjects;

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
// LIFERAY-REST-BUILDER-HASH:854573288