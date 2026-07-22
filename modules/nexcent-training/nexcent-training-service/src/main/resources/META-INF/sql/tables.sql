create table NXC_ArticleImportState (
	articleImportStateId LONG not null primary key,
	groupId LONG,
	companyId LONG,
	createDate DATE null,
	modifiedDate DATE null,
	articleERC VARCHAR(75) null,
	locale VARCHAR(75) null,
	payloadHash VARCHAR(75) null,
	lastImportJobId LONG
);

create table NXC_ImportJob (
	uuid_ VARCHAR(75) null,
	importJobId LONG not null primary key,
	groupId LONG,
	companyId LONG,
	userId LONG,
	userName VARCHAR(75) null,
	createDate DATE null,
	modifiedDate DATE null,
	jobKey VARCHAR(75) null,
	fileEntryId LONG,
	fileName VARCHAR(75) null,
	sha256 VARCHAR(75) null,
	importProfileKey VARCHAR(75) null,
	packageSchemaVersion VARCHAR(75) null,
	structureERC VARCHAR(75) null,
	status VARCHAR(75) null,
	totalRows INTEGER,
	createdRows INTEGER,
	updatedRows INTEGER,
	skippedRows INTEGER,
	failedRows INTEGER,
	startedDate DATE null,
	completedDate DATE null,
	errorMessage VARCHAR(75) null
);

create table NXC_ImportJobItem (
	importJobItemId LONG not null primary key,
	groupId LONG,
	companyId LONG,
	createDate DATE null,
	modifiedDate DATE null,
	importJobId LONG,
	rowNumber INTEGER,
	targetType VARCHAR(75) null,
	targetERC VARCHAR(75) null,
	sheetName VARCHAR(75) null,
	locale VARCHAR(75) null,
	operation VARCHAR(75) null,
	result VARCHAR(75) null,
	severity VARCHAR(75) null,
	messageCode VARCHAR(75) null,
	message VARCHAR(75) null,
	payloadHash VARCHAR(75) null
);