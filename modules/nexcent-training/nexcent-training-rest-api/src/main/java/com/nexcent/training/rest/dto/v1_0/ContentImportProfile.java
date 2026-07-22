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
@GraphQLName("ContentImportProfile")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "ContentImportProfile")
public class ContentImportProfile implements Serializable {

	public static ContentImportProfile toDTO(String json) {
		return ObjectMapperUtil.readValue(ContentImportProfile.class, json);
	}

	public static ContentImportProfile unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(
			ContentImportProfile.class, json);
	}

	@io.swagger.v3.oas.annotations.media.Schema
	public String getDisabledReasonCode() {
		if (_disabledReasonCodeSupplier != null) {
			disabledReasonCode = _disabledReasonCodeSupplier.get();

			_disabledReasonCodeSupplier = null;
		}

		return disabledReasonCode;
	}

	public void setDisabledReasonCode(String disabledReasonCode) {
		this.disabledReasonCode = disabledReasonCode;

		_disabledReasonCodeSupplier = null;
	}

	@JsonIgnore
	public void setDisabledReasonCode(
		UnsafeSupplier<String, Exception> disabledReasonCodeUnsafeSupplier) {

		_disabledReasonCodeSupplier = () -> {
			try {
				return disabledReasonCodeUnsafeSupplier.get();
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
	protected String disabledReasonCode;

	@JsonIgnore
	private Supplier<String> _disabledReasonCodeSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Boolean getEnabled() {
		if (_enabledSupplier != null) {
			enabled = _enabledSupplier.get();

			_enabledSupplier = null;
		}

		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;

		_enabledSupplier = null;
	}

	@JsonIgnore
	public void setEnabled(
		UnsafeSupplier<Boolean, Exception> enabledUnsafeSupplier) {

		_enabledSupplier = () -> {
			try {
				return enabledUnsafeSupplier.get();
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
	protected Boolean enabled;

	@JsonIgnore
	private Supplier<Boolean> _enabledSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getKey() {
		if (_keySupplier != null) {
			key = _keySupplier.get();

			_keySupplier = null;
		}

		return key;
	}

	public void setKey(String key) {
		this.key = key;

		_keySupplier = null;
	}

	@JsonIgnore
	public void setKey(UnsafeSupplier<String, Exception> keyUnsafeSupplier) {
		_keySupplier = () -> {
			try {
				return keyUnsafeSupplier.get();
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
	protected String key;

	@JsonIgnore
	private Supplier<String> _keySupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getName() {
		if (_nameSupplier != null) {
			name = _nameSupplier.get();

			_nameSupplier = null;
		}

		return name;
	}

	public void setName(String name) {
		this.name = name;

		_nameSupplier = null;
	}

	@JsonIgnore
	public void setName(UnsafeSupplier<String, Exception> nameUnsafeSupplier) {
		_nameSupplier = () -> {
			try {
				return nameUnsafeSupplier.get();
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
	protected String name;

	@JsonIgnore
	private Supplier<String> _nameSupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public String getSchemaVersion() {
		if (_schemaVersionSupplier != null) {
			schemaVersion = _schemaVersionSupplier.get();

			_schemaVersionSupplier = null;
		}

		return schemaVersion;
	}

	public void setSchemaVersion(String schemaVersion) {
		this.schemaVersion = schemaVersion;

		_schemaVersionSupplier = null;
	}

	@JsonIgnore
	public void setSchemaVersion(
		UnsafeSupplier<String, Exception> schemaVersionUnsafeSupplier) {

		_schemaVersionSupplier = () -> {
			try {
				return schemaVersionUnsafeSupplier.get();
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
	protected String schemaVersion;

	@JsonIgnore
	private Supplier<String> _schemaVersionSupplier;

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

		if (!(object instanceof ContentImportProfile)) {
			return false;
		}

		ContentImportProfile contentImportProfile =
			(ContentImportProfile)object;

		return Objects.equals(toString(), contentImportProfile.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		String disabledReasonCode = getDisabledReasonCode();

		if (disabledReasonCode != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"disabledReasonCode\": ");

			sb.append("\"");

			sb.append(_escape(disabledReasonCode));

			sb.append("\"");
		}

		Boolean enabled = getEnabled();

		if (enabled != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"enabled\": ");

			sb.append(enabled);
		}

		String key = getKey();

		if (key != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"key\": ");

			sb.append("\"");

			sb.append(_escape(key));

			sb.append("\"");
		}

		String name = getName();

		if (name != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"name\": ");

			sb.append("\"");

			sb.append(_escape(name));

			sb.append("\"");
		}

		String schemaVersion = getSchemaVersion();

		if (schemaVersion != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"schemaVersion\": ");

			sb.append("\"");

			sb.append(_escape(schemaVersion));

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
		defaultValue = "com.nexcent.training.rest.dto.v1_0.ContentImportProfile",
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
// LIFERAY-REST-BUILDER-HASH:-1161375860