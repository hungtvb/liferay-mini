/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence.impl;

import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.configuration.Configuration;
import com.liferay.portal.kernel.dao.orm.EntityCache;
import com.liferay.portal.kernel.dao.orm.FinderCache;
import com.liferay.portal.kernel.dao.orm.FinderPath;
import com.liferay.portal.kernel.dao.orm.Query;
import com.liferay.portal.kernel.dao.orm.QueryPos;
import com.liferay.portal.kernel.dao.orm.QueryUtil;
import com.liferay.portal.kernel.dao.orm.Session;
import com.liferay.portal.kernel.dao.orm.SessionFactory;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.security.auth.CompanyThreadLocal;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.service.ServiceContextThreadLocal;
import com.liferay.portal.kernel.service.persistence.impl.BasePersistenceImpl;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.OrderByComparator;
import com.liferay.portal.kernel.util.PropsKeys;
import com.liferay.portal.kernel.util.PropsUtil;
import com.liferay.portal.kernel.util.ProxyUtil;

import com.nexcent.training.exception.NoSuchArticleImportStateException;
import com.nexcent.training.model.ArticleImportState;
import com.nexcent.training.model.ArticleImportStateTable;
import com.nexcent.training.model.impl.ArticleImportStateImpl;
import com.nexcent.training.model.impl.ArticleImportStateModelImpl;
import com.nexcent.training.service.persistence.ArticleImportStatePersistence;
import com.nexcent.training.service.persistence.ArticleImportStateUtil;
import com.nexcent.training.service.persistence.impl.constants.NXCPersistenceConstants;

import java.io.Serializable;

import java.lang.reflect.InvocationHandler;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;

/**
 * The persistence implementation for the article import state service.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @generated
 */
