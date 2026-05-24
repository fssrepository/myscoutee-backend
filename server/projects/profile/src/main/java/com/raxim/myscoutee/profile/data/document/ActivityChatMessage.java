package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.bson.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageReactionRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatReadAvatarRecord;

@org.springframework.data.mongodb.core.mapping.Document(collection = "chatMessages")
@CompoundIndexes({
        @CompoundIndex(name = "chat_message_lookup", def = "{'chatId': 1, 'id': 1}", unique = true),
        @CompoundIndex(name = "chat_message_page_desc", def = "{'chatId': 1, 'sentAtIso': -1, 'id': -1}"),
        @CompoundIndex(name = "chat_message_sender_date", def = "{'messageSenderUserIds': 1, 'sentAtIso': -1}"),
        @CompoundIndex(name = "chat_message_reader_date", def = "{'messageReadByUserIds': 1, 'sentAtIso': -1}"),
        @CompoundIndex(name = "chat_message_reaction_date", def = "{'messageReactionUserIds': 1, 'sentAtIso': -1}"),
        @CompoundIndex(name = "chat_message_attachment_date", def = "{'messageAttachmentKeys': 1, 'sentAtIso': -1}"),
        @CompoundIndex(name = "chat_poll_voter_date", def = "{'pollVoterUserIds': 1, 'sentAtIso': -1}")
})
public class ActivityChatMessage extends ActivityChat.ChatMessageRecord {
    @MongoId(FieldType.STRING)
    private String mongoId;

    @Field("chatId")
    private String chatId;

    private List<String> messageSenderUserIds = new ArrayList<>();
    private List<String> messageReadByUserIds = new ArrayList<>();
    private List<String> messageReactionUserIds = new ArrayList<>();
    private List<String> messageAttachmentKeys = new ArrayList<>();
    private List<String> pollVoterUserIds = new ArrayList<>();

    public String getMongoId() {
        return mongoId;
    }

    public void setMongoId(String mongoId) {
        this.mongoId = mongoId;
    }

    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public List<String> getMessageSenderUserIds() {
        return messageSenderUserIds;
    }

    public void setMessageSenderUserIds(List<String> messageSenderUserIds) {
        this.messageSenderUserIds = messageSenderUserIds == null ? new ArrayList<>() : new ArrayList<>(messageSenderUserIds);
    }

    public List<String> getMessageReadByUserIds() {
        return messageReadByUserIds;
    }

    public void setMessageReadByUserIds(List<String> messageReadByUserIds) {
        this.messageReadByUserIds = messageReadByUserIds == null ? new ArrayList<>() : new ArrayList<>(messageReadByUserIds);
    }

    public List<String> getMessageReactionUserIds() {
        return messageReactionUserIds;
    }

    public void setMessageReactionUserIds(List<String> messageReactionUserIds) {
        this.messageReactionUserIds = messageReactionUserIds == null ? new ArrayList<>() : new ArrayList<>(messageReactionUserIds);
    }

    public List<String> getMessageAttachmentKeys() {
        return messageAttachmentKeys;
    }

    public void setMessageAttachmentKeys(List<String> messageAttachmentKeys) {
        this.messageAttachmentKeys = messageAttachmentKeys == null ? new ArrayList<>() : new ArrayList<>(messageAttachmentKeys);
    }

    public List<String> getPollVoterUserIds() {
        return pollVoterUserIds;
    }

    public void setPollVoterUserIds(List<String> pollVoterUserIds) {
        this.pollVoterUserIds = pollVoterUserIds == null ? new ArrayList<>() : new ArrayList<>(pollVoterUserIds);
    }

