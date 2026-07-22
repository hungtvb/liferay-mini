/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence;

import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.OrderByComparator;

import com.nexcent.training.model.ImportJob;

import java.io.Serializable;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * The persistence utility for the import job service. This utility wraps <code>com.nexcent.training.service.persistence.impl.ImportJobPersistenceImpl</code> and provides direct access to the database for CRUD operations. This utility should only be used by the service layer, as it must operate within a transaction. Never access this utility in a JSP, controller, model, or other front-end class.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @see ImportJobPersistence
 * @generated
 */
public class ImportJobUtil {

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
	public static void clearCache(ImportJob importJob) {
		getPersistence().clearCache(importJob);
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
	public static Map<Serializable, ImportJob> fetchByPrimaryKeys(
		Set<Serializable> primaryKeys) {

		return getPersistence().fetchByPrimaryKeys(primaryKeys);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery)
	 */
	public static List<ImportJob> findWithDynamicQuery(
		DynamicQuery dynamicQuery) {

		return getPersistence().findWithDynamicQuery(dynamicQuery);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int)
	 */
	public static List<ImportJob> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end) {

		return getPersistence().findWithDynamicQuery(dynamicQuery, start, end);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int, OrderByComparator)
	 */
	public static List<ImportJob> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end,
		OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().findWithDynamicQuery(
			dynamicQuery, start, end, orderByComparator);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel)
	 */
	public static ImportJob update(ImportJob importJob) {
		return getPersistence().update(importJob);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel, ServiceContext)
	 */
	public static ImportJob update(
		ImportJob importJob, ServiceContext serviceContext) {

		return getPersistence().update(importJob, serviceContext);
	}

	/**
	 * Returns all the import jobs where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the matching import jobs
	 */
	public static List<ImportJob> findByUuid(String uuid) {
		return getPersistence().findByUuid(uuid);
	}

	/**
	 * Returns a range of all the import jobs where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of matching import jobs
	 */
	public static List<ImportJob> findByUuid(String uuid, int start, int end) {
		return getPersistence().findByUuid(uuid, start, end);
	}

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByUuid(
		String uuid, int start, int end,
		OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().findByUuid(uuid, start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByUuid(
		String uuid, int start, int end,
		OrderByComparator<ImportJob> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findByUuid(
			uuid, start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Returns the first import job in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public static ImportJob findByUuid_First(
			String uuid, OrderByComparator<ImportJob> orderByComparator)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().findByUuid_First(uuid, orderByComparator);
	}

	/**
	 * Returns the first import job in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByUuid_First(
		String uuid, OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().fetchByUuid_First(uuid, orderByComparator);
	}

	/**
	 * Removes all the import jobs where uuid = &#63; from the database.
	 *
	 * @param uuid the uuid
	 */
	public static void removeByUuid(String uuid) {
		getPersistence().removeByUuid(uuid);
	}

	/**
	 * Returns the number of import jobs where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the number of matching import jobs
	 */
	public static int countByUuid(String uuid) {
		return getPersistence().countByUuid(uuid);
	}

	/**
	 * Returns the import job where uuid = &#63; and groupId = &#63; or throws a <code>NoSuchImportJobException</code> if it could not be found.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public static ImportJob findByUUID_G(String uuid, long groupId)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().findByUUID_G(uuid, groupId);
	}

	/**
	 * Returns the import job where uuid = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByUUID_G(String uuid, long groupId) {
		return getPersistence().fetchByUUID_G(uuid, groupId);
	}

	/**
	 * Returns the import job where uuid = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByUUID_G(
		String uuid, long groupId, boolean useFinderCache) {

		return getPersistence().fetchByUUID_G(uuid, groupId, useFinderCache);
	}

	/**
	 * Removes the import job where uuid = &#63; and groupId = &#63; from the database.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the import job that was removed
	 */
	public static ImportJob removeByUUID_G(String uuid, long groupId)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().removeByUUID_G(uuid, groupId);
	}

	/**
	 * Returns the number of import jobs where uuid = &#63; and groupId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the number of matching import jobs
	 */
	public static int countByUUID_G(String uuid, long groupId) {
		return getPersistence().countByUUID_G(uuid, groupId);
	}

	/**
	 * Returns all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the matching import jobs
	 */
	public static List<ImportJob> findByUuid_C(String uuid, long companyId) {
		return getPersistence().findByUuid_C(uuid, companyId);
	}

	/**
	 * Returns a range of all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of matching import jobs
	 */
	public static List<ImportJob> findByUuid_C(
		String uuid, long companyId, int start, int end) {

		return getPersistence().findByUuid_C(uuid, companyId, start, end);
	}

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByUuid_C(
		String uuid, long companyId, int start, int end,
		OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().findByUuid_C(
			uuid, companyId, start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByUuid_C(
		String uuid, long companyId, int start, int end,
		OrderByComparator<ImportJob> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findByUuid_C(
			uuid, companyId, start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Returns the first import job in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public static ImportJob findByUuid_C_First(
			String uuid, long companyId,
			OrderByComparator<ImportJob> orderByComparator)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().findByUuid_C_First(
			uuid, companyId, orderByComparator);
	}

	/**
	 * Returns the first import job in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByUuid_C_First(
		String uuid, long companyId,
		OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().fetchByUuid_C_First(
			uuid, companyId, orderByComparator);
	}

	/**
	 * Removes all the import jobs where uuid = &#63; and companyId = &#63; from the database.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 */
	public static void removeByUuid_C(String uuid, long companyId) {
		getPersistence().removeByUuid_C(uuid, companyId);
	}

	/**
	 * Returns the number of import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the number of matching import jobs
	 */
	public static int countByUuid_C(String uuid, long companyId) {
		return getPersistence().countByUuid_C(uuid, companyId);
	}

	/**
	 * Returns all the import jobs where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @return the matching import jobs
	 */
	public static List<ImportJob> findByG(long groupId) {
		return getPersistence().findByG(groupId);
	}

	/**
	 * Returns a range of all the import jobs where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of matching import jobs
	 */
	public static List<ImportJob> findByG(long groupId, int start, int end) {
		return getPersistence().findByG(groupId, start, end);
	}

	/**
	 * Returns an ordered range of all the import jobs where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByG(
		long groupId, int start, int end,
		OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().findByG(groupId, start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the import jobs where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByG(
		long groupId, int start, int end,
		OrderByComparator<ImportJob> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findByG(
			groupId, start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Returns the first import job in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public static ImportJob findByG_First(
			long groupId, OrderByComparator<ImportJob> orderByComparator)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().findByG_First(groupId, orderByComparator);
	}

	/**
	 * Returns the first import job in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByG_First(
		long groupId, OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().fetchByG_First(groupId, orderByComparator);
	}

	/**
	 * Removes all the import jobs where groupId = &#63; from the database.
	 *
	 * @param groupId the group ID
	 */
	public static void removeByG(long groupId) {
		getPersistence().removeByG(groupId);
	}

	/**
	 * Returns the number of import jobs where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @return the number of matching import jobs
	 */
	public static int countByG(long groupId) {
		return getPersistence().countByG(groupId);
	}

	/**
	 * Returns all the import jobs where groupId = &#63; and status = &#63;.
	 *
	 * @param groupId the group ID
	 * @param status the status
	 * @return the matching import jobs
	 */
	public static List<ImportJob> findByG_S(long groupId, String status) {
		return getPersistence().findByG_S(groupId, status);
	}

	/**
	 * Returns a range of all the import jobs where groupId = &#63; and status = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param status the status
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of matching import jobs
	 */
	public static List<ImportJob> findByG_S(
		long groupId, String status, int start, int end) {

		return getPersistence().findByG_S(groupId, status, start, end);
	}

	/**
	 * Returns an ordered range of all the import jobs where groupId = &#63; and status = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param status the status
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByG_S(
		long groupId, String status, int start, int end,
		OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().findByG_S(
			groupId, status, start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the import jobs where groupId = &#63; and status = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param status the status
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching import jobs
	 */
	public static List<ImportJob> findByG_S(
		long groupId, String status, int start, int end,
		OrderByComparator<ImportJob> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findByG_S(
			groupId, status, start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Returns the first import job in the ordered set where groupId = &#63; and status = &#63;.
	 *
	 * @param groupId the group ID
	 * @param status the status
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public static ImportJob findByG_S_First(
			long groupId, String status,
			OrderByComparator<ImportJob> orderByComparator)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().findByG_S_First(
			groupId, status, orderByComparator);
	}

	/**
	 * Returns the first import job in the ordered set where groupId = &#63; and status = &#63;.
	 *
	 * @param groupId the group ID
	 * @param status the status
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByG_S_First(
		long groupId, String status,
		OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().fetchByG_S_First(
			groupId, status, orderByComparator);
	}

	/**
	 * Removes all the import jobs where groupId = &#63; and status = &#63; from the database.
	 *
	 * @param groupId the group ID
	 * @param status the status
	 */
	public static void removeByG_S(long groupId, String status) {
		getPersistence().removeByG_S(groupId, status);
	}

	/**
	 * Returns the number of import jobs where groupId = &#63; and status = &#63;.
	 *
	 * @param groupId the group ID
	 * @param status the status
	 * @return the number of matching import jobs
	 */
	public static int countByG_S(long groupId, String status) {
		return getPersistence().countByG_S(groupId, status);
	}

	/**
	 * Returns the import job where jobKey = &#63; and groupId = &#63; or throws a <code>NoSuchImportJobException</code> if it could not be found.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public static ImportJob findByJK_G(String jobKey, long groupId)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().findByJK_G(jobKey, groupId);
	}

	/**
	 * Returns the import job where jobKey = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByJK_G(String jobKey, long groupId) {
		return getPersistence().fetchByJK_G(jobKey, groupId);
	}

	/**
	 * Returns the import job where jobKey = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchByJK_G(
		String jobKey, long groupId, boolean useFinderCache) {

		return getPersistence().fetchByJK_G(jobKey, groupId, useFinderCache);
	}

	/**
	 * Removes the import job where jobKey = &#63; and groupId = &#63; from the database.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the import job that was removed
	 */
	public static ImportJob removeByJK_G(String jobKey, long groupId)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().removeByJK_G(jobKey, groupId);
	}

	/**
	 * Returns the number of import jobs where jobKey = &#63; and groupId = &#63;.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the number of matching import jobs
	 */
	public static int countByJK_G(String jobKey, long groupId) {
		return getPersistence().countByJK_G(jobKey, groupId);
	}

	/**
	 * Caches the import job in the entity cache if it is enabled.
	 *
	 * @param importJob the import job
	 */
	public static void cacheResult(ImportJob importJob) {
		getPersistence().cacheResult(importJob);
	}

	/**
	 * Caches the import jobs in the entity cache if it is enabled.
	 *
	 * @param importJobs the import jobs
	 */
	public static void cacheResult(List<ImportJob> importJobs) {
		getPersistence().cacheResult(importJobs);
	}

	/**
	 * Creates a new import job with the primary key. Does not add the import job to the database.
	 *
	 * @param importJobId the primary key for the new import job
	 * @return the new import job
	 */
	public static ImportJob create(long importJobId) {
		return getPersistence().create(importJobId);
	}

	/**
	 * Removes the import job with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job that was removed
	 * @throws NoSuchImportJobException if a import job with the primary key could not be found
	 */
	public static ImportJob remove(long importJobId)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().remove(importJobId);
	}

	public static ImportJob updateImpl(ImportJob importJob) {
		return getPersistence().updateImpl(importJob);
	}

	/**
	 * Returns the import job with the primary key or throws a <code>NoSuchImportJobException</code> if it could not be found.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job
	 * @throws NoSuchImportJobException if a import job with the primary key could not be found
	 */
	public static ImportJob findByPrimaryKey(long importJobId)
		throws com.nexcent.training.exception.NoSuchImportJobException {

		return getPersistence().findByPrimaryKey(importJobId);
	}

	/**
	 * Returns the import job with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job, or <code>null</code> if a import job with the primary key could not be found
	 */
	public static ImportJob fetchByPrimaryKey(long importJobId) {
		return getPersistence().fetchByPrimaryKey(importJobId);
	}

	/**
	 * Returns all the import jobs.
	 *
	 * @return the import jobs
	 */
	public static List<ImportJob> findAll() {
		return getPersistence().findAll();
	}

	/**
	 * Returns a range of all the import jobs.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of import jobs
	 */
	public static List<ImportJob> findAll(int start, int end) {
		return getPersistence().findAll(start, end);
	}

	/**
	 * Returns an ordered range of all the import jobs.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of import jobs
	 */
	public static List<ImportJob> findAll(
		int start, int end, OrderByComparator<ImportJob> orderByComparator) {

		return getPersistence().findAll(start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the import jobs.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of import jobs
	 */
	public static List<ImportJob> findAll(
		int start, int end, OrderByComparator<ImportJob> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findAll(
			start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Removes all the import jobs from the database.
	 */
	public static void removeAll() {
		getPersistence().removeAll();
	}

	/**
	 * Returns the number of import jobs.
	 *
	 * @return the number of import jobs
	 */
	public static int countAll() {
		return getPersistence().countAll();
	}

	public static ImportJobPersistence getPersistence() {
		return _persistence;
	}

	public static void setPersistence(ImportJobPersistence persistence) {
		_persistence = persistence;
	}

	private static volatile ImportJobPersistence _persistence;

}
// LIFERAY-SERVICE-BUILDER-HASH:-2108994159