/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence;

import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.OrderByComparator;

import com.nexcent.training.model.ImportJobItem;

import java.io.Serializable;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The persistence utility for the import job item service. This utility wraps <code>com.nexcent.training.service.persistence.impl.ImportJobItemPersistenceImpl</code> and provides direct access to the database for CRUD operations. This utility should only be used by the service layer, as it must operate within a transaction. Never access this utility in a JSP, controller, model, or other front-end class.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @see ImportJobItemPersistence
 * @generated
 */
public class ImportJobItemUtil {

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
	public static void clearCache(ImportJobItem importJobItem) {
		getPersistence().clearCache(importJobItem);
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
	public static Map<Serializable, ImportJobItem> fetchByPrimaryKeys(
		Set<Serializable> primaryKeys) {

		return getPersistence().fetchByPrimaryKeys(primaryKeys);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery)
	 */
	public static List<ImportJobItem> findWithDynamicQuery(
		DynamicQuery dynamicQuery) {

		return getPersistence().findWithDynamicQuery(dynamicQuery);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int)
	 */
	public static List<ImportJobItem> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end) {

		return getPersistence().findWithDynamicQuery(dynamicQuery, start, end);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int, OrderByComparator)
	 */
	public static List<ImportJobItem> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end,
		OrderByComparator<ImportJobItem> orderByComparator) {

		return getPersistence().findWithDynamicQuery(
			dynamicQuery, start, end, orderByComparator);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel)
	 */
	public static ImportJobItem update(ImportJobItem importJobItem) {
		return getPersistence().update(importJobItem);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel, ServiceContext)
	 */
	public static ImportJobItem update(
		ImportJobItem importJobItem, ServiceContext serviceContext) {

		return getPersistence().update(importJobItem, serviceContext);
	}

	/**
	 * Returns all the import job items where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @return the matching import job items
	 */
	public static List<ImportJobItem> findByJ(long importJobId) {
		return getPersistence().findByJ(importJobId);
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
	public static List<ImportJobItem> findByJ(
		long importJobId, int start, int end) {

		return getPersistence().findByJ(importJobId, start, end);
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
	public static List<ImportJobItem> findByJ(
		long importJobId, int start, int end,
		OrderByComparator<ImportJobItem> orderByComparator) {

		return getPersistence().findByJ(
			importJobId, start, end, orderByComparator);
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
	public static List<ImportJobItem> findByJ(
		long importJobId, int start, int end,
		OrderByComparator<ImportJobItem> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findByJ(
			importJobId, start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Returns the first import job item in the ordered set where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job item
	 * @throws NoSuchImportJobItemException if a matching import job item could not be found
	 */
	public static ImportJobItem findByJ_First(
			long importJobId,
			OrderByComparator<ImportJobItem> orderByComparator)
		throws com.nexcent.training.exception.NoSuchImportJobItemException {

		return getPersistence().findByJ_First(importJobId, orderByComparator);
	}

	/**
	 * Returns the first import job item in the ordered set where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	public static ImportJobItem fetchByJ_First(
		long importJobId, OrderByComparator<ImportJobItem> orderByComparator) {

		return getPersistence().fetchByJ_First(importJobId, orderByComparator);
	}

	/**
	 * Removes all the import job items where importJobId = &#63; from the database.
	 *
	 * @param importJobId the import job ID
	 */
	public static void removeByJ(long importJobId) {
		getPersistence().removeByJ(importJobId);
	}

	/**
	 * Returns the number of import job items where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @return the number of matching import job items
	 */
	public static int countByJ(long importJobId) {
		return getPersistence().countByJ(importJobId);
	}

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or throws a <code>NoSuchImportJobItemException</code> if it could not be found.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the matching import job item
	 * @throws NoSuchImportJobItemException if a matching import job item could not be found
	 */
	public static ImportJobItem findByJ_R(long importJobId, int rowNumber)
		throws com.nexcent.training.exception.NoSuchImportJobItemException {

		return getPersistence().findByJ_R(importJobId, rowNumber);
	}

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	public static ImportJobItem fetchByJ_R(long importJobId, int rowNumber) {
		return getPersistence().fetchByJ_R(importJobId, rowNumber);
	}

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	public static ImportJobItem fetchByJ_R(
		long importJobId, int rowNumber, boolean useFinderCache) {

		return getPersistence().fetchByJ_R(
			importJobId, rowNumber, useFinderCache);
	}

	/**
	 * Removes the import job item where importJobId = &#63; and rowNumber = &#63; from the database.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the import job item that was removed
	 */
	public static ImportJobItem removeByJ_R(long importJobId, int rowNumber)
		throws com.nexcent.training.exception.NoSuchImportJobItemException {

		return getPersistence().removeByJ_R(importJobId, rowNumber);
	}

	/**
	 * Returns the number of import job items where importJobId = &#63; and rowNumber = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the number of matching import job items
	 */
	public static int countByJ_R(long importJobId, int rowNumber) {
		return getPersistence().countByJ_R(importJobId, rowNumber);
	}

	/**
	 * Caches the import job item in the entity cache if it is enabled.
	 *
	 * @param importJobItem the import job item
	 */
	public static void cacheResult(ImportJobItem importJobItem) {
		getPersistence().cacheResult(importJobItem);
	}

	/**
	 * Caches the import job items in the entity cache if it is enabled.
	 *
	 * @param importJobItems the import job items
	 */
	public static void cacheResult(List<ImportJobItem> importJobItems) {
		getPersistence().cacheResult(importJobItems);
	}

	/**
	 * Creates a new import job item with the primary key. Does not add the import job item to the database.
	 *
	 * @param importJobItemId the primary key for the new import job item
	 * @return the new import job item
	 */
	public static ImportJobItem create(long importJobItemId) {
		return getPersistence().create(importJobItemId);
	}

	/**
	 * Removes the import job item with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item that was removed
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	public static ImportJobItem remove(long importJobItemId)
		throws com.nexcent.training.exception.NoSuchImportJobItemException {

		return getPersistence().remove(importJobItemId);
	}

	public static ImportJobItem updateImpl(ImportJobItem importJobItem) {
		return getPersistence().updateImpl(importJobItem);
	}

	/**
	 * Returns the import job item with the primary key or throws a <code>NoSuchImportJobItemException</code> if it could not be found.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	public static ImportJobItem findByPrimaryKey(long importJobItemId)
		throws com.nexcent.training.exception.NoSuchImportJobItemException {

		return getPersistence().findByPrimaryKey(importJobItemId);
	}

	/**
	 * Returns the import job item with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item, or <code>null</code> if a import job item with the primary key could not be found
	 */
	public static ImportJobItem fetchByPrimaryKey(long importJobItemId) {
		return getPersistence().fetchByPrimaryKey(importJobItemId);
	}

	/**
	 * Returns all the import job items.
	 *
	 * @return the import job items
	 */
	public static List<ImportJobItem> findAll() {
		return getPersistence().findAll();
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
	public static List<ImportJobItem> findAll(int start, int end) {
		return getPersistence().findAll(start, end);
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
	public static List<ImportJobItem> findAll(
		int start, int end,
		OrderByComparator<ImportJobItem> orderByComparator) {

		return getPersistence().findAll(start, end, orderByComparator);
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
	public static List<ImportJobItem> findAll(
		int start, int end, OrderByComparator<ImportJobItem> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findAll(
			start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Removes all the import job items from the database.
	 */
	public static void removeAll() {
		getPersistence().removeAll();
	}

	/**
	 * Returns the number of import job items.
	 *
	 * @return the number of import job items
	 */
	public static int countAll() {
		return getPersistence().countAll();
	}

	public static ImportJobItemPersistence getPersistence() {
		return _persistence;
	}

	public static void setPersistence(ImportJobItemPersistence persistence) {
		_persistence = persistence;
	}

	private static volatile ImportJobItemPersistence _persistence;

}
// LIFERAY-SERVICE-BUILDER-HASH:-1757657610