    public void refreshMessageSearchFields() {
        Set<String> senderUserIds = new LinkedHashSet<>();
        Set<String> readByUserIds = new LinkedHashSet<>();
        Set<String> reactionUserIds = new LinkedHashSet<>();
        Set<String> attachmentKeys = new LinkedHashSet<>();
        Set<String> pollVoterIds = new LinkedHashSet<>();

        ChatAvatarRecord senderAvatar = getSenderAvatar();
        addNormalized(senderUserIds, senderAvatar == null ? null : senderAvatar.getId());
        for (ChatReadAvatarRecord reader : getReadBy() == null ? List.<ChatReadAvatarRecord>of() : getReadBy()) {
            addNormalized(readByUserIds, reader == null ? null : reader.getId());
        }
        for (ChatMessageReactionRecord reaction : getReactions() == null ? List.<ChatMessageReactionRecord>of() : getReactions()) {
            addNormalized(reactionUserIds, reaction == null ? null : reaction.getUserId());
        }
        for (ChatMessageAttachmentRecord attachment : getAttachments() == null ? List.<ChatMessageAttachmentRecord>of() : getAttachments()) {
            if (attachment == null) {
                continue;
            }
            String attachmentKey = messageAttachmentKey(attachment.getType(), attachment.getEntityId());
            if (!attachmentKey.isBlank()) {
                attachmentKeys.add(attachmentKey);
            }
            if ("poll".equals(normalizeText(attachment.getType()).toLowerCase(Locale.ROOT))) {
                collectPollVoterUserIds(attachment.getDescription(), pollVoterIds);
            }
        }

        this.messageSenderUserIds = new ArrayList<>(senderUserIds);
        this.messageReadByUserIds = new ArrayList<>(readByUserIds);
        this.messageReactionUserIds = new ArrayList<>(reactionUserIds);
        this.messageAttachmentKeys = new ArrayList<>(attachmentKeys);
        this.pollVoterUserIds = new ArrayList<>(pollVoterIds);
    }

    public static ActivityChatMessage fromRecord(String chatId, ActivityChat.ChatMessageRecord source) {
        ActivityChatMessage copy = new ActivityChatMessage();
        String normalizedChatId = normalizeText(chatId);
        copy.setChatId(normalizedChatId);
        copy.setMongoId(buildMongoId(normalizedChatId, source == null ? null : source.getId()));
        if (source != null) {
            copy.setId(source.getId());
            copy.setClientId(source.getClientId());
            copy.setSender(source.getSender());
            copy.setSenderAvatar(source.getSenderAvatar());
            copy.setText(source.getText());
            copy.setTime(source.getTime());
            copy.setSentAtIso(source.getSentAtIso());
            copy.setMine(source.getMine());
            copy.setReadBy(new ArrayList<>(source.getReadBy() == null ? List.of() : source.getReadBy()));
            copy.setDeletedAtIso(source.getDeletedAtIso());
            copy.setDeletedByUserId(source.getDeletedByUserId());
            copy.setDeletedByName(source.getDeletedByName());
            copy.setEditedAtIso(source.getEditedAtIso());
            copy.setPinnedAtIso(source.getPinnedAtIso());
            copy.setPinnedByUserId(source.getPinnedByUserId());
            copy.setReplyTo(source.getReplyTo());
            copy.setReactions(new ArrayList<>(source.getReactions() == null ? List.of() : source.getReactions()));
            copy.setAttachments(new ArrayList<>(source.getAttachments() == null ? List.of() : source.getAttachments()));
        }
        copy.refreshMessageSearchFields();
        return copy;
    }

    public static String buildMongoId(String chatId, String messageId) {
        String normalizedChatId = normalizeText(chatId);
        String normalizedMessageId = normalizeText(messageId);
        if (normalizedMessageId.isBlank()) {
            normalizedMessageId = UUID.randomUUID().toString();
        }
        return "chat-message:" + normalizedChatId + ":" + normalizedMessageId;
    }

    public static String messageAttachmentKey(String type, String entityId) {
        String normalizedType = normalizeText(type).toLowerCase(Locale.ROOT);
        String normalizedEntityId = normalizeText(entityId);
        if (normalizedType.isBlank() || normalizedEntityId.isBlank()) {
            return "";
        }
        return normalizedType + ":" + normalizedEntityId;
    }

    private static void collectPollVoterUserIds(String description, Set<String> pollVoterIds) {
        String normalizedDescription = normalizeText(description);
        if (normalizedDescription.isBlank()) {
            return;
        }
        try {
            Object optionsValue = Document.parse(normalizedDescription).get("options");
            if (!(optionsValue instanceof List<?> optionNodes)) {
                return;
            }
            for (Object option : optionNodes) {
                if (!(option instanceof Document optionDocument)) {
                    continue;
                }
                Object votesValue = optionDocument.get("votes");
                if (!(votesValue instanceof List<?> voteNodes)) {
                    continue;
                }
                for (Object vote : voteNodes) {
                    if (vote instanceof Document voteDocument) {
                        addNormalized(pollVoterIds, Objects.toString(voteDocument.get("userId"), ""));
                    }
                }
            }
        } catch (Exception ignored) {
            // Poll descriptions are user-created JSON blobs; malformed values are ignored for search fields.
        }
    }

    private static void addNormalized(Set<String> values, String value) {
        String normalized = normalizeText(value);
        if (!normalized.isBlank()) {
            values.add(normalized);
        }
    }

    private static String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }
}