@Component(service = ArticleImportStatePersistence.class)
public class ArticleImportStatePersistenceImpl
	extends BasePersistenceImpl<ArticleImportState>
	implements ArticleImportStatePersistence {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this class directly. Always use <code>ArticleImportStateUtil</code> to access the article import state persistence. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this class.
	 */
	public static final String FINDER_CLASS_NAME_ENTITY =
		ArticleImportStateImpl.class.getName();

	public static final String FINDER_CLASS_NAME_LIST_WITH_PAGINATION =
		FINDER_CLASS_NAME_ENTITY + ".List1";

	public static final String FINDER_CLASS_NAME_LIST_WITHOUT_PAGINATION =
		FINDER_CLASS_NAME_ENTITY + ".List2";

	private FinderPath _finderPathWithPaginationFindAll;
	private FinderPath _finderPathWithoutPaginationFindAll;
	private FinderPath _finderPathCountAll;
	private FinderPath _finderPathFetchByG_A_L;

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or throws a <code>NoSuchArticleImportStateException</code> if it could not be found.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the matching article import state
	 * @throws NoSuchArticleImportStateException if a matching article import state could not be found
	 */
	@Override
	public ArticleImportState findByG_A_L(
			long groupId, String articleERC, String locale)
		throws NoSuchArticleImportStateException {

		ArticleImportState articleImportState = fetchByG_A_L(
			groupId, articleERC, locale);

		if (articleImportState == null) {
			StringBundler sb = new StringBundler(8);

			sb.append(_NO_SUCH_ENTITY_WITH_KEY);

			sb.append("groupId=");
			sb.append(groupId);

			sb.append(", articleERC=");
			sb.append(articleERC);

			sb.append(", locale=");
			sb.append(locale);

			sb.append("}");

			if (_log.isDebugEnabled()) {
				_log.debug(sb.toString());
			}

			throw new NoSuchArticleImportStateException(sb.toString());
		}

		return articleImportState;
	}

	/**
	 * Returns the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the matching article import state, or <code>null</code> if a matching article import state could not be found
	 */
	@Override
	public ArticleImportState fetchByG_A_L(
		long groupId, String articleERC, String locale) {

		return fetchByG_A_L(groupId, articleERC, locale, true);
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
	@Override
	public ArticleImportState fetchByG_A_L(
		long groupId, String articleERC, String locale,
		boolean useFinderCache) {

		articleERC = Objects.toString(articleERC, "");
		locale = Objects.toString(locale, "");

		Object[] finderArgs = null;

		if (useFinderCache) {
			finderArgs = new Object[] {groupId, articleERC, locale};
		}

		Object result = null;

		if (useFinderCache) {
			result = finderCache.getResult(
				_finderPathFetchByG_A_L, finderArgs, this);
		}

		if (result instanceof ArticleImportState) {
			ArticleImportState articleImportState = (ArticleImportState)result;

			if ((groupId != articleImportState.getGroupId()) ||
				!Objects.equals(
					articleERC, articleImportState.getArticleERC()) ||
				!Objects.equals(locale, articleImportState.getLocale())) {

				result = null;
			}
		}

		if (result == null) {
			StringBundler sb = new StringBundler(5);

			sb.append(_SQL_SELECT_ARTICLEIMPORTSTATE_WHERE);

			sb.append(_FINDER_COLUMN_G_A_L_GROUPID_2);

			boolean bindArticleERC = false;

			if (articleERC.isEmpty()) {
				sb.append(_FINDER_COLUMN_G_A_L_ARTICLEERC_3);
			}
			else {
				bindArticleERC = true;

				sb.append(_FINDER_COLUMN_G_A_L_ARTICLEERC_2);
			}

			boolean bindLocale = false;

			if (locale.isEmpty()) {
				sb.append(_FINDER_COLUMN_G_A_L_LOCALE_3);
			}
			else {
				bindLocale = true;

				sb.append(_FINDER_COLUMN_G_A_L_LOCALE_2);
			}

			String sql = sb.toString();

			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(sql);

				QueryPos queryPos = QueryPos.getInstance(query);

				queryPos.add(groupId);

				if (bindArticleERC) {
					queryPos.add(articleERC);
				}

				if (bindLocale) {
					queryPos.add(locale);
				}

				List<ArticleImportState> list = query.list();

				if (list.isEmpty()) {
					if (useFinderCache) {
						finderCache.putResult(
							_finderPathFetchByG_A_L, finderArgs, list);
					}
				}
				else {
					ArticleImportState articleImportState = list.get(0);

					result = articleImportState;

					cacheResult(articleImportState);
				}
			}
			catch (Exception exception) {
				throw processException(exception);
			}
			finally {
				closeSession(session);
			}
		}

		if (result instanceof List<?>) {
			return null;
		}
		else {
			return (ArticleImportState)result;
		}
	}

	/**
	 * Removes the article import state where groupId = &#63; and articleERC = &#63; and locale = &#63; from the database.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the article import state that was removed
	 */
	@Override
	public ArticleImportState removeByG_A_L(
			long groupId, String articleERC, String locale)
		throws NoSuchArticleImportStateException {

		ArticleImportState articleImportState = findByG_A_L(
			groupId, articleERC, locale);

		return remove(articleImportState);
	}

	/**
	 * Returns the number of article import states where groupId = &#63; and articleERC = &#63; and locale = &#63;.
	 *
	 * @param groupId the group ID
	 * @param articleERC the article erc
	 * @param locale the locale
	 * @return the number of matching article import states
	 */
	@Override
	public int countByG_A_L(long groupId, String articleERC, String locale) {
		ArticleImportState articleImportState = fetchByG_A_L(
			groupId, articleERC, locale);

		if (articleImportState == null) {
			return 0;
		}

		return 1;
	}

	private static final String _FINDER_COLUMN_G_A_L_GROUPID_2 =
		"articleImportState.groupId = ? AND ";

	private static final String _FINDER_COLUMN_G_A_L_ARTICLEERC_2 =
		"articleImportState.articleERC = ? AND ";

	private static final String _FINDER_COLUMN_G_A_L_ARTICLEERC_3 =
		"(articleImportState.articleERC IS NULL OR articleImportState.articleERC = '') AND ";

	private static final String _FINDER_COLUMN_G_A_L_LOCALE_2 =
		"articleImportState.locale = ?";

	private static final String _FINDER_COLUMN_G_A_L_LOCALE_3 =
		"(articleImportState.locale IS NULL OR articleImportState.locale = '')";

	public ArticleImportStatePersistenceImpl() {
		setModelClass(ArticleImportState.class);

		setModelImplClass(ArticleImportStateImpl.class);
		setModelPKClass(long.class);

		setTable(ArticleImportStateTable.INSTANCE);
	}

	/**
	 * Caches the article import state in the entity cache if it is enabled.
	 *
	 * @param articleImportState the article import state
	 */
	@Override
	public void cacheResult(ArticleImportState articleImportState) {
		entityCache.putResult(
			ArticleImportStateImpl.class, articleImportState.getPrimaryKey(),
			articleImportState);

		finderCache.putResult(
			_finderPathFetchByG_A_L,
			new Object[] {
				articleImportState.getGroupId(),
				articleImportState.getArticleERC(),
				articleImportState.getLocale()
			},
			articleImportState);
	}

	private int _valueObjectFinderCacheListThreshold;

	/**
	 * Caches the article import states in the entity cache if it is enabled.
	 *
	 * @param articleImportStates the article import states
	 */
	@Override
	public void cacheResult(List<ArticleImportState> articleImportStates) {
		if ((_valueObjectFinderCacheListThreshold == 0) ||
			((_valueObjectFinderCacheListThreshold > 0) &&
			 (articleImportStates.size() >
				 _valueObjectFinderCacheListThreshold))) {

			return;
		}

		for (ArticleImportState articleImportState : articleImportStates) {
			if (entityCache.getResult(
					ArticleImportStateImpl.class,
					articleImportState.getPrimaryKey()) == null) {

				cacheResult(articleImportState);
			}
		}
	}

	/**
	 * Clears the cache for all article import states.
	 *
	 * <p>
	 * The <code>EntityCache</code> and <code>FinderCache</code> are both cleared by this method.
	 * </p>
	 */
	@Override
	public void clearCache() {
		entityCache.clearCache(ArticleImportStateImpl.class);

		finderCache.clearCache(ArticleImportStateImpl.class);
	}

	/**
	 * Clears the cache for the article import state.
	 *
	 * <p>
	 * The <code>EntityCache</code> and <code>FinderCache</code> are both cleared by this method.
	 * </p>
	 */
	@Override
	public void clearCache(ArticleImportState articleImportState) {
		entityCache.removeResult(
			ArticleImportStateImpl.class, articleImportState);
	}

	@Override
	public void clearCache(List<ArticleImportState> articleImportStates) {
		for (ArticleImportState articleImportState : articleImportStates) {
			entityCache.removeResult(
				ArticleImportStateImpl.class, articleImportState);
		}
	}

	@Override
	public void clearCache(Set<Serializable> primaryKeys) {
		finderCache.clearCache(ArticleImportStateImpl.class);

		for (Serializable primaryKey : primaryKeys) {
			entityCache.removeResult(ArticleImportStateImpl.class, primaryKey);
		}
	}

	protected void cacheUniqueFindersCache(
		ArticleImportStateModelImpl articleImportStateModelImpl) {

		Object[] args = new Object[] {
			articleImportStateModelImpl.getGroupId(),
			articleImportStateModelImpl.getArticleERC(),
			articleImportStateModelImpl.getLocale()
		};

		finderCache.putResult(
			_finderPathFetchByG_A_L, args, articleImportStateModelImpl);
	}

	/**
	 * Creates a new article import state with the primary key. Does not add the article import state to the database.
	 *
	 * @param articleImportStateId the primary key for the new article import state
	 * @return the new article import state
	 */
	@Override
	public ArticleImportState create(long articleImportStateId) {
		ArticleImportState articleImportState = new ArticleImportStateImpl();

		articleImportState.setNew(true);
		articleImportState.setPrimaryKey(articleImportStateId);

		articleImportState.setCompanyId(CompanyThreadLocal.getCompanyId());

		return articleImportState;
	}

	/**
	 * Removes the article import state with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state that was removed
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	@Override
	public ArticleImportState remove(long articleImportStateId)
		throws NoSuchArticleImportStateException {

		return remove((Serializable)articleImportStateId);
	}

	/**
	 * Removes the article import state with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param primaryKey the primary key of the article import state
	 * @return the article import state that was removed
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	@Override
	public ArticleImportState remove(Serializable primaryKey)
		throws NoSuchArticleImportStateException {

		Session session = null;

		try {
			session = openSession();

			ArticleImportState articleImportState =
				(ArticleImportState)session.get(
					ArticleImportStateImpl.class, primaryKey);

			if (articleImportState == null) {
				if (_log.isDebugEnabled()) {
					_log.debug(_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
				}

				throw new NoSuchArticleImportStateException(
					_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
			}

			return remove(articleImportState);
		}
		catch (NoSuchArticleImportStateException noSuchEntityException) {
			throw noSuchEntityException;
		}
		catch (Exception exception) {
			throw processException(exception);
		}
		finally {
			closeSession(session);
		}
	}

	@Override
	protected ArticleImportState removeImpl(
		ArticleImportState articleImportState) {

		Session session = null;

		try {
			session = openSession();

			if (!session.contains(articleImportState)) {
				articleImportState = (ArticleImportState)session.get(
					ArticleImportStateImpl.class,
					articleImportState.getPrimaryKeyObj());
			}

			if (articleImportState != null) {
				session.delete(articleImportState);
			}
		}
		catch (Exception exception) {
			throw processException(exception);
		}
		finally {
			closeSession(session);
		}

		if (articleImportState != null) {
			clearCache(articleImportState);
		}

		return articleImportState;
	}

	@Override
	public ArticleImportState updateImpl(
		ArticleImportState articleImportState) {

		boolean isNew = articleImportState.isNew();

		if (!(articleImportState instanceof ArticleImportStateModelImpl)) {
			InvocationHandler invocationHandler = null;

			if (ProxyUtil.isProxyClass(articleImportState.getClass())) {
				invocationHandler = ProxyUtil.getInvocationHandler(
					articleImportState);

				throw new IllegalArgumentException(
					"Implement ModelWrapper in articleImportState proxy " +
						invocationHandler.getClass());
			}

			throw new IllegalArgumentException(
				"Implement ModelWrapper in custom ArticleImportState implementation " +
					articleImportState.getClass());
		}

		ArticleImportStateModelImpl articleImportStateModelImpl =
			(ArticleImportStateModelImpl)articleImportState;

		ServiceContext serviceContext =
			ServiceContextThreadLocal.getServiceContext();

		Date date = new Date();

		if (isNew && (articleImportState.getCreateDate() == null)) {
			if (serviceContext == null) {
				articleImportState.setCreateDate(date);
			}
			else {
				articleImportState.setCreateDate(
					serviceContext.getCreateDate(date));
			}
		}

		if (!articleImportStateModelImpl.hasSetModifiedDate()) {
			if (serviceContext == null) {
				articleImportState.setModifiedDate(date);
			}
			else {
				articleImportState.setModifiedDate(
					serviceContext.getModifiedDate(date));
			}
		}

		Session session = null;

		try {
			session = openSession();

			if (isNew) {
				session.save(articleImportState);
			}
			else {
				articleImportState = (ArticleImportState)session.merge(
					articleImportState);
			}
		}
		catch (Exception exception) {
			throw processException(exception);
		}
		finally {
			closeSession(session);
		}

		entityCache.putResult(
			ArticleImportStateImpl.class, articleImportStateModelImpl, false,
			true);

		cacheUniqueFindersCache(articleImportStateModelImpl);

		if (isNew) {
			articleImportState.setNew(false);
		}

		articleImportState.resetOriginalValues();

		return articleImportState;
	}

	/**
	 * Returns the article import state with the primary key or throws a <code>com.liferay.portal.kernel.exception.NoSuchModelException</code> if it could not be found.
	 *
	 * @param primaryKey the primary key of the article import state
	 * @return the article import state
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	@Override
	public ArticleImportState findByPrimaryKey(Serializable primaryKey)
		throws NoSuchArticleImportStateException {

		ArticleImportState articleImportState = fetchByPrimaryKey(primaryKey);

		if (articleImportState == null) {
			if (_log.isDebugEnabled()) {
				_log.debug(_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
			}

			throw new NoSuchArticleImportStateException(
				_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
		}

		return articleImportState;
	}

	/**
	 * Returns the article import state with the primary key or throws a <code>NoSuchArticleImportStateException</code> if it could not be found.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state
	 * @throws NoSuchArticleImportStateException if a article import state with the primary key could not be found
	 */
	@Override
	public ArticleImportState findByPrimaryKey(long articleImportStateId)
		throws NoSuchArticleImportStateException {

		return findByPrimaryKey((Serializable)articleImportStateId);
	}

	/**
	 * Returns the article import state with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param articleImportStateId the primary key of the article import state
	 * @return the article import state, or <code>null</code> if a article import state with the primary key could not be found
	 */
	@Override
	public ArticleImportState fetchByPrimaryKey(long articleImportStateId) {
		return fetchByPrimaryKey((Serializable)articleImportStateId);
	}

	/**
	 * Returns all the article import states.
	 *
	 * @return the article import states
	 */
	@Override
	public List<ArticleImportState> findAll() {
		return findAll(QueryUtil.ALL_POS, QueryUtil.ALL_POS, null);
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
	@Override
	public List<ArticleImportState> findAll(int start, int end) {
		return findAll(start, end, null);
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
	@Override
	public List<ArticleImportState> findAll(
		int start, int end,
		OrderByComparator<ArticleImportState> orderByComparator) {

		return findAll(start, end, orderByComparator, true);
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
	@Override
	public List<ArticleImportState> findAll(
		int start, int end,
		OrderByComparator<ArticleImportState> orderByComparator,
		boolean useFinderCache) {

		FinderPath finderPath = null;
		Object[] finderArgs = null;

		if ((start == QueryUtil.ALL_POS) && (end == QueryUtil.ALL_POS) &&
			(orderByComparator == null)) {

			if (useFinderCache) {
				finderPath = _finderPathWithoutPaginationFindAll;
				finderArgs = FINDER_ARGS_EMPTY;
			}
		}
		else if (useFinderCache) {
			finderPath = _finderPathWithPaginationFindAll;
			finderArgs = new Object[] {start, end, orderByComparator};
		}

		List<ArticleImportState> list = null;

		if (useFinderCache) {
			list = (List<ArticleImportState>)finderCache.getResult(
				finderPath, finderArgs, this);
		}

		if (list == null) {
			StringBundler sb = null;
			String sql = null;

			if (orderByComparator != null) {
				sb = new StringBundler(
					2 + (orderByComparator.getOrderByFields().length * 2));

				sb.append(_SQL_SELECT_ARTICLEIMPORTSTATE);

				appendOrderByComparator(
					sb, _ORDER_BY_ENTITY_ALIAS, orderByComparator);

				sql = sb.toString();
			}
			else {
				sql = _SQL_SELECT_ARTICLEIMPORTSTATE;

				sql = sql.concat(ArticleImportStateModelImpl.ORDER_BY_JPQL);
			}

			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(sql);

				list = (List<ArticleImportState>)QueryUtil.list(
					query, getDialect(), start, end);

				cacheResult(list);

				if (useFinderCache) {
					finderCache.putResult(finderPath, finderArgs, list);
				}
			}
			catch (Exception exception) {
				throw processException(exception);
			}
			finally {
				closeSession(session);
			}
		}

		return list;
	}

	/**
	 * Removes all the article import states from the database.
	 *
	 */
	@Override
	public void removeAll() {
		for (ArticleImportState articleImportState : findAll()) {
			remove(articleImportState);
		}
	}

	/**
	 * Returns the number of article import states.
	 *
	 * @return the number of article import states
	 */
	@Override
	public int countAll() {
		Long count = (Long)finderCache.getResult(
			_finderPathCountAll, FINDER_ARGS_EMPTY, this);

		if (count == null) {
			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(
					_SQL_COUNT_ARTICLEIMPORTSTATE);

				count = (Long)query.uniqueResult();

				finderCache.putResult(
					_finderPathCountAll, FINDER_ARGS_EMPTY, count);
			}
			catch (Exception exception) {
				throw processException(exception);
			}
			finally {
				closeSession(session);
			}
		}

		return count.intValue();
	}

	@Override
	protected EntityCache getEntityCache() {
		return entityCache;
	}

	@Override
	protected String getPKDBName() {
		return "articleImportStateId";
	}

	@Override
	protected String getSelectSQL() {
		return _SQL_SELECT_ARTICLEIMPORTSTATE;
	}

	@Override
	protected Map<String, Integer> getTableColumnsMap() {
		return ArticleImportStateModelImpl.TABLE_COLUMNS_MAP;
	}

	/**
	 * Initializes the article import state persistence.
	 */
	@Activate
	public void activate() {
		_valueObjectFinderCacheListThreshold = GetterUtil.getInteger(
			PropsUtil.get(PropsKeys.VALUE_OBJECT_FINDER_CACHE_LIST_THRESHOLD));

		_finderPathWithPaginationFindAll = new FinderPath(
			FINDER_CLASS_NAME_LIST_WITH_PAGINATION, "findAll", new String[0],
			new String[0], true);

		_finderPathWithoutPaginationFindAll = new FinderPath(
			FINDER_CLASS_NAME_LIST_WITHOUT_PAGINATION, "findAll", new String[0],
			new String[0], true);

		_finderPathCountAll = new FinderPath(
			FINDER_CLASS_NAME_LIST_WITHOUT_PAGINATION, "countAll",
			new String[0], new String[0], false);

		_finderPathFetchByG_A_L = new FinderPath(
			FINDER_CLASS_NAME_ENTITY, "fetchByG_A_L",
			new String[] {
				Long.class.getName(), String.class.getName(),
				String.class.getName()
			},
			new String[] {"groupId", "articleERC", "locale"}, true);

		ArticleImportStateUtil.setPersistence(this);
	}

	@Deactivate
	public void deactivate() {
		ArticleImportStateUtil.setPersistence(null);

		entityCache.removeCache(ArticleImportStateImpl.class.getName());
	}

	@Override
	@Reference(
		target = NXCPersistenceConstants.SERVICE_CONFIGURATION_FILTER,
		unbind = "-"
	)
	public void setConfiguration(Configuration configuration) {
	}

	@Override
	@Reference(
		target = NXCPersistenceConstants.ORIGIN_BUNDLE_SYMBOLIC_NAME_FILTER,
		unbind = "-"
	)
	public void setDataSource(DataSource dataSource) {
		super.setDataSource(dataSource);
	}

	@Override
	@Reference(
		target = NXCPersistenceConstants.ORIGIN_BUNDLE_SYMBOLIC_NAME_FILTER,
		unbind = "-"
	)
	public void setSessionFactory(SessionFactory sessionFactory) {
		super.setSessionFactory(sessionFactory);
	}

	@Reference
	protected EntityCache entityCache;

	@Reference
	protected FinderCache finderCache;

	private static final String _SQL_SELECT_ARTICLEIMPORTSTATE =
		"SELECT articleImportState FROM ArticleImportState articleImportState";

	private static final String _SQL_SELECT_ARTICLEIMPORTSTATE_WHERE =
		"SELECT articleImportState FROM ArticleImportState articleImportState WHERE ";

	private static final String _SQL_COUNT_ARTICLEIMPORTSTATE =
		"SELECT COUNT(articleImportState) FROM ArticleImportState articleImportState";

	private static final String _SQL_COUNT_ARTICLEIMPORTSTATE_WHERE =
		"SELECT COUNT(articleImportState) FROM ArticleImportState articleImportState WHERE ";

	private static final String _ORDER_BY_ENTITY_ALIAS = "articleImportState.";

	private static final String _NO_SUCH_ENTITY_WITH_PRIMARY_KEY =
		"No ArticleImportState exists with the primary key ";

	private static final String _NO_SUCH_ENTITY_WITH_KEY =
		"No ArticleImportState exists with the key {";

	private static final Log _log = LogFactoryUtil.getLog(
		ArticleImportStatePersistenceImpl.class);

	@Override
	protected FinderCache getFinderCache() {
		return finderCache;
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:-1159651714