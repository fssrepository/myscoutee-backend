package com.raxim.myscoutee.domain.groups.service;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

/** Workspace ownership is stamped at the write boundary, never accepted from a DTO. */
@Component
public class CommunityWorkspaceDocumentListener extends AbstractMongoEventListener<Object> {
    private final ObjectProvider<UsersRepository> users;
    public CommunityWorkspaceDocumentListener(ObjectProvider<UsersRepository> users) { this.users = users; }
    @Override public void onBeforeConvert(BeforeConvertEvent<Object> event) {
        Object source = event.getSource();
        String ownerId = source instanceof ActivityEvent activity ? activity.getCreatorUserId()
                : source instanceof Asset asset ? asset.getOwnerUserId() : null;
        if (ownerId == null || ownerId.isBlank()) return;
        var owner = users.getObject().findByUserId(ownerId).orElse(null);
        String groupId = owner == null ? null : owner.getWorkspaceGroupId();
        if (source instanceof ActivityEvent activity) activity.setWorkspaceGroupId(groupId);
        if (source instanceof Asset asset) asset.setWorkspaceGroupId(groupId);
    }
}
