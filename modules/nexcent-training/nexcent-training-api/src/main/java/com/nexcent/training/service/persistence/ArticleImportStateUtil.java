/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence;

import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.OrderByComparator;

import com.nexcent.training.model.ArticleImportState;

import java.io.Serializable;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The persistence utility for the article import state service. This utility wraps <code>com.nexcent.training.service.persistence.impl.ArticleImportStatePersistenceImpl</code> and provides direct access to the database for CRUD operations. This utility should only be used by the service layer, as it must operate within a transaction. Never access this utility in a JSP, controller, model, or other front-end class.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @see ArticleImportStatePersistence
 * @generated
 */
public class ArticleImportStateUtil {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this class.
	 */

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#clearCache()
	 */
	public static void clearCache() {
		getPersistence().clearCache();
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#clearCache(com.liferay.portal.kernel.model.BaseModel)
	 */
	public static void clearCache(ArticleImportState articleImportState) {
		getPersistence().clearCache(articleImportState);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#countWithDynamicQuery(DynamicQuery)
	 */
	public static long countWithDynamicQuery(DynamicQuery dynamicQuery) {
		return getPersistence().countWithDynamicQuery(dynamicQuery);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#fetchByPrimaryKeys(Set)
	 */
	public static Map<Serializable, ArticleImportState> fetchByPrimaryKeys(
		Set<Serializable> primaryKeys) {

		return getPersistence().fetchByPrimaryKeys(primaryKeys);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery)
	 */
	public static List<ArticleImportState> findWithDynamicQuery(
		DynamicQuery dynamicQuery) {

		return getPersistence().findWithDynamicQuery(dynamicQuery);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int)
	 */
	public static List<ArticleImportState> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end) {

		return getPersistence().findWithDynamicQuery(dynamicQuery, start, end);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int, OrderByComparator)
	 */
	public static List<ArticleImportState> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end,
		OrderByComparator<ArticleImportState> orderByComparator) {

		return getPersistence().findWithDynamicQuery(
			dynamicQuery, start, end, orderByComparator);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel)
	 */
	public static ArticleImportState update(
		ArticleImportState articleImportState) {

		return getPersistence().update(articleImportState);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel, ServiceContext)
	 */
	public static ArticleImportState update(
		ArticleImportState articleImportState, ServiceContext serviceContext) {

		return getPersistence().update(articleImportState, serviceContext);
	}

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or throws a <code>NoSuchArticleImportStateException</code> if it could not be found.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the matching article import state
	 * @throws NoSuchArticleImportStateException if a matching article import state could not be found
	 */
	public static ArticleImportState findByG_A_L(
			long groupId, String articleERC, String locale)
		throws com.nexcent.training.exception.
			NoSuchArticleImportStateException {

		return getPersistence().findByG_A_L(groupId, articleERC, locale);
	}

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the matching article import state, or <code>null</code> if a matching article import state could not be found
	 */
	public static ArticleImportState fetchByG_A_L(
		long groupId, String articleERC, String locale) {

		return getPersistence().fetchByG_A_L(groupId, articleERC, locale);
	}

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching article import state, or <code>null</code> if a matching article import state could not be found
	 */
	public static ArticleImportState fetchByG_A_L(
		long groupId, String articleERC, String locale,
		boolean useFinderCache) {

		return getPersistence().fetchByG_A_L(
			groupId, articleERC, locale, useFinderCache);
	}

	/**
	 * Removes the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; from the database.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the article import state that was removed
	 */
	public static ArticleImportState removeByG_A_L(
			long groupId, String articleERC, String locale)
		throws com.nexcent.training.exception.
			NoSuchArticleImportStateException {

		return getPersistence().removeByG_A_L(groupId, articleERC, locale);
	}

	/**
	 * Returns the number of article import states where groupId = &#63; and articleERC = &#63; and locale = &#63;.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the number of matching article import states
	 */
	public static int countByG_A_L(
		long groupId, String articleERC, String locale) {

		return getPersistence().countByG_A_L(groupId, articleERC, locale);
	}

	/**
	 * Caches the article import state in the entity cache if it is enabled.
	 *
	 * @param articleImportState the article import state
	 */
	public static void cacheResult(ArticleImportState articleImportState) {
		getPersistence().cacheResult(articleImportState);
	}

	/**
	 * Caches the article import states in the entity cache if it is enabled.
	 *
	 * @param articleImportStates the article import states
	 */
	public static void cacheResult(
		List<ArticleImportState> articleImportStates) {

		getPersistence().cacheResult(articleImportStates);
	}

	/**
	 * Creates a new article import state with the primary key. Does not add the article import state to the database.
	 *
	 * @param articleImportStateId the primary key for the new article import state
	 * @return the new article import state
	 */
	public static ArticleImportState create(long articleImportStateId) {
		return getPersistence().create(articleImportStateId);
	}

	/**
	 * Removes the article import state with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state that was removed
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	public static ArticleImportState remove(long articleImportStateId)
		throws com.nexcent.training.exception.
			NoSuchArticleImportStateException {

		return getPersistence().remove(articleImportStateId);
	}

	public static ArticleImportState updateImpl(
		ArticleImportState articleImportState) {

		return getPersistence().updateImpl(articleImportState);
	}

	/**
	 * Returns the article import state with the primary key or throws a <code>NoSuchArticleImportStateException</code> if it could not be found.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	public static ArticleImportState findByPrimaryKey(long articleImportStateId)
		throws com.nexcent.training.exception.
			NoSuchArticleImportStateException {

		return getPersistence().findByPrimaryKey(articleImportStateId);
	}

	/**
	 * Returns the article import state with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state, or <code>null</code> if a article import state with the primary key could not be found
	 */
	public static ArticleImportState fetchByPrimaryKey(
		long articleImportStateId) {

		return getPersistence().fetchByPrimaryKey(articleImportStateId);
	}

	/**
	 * Returns all the article import states.
	 *
	 * @return the article import states
	 */
	public static List<ArticleImportState> findAll() {
		return getPersistence().findAll();
	}

	/**
	 * Returns a range of all the article import states.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ArticleImportStateModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of article import states
	 * @param end the upper bound of the range of article import states (not inclusive)
	 * @return the range of article import states
	 */
	public static List<ArticleImportState> findAll(int start, int end) {
		return getPersistence().findAll(start, end);
	}

	/**
	 * Returns an ordered range of all the article import states.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ArticleImportStateModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of article import states
	 * @param end the upper bound of the range of article import states (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of article import states
	 */
	public static List<ArticleImportState> findAll(
		int start, int end,
		OrderByComparator<ArticleImportState> orderByComparator) {

		return getPersistence().findAll(start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the article import states.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ArticleImportStateModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of article import states
	 * @param end the upper bound of the range of article import states (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of article import states
	 */
	public static List<ArticleImportState> findAll(
		int start, int end,
		OrderByComparator<ArticleImportState> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findAll(
			start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Removes all the article import states from the database.
	 */
	public static void removeAll() {
		getPersistence().removeAll();
	}

	/**
	 * Returns the number of article import states.
	 *
	 * @return the number of article import states
	 */
	public static int countAll() {
		return getPersistence().countAll();
	}

	public static ArticleImportStatePersistence getPersistence() {
		return _persistence;
	}

	public static void setPersistence(
		ArticleImportStatePersistence persistence) {

		_persistence = persistence;
	}

	private static volatile ArticleImportStatePersistence _persistence;

}
// LIFERAY-SERVICE-BUILDER-HASH:-1977553324