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
@GraphQLName("ContentImportJobItem")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "ContentImportJobItem")
public class ContentImportJobItem implements Serializable {

	public static ContentImportJobItem toDTO(String json) {
		return ObjectMapperUtil.readValue(ContentImportJobItem.class, json);
	}

	public static ContentImportJobItem unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(
			ContentImportJobItem.class, json);
	}

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
	public String getLocale() {
		if (_localeSupplier != null) {
			locale = _localeSupplier.get();

			_localeSupplier = null;
		}

		return locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;

		_localeSupplier = null;
	}

	@JsonIgnore
	public void setLocale(
		UnsafeSupplier<String, Exception> localeUnsafeSupplier) {

		_localeSupplier = () -> {
			try {
				return localeUnsafeSupplier.get();
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
	protected String locale;

	@JsonIgnore
	private Supplier<String> _localeSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getMessage() {
		if (_messageSupplier != null) {
			message = _messageSupplier.get();

			_messageSupplier = null;
		}

		return message;
	}

	public void setMessage(String message) {
		this.message = message;

		_messageSupplier = null;
	}

	@JsonIgnore
	public void setMessage(
		UnsafeSupplier<String, Exception> messageUnsafeSupplier) {

		_messageSupplier = () -> {
			try {
				return messageUnsafeSupplier.get();
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
	protected String message;

	@JsonIgnore
	private Supplier<String> _messageSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getMessageCode() {
		if (_messageCodeSupplier != null) {
			messageCode = _messageCodeSupplier.get();

			_messageCodeSupplier = null;
		}

		return messageCode;
	}

	public void setMessageCode(String messageCode) {
		this.messageCode = messageCode;

		_messageCodeSupplier = null;
	}

	@JsonIgnore
	public void setMessageCode(
		UnsafeSupplier<String, Exception> messageCodeUnsafeSupplier) {

		_messageCodeSupplier = () -> {
			try {
				return messageCodeUnsafeSupplier.get();
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
	protected String messageCode;

	@JsonIgnore
	private Supplier<String> _messageCodeSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getOperation() {
		if (_operationSupplier != null) {
			operation = _operationSupplier.get();

			_operationSupplier = null;
		}

		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;

		_operationSupplier = null;
	}

	@JsonIgnore
	public void setOperation(
		UnsafeSupplier<String, Exception> operationUnsafeSupplier) {

		_operationSupplier = () -> {
			try {
				return operationUnsafeSupplier.get();
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
	protected String operation;

	@JsonIgnore
	private Supplier<String> _operationSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getPayloadHash() {
		if (_payloadHashSupplier != null) {
			payloadHash = _payloadHashSupplier.get();

			_payloadHashSupplier = null;
		}

		return payloadHash;
	}

	public void setPayloadHash(String payloadHash) {
		this.payloadHash = payloadHash;

		_payloadHashSupplier = null;
	}

	@JsonIgnore
	public void setPayloadHash(
		UnsafeSupplier<String, Exception> payloadHashUnsafeSupplier) {

		_payloadHashSupplier = () -> {
			try {
				return payloadHashUnsafeSupplier.get();
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
	protected String payloadHash;

	@JsonIgnore
	private Supplier<String> _payloadHashSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getResult() {
		if (_resultSupplier != null) {
			result = _resultSupplier.get();

			_resultSupplier = null;
		}

		return result;
	}

	public void setResult(String result) {
		this.result = result;

		_resultSupplier = null;
	}

	@JsonIgnore
	public void setResult(
		UnsafeSupplier<String, Exception> resultUnsafeSupplier) {

		_resultSupplier = () -> {
			try {
				return resultUnsafeSupplier.get();
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
	protected String result;

	@JsonIgnore
	private Supplier<String> _resultSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Integer getRowNumber() {
		if (_rowNumberSupplier != null) {
			rowNumber = _rowNumberSupplier.get();

			_rowNumberSupplier = null;
		}

		return rowNumber;
	}

	public void setRowNumber(Integer rowNumber) {
		this.rowNumber = rowNumber;

		_rowNumberSupplier = null;
	}

	@JsonIgnore
	public void setRowNumber(
		UnsafeSupplier<Integer, Exception> rowNumberUnsafeSupplier) {

		_rowNumberSupplier = () -> {
			try {
				return rowNumberUnsafeSupplier.get();
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
	protected Integer rowNumber;

	@JsonIgnore
	private Supplier<Integer> _rowNumberSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getSeverity() {
		if (_severitySupplier != null) {
			severity = _severitySupplier.get();

			_severitySupplier = null;
		}

		return severity;
	}

	public void setSeverity(String severity) {
		this.severity = severity;

		_severitySupplier = null;
	}

	@JsonIgnore
	public void setSeverity(
		UnsafeSupplier<String, Exception> severityUnsafeSupplier) {

		_severitySupplier = () -> {
			try {
				return severityUnsafeSupplier.get();
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
	protected String severity;

	@JsonIgnore
	private Supplier<String> _severitySupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getSheetName() {
		if (_sheetNameSupplier != null) {
			sheetName = _sheetNameSupplier.get();

			_sheetNameSupplier = null;
		}

		return sheetName;
	}

	public void setSheetName(String sheetName) {
		this.sheetName = sheetName;

		_sheetNameSupplier = null;
	}

	@JsonIgnore
	public void setSheetName(
		UnsafeSupplier<String, Exception> sheetNameUnsafeSupplier) {

		_sheetNameSupplier = () -> {
			try {
				return sheetNameUnsafeSupplier.get();
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
	protected String sheetName;

	@JsonIgnore
	private Supplier<String> _sheetNameSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getTargetExternalReferenceCode() {
		if (_targetExternalReferenceCodeSupplier != null) {
			targetExternalReferenceCode =
				_targetExternalReferenceCodeSupplier.get();

			_targetExternalReferenceCodeSupplier = null;
		}

		return targetExternalReferenceCode;
	}

	public void setTargetExternalReferenceCode(
		String targetExternalReferenceCode) {

		this.targetExternalReferenceCode = targetExternalReferenceCode;

		_targetExternalReferenceCodeSupplier = null;
	}

	@JsonIgnore
	public void setTargetExternalReferenceCode(
		UnsafeSupplier<String, Exception>
			targetExternalReferenceCodeUnsafeSupplier) {

		_targetExternalReferenceCodeSupplier = () -> {
			try {
				return targetExternalReferenceCodeUnsafeSupplier.get();
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
	protected String targetExternalReferenceCode;

	@JsonIgnore
	private Supplier<String> _targetExternalReferenceCodeSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getTargetType() {
		if (_targetTypeSupplier != null) {
			targetType = _targetTypeSupplier.get();

			_targetTypeSupplier = null;
		}

		return targetType;
	}

	public void setTargetType(String targetType) {
		this.targetType = targetType;

		_targetTypeSupplier = null;
	}

	@JsonIgnore
	public void setTargetType(
		UnsafeSupplier<String, Exception> targetTypeUnsafeSupplier) {

		_targetTypeSupplier = () -> {
			try {
				return targetTypeUnsafeSupplier.get();
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
	protected String targetType;

	@JsonIgnore
	private Supplier<String> _targetTypeSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof ContentImportJobItem)) {
			return false;
		}

		ContentImportJobItem contentImportJobItem =
			(ContentImportJobItem)object;

		return Objects.equals(toString(), contentImportJobItem.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		Long id = getId();

		if (id != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"id\": ");

			sb.append(id);
		}

		String locale = getLocale();

		if (locale != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"locale\": ");

			sb.append("\"");

			sb.append(_escape(locale));

			sb.append("\"");
		}

		String message = getMessage();

		if (message != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"message\": ");

			sb.append("\"");

			sb.append(_escape(message));

			sb.append("\"");
		}

		String messageCode = getMessageCode();

		if (messageCode != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"messageCode\": ");

			sb.append("\"");

			sb.append(_escape(messageCode));

			sb.append("\"");
		}

		String operation = getOperation();

		if (operation != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"operation\": ");

			sb.append("\"");

			sb.append(_escape(operation));

			sb.append("\"");
		}

		String payloadHash = getPayloadHash();

		if (payloadHash != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"payloadHash\": ");

			sb.append("\"");

			sb.append(_escape(payloadHash));

			sb.append("\"");
		}

		String result = getResult();

		if (result != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"result\": ");

			sb.append("\"");

			sb.append(_escape(result));

			sb.append("\"");
		}

		Integer rowNumber = getRowNumber();

		if (rowNumber != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"rowNumber\": ");

			sb.append(rowNumber);
		}

		String severity = getSeverity();

		if (severity != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"severity\": ");

			sb.append("\"");

			sb.append(_escape(severity));

			sb.append("\"");
		}

		String sheetName = getSheetName();

		if (sheetName != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"sheetName\": ");

			sb.append("\"");

			sb.append(_escape(sheetName));

			sb.append("\"");
		}

		String targetExternalReferenceCode = getTargetExternalReferenceCode();

		if (targetExternalReferenceCode != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"targetExternalReferenceCode\": ");

			sb.append("\"");

			sb.append(_escape(targetExternalReferenceCode));

			sb.append("\"");
		}

		String targetType = getTargetType();

		if (targetType != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"targetType\": ");

			sb.append("\"");

			sb.append(_escape(targetType));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	@io.swagger.v3.oas.annotations.media.Schema(
		accessMode = io.swagger.v3.oas.annotations.media.Schema.AccessMode.READ_ONLY,
		defaultValue = "com.nexcent.training.rest.dto.v1_0.ContentImportJobItem",
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
// LIFERAY-REST-BUILDER-HASH:893604978