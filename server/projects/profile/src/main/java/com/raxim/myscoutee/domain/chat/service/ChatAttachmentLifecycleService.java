package com.raxim.myscoutee.domain.chat.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.chat.document.ChatMessage;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;

@Service
public class ChatAttachmentLifecycleService implements com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle {
    private static final String TYPE_EVENT = "event";
    private static final String TYPE_ASSET = "asset";
    private static final String STATUS_AVAILABLE = "available";
    private static final String STATUS_UNAVAILABLE = "unavailable";

    private final org.springframework.data.mongodb.core.MongoTemplate mongo;
    private final ChatMessagesRepository chatMessagesRepository;

    public ChatAttachmentLifecycleService(ChatMessagesRepository chatMessagesRepository,
            org.springframework.data.mongodb.core.MongoTemplate mongo) {
        this.mongo = mongo;

        this.chatMessagesRepository = chatMessagesRepository;
    }

    /** A late delivery must not undo a newer lifecycle transition. The search
     * index contains attachment identity, not status, so no whole-message save is needed. */
    public void project(com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle.Projection projection) {
        if (projection == null || !List.of(TYPE_EVENT, TYPE_ASSET).contains(projection.type())
                || !StringUtils.hasText(projection.entityId()) || projection.revision() < 0)
            throw new IllegalArgumentException("Invalid attachment lifecycle projection");
        var matching = org.springframework.data.mongodb.core.query.Criteria.where("type").is(projection.type())
                .and("entityId").is(projection.entityId());
        var element = org.springframework.data.mongodb.core.query.Criteria.where("attachment.type").is(projection.type())
                .and("attachment.entityId").is(projection.entityId()).orOperator(
                    org.springframework.data.mongodb.core.query.Criteria.where("attachment.lifecycleRevision").exists(false),
                    org.springframework.data.mongodb.core.query.Criteria.where("attachment.lifecycleRevision").lte(projection.revision()));
        var update = new org.springframework.data.mongodb.core.query.Update()
                .set("attachments.$[attachment].status", projection.available() ? STATUS_AVAILABLE : STATUS_UNAVAILABLE)
                .set("attachments.$[attachment].unavailableReason", projection.available() ? null : safeText(projection.reason()))
                .set("attachments.$[attachment].lifecycleRevision", projection.revision()).filterArray(element);
        mongo.updateMulti(org.springframework.data.mongodb.core.query.Query.query(
                org.springframework.data.mongodb.core.query.Criteria.where("attachments").elemMatch(matching)), update, ChatMessage.class);
    }

    public void markEventUnavailable(String eventId, String reason) {
        markEntity(TYPE_EVENT, eventId, STATUS_UNAVAILABLE, reason);
    }

    public void markEventAvailable(String eventId) {
        markEntity(TYPE_EVENT, eventId, STATUS_AVAILABLE, null);
    }

    public void markAssetUnavailable(String assetId, String reason) {
        markEntity(TYPE_ASSET, assetId, STATUS_UNAVAILABLE, reason);
    }

    public void markAssetAvailable(String assetId) {
        markEntity(TYPE_ASSET, assetId, STATUS_AVAILABLE, null);
    }

    private void markEntity(String type, String entityId, String status, String reason) {
        String normalizedType = safeText(type);
        String normalizedEntityId = safeText(entityId);
        if (!StringUtils.hasText(normalizedType) || !StringUtils.hasText(normalizedEntityId)) {
            return;
        }

        List<ChatMessage> changedMessages = new ArrayList<>();
        for (ChatMessage message : chatMessagesRepository.findByMessageAttachmentTypeAndEntityId(normalizedType, normalizedEntityId)) {
            if (message == null || message.getAttachments() == null || message.getAttachments().isEmpty()) {
                continue;
            }
            boolean changed = false;
            for (ChatMessageAttachmentRecord attachment : message.getAttachments()) {
                if (!matchesAttachment(attachment, normalizedType, normalizedEntityId)) {
                    continue;
                }
                changed = applyAttachmentStatus(attachment, status, reason) || changed;
            }
            if (changed) {
                message.refreshMessageSearchFields();
                changedMessages.add(message);
            }
        }
        if (!changedMessages.isEmpty()) {
            chatMessagesRepository.saveAll(changedMessages);
        }
    }

    private boolean applyAttachmentStatus(ChatMessageAttachmentRecord attachment, String status, String reason) {
        String normalizedStatus = STATUS_UNAVAILABLE.equals(status) ? STATUS_UNAVAILABLE : STATUS_AVAILABLE;
        String normalizedReason = STATUS_UNAVAILABLE.equals(normalizedStatus) ? safeText(reason) : "";
        boolean changed = false;
        if (!Objects.equals(safeText(attachment.getStatus()), normalizedStatus)) {
            attachment.setStatus(normalizedStatus);
            changed = true;
        }
        if (STATUS_UNAVAILABLE.equals(normalizedStatus)) {
            if (!Objects.equals(safeText(attachment.getUnavailableReason()), normalizedReason)) {
                attachment.setUnavailableReason(normalizedReason);
                changed = true;
            }
        } else if (StringUtils.hasText(attachment.getUnavailableReason())) {
            attachment.setUnavailableReason(null);
            changed = true;
        }
        return changed;
    }

    private boolean matchesAttachment(ChatMessageAttachmentRecord attachment, String type, String entityId) {
        return attachment != null
                && type.equals(safeText(attachment.getType()))
                && entityId.equals(safeText(attachment.getEntityId()));
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
