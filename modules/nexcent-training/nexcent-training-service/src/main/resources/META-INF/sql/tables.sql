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
	fileName VARCHAR(75) null,
	status VARCHAR(75) null,
	totalRows INTEGER,
	successRows INTEGER,
	failedRows INTEGER,
	errorMessage VARCHAR(75) null
);