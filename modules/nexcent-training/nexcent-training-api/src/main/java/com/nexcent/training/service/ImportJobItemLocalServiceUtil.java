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

import com.nexcent.training.model.ImportJobItem;

import java.io.Serializable;

import java.util.List;

/**
 * Provides the local service utility for ImportJobItem. This utility wraps
 * <code>com.nexcent.training.service.impl.ImportJobItemLocalServiceImpl</code> and
 * is an access point for service operations in application layer code running
 * on the local server. Methods of this service will not have security checks
 * based on the propagated JAAS credentials because this service can only be
 * accessed from within the same VM.
 *
 * @author Nexcent Training
 * @see ImportJobItemLocalService
 * @generated
 */
public class ImportJobItemLocalServiceUtil {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Add custom service methods to <code>com.nexcent.training.service.impl.ImportJobItemLocalServiceImpl</code> and rerun ServiceBuilder to regenerate this class.
	 */

	/**
	 * Adds the import job item to the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobItemLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJobItem the import job item
	 * @return the import job item that was added
	 */
	public static ImportJobItem addImportJobItem(ImportJobItem importJobItem) {
		return getService().addImportJobItem(importJobItem);
	}

	public static ImportJobItem addImportJobItem(
		long companyId, long groupId, long importJobId, int rowNumber,
		String articleERC, String locale, String operation, String result,
		String severity, String messageCode, String message,
		String payloadHash) {

		return getService().addImportJobItem(
			companyId, groupId, importJobId, rowNumber, articleERC, locale,
			operation, result, severity, messageCode, message, payloadHash);
	}

	/**
	 * Creates a new import job item with the primary key. Does not add the import job item to the database.
	 *
	 * @param importJobItemId the primary key for the new import job item
	 * @return the new import job item
	 */
	public static ImportJobItem createImportJobItem(long importJobItemId) {
		return getService().createImportJobItem(importJobItemId);
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
	 * Deletes the import job item from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobItemLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJobItem the import job item
	 * @return the import job item that was removed
	 */
	public static ImportJobItem deleteImportJobItem(
		ImportJobItem importJobItem) {

		return getService().deleteImportJobItem(importJobItem);
	}

	/**
	 * Deletes the import job item with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobItemLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item that was removed
	 * @throws PortalException if a import job item with the primary key could not be found
	 */
	public static ImportJobItem deleteImportJobItem(long importJobItemId)
		throws PortalException {

		return getService().deleteImportJobItem(importJobItemId);
	}

	public static void deleteImportJobItems(long importJobId) {
		getService().deleteImportJobItems(importJobId);
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
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobItemModelImpl</code>.
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
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobItemModelImpl</code>.
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

	public static ImportJobItem fetchImportJobItem(long importJobItemId) {
		return getService().fetchImportJobItem(importJobItemId);
	}

	public static com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery
		getActionableDynamicQuery() {

		return getService().getActionableDynamicQuery();
	}

	/**
	 * Returns the import job item with the primary key.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item
	 * @throws PortalException if a import job item with the primary key could not be found
	 */
	public static ImportJobItem getImportJobItem(long importJobItemId)
		throws PortalException {

		return getService().getImportJobItem(importJobItemId);
	}

	/**
	 * Returns a range of all the import job items.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobItemModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of import job items
	 * @param end the upper bound of the range of import job items (not inclusive)
	 * @return the range of import job items
	 */
	public static List<ImportJobItem> getImportJobItems(int start, int end) {
		return getService().getImportJobItems(start, end);
	}

	public static List<ImportJobItem> getImportJobItems(
		long importJobId, int start, int end) {

		return getService().getImportJobItems(importJobId, start, end);
	}

	/**
	 * Returns the number of import job items.
	 *
	 * @return the number of import job items
	 */
	public static int getImportJobItemsCount() {
		return getService().getImportJobItemsCount();
	}

	public static int getImportJobItemsCount(long importJobId) {
		return getService().getImportJobItemsCount(importJobId);
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
	 * Updates the import job item in the database or adds it if it does not yet exist. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobItemLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJobItem the import job item
	 * @return the import job item that was updated
	 */
	public static ImportJobItem updateImportJobItem(
		ImportJobItem importJobItem) {

		return getService().updateImportJobItem(importJobItem);
	}

	public static ImportJobItem updateImportJobItemResult(
			long importJobItemId, String result, String severity,
			String messageCode, String message)
		throws PortalException {

		return getService().updateImportJobItemResult(
			importJobItemId, result, severity, messageCode, message);
	}

	public static ImportJobItemLocalService getService() {
		return _serviceSnapshot.get();
	}

	private static final Snapshot<ImportJobItemLocalService> _serviceSnapshot =
		new Snapshot<>(
			ImportJobItemLocalServiceUtil.class,
			ImportJobItemLocalService.class);

}
// LIFERAY-SERVICE-BUILDER-HASH:928877822