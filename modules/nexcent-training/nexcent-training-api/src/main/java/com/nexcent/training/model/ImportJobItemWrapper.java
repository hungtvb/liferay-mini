/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.model;

import com.liferay.portal.kernel.model.ModelWrapper;
import com.liferay.portal.kernel.model.wrapper.BaseModelWrapper;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * This class is a wrapper for {@link ImportJobItem}.
 * </p>
 *
 * @author Nexcent Training
 * @see ImportJobItem
 * @generated
 */
public class ImportJobItemWrapper
	extends BaseModelWrapper<ImportJobItem>
	implements ImportJobItem, ModelWrapper<ImportJobItem> {

	public ImportJobItemWrapper(ImportJobItem importJobItem) {
		super(importJobItem);
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("importJobItemId", getImportJobItemId());
		attributes.put("groupId", getGroupId());
		attributes.put("companyId", getCompanyId());
		attributes.put("createDate", getCreateDate());
		attributes.put("modifiedDate", getModifiedDate());
		attributes.put("importJobId", getImportJobId());
		attributes.put("rowNumber", getRowNumber());
		attributes.put("targetType", getTargetType());
		attributes.put("targetERC", getTargetERC());
		attributes.put("sheetName", getSheetName());
		attributes.put("locale", getLocale());
		attributes.put("operation", getOperation());
		attributes.put("result", getResult());
		attributes.put("severity", getSeverity());
		attributes.put("messageCode", getMessageCode());
		attributes.put("message", getMessage());
		attributes.put("payloadHash", getPayloadHash());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long importJobItemId = (Long)attributes.get("importJobItemId");

		if (importJobItemId != null) {
			setImportJobItemId(importJobItemId);
		}

		Long groupId = (Long)attributes.get("groupId");

		if (groupId != null) {
			setGroupId(groupId);
		}

		Long companyId = (Long)attributes.get("companyId");

		if (companyId != null) {
			setCompanyId(companyId);
		}

		Date createDate = (Date)attributes.get("createDate");

		if (createDate != null) {
			setCreateDate(createDate);
		}

		Date modifiedDate = (Date)attributes.get("modifiedDate");

		if (modifiedDate != null) {
			setModifiedDate(modifiedDate);
		}

		Long importJobId = (Long)attributes.get("importJobId");

		if (importJobId != null) {
			setImportJobId(importJobId);
		}

		Integer rowNumber = (Integer)attributes.get("rowNumber");

		if (rowNumber != null) {
			setRowNumber(rowNumber);
		}

		String targetType = (String)attributes.get("targetType");

		if (targetType != null) {
			setTargetType(targetType);
		}

		String targetERC = (String)attributes.get("targetERC");

		if (targetERC != null) {
			setTargetERC(targetERC);
		}

		String sheetName = (String)attributes.get("sheetName");

		if (sheetName != null) {
			setSheetName(sheetName);
		}

		String locale = (String)attributes.get("locale");

		if (locale != null) {
			setLocale(locale);
		}

		String operation = (String)attributes.get("operation");

		if (operation != null) {
			setOperation(operation);
		}

		String result = (String)attributes.get("result");

		if (result != null) {
			setResult(result);
		}

		String severity = (String)attributes.get("severity");

		if (severity != null) {
			setSeverity(severity);
		}

		String messageCode = (String)attributes.get("messageCode");

		if (messageCode != null) {
			setMessageCode(messageCode);
		}

		String message = (String)attributes.get("message");

		if (message != null) {
			setMessage(message);
		}

		String payloadHash = (String)attributes.get("payloadHash");

		if (payloadHash != null) {
			setPayloadHash(payloadHash);
		}
	}

	@Override
	public ImportJobItem cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	/**
	 * Returns the company ID of this import job item.
	 *
	 * @return the company ID of this import job item
	 */
	@Override
	public long getCompanyId() {
		return model.getCompanyId();
	}

	/**
	 * Returns the create date of this import job item.
	 *
	 * @return the create date of this import job item
	 */
	@Override
	public Date getCreateDate() {
		return model.getCreateDate();
	}

	/**
	 * Returns the group ID of this import job item.
	 *
	 * @return the group ID of this import job item
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the import job ID of this import job item.
	 *
	 * @return the import job ID of this import job item
	 */
	@Override
	public long getImportJobId() {
		return model.getImportJobId();
	}

	/**
	 * Returns the import job item ID of this import job item.
	 *
	 * @return the import job item ID of this import job item
	 */
	@Override
	public long getImportJobItemId() {
		return model.getImportJobItemId();
	}

	/**
	 * Returns the locale of this import job item.
	 *
	 * @return the locale of this import job item
	 */
	@Override
	public String getLocale() {
		return model.getLocale();
	}

	/**
	 * Returns the message of this import job item.
	 *
	 * @return the message of this import job item
	 */
	@Override
	public String getMessage() {
		return model.getMessage();
	}

	/**
	 * Returns the message code of this import job item.
	 *
	 * @return the message code of this import job item
	 */
	@Override
	public String getMessageCode() {
		return model.getMessageCode();
	}

	/**
	 * Returns the modified date of this import job item.
	 *
	 * @return the modified date of this import job item
	 */
	@Override
	public Date getModifiedDate() {
		return model.getModifiedDate();
	}

	/**
	 * Returns the operation of this import job item.
	 *
	 * @return the operation of this import job item
	 */
	@Override
	public String getOperation() {
		return model.getOperation();
	}

	/**
	 * Returns the payload hash of this import job item.
	 *
	 * @return the payload hash of this import job item
	 */
	@Override
	public String getPayloadHash() {
		return model.getPayloadHash();
	}

	/**
	 * Returns the primary key of this import job item.
	 *
	 * @return the primary key of this import job item
	 */
	@Override
	public long getPrimaryKey() {
		return model.getPrimaryKey();
	}

	/**
	 * Returns the result of this import job item.
	 *
	 * @return the result of this import job item
	 */
	@Override
	public String getResult() {
		return model.getResult();
	}

	/**
	 * Returns the row number of this import job item.
	 *
	 * @return the row number of this import job item
	 */
	@Override
	public int getRowNumber() {
		return model.getRowNumber();
	}

	/**
	 * Returns the severity of this import job item.
	 *
	 * @return the severity of this import job item
	 */
	@Override
	public String getSeverity() {
		return model.getSeverity();
	}

	/**
	 * Returns the sheet name of this import job item.
	 *
	 * @return the sheet name of this import job item
	 */
	@Override
	public String getSheetName() {
		return model.getSheetName();
	}

	/**
	 * Returns the target erc of this import job item.
	 *
	 * @return the target erc of this import job item
	 */
	@Override
	public String getTargetERC() {
		return model.getTargetERC();
	}

	/**
	 * Returns the target type of this import job item.
	 *
	 * @return the target type of this import job item
	 */
	@Override
	public String getTargetType() {
		return model.getTargetType();
	}

	@Override
	public void persist() {
		model.persist();
	}

	/**
	 * Sets the company ID of this import job item.
	 *
	 * @param companyId the company ID of this import job item
	 */
	@Override
	public void setCompanyId(long companyId) {
		model.setCompanyId(companyId);
	}

	/**
	 * Sets the create date of this import job item.
	 *
	 * @param createDate the create date of this import job item
	 */
	@Override
	public void setCreateDate(Date createDate) {
		model.setCreateDate(createDate);
	}

	/**
	 * Sets the group ID of this import job item.
	 *
	 * @param groupId the group ID of this import job item
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	/**
	 * Sets the import job ID of this import job item.
	 *
	 * @param importJobId the import job ID of this import job item
	 */
	@Override
	public void setImportJobId(long importJobId) {
		model.setImportJobId(importJobId);
	}

	/**
	 * Sets the import job item ID of this import job item.
	 *
	 * @param importJobItemId the import job item ID of this import job item
	 */
	@Override
	public void setImportJobItemId(long importJobItemId) {
		model.setImportJobItemId(importJobItemId);
	}

	/**
	 * Sets the locale of this import job item.
	 *
	 * @param locale the locale of this import job item
	 */
	@Override
	public void setLocale(String locale) {
		model.setLocale(locale);
	}

	/**
	 * Sets the message of this import job item.
	 *
	 * @param message the message of this import job item
	 */
	@Override
	public void setMessage(String message) {
		model.setMessage(message);
	}

	/**
	 * Sets the message code of this import job item.
	 *
	 * @param messageCode the message code of this import job item
	 */
	@Override
	public void setMessageCode(String messageCode) {
		model.setMessageCode(messageCode);
	}

	/**
	 * Sets the modified date of this import job item.
	 *
	 * @param modifiedDate the modified date of this import job item
	 */
	@Override
	public void setModifiedDate(Date modifiedDate) {
		model.setModifiedDate(modifiedDate);
	}

	/**
	 * Sets the operation of this import job item.
	 *
	 * @param operation the operation of this import job item
	 */
	@Override
	public void setOperation(String operation) {
		model.setOperation(operation);
	}

	/**
	 * Sets the payload hash of this import job item.
	 *
	 * @param payloadHash the payload hash of this import job item
	 */
	@Override
	public void setPayloadHash(String payloadHash) {
		model.setPayloadHash(payloadHash);
	}

	/**
	 * Sets the primary key of this import job item.
	 *
	 * @param primaryKey the primary key of this import job item
	 */
	@Override
	public void setPrimaryKey(long primaryKey) {
		model.setPrimaryKey(primaryKey);
	}

	/**
	 * Sets the result of this import job item.
	 *
	 * @param result the result of this import job item
	 */
	@Override
	public void setResult(String result) {
		model.setResult(result);
	}

	/**
	 * Sets the row number of this import job item.
	 *
	 * @param rowNumber the row number of this import job item
	 */
	@Override
	public void setRowNumber(int rowNumber) {
		model.setRowNumber(rowNumber);
	}

	/**
	 * Sets the severity of this import job item.
	 *
	 * @param severity the severity of this import job item
	 */
	@Override
	public void setSeverity(String severity) {
		model.setSeverity(severity);
	}

	/**
	 * Sets the sheet name of this import job item.
	 *
	 * @param sheetName the sheet name of this import job item
	 */
	@Override
	public void setSheetName(String sheetName) {
		model.setSheetName(sheetName);
	}

	/**
	 * Sets the target erc of this import job item.
	 *
	 * @param targetERC the target erc of this import job item
	 */
	@Override
	public void setTargetERC(String targetERC) {
		model.setTargetERC(targetERC);
	}

	/**
	 * Sets the target type of this import job item.
	 *
	 * @param targetType the target type of this import job item
	 */
	@Override
	public void setTargetType(String targetType) {
		model.setTargetType(targetType);
	}

	@Override
	public String toXmlString() {
		return model.toXmlString();
	}

	@Override
	protected ImportJobItemWrapper wrap(ImportJobItem importJobItem) {
		return new ImportJobItemWrapper(importJobItem);
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:1201990920