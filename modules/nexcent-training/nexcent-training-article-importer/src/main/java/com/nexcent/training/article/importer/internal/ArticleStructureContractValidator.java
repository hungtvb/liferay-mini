package com.nexcent.training.article.importer.internal;

import com.liferay.dynamic.data.mapping.model.DDMForm;
import com.liferay.dynamic.data.mapping.model.DDMFormField;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

class ArticleStructureContractValidator {

    List<ValidationError> validate(DDMForm ddmForm) {
        if (ddmForm == null) {
            return Collections.singletonList(
                new ValidationError(
                    "STRUCTURE_NOT_FOUND", "structure",
                    "The NXC Article structure could not be resolved"));
        }

        Map<String, DDMFormField> fields =
            ddmForm.getDDMFormFieldsReferencesMap(true);
        List<ValidationError> errors = new ArrayList<>();

        for (Map.Entry<String, FieldContract> entry :
                _FIELD_CONTRACTS.entrySet()) {

            String fieldReference = entry.getKey();
            FieldContract contract = entry.getValue();
            DDMFormField field = fields.get(fieldReference);

            if (field == null) {
                errors.add(
                    new ValidationError(
                        "STRUCTURE_FIELD_MISSING", fieldReference,
                        "Required structure field is missing: " +
                            fieldReference));

                continue;
            }

            String normalizedType = _normalize(field.getType());

            if (!contract.acceptedTypes.contains(normalizedType)) {
                errors.add(
                    new ValidationError(
                        "STRUCTURE_FIELD_TYPE_MISMATCH", fieldReference,
                        "Field " + fieldReference + " has type " +
                            field.getType() + " (data type " +
                            field.getDataType() + "); expected one of " +
                            contract.displayTypes));
            }

            if (field.isRequired() != contract.required) {
                errors.add(
                    new ValidationError(
                        "STRUCTURE_REQUIRED_FLAG_MISMATCH", fieldReference,
                        "Field " + fieldReference + " required flag is " +
                            field.isRequired() + "; expected " +
                            contract.required));
            }
        }

        for (Map.Entry<String, DDMFormField> entry : fields.entrySet()) {
            DDMFormField field = entry.getValue();

            if (field.isRequired() &&
                !_FIELD_CONTRACTS.containsKey(entry.getKey())) {

                errors.add(
                    new ValidationError(
                        "UNSUPPORTED_REQUIRED_STRUCTURE_FIELD", entry.getKey(),
                        "Required structure field is not supplied by the " +
                            "NXC_ARTICLE_V1 package: " + entry.getKey()));
            }
        }

        return errors;
    }

    private static FieldContract _contract(
        boolean required, String... acceptedTypes) {

        return new FieldContract(required, acceptedTypes);
    }

    private static String _normalize(String value) {
        if (value == null) {
            return "";
        }

        return value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }

    private static final Map<String, FieldContract> _FIELD_CONTRACTS;

    static {
        Map<String, FieldContract> contracts = new LinkedHashMap<>();

        contracts.put("summary", _contract(true, "text", "textarea"));
        contracts.put("body", _contract(true, "richtext"));
        contracts.put("coverImage", _contract(true, "image"));
        contracts.put("coverImageAlt", _contract(true, "text"));
        contracts.put("authorName", _contract(true, "text"));
        contracts.put("featured", _contract(true, "boolean", "checkbox"));
        contracts.put(
            "sortOrder", _contract(true, "integer", "number", "numeric"));

        _FIELD_CONTRACTS = Collections.unmodifiableMap(contracts);
    }

    static class ValidationError {

        ValidationError(String code, String fieldReference, String message) {
            this.code = code;
            this.fieldReference = fieldReference;
            this.message = message;
        }

        final String code;
        final String fieldReference;
        final String message;
    }

    private static class FieldContract {

        private FieldContract(boolean required, String... acceptedTypes) {
            this.acceptedTypes = Arrays.stream(
                acceptedTypes
            ).map(
                ArticleStructureContractValidator::_normalize
            ).collect(
                Collectors.toUnmodifiableSet()
            );
            this.displayTypes = String.join(", ", acceptedTypes);
            this.required = required;
        }

        private final Set<String> acceptedTypes;
        private final String displayTypes;
        private final boolean required;
    }
}
