/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service;

import com.liferay.petra.sql.dsl.query.DSLQuery;
import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.PersistedModel;
import com.liferay.portal.kernel.module.service.Snapshot;
import com.liferay.portal.kernel.util.OrderByComparator;

import com.nexcent.training.model.ArticleImportState;

import java.io.Serializable;

import java.util.List;

/**
 * Provides the local service utility for ArticleImportState. This utility wraps
 * <code>com.nexcent.training.service.impl.ArticleImportStateLocalServiceImpl</code> and
 * is an access point for service operations in application layer code running
 * on the local server. Methods of this service will not have security checks
 * based on the propagated JAAS credentials because this service can only be
 * accessed from within the same VM.
 *
 * @author Nexcent Training
 * @see ArticleImportStateLocalService
 * @generated
 */
public class ArticleImportStateLocalServiceUtil {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Add custom service methods to <code>com.nexcent.training.service.impl.ArticleImportStateLocalServiceImpl</code> and rerun ServiceBuilder to regenerate this class.
	 */

	/**
	 * Adds the article import state to the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ArticleImportStateLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param articleImportState the article import state
	 * @return the article import state that was added
	 */
	public static ArticleImportState addArticleImportState(
		ArticleImportState articleImportState) {

		return getService().addArticleImportState(articleImportState);
	}

	/**
	 * Creates a new article import state with the primary key. Does not add the article import state to the database.
	 *
	 * @param articleImportStateId the primary key for the new article import state
	 * @return the new article import state
	 */
	public static ArticleImportState createArticleImportState(
		long articleImportStateId) {

		return getService().createArticleImportState(articleImportStateId);
	}

	/**
	 * @throws PortalException
	 */
	public static PersistedModel createPersistedModel(
			Serializable primaryKeyObj)
		throws PortalException {

		return getService().createPersistedModel(primaryKeyObj);
	}

	/**
	 * Deletes the article import state from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ArticleImportStateLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param articleImportState the article import state
	 * @return the article import state that was removed
	 */
	public static ArticleImportState deleteArticleImportState(
		ArticleImportState articleImportState) {

		return getService().deleteArticleImportState(articleImportState);
	}

	/**
	 * Deletes the article import state with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ArticleImportStateLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state that was removed
	 * @throws PortalException if a article import state with the primary key could not be found
	 */
	public static ArticleImportState deleteArticleImportState(
			long articleImportStateId)
		throws PortalException {

		return getService().deleteArticleImportState(articleImportStateId);
	}

	/**
	 * @throws PortalException
	 */
	public static PersistedModel deletePersistedModel(
			PersistedModel persistedModel)
		throws PortalException {

		return getService().deletePersistedModel(persistedModel);
	}

	public static <T> T dslQuery(DSLQuery dslQuery) {
		return getService().dslQuery(dslQuery);
	}

	public static int dslQueryCount(DSLQuery dslQuery) {
		return getService().dslQueryCount(dslQuery);
	}

	public static DynamicQuery dynamicQuery() {
		return getService().dynamicQuery();
	}

	/**
	 * Performs a dynamic query on the database and returns the matching rows.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the matching rows
	 */
	public static <T> List<T> dynamicQuery(DynamicQuery dynamicQuery) {
		return getService().dynamicQuery(dynamicQuery);
	}

	/**
	 * Performs a dynamic query on the database and returns a range of the matching rows.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ArticleImportStateModelImpl</code>.
	 * </p>
	 *
	 * @param dynamicQuery the dynamic query
	 * @param start the lower bound of the range of model instances
	 * @param end the upper bound of the range of model instances (not inclusive)
	 * @return the range of matching rows
	 */
	public static <T> List<T> dynamicQuery(
		DynamicQuery dynamicQuery, int start, int end) {

		return getService().dynamicQuery(dynamicQuery, start, end);
	}

	/**
	 * Performs a dynamic query on the database and returns an ordered range of the matching rows.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ArticleImportStateModelImpl</code>.
	 * </p>
	 *
	 * @param dynamicQuery the dynamic query
	 * @param start the lower bound of the range of model instances
	 * @param end the upper bound of the range of model instances (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching rows
	 */
	public static <T> List<T> dynamicQuery(
		DynamicQuery dynamicQuery, int start, int end,
		OrderByComparator<T> orderByComparator) {

		return getService().dynamicQuery(
			dynamicQuery, start, end, orderByComparator);
	}

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the number of rows matching the dynamic query
	 */
	public static long dynamicQueryCount(DynamicQuery dynamicQuery) {
		return getService().dynamicQueryCount(dynamicQuery);
	}

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @param projection the projection to apply to the query
	 * @return the number of rows matching the dynamic query
	 */
	public static long dynamicQueryCount(
		DynamicQuery dynamicQuery,
		com.liferay.portal.kernel.dao.orm.Projection projection) {

		return getService().dynamicQueryCount(dynamicQuery, projection);
	}

	public static ArticleImportState fetchArticleImportState(
		long articleImportStateId) {

		return getService().fetchArticleImportState(articleImportStateId);
	}

	public static ArticleImportState fetchArticleImportState(
		long groupId, String articleERC, String locale) {

		return getService().fetchArticleImportState(
			groupId, articleERC, locale);
	}

	public static com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery
		getActionableDynamicQuery() {

		return getService().getActionableDynamicQuery();
	}

	/**
	 * Returns the article import state with the primary key.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state
	 * @throws PortalException if a article import state with the primary key could not be found
	 */
	public static ArticleImportState getArticleImportState(
			long articleImportStateId)
		throws PortalException {

		return getService().getArticleImportState(articleImportStateId);
	}

	/**
	 * Returns a range of all the article import states.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ArticleImportStateModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of article import states
	 * @param end the upper bound of the range of article import states (not inclusive)
	 * @return the range of article import states
	 */
	public static List<ArticleImportState> getArticleImportStates(
		int start, int end) {

		return getService().getArticleImportStates(start, end);
	}

	/**
	 * Returns the number of article import states.
	 *
	 * @return the number of article import states
	 */
	public static int getArticleImportStatesCount() {
		return getService().getArticleImportStatesCount();
	}

	public static
		com.liferay.portal.kernel.dao.orm.IndexableActionableDynamicQuery
			getIndexableActionableDynamicQuery() {

		return getService().getIndexableActionableDynamicQuery();
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	public static String getOSGiServiceIdentifier() {
		return getService().getOSGiServiceIdentifier();
	}

	/**
	 * @throws PortalException
	 */
	public static PersistedModel getPersistedModel(Serializable primaryKeyObj)
		throws PortalException {

		return getService().getPersistedModel(primaryKeyObj);
	}

	/**
	 * Updates the article import state in the database or adds it if it does not yet exist. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ArticleImportStateLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param articleImportState the article import state
	 * @return the article import state that was updated
	 */
	public static ArticleImportState updateArticleImportState(
		ArticleImportState articleImportState) {

		return getService().updateArticleImportState(articleImportState);
	}

	public static ArticleImportState updateArticleImportState(
		long companyId, long groupId, String articleERC, String locale,
		String payloadHash, long lastImportJobId) {

		return getService().updateArticleImportState(
			companyId, groupId, articleERC, locale, payloadHash,
			lastImportJobId);
	}

	public static ArticleImportStateLocalService getService() {
		return _serviceSnapshot.get();
	}

	private static final Snapshot<ArticleImportStateLocalService>
		_serviceSnapshot = new Snapshot<>(
			ArticleImportStateLocalServiceUtil.class,
			ArticleImportStateLocalService.class);

}
// LIFERAY-SERVICE-BUILDER-HASH:-1052561849