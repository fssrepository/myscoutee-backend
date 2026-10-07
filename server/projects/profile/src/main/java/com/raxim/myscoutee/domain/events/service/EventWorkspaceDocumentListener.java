package com.raxim.myscoutee.domain.events.service;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.accounts.api.ProfileDirectory;
/** Stamp workspace ownership from the owner profile at the write boundary. */
@Component
public class EventWorkspaceDocumentListener extends AbstractMongoEventListener<ActivityEvent> {
    private final ObjectProvider<ProfileDirectory> profiles;
    public EventWorkspaceDocumentListener(ObjectProvider<ProfileDirectory> profiles) { this.profiles = profiles; }
    @Override public void onBeforeConvert(BeforeConvertEvent<ActivityEvent> event) {
        var source = event.getSource();
        String ownerId = source.getCreatorUserId();
        if (ownerId == null || ownerId.isBlank()) return;
        var owner = profiles.getObject().findByUserId(ownerId).orElse(null);
        source.setWorkspaceGroupId(owner == null ? null : owner.getWorkspaceGroupId());
    }
}
