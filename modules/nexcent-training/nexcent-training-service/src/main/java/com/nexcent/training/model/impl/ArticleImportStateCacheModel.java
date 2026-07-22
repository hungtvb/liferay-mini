/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.model.impl;

import com.liferay.petra.lang.HashUtil;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.model.CacheModel;

import com.nexcent.training.model.ArticleImportState;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

import java.util.Date;

/**
 * The cache model class for representing ArticleImportState in entity cache.
 *
 * @author Nexcent Training
 * @generated
 */
public class ArticleImportStateCacheModel
	implements CacheModel<ArticleImportState>, Externalizable {

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof ArticleImportStateCacheModel)) {
			return false;
		}

		ArticleImportStateCacheModel articleImportStateCacheModel =
			(ArticleImportStateCacheModel)object;

		if (articleImportStateId ==
				articleImportStateCacheModel.articleImportStateId) {

			return true;
		}

		return false;
	}

	@Override
	public int hashCode() {
		return HashUtil.hash(0, articleImportStateId);
	}

	@Override
	public String toString() {
		StringBundler sb = new StringBundler(19);

		sb.append("{articleImportStateId=");
		sb.append(articleImportStateId);
		sb.append(", groupId=");
		sb.append(groupId);
		sb.append(", companyId=");
		sb.append(companyId);
		sb.append(", createDate=");
		sb.append(createDate);
		sb.append(", modifiedDate=");
		sb.append(modifiedDate);
		sb.append(", articleERC=");
		sb.append(articleERC);
		sb.append(", locale=");
		sb.append(locale);
		sb.append(", payloadHash=");
		sb.append(payloadHash);
		sb.append(", lastImportJobId=");
		sb.append(lastImportJobId);
		sb.append("}");

		return sb.toString();
	}

	@Override
	public ArticleImportState toEntityModel() {
		ArticleImportStateImpl articleImportStateImpl =
			new ArticleImportStateImpl();

		articleImportStateImpl.setArticleImportStateId(articleImportStateId);
		articleImportStateImpl.setGroupId(groupId);
		articleImportStateImpl.setCompanyId(companyId);

		if (createDate == Long.MIN_VALUE) {
			articleImportStateImpl.setCreateDate(null);
		}
		else {
			articleImportStateImpl.setCreateDate(new Date(createDate));
		}

		if (modifiedDate == Long.MIN_VALUE) {
			articleImportStateImpl.setModifiedDate(null);
		}
		else {
			articleImportStateImpl.setModifiedDate(new Date(modifiedDate));
		}

		if (articleERC == null) {
			articleImportStateImpl.setArticleERC("");
		}
		else {
			articleImportStateImpl.setArticleERC(articleERC);
		}

		if (locale == null) {
			articleImportStateImpl.setLocale("");
		}
		else {
			articleImportStateImpl.setLocale(locale);
		}

		if (payloadHash == null) {
			articleImportStateImpl.setPayloadHash("");
		}
		else {
			articleImportStateImpl.setPayloadHash(payloadHash);
		}

		articleImportStateImpl.setLastImportJobId(lastImportJobId);

		articleImportStateImpl.resetOriginalValues();

		return articleImportStateImpl;
	}

	@Override
	public void readExternal(ObjectInput objectInput) throws IOException {
		articleImportStateId = objectInput.readLong();

		groupId = objectInput.readLong();

		companyId = objectInput.readLong();
		createDate = objectInput.readLong();
		modifiedDate = objectInput.readLong();
		articleERC = objectInput.readUTF();
		locale = objectInput.readUTF();
		payloadHash = objectInput.readUTF();

		lastImportJobId = objectInput.readLong();
	}

	@Override
	public void writeExternal(ObjectOutput objectOutput) throws IOException {
		objectOutput.writeLong(articleImportStateId);

		objectOutput.writeLong(groupId);

		objectOutput.writeLong(companyId);
		objectOutput.writeLong(createDate);
		objectOutput.writeLong(modifiedDate);

		if (articleERC == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(articleERC);
		}

		if (locale == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(locale);
		}

		if (payloadHash == null) {
			objectOutput.writeUTF("");
		}
		else {
			objectOutput.writeUTF(payloadHash);
		}

		objectOutput.writeLong(lastImportJobId);
	}

	public long articleImportStateId;
	public long groupId;
	public long companyId;
	public long createDate;
	public long modifiedDate;
	public String articleERC;
	public String locale;
	public String payloadHash;
	public long lastImportJobId;

}
// LIFERAY-SERVICE-BUILDER-HASH:-538848426