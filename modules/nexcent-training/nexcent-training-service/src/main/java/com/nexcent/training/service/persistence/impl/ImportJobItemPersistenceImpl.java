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

import com.nexcent.training.exception.NoSuchImportJobItemException;
import com.nexcent.training.model.ImportJobItem;
import com.nexcent.training.model.ImportJobItemTable;
import com.nexcent.training.model.impl.ImportJobItemImpl;
import com.nexcent.training.model.impl.ImportJobItemModelImpl;
import com.nexcent.training.service.persistence.ImportJobItemPersistence;
import com.nexcent.training.service.persistence.ImportJobItemUtil;
import com.nexcent.training.service.persistence.impl.constants.NXCPersistenceConstants;

import java.io.Serializable;

import java.lang.reflect.InvocationHandler;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.sql.DataSource;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;

/**
 * The persistence implementation for the import job item service.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @generated
 */
@Component(service = ImportJobItemPersistence.class)
public class ImportJobItemPersistenceImpl
	extends BasePersistenceImpl<ImportJobItem>
	implements ImportJobItemPersistence {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this class directly. Always use <code>ImportJobItemUtil</code> to access the import job item persistence. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this class.
	 */
	public static final String FINDER_CLASS_NAME_ENTITY =
		ImportJobItemImpl.class.getName();

	public static final String FINDER_CLASS_NAME_LIST_WITH_PAGINATION =
		FINDER_CLASS_NAME_ENTITY + ".List1";

	public static final String FINDER_CLASS_NAME_LIST_WITHOUT_PAGINATION =
		FINDER_CLASS_NAME_ENTITY + ".List2";

	private FinderPath _finderPathWithPaginationFindAll;
	private FinderPath _finderPathWithoutPaginationFindAll;
	private FinderPath _finderPathCountAll;
	private FinderPath _finderPathWithPaginationFindByJ;
	private FinderPath _finderPathWithoutPaginationFindByJ;
	private FinderPath _finderPathCountByJ;

	/**
	 * Returns all the import job items where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @return the matching import job items
	 */
	@Override
	public List<ImportJobItem> findByJ(long importJobId) {
		return findByJ(importJobId, QueryUtil.ALL_POS, QueryUtil.ALL_POS, null);
	}

	/**
	 * Returns a range of all the import job items where importJobId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobItemModelImpl</code>.
	 * </p>
	 *
	 * @param importJobId the import job ID
	 * @param start the lower bound of the range of import job items
	 * @param end the upper bound of the range of import job items (not inclusive)
	 * @return the range of matching import job items
	 */
	@Override
	public List<ImportJobItem> findByJ(long importJobId, int start, int end) {
		return findByJ(importJobId, start, end, null);
	}

	/**
	 * Returns an ordered range of all the import job items where importJobId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobItemModelImpl</code>.
	 * </p>
	 *
	 * @param importJobId the import job ID
	 * @param start the lower bound of the range of import job items
	 * @param end the upper bound of the range of import job items (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import job items
	 */
	@Override
	public List<ImportJobItem> findByJ(
		long importJobId, int start, int end,
		OrderByComparator<ImportJobItem> orderByComparator) {

		return findByJ(importJobId, start, end, orderByComparator, true);
	}

	/**
	 * Returns an ordered range of all the import job items where importJobId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobItemModelImpl</code>.
	 * </p>
	 *
	 * @param importJobId the import job ID
	 * @param start the lower bound of the range of import job items
	 * @param end the upper bound of the range of import job items (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching import job items
	 */
	@Override
	public List<ImportJobItem> findByJ(
		long importJobId, int start, int end,
		OrderByComparator<ImportJobItem> orderByComparator,
		boolean useFinderCache) {

		FinderPath finderPath = null;
		Object[] finderArgs = null;

		if ((start == QueryUtil.ALL_POS) && (end == QueryUtil.ALL_POS) &&
			(orderByComparator == null)) {

			if (useFinderCache) {
				finderPath = _finderPathWithoutPaginationFindByJ;
				finderArgs = new Object[] {importJobId};
			}
		}
		else if (useFinderCache) {
			finderPath = _finderPathWithPaginationFindByJ;
			finderArgs = new Object[] {
				importJobId, start, end, orderByComparator
			};
		}

		List<ImportJobItem> list = null;

		if (useFinderCache) {
			list = (List<ImportJobItem>)finderCache.getResult(
				finderPath, finderArgs, this);

			if ((list != null) && !list.isEmpty()) {
				for (ImportJobItem importJobItem : list) {
					if (importJobId != importJobItem.getImportJobId()) {
						list = null;

						break;
					}
				}
			}
		}

		if (list == null) {
			StringBundler sb = null;

			if (orderByComparator != null) {
				sb = new StringBundler(
					3 + (orderByComparator.getOrderByFields().length * 2));
			}
			else {
				sb = new StringBundler(3);
			}

			sb.append(_SQL_SELECT_IMPORTJOBITEM_WHERE);

			sb.append(_FINDER_COLUMN_J_IMPORTJOBID_2);

			if (orderByComparator != null) {
				appendOrderByComparator(
					sb, _ORDER_BY_ENTITY_ALIAS, orderByComparator);
			}
			else {
				sb.append(ImportJobItemModelImpl.ORDER_BY_JPQL);
			}

			String sql = sb.toString();

			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(sql);

				QueryPos queryPos = QueryPos.getInstance(query);

				queryPos.add(importJobId);

				list = (List<ImportJobItem>)QueryUtil.list(
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
	 * Returns the first import job item in the ordered set where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job item
	 * @throws NoSuchImportJobItemException if a matching import job item could not be found
	 */
	@Override
	public ImportJobItem findByJ_First(
			long importJobId,
			OrderByComparator<ImportJobItem> orderByComparator)
		throws NoSuchImportJobItemException {

		ImportJobItem importJobItem = fetchByJ_First(
			importJobId, orderByComparator);

		if (importJobItem != null) {
			return importJobItem;
		}

		StringBundler sb = new StringBundler(4);

		sb.append(_NO_SUCH_ENTITY_WITH_KEY);

		sb.append("importJobId=");
		sb.append(importJobId);

		sb.append("}");

		throw new NoSuchImportJobItemException(sb.toString());
	}

	/**
	 * Returns the first import job item in the ordered set where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	@Override
	public ImportJobItem fetchByJ_First(
		long importJobId, OrderByComparator<ImportJobItem> orderByComparator) {

		List<ImportJobItem> list = findByJ(
			importJobId, 0, 1, orderByComparator);

		if (!list.isEmpty()) {
			return list.get(0);
		}

		return null;
	}

	/**
	 * Removes all the import job items where importJobId = &#63; from the database.
	 *
	 * @param importJobId the import job ID
	 */
	@Override
	public void removeByJ(long importJobId) {
		for (ImportJobItem importJobItem :
				findByJ(
					importJobId, QueryUtil.ALL_POS, QueryUtil.ALL_POS, null)) {

			remove(importJobItem);
		}
	}

	/**
	 * Returns the number of import job items where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @return the number of matching import job items
	 */
	@Override
	public int countByJ(long importJobId) {
		FinderPath finderPath = _finderPathCountByJ;

		Object[] finderArgs = new Object[] {importJobId};

		Long count = (Long)finderCache.getResult(finderPath, finderArgs, this);

		if (count == null) {
			StringBundler sb = new StringBundler(2);

			sb.append(_SQL_COUNT_IMPORTJOBITEM_WHERE);

			sb.append(_FINDER_COLUMN_J_IMPORTJOBID_2);

			String sql = sb.toString();

			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(sql);

				QueryPos queryPos = QueryPos.getInstance(query);

				queryPos.add(importJobId);

				count = (Long)query.uniqueResult();

				finderCache.putResult(finderPath, finderArgs, count);
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

	private static final String _FINDER_COLUMN_J_IMPORTJOBID_2 =
		"importJobItem.importJobId = ?";

	private FinderPath _finderPathFetchByJ_R;

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or throws a <code>NoSuchImportJobItemException</code> if it could not be found.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the matching import job item
	 * @throws NoSuchImportJobItemException if a matching import job item could not be found
	 */
	@Override
	public ImportJobItem findByJ_R(long importJobId, int rowNumber)
		throws NoSuchImportJobItemException {

		ImportJobItem importJobItem = fetchByJ_R(importJobId, rowNumber);

		if (importJobItem == null) {
			StringBundler sb = new StringBundler(6);

			sb.append(_NO_SUCH_ENTITY_WITH_KEY);

			sb.append("importJobId=");
			sb.append(importJobId);

			sb.append(", rowNumber=");
			sb.append(rowNumber);

			sb.append("}");

			if (_log.isDebugEnabled()) {
				_log.debug(sb.toString());
			}

			throw new NoSuchImportJobItemException(sb.toString());
		}

		return importJobItem;
	}

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	@Override
	public ImportJobItem fetchByJ_R(long importJobId, int rowNumber) {
		return fetchByJ_R(importJobId, rowNumber, true);
	}

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	@Override
	public ImportJobItem fetchByJ_R(
		long importJobId, int rowNumber, boolean useFinderCache) {

		Object[] finderArgs = null;

		if (useFinderCache) {
			finderArgs = new Object[] {importJobId, rowNumber};
		}

		Object result = null;

		if (useFinderCache) {
			result = finderCache.getResult(
				_finderPathFetchByJ_R, finderArgs, this);
		}

		if (result instanceof ImportJobItem) {
			ImportJobItem importJobItem = (ImportJobItem)result;

			if ((importJobId != importJobItem.getImportJobId()) ||
				(rowNumber != importJobItem.getRowNumber())) {

				result = null;
			}
		}

		if (result == null) {
			StringBundler sb = new StringBundler(4);

			sb.append(_SQL_SELECT_IMPORTJOBITEM_WHERE);

			sb.append(_FINDER_COLUMN_J_R_IMPORTJOBID_2);

			sb.append(_FINDER_COLUMN_J_R_ROWNUMBER_2);

			String sql = sb.toString();

			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(sql);

				QueryPos queryPos = QueryPos.getInstance(query);

				queryPos.add(importJobId);

				queryPos.add(rowNumber);

				List<ImportJobItem> list = query.list();

				if (list.isEmpty()) {
					if (useFinderCache) {
						finderCache.putResult(
							_finderPathFetchByJ_R, finderArgs, list);
					}
				}
				else {
					ImportJobItem importJobItem = list.get(0);

					result = importJobItem;

					cacheResult(importJobItem);
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
			return (ImportJobItem)result;
		}
	}

	/**
	 * Removes the import job item where importJobId = &#63; and rowNumber = &#63; from the database.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the import job item that was removed
	 */
	@Override
	public ImportJobItem removeByJ_R(long importJobId, int rowNumber)
		throws NoSuchImportJobItemException {

		ImportJobItem importJobItem = findByJ_R(importJobId, rowNumber);

		return remove(importJobItem);
	}

	/**
	 * Returns the number of import job items where importJobId = &#63; and rowNumber = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the number of matching import job items
	 */
	@Override
	public int countByJ_R(long importJobId, int rowNumber) {
		ImportJobItem importJobItem = fetchByJ_R(importJobId, rowNumber);

		if (importJobItem == null) {
			return 0;
		}

		return 1;
	}

	private static final String _FINDER_COLUMN_J_R_IMPORTJOBID_2 =
		"importJobItem.importJobId = ? AND ";

	private static final String _FINDER_COLUMN_J_R_ROWNUMBER_2 =
		"importJobItem.rowNumber = ?";

	public ImportJobItemPersistenceImpl() {
		setModelClass(ImportJobItem.class);

		setModelImplClass(ImportJobItemImpl.class);
		setModelPKClass(long.class);

		setTable(ImportJobItemTable.INSTANCE);
	}

	/**
	 * Caches the import job item in the entity cache if it is enabled.
	 *
	 * @param importJobItem the import job item
	 */
	@Override
	public void cacheResult(ImportJobItem importJobItem) {
		entityCache.putResult(
			ImportJobItemImpl.class, importJobItem.getPrimaryKey(),
			importJobItem);

		finderCache.putResult(
			_finderPathFetchByJ_R,
			new Object[] {
				importJobItem.getImportJobId(), importJobItem.getRowNumber()
			},
			importJobItem);
	}

	private int _valueObjectFinderCacheListThreshold;

	/**
	 * Caches the import job items in the entity cache if it is enabled.
	 *
	 * @param importJobItems the import job items
	 */
	@Override
	public void cacheResult(List<ImportJobItem> importJobItems) {
		if ((_valueObjectFinderCacheListThreshold == 0) ||
			((_valueObjectFinderCacheListThreshold > 0) &&
			 (importJobItems.size() > _valueObjectFinderCacheListThreshold))) {

			return;
		}

		for (ImportJobItem importJobItem : importJobItems) {
			if (entityCache.getResult(
					ImportJobItemImpl.class, importJobItem.getPrimaryKey()) ==
						null) {

				cacheResult(importJobItem);
			}
		}
	}

	/**
	 * Clears the cache for all import job items.
	 *
	 * <p>
	 * The <code>EntityCache</code> and <code>FinderCache</code> are both cleared by this method.
	 * </p>
	 */
	@Override
	public void clearCache() {
		entityCache.clearCache(ImportJobItemImpl.class);

		finderCache.clearCache(ImportJobItemImpl.class);
	}

	/**
	 * Clears the cache for the import job item.
	 *
	 * <p>
	 * The <code>EntityCache</code> and <code>FinderCache</code> are both cleared by this method.
	 * </p>
	 */
	@Override
	public void clearCache(ImportJobItem importJobItem) {
		entityCache.removeResult(ImportJobItemImpl.class, importJobItem);
	}

	@Override
	public void clearCache(List<ImportJobItem> importJobItems) {
		for (ImportJobItem importJobItem : importJobItems) {
			entityCache.removeResult(ImportJobItemImpl.class, importJobItem);
		}
	}

	@Override
	public void clearCache(Set<Serializable> primaryKeys) {
		finderCache.clearCache(ImportJobItemImpl.class);

		for (Serializable primaryKey : primaryKeys) {
			entityCache.removeResult(ImportJobItemImpl.class, primaryKey);
		}
	}

	protected void cacheUniqueFindersCache(
		ImportJobItemModelImpl importJobItemModelImpl) {

		Object[] args = new Object[] {
			importJobItemModelImpl.getImportJobId(),
			importJobItemModelImpl.getRowNumber()
		};

		finderCache.putResult(
			_finderPathFetchByJ_R, args, importJobItemModelImpl);
	}

	/**
	 * Creates a new import job item with the primary key. Does not add the import job item to the database.
	 *
	 * @param importJobItemId the primary key for the new import job item
	 * @return the new import job item
	 */
	@Override
	public ImportJobItem create(long importJobItemId) {
		ImportJobItem importJobItem = new ImportJobItemImpl();

		importJobItem.setNew(true);
		importJobItem.setPrimaryKey(importJobItemId);

		importJobItem.setCompanyId(CompanyThreadLocal.getCompanyId());

		return importJobItem;
	}

	/**
	 * Removes the import job item with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item that was removed
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	@Override
	public ImportJobItem remove(long importJobItemId)
		throws NoSuchImportJobItemException {

		return remove((Serializable)importJobItemId);
	}

	/**
	 * Removes the import job item with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param primaryKey the primary key of the import job item
	 * @return the import job item that was removed
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	@Override
	public ImportJobItem remove(Serializable primaryKey)
		throws NoSuchImportJobItemException {

		Session session = null;

		try {
			session = openSession();

			ImportJobItem importJobItem = (ImportJobItem)session.get(
				ImportJobItemImpl.class, primaryKey);

			if (importJobItem == null) {
				if (_log.isDebugEnabled()) {
					_log.debug(_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
				}

				throw new NoSuchImportJobItemException(
					_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
			}

			return remove(importJobItem);
		}
		catch (NoSuchImportJobItemException noSuchEntityException) {
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
	protected ImportJobItem removeImpl(ImportJobItem importJobItem) {
		Session session = null;

		try {
			session = openSession();

			if (!session.contains(importJobItem)) {
				importJobItem = (ImportJobItem)session.get(
					ImportJobItemImpl.class, importJobItem.getPrimaryKeyObj());
			}

			if (importJobItem != null) {
				session.delete(importJobItem);
			}
		}
		catch (Exception exception) {
			throw processException(exception);
		}
		finally {
			closeSession(session);
		}

		if (importJobItem != null) {
			clearCache(importJobItem);
		}

		return importJobItem;
	}

	@Override
	public ImportJobItem updateImpl(ImportJobItem importJobItem) {
		boolean isNew = importJobItem.isNew();

		if (!(importJobItem instanceof ImportJobItemModelImpl)) {
			InvocationHandler invocationHandler = null;

			if (ProxyUtil.isProxyClass(importJobItem.getClass())) {
				invocationHandler = ProxyUtil.getInvocationHandler(
					importJobItem);

				throw new IllegalArgumentException(
					"Implement ModelWrapper in importJobItem proxy " +
						invocationHandler.getClass());
			}

			throw new IllegalArgumentException(
				"Implement ModelWrapper in custom ImportJobItem implementation " +
					importJobItem.getClass());
		}

		ImportJobItemModelImpl importJobItemModelImpl =
			(ImportJobItemModelImpl)importJobItem;

		ServiceContext serviceContext =
			ServiceContextThreadLocal.getServiceContext();

		Date date = new Date();

		if (isNew && (importJobItem.getCreateDate() == null)) {
			if (serviceContext == null) {
				importJobItem.setCreateDate(date);
			}
			else {
				importJobItem.setCreateDate(serviceContext.getCreateDate(date));
			}
		}

		if (!importJobItemModelImpl.hasSetModifiedDate()) {
			if (serviceContext == null) {
				importJobItem.setModifiedDate(date);
			}
			else {
				importJobItem.setModifiedDate(
					serviceContext.getModifiedDate(date));
			}
		}

		Session session = null;

		try {
			session = openSession();

			if (isNew) {
				session.save(importJobItem);
			}
			else {
				importJobItem = (ImportJobItem)session.merge(importJobItem);
			}
		}
		catch (Exception exception) {
			throw processException(exception);
		}
		finally {
			closeSession(session);
		}

		entityCache.putResult(
			ImportJobItemImpl.class, importJobItemModelImpl, false, true);

		cacheUniqueFindersCache(importJobItemModelImpl);

		if (isNew) {
			importJobItem.setNew(false);
		}

		importJobItem.resetOriginalValues();

		return importJobItem;
	}

	/**
	 * Returns the import job item with the primary key or throws a <code>com.liferay.portal.kernel.exception.NoSuchModelException</code> if it could not be found.
	 *
	 * @param primaryKey the primary key of the import job item
	 * @return the import job item
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	@Override
	public ImportJobItem findByPrimaryKey(Serializable primaryKey)
		throws NoSuchImportJobItemException {

		ImportJobItem importJobItem = fetchByPrimaryKey(primaryKey);

		if (importJobItem == null) {
			if (_log.isDebugEnabled()) {
				_log.debug(_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
			}

			throw new NoSuchImportJobItemException(
				_NO_SUCH_ENTITY_WITH_PRIMARY_KEY + primaryKey);
		}

		return importJobItem;
	}

	/**
	 * Returns the import job item with the primary key or throws a <code>NoSuchImportJobItemException</code> if it could not be found.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	@Override
	public ImportJobItem findByPrimaryKey(long importJobItemId)
		throws NoSuchImportJobItemException {

		return findByPrimaryKey((Serializable)importJobItemId);
	}

	/**
	 * Returns the import job item with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item, or <code>null</code> if a import job item with the primary key could not be found
	 */
	@Override
	public ImportJobItem fetchByPrimaryKey(long importJobItemId) {
		return fetchByPrimaryKey((Serializable)importJobItemId);
	}

	/**
	 * Returns all the import job items.
	 *
	 * @return the import job items
	 */
	@Override
	public List<ImportJobItem> findAll() {
		return findAll(QueryUtil.ALL_POS, QueryUtil.ALL_POS, null);
	}

	/**
	 * Returns a range of all the import job items.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobItemModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import job items
	 * @param end the upper bound of the range of import job items (not inclusive)
	 * @return the range of import job items
	 */
	@Override
	public List<ImportJobItem> findAll(int start, int end) {
		return findAll(start, end, null);
	}

	/**
	 * Returns an ordered range of all the import job items.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobItemModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import job items
	 * @param end the upper bound of the range of import job items (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of import job items
	 */
	@Override
	public List<ImportJobItem> findAll(
		int start, int end,
		OrderByComparator<ImportJobItem> orderByComparator) {

		return findAll(start, end, orderByComparator, true);
	}

	/**
	 * Returns an ordered range of all the import job items.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobItemModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import job items
	 * @param end the upper bound of the range of import job items (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of import job items
	 */
	@Override
	public List<ImportJobItem> findAll(
		int start, int end, OrderByComparator<ImportJobItem> orderByComparator,
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

		List<ImportJobItem> list = null;

		if (useFinderCache) {
			list = (List<ImportJobItem>)finderCache.getResult(
				finderPath, finderArgs, this);
		}

		if (list == null) {
			StringBundler sb = null;
			String sql = null;

			if (orderByComparator != null) {
				sb = new StringBundler(
					2 + (orderByComparator.getOrderByFields().length * 2));

				sb.append(_SQL_SELECT_IMPORTJOBITEM);

				appendOrderByComparator(
					sb, _ORDER_BY_ENTITY_ALIAS, orderByComparator);

				sql = sb.toString();
			}
			else {
				sql = _SQL_SELECT_IMPORTJOBITEM;

				sql = sql.concat(ImportJobItemModelImpl.ORDER_BY_JPQL);
			}

			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(sql);

				list = (List<ImportJobItem>)QueryUtil.list(
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
	 * Removes all the import job items from the database.
	 *
	 */
	@Override
	public void removeAll() {
		for (ImportJobItem importJobItem : findAll()) {
			remove(importJobItem);
		}
	}

	/**
	 * Returns the number of import job items.
	 *
	 * @return the number of import job items
	 */
	@Override
	public int countAll() {
		Long count = (Long)finderCache.getResult(
			_finderPathCountAll, FINDER_ARGS_EMPTY, this);

		if (count == null) {
			Session session = null;

			try {
				session = openSession();

				Query query = session.createQuery(_SQL_COUNT_IMPORTJOBITEM);

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
		return "importJobItemId";
	}

	@Override
	protected String getSelectSQL() {
		return _SQL_SELECT_IMPORTJOBITEM;
	}

	@Override
	protected Map<String, Integer> getTableColumnsMap() {
		return ImportJobItemModelImpl.TABLE_COLUMNS_MAP;
	}

	/**
	 * Initializes the import job item persistence.
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

		_finderPathWithPaginationFindByJ = new FinderPath(
			FINDER_CLASS_NAME_LIST_WITH_PAGINATION, "findByJ",
			new String[] {
				Long.class.getName(), Integer.class.getName(),
				Integer.class.getName(), OrderByComparator.class.getName()
			},
			new String[] {"importJobId"}, true);

		_finderPathWithoutPaginationFindByJ = new FinderPath(
			FINDER_CLASS_NAME_LIST_WITHOUT_PAGINATION, "findByJ",
			new String[] {Long.class.getName()}, new String[] {"importJobId"},
			true);

		_finderPathCountByJ = new FinderPath(
			FINDER_CLASS_NAME_LIST_WITHOUT_PAGINATION, "countByJ",
			new String[] {Long.class.getName()}, new String[] {"importJobId"},
			false);

		_finderPathFetchByJ_R = new FinderPath(
			FINDER_CLASS_NAME_ENTITY, "fetchByJ_R",
			new String[] {Long.class.getName(), Integer.class.getName()},
			new String[] {"importJobId", "rowNumber"}, true);

		ImportJobItemUtil.setPersistence(this);
	}

	@Deactivate
	public void deactivate() {
		ImportJobItemUtil.setPersistence(null);

		entityCache.removeCache(ImportJobItemImpl.class.getName());
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

	private static final String _SQL_SELECT_IMPORTJOBITEM =
		"SELECT importJobItem FROM ImportJobItem importJobItem";

	private static final String _SQL_SELECT_IMPORTJOBITEM_WHERE =
		"SELECT importJobItem FROM ImportJobItem importJobItem WHERE ";

	private static final String _SQL_COUNT_IMPORTJOBITEM =
		"SELECT COUNT(importJobItem) FROM ImportJobItem importJobItem";

	private static final String _SQL_COUNT_IMPORTJOBITEM_WHERE =
		"SELECT COUNT(importJobItem) FROM ImportJobItem importJobItem WHERE ";

	private static final String _ORDER_BY_ENTITY_ALIAS = "importJobItem.";

	private static final String _NO_SUCH_ENTITY_WITH_PRIMARY_KEY =
		"No ImportJobItem exists with the primary key ";

	private static final String _NO_SUCH_ENTITY_WITH_KEY =
		"No ImportJobItem exists with the key {";

	private static final Log _log = LogFactoryUtil.getLog(
		ImportJobItemPersistenceImpl.class);

	@Override
	protected FinderCache getFinderCache() {
		return finderCache;
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:1840452310