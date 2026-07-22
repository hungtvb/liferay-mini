/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.model.impl;

import com.liferay.petra.lang.HashUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.CacheModel;

import com.nexcent.training.model.ImportJob;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

import java.util.Date;

/**
 * The cache model class for representing ImportJob in entity cache.
 *
 * @author Nexcent Training
 * @generated
 */
public class ImportJobCacheModel
	implements CacheModel<ImportJob>, Externalizable {

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof ImportJobCacheModel)) {
			return false;
		}

		ImportJobCacheModel importJobCacheModel = (ImportJobCacheModel)object;

		if (importJobId == importJobCacheModel.importJobId) {
			return true;
		}

		return false;
	}

	@Override
	public int hashCode() {
		return HashUtil.hash(0, importJobId);
	}

	@Override
	public String toString() {
		StringBundler sb = new StringBundler(45);

		sb.append("{uuid=");
		sb.append(uuid);
		sb.append(", importJobId=");
		sb.append(importJobId);
		sb.append(", groupId=");
		sb.append(groupId);
		sb.append(", companyId=");
		sb.append(companyId);
		sb.append(", userId=");
		sb.append(userId);
		sb.append(", userName=");
		sb.append(userName);
		sb.append(", createDate=");
		sb.append(createDate);
		sb.append(", modifiedDate=");
		sb.append(modifiedDate);
		sb.append(", jobKey=");
		sb.append(jobKey);
		sb.append(", fileEntryId=");
		sb.append(fileEntryId);
		sb.append(", fileName=");
		sb.append(fileName);
		sb.append(", sha256=");
		sb.append(sha256);
		sb.append(", structureERC=");
		sb.append(structureERC);
		sb.append(", status=");
		sb.append(status);
		sb.append(", totalRows=");
		sb.append(totalRows);
		sb.append(", createdRows=");
		sb.append(createdRows);
		sb.append(", updatedRows=");
		sb.append(updatedRows);
		sb.append(", skippedRows=");
		sb.append(skippedRows);
		sb.append(", failedRows=");
		sb.append(failedRows);
		sb.append(", startedDate=");
		sb.append(startedDate);
		sb.append(", completedDate=");
		sb.append(completedDate);
		sb.append(", errorMessage=");
		sb.append(errorMessage);
		sb.append("}");

		return sb.toString();
	}

	@Override
	public ImportJob toEntityModel() {
		ImportJobImpl importJobImpl = new ImportJobImpl();

		if (uuid == null) {
			importJobImpl.setUuid("");
		}
		else {
			importJobImpl.setUuid(uuid);
		}

		importJobImpl.setImportJobId(importJobId);
		importJobImpl.setGroupId(groupId);
		importJobImpl.setCompanyId(companyId);
		importJobImpl.setUserId(userId);

		if (userName == null) {
			importJobImpl.setUserName("");
		}
		else {
			importJobImpl.setUserName(userName);
		}

		if (createDate == Long.MIN_VALUE) {
			importJobImpl.setCreateDate(null);
		}
		else {
			importJobImpl.setCreateDate(new Date(createDate));
		}

		if (modifiedDate == Long.MIN_VALUE) {
			importJobImpl.setModifiedDate(null);
		}
		else {
			importJobImpl.setModifiedDate(new Date(modifiedDate));
		}

		if (jobKey == null) {
			importJobImpl.setJobKey("");
		}
		else {
			importJobImpl.setJobKey(jobKey);
		}

		importJobImpl.setFileEntryId(fileEntryId);

		if (fileName == null) {
			importJobImpl.setFileName("");
		}
		else {
			importJobImpl.setFileName(fileName);
		}

		if (sha256 == null) {
			importJobImpl.setSha256("");
		}
		else {
			importJobImpl.setSha256(sha256);
		}

		if (structureERC == null) {
			importJobImpl.setStructureERC("");
		}
		else {
			importJobImpl.setStructureERC(structureERC);
		}

		if (status == null) {
			importJobImpl.setStatus("");
		}
		else {
			importJobImpl.setStatus(status);
		}

		importJobImpl.setTotalRows(totalRows);
		importJobImpl.setCreatedRows(createdRows);
		importJobImpl.setUpdatedRows(updatedRows);
		importJobImpl.setSkippedRows(skippedRows);
		importJobImpl.setFailedRows(failedRows);

		if (startedDate == Long.MIN_VALUE) {
			importJobImpl.setStartedDate(null);
		}
		else {
			importJobImpl.setStartedDate(new Date(startedDate));
		}

		if (completedDate == Long.MIN_VALUE) {
			importJobImpl.setCompletedDate(null);
		}
		else {
			importJobImpl.setCompletedDate(new Date(completedDate));
		}

		if (errorMessage == null) {
			importJobImpl.setErrorMessage("");
		}
		else {
			importJobImpl.setErrorMessage(errorMessage);
		}

		importJobImpl.resetOriginalValues();

		return importJobImpl;
	}

	@Override
	public void readExternal(ObjectInput objectInput) throws IOException {
		uuid = objectInput.readUTF();

		importJobId = objectInput.readLong();

		groupId = objectInput.readLong();

		companyId = objectInput.readLong();

		userId = objectInput.readLong();
		userName = objectInput.readUTF();
		createDate = objectInput.readLong();
		modifiedDate = objectInput.readLong();
		jobKey = objectInput.readUTF();

		fileEntryId = objectInput.readLong();
		fileName = objectInput.readUTF();
		sha256 = objectInput.readUTF();
		structureERC = objectInput.readUTF();
		status = objectInput.readUTF();

		totalRows = objectInput.readInt();

		createdRows = objectInput.readInt();

		updatedRows = objectInput.readInt();

		skippedRows = objectInput.readInt();

		failedRows = objectInput.readInt();
		startedDate = objectInput.readLong();
		completedDate = objectInput.readLong();
		errorMessage = objectInput.readUTF();
	}

	@Override
	public void writeExternal(ObjectOutput objectOutput) throws IOException {
		if (uuid == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(uuid);
		}

		objectOutput.writeLong(importJobId);

		objectOutput.writeLong(groupId);

		objectOutput.writeLong(companyId);

		objectOutput.writeLong(userId);

		if (userName == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(userName);
		}

		objectOutput.writeLong(createDate);
		objectOutput.writeLong(modifiedDate);

		if (jobKey == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(jobKey);
		}

		objectOutput.writeLong(fileEntryId);

		if (fileName == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(fileName);
		}

		if (sha256 == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(sha256);
		}

		if (structureERC == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(structureERC);
		}

		if (status == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(status);
		}

		objectOutput.writeInt(totalRows);

		objectOutput.writeInt(createdRows);

		objectOutput.writeInt(updatedRows);

		objectOutput.writeInt(skippedRows);

		objectOutput.writeInt(failedRows);
		objectOutput.writeLong(startedDate);
		objectOutput.writeLong(completedDate);

		if (errorMessage == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(errorMessage);
		}
	}

	public String uuid;
	public long importJobId;
	public long groupId;
	public long companyId;
	public long userId;
	public String userName;
	public long createDate;
	public long modifiedDate;
	public String jobKey;
	public long fileEntryId;
	public String fileName;
	public String sha256;
	public String structureERC;
	public String status;
	public int totalRows;
	public int createdRows;
	public int updatedRows;
	public int skippedRows;
	public int failedRows;
	public long startedDate;
	public long completedDate;
	public String errorMessage;

}
// LIFERAY-SERVICE-BUILDER-HASH:-1704174739