/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence;

import com.liferay.portal.kernel.service.persistence.BasePersistence;

import com.nexcent.training.exception.NoSuchImportJobException;
import com.nexcent.training.model.ImportJob;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The persistence interface for the import job service.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @see ImportJobUtil
 * @generated
 */
@ProviderType
public interface ImportJobPersistence extends BasePersistence<ImportJob> {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. Always use {@link ImportJobUtil} to access the import job persistence. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this interface.
	 */

	/**
	 * Returns all the import jobs where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the matching import jobs
	 */
	public java.util.List<ImportJob> findByUuid(String uuid);

	/**
	 * Returns a range of all the import jobs where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of matching import jobs
	 */
	public java.util.List<ImportJob> findByUuid(
		String uuid, int start, int end);

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import jobs
	 */
	public java.util.List<ImportJob> findByUuid(
		String uuid, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator);

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching import jobs
	 */
	public java.util.List<ImportJob> findByUuid(
		String uuid, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Returns the first import job in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public ImportJob findByUuid_First(
			String uuid,
			com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
				orderByComparator)
		throws NoSuchImportJobException;

	/**
	 * Returns the first import job in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public ImportJob fetchByUuid_First(
		String uuid,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator);

	/**
	 * Removes all the import jobs where uuid = &#63; from the database.
	 *
	 * @param uuid the uuid
	 */
	public void removeByUuid(String uuid);

	/**
	 * Returns the number of import jobs where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the number of matching import jobs
	 */
	public int countByUuid(String uuid);

	/**
	 * Returns the import job where uuid = &#63; and groupId = &#63; or throws a <code>NoSuchImportJobException</code> if it could not be found.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public ImportJob findByUUID_G(String uuid, long groupId)
		throws NoSuchImportJobException;

	/**
	 * Returns the import job where uuid = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public ImportJob fetchByUUID_G(String uuid, long groupId);

	/**
	 * Returns the import job where uuid = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public ImportJob fetchByUUID_G(
		String uuid, long groupId, boolean useFinderCache);

	/**
	 * Removes the import job where uuid = &#63; and groupId = &#63; from the database.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the import job that was removed
	 */
	public ImportJob removeByUUID_G(String uuid, long groupId)
		throws NoSuchImportJobException;

	/**
	 * Returns the number of import jobs where uuid = &#63; and groupId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param groupId the group ID
	 * @return the number of matching import jobs
	 */
	public int countByUUID_G(String uuid, long groupId);

	/**
	 * Returns all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the matching import jobs
	 */
	public java.util.List<ImportJob> findByUuid_C(String uuid, long companyId);

	/**
	 * Returns a range of all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of matching import jobs
	 */
	public java.util.List<ImportJob> findByUuid_C(
		String uuid, long companyId, int start, int end);

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import jobs
	 */
	public java.util.List<ImportJob> findByUuid_C(
		String uuid, long companyId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator);

	/**
	 * Returns an ordered range of all the import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
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
	public java.util.List<ImportJob> findByUuid_C(
		String uuid, long companyId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Returns the first import job in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public ImportJob findByUuid_C_First(
			String uuid, long companyId,
			com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
				orderByComparator)
		throws NoSuchImportJobException;

	/**
	 * Returns the first import job in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public ImportJob fetchByUuid_C_First(
		String uuid, long companyId,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator);

	/**
	 * Removes all the import jobs where uuid = &#63; and companyId = &#63; from the database.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 */
	public void removeByUuid_C(String uuid, long companyId);

	/**
	 * Returns the number of import jobs where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the number of matching import jobs
	 */
	public int countByUuid_C(String uuid, long companyId);

	/**
	 * Returns all the import jobs where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @return the matching import jobs
	 */
	public java.util.List<ImportJob> findByG(long groupId);

	/**
	 * Returns a range of all the import jobs where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of matching import jobs
	 */
	public java.util.List<ImportJob> findByG(long groupId, int start, int end);

	/**
	 * Returns an ordered range of all the import jobs where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching import jobs
	 */
	public java.util.List<ImportJob> findByG(
		long groupId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator);

	/**
	 * Returns an ordered range of all the import jobs where groupId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param groupId the group ID
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching import jobs
	 */
	public java.util.List<ImportJob> findByG(
		long groupId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Returns the first import job in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public ImportJob findByG_First(
			long groupId,
			com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
				orderByComparator)
		throws NoSuchImportJobException;

	/**
	 * Returns the first import job in the ordered set where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public ImportJob fetchByG_First(
		long groupId,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator);

	/**
	 * Removes all the import jobs where groupId = &#63; from the database.
	 *
	 * @param groupId the group ID
	 */
	public void removeByG(long groupId);

	/**
	 * Returns the number of import jobs where groupId = &#63;.
	 *
	 * @param groupId the group ID
	 * @return the number of matching import jobs
	 */
	public int countByG(long groupId);

	/**
	 * Returns the import job where jobKey = &#63; and groupId = &#63; or throws a <code>NoSuchImportJobException</code> if it could not be found.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the matching import job
	 * @throws NoSuchImportJobException if a matching import job could not be found
	 */
	public ImportJob findByJK_G(String jobKey, long groupId)
		throws NoSuchImportJobException;

	/**
	 * Returns the import job where jobKey = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public ImportJob fetchByJK_G(String jobKey, long groupId);

	/**
	 * Returns the import job where jobKey = &#63; and groupId = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public ImportJob fetchByJK_G(
		String jobKey, long groupId, boolean useFinderCache);

	/**
	 * Removes the import job where jobKey = &#63; and groupId = &#63; from the database.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the import job that was removed
	 */
	public ImportJob removeByJK_G(String jobKey, long groupId)
		throws NoSuchImportJobException;

	/**
	 * Returns the number of import jobs where jobKey = &#63; and groupId = &#63;.
	 *
	 * @param jobKey the job key
	 * @param groupId the group ID
	 * @return the number of matching import jobs
	 */
	public int countByJK_G(String jobKey, long groupId);

	/**
	 * Caches the import job in the entity cache if it is enabled.
	 *
	 * @param importJob the import job
	 */
	public void cacheResult(ImportJob importJob);

	/**
	 * Caches the import jobs in the entity cache if it is enabled.
	 *
	 * @param importJobs the import jobs
	 */
	public void cacheResult(java.util.List<ImportJob> importJobs);

	/**
	 * Creates a new import job with the primary key. Does not add the import job to the database.
	 *
	 * @param importJobId the primary key for the new import job
	 * @return the new import job
	 */
	public ImportJob create(long importJobId);

	/**
	 * Removes the import job with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job that was removed
	 * @throws NoSuchImportJobException if a import job with the primary key could not be found
	 */
	public ImportJob remove(long importJobId) throws NoSuchImportJobException;

	public ImportJob updateImpl(ImportJob importJob);

	/**
	 * Returns the import job with the primary key or throws a <code>NoSuchImportJobException</code> if it could not be found.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job
	 * @throws NoSuchImportJobException if a import job with the primary key could not be found
	 */
	public ImportJob findByPrimaryKey(long importJobId)
		throws NoSuchImportJobException;

	/**
	 * Returns the import job with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job, or <code>null</code> if a import job with the primary key could not be found
	 */
	public ImportJob fetchByPrimaryKey(long importJobId);

	/**
	 * Returns all the import jobs.
	 *
	 * @return the import jobs
	 */
	public java.util.List<ImportJob> findAll();

	/**
	 * Returns a range of all the import jobs.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @return the range of import jobs
	 */
	public java.util.List<ImportJob> findAll(int start, int end);

	/**
	 * Returns an ordered range of all the import jobs.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of import jobs
	 */
	public java.util.List<ImportJob> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator);

	/**
	 * Returns an ordered range of all the import jobs.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>ImportJobModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of import jobs
	 */
	public java.util.List<ImportJob> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJob>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Removes all the import jobs from the database.
	 */
	public void removeAll();

	/**
	 * Returns the number of import jobs.
	 *
	 * @return the number of import jobs
	 */
	public int countAll();

}
// LIFERAY-SERVICE-BUILDER-HASH:1451815002