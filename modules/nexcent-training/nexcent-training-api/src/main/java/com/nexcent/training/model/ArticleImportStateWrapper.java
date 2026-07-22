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
 * This class is a wrapper for {@link ArticleImportState}.
 * </p>
 *
 * @author Nexcent Training
 * @see ArticleImportState
 * @generated
 */
public class ArticleImportStateWrapper
	extends BaseModelWrapper<ArticleImportState>
	implements ArticleImportState, ModelWrapper<ArticleImportState> {

	public ArticleImportStateWrapper(ArticleImportState articleImportState) {
		super(articleImportState);
	}

	@Override
	public Map<String, Object> getModelAttributes() {
		Map<String, Object> attributes = new HashMap<String, Object>();

		attributes.put("articleImportStateId", getArticleImportStateId());
		attributes.put("groupId", getGroupId());
		attributes.put("companyId", getCompanyId());
		attributes.put("createDate", getCreateDate());
		attributes.put("modifiedDate", getModifiedDate());
		attributes.put("articleERC", getArticleERC());
		attributes.put("locale", getLocale());
		attributes.put("payloadHash", getPayloadHash());
		attributes.put("lastImportJobId", getLastImportJobId());

		return attributes;
	}

	@Override
	public void setModelAttributes(Map<String, Object> attributes) {
		Long articleImportStateId = (Long)attributes.get(
			"articleImportStateId");

		if (articleImportStateId != null) {
			setArticleImportStateId(articleImportStateId);
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

		String articleERC = (String)attributes.get("articleERC");

		if (articleERC != null) {
			setArticleERC(articleERC);
		}

		String locale = (String)attributes.get("locale");

		if (locale != null) {
			setLocale(locale);
		}

		String payloadHash = (String)attributes.get("payloadHash");

		if (payloadHash != null) {
			setPayloadHash(payloadHash);
		}

		Long lastImportJobId = (Long)attributes.get("lastImportJobId");

		if (lastImportJobId != null) {
			setLastImportJobId(lastImportJobId);
		}
	}

	@Override
	public ArticleImportState cloneWithOriginalValues() {
		return wrap(model.cloneWithOriginalValues());
	}

	/**
	 * Returns the article erc of this article import state.
	 *
	 * @return the article erc of this article import state
	 */
	@Override
	public String getArticleERC() {
		return model.getArticleERC();
	}

	/**
	 * Returns the article import state ID of this article import state.
	 *
	 * @return the article import state ID of this article import state
	 */
	@Override
	public long getArticleImportStateId() {
		return model.getArticleImportStateId();
	}

	/**
	 * Returns the company ID of this article import state.
	 *
	 * @return the company ID of this article import state
	 */
	@Override
	public long getCompanyId() {
		return model.getCompanyId();
	}

	/**
	 * Returns the create date of this article import state.
	 *
	 * @return the create date of this article import state
	 */
	@Override
	public Date getCreateDate() {
		return model.getCreateDate();
	}

	/**
	 * Returns the group ID of this article import state.
	 *
	 * @return the group ID of this article import state
	 */
	@Override
	public long getGroupId() {
		return model.getGroupId();
	}

	/**
	 * Returns the last import job ID of this article import state.
	 *
	 * @return the last import job ID of this article import state
	 */
	@Override
	public long getLastImportJobId() {
		return model.getLastImportJobId();
	}

	/**
	 * Returns the locale of this article import state.
	 *
	 * @return the locale of this article import state
	 */
	@Override
	public String getLocale() {
		return model.getLocale();
	}

	/**
	 * Returns the modified date of this article import state.
	 *
	 * @return the modified date of this article import state
	 */
	@Override
	public Date getModifiedDate() {
		return model.getModifiedDate();
	}

	/**
	 * Returns the payload hash of this article import state.
	 *
	 * @return the payload hash of this article import state
	 */
	@Override
	public String getPayloadHash() {
		return model.getPayloadHash();
	}

	/**
	 * Returns the primary key of this article import state.
	 *
	 * @return the primary key of this article import state
	 */
	@Override
	public long getPrimaryKey() {
		return model.getPrimaryKey();
	}

	@Override
	public void persist() {
		model.persist();
	}

	/**
	 * Sets the article erc of this article import state.
	 *
	 * @param articleERC the article erc of this article import state
	 */
	@Override
	public void setArticleERC(String articleERC) {
		model.setArticleERC(articleERC);
	}

	/**
	 * Sets the article import state ID of this article import state.
	 *
	 * @param articleImportStateId the article import state ID of this article import state
	 */
	@Override
	public void setArticleImportStateId(long articleImportStateId) {
		model.setArticleImportStateId(articleImportStateId);
	}

	/**
	 * Sets the company ID of this article import state.
	 *
	 * @param companyId the company ID of this article import state
	 */
	@Override
	public void setCompanyId(long companyId) {
		model.setCompanyId(companyId);
	}

	/**
	 * Sets the create date of this article import state.
	 *
	 * @param createDate the create date of this article import state
	 */
	@Override
	public void setCreateDate(Date createDate) {
		model.setCreateDate(createDate);
	}

	/**
	 * Sets the group ID of this article import state.
	 *
	 * @param groupId the group ID of this article import state
	 */
	@Override
	public void setGroupId(long groupId) {
		model.setGroupId(groupId);
	}

	/**
	 * Sets the last import job ID of this article import state.
	 *
	 * @param lastImportJobId the last import job ID of this article import state
	 */
	@Override
	public void setLastImportJobId(long lastImportJobId) {
		model.setLastImportJobId(lastImportJobId);
	}

	/**
	 * Sets the locale of this article import state.
	 *
	 * @param locale the locale of this article import state
	 */
	@Override
	public void setLocale(String locale) {
		model.setLocale(locale);
	}

	/**
	 * Sets the modified date of this article import state.
	 *
	 * @param modifiedDate the modified date of this article import state
	 */
	@Override
	public void setModifiedDate(Date modifiedDate) {
		model.setModifiedDate(modifiedDate);
	}

	/**
	 * Sets the payload hash of this article import state.
	 *
	 * @param payloadHash the payload hash of this article import state
	 */
	@Override
	public void setPayloadHash(String payloadHash) {
		model.setPayloadHash(payloadHash);
	}

	/**
	 * Sets the primary key of this article import state.
	 *
	 * @param primaryKey the primary key of this article import state
	 */
	@Override
	public void setPrimaryKey(long primaryKey) {
		model.setPrimaryKey(primaryKey);
	}

	@Override
	public String toXmlString() {
		return model.toXmlString();
	}

	@Override
	protected ArticleImportStateWrapper wrap(
		ArticleImportState articleImportState) {

		return new ArticleImportStateWrapper(articleImportState);
	}

}
// LIFERAY-SERVICE-BUILDER-HASH:1628229310