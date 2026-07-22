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

import com.nexcent.training.model.ImportJob;

import java.io.Serializable;

import java.util.List;

/**
 * Provides the local service utility for ImportJob. This utility wraps
 * <code>com.nexcent.training.service.impl.ImportJobLocalServiceImpl</code> and
 * is an access point for service operations in application layer code running
 * on the local server. Methods of this service will not have security checks
 * based on the propagated JAAS credentials because this service can only be
 * accessed from within the same VM.
 *
 * @author Nexcent Training
 * @see ImportJobLocalService
 * @generated
 */
public class ImportJobLocalServiceUtil {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Add custom service methods to <code>com.nexcent.training.service.impl.ImportJobLocalServiceImpl</code> and rerun ServiceBuilder to regenerate this class.
	 */

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
	public static ImportJob addImportJob(ImportJob importJob) {
		return getService().addImportJob(importJob);
	}

	public static ImportJob addOrResetImportJob(
			long userId, long groupId, String externalReferenceCode,
			long fileEntryId, String fileName, String sha256,
			String importProfileKey, String packageSchemaVersion,
			String structureERC,
			com.liferay.portal.kernel.service.ServiceContext serviceContext)
		throws PortalException {

		return getService().addOrResetImportJob(
			userId, groupId, externalReferenceCode, fileEntryId, fileName,
			sha256, importProfileKey, packageSchemaVersion, structureERC,
			serviceContext);
	}

	/**
	 * Creates a new import job with the primary key. Does not add the import job to the database.
	 *
	 * @param importJobId the primary key for the new import job
	 * @return the new import job
	 */
	public static ImportJob createImportJob(long importJobId) {
		return getService().createImportJob(importJobId);
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
	 * Deletes the import job from the database. Also notifies the appropriate model listeners.
	 *
	 * <p>
	 * <strong>Important:</strong> Inspect ImportJobLocalServiceImpl for overloaded versions of the method. If provided, use these entry points to the API, as the implementation logic may require the additional parameters defined there.
	 * </p>
	 *
	 * @param importJob the import job
	 * @return the import job that was removed
	 */
	public static ImportJob deleteImportJob(ImportJob importJob) {
		return getService().deleteImportJob(importJob);
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
	public static ImportJob deleteImportJob(long importJobId)
		throws PortalException {

		return getService().deleteImportJob(importJobId);
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
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
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
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>com.liferay.portal.kernel.dao.orm.QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>com.nexcent.training.model.impl.ImportJobModelImpl</code>.
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

	public static ImportJob fetchImportJob(long importJobId) {
		return getService().fetchImportJob(importJobId);
	}

	public static ImportJob fetchImportJob(
		long groupId, String externalReferenceCode) {

		return getService().fetchImportJob(groupId, externalReferenceCode);
	}

	/**
	 * Returns the import job matching the UUID and group.
	 *
	 * @param uuid the import job's UUID
	 * @param groupId the primary key of the group
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	public static ImportJob fetchImportJobByUuidAndGroupId(
		String uuid, long groupId) {

		return getService().fetchImportJobByUuidAndGroupId(uuid, groupId);
	}

	public static com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery
		getActionableDynamicQuery() {

		return getService().getActionableDynamicQuery();
	}

	public static com.liferay.portal.kernel.dao.orm.ExportActionableDynamicQuery
		getExportActionableDynamicQuery(
			com.liferay.exportimport.kernel.lar.PortletDataContext
				portletDataContext) {

		return getService().getExportActionableDynamicQuery(portletDataContext);
	}

	/**
	 * Returns the import job with the primary key.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job
	 * @throws PortalException if a import job with the primary key could not be found
	 */
	public static ImportJob getImportJob(long importJobId)
		throws PortalException {

		return getService().getImportJob(importJobId);
	}

	/**
	 * Returns the import job matching the UUID and group.
	 *
	 * @param uuid the import job's UUID
	 * @param groupId the primary key of the group
	 * @return the matching import job
	 * @throws PortalException if a matching import job could not be found
	 */
	public static ImportJob getImportJobByUuidAndGroupId(
			String uuid, long groupId)
		throws PortalException {

		return getService().getImportJobByUuidAndGroupId(uuid, groupId);
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
	public static List<ImportJob> getImportJobs(int start, int end) {
		return getService().getImportJobs(start, end);
	}

	public static List<ImportJob> getImportJobs(
		long groupId, int start, int end) {

		return getService().getImportJobs(groupId, start, end);
	}

	/**
	 * Returns all the import jobs matching the UUID and company.
	 *
	 * @param uuid the UUID of the import jobs
	 * @param companyId the primary key of the company
	 * @return the matching import jobs, or an empty list if no matches were found
	 */
	public static List<ImportJob> getImportJobsByUuidAndCompanyId(
		String uuid, long companyId) {

		return getService().getImportJobsByUuidAndCompanyId(uuid, companyId);
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
	public static List<ImportJob> getImportJobsByUuidAndCompanyId(
		String uuid, long companyId, int start, int end,
		OrderByComparator<ImportJob> orderByComparator) {

		return getService().getImportJobsByUuidAndCompanyId(
			uuid, companyId, start, end, orderByComparator);
	}

	/**
	 * Returns the number of import jobs.
	 *
	 * @return the number of import jobs
	 */
	public static int getImportJobsCount() {
		return getService().getImportJobsCount();
	}

	public static int getImportJobsCount(long groupId) {
		return getService().getImportJobsCount(groupId);
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

	public static ImportJob transitionImportJob(
			long importJobId, String expectedStatus, String newStatus)
		throws PortalException {

		return getService().transitionImportJob(
			importJobId, expectedStatus, newStatus);
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
	public static ImportJob updateImportJob(ImportJob importJob) {
		return getService().updateImportJob(importJob);
	}

	public static ImportJob updateImportJobResult(
			long importJobId, String status, int totalRows, int createdRows,
			int updatedRows, int skippedRows, int failedRows,
			String errorMessage, boolean completed)
		throws PortalException {

		return getService().updateImportJobResult(
			importJobId, status, totalRows, createdRows, updatedRows,
			skippedRows, failedRows, errorMessage, completed);
	}

	public static ImportJobLocalService getService() {
		return _serviceSnapshot.get();
	}

	private static final Snapshot<ImportJobLocalService> _serviceSnapshot =
		new Snapshot<>(
			ImportJobLocalServiceUtil.class, ImportJobLocalService.class);

}
// LIFERAY-SERVICE-BUILDER-HASH:978266069