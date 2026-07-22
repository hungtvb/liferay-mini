create unique index IX_56C198EA on NXC_ArticleImportState (groupId, articleERC[$COLUMN_LENGTH:75$], locale[$COLUMN_LENGTH:75$]);

create unique index IX_9BCC5A08 on NXC_ImportJob (groupId, jobKey[$COLUMN_LENGTH:75$]);
create index IX_4BCA3098 on NXC_ImportJob (groupId, status[$COLUMN_LENGTH:75$]);
create unique index IX_661A39C2 on NXC_ImportJob (groupId, uuid_[$COLUMN_LENGTH:75$]);
create index IX_2209ABC on NXC_ImportJob (uuid_[$COLUMN_LENGTH:75$]);

create unique index IX_E64EC9B1 on NXC_ImportJobItem (importJobId, sheetName[$COLUMN_LENGTH:75$], rowNumber);