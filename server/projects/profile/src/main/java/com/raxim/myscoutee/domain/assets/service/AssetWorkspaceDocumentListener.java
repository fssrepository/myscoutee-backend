package com.raxim.myscoutee.domain.assets.service;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.accounts.api.ProfileDirectory;
/** Stamp workspace ownership from the owner profile at the write boundary. */
@Component
public class AssetWorkspaceDocumentListener extends AbstractMongoEventListener<Asset> {
    private final ObjectProvider<ProfileDirectory> profiles;
    public AssetWorkspaceDocumentListener(ObjectProvider<ProfileDirectory> profiles) { this.profiles = profiles; }
    @Override public void onBeforeConvert(BeforeConvertEvent<Asset> event) {
        var source = event.getSource();
        String ownerId = source.getOwnerUserId();
        if (ownerId == null || ownerId.isBlank()) return;
        var owner = profiles.getObject().findByUserId(ownerId).orElse(null);
        source.setWorkspaceGroupId(owner == null ? null : owner.getWorkspaceGroupId());
    }
}
