package com.nexcent.training.service.impl;

import com.liferay.portal.kernel.exception.PortalException;
import com.nexcent.training.model.ImportJobItem;
import com.nexcent.training.service.base.ImportJobItemLocalServiceBaseImpl;

import java.util.Date;
import java.util.List;

public class ImportJobItemLocalServiceImpl
    extends ImportJobItemLocalServiceBaseImpl {

    public ImportJobItem addImportJobItem(
        long companyId, long groupId, long importJobId, int rowNumber,
        String articleERC, String locale, String operation, String result,
        String severity, String messageCode, String message,
        String payloadHash) {

        long importJobItemId = counterLocalService.increment(
            ImportJobItem.class.getName());
        Date now = new Date();

        ImportJobItem item = importJobItemPersistence.create(importJobItemId);

        item.setCompanyId(companyId);
        item.setGroupId(groupId);
        item.setCreateDate(now);
        item.setModifiedDate(now);
        item.setImportJobId(importJobId);
        item.setRowNumber(rowNumber);
        item.setArticleERC(articleERC);
        item.setLocale(locale);
        item.setOperation(operation);
        item.setResult(result);
        item.setSeverity(severity);
        item.setMessageCode(messageCode);
        item.setMessage(message);
        item.setPayloadHash(payloadHash);

        return importJobItemPersistence.update(item);
    }

    public void deleteImportJobItems(long importJobId) {
        importJobItemPersistence.removeByJ(importJobId);
    }

    public List<ImportJobItem> getImportJobItems(
        long importJobId, int start, int end) {

        return importJobItemPersistence.findByJ(importJobId, start, end);
    }

    public int getImportJobItemsCount(long importJobId) {
        return importJobItemPersistence.countByJ(importJobId);
    }

    public ImportJobItem updateImportJobItemResult(
            long importJobItemId, String result, String severity,
            String messageCode, String message)
        throws PortalException {

        ImportJobItem item = importJobItemPersistence.findByPrimaryKey(
            importJobItemId);

        item.setModifiedDate(new Date());
        item.setResult(result);
        item.setSeverity(severity);
        item.setMessageCode(messageCode);
        item.setMessage(message);

        return importJobItemPersistence.update(item);
    }
}
