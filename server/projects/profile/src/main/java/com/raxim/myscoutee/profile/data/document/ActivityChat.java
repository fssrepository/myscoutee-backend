package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.MongoId;

@Document(collection = "chats")
@CompoundIndexes({
        @CompoundIndex(name = "chat_owner_public_id", def = "{'ownerUserId': 1, 'id': 1}", unique = true),
        @CompoundIndex(name = "chat_public_id_lookup", def = "{'id': 1}"),
        @CompoundIndex(name = "chat_owner_date", def = "{'ownerUserId': 1, 'dateIso': -1}")
})
public class ActivityChat {
    @MongoId(FieldType.STRING)
    private String mongoId;

    @Field("id")
    private String chatId;

    @Indexed(name = "chat_owner_user")
    private String ownerUserId;

    private String avatar;
    private String title;
    private String lastMessage;
    private String lastSenderId;
    private List<String> memberIds = new ArrayList<>();
    private Integer unread;
    private String dateIso;
    private String channelType;
    private String eventId;
    private String subEventId;
    private String groupId;
    private Double distanceKm;
    private Integer distanceMetersExact;
    private List<ChatMessageRecord> messages = new ArrayList<>();

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

    public String getOwnerUserId() {
        return ownerUserId;
    }

    public void setOwnerUserId(String ownerUserId) {
        this.ownerUserId = ownerUserId;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getLastSenderId() {
        return lastSenderId;
    }

    public void setLastSenderId(String lastSenderId) {
        this.lastSenderId = lastSenderId;
    }

    public List<String> getMemberIds() {
        return memberIds;
    }

    public void setMemberIds(List<String> memberIds) {
        this.memberIds = memberIds == null ? new ArrayList<>() : memberIds;
    }

    public Integer getUnread() {
        return unread;
    }

    public void setUnread(Integer unread) {
        this.unread = unread;
    }

    public String getDateIso() {
        return dateIso;
    }

    public void setDateIso(String dateIso) {
        this.dateIso = dateIso;
    }

    public String getChannelType() {
        return channelType;
    }

    public void setChannelType(String channelType) {
        this.channelType = channelType;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getSubEventId() {
        return subEventId;
    }

    public void setSubEventId(String subEventId) {
        this.subEventId = subEventId;
    }

    public String getGroupId() {
        return groupId;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getDistanceMetersExact() {
        return distanceMetersExact;
    }

    public void setDistanceMetersExact(Integer distanceMetersExact) {
        this.distanceMetersExact = distanceMetersExact;
    }

    public List<ChatMessageRecord> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageRecord> messages) {
        this.messages = messages == null ? new ArrayList<>() : messages;
    }

    public static class ChatMessageRecord {
        @Field("id")
        private String id;
        private String clientId;
        private String sender;
        private ChatAvatarRecord senderAvatar;
        private String text;
        private String time;
        private String sentAtIso;
        private Boolean mine;
        private List<ChatReadAvatarRecord> readBy = new ArrayList<>();
        private String deletedAtIso;
        private String deletedByUserId;
        private String deletedByName;
        private String editedAtIso;
        private String pinnedAtIso;
        private String pinnedByUserId;
        private ChatMessageReplyRecord replyTo;
        private List<ChatMessageReactionRecord> reactions = new ArrayList<>();
        private List<ChatMessageAttachmentRecord> attachments = new ArrayList<>();

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }

        public String getSender() {
            return sender;
        }

        public void setSender(String sender) {
            this.sender = sender;
        }

        public ChatAvatarRecord getSenderAvatar() {
            return senderAvatar;
        }

        public void setSenderAvatar(ChatAvatarRecord senderAvatar) {
            this.senderAvatar = senderAvatar;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getSentAtIso() {
            return sentAtIso;
        }

        public void setSentAtIso(String sentAtIso) {
            this.sentAtIso = sentAtIso;
        }

        public Boolean getMine() {
            return mine;
        }

        public void setMine(Boolean mine) {
            this.mine = mine;
        }

        public List<ChatReadAvatarRecord> getReadBy() {
            return readBy;
        }

        public void setReadBy(List<ChatReadAvatarRecord> readBy) {
            this.readBy = readBy == null ? new ArrayList<>() : readBy;
        }

        public String getDeletedAtIso() { return deletedAtIso; }
        public void setDeletedAtIso(String deletedAtIso) { this.deletedAtIso = deletedAtIso; }
        public String getDeletedByUserId() { return deletedByUserId; }
        public void setDeletedByUserId(String deletedByUserId) { this.deletedByUserId = deletedByUserId; }
        public String getDeletedByName() { return deletedByName; }
        public void setDeletedByName(String deletedByName) { this.deletedByName = deletedByName; }
        public String getEditedAtIso() { return editedAtIso; }
        public void setEditedAtIso(String editedAtIso) { this.editedAtIso = editedAtIso; }
        public String getPinnedAtIso() { return pinnedAtIso; }
        public void setPinnedAtIso(String pinnedAtIso) { this.pinnedAtIso = pinnedAtIso; }
        public String getPinnedByUserId() { return pinnedByUserId; }
        public void setPinnedByUserId(String pinnedByUserId) { this.pinnedByUserId = pinnedByUserId; }
        public ChatMessageReplyRecord getReplyTo() { return replyTo; }
        public void setReplyTo(ChatMessageReplyRecord replyTo) { this.replyTo = replyTo; }
        public List<ChatMessageReactionRecord> getReactions() { return reactions; }
        public void setReactions(List<ChatMessageReactionRecord> reactions) { this.reactions = reactions == null ? new ArrayList<>() : reactions; }

        public List<ChatMessageAttachmentRecord> getAttachments() {
            return attachments;
        }

        public void setAttachments(List<ChatMessageAttachmentRecord> attachments) {
            this.attachments = attachments == null ? new ArrayList<>() : attachments;
        }
    }

    public static class ChatMessageReplyRecord {
        @Field("id")
        private String id;
        private String sender;
        private String text;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public static class ChatMessageReactionRecord {
        private String emoji;
        private String userId;
        private String userName;
        private String userInitials;
        private String userGender;
        private String reactedAtIso;

        public String getEmoji() { return emoji; }
        public void setEmoji(String emoji) { this.emoji = emoji; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getUserInitials() { return userInitials; }
        public void setUserInitials(String userInitials) { this.userInitials = userInitials; }
        public String getUserGender() { return userGender; }
        public void setUserGender(String userGender) { this.userGender = userGender; }
        public String getReactedAtIso() { return reactedAtIso; }
        public void setReactedAtIso(String reactedAtIso) { this.reactedAtIso = reactedAtIso; }
    }

    public static class ChatMessageAttachmentRecord {
        @Field("id")
        private String id;
        private String type;
        private String title;
        private String entityId;
        private String assetType;
        private String ownerUserId;
        private String status;
        private String unavailableReason;
        private String subtitle;
        private String description;
        private String url;
        private String previewUrl;
        private String mimeType;
        private Long sizeBytes;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getEntityId() { return entityId; }
        public void setEntityId(String entityId) { this.entityId = entityId; }
        public String getAssetType() { return assetType; }
        public void setAssetType(String assetType) { this.assetType = assetType; }
        public String getOwnerUserId() { return ownerUserId; }
        public void setOwnerUserId(String ownerUserId) { this.ownerUserId = ownerUserId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getUnavailableReason() { return unavailableReason; }
        public void setUnavailableReason(String unavailableReason) { this.unavailableReason = unavailableReason; }
        public String getSubtitle() { return subtitle; }
        public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public String getPreviewUrl() { return previewUrl; }
        public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }
        public String getMimeType() { return mimeType; }
        public void setMimeType(String mimeType) { this.mimeType = mimeType; }
        public Long getSizeBytes() { return sizeBytes; }
        public void setSizeBytes(Long sizeBytes) { this.sizeBytes = sizeBytes; }
    }

    public static class ChatAvatarRecord {
        @Field("id")
        private String id;
        private String initials;
        private String gender;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getInitials() {
            return initials;
        }

        public void setInitials(String initials) {
            this.initials = initials;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }

    public static class ChatReadAvatarRecord {
        @Field("id")
        private String id;
        private String initials;
        private String gender;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getInitials() {
            return initials;
        }

        public void setInitials(String initials) {
            this.initials = initials;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }
    }
}
