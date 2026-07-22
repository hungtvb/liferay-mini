/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.nexcent.training.rest.dto.v1_0;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.liferay.petra.function.UnsafeSupplier;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;
import com.liferay.portal.vulcan.util.ObjectMapperUtil;

import jakarta.annotation.Generated;

import jakarta.xml.bind.annotation.XmlRootElement;

import java.io.Serializable;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

import java.util.Date;
import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Supplier;

/**
 * @author Nexcent Training
 * @generated
 */
@Generated("")
@GraphQLName("ContentImportJob")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "ContentImportJob")
public class ContentImportJob implements Serializable {

	public static ContentImportJob toDTO(String json) {
		return ObjectMapperUtil.readValue(ContentImportJob.class, json);
	}

	public static ContentImportJob unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(ContentImportJob.class, json);
	}

	@io.swagger.v3.oas.annotations.media.Schema
	public Date getCompletedDate() {
		if (_completedDateSupplier != null) {
			completedDate = _completedDateSupplier.get();

			_completedDateSupplier = null;
		}

		return completedDate;
	}

	public void setCompletedDate(Date completedDate) {
		this.completedDate = completedDate;

		_completedDateSupplier = null;
	}

	@JsonIgnore
	public void setCompletedDate(
		UnsafeSupplier<Date, Exception> completedDateUnsafeSupplier) {

		_completedDateSupplier = () -> {
			try {
				return completedDateUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Date completedDate;

	@JsonIgnore
	private Supplier<Date> _completedDateSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Integer getCreatedRows() {
		if (_createdRowsSupplier != null) {
			createdRows = _createdRowsSupplier.get();

			_createdRowsSupplier = null;
		}

		return createdRows;
	}

	public void setCreatedRows(Integer createdRows) {
		this.createdRows = createdRows;

		_createdRowsSupplier = null;
	}

	@JsonIgnore
	public void setCreatedRows(
		UnsafeSupplier<Integer, Exception> createdRowsUnsafeSupplier) {

		_createdRowsSupplier = () -> {
			try {
				return createdRowsUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Integer createdRows;

	@JsonIgnore
	private Supplier<Integer> _createdRowsSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getErrorMessage() {
		if (_errorMessageSupplier != null) {
			errorMessage = _errorMessageSupplier.get();

			_errorMessageSupplier = null;
		}

		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;

		_errorMessageSupplier = null;
	}

	@JsonIgnore
	public void setErrorMessage(
		UnsafeSupplier<String, Exception> errorMessageUnsafeSupplier) {

		_errorMessageSupplier = () -> {
			try {
				return errorMessageUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected String errorMessage;

	@JsonIgnore
	private Supplier<String> _errorMessageSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getExternalReferenceCode() {
		if (_externalReferenceCodeSupplier != null) {
			externalReferenceCode = _externalReferenceCodeSupplier.get();

			_externalReferenceCodeSupplier = null;
		}

		return externalReferenceCode;
	}

	public void setExternalReferenceCode(String externalReferenceCode) {
		this.externalReferenceCode = externalReferenceCode;

		_externalReferenceCodeSupplier = null;
	}

	@JsonIgnore
	public void setExternalReferenceCode(
		UnsafeSupplier<String, Exception> externalReferenceCodeUnsafeSupplier) {

		_externalReferenceCodeSupplier = () -> {
			try {
				return externalReferenceCodeUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected String externalReferenceCode;

	@JsonIgnore
	private Supplier<String> _externalReferenceCodeSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Integer getFailedRows() {
		if (_failedRowsSupplier != null) {
			failedRows = _failedRowsSupplier.get();

			_failedRowsSupplier = null;
		}

		return failedRows;
	}

	public void setFailedRows(Integer failedRows) {
		this.failedRows = failedRows;

		_failedRowsSupplier = null;
	}

	@JsonIgnore
	public void setFailedRows(
		UnsafeSupplier<Integer, Exception> failedRowsUnsafeSupplier) {

		_failedRowsSupplier = () -> {
			try {
				return failedRowsUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Integer failedRows;

	@JsonIgnore
	private Supplier<Integer> _failedRowsSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Long getFileEntryId() {
		if (_fileEntryIdSupplier != null) {
			fileEntryId = _fileEntryIdSupplier.get();

			_fileEntryIdSupplier = null;
		}

		return fileEntryId;
	}

	public void setFileEntryId(Long fileEntryId) {
		this.fileEntryId = fileEntryId;

		_fileEntryIdSupplier = null;
	}

	@JsonIgnore
	public void setFileEntryId(
		UnsafeSupplier<Long, Exception> fileEntryIdUnsafeSupplier) {

		_fileEntryIdSupplier = () -> {
			try {
				return fileEntryIdUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Long fileEntryId;

	@JsonIgnore
	private Supplier<Long> _fileEntryIdSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getFileName() {
		if (_fileNameSupplier != null) {
			fileName = _fileNameSupplier.get();

			_fileNameSupplier = null;
		}

		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;

		_fileNameSupplier = null;
	}

	@JsonIgnore
	public void setFileName(
		UnsafeSupplier<String, Exception> fileNameUnsafeSupplier) {

		_fileNameSupplier = () -> {
			try {
				return fileNameUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected String fileName;

	@JsonIgnore
	private Supplier<String> _fileNameSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Long getId() {
		if (_idSupplier != null) {
			id = _idSupplier.get();

			_idSupplier = null;
		}

		return id;
	}

	public void setId(Long id) {
		this.id = id;

		_idSupplier = null;
	}

	@JsonIgnore
	public void setId(UnsafeSupplier<Long, Exception> idUnsafeSupplier) {
		_idSupplier = () -> {
			try {
				return idUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Long id;

	@JsonIgnore
	private Supplier<Long> _idSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getImportProfileKey() {
		if (_importProfileKeySupplier != null) {
			importProfileKey = _importProfileKeySupplier.get();

			_importProfileKeySupplier = null;
		}

		return importProfileKey;
	}

	public void setImportProfileKey(String importProfileKey) {
		this.importProfileKey = importProfileKey;

		_importProfileKeySupplier = null;
	}

	@JsonIgnore
	public void setImportProfileKey(
		UnsafeSupplier<String, Exception> importProfileKeyUnsafeSupplier) {

		_importProfileKeySupplier = () -> {
			try {
				return importProfileKeyUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected String importProfileKey;

	@JsonIgnore
	private Supplier<String> _importProfileKeySupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getPackageSchemaVersion() {
		if (_packageSchemaVersionSupplier != null) {
			packageSchemaVersion = _packageSchemaVersionSupplier.get();

			_packageSchemaVersionSupplier = null;
		}

		return packageSchemaVersion;
	}

	public void setPackageSchemaVersion(String packageSchemaVersion) {
		this.packageSchemaVersion = packageSchemaVersion;

		_packageSchemaVersionSupplier = null;
	}

	@JsonIgnore
	public void setPackageSchemaVersion(
		UnsafeSupplier<String, Exception> packageSchemaVersionUnsafeSupplier) {

		_packageSchemaVersionSupplier = () -> {
			try {
				return packageSchemaVersionUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected String packageSchemaVersion;

	@JsonIgnore
	private Supplier<String> _packageSchemaVersionSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getSha256() {
		if (_sha256Supplier != null) {
			sha256 = _sha256Supplier.get();

			_sha256Supplier = null;
		}

		return sha256;
	}

	public void setSha256(String sha256) {
		this.sha256 = sha256;

		_sha256Supplier = null;
	}

	@JsonIgnore
	public void setSha256(
		UnsafeSupplier<String, Exception> sha256UnsafeSupplier) {

		_sha256Supplier = () -> {
			try {
				return sha256UnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected String sha256;

	@JsonIgnore
	private Supplier<String> _sha256Supplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Integer getSkippedRows() {
		if (_skippedRowsSupplier != null) {
			skippedRows = _skippedRowsSupplier.get();

			_skippedRowsSupplier = null;
		}

		return skippedRows;
	}

	public void setSkippedRows(Integer skippedRows) {
		this.skippedRows = skippedRows;

		_skippedRowsSupplier = null;
	}

	@JsonIgnore
	public void setSkippedRows(
		UnsafeSupplier<Integer, Exception> skippedRowsUnsafeSupplier) {

		_skippedRowsSupplier = () -> {
			try {
				return skippedRowsUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Integer skippedRows;

	@JsonIgnore
	private Supplier<Integer> _skippedRowsSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Date getStartedDate() {
		if (_startedDateSupplier != null) {
			startedDate = _startedDateSupplier.get();

			_startedDateSupplier = null;
		}

		return startedDate;
	}

	public void setStartedDate(Date startedDate) {
		this.startedDate = startedDate;

		_startedDateSupplier = null;
	}

	@JsonIgnore
	public void setStartedDate(
		UnsafeSupplier<Date, Exception> startedDateUnsafeSupplier) {

		_startedDateSupplier = () -> {
			try {
				return startedDateUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Date startedDate;

	@JsonIgnore
	private Supplier<Date> _startedDateSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getStatus() {
		if (_statusSupplier != null) {
			status = _statusSupplier.get();

			_statusSupplier = null;
		}

		return status;
	}

	public void setStatus(String status) {
		this.status = status;

		_statusSupplier = null;
	}

	@JsonIgnore
	public void setStatus(
		UnsafeSupplier<String, Exception> statusUnsafeSupplier) {

		_statusSupplier = () -> {
			try {
				return statusUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected String status;

	@JsonIgnore
	private Supplier<String> _statusSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Integer getTotalRows() {
		if (_totalRowsSupplier != null) {
			totalRows = _totalRowsSupplier.get();

			_totalRowsSupplier = null;
		}

		return totalRows;
	}

	public void setTotalRows(Integer totalRows) {
		this.totalRows = totalRows;

		_totalRowsSupplier = null;
	}

	@JsonIgnore
	public void setTotalRows(
		UnsafeSupplier<Integer, Exception> totalRowsUnsafeSupplier) {

		_totalRowsSupplier = () -> {
			try {
				return totalRowsUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Integer totalRows;

	@JsonIgnore
	private Supplier<Integer> _totalRowsSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Integer getUpdatedRows() {
		if (_updatedRowsSupplier != null) {
			updatedRows = _updatedRowsSupplier.get();

			_updatedRowsSupplier = null;
		}

		return updatedRows;
	}

	public void setUpdatedRows(Integer updatedRows) {
		this.updatedRows = updatedRows;

		_updatedRowsSupplier = null;
	}

	@JsonIgnore
	public void setUpdatedRows(
		UnsafeSupplier<Integer, Exception> updatedRowsUnsafeSupplier) {

		_updatedRowsSupplier = () -> {
			try {
				return updatedRowsUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	protected Integer updatedRows;

	@JsonIgnore
	private Supplier<Integer> _updatedRowsSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof ContentImportJob)) {
			return false;
		}

		ContentImportJob contentImportJob = (ContentImportJob)object;

		return Objects.equals(toString(), contentImportJob.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		DateFormat liferayToJSONDateFormat = new SimpleDateFormat(
			"yyyy-MM-dd'T'HH:mm:ss'Z'");

		Date completedDate = getCompletedDate();

		if (completedDate != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"completedDate\": ");

			sb.append("\"");

			sb.append(liferayToJSONDateFormat.format(completedDate));

			sb.append("\"");
		}

		Integer createdRows = getCreatedRows();

		if (createdRows != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"createdRows\": ");

			sb.append(createdRows);
		}

		String errorMessage = getErrorMessage();

		if (errorMessage != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"errorMessage\": ");

			sb.append("\"");

			sb.append(_escape(errorMessage));

			sb.append("\"");
		}

		String externalReferenceCode = getExternalReferenceCode();

		if (externalReferenceCode != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"externalReferenceCode\": ");

			sb.append("\"");

			sb.append(_escape(externalReferenceCode));

			sb.append("\"");
		}

		Integer failedRows = getFailedRows();

		if (failedRows != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"failedRows\": ");

			sb.append(failedRows);
		}

		Long fileEntryId = getFileEntryId();

		if (fileEntryId != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"fileEntryId\": ");

			sb.append(fileEntryId);
		}

		String fileName = getFileName();

		if (fileName != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"fileName\": ");

			sb.append("\"");

			sb.append(_escape(fileName));

			sb.append("\"");
		}

		Long id = getId();

		if (id != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"id\": ");

			sb.append(id);
		}

		String importProfileKey = getImportProfileKey();

		if (importProfileKey != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"importProfileKey\": ");

			sb.append("\"");

			sb.append(_escape(importProfileKey));

			sb.append("\"");
		}

		String packageSchemaVersion = getPackageSchemaVersion();

		if (packageSchemaVersion != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"packageSchemaVersion\": ");

			sb.append("\"");

			sb.append(_escape(packageSchemaVersion));

			sb.append("\"");
		}

		String sha256 = getSha256();

		if (sha256 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"sha256\": ");

			sb.append("\"");

			sb.append(_escape(sha256));

			sb.append("\"");
		}

		Integer skippedRows = getSkippedRows();

		if (skippedRows != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"skippedRows\": ");

			sb.append(skippedRows);
		}

		Date startedDate = getStartedDate();

		if (startedDate != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"startedDate\": ");

			sb.append("\"");

			sb.append(liferayToJSONDateFormat.format(startedDate));

			sb.append("\"");
		}

		String status = getStatus();

		if (status != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"status\": ");

			sb.append("\"");

			sb.append(_escape(status));

			sb.append("\"");
		}

		Integer totalRows = getTotalRows();

		if (totalRows != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"totalRows\": ");

			sb.append(totalRows);
		}

		Integer updatedRows = getUpdatedRows();

		if (updatedRows != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"updatedRows\": ");

			sb.append(updatedRows);
		}

		sb.append("}");

		return sb.toString();
	}

	@io.swagger.v3.oas.annotations.media.Schema(
		accessMode = io.swagger.v3.oas.annotations.media.Schema.AccessMode.READ_ONLY,
		defaultValue = "com.nexcent.training.rest.dto.v1_0.ContentImportJob",
		name = "x-class-name"
	)
	public String xClassName;

	private static String _escape(Object object) {
		return StringUtil.replace(
			String.valueOf(object), _JSON_ESCAPE_STRINGS[0],
			_JSON_ESCAPE_STRINGS[1]);
	}

	private static boolean _isArray(Object value) {
		if (value == null) {
			return false;
		}

		Class<?> clazz = value.getClass();

		return clazz.isArray();
	}

	private static String _toJSON(Map<String, ?> map) {
		StringBuilder sb = new StringBuilder("{");

		@SuppressWarnings("unchecked")
		Set set = map.entrySet();

		@SuppressWarnings("unchecked")
		Iterator<Map.Entry<String, ?>> iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry<String, ?> entry = iterator.next();

			sb.append("\"");
			sb.append(_escape(entry.getKey()));
			sb.append("\": ");

			Object value = entry.getValue();

			if (_isArray(value)) {
				sb.append("[");

				Object[] valueArray = (Object[])value;

				for (int i = 0; i < valueArray.length; i++) {
					if (valueArray[i] instanceof Map) {
						sb.append(_toJSON((Map<String, ?>)valueArray[i]));
					}
					else if (valueArray[i] instanceof String) {
						sb.append("\"");
						sb.append(valueArray[i]);
						sb.append("\"");
					}
					else {
						sb.append(valueArray[i]);
					}

					if ((i + 1) < valueArray.length) {
						sb.append(", ");
					}
				}

				sb.append("]");
			}
			else if (value instanceof Map) {
				sb.append(_toJSON((Map<String, ?>)value));
			}
			else if (value instanceof String) {
				sb.append("\"");
				sb.append(_escape(value));
				sb.append("\"");
			}
			else {
				sb.append(value);
			}

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

	private static final String[][] _JSON_ESCAPE_STRINGS = {
		{"\\", "\"", "\b", "\f", "\n", "\r", "\t"},
		{"\\\\", "\\\"", "\\b", "\\f", "\\n", "\\r", "\\t"}
	};

	private Map<String, Serializable> _extendedProperties;

}
// LIFERAY-REST-BUILDER-HASH:-729042486