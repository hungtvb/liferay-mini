/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service.persistence;

import com.liferay.portal.kernel.service.persistence.BasePersistence;

import com.nexcent.training.exception.NoSuchImportJobItemException;
import com.nexcent.training.model.ImportJobItem;

import org.osgi.annotation.versioning.ProviderType;

/**
 * The persistence interface for the import job item service.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Nexcent Training
 * @see ImportJobItemUtil
 * @generated
 */
@ProviderType
public interface ImportJobItemPersistence
	extends BasePersistence<ImportJobItem> {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify or reference this interface directly. Always use {@link ImportJobItemUtil} to access the import job item persistence. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this interface.
	 */

	/**
	 * Returns all the import job items where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @return the matching import job items
	 */
	public java.util.List<ImportJobItem> findByJ(long importJobId);

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
	public java.util.List<ImportJobItem> findByJ(
		long importJobId, int start, int end);

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
	public java.util.List<ImportJobItem> findByJ(
		long importJobId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJobItem>
			orderByComparator);

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
	public java.util.List<ImportJobItem> findByJ(
		long importJobId, int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJobItem>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Returns the first import job item in the ordered set where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job item
	 * @throws NoSuchImportJobItemException if a matching import job item could not be found
	 */
	public ImportJobItem findByJ_First(
			long importJobId,
			com.liferay.portal.kernel.util.OrderByComparator<ImportJobItem>
				orderByComparator)
		throws NoSuchImportJobItemException;

	/**
	 * Returns the first import job item in the ordered set where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	public ImportJobItem fetchByJ_First(
		long importJobId,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJobItem>
			orderByComparator);

	/**
	 * Removes all the import job items where importJobId = &#63; from the database.
	 *
	 * @param importJobId the import job ID
	 */
	public void removeByJ(long importJobId);

	/**
	 * Returns the number of import job items where importJobId = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @return the number of matching import job items
	 */
	public int countByJ(long importJobId);

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or throws a <code>NoSuchImportJobItemException</code> if it could not be found.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the matching import job item
	 * @throws NoSuchImportJobItemException if a matching import job item could not be found
	 */
	public ImportJobItem findByJ_R(long importJobId, int rowNumber)
		throws NoSuchImportJobItemException;

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or returns <code>null</code> if it could not be found. Uses the finder cache.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	public ImportJobItem fetchByJ_R(long importJobId, int rowNumber);

	/**
	 * Returns the import job item where importJobId = &#63; and rowNumber = &#63; or returns <code>null</code> if it could not be found, optionally using the finder cache.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @param useFinderCache whether to use the finder cache
	 * @return the matching import job item, or <code>null</code> if a matching import job item could not be found
	 */
	public ImportJobItem fetchByJ_R(
		long importJobId, int rowNumber, boolean useFinderCache);

	/**
	 * Removes the import job item where importJobId = &#63; and rowNumber = &#63; from the database.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the import job item that was removed
	 */
	public ImportJobItem removeByJ_R(long importJobId, int rowNumber)
		throws NoSuchImportJobItemException;

	/**
	 * Returns the number of import job items where importJobId = &#63; and rowNumber = &#63;.
	 *
	 * @param importJobId the import job ID
	 * @param rowNumber the row number
	 * @return the number of matching import job items
	 */
	public int countByJ_R(long importJobId, int rowNumber);

	/**
	 * Caches the import job item in the entity cache if it is enabled.
	 *
	 * @param importJobItem the import job item
	 */
	public void cacheResult(ImportJobItem importJobItem);

	/**
	 * Caches the import job items in the entity cache if it is enabled.
	 *
	 * @param importJobItems the import job items
	 */
	public void cacheResult(java.util.List<ImportJobItem> importJobItems);

	/**
	 * Creates a new import job item with the primary key. Does not add the import job item to the database.
	 *
	 * @param importJobItemId the primary key for the new import job item
	 * @return the new import job item
	 */
	public ImportJobItem create(long importJobItemId);

	/**
	 * Removes the import job item with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item that was removed
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	public ImportJobItem remove(long importJobItemId)
		throws NoSuchImportJobItemException;

	public ImportJobItem updateImpl(ImportJobItem importJobItem);

	/**
	 * Returns the import job item with the primary key or throws a <code>NoSuchImportJobItemException</code> if it could not be found.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item
	 * @throws NoSuchImportJobItemException if a import job item with the primary key could not be found
	 */
	public ImportJobItem findByPrimaryKey(long importJobItemId)
		throws NoSuchImportJobItemException;

	/**
	 * Returns the import job item with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item, or <code>null</code> if a import job item with the primary key could not be found
	 */
	public ImportJobItem fetchByPrimaryKey(long importJobItemId);

	/**
	 * Returns all the import job items.
	 *
	 * @return the import job items
	 */
	public java.util.List<ImportJobItem> findAll();

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
	public java.util.List<ImportJobItem> findAll(int start, int end);

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
	public java.util.List<ImportJobItem> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJobItem>
			orderByComparator);

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
	public java.util.List<ImportJobItem> findAll(
		int start, int end,
		com.liferay.portal.kernel.util.OrderByComparator<ImportJobItem>
			orderByComparator,
		boolean useFinderCache);

	/**
	 * Removes all the import job items from the database.
	 */
	public void removeAll();

	/**
	 * Returns the number of import job items.
	 *
	 * @return the number of import job items
	 */
	public int countAll();

}
// LIFERAY-SERVICE-BUILDER-HASH:-852345786