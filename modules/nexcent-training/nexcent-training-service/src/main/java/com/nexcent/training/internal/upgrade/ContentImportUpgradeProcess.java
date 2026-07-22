package com.nexcent.training.internal.upgrade;

import com.liferay.portal.kernel.upgrade.UpgradeProcess;

public class ContentImportUpgradeProcess extends UpgradeProcess {

    @Override
    protected void doUpgrade() throws Exception {
        alterTableAddColumn(
            "NXC_ImportJob", "importProfileKey", "VARCHAR(75) null");
        alterTableAddColumn(
            "NXC_ImportJob", "packageSchemaVersion", "VARCHAR(75) null");

        alterColumnName(
            "NXC_ImportJobItem", "articleERC", "targetERC VARCHAR(75) null");
        alterTableAddColumn(
            "NXC_ImportJobItem", "targetType", "VARCHAR(75) null");
        alterTableAddColumn(
            "NXC_ImportJobItem", "sheetName", "VARCHAR(75) null");

        runSQL(
            "update NXC_ImportJob set importProfileKey = " +
                "'NXC_ARTICLE_V1', packageSchemaVersion = '0.9' " +
                    "where importProfileKey is null");
        runSQL(
            "update NXC_ImportJobItem set targetType = " +
                "'STRUCTURED_CONTENT', sheetName = 'Articles' " +
                    "where targetType is null");

        runSQL("drop index IX_B5D8A8BB on NXC_ImportJobItem");
        runSQL(
            "create unique index IX_E64EC9B1 on NXC_ImportJobItem " +
                "(importJobId, sheetName, rowNumber)");
    }
}
