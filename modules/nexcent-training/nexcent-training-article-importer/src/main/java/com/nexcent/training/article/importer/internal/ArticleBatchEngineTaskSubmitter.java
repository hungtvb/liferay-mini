package com.nexcent.training.article.importer.internal;

import com.liferay.batch.engine.BatchEngineImportTaskExecutor;
import com.liferay.batch.engine.BatchEngineTaskExecuteStatus;
import com.liferay.batch.engine.BatchEngineTaskOperation;
import com.liferay.batch.engine.configuration.BatchEngineTaskCompanyConfiguration;
import com.liferay.batch.engine.constants.BatchEngineImportTaskConstants;
import com.liferay.batch.engine.constants.CreateStrategy;
import com.liferay.batch.engine.model.BatchEngineImportTask;
import com.liferay.batch.engine.service.BatchEngineImportTaskLocalService;
import com.liferay.headless.delivery.dto.v1_0.StructuredContent;
import com.liferay.petra.executor.PortalExecutorManager;
import com.liferay.portal.configuration.module.configuration.ConfigurationProvider;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.transaction.TransactionCommitCallbackUtil;

import java.io.ByteArrayOutputStream;
import java.io.Serializable;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ArticleBatchEngineTaskSubmitter.class)
public class ArticleBatchEngineTaskSubmitter {

    public BatchEngineImportTask fetch(long companyId, String taskERC) {
        return _batchEngineImportTaskLocalService.
            fetchBatchEngineImportTaskByExternalReferenceCode(
                taskERC, companyId);
    }

    public BatchEngineImportTask submit(
            long companyId, long userId, long siteId, String taskERC,
            byte[] jsonPayload)
        throws PortalException {

        BatchEngineImportTask existing = fetch(companyId, taskERC);

        if (existing != null) {
            String executeStatus = existing.getExecuteStatus();

            if (BatchEngineTaskExecuteStatus.INITIAL.name().equals(
                    executeStatus) ||
                BatchEngineTaskExecuteStatus.STARTED.name().equals(
                    executeStatus)) {

                return existing;
            }

            _batchEngineImportTaskLocalService.deleteBatchEngineImportTask(
                existing.getBatchEngineImportTaskId());
        }

        Map<String, Serializable> parameters = new HashMap<>();

        parameters.put(
            "createStrategy", CreateStrategy.UPSERT.getDBOperation());
        parameters.put("siteId", siteId);

        BatchEngineTaskCompanyConfiguration configuration =
            _configurationProvider.getCompanyConfiguration(
                BatchEngineTaskCompanyConfiguration.class, companyId);
        BatchEngineImportTask task =
            _batchEngineImportTaskLocalService.addBatchEngineImportTask(
                taskERC, companyId, userId, configuration.importBatchSize(),
                null, StructuredContent.class.getName(),
                _zip(jsonPayload), "JSON",
                BatchEngineTaskExecuteStatus.INITIAL.name(),
                Collections.emptyMap(),
                BatchEngineImportTaskConstants.
                    IMPORT_STRATEGY_ON_ERROR_CONTINUE,
                BatchEngineTaskOperation.CREATE.name(), parameters, null);
        ExecutorService executorService =
            _portalExecutorManager.getPortalExecutor(
                _HEADLESS_BATCH_EXECUTOR_NAME);

        if (executorService == null) {
            throw new PortalException(
                "BATCH_ENGINE_EXECUTOR_NOT_AVAILABLE: " +
                    _HEADLESS_BATCH_EXECUTOR_NAME);
        }

        TransactionCommitCallbackUtil.registerCallback(
            () -> executorService.submit(
                () -> _batchEngineImportTaskExecutor.execute(task)));

        return task;
    }

    private byte[] _zip(byte[] jsonPayload) throws PortalException {
        try (ByteArrayOutputStream outputStream =
                new ByteArrayOutputStream();
            ZipOutputStream zipOutputStream = new ZipOutputStream(
                outputStream)) {

            zipOutputStream.putNextEntry(new ZipEntry("items.json"));
            zipOutputStream.write(jsonPayload);
            zipOutputStream.closeEntry();
            zipOutputStream.finish();

            return outputStream.toByteArray();
        }
        catch (Exception exception) {
            throw new PortalException(
                "BATCH_PAYLOAD_ARCHIVE_FAILED", exception);
        }
    }

    private static final String _HEADLESS_BATCH_EXECUTOR_NAME =
        "com.liferay.headless.batch.engine.internal.resource.v1_0." +
            "ImportTaskResourceImpl";

    @Reference
    private BatchEngineImportTaskExecutor _batchEngineImportTaskExecutor;

    @Reference
    private BatchEngineImportTaskLocalService
        _batchEngineImportTaskLocalService;

    @Reference
    private ConfigurationProvider _configurationProvider;

    @Reference
    private PortalExecutorManager _portalExecutorManager;
}
