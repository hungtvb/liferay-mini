/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.model.impl;

import com.liferay.petra.lang.HashUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.CacheModel;

import com.nexcent.training.model.ImportJobItem;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

import java.util.Date;

/**
 * The cache model class for representing ImportJobItem in entity cache.
 *
 * @author Nexcent Training
 * @generated
 */
public class ImportJobItemCacheModel
	implements CacheModel<ImportJobItem>, Externalizable {

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof ImportJobItemCacheModel)) {
			return false;
		}

		ImportJobItemCacheModel importJobItemCacheModel =
			(ImportJobItemCacheModel)object;

		if (importJobItemId == importJobItemCacheModel.importJobItemId) {
			return true;
		}

		return false;
	}

	@Override
	public int hashCode() {
		return HashUtil.hash(0, importJobItemId);
	}

	@Override
	public String toString() {
		StringBundler sb = new StringBundler(35);

		sb.append("{importJobItemId=");
		sb.append(importJobItemId);
		sb.append(", groupId=");
		sb.append(groupId);
		sb.append(", companyId=");
		sb.append(companyId);
		sb.append(", createDate=");
		sb.append(createDate);
		sb.append(", modifiedDate=");
		sb.append(modifiedDate);
		sb.append(", importJobId=");
		sb.append(importJobId);
		sb.append(", rowNumber=");
		sb.append(rowNumber);
		sb.append(", targetType=");
		sb.append(targetType);
		sb.append(", targetERC=");
		sb.append(targetERC);
		sb.append(", sheetName=");
		sb.append(sheetName);
		sb.append(", locale=");
		sb.append(locale);
		sb.append(", operation=");
		sb.append(operation);
		sb.append(", result=");
		sb.append(result);
		sb.append(", severity=");
		sb.append(severity);
		sb.append(", messageCode=");
		sb.append(messageCode);
		sb.append(", message=");
		sb.append(message);
		sb.append(", payloadHash=");
		sb.append(payloadHash);
		sb.append("}");

		return sb.toString();
	}

	@Override
	public ImportJobItem toEntityModel() {
		ImportJobItemImpl importJobItemImpl = new ImportJobItemImpl();

		importJobItemImpl.setImportJobItemId(importJobItemId);
		importJobItemImpl.setGroupId(groupId);
		importJobItemImpl.setCompanyId(companyId);

		if (createDate == Long.MIN_VALUE) {
			importJobItemImpl.setCreateDate(null);
		}
		else {
			importJobItemImpl.setCreateDate(new Date(createDate));
		}

		if (modifiedDate == Long.MIN_VALUE) {
			importJobItemImpl.setModifiedDate(null);
		}
		else {
			importJobItemImpl.setModifiedDate(new Date(modifiedDate));
		}

		importJobItemImpl.setImportJobId(importJobId);
		importJobItemImpl.setRowNumber(rowNumber);

		if (targetType == null) {
			importJobItemImpl.setTargetType("");
		}
		else {
			importJobItemImpl.setTargetType(targetType);
		}

		if (targetERC == null) {
			importJobItemImpl.setTargetERC("");
		}
		else {
			importJobItemImpl.setTargetERC(targetERC);
		}

		if (sheetName == null) {
			importJobItemImpl.setSheetName("");
		}
		else {
			importJobItemImpl.setSheetName(sheetName);
		}

		if (locale == null) {
			importJobItemImpl.setLocale("");
		}
		else {
			importJobItemImpl.setLocale(locale);
		}

		if (operation == null) {
			importJobItemImpl.setOperation("");
		}
		else {
			importJobItemImpl.setOperation(operation);
		}

		if (result == null) {
			importJobItemImpl.setResult("");
		}
		else {
			importJobItemImpl.setResult(result);
		}

		if (severity == null) {
			importJobItemImpl.setSeverity("");
		}
		else {
			importJobItemImpl.setSeverity(severity);
		}

		if (messageCode == null) {
			importJobItemImpl.setMessageCode("");
		}
		else {
			importJobItemImpl.setMessageCode(messageCode);
		}

		if (message == null) {
			importJobItemImpl.setMessage("");
		}
		else {
			importJobItemImpl.setMessage(message);
		}

		if (payloadHash == null) {
			importJobItemImpl.setPayloadHash("");
		}
		else {
			importJobItemImpl.setPayloadHash(payloadHash);
		}

		importJobItemImpl.resetOriginalValues();

		return importJobItemImpl;
	}

	@Override
	public void readExternal(ObjectInput objectInput) throws IOException {
		importJobItemId = objectInput.readLong();

		groupId = objectInput.readLong();

		companyId = objectInput.readLong();
		createDate = objectInput.readLong();
		modifiedDate = objectInput.readLong();

		importJobId = objectInput.readLong();

		rowNumber = objectInput.readInt();
		targetType = objectInput.readUTF();
		targetERC = objectInput.readUTF();
		sheetName = objectInput.readUTF();
		locale = objectInput.readUTF();
		operation = objectInput.readUTF();
		result = objectInput.readUTF();
		severity = objectInput.readUTF();
		messageCode = objectInput.readUTF();
		message = objectInput.readUTF();
		payloadHash = objectInput.readUTF();
	}

	@Override
	public void writeExternal(ObjectOutput objectOutput) throws IOException {
		objectOutput.writeLong(importJobItemId);

		objectOutput.writeLong(groupId);

		objectOutput.writeLong(companyId);
		objectOutput.writeLong(createDate);
		objectOutput.writeLong(modifiedDate);

		objectOutput.writeLong(importJobId);

		objectOutput.writeInt(rowNumber);

		if (targetType == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(targetType);
		}

		if (targetERC == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(targetERC);
		}

		if (sheetName == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(sheetName);
		}

		if (locale == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(locale);
		}

		if (operation == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(operation);
		}

		if (result == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(result);
		}

		if (severity == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(severity);
		}

		if (messageCode == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(messageCode);
		}

		if (message == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(message);
		}

		if (payloadHash == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(payloadHash);
		}
	}

	public long importJobItemId;
	public long groupId;
	public long companyId;
	public long createDate;
	public long modifiedDate;
	public long importJobId;
	public int rowNumber;
	public String targetType;
	public String targetERC;
	public String sheetName;
	public String locale;
	public String operation;
	public String result;
	public String severity;
	public String messageCode;
	public String message;
	public String payloadHash;

}
// LIFERAY-SERVICE-BUILDER-HASH:-241544224