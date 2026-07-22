package com.nexcent.training.article.importer.internal;

import com.liferay.dynamic.data.mapping.model.DDMForm;
import com.liferay.dynamic.data.mapping.model.DDMFormField;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;

public class ArticleStructureContractValidatorTest {

    @Test
    public void testAcceptsExpectedStructure() {
        List<ArticleStructureContractValidator.ValidationError> errors =
            new ArticleStructureContractValidator().validate(_form());

        Assert.assertTrue(errors.toString(), errors.isEmpty());
    }

    @Test
    public void testReportsMissingTypeAndRequiredFlag() {
        DDMForm form = _form();
        DDMFormField body = form.getDDMFormFieldsReferencesMap(true).get("body");

        body.setType("text");
        body.setRequired(false);

        List<ArticleStructureContractValidator.ValidationError> errors =
            new ArticleStructureContractValidator().validate(form);

        Assert.assertTrue(
            _hasCode(errors, "STRUCTURE_FIELD_TYPE_MISMATCH", "body"));
        Assert.assertTrue(
            _hasCode(errors, "STRUCTURE_REQUIRED_FLAG_MISMATCH", "body"));
    }

    @Test
    public void testReportsMissingAndUnsupportedRequiredFields() {
        DDMForm form = _formWithout("coverImage");

        form.addDDMFormField(_field("readingTime", "numeric", true));

        List<ArticleStructureContractValidator.ValidationError> errors =
            new ArticleStructureContractValidator().validate(form);

        Assert.assertTrue(
            _hasCode(errors, "STRUCTURE_FIELD_MISSING", "coverImage"));
        Assert.assertTrue(
            _hasCode(
                errors, "UNSUPPORTED_REQUIRED_STRUCTURE_FIELD",
                "readingTime"));
    }

    private DDMFormField _field(
        String fieldReference, String type, boolean required) {

        DDMFormField field = new DDMFormField(fieldReference, type);

        field.setDataType(
            "numeric".equals(type) ? "integer" :
                ("checkbox".equals(type) ? "boolean" : "string"));
        field.setFieldReference(fieldReference);
        field.setRequired(required);

        return field;
    }

    private DDMForm _form() {
        return _formWithout(null);
    }

    private DDMForm _formWithout(String excludedFieldReference) {
        DDMForm form = new DDMForm();

        _add(form, excludedFieldReference, "summary", "text");
        _add(form, excludedFieldReference, "body", "rich_text");
        _add(form, excludedFieldReference, "coverImage", "image");
        _add(form, excludedFieldReference, "coverImageAlt", "text");
        _add(form, excludedFieldReference, "authorName", "text");
        _add(form, excludedFieldReference, "featured", "checkbox");
        _add(form, excludedFieldReference, "sortOrder", "numeric");

        return form;
    }

    private void _add(
        DDMForm form, String excludedFieldReference, String fieldReference,
        String type) {

        if (!fieldReference.equals(excludedFieldReference)) {
            form.addDDMFormField(_field(fieldReference, type, true));
        }
    }

    private boolean _hasCode(
        List<ArticleStructureContractValidator.ValidationError> errors,
        String code, String fieldReference) {

        for (ArticleStructureContractValidator.ValidationError error : errors) {
            if (code.equals(error.code) &&
                fieldReference.equals(error.fieldReference)) {

                return true;
            }
        }

        return false;
    }
}
