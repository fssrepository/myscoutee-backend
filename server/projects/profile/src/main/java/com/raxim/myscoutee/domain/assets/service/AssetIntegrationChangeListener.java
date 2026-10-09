package com.raxim.myscoutee.domain.assets.service;
import org.springframework.stereotype.Component;
import org.springframework.data.mongodb.core.mapping.event.*;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.integrations.api.AssetChanges;
@Component
public class AssetIntegrationChangeListener extends AbstractMongoEventListener<Asset> {
    private final AssetChanges changes;
    public AssetIntegrationChangeListener(AssetChanges changes) { this.changes = changes; }
    @Override public void onAfterSave(AfterSaveEvent<Asset> event) {
        if (event != null && event.getSource() != null) changes.enqueue(event.getSource());
    }
}
