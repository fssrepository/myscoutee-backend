package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ChatMessage;
import com.raxim.myscoutee.profile.data.document.Chat.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.profile.repository.ChatMessagesRepository;

@Service
public class ChatAttachmentLifecycleService {
    private static final String TYPE_EVENT = "event";
    private static final String TYPE_ASSET = "asset";
    private static final String STATUS_AVAILABLE = "available";
    private static final String STATUS_UNAVAILABLE = "unavailable";

    private final ChatMessagesRepository chatMessagesRepository;

    public ChatAttachmentLifecycleService(ChatMessagesRepository chatMessagesRepository) {
        this.chatMessagesRepository = chatMessagesRepository;
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
