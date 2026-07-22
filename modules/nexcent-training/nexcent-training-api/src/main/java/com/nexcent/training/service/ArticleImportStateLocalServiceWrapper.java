/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service;

import com.liferay.portal.kernel.service.ServiceWrapper;
import com.liferay.portal.kernel.service.persistence.BasePersistence;

/**
 * Provides a wrapper for {@link ArticleImportStateLocalService}.
 *
 * @author Nexcent Training
 * @see ArticleImportStateLocalService
 * @generated
 */
public class ArticleImportStateLocalServiceWrapper
	implements ArticleImportStateLocalService,
			   ServiceWrapper<ArticleImportStateLocalService> {

	public ArticleImportStateLocalServiceWrapper() {
		this(null);
	}

	public ArticleImportStateLocalServiceWrapper(
		ArticleImportStateLocalService articleImportStateLocalService) {

		_articleImportStateLocalService = articleImportStateLocalService;
	}

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
	@Override
	public com.nexcent.training.model.ArticleImportState addArticleImportState(
		com.nexcent.training.model.ArticleImportState articleImportState) {

		return _articleImportStateLocalService.addArticleImportState(
			articleImportState);
	}

	/**
	 * Creates a new article import state with the primary key. Does not add the article import state to the database.
	 *
	 * @param articleImportStateId the primary key for the new article import state
	 * @return the new article import state
	 */
	@Override
	public com.nexcent.training.model.ArticleImportState
		createArticleImportState(long articleImportStateId) {

		return _articleImportStateLocalService.createArticleImportState(
			articleImportStateId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel createPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _articleImportStateLocalService.createPersistedModel(
			primaryKeyObj);
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
	@Override
	public com.nexcent.training.model.ArticleImportState
		deleteArticleImportState(
			com.nexcent.training.model.ArticleImportState articleImportState) {

		return _articleImportStateLocalService.deleteArticleImportState(
			articleImportState);
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
	@Override
	public com.nexcent.training.model.ArticleImportState
			deleteArticleImportState(long articleImportStateId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _articleImportStateLocalService.deleteArticleImportState(
			articleImportStateId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel deletePersistedModel(
			com.liferay.portal.kernel.model.PersistedModel persistedModel)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _articleImportStateLocalService.deletePersistedModel(
			persistedModel);
	}

	@Override
	public <T> T dslQuery(com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {
		return _articleImportStateLocalService.dslQuery(dslQuery);
	}

	@Override
	public int dslQueryCount(
		com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {

		return _articleImportStateLocalService.dslQueryCount(dslQuery);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery() {
		return _articleImportStateLocalService.dynamicQuery();
	}

	/**
	 * Performs a dynamic query on the database and returns the matching rows.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the matching rows
	 */
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery) {

		return _articleImportStateLocalService.dynamicQuery(dynamicQuery);
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
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery, int start,
		int end) {

		return _articleImportStateLocalService.dynamicQuery(
			dynamicQuery, start, end);
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
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery, int start,
		int end,
		com.liferay.portal.kernel.util.OrderByComparator<T> orderByComparator) {

		return _articleImportStateLocalService.dynamicQuery(
			dynamicQuery, start, end, orderByComparator);
	}

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the number of rows matching the dynamic query
	 */
	@Override
	public long dynamicQueryCount(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery) {

		return _articleImportStateLocalService.dynamicQueryCount(dynamicQuery);
	}

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @param projection the projection to apply to the query
	 * @return the number of rows matching the dynamic query
	 */
	@Override
	public long dynamicQueryCount(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery,
		com.liferay.portal.kernel.dao.orm.Projection projection) {

		return _articleImportStateLocalService.dynamicQueryCount(
			dynamicQuery, projection);
	}

	@Override
	public com.nexcent.training.model.ArticleImportState
		fetchArticleImportState(long articleImportStateId) {

		return _articleImportStateLocalService.fetchArticleImportState(
			articleImportStateId);
	}

	@Override
	public com.nexcent.training.model.ArticleImportState
		fetchArticleImportState(
			long groupId, String articleERC, String locale) {

		return _articleImportStateLocalService.fetchArticleImportState(
			groupId, articleERC, locale);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery
		getActionableDynamicQuery() {

		return _articleImportStateLocalService.getActionableDynamicQuery();
	}

	/**
	 * Returns the article import state with the primary key.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state
	 * @throws PortalException if a article import state with the primary key could not be found
	 */
	@Override
	public com.nexcent.training.model.ArticleImportState getArticleImportState(
			long articleImportStateId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _articleImportStateLocalService.getArticleImportState(
			articleImportStateId);
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
	@Override
	public java.util.List<com.nexcent.training.model.ArticleImportState>
		getArticleImportStates(int start, int end) {

		return _articleImportStateLocalService.getArticleImportStates(
			start, end);
	}

	/**
	 * Returns the number of article import states.
	 *
	 * @return the number of article import states
	 */
	@Override
	public int getArticleImportStatesCount() {
		return _articleImportStateLocalService.getArticleImportStatesCount();
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.IndexableActionableDynamicQuery
		getIndexableActionableDynamicQuery() {

		return _articleImportStateLocalService.
			getIndexableActionableDynamicQuery();
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return _articleImportStateLocalService.getOSGiServiceIdentifier();
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel getPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _articleImportStateLocalService.getPersistedModel(primaryKeyObj);
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
	@Override
	public com.nexcent.training.model.ArticleImportState
		updateArticleImportState(
			com.nexcent.training.model.ArticleImportState articleImportState) {

		return _articleImportStateLocalService.updateArticleImportState(
			articleImportState);
	}

	@Override
	public com.nexcent.training.model.ArticleImportState
		updateArticleImportState(
			long companyId, long groupId, String articleERC, String locale,
			String payloadHash, long lastImportJobId) {

		return _articleImportStateLocalService.updateArticleImportState(
			companyId, groupId, articleERC, locale, payloadHash,
			lastImportJobId);
	}

	@Override
	public BasePersistence<?> getBasePersistence() {
		return _articleImportStateLocalService.getBasePersistence();
	}

	@Override
	public ArticleImportStateLocalService getWrappedService() {
		return _articleImportStateLocalService;
	}

	@Override
	public void setWrappedService(
		ArticleImportStateLocalService articleImportStateLocalService) {

		_articleImportStateLocalService = articleImportStateLocalService;
	}

	private ArticleImportStateLocalService _articleImportStateLocalService;

}
// LIFERAY-SERVICE-BUILDER-HASH:-799818588