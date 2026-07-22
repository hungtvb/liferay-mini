/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.service;

import com.liferay.exportimport.kernel.lar.PortletDataContext;
import com.liferay.petra.sql.dsl.query.DSLQuery;
import com.liferay.portal.kernel.dao.orm.ActionableDynamicQuery;
import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.dao.orm.ExportActionableDynamicQuery;
import com.liferay.portal.kernel.dao.orm.IndexableActionableDynamicQuery;
import com.liferay.portal.kernel.dao.orm.Projection;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.exception.SystemException;
import com.liferay.portal.kernel.model.PersistedModel;
import com.liferay.portal.kernel.search.Indexable;
import com.liferay.portal.kernel.search.IndexableType;
import com.liferay.portal.kernel.service.BaseLocalService;
import com.liferay.portal.kernel.service.PersistedModelLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.transaction.Isolation;
import com.liferay.portal.kernel.transaction.Propagation;
import com.liferay.portal.kernel.transaction.Transactional;
import com.liferay.portal.kernel.util.OrderByComparator;

import com.nexcent.training.model.ImportJob;

import java.io.Serializable;

import java.util.List;

import org.osgi.annotation.versioning.ProviderType;

/**
 * Provides the local service interface for ImportJob. Methods of this
 * service will not have security checks based on the propagated JAAS
 * credentials because this service can only be accessed from within the same
 * VM.
 *
 * @author Nexcent Training
 * @see ImportJobLocalServiceUtil
 * @generated
 */
@ProviderType
@Transactional(
	isolation = Isolation.PORTAL,
	rollbackFor = {PortalException.class, SystemException.class}
)
public interface ImportJobLocalService
	extends BaseLocalService, PersistedModelLocalService {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this interface directly. Add custom service methods to <code>com.nexcent.training.service.impl.ImportJobLocalServiceImpl</code> and rerun ServiceBuilder to automatically copy the method declarations to this interface. Consume the import job local service via injection or a <code>org.osgi.util.tracker.ServiceTracker</code>. Use {@link ImportJobLocalServiceUtil} if injection and service tracking are not available.
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
	@Indexable(type = IndexableType.REINDEX)
	public ImportJob addImportJob(ImportJob importJob);

	public ImportJob addOrResetImportJob(
			long userId, long groupId, String externalReferenceCode,
			long fileEntryId, String fileName, String sha256,
			String importProfileKey, String packageSchemaVersion,
			String structureERC, ServiceContext serviceContext)
		throws PortalException;

	/**
	 * Creates a new import job with the primary key. Does not add the import job to the database.
	 *
	 * @param importJobId the primary key for the new import job
	 * @return the new import job
	 */
	@Transactional(enabled = false)
	public ImportJob createImportJob(long importJobId);

	/**
	 * @throws PortalException
	 */
	public PersistedModel createPersistedModel(Serializable primaryKeyObj)
		throws PortalException;

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
	@Indexable(type = IndexableType.DELETE)
	public ImportJob deleteImportJob(ImportJob importJob);

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
	@Indexable(type = IndexableType.DELETE)
	public ImportJob deleteImportJob(long importJobId) throws PortalException;

	/**
	 * @throws PortalException
	 */
	@Override
	public PersistedModel deletePersistedModel(PersistedModel persistedModel)
		throws PortalException;

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public <T> T dslQuery(DSLQuery dslQuery);

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public int dslQueryCount(DSLQuery dslQuery);

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public DynamicQuery dynamicQuery();

	/**
	 * Performs a dynamic query on the database and returns the matching rows.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the matching rows
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public <T> List<T> dynamicQuery(DynamicQuery dynamicQuery);

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
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public <T> List<T> dynamicQuery(
		DynamicQuery dynamicQuery, int start, int end);

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
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public <T> List<T> dynamicQuery(
		DynamicQuery dynamicQuery, int start, int end,
		OrderByComparator<T> orderByComparator);

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @return the number of rows matching the dynamic query
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public long dynamicQueryCount(DynamicQuery dynamicQuery);

	/**
	 * Returns the number of rows matching the dynamic query.
	 *
	 * @param dynamicQuery the dynamic query
	 * @param projection the projection to apply to the query
	 * @return the number of rows matching the dynamic query
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public long dynamicQueryCount(
		DynamicQuery dynamicQuery, Projection projection);

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public ImportJob fetchImportJob(long importJobId);

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public ImportJob fetchImportJob(long groupId, String externalReferenceCode);

	/**
	 * Returns the import job matching the UUID and group.
	 *
	 * @param uuid the import job's UUID
	 * @param groupId the primary key of the group
	 * @return the matching import job, or <code>null</code> if a matching import job could not be found
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public ImportJob fetchImportJobByUuidAndGroupId(String uuid, long groupId);

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public ActionableDynamicQuery getActionableDynamicQuery();

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public ExportActionableDynamicQuery getExportActionableDynamicQuery(
		PortletDataContext portletDataContext);

	/**
	 * Returns the import job with the primary key.
	 *
	 * @param importJobId the primary key of the import job
	 * @return the import job
	 * @throws PortalException if a import job with the primary key could not be found
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public ImportJob getImportJob(long importJobId) throws PortalException;

	/**
	 * Returns the import job matching the UUID and group.
	 *
	 * @param uuid the import job's UUID
	 * @param groupId the primary key of the group
	 * @return the matching import job
	 * @throws PortalException if a matching import job could not be found
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public ImportJob getImportJobByUuidAndGroupId(String uuid, long groupId)
		throws PortalException;

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
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public List<ImportJob> getImportJobs(int start, int end);

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public List<ImportJob> getImportJobs(long groupId, int start, int end);

	/**
	 * Returns all the import jobs matching the UUID and company.
	 *
	 * @param uuid the UUID of the import jobs
	 * @param companyId the primary key of the company
	 * @return the matching import jobs, or an empty list if no matches were found
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public List<ImportJob> getImportJobsByUuidAndCompanyId(
		String uuid, long companyId);

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
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public List<ImportJob> getImportJobsByUuidAndCompanyId(
		String uuid, long companyId, int start, int end,
		OrderByComparator<ImportJob> orderByComparator);

	/**
	 * Returns the number of import jobs.
	 *
	 * @return the number of import jobs
	 */
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public int getImportJobsCount();

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public int getImportJobsCount(long groupId);

	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public IndexableActionableDynamicQuery getIndexableActionableDynamicQuery();

	/**
	 * Returns the OSGi service identifier.
	 *
	 * @return the OSGi service identifier
	 */
	public String getOSGiServiceIdentifier();

	/**
	 * @throws PortalException
	 */
	@Override
	@Transactional(propagation = Propagation.SUPPORTS, readOnly = true)
	public PersistedModel getPersistedModel(Serializable primaryKeyObj)
		throws PortalException;

	public ImportJob transitionImportJob(
			long importJobId, String expectedStatus, String newStatus)
		throws PortalException;

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
	@Indexable(type = IndexableType.REINDEX)
	public ImportJob updateImportJob(ImportJob importJob);

	public ImportJob updateImportJobResult(
			long importJobId, String status, int totalRows, int createdRows,
			int updatedRows, int skippedRows, int failedRows,
			String errorMessage, boolean completed)
		throws PortalException;

}
// LIFERAY-SERVICE-BUILDER-HASH:-946682899