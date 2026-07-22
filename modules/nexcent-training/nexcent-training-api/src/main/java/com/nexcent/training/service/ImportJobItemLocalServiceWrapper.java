/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service;

import com.liferay.portal.kernel.service.ServiceWrapper;
import com.liferay.portal.kernel.service.persistence.BasePersistence;

/**
 * Provides a wrapper for {@link ImportJobItemLocalService}.
 *
 * @author Nexcent Training
 * @see ImportJobItemLocalService
 * @generated
 */
public class ImportJobItemLocalServiceWrapper
	implements ImportJobItemLocalService,
			   ServiceWrapper<ImportJobItemLocalService> {

	public ImportJobItemLocalServiceWrapper() {
		this(null);
	}

	public ImportJobItemLocalServiceWrapper(
		ImportJobItemLocalService importJobItemLocalService) {

		_importJobItemLocalService = importJobItemLocalService;
	}

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
	@Override
	public com.nexcent.training.model.ImportJobItem addImportJobItem(
		com.nexcent.training.model.ImportJobItem importJobItem) {

		return _importJobItemLocalService.addImportJobItem(importJobItem);
	}

	@Override
	public com.nexcent.training.model.ImportJobItem addImportJobItem(
		long companyId, long groupId, long importJobId, int rowNumber,
		String targetType, String targetERC, String sheetName, String locale,
		String operation, String result, String severity, String messageCode,
		String message, String payloadHash) {

		return _importJobItemLocalService.addImportJobItem(
			companyId, groupId, importJobId, rowNumber, targetType, targetERC,
			sheetName, locale, operation, result, severity, messageCode,
			message, payloadHash);
	}

	/**
	 * Creates a new import job item with the primary key. Does not add the import job item to the database.
	 *
	 * @param importJobItemId the primary key for the new import job item
	 * @return the new import job item
	 */
	@Override
	public com.nexcent.training.model.ImportJobItem createImportJobItem(
		long importJobItemId) {

		return _importJobItemLocalService.createImportJobItem(importJobItemId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel createPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobItemLocalService.createPersistedModel(primaryKeyObj);
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
	@Override
	public com.nexcent.training.model.ImportJobItem deleteImportJobItem(
		com.nexcent.training.model.ImportJobItem importJobItem) {

		return _importJobItemLocalService.deleteImportJobItem(importJobItem);
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
	@Override
	public com.nexcent.training.model.ImportJobItem deleteImportJobItem(
			long importJobItemId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobItemLocalService.deleteImportJobItem(importJobItemId);
	}

	@Override
	public void deleteImportJobItems(long importJobId) {
		_importJobItemLocalService.deleteImportJobItems(importJobId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel deletePersistedModel(
			com.liferay.portal.kernel.model.PersistedModel persistedModel)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobItemLocalService.deletePersistedModel(persistedModel);
	}

	@Override
	public <T> T dslQuery(com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {
		return _importJobItemLocalService.dslQuery(dslQuery);
	}

	@Override
	public int dslQueryCount(
		com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {

		return _importJobItemLocalService.dslQueryCount(dslQuery);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery() {
		return _importJobItemLocalService.dynamicQuery();
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

		return _importJobItemLocalService.dynamicQuery(dynamicQuery);
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
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery, int start,
		int end) {

		return _importJobItemLocalService.dynamicQuery(
			dynamicQuery, start, end);
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
	@Override
	public <T> java.util.List<T> dynamicQuery(
		com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery, int start,
		int end,
		com.liferay.portal.kernel.util.OrderByComparator<T> orderByComparator) {

		return _importJobItemLocalService.dynamicQuery(
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

		return _importJobItemLocalService.dynamicQueryCount(dynamicQuery);
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

		return _importJobItemLocalService.dynamicQueryCount(
			dynamicQuery, projection);
	}

	@Override
	public com.nexcent.training.model.ImportJobItem fetchImportJobItem(
		long importJobItemId) {

		return _importJobItemLocalService.fetchImportJobItem(importJobItemId);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery
		getActionableDynamicQuery() {

		return _importJobItemLocalService.getActionableDynamicQuery();
	}

	/**
	 * Returns the import job item with the primary key.
	 *
	 * @param importJobItemId the primary key of the import job item
	 * @return the import job item
	 * @throws PortalException if a import job item with the primary key could not be found
	 */
	@Override
	public com.nexcent.training.model.ImportJobItem getImportJobItem(
			long importJobItemId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobItemLocalService.getImportJobItem(importJobItemId);
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
	@Override
	public java.util.List<com.nexcent.training.model.ImportJobItem>
		getImportJobItems(int start, int end) {

		return _importJobItemLocalService.getImportJobItems(start, end);
	}

	@Override
	public java.util.List<com.nexcent.training.model.ImportJobItem>
		getImportJobItems(long importJobId, int start, int end) {

		return _importJobItemLocalService.getImportJobItems(
			importJobId, start, end);
	}

	/**
	 * Returns the number of import job items.
	 *
	 * @return the number of import job items
	 */
	@Override
	public int getImportJobItemsCount() {
		return _importJobItemLocalService.getImportJobItemsCount();
	}

	@Override
	public int getImportJobItemsCount(long importJobId) {
		return _importJobItemLocalService.getImportJobItemsCount(importJobId);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.IndexableActionableDynamicQuery
		getIndexableActionableDynamicQuery() {

		return _importJobItemLocalService.getIndexableActionableDynamicQuery();
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return _importJobItemLocalService.getOSGiServiceIdentifier();
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel getPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobItemLocalService.getPersistedModel(primaryKeyObj);
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
	@Override
	public com.nexcent.training.model.ImportJobItem updateImportJobItem(
		com.nexcent.training.model.ImportJobItem importJobItem) {

		return _importJobItemLocalService.updateImportJobItem(importJobItem);
	}

	@Override
	public com.nexcent.training.model.ImportJobItem updateImportJobItemResult(
			long importJobItemId, String result, String severity,
			String messageCode, String message)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobItemLocalService.updateImportJobItemResult(
			importJobItemId, result, severity, messageCode, message);
	}

	@Override
	public BasePersistence<?> getBasePersistence() {
		return _importJobItemLocalService.getBasePersistence();
	}

	@Override
	public ImportJobItemLocalService getWrappedService() {
		return _importJobItemLocalService;
	}

	@Override
	public void setWrappedService(
		ImportJobItemLocalService importJobItemLocalService) {

		_importJobItemLocalService = importJobItemLocalService;
	}

	private ImportJobItemLocalService _importJobItemLocalService;

}
// LIFERAY-SERVICE-BUILDER-HASH:-116445173