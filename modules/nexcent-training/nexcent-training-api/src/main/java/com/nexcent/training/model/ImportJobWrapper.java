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
		attributes.put("fileEntryId", getFileEntryId());
		attributes.put("fileName", getFileName());
		attributes.put("sha256", getSha256());
		attributes.put("importProfileKey", getImportProfileKey());
		attributes.put("packageSchemaVersion", getPackageSchemaVersion());
		attributes.put("structureERC", getStructureERC());
		attributes.put("status", getStatus());
		attributes.put("totalRows", getTotalRows());
		attributes.put("createdRows", getCreatedRows());
		attributes.put("updatedRows", getUpdatedRows());
		attributes.put("skippedRows", getSkippedRows());
		attributes.put("failedRows", getFailedRows());
		attributes.put("startedDate", getStartedDate());
		attributes.put("completedDate", getCompletedDate());
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

		Long fileEntryId = (Long)attributes.get("fileEntryId");

		if (fileEntryId != null) {
			setFileEntryId(fileEntryId);
		}

		String fileName = (String)attributes.get("fileName");

		if (fileName != null) {
			setFileName(fileName);
		}

		String sha256 = (String)attributes.get("sha256");

		if (sha256 != null) {
			setSha256(sha256);
		}

		String importProfileKey = (String)attributes.get("importProfileKey");

		if (importProfileKey != null) {
			setImportProfileKey(importProfileKey);
		}

		String packageSchemaVersion = (String)attributes.get(
			"packageSchemaVersion");

		if (packageSchemaVersion != null) {
			setPackageSchemaVersion(packageSchemaVersion);
		}

		String structureERC = (String)attributes.get("structureERC");

		if (structureERC != null) {
			setStructureERC(structureERC);
		}

		String status = (String)attributes.get("status");

		if (status != null) {
			setStatus(status);
		}

		Integer totalRows = (Integer)attributes.get("totalRows");

		if (totalRows != null) {
			setTotalRows(totalRows);
		}

		Integer createdRows = (Integer)attributes.get("createdRows");

		if (createdRows != null) {
			setCreatedRows(createdRows);
		}

		Integer updatedRows = (Integer)attributes.get("updatedRows");

		if (updatedRows != null) {
			setUpdatedRows(updatedRows);
		}

		Integer skippedRows = (Integer)attributes.get("skippedRows");

		if (skippedRows != null) {
			setSkippedRows(skippedRows);
		}

		Integer failedRows = (Integer)attributes.get("failedRows");

		if (failedRows != null) {
			setFailedRows(failedRows);
		}

		Date startedDate = (Date)attributes.get("startedDate");

		if (startedDate != null) {
			setStartedDate(startedDate);
		}

		Date completedDate = (Date)attributes.get("completedDate");

		if (completedDate != null) {
			setCompletedDate(completedDate);
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
	 * Returns the completed date of this import job.
	 *
	 * @return the completed date of this import job
	 */
	@Override
	public Date getCompletedDate() {
		return model.getCompletedDate();
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
	 * Returns the created rows of this import job.
	 *
	 * @return the created rows of this import job
	 */
	@Override
	public int getCreatedRows() {
		return model.getCreatedRows();
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
	 * Returns the file entry ID of this import job.
	 *
	 * @return the file entry ID of this import job
	 */
	@Override
	public long getFileEntryId() {
		return model.getFileEntryId();
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
	 * Returns the import profile key of this import job.
	 *
	 * @return the import profile key of this import job
	 */
	@Override
	public String getImportProfileKey() {
		return model.getImportProfileKey();
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
	 * Returns the package schema version of this import job.
	 *
	 * @return the package schema version of this import job
	 */
	@Override
	public String getPackageSchemaVersion() {
		return model.getPackageSchemaVersion();
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
	 * Returns the sha256 of this import job.
	 *
	 * @return the sha256 of this import job
	 */
	@Override
	public String getSha256() {
		return model.getSha256();
	}

	/**
	 * Returns the skipped rows of this import job.
	 *
	 * @return the skipped rows of this import job
	 */
	@Override
	public int getSkippedRows() {
		return model.getSkippedRows();
	}

	/**
	 * Returns the started date of this import job.
	 *
	 * @return the started date of this import job
	 */
	@Override
	public Date getStartedDate() {
		return model.getStartedDate();
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
	 * Returns the structure erc of this import job.
	 *
	 * @return the structure erc of this import job
	 */
	@Override
	public String getStructureERC() {
		return model.getStructureERC();
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
	 * Returns the updated rows of this import job.
	 *
	 * @return the updated rows of this import job
	 */
	@Override
	public int getUpdatedRows() {
		return model.getUpdatedRows();
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
	 * Sets the completed date of this import job.
	 *
	 * @param completedDate the completed date of this import job
	 */
	@Override
	public void setCompletedDate(Date completedDate) {
		model.setCompletedDate(completedDate);
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
	 * Sets the created rows of this import job.
	 *
	 * @param createdRows the created rows of this import job
	 */
	@Override
	public void setCreatedRows(int createdRows) {
		model.setCreatedRows(createdRows);
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
	 * Sets the file entry ID of this import job.
	 *
	 * @param fileEntryId the file entry ID of this import job
	 */
	@Override
	public void setFileEntryId(long fileEntryId) {
		model.setFileEntryId(fileEntryId);
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
	 * Sets the import profile key of this import job.
	 *
	 * @param importProfileKey the import profile key of this import job
	 */
	@Override
	public void setImportProfileKey(String importProfileKey) {
		model.setImportProfileKey(importProfileKey);
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
	 * Sets the package schema version of this import job.
	 *
	 * @param packageSchemaVersion the package schema version of this import job
	 */
	@Override
	public void setPackageSchemaVersion(String packageSchemaVersion) {
		model.setPackageSchemaVersion(packageSchemaVersion);
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
	 * Sets the sha256 of this import job.
	 *
	 * @param sha256 the sha256 of this import job
	 */
	@Override
	public void setSha256(String sha256) {
		model.setSha256(sha256);
	}

	/**
	 * Sets the skipped rows of this import job.
	 *
	 * @param skippedRows the skipped rows of this import job
	 */
	@Override
	public void setSkippedRows(int skippedRows) {
		model.setSkippedRows(skippedRows);
	}

	/**
	 * Sets the started date of this import job.
	 *
	 * @param startedDate the started date of this import job
	 */
	@Override
	public void setStartedDate(Date startedDate) {
		model.setStartedDate(startedDate);
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
	 * Sets the structure erc of this import job.
	 *
	 * @param structureERC the structure erc of this import job
	 */
	@Override
	public void setStructureERC(String structureERC) {
		model.setStructureERC(structureERC);
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
	 * Sets the updated rows of this import job.
	 *
	 * @param updatedRows the updated rows of this import job
	 */
	@Override
	public void setUpdatedRows(int updatedRows) {
		model.setUpdatedRows(updatedRows);
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
// LIFERAY-SERVICE-BUILDER-HASH:-1031610530