/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.model;

import com.liferay.exportimport.kernel.lar.StagedModelType;
import com.liferay.portal.kernel.model.ModelWrapper;
import com.liferay.portal.kernel.model.wrapper.BaseModelWrapper;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * This class is a wrapper for {@link ImportJob}.
 * </p>
 *
 * @author Nexcent Training
 * @see ImportJob
 * @generated
 */
public class ImportJobWrapper
	extends BaseModelWrapper<ImportJob>
	implements ImportJob, ModelWrapper<ImportJob> {

	public ImportJobWrapper(ImportJob importJob) {
		super(importJob);
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("uuid", getUuid());
		attributes.put("importJobId", getImportJobId());
		attributes.put("groupId", getGroupId());
		attributes.put("companyId", getCompanyId());
		attributes.put("userId", getUserId());
		attributes.put("userName", getUserName());
		attributes.put("createDate", getCreateDate());
		attributes.put("modifiedDate", getModifiedDate());
		attributes.put("jobKey", getJobKey());
		attributes.put("fileName", getFileName());
		attributes.put("status", getStatus());
		attributes.put("totalRows", getTotalRows());
		attributes.put("successRows", getSuccessRows());
		attributes.put("failedRows", getFailedRows());
		attributes.put("errorMessage", getErrorMessage());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		String uuid = (String)attributes.get("uuid");

		if (uuid != null) {
			setUuid(uuid);
		}

		Long importJobId = (Long)attributes.get("importJobId");

		if (importJobId != null) {
			setImportJobId(importJobId);
		}

		Long groupId = (Long)attributes.get("groupId");

		if (groupId != null) {
			setGroupId(groupId);
		}

		Long companyId = (Long)attributes.get("companyId");

		if (companyId != null) {
			setCompanyId(companyId);
		}

		Long userId = (Long)attributes.get("userId");

		if (userId != null) {
			setUserId(userId);
		}

		String userName = (String)attributes.get("userName");

		if (userName != null) {
			setUserName(userName);
		}

		Date createDate = (Date)attributes.get("createDate");

		if (createDate != null) {
			setCreateDate(createDate);
		}

		Date modifiedDate = (Date)attributes.get("modifiedDate");

		if (modifiedDate != null) {
			setModifiedDate(modifiedDate);
		}

		String jobKey = (String)attributes.get("jobKey");

		if (jobKey != null) {
			setJobKey(jobKey);
		}

		String fileName = (String)attributes.get("fileName");

		if (fileName != null) {
			setFileName(fileName);
		}

		String status = (String)attributes.get("status");

		if (status != null) {
			setStatus(status);
		}

		Integer totalRows = (Integer)attributes.get("totalRows");

		if (totalRows != null) {
			setTotalRows(totalRows);
		}

		Integer successRows = (Integer)attributes.get("successRows");

		if (successRows != null) {
			setSuccessRows(successRows);
		}

		Integer failedRows = (Integer)attributes.get("failedRows");

		if (failedRows != null) {
			setFailedRows(failedRows);
		}

		String errorMessage = (String)attributes.get("errorMessage");

		if (errorMessage != null) {
			setErrorMessage(errorMessage);
		}
	}

	@Override
	public ImportJob cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	/**
	 * Returns the company ID of this import job.
	 *
	 * @return the company ID of this import job
	 */
	@Override
	public long getCompanyId() {
		return model.getCompanyId();
	}

	/**
	 * Returns the create date of this import job.
	 *
	 * @return the create date of this import job
	 */
	@Override
	public Date getCreateDate() {
		return model.getCreateDate();
	}

	/**
	 * Returns the error message of this import job.
	 *
	 * @return the error message of this import job
	 */
	@Override
	public String getErrorMessage() {
		return model.getErrorMessage();
	}

	/**
	 * Returns the failed rows of this import job.
	 *
	 * @return the failed rows of this import job
	 */
	@Override
	public int getFailedRows() {
		return model.getFailedRows();
	}

	/**
	 * Returns the file name of this import job.
	 *
	 * @return the file name of this import job
	 */
	@Override
	public String getFileName() {
		return model.getFileName();
	}

	/**
	 * Returns the group ID of this import job.
	 *
	 * @return the group ID of this import job
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the import job ID of this import job.
	 *
	 * @return the import job ID of this import job
	 */
	@Override
	public long getImportJobId() {
		return model.getImportJobId();
	}

	/**
	 * Returns the job key of this import job.
	 *
	 * @return the job key of this import job
	 */
	@Override
	public String getJobKey() {
		return model.getJobKey();
	}

	/**
	 * Returns the modified date of this import job.
	 *
	 * @return the modified date of this import job
	 */
	@Override
	public Date getModifiedDate() {
		return model.getModifiedDate();
	}

	/**
	 * Returns the primary key of this import job.
	 *
	 * @return the primary key of this import job
	 */
	@Override
	public long getPrimaryKey() {
		return model.getPrimaryKey();
	}

	/**
	 * Returns the status of this import job.
	 *
	 * @return the status of this import job
	 */
	@Override
	public String getStatus() {
		return model.getStatus();
	}

	/**
	 * Returns the success rows of this import job.
	 *
	 * @return the success rows of this import job
	 */
	@Override
	public int getSuccessRows() {
		return model.getSuccessRows();
	}

	/**
	 * Returns the total rows of this import job.
	 *
	 * @return the total rows of this import job
	 */
	@Override
	public int getTotalRows() {
		return model.getTotalRows();
	}

	/**
	 * Returns the user ID of this import job.
	 *
	 * @return the user ID of this import job
	 */
	@Override
	public long getUserId() {
		return model.getUserId();
	}

	/**
	 * Returns the user name of this import job.
	 *
	 * @return the user name of this import job
	 */
	@Override
	public String getUserName() {
		return model.getUserName();
	}

	/**
	 * Returns the user uuid of this import job.
	 *
	 * @return the user uuid of this import job
	 */
	@Override
	public String getUserUuid() {
		return model.getUserUuid();
	}

	/**
	 * Returns the uuid of this import job.
	 *
	 * @return the uuid of this import job
	 */
	@Override
	public String getUuid() {
		return model.getUuid();
	}

	@Override
	public void persist() {
		model.persist();
	}

	/**
	 * Sets the company ID of this import job.
	 *
	 * @param companyId the company ID of this import job
	 */
	@Override
	public void setCompanyId(long companyId) {
		model.setCompanyId(companyId);
	}

	/**
	 * Sets the create date of this import job.
	 *
	 * @param createDate the create date of this import job
	 */
	@Override
	public void setCreateDate(Date createDate) {
		model.setCreateDate(createDate);
	}

	/**
	 * Sets the error message of this import job.
	 *
	 * @param errorMessage the error message of this import job
	 */
	@Override
	public void setErrorMessage(String errorMessage) {
		model.setErrorMessage(errorMessage);
	}

	/**
	 * Sets the failed rows of this import job.
	 *
	 * @param failedRows the failed rows of this import job
	 */
	@Override
	public void setFailedRows(int failedRows) {
		model.setFailedRows(failedRows);
	}

	/**
	 * Sets the file name of this import job.
	 *
	 * @param fileName the file name of this import job
	 */
	@Override
	public void setFileName(String fileName) {
		model.setFileName(fileName);
	}

	/**
	 * Sets the group ID of this import job.
	 *
	 * @param groupId the group ID of this import job
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	/**
	 * Sets the import job ID of this import job.
	 *
	 * @param importJobId the import job ID of this import job
	 */
	@Override
	public void setImportJobId(long importJobId) {
		model.setImportJobId(importJobId);
	}

	/**
	 * Sets the job key of this import job.
	 *
	 * @param jobKey the job key of this import job
	 */
	@Override
	public void setJobKey(String jobKey) {
		model.setJobKey(jobKey);
	}

	/**
	 * Sets the modified date of this import job.
	 *
	 * @param modifiedDate the modified date of this import job
	 */
	@Override
	public void setModifiedDate(Date modifiedDate) {
		model.setModifiedDate(modifiedDate);
	}

	/**
	 * Sets the primary key of this import job.
	 *
	 * @param primaryKey the primary key of this import job
	 */
	@Override
	public void setPrimaryKey(long primaryKey) {
		model.setPrimaryKey(primaryKey);
	}

	/**
	 * Sets the status of this import job.
	 *
	 * @param status the status of this import job
	 */
	@Override
	public void setStatus(String status) {
		model.setStatus(status);
	}

	/**
	 * Sets the success rows of this import job.
	 *
	 * @param successRows the success rows of this import job
	 */
	@Override
	public void setSuccessRows(int successRows) {
		model.setSuccessRows(successRows);
	}

	/**
	 * Sets the total rows of this import job.
	 *
	 * @param totalRows the total rows of this import job
	 */
	@Override
	public void setTotalRows(int totalRows) {
		model.setTotalRows(totalRows);
	}

	/**
	 * Sets the user ID of this import job.
	 *
	 * @param userId the user ID of this import job
	 */
	@Override
	public void setUserId(long userId) {
		model.setUserId(userId);
	}

	/**
	 * Sets the user name of this import job.
	 *
	 * @param userName the user name of this import job
	 */
	@Override
	public void setUserName(String userName) {
		model.setUserName(userName);
	}

	/**
	 * Sets the user uuid of this import job.
	 *
	 * @param userUuid the user uuid of this import job
	 */
	@Override
	public void setUserUuid(String userUuid) {
		model.setUserUuid(userUuid);
	}

	/**
	 * Sets the uuid of this import job.
	 *
	 * @param uuid the uuid of this import job
	 */
	@Override
	public void setUuid(String uuid) {
		model.setUuid(uuid);
	}

	@Override
	public String toXmlString() {
		return model.toXmlString();
	}

	@Override
	public StagedModelType getStagedModelType() {
		return model.getStagedModelType();
	}

	@Override
	protected ImportJobWrapper wrap(ImportJob importJob) {
		return new ImportJobWrapper(importJob);
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:-2060537710