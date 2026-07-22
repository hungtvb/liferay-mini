package com.nexcent.training.internal.upgrade;

import com.liferay.portal.kernel.upgrade.UpgradeProcess;

public class ArticleImportUpgradeProcess extends UpgradeProcess {

    @Override
    protected void doUpgrade() throws Exception {
        alterTableAddColumn("NXC_ImportJob", "fileEntryId", "LONG");
        alterTableAddColumn("NXC_ImportJob", "sha256", "VARCHAR(75) null");
        alterTableAddColumn(
            "NXC_ImportJob", "structureERC", "VARCHAR(75) null");
        alterTableAddColumn("NXC_ImportJob", "createdRows", "INTEGER");
        alterTableAddColumn("NXC_ImportJob", "updatedRows", "INTEGER");
        alterTableAddColumn("NXC_ImportJob", "skippedRows", "INTEGER");
        alterTableAddColumn("NXC_ImportJob", "startedDate", "DATE null");
        alterTableAddColumn("NXC_ImportJob", "completedDate", "DATE null");

        runSQL(
            "update NXC_ImportJob set createdRows = successRows, " +
                "updatedRows = 0, skippedRows = 0");

        runSQL(
            "create table NXC_ArticleImportState (" +
                "articleImportStateId LONG not null primary key, " +
                "groupId LONG, companyId LONG, createDate DATE null, " +
                "modifiedDate DATE null, articleERC VARCHAR(75) null, " +
                "locale VARCHAR(75) null, payloadHash VARCHAR(75) null, " +
                "lastImportJobId LONG)");
        runSQL(
            "create unique index IX_NXC_AIS_GAL on " +
                "NXC_ArticleImportState (groupId, articleERC, locale)");

        runSQL(
            "create table NXC_ImportJobItem (" +
                "importJobItemId LONG not null primary key, groupId LONG, " +
                "companyId LONG, createDate DATE null, modifiedDate DATE null, " +
                "importJobId LONG, rowNumber INTEGER, " +
                "articleERC VARCHAR(75) null, locale VARCHAR(75) null, " +
                "operation VARCHAR(75) null, result VARCHAR(75) null, " +
                "severity VARCHAR(75) null, messageCode VARCHAR(75) null, " +
                "message TEXT null, payloadHash VARCHAR(75) null)");
        runSQL(
            "create index IX_NXC_IJI_J on NXC_ImportJobItem (importJobId)");
        runSQL(
            "create unique index IX_NXC_IJI_JR on " +
                "NXC_ImportJobItem (importJobId, rowNumber)");
    }
}
