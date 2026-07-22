/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence;

import com.liferay.portal.kernel.service.persistence.BasePersistence;

import com.nexcent.training.exception.NoSuchArticleImportStateException;
import com.nexcent.training.model.ArticleImportState;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The persistence interface for the article import state service.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @see ArticleImportStateUtil
 * @generated
 */
@ProviderType
public interface ArticleImportStatePersistence
	extends BasePersistence<ArticleImportState> {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. Always use {@link ArticleImportStateUtil} to access the article import state persistence. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this interface.
	 */

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or throws a <code>NoSuchArticleImportStateException</code> if it could not be found.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the matching article import state
	 * @throws NoSuchArticleImportStateException if a matching article import state could not be found
	 */
	public ArticleImportState findByG_A_L(
			long groupId, String articleERC, String locale)
		throws NoSuchArticleImportStateException;

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the matching article import state, or <code>null</code> if a matching article import state could not be found
	 */
	public ArticleImportState fetchByG_A_L(
		long groupId, String articleERC, String locale);

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching article import state, or <code>null</code> if a matching article import state could not be found
	 */
	public ArticleImportState fetchByG_A_L(
		long groupId, String articleERC, String locale, boolean useFinderCache);

	/**
	 * Removes the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; from the database.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the article import state that was removed
	 */
	public ArticleImportState removeByG_A_L(
			long groupId, String articleERC, String locale)
		throws NoSuchArticleImportStateException;

	/**
	 * Returns the number of article import states where groupId = &#63; and articleERC = &#63; and locale = &#63;.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the number of matching article import states
	 */
	public int countByG_A_L(long groupId, String articleERC, String locale);

	/**
	 * Caches the article import state in the entity cache if it is enabled.
	 *
	 * @param articleImportState the article import state
	 */
	public void cacheResult(ArticleImportState articleImportState);

	/**
	 * Caches the article import states in the entity cache if it is enabled.
	 *
	 * @param articleImportStates the article import states
	 */
	public void cacheResult(
		java.util.List<ArticleImportState> articleImportStates);

	/**
	 * Creates a new article import state with the primary key. Does not add the article import state to the database.
	 *
	 * @param articleImportStateId the primary key for the new article import state
	 * @return the new article import state
	 */
	public ArticleImportState create(long articleImportStateId);

	/**
	 * Removes the article import state with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state that was removed
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	public ArticleImportState remove(long articleImportStateId)
		throws NoSuchArticleImportStateException;

	public ArticleImportState updateImpl(ArticleImportState articleImportState);

	/**
	 * Returns the article import state with the primary key or throws a <code>NoSuchArticleImportStateException</code> if it could not be found.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	public ArticleImportState findByPrimaryKey(long articleImportStateId)
		throws NoSuchArticleImportStateException;

	/**
	 * Returns the article import state with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state, or <code>null</code> if a article import state with the primary key could not be found
	 */
	public ArticleImportState fetchByPrimaryKey(long articleImportStateId);

	/**
	 * Returns all the article import states.
	 *
	 * @return the article import states
	 */
	public java.util.List<ArticleImportState> findAll();

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
	public java.util.List<ArticleImportState> findAll(int start, int end);

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
	public java.util.List<ArticleImportState> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ArticleImportState>
			orderByComparator);

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
	public java.util.List<ArticleImportState> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ArticleImportState>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Removes all the article import states from the database.
	 */
	public void removeAll();

	/**
	 * Returns the number of article import states.
	 *
	 * @return the number of article import states
	 */
	public int countAll();

}
// LIFERAY-SERVICE-BUILDER-HASH:1684417305