package com.nexcent.training.content.importer;

import java.util.List;

public interface ContentImportHandlerRegistry {

    public ContentImportHandler getHandler(String importProfileKey)
        throws ContentImportException;

    public List<ContentImportHandler> getHandlers();
}
