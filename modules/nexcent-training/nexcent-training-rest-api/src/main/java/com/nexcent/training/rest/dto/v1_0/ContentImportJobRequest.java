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

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

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
@GraphQLName("ContentImportJobRequest")
@io.swagger.v3.oas.annotations.media.Schema(
	requiredProperties = {
		"externalReferenceCode", "importProfileKey", "packageFileEntryId"
	}
)
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "ContentImportJobRequest")
public class ContentImportJobRequest implements Serializable {

	public static ContentImportJobRequest toDTO(String json) {
		return ObjectMapperUtil.readValue(ContentImportJobRequest.class, json);
	}

	public static ContentImportJobRequest unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(
			ContentImportJobRequest.class, json);
	}

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
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	@NotEmpty
	protected String externalReferenceCode;

	@JsonIgnore
	private Supplier<String> _externalReferenceCodeSupplier;

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
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	@NotEmpty
	protected String importProfileKey;

	@JsonIgnore
	private Supplier<String> _importProfileKeySupplier;

	@io.swagger.v3.oas.annotations.media.Schema
	public Long getPackageFileEntryId() {
		if (_packageFileEntryIdSupplier != null) {
			packageFileEntryId = _packageFileEntryIdSupplier.get();

			_packageFileEntryIdSupplier = null;
		}

		return packageFileEntryId;
	}

	public void setPackageFileEntryId(Long packageFileEntryId) {
		this.packageFileEntryId = packageFileEntryId;

		_packageFileEntryIdSupplier = null;
	}

	@JsonIgnore
	public void setPackageFileEntryId(
		UnsafeSupplier<Long, Exception> packageFileEntryIdUnsafeSupplier) {

		_packageFileEntryIdSupplier = () -> {
			try {
				return packageFileEntryIdUnsafeSupplier.get();
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
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	@NotNull
	protected Long packageFileEntryId;

	@JsonIgnore
	private Supplier<Long> _packageFileEntryIdSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof ContentImportJobRequest)) {
			return false;
		}

		ContentImportJobRequest contentImportJobRequest =
			(ContentImportJobRequest)object;

		return Objects.equals(toString(), contentImportJobRequest.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

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

		Long packageFileEntryId = getPackageFileEntryId();

		if (packageFileEntryId != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"packageFileEntryId\": ");

			sb.append(packageFileEntryId);
		}

		sb.append("}");

		return sb.toString();
	}

	@io.swagger.v3.oas.annotations.media.Schema(
		accessMode = io.swagger.v3.oas.annotations.media.Schema.AccessMode.READ_ONLY,
		defaultValue = "com.nexcent.training.rest.dto.v1_0.ContentImportJobRequest",
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
// LIFERAY-REST-BUILDER-HASH:-1143400531