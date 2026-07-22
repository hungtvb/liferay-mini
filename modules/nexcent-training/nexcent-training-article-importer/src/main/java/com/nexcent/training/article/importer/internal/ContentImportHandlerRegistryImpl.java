package com.nexcent.training.article.importer.internal;

import com.nexcent.training.content.importer.ContentImportException;
import com.nexcent.training.content.importer.ContentImportHandler;
import com.nexcent.training.content.importer.ContentImportHandlerRegistry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;

@Component(service = ContentImportHandlerRegistry.class)
public class ContentImportHandlerRegistryImpl
    implements ContentImportHandlerRegistry {

    @Override
    public ContentImportHandler getHandler(String importProfileKey)
        throws ContentImportException {

        ContentImportHandler handler = _handlers.get(importProfileKey);

        if (handler == null) {
            throw new ContentImportException(
                "IMPORT_PROFILE_NOT_FOUND", importProfileKey);
        }

        return handler;
    }

    @Override
    public List<ContentImportHandler> getHandlers() {
        List<ContentImportHandler> handlers = new ArrayList<>(
            _handlers.values());

        handlers.sort(
            (left, right) -> left.getImportProfileKey().compareTo(
                right.getImportProfileKey()));

        return Collections.unmodifiableList(handlers);
    }

    @Reference(
        cardinality = ReferenceCardinality.MULTIPLE,
        policy = ReferencePolicy.DYNAMIC,
        service = ContentImportHandler.class
    )
    protected void bindContentImportHandler(ContentImportHandler handler) {
        String key = handler.getImportProfileKey();
        ContentImportHandler previous = _handlers.putIfAbsent(key, handler);

        if ((previous != null) && (previous != handler)) {
            throw new IllegalStateException(
                "Duplicate ContentImportHandler profile key " + key);
        }
    }

    protected void unbindContentImportHandler(ContentImportHandler handler) {
        _handlers.remove(handler.getImportProfileKey(), handler);
    }

    private final Map<String, ContentImportHandler> _handlers =
        new ConcurrentHashMap<>();
}
