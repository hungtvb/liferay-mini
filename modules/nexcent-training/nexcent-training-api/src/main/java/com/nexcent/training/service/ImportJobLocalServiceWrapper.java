/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service;

import com.liferay.portal.kernel.service.ServiceWrapper;
import com.liferay.portal.kernel.service.persistence.BasePersistence;

/**
 * Provides a wrapper for {@link ImportJobLocalService}.
 *
 * @author Nexcent Training
 * @see ImportJobLocalService
 * @generated
 */
public class ImportJobLocalServiceWrapper
	implements ImportJobLocalService, ServiceWrapper<ImportJobLocalService> {

	public ImportJobLocalServiceWrapper() {
		this(null);
	}

	public ImportJobLocalServiceWrapper(
		ImportJobLocalService importJobLocalService) {

		_importJobLocalService = importJobLocalService;
	}

	/**
	 * Adds the import job to the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJob the import job
	 * @return the import job that was added
	 */
	@Override
	public com.nexcent.training.model.ImportJob addImportJob(
		com.nexcent.training.model.ImportJob importJob) {

		return _importJobLocalService.addImportJob(importJob);
	}

	/**
	 * Creates a new import job with the primary key. Does not add the import job to the database.
	 *
	 * @param importJobId the primary key for the new import job
	 * @return the new import job
	 */
	@Override
	public com.nexcent.training.model.ImportJob createImportJob(
		long importJobId) {

		return _importJobLocalService.createImportJob(importJobId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel createPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobLocalService.createPersistedModel(primaryKeyObj);
	}

	/**
	 * Deletes the import job from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJob the import job
	 * @return the import job that was removed
	 */
	@Override
	public com.nexcent.training.model.ImportJob deleteImportJob(
		com.nexcent.training.model.ImportJob importJob) {

		return _importJobLocalService.deleteImportJob(importJob);
	}

	/**
	 * Deletes the import job with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job that was removed
	 * @throws PortalException if a import job with the primary key could not be found
	 */
	@Override
	public com.nexcent.training.model.ImportJob deleteImportJob(
			long importJobId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobLocalService.deleteImportJob(importJobId);
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel deletePersistedModel(
			com.liferay.portal.kernel.model.PersistedModel persistedModel)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobLocalService.deletePersistedModel(persistedModel);
	}

	@Override
	public <T> T dslQuery(com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {
		return _importJobLocalService.dslQuery(dslQuery);
	}

	@Override
	public int dslQueryCount(
		com.liferay.petra.sql.dsl.query.DSLQuery dslQuery) {

		return _importJobLocalService.dslQueryCount(dslQuery);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.DynamicQuery dynamicQuery() {
		return _importJobLocalService.dynamicQuery();
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

		return _importJobLocalService.dynamicQuery(dynamicQuery);
	}

	/**
	 * Performs a dynamic query on the database and returns a range of the matching rows.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
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

		return _importJobLocalService.dynamicQuery(dynamicQuery, start, end);
	}

	/**
	 * Performs a dynamic query on the database and returns an ordered range of the matching rows.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
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

		return _importJobLocalService.dynamicQuery(
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

		return _importJobLocalService.dynamicQueryCount(dynamicQuery);
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

		return _importJobLocalService.dynamicQueryCount(
			dynamicQuery, projection);
	}

	@Override
	public com.nexcent.training.model.ImportJob fetchImportJob(
		long importJobId) {

		return _importJobLocalService.fetchImportJob(importJobId);
	}

	/**
	 * Returns the import job matching the UUID and group.
	 *
	 * @param uuid the import job's UUID
	 * @param groupId the primary key of the group
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	@Override
	public com.nexcent.training.model.ImportJob fetchImportJobByUuidAndGroupId(
		String uuid, long groupId) {

		return _importJobLocalService.fetchImportJobByUuidAndGroupId(
			uuid, groupId);
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery
		getActionableDynamicQuery() {

		return _importJobLocalService.getActionableDynamicQuery();
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.ExportActionableDynamicQuery
		getExportActionableDynamicQuery(
			com.liferay.exportimport.kernel.lar.PortletDataContext
				portletDataContext) {

		return _importJobLocalService.getExportActionableDynamicQuery(
			portletDataContext);
	}

	/**
	 * Returns the import job with the primary key.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job
	 * @throws PortalException if a import job with the primary key could not be found
	 */
	@Override
	public com.nexcent.training.model.ImportJob getImportJob(long importJobId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobLocalService.getImportJob(importJobId);
	}

	/**
	 * Returns the import job matching the UUID and group.
	 *
	 * @param uuid the import job's UUID
	 * @param groupId the primary key of the group
	 * @return the matching import job
	 * @throws PortalException if a matching import job could not be found
	 */
	@Override
	public com.nexcent.training.model.ImportJob getImportJobByUuidAndGroupId(
			String uuid, long groupId)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobLocalService.getImportJobByUuidAndGroupId(
			uuid, groupId);
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
	@Override
	public java.util.List<com.nexcent.training.model.ImportJob> getImportJobs(
		int start, int end) {

		return _importJobLocalService.getImportJobs(start, end);
	}

	/**
	 * Returns all the import jobs matching the UUID and company.
	 *
	 * @param uuid the UUID of the import jobs
	 * @param companyId the primary key of the company
	 * @return the matching import jobs, or an empty list if no matches were found
	 */
	@Override
	public java.util.List<com.nexcent.training.model.ImportJob>
		getImportJobsByUuidAndCompanyId(String uuid, long companyId) {

		return _importJobLocalService.getImportJobsByUuidAndCompanyId(
			uuid, companyId);
	}

	/**
	 * Returns a range of import jobs matching the UUID and company.
	 *
	 * @param uuid the UUID of the import jobs
	 * @param companyId the primary key of the company
	 * @param start the lower bound of the range of import jobs
	 * @param end the upper bound of the range of import jobs (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the range of matching import jobs, or an empty list if no matches were found
	 */
	@Override
	public java.util.List<com.nexcent.training.model.ImportJob>
		getImportJobsByUuidAndCompanyId(
			String uuid, long companyId, int start, int end,
			com.liferay.portal.kernel.util.OrderByComparator
				<com.nexcent.training.model.ImportJob> orderByComparator) {

		return _importJobLocalService.getImportJobsByUuidAndCompanyId(
			uuid, companyId, start, end, orderByComparator);
	}

	/**
	 * Returns the number of import jobs.
	 *
	 * @return the number of import jobs
	 */
	@Override
	public int getImportJobsCount() {
		return _importJobLocalService.getImportJobsCount();
	}

	@Override
	public com.liferay.portal.kernel.dao.orm.IndexableActionableDynamicQuery
		getIndexableActionableDynamicQuery() {

		return _importJobLocalService.getIndexableActionableDynamicQuery();
	}

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	@Override
	public String getOSGiServiceIdentifier() {
		return _importJobLocalService.getOSGiServiceIdentifier();
	}

	/**
	 * @throws PortalException
	 */
	@Override
	public com.liferay.portal.kernel.model.PersistedModel getPersistedModel(
			java.io.Serializable primaryKeyObj)
		throws com.liferay.portal.kernel.exception.PortalException {

		return _importJobLocalService.getPersistedModel(primaryKeyObj);
	}

	/**
	 * Updates the import job in the database or adds it if it does not yet exist. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJob the import job
	 * @return the import job that was updated
	 */
	@Override
	public com.nexcent.training.model.ImportJob updateImportJob(
		com.nexcent.training.model.ImportJob importJob) {

		return _importJobLocalService.updateImportJob(importJob);
	}

	@Override
	public BasePersistence<?> getBasePersistence() {
		return _importJobLocalService.getBasePersistence();
	}

	@Override
	public ImportJobLocalService getWrappedService() {
		return _importJobLocalService;
	}

	@Override
	public void setWrappedService(ImportJobLocalService importJobLocalService) {
		_importJobLocalService = importJobLocalService;
	}

	private ImportJobLocalService _importJobLocalService;

}
// LIFERAY-SERVICE-BUILDER-HASH:-1298389577