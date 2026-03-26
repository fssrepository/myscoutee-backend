package com.raxim.myscoutee.profile.data.document.mongo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "chats")
@CompoundIndexes({
        @CompoundIndex(name = "chat_owner_public_id", def = "{'ownerUserId': 1, 'id': 1}", unique = true),
        @CompoundIndex(name = "chat_public_id_lookup", def = "{'id': 1}"),
        @CompoundIndex(name = "chat_owner_date", def = "{'ownerUserId': 1, 'dateIso': -1}")
})
public class ActivityChat {
    @Id
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
        private String id;
        private String sender;
        private ChatAvatarRecord senderAvatar;
        private String text;
        private String time;
        private String sentAtIso;
        private Boolean mine;
        private List<ChatReadAvatarRecord> readBy = new ArrayList<>();

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
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
    }

    public static class ChatAvatarRecord {
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
