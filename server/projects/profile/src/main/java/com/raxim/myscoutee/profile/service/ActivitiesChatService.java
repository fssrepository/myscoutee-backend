package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.mongo.ActivityChat;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityChat.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityChat.ChatMessageRecord;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityChat.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatDeviceDeleteRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatDeviceUpsertRequestDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatReadAvatarDto;
import com.raxim.myscoutee.profile.dto.activities.ActivityChatsDtos.ChatSummaryDto;
import com.raxim.myscoutee.profile.repository.mongo.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class ActivitiesChatService {
    private static final DateTimeFormatter CHAT_TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a", Locale.US)
            .withZone(ZoneId.systemDefault());

    private final ActivityChatsRepository activityChatsRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final ChatStreamPublisher chatStreamPublisher;
    private final ChatWebSocketSessionRegistry chatWebSocketSessionRegistry;
    private final ChatPushNotificationService chatPushNotificationService;

    public ActivitiesChatService(
            ActivityChatsRepository activityChatsRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService,
            ChatStreamPublisher chatStreamPublisher,
            ChatWebSocketSessionRegistry chatWebSocketSessionRegistry,
            ChatPushNotificationService chatPushNotificationService) {
        this.activityChatsRepository = activityChatsRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.chatStreamPublisher = chatStreamPublisher;
        this.chatWebSocketSessionRegistry = chatWebSocketSessionRegistry;
        this.chatPushNotificationService = chatPushNotificationService;
    }

    public List<ChatSummaryDto> queryChats(String requestedUserId) {
        String userId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }
        ensureOwnerCopiesForUser(userId);
        return activityChatsRepository.findByOwnerUserIdOrderByDateIsoDesc(userId).stream()
                .filter(Objects::nonNull)
                .map(this::toSummaryDto)
                .toList();
    }

    public List<ChatMessageDto> queryMessages(String chatId, String requestedUserId) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        ActivityChat viewerChat = markMessagesRead(snapshot, userId);
        if (viewerChat == null || viewerChat.getMessages() == null) {
            return List.of();
        }
        return viewerChat.getMessages().stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(message -> sortableDate(message.getSentAtIso())))
                .map(message -> toMessageDto(message, userId))
                .toList();
    }

    public ChatMessageDto sendMessage(String chatId, String requestedUserId, String text) {
        String userId = requireResolvedUserId(requestedUserId);
        String normalizedText = normalizeText(text);
        if (!StringUtils.hasText(normalizedText)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat message text is required.");
        }

        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        Users sender = findUser(userId);
        ChatMessageRecord messageRecord = buildMessageRecord(sender, userId, normalizedText);
        List<ActivityChat> updatedDocuments = new ArrayList<>();
        for (ActivityChat existing : snapshot.chatDocuments()) {
            ActivityChat next = copyChat(existing);
            List<ChatMessageRecord> nextMessages = new ArrayList<>();
            for (ChatMessageRecord existingMessage : safeMessages(existing.getMessages())) {
                nextMessages.add(copyMessageRecord(existingMessage));
            }
            nextMessages.add(copyMessageRecord(messageRecord));
            next.setMessages(nextMessages);
            next.setLastMessage(messageRecord.getText());
            next.setLastSenderId(userId);
            next.setDateIso(messageRecord.getSentAtIso());
            next.setUnread(userId.equals(normalizeId(next.getOwnerUserId())) ? 0 : normalizeCount(existing.getUnread()) + 1);
            updatedDocuments.add(next);
        }
        activityChatsRepository.saveAll(updatedDocuments);

        ChatStreamEvent streamEvent = toStreamEvent(snapshot.chatId(), messageRecord);
        boolean published = chatStreamPublisher.publish(streamEvent);
        if (!published) {
            chatWebSocketSessionRegistry.broadcast(streamEvent);
        }
        chatPushNotificationService.notifyRecipients(updatedDocuments, streamEvent);
        return toMessageDto(messageRecord, userId);
    }

    public boolean hasChatAccess(String chatId, String userId) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return activityChatsRepository.findByChatId(normalizedChatId).stream()
                .anyMatch(chat -> hasChatAccess(chat, normalizedUserId));
    }

    public void upsertDevice(ChatDeviceUpsertRequestDto request) {
        if (request == null) {
            return;
        }
        String userId = resolveUserId(request.userId());
        String deviceId = normalizeText(request.deviceId());
        String firebaseToken = normalizeText(request.firebaseToken());
        if (!StringUtils.hasText(userId) || (!StringUtils.hasText(deviceId) && !StringUtils.hasText(firebaseToken))) {
            return;
        }

        Users user = usersRepository.findByUserId(userId).orElse(null);
        if (user == null) {
            return;
        }

        String nowIso = Instant.now().toString();
        List<Users.UserDeviceRecord> devices = new ArrayList<>(user.getDevices() == null ? List.of() : user.getDevices());
        Users.UserDeviceRecord target = null;
        for (Users.UserDeviceRecord device : devices) {
            if (device == null) {
                continue;
            }
            if (StringUtils.hasText(deviceId) && deviceId.equals(normalizeId(device.getDeviceId()))) {
                target = device;
                break;
            }
            if (StringUtils.hasText(firebaseToken) && firebaseToken.equals(normalizeText(device.getFirebaseToken()))) {
                target = device;
                break;
            }
        }
        if (target == null) {
            target = new Users.UserDeviceRecord();
            devices.add(target);
        }
        target.setDeviceId(StringUtils.hasText(deviceId) ? deviceId : stableDeviceId(firebaseToken));
        target.setPlatform(normalizeText(request.platform()));
        target.setFirebaseToken(firebaseToken);
        target.setNotificationsEnabled(request.notificationsEnabled() == null ? Boolean.TRUE : request.notificationsEnabled());
        target.setLastRegisteredAtIso(nowIso);
        target.setLastSeenAtIso(nowIso);
        user.setDevices(devices);
        usersRepository.save(user);
    }

    public void deleteDevice(ChatDeviceDeleteRequestDto request) {
        if (request == null) {
            return;
        }
        String userId = resolveUserId(request.userId());
        if (!StringUtils.hasText(userId)) {
            return;
        }
        String deviceId = normalizeText(request.deviceId());
        String firebaseToken = normalizeText(request.firebaseToken());
        if (!StringUtils.hasText(deviceId) && !StringUtils.hasText(firebaseToken)) {
            return;
        }

        Users user = usersRepository.findByUserId(userId).orElse(null);
        if (user == null || user.getDevices() == null || user.getDevices().isEmpty()) {
            return;
        }

        List<Users.UserDeviceRecord> retained = user.getDevices().stream()
                .filter(Objects::nonNull)
                .filter(device -> !matchesDevice(device, deviceId, firebaseToken))
                .toList();
        if (retained.size() == user.getDevices().size()) {
            return;
        }
        user.setDevices(new ArrayList<>(retained));
        usersRepository.save(user);
    }

    private ChatDocumentsSnapshot requireChat(String chatId, String userId) {
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
        List<ActivityChat> chatDocuments = ensureOwnerCopies(activityChatsRepository.findByChatId(normalizedChatId));
        if (chatDocuments.isEmpty() || chatDocuments.stream().noneMatch(chat -> hasChatAccess(chat, userId))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found.");
        }
        ActivityChat viewerChat = findOwnerChat(chatDocuments, userId);
        if (viewerChat == null) {
            ActivityChat baseChat = chatDocuments.get(0);
            ActivityChat createdViewerChat = createOwnerCopy(baseChat, userId);
            activityChatsRepository.save(createdViewerChat);
            chatDocuments = new ArrayList<>(chatDocuments);
            chatDocuments.add(createdViewerChat);
            viewerChat = createdViewerChat;
        }
        return new ChatDocumentsSnapshot(normalizedChatId, viewerChat, chatDocuments);
    }

    private void ensureOwnerCopiesForUser(String userId) {
        ensureOwnerCopies(activityChatsRepository.findByMemberIdsContaining(userId));
    }

    private List<ActivityChat> ensureOwnerCopies(List<ActivityChat> chatDocuments) {
        if (chatDocuments == null || chatDocuments.isEmpty()) {
            return List.of();
        }
        Map<String, List<ActivityChat>> chatsByChatId = new LinkedHashMap<>();
        for (ActivityChat chat : chatDocuments) {
            if (chat == null || !StringUtils.hasText(chat.getChatId())) {
                continue;
            }
            chatsByChatId.computeIfAbsent(chat.getChatId().trim(), key -> new ArrayList<>()).add(chat);
        }

        List<ActivityChat> created = new ArrayList<>();
        for (List<ActivityChat> chatsWithSameId : chatsByChatId.values()) {
            if (chatsWithSameId.isEmpty()) {
                continue;
            }
            ActivityChat baseChat = chatsWithSameId.get(0);
            Set<String> ownerUserIds = new LinkedHashSet<>();
            Set<String> participantUserIds = new LinkedHashSet<>();
            for (ActivityChat chat : chatsWithSameId) {
                if (StringUtils.hasText(chat.getOwnerUserId())) {
                    ownerUserIds.add(chat.getOwnerUserId().trim());
                    participantUserIds.add(chat.getOwnerUserId().trim());
                }
                if (chat.getMemberIds() == null) {
                    continue;
                }
                for (String memberId : chat.getMemberIds()) {
                    if (StringUtils.hasText(memberId)) {
                        participantUserIds.add(memberId.trim());
                    }
                }
            }
            for (String participantUserId : participantUserIds) {
                if (ownerUserIds.contains(participantUserId)) {
                    continue;
                }
                ActivityChat createdChat = createOwnerCopy(baseChat, participantUserId);
                created.add(createdChat);
                chatsWithSameId.add(createdChat);
            }
        }
        if (!created.isEmpty()) {
            activityChatsRepository.saveAll(created);
        }
        List<ActivityChat> flattened = new ArrayList<>();
        for (List<ActivityChat> sameChatId : chatsByChatId.values()) {
            flattened.addAll(sameChatId);
        }
        return flattened;
    }

    private ActivityChat markMessagesRead(ChatDocumentsSnapshot snapshot, String viewerUserId) {
        Users viewer = findUser(viewerUserId);
        ChatReadAvatarRecord reader = buildReadAvatarRecord(viewer, viewerUserId);
        List<ActivityChat> updatedDocuments = new ArrayList<>();
        boolean changed = false;
        for (ActivityChat existing : snapshot.chatDocuments()) {
            ActivityChat next = copyChat(existing);
            if (viewerUserId.equals(normalizeId(existing.getOwnerUserId())) && normalizeCount(existing.getUnread()) != 0) {
                next.setUnread(0);
                changed = true;
            }
            List<ChatMessageRecord> nextMessages = new ArrayList<>();
            for (ChatMessageRecord message : safeMessages(existing.getMessages())) {
                ChatMessageRecord nextMessage = copyMessageRecord(message);
                String senderId = nextMessage.getSenderAvatar() == null ? "" : normalizeId(nextMessage.getSenderAvatar().getId());
                if (!viewerUserId.equals(senderId) && addReader(nextMessage, reader)) {
                    changed = true;
                }
                nextMessages.add(nextMessage);
            }
            next.setMessages(nextMessages);
            updatedDocuments.add(next);
        }
        if (changed) {
            activityChatsRepository.saveAll(updatedDocuments);
        } else {
            updatedDocuments = snapshot.chatDocuments();
        }
        return findOwnerChat(updatedDocuments, viewerUserId);
    }

    private boolean addReader(ChatMessageRecord message, ChatReadAvatarRecord reader) {
        if (message == null || reader == null || !StringUtils.hasText(reader.getId())) {
            return false;
        }
        List<ChatReadAvatarRecord> readBy = new ArrayList<>(safeReadBy(message.getReadBy()));
        for (ChatReadAvatarRecord existingReader : readBy) {
            if (existingReader != null && reader.getId().equals(normalizeId(existingReader.getId()))) {
                return false;
            }
        }
        readBy.add(copyReadAvatarRecord(reader));
        message.setReadBy(readBy);
        return true;
    }

    private boolean matchesDevice(Users.UserDeviceRecord device, String deviceId, String firebaseToken) {
        if (device == null) {
            return false;
        }
        if (StringUtils.hasText(deviceId) && deviceId.equals(normalizeId(device.getDeviceId()))) {
            return true;
        }
        return StringUtils.hasText(firebaseToken) && firebaseToken.equals(normalizeText(device.getFirebaseToken()));
    }

    private ChatSummaryDto toSummaryDto(ActivityChat chat) {
        return new ChatSummaryDto(
                normalizeId(chat.getChatId()),
                safeText(chat.getAvatar()),
                safeText(chat.getTitle()),
                safeText(chat.getLastMessage()),
                safeText(chat.getLastSenderId()),
                new ArrayList<>(chat.getMemberIds() == null ? List.of() : chat.getMemberIds()),
                normalizeCount(chat.getUnread()),
                chat.getDateIso(),
                chat.getChannelType(),
                chat.getEventId(),
                chat.getSubEventId(),
                chat.getGroupId(),
                chat.getDistanceKm(),
                chat.getDistanceMetersExact());
    }

    private ChatMessageDto toMessageDto(ChatMessageRecord message, String viewerUserId) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        String senderId = senderAvatar == null ? "" : safeText(senderAvatar.getId());
        return new ChatMessageDto(
                message == null ? "" : safeText(message.getId()),
                senderId,
                message == null ? "" : safeText(message.getSender()),
                senderAvatar == null ? buildInitials(senderId) : safeText(senderAvatar.getInitials()),
                senderAvatar == null ? "man" : normalizeGender(senderAvatar.getGender()),
                message == null ? "" : safeText(message.getText()),
                message == null ? Instant.now().toString() : safeText(message.getSentAtIso()),
                Objects.equals(senderId, normalizeId(viewerUserId)),
                safeReadBy(message == null ? null : message.getReadBy()).stream()
                        .map(this::toReadAvatarDto)
                        .toList());
    }

    private ChatReadAvatarDto toReadAvatarDto(ChatReadAvatarRecord record) {
        return new ChatReadAvatarDto(
                record == null ? "" : safeText(record.getId()),
                record == null ? "" : safeText(record.getInitials()),
                record == null ? "man" : normalizeGender(record.getGender()));
    }

    private ChatMessageRecord buildMessageRecord(Users sender, String senderUserId, String text) {
        Instant sentAt = Instant.now();
        ChatMessageRecord message = new ChatMessageRecord();
        message.setId(UUID.randomUUID().toString());
        message.setSender(resolveUserName(sender, senderUserId));
        message.setSenderAvatar(buildSenderAvatarRecord(sender, senderUserId));
        message.setText(text);
        message.setTime(CHAT_TIME_FORMATTER.format(sentAt));
        message.setSentAtIso(sentAt.toString());
        message.setMine(Boolean.FALSE);
        message.setReadBy(new ArrayList<>());
        return message;
    }

    private ChatStreamEvent toStreamEvent(String chatId, ChatMessageRecord messageRecord) {
        ChatAvatarRecord senderAvatar = messageRecord.getSenderAvatar();
        return new ChatStreamEvent(
                chatId,
                messageRecord.getId(),
                senderAvatar == null ? "" : safeText(senderAvatar.getId()),
                safeText(messageRecord.getSender()),
                senderAvatar == null ? "CH" : safeText(senderAvatar.getInitials()),
                senderAvatar == null ? "man" : normalizeGender(senderAvatar.getGender()),
                safeText(messageRecord.getText()),
                safeText(messageRecord.getSentAtIso()),
                safeReadBy(messageRecord.getReadBy()).stream()
                        .map(this::toReadAvatarDto)
                        .toList());
    }

    private ActivityChat findOwnerChat(List<ActivityChat> chats, String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        for (ActivityChat chat : chats) {
            if (chat != null && normalizedOwnerUserId.equals(normalizeId(chat.getOwnerUserId()))) {
                return chat;
            }
        }
        return null;
    }

    private boolean hasChatAccess(ActivityChat chat, String userId) {
        if (chat == null || !StringUtils.hasText(userId)) {
            return false;
        }
        String normalizedUserId = normalizeId(userId);
        if (normalizedUserId.equals(normalizeId(chat.getOwnerUserId()))) {
            return true;
        }
        if (chat.getMemberIds() == null) {
            return false;
        }
        return chat.getMemberIds().stream()
                .map(this::normalizeId)
                .anyMatch(normalizedUserId::equals);
    }

    private ActivityChat createOwnerCopy(ActivityChat baseChat, String ownerUserId) {
        ActivityChat copy = copyChat(baseChat);
        copy.setMongoId(buildMongoId(ownerUserId, baseChat.getChatId()));
        copy.setOwnerUserId(ownerUserId);
        copy.setUnread(countUnreadMessages(copy, ownerUserId));
        return copy;
    }

    private int countUnreadMessages(ActivityChat chat, String viewerUserId) {
        int unread = 0;
        for (ChatMessageRecord message : safeMessages(chat == null ? null : chat.getMessages())) {
            String senderId = message.getSenderAvatar() == null ? "" : normalizeId(message.getSenderAvatar().getId());
            if (viewerUserId.equals(senderId)) {
                continue;
            }
            boolean alreadyRead = safeReadBy(message.getReadBy()).stream()
                    .map(ChatReadAvatarRecord::getId)
                    .map(this::normalizeId)
                    .anyMatch(normalizeId(viewerUserId)::equals);
            if (!alreadyRead) {
                unread += 1;
            }
        }
        return unread;
    }

    private ActivityChat copyChat(ActivityChat source) {
        ActivityChat copy = new ActivityChat();
        copy.setMongoId(source.getMongoId());
        copy.setChatId(source.getChatId());
        copy.setOwnerUserId(source.getOwnerUserId());
        copy.setAvatar(source.getAvatar());
        copy.setTitle(source.getTitle());
        copy.setLastMessage(source.getLastMessage());
        copy.setLastSenderId(source.getLastSenderId());
        copy.setMemberIds(new ArrayList<>(source.getMemberIds() == null ? List.of() : source.getMemberIds()));
        copy.setUnread(source.getUnread());
        copy.setDateIso(source.getDateIso());
        copy.setChannelType(source.getChannelType());
        copy.setEventId(source.getEventId());
        copy.setSubEventId(source.getSubEventId());
        copy.setGroupId(source.getGroupId());
        copy.setDistanceKm(source.getDistanceKm());
        copy.setDistanceMetersExact(source.getDistanceMetersExact());
        List<ChatMessageRecord> copiedMessages = new ArrayList<>();
        for (ChatMessageRecord message : safeMessages(source.getMessages())) {
            copiedMessages.add(copyMessageRecord(message));
        }
        copy.setMessages(copiedMessages);
        return copy;
    }

    private ChatMessageRecord copyMessageRecord(ChatMessageRecord source) {
        ChatMessageRecord copy = new ChatMessageRecord();
        copy.setId(source.getId());
        copy.setSender(source.getSender());
        copy.setSenderAvatar(copySenderAvatarRecord(source.getSenderAvatar()));
        copy.setText(source.getText());
        copy.setTime(source.getTime());
        copy.setSentAtIso(source.getSentAtIso());
        copy.setMine(source.getMine());
        List<ChatReadAvatarRecord> copiedReadBy = new ArrayList<>();
        for (ChatReadAvatarRecord reader : safeReadBy(source.getReadBy())) {
            copiedReadBy.add(copyReadAvatarRecord(reader));
        }
        copy.setReadBy(copiedReadBy);
        return copy;
    }

    private ChatAvatarRecord buildSenderAvatarRecord(Users sender, String senderUserId) {
        ChatAvatarRecord avatar = new ChatAvatarRecord();
        avatar.setId(senderUserId);
        avatar.setInitials(resolveUserInitials(sender, senderUserId));
        avatar.setGender(resolveUserGender(sender));
        return avatar;
    }

    private ChatAvatarRecord copySenderAvatarRecord(ChatAvatarRecord source) {
        if (source == null) {
            return null;
        }
        ChatAvatarRecord copy = new ChatAvatarRecord();
        copy.setId(source.getId());
        copy.setInitials(source.getInitials());
        copy.setGender(source.getGender());
        return copy;
    }

    private ChatReadAvatarRecord buildReadAvatarRecord(Users user, String userId) {
        ChatReadAvatarRecord record = new ChatReadAvatarRecord();
        record.setId(userId);
        record.setInitials(resolveUserInitials(user, userId));
        record.setGender(resolveUserGender(user));
        return record;
    }

    private ChatReadAvatarRecord copyReadAvatarRecord(ChatReadAvatarRecord source) {
        if (source == null) {
            return null;
        }
        ChatReadAvatarRecord copy = new ChatReadAvatarRecord();
        copy.setId(source.getId());
        copy.setInitials(source.getInitials());
        copy.setGender(source.getGender());
        return copy;
    }

    private Users findUser(String userId) {
        if (!StringUtils.hasText(userId)) {
            return null;
        }
        return usersRepository.findByUserId(userId).orElse(null);
    }

    private String requireResolvedUserId(String requestedUserId) {
        String userId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authenticated user.");
        }
        return userId;
    }

    private String resolveUserId(String requestedUserId) {
        return normalizeId(homeUserProfileService.resolveSelectedUserId(requestedUserId));
    }

    private String resolveUserName(Users user, String fallbackUserId) {
        if (user != null && StringUtils.hasText(user.getName())) {
            return user.getName().trim();
        }
        return StringUtils.hasText(fallbackUserId) ? fallbackUserId.trim() : "User";
    }

    private String resolveUserInitials(Users user, String fallbackUserId) {
        if (user != null && StringUtils.hasText(user.getInitials())) {
            return user.getInitials().trim();
        }
        if (user != null && StringUtils.hasText(user.getName())) {
            return buildInitials(user.getName());
        }
        return buildInitials(fallbackUserId);
    }

    private String resolveUserGender(Users user) {
        return normalizeGender(user == null ? null : user.getGender());
    }

    private String buildInitials(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return "CH";
        }
        String[] parts = normalized.split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase(Locale.US);
        }
        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase(Locale.US);
    }

    private String normalizeGender(String value) {
        String normalized = safeText(value).toLowerCase(Locale.US);
        if (normalized.startsWith("w") || normalized.startsWith("f")) {
            return "woman";
        }
        return "man";
    }

    private List<ChatMessageRecord> safeMessages(List<ChatMessageRecord> messages) {
        return messages == null ? List.of() : messages;
    }

    private List<ChatReadAvatarRecord> safeReadBy(List<ChatReadAvatarRecord> readBy) {
        return readBy == null ? List.of() : readBy;
    }

    private int normalizeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private long sortableDate(String value) {
        try {
            return StringUtils.hasText(value) ? Instant.parse(value.trim()).toEpochMilli() : 0L;
        } catch (Exception exception) {
            return 0L;
        }
    }

    private String stableDeviceId(String firebaseToken) {
        return UUID.nameUUIDFromBytes(normalizeText(firebaseToken).getBytes()).toString();
    }

    private String buildMongoId(String ownerUserId, String chatId) {
        return normalizeId(ownerUserId) + ":" + normalizeId(chatId);
    }

    private record ChatDocumentsSnapshot(String chatId, ActivityChat viewerChat, List<ActivityChat> chatDocuments) {
    }
}
