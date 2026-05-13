package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.nio.charset.StandardCharsets;
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

import org.bson.Document;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageAttachmentRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageReactionRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatMessageReplyRecord;
import com.raxim.myscoutee.profile.data.document.ActivityChat.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatDeviceDeleteRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatDeviceUpsertRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageAttachmentDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageReactionDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatMessageReplyDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatPageResponseDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatReadAvatarDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityChatsDtos.ChatSummaryDto;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class ActivitiesChatService {
    private static final DateTimeFormatter CHAT_TIME_FORMATTER = DateTimeFormatter.ofPattern("h:mm a", Locale.US)
            .withZone(ZoneId.systemDefault());
    private static final String SUPPORT_CASE_STATUS_PENDING = "pending";
    private static final String SUPPORT_CASE_STATUS_PICKED = "picked";
    private static final String SUPPORT_CASE_STATUS_SOLVED = "solved";
    private static final String SUPPORT_CASE_STATUS_BLOCKED = "blocked";
    private static final String SUPPORT_CASE_FILTER_ALL = "all";

    private final ActivityChatsRepository activityChatsRepository;
    private final UsersRepository usersRepository;
    private final HomeUserProfileService homeUserProfileService;
    private final ChatStreamPublisher chatStreamPublisher;
    private final ChatWebSocketSessionRegistry chatWebSocketSessionRegistry;
    private final ChatPushNotificationService chatPushNotificationService;
    private final AdminTelemetryService adminTelemetryService;
    private final AdminMenuCounterService adminMenuCounterService;

    public ActivitiesChatService(
            ActivityChatsRepository activityChatsRepository,
            UsersRepository usersRepository,
            HomeUserProfileService homeUserProfileService,
            ChatStreamPublisher chatStreamPublisher,
            ChatWebSocketSessionRegistry chatWebSocketSessionRegistry,
            ChatPushNotificationService chatPushNotificationService,
            AdminTelemetryService adminTelemetryService,
            AdminMenuCounterService adminMenuCounterService) {
        this.activityChatsRepository = activityChatsRepository;
        this.usersRepository = usersRepository;
        this.homeUserProfileService = homeUserProfileService;
        this.chatStreamPublisher = chatStreamPublisher;
        this.chatWebSocketSessionRegistry = chatWebSocketSessionRegistry;
        this.chatPushNotificationService = chatPushNotificationService;
        this.adminTelemetryService = adminTelemetryService;
        this.adminMenuCounterService = adminMenuCounterService;
    }

    public List<ChatSummaryDto> queryChats(String requestedUserId) {
        String userId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return List.of();
        }
        ensureOwnerCopiesForUser(userId);
        return uniqueOwnerChats(activityChatsRepository.findByOwnerUserIdOrderByDateIsoDesc(userId)).stream()
                .filter(Objects::nonNull)
                .map(this::toSummaryDto)
                .toList();
    }

    public ChatPageResponseDto queryChatPage(
            String requestedUserId,
            String contextFilterValue,
            String sortValue,
            String sortDirectionValue,
            String secondaryFilterValue,
            String cursor,
            Integer limitValue,
            String rangeStartIso,
            String rangeEndIso,
            Boolean adminServiceOnly,
            String supportCaseFilterValue) {
        String userId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            return new ChatPageResponseDto(List.of(), 0, null);
        }

        String contextFilter = normalizeChatContextFilter(contextFilterValue);
        String sort = normalizeChatQuerySort(sortValue, secondaryFilterValue);
        boolean sortAscending = resolveChatSortAscending(sort, sortDirectionValue);
        long rangeStartMs = parseIsoMillis(rangeStartIso, Long.MIN_VALUE);
        long rangeEndMs = parseIsoMillis(rangeEndIso, Long.MAX_VALUE);
        if (rangeStartMs > rangeEndMs) {
            return new ChatPageResponseDto(List.of(), 0, null);
        }
        if (Boolean.TRUE.equals(adminServiceOnly) && "service".equals(contextFilter)) {
            return querySupportCasePage(
                    userId,
                    sort,
                    sortAscending,
                    cursor,
                    limitValue,
                    rangeStartMs,
                    rangeEndMs,
                    supportCaseFilterValue);
        }

        ensureOwnerCopiesForUser(userId);
        List<ChatSummaryProjection> projections = uniqueOwnerChats(activityChatsRepository.findByOwnerUserId(userId)).stream()
                .filter(Objects::nonNull)
                .map(this::toSummaryProjection)
                .filter(Objects::nonNull)
                .filter(item -> matchesChatContextFilter(item.summary(), contextFilter))
                .filter(item -> item.dateMs() >= rangeStartMs && item.dateMs() <= rangeEndMs)
                .sorted(chatSummaryComparator(sort, sortAscending))
                .toList();

        int startIndex = resolveChatCursorStartIndex(projections, cursor);
        int limit = normalizeChatPageLimit(limitValue);
        int endIndex = Math.min(projections.size(), startIndex + limit);
        List<ChatSummaryDto> items = projections.subList(startIndex, endIndex).stream()
                .map(ChatSummaryProjection::summary)
                .toList();
        String nextCursor = endIndex < projections.size() && !items.isEmpty()
                ? serializeChatCursor(items.get(items.size() - 1))
                : null;

        return new ChatPageResponseDto(items, projections.size(), nextCursor);
    }

    private ChatPageResponseDto querySupportCasePage(
            String userId,
            String sort,
            boolean sortAscending,
            String cursor,
            Integer limitValue,
            long rangeStartMs,
            long rangeEndMs,
            String supportCaseFilterValue) {
        Users actor = findUser(userId);
        if (!isAdminUser(actor)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is required.");
        }
        String supportCaseFilter = normalizeSupportCaseFilter(supportCaseFilterValue);
        List<ChatSummaryProjection> projections = uniqueSupportCaseChats(
                activityChatsRepository.findByChannelType("serviceEvent"),
                userId).stream()
                .filter(this::isSupportCaseChat)
                .map(this::toSummaryProjection)
                .filter(Objects::nonNull)
                .filter(item -> matchesSupportCaseFilter(item.summary(), supportCaseFilter))
                .filter(item -> item.dateMs() >= rangeStartMs && item.dateMs() <= rangeEndMs)
                .sorted(chatSummaryComparator(sort, sortAscending))
                .toList();

        int startIndex = resolveChatCursorStartIndex(projections, cursor);
        int limit = normalizeChatPageLimit(limitValue);
        int endIndex = Math.min(projections.size(), startIndex + limit);
        List<ChatSummaryDto> items = projections.subList(startIndex, endIndex).stream()
                .map(ChatSummaryProjection::summary)
                .toList();
        String nextCursor = endIndex < projections.size() && !items.isEmpty()
                ? serializeChatCursor(items.get(items.size() - 1))
                : null;
        return new ChatPageResponseDto(items, projections.size(), nextCursor);
    }

    public ChatSummaryDto updateSupportCase(String chatId, String requestedUserId, String actionValue) {
        String userId = requireResolvedUserId(requestedUserId);
        Users actor = findUser(userId);
        if (!isAdminUser(actor)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is required.");
        }
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat id is required.");
        }
        String action = normalizeSupportCaseAction(actionValue);
        if (!StringUtils.hasText(action)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported support case action.");
        }

        List<ActivityChat> chatDocuments = ensureOwnerCopies(activityChatsRepository.findByChatId(normalizedChatId));
        if (chatDocuments.isEmpty() || chatDocuments.stream().noneMatch(this::isSupportCaseChat)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Support case not found.");
        }

        SupportCaseState state = nextSupportCaseState(action, userId, actor);
        List<ActivityChat> updatedDocuments = new ArrayList<>();
        for (ActivityChat existing : chatDocuments) {
            ActivityChat next = copyChat(existing);
            applySupportCaseState(next, state);
            updatedDocuments.add(next);
        }
        activityChatsRepository.saveAll(updatedDocuments);
        adminTelemetryService.record("admin.support.case." + action, "support", normalizedChatId, userId);

        ActivityChat viewerChat = findOwnerChat(updatedDocuments, userId);
        return toSummaryDto(viewerChat == null ? updatedDocuments.get(0) : viewerChat);
    }

    public List<ChatMessageDto> queryMessages(String chatId, String requestedUserId) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        ChatReadUpdate readUpdate = markMessagesRead(snapshot, userId, null);
        ActivityChat viewerChat = readUpdate.viewerChat();
        if (!readUpdate.readMessageIds().isEmpty()) {
            publishChatEvent(toReadEvent(snapshot.chatId(), readUpdate));
        }
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
        return sendMessage(chatId, requestedUserId, text, null, null, List.of());
    }

    public ChatMessageDto sendMessage(String chatId, String requestedUserId, String text, String clientId) {
        return sendMessage(chatId, requestedUserId, text, clientId, null, List.of());
    }

    public ChatMessageDto postSystemMessage(String chatId, String text, String systemType) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedText = normalizeText(text);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedText)) {
            return null;
        }
        List<ActivityChat> chatDocuments = ensureOwnerCopies(activityChatsRepository.findByChatId(normalizedChatId));
        if (chatDocuments.isEmpty()) {
            return null;
        }

        ChatMessageRecord messageRecord = buildSystemMessageRecord(normalizedText, systemType);
        List<ActivityChat> updatedDocuments = new ArrayList<>();
        for (ActivityChat existing : chatDocuments) {
            ActivityChat next = copyChat(existing);
            List<ChatMessageRecord> nextMessages = new ArrayList<>();
            for (ChatMessageRecord existingMessage : safeMessages(existing.getMessages())) {
                nextMessages.add(copyMessageRecord(existingMessage));
            }
            nextMessages.add(copyMessageRecord(messageRecord));
            next.setMessages(nextMessages);
            next.setLastMessage(chatMessageSummary(messageRecord));
            next.setLastSenderId("");
            next.setDateIso(messageRecord.getSentAtIso());
            next.setUnread(normalizeCount(existing.getUnread()) + 1);
            updatedDocuments.add(next);
        }
        activityChatsRepository.saveAll(updatedDocuments);

        ChatStreamEvent streamEvent = toStreamEvent(normalizedChatId, messageRecord);
        publishChatEvent(streamEvent);
        chatPushNotificationService.notifyRecipients(updatedDocuments, streamEvent);
        adminTelemetryService.record("chat.message.system", "chats", normalizedChatId, "system");
        return toMessageDto(messageRecord, "");
    }

    public ChatMessageDto sendMessage(
            String chatId,
            String requestedUserId,
            String text,
            String clientId,
            ChatMessageReplyDto replyTo,
            List<ChatMessageAttachmentDto> attachments) {
        String userId = requireResolvedUserId(requestedUserId);
        String normalizedText = normalizeText(text);
        List<ChatMessageAttachmentRecord> normalizedAttachments = normalizeAttachments(attachments);
        if (!StringUtils.hasText(normalizedText) && normalizedAttachments.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat message text is required.");
        }

        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        Users sender = findUser(userId);
        ChatMessageRecord messageRecord = buildMessageRecord(sender, userId, normalizedText, clientId, normalizeReply(replyTo), normalizedAttachments);
        List<ActivityChat> updatedDocuments = new ArrayList<>();
        for (ActivityChat existing : snapshot.chatDocuments()) {
            ActivityChat next = copyChat(existing);
            List<ChatMessageRecord> nextMessages = new ArrayList<>();
            for (ChatMessageRecord existingMessage : safeMessages(existing.getMessages())) {
                nextMessages.add(copyMessageRecord(existingMessage));
            }
            nextMessages.add(copyMessageRecord(messageRecord));
            next.setMessages(nextMessages);
            next.setLastMessage(chatMessageSummary(messageRecord));
            next.setLastSenderId(userId);
            next.setDateIso(messageRecord.getSentAtIso());
            next.setUnread(userId.equals(normalizeId(next.getOwnerUserId())) ? 0 : normalizeCount(existing.getUnread()) + 1);
            updatedDocuments.add(next);
        }
        activityChatsRepository.saveAll(updatedDocuments);

        ChatStreamEvent streamEvent = toStreamEvent(snapshot.chatId(), messageRecord);
        publishChatEvent(streamEvent);
        chatPushNotificationService.notifyRecipients(updatedDocuments, streamEvent);
        adminTelemetryService.record("chat.message.sent", "chats", snapshot.chatId(), userId);
        return toMessageDto(messageRecord, userId);
    }

    public ChatMessageDto editMessage(String chatId, String requestedUserId, String messageId, String text) {
        String normalizedText = normalizeText(text);
        if (!StringUtils.hasText(normalizedText)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat message text is required.");
        }
        return mutateMessage(chatId, requestedUserId, messageId, (message, userId, user) -> {
            requireOwnMessage(message, userId);
            if (StringUtils.hasText(message.getDeletedAtIso())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deleted messages cannot be edited.");
            }
            message.setText(normalizedText);
            message.setEditedAtIso(Instant.now().toString());
        });
    }

    public ChatMessageDto deleteMessage(String chatId, String requestedUserId, String messageId) {
        return mutateMessage(chatId, requestedUserId, messageId, (message, userId, user) -> {
            requireOwnMessage(message, userId);
            message.setText("");
            message.setDeletedAtIso(Instant.now().toString());
            message.setDeletedByUserId(userId);
            message.setDeletedByName(resolveUserName(user, userId));
            message.setReactions(new ArrayList<>());
            message.setReadBy(new ArrayList<>());
            message.setAttachments(new ArrayList<>());
            message.setReplyTo(null);
            message.setEditedAtIso(null);
            message.setPinnedAtIso(null);
            message.setPinnedByUserId(null);
        });
    }

    public ChatMessageDto pinMessage(String chatId, String requestedUserId, String messageId, Boolean pinned) {
        return mutateMessage(chatId, requestedUserId, messageId, (message, userId, user) -> {
            if (Boolean.TRUE.equals(pinned)) {
                message.setPinnedAtIso(Instant.now().toString());
                message.setPinnedByUserId(userId);
            } else {
                message.setPinnedAtIso(null);
                message.setPinnedByUserId(null);
            }
        });
    }

    public ChatMessageDto reactToMessage(String chatId, String requestedUserId, String messageId, String emoji) {
        return mutateMessage(chatId, requestedUserId, messageId, (message, userId, user) -> {
            String normalizedEmoji = normalizeText(emoji);
            List<ChatMessageReactionRecord> reactions = new ArrayList<>();
            for (ChatMessageReactionRecord reaction : safeReactions(message.getReactions())) {
                if (!userId.equals(normalizeId(reaction.getUserId()))) {
                    reactions.add(copyReactionRecords(List.of(reaction)).get(0));
                }
            }
            if (StringUtils.hasText(normalizedEmoji)) {
                ChatMessageReactionRecord reaction = new ChatMessageReactionRecord();
                reaction.setEmoji(normalizedEmoji);
                reaction.setUserId(userId);
                reaction.setUserName(resolveUserName(user, userId));
                reaction.setUserInitials(resolveUserInitials(user, userId));
                reaction.setUserGender(resolveUserGender(user));
                reaction.setReactedAtIso(Instant.now().toString());
                reactions.add(reaction);
            }
            message.setReactions(reactions);
        });
    }

    public ChatMessageDto updateMessageAttachments(
            String chatId,
            String requestedUserId,
            String messageId,
            List<ChatMessageAttachmentDto> attachments) {
        return mutateMessage(chatId, requestedUserId, messageId, (message, userId, user) -> {
            if (StringUtils.hasText(message.getDeletedAtIso())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Deleted messages cannot be updated.");
            }
            message.setAttachments(normalizeAttachments(attachments));
        });
    }

    public void markMessagesRead(String chatId, String requestedUserId, List<String> messageIds) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        ChatReadUpdate readUpdate = markMessagesRead(snapshot, userId, messageIds);
        if (!readUpdate.readMessageIds().isEmpty()) {
            publishChatEvent(toReadEvent(snapshot.chatId(), readUpdate));
        }
    }

    public void sendTypingSignal(String chatId, String requestedUserId, Boolean typing) {
        String userId = requireResolvedUserId(requestedUserId);
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        Users user = findUser(userId);
        publishChatEvent(ChatStreamEvent.typing(
                snapshot.chatId(),
                userId,
                resolveUserName(user, userId),
                resolveUserInitials(user, userId),
                resolveUserGender(user),
                Boolean.TRUE.equals(typing)));
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

    private List<ActivityChat> uniqueOwnerChats(List<ActivityChat> chatDocuments) {
        if (chatDocuments == null || chatDocuments.isEmpty()) {
            return List.of();
        }
        Map<String, ActivityChat> uniqueByChatId = new LinkedHashMap<>();
        for (ActivityChat chat : chatDocuments) {
            if (chat == null) {
                continue;
            }
            String chatId = normalizeId(chat.getChatId());
            if (!StringUtils.hasText(chatId)) {
                continue;
            }
            ActivityChat current = uniqueByChatId.get(chatId);
            if (current == null || sortableDate(chat.getDateIso()) > sortableDate(current.getDateIso())) {
                uniqueByChatId.put(chatId, chat);
            }
        }
        return new ArrayList<>(uniqueByChatId.values());
    }

    private List<ActivityChat> uniqueSupportCaseChats(List<ActivityChat> chatDocuments, String viewerUserId) {
        if (chatDocuments == null || chatDocuments.isEmpty()) {
            return List.of();
        }
        String normalizedViewerUserId = normalizeId(viewerUserId);
        Map<String, ActivityChat> uniqueByChatId = new LinkedHashMap<>();
        for (ActivityChat chat : chatDocuments) {
            if (chat == null || !isSupportCaseChat(chat)) {
                continue;
            }
            String chatId = normalizeId(chat.getChatId());
            if (!StringUtils.hasText(chatId)) {
                continue;
            }
            ActivityChat current = uniqueByChatId.get(chatId);
            boolean chatBelongsToViewer = normalizedViewerUserId.equals(normalizeId(chat.getOwnerUserId()));
            boolean currentBelongsToViewer = current != null && normalizedViewerUserId.equals(normalizeId(current.getOwnerUserId()));
            if (current == null
                    || (chatBelongsToViewer && !currentBelongsToViewer)
                    || (!currentBelongsToViewer && sortableDate(chat.getDateIso()) > sortableDate(current.getDateIso()))) {
                uniqueByChatId.put(chatId, chat);
            }
        }
        return new ArrayList<>(uniqueByChatId.values());
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
            String chatId = normalizeId(baseChat.getChatId());
            if (!StringUtils.hasText(chatId)) {
                continue;
            }
            Set<String> ownerUserIds = new LinkedHashSet<>();
            Set<String> participantUserIds = new LinkedHashSet<>();
            for (ActivityChat chat : activityChatsRepository.findByChatId(chatId)) {
                if (chat != null && StringUtils.hasText(chat.getOwnerUserId())) {
                    ownerUserIds.add(chat.getOwnerUserId().trim());
                }
            }
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
                ownerUserIds.add(participantUserId);
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

    private ChatReadUpdate markMessagesRead(
            ChatDocumentsSnapshot snapshot,
            String viewerUserId,
            List<String> requestedMessageIds) {
        Users viewer = findUser(viewerUserId);
        ChatReadAvatarRecord reader = buildReadAvatarRecord(viewer, viewerUserId);
        Set<String> targetMessageIds = requestedMessageIds == null
                ? Set.of()
                : requestedMessageIds.stream()
                        .map(this::normalizeId)
                        .filter(StringUtils::hasText)
                        .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        boolean targetAllMessages = targetMessageIds.isEmpty();
        List<ActivityChat> updatedDocuments = new ArrayList<>();
        boolean changed = false;
        Set<String> readMessageIds = new LinkedHashSet<>();
        String readAtIso = Instant.now().toString();
        for (ActivityChat existing : snapshot.chatDocuments()) {
            ActivityChat next = copyChat(existing);
            List<ChatMessageRecord> nextMessages = new ArrayList<>();
            for (ChatMessageRecord message : safeMessages(existing.getMessages())) {
                ChatMessageRecord nextMessage = copyMessageRecord(message);
                String senderId = nextMessage.getSenderAvatar() == null ? "" : normalizeId(nextMessage.getSenderAvatar().getId());
                boolean matchesTarget = targetAllMessages || targetMessageIds.contains(normalizeId(nextMessage.getId()));
                if (matchesTarget && !viewerUserId.equals(senderId) && addReader(nextMessage, reader)) {
                    changed = true;
                    readMessageIds.add(normalizeId(nextMessage.getId()));
                }
                nextMessages.add(nextMessage);
            }
            next.setMessages(nextMessages);
            if (viewerUserId.equals(normalizeId(existing.getOwnerUserId()))) {
                int unread = countUnreadMessages(next, viewerUserId);
                if (normalizeCount(existing.getUnread()) != unread) {
                    changed = true;
                }
                next.setUnread(unread);
            }
            updatedDocuments.add(next);
        }
        if (changed) {
            activityChatsRepository.saveAll(updatedDocuments);
        } else {
            updatedDocuments = snapshot.chatDocuments();
        }
        return new ChatReadUpdate(
                findOwnerChat(updatedDocuments, viewerUserId),
                List.copyOf(readMessageIds),
                toReadAvatarDto(reader),
                readAtIso);
    }

    private ChatMessageDto mutateMessage(
            String chatId,
            String requestedUserId,
            String messageId,
            ChatMessageMutator mutator) {
        String userId = requireResolvedUserId(requestedUserId);
        String normalizedMessageId = normalizeId(messageId);
        if (!StringUtils.hasText(normalizedMessageId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message id is required.");
        }
        ChatDocumentsSnapshot snapshot = requireChat(chatId, userId);
        Users user = findUser(userId);
        ChatMessageRecord targetMessageCandidate = findMessageById(snapshot.viewerChat(), normalizedMessageId);
        if (targetMessageCandidate == null) {
            targetMessageCandidate = findMessageById(snapshot.chatDocuments(), normalizedMessageId);
        }
        if (targetMessageCandidate == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found.");
        }
        final ChatMessageRecord targetMessage = targetMessageCandidate;
        List<ActivityChat> updatedDocuments = new ArrayList<>();
        ChatMessageRecord updatedViewerMessage = null;
        for (ActivityChat existing : snapshot.chatDocuments()) {
            ActivityChat next = copyChat(existing);
            List<ChatMessageRecord> nextMessages = new ArrayList<>();
            for (ChatMessageRecord existingMessage : safeMessages(existing.getMessages())) {
                ChatMessageRecord nextMessage = copyMessageRecord(existingMessage);
                if (isSameStoredChatMessage(nextMessage, targetMessage, normalizedMessageId)) {
                    mutator.apply(nextMessage, userId, user);
                    if (userId.equals(normalizeId(existing.getOwnerUserId()))) {
                        updatedViewerMessage = copyMessageRecord(nextMessage);
                    }
                }
                nextMessages.add(nextMessage);
            }
            next.setMessages(nextMessages);
            ChatMessageRecord latest = latestMessage(nextMessages);
            if (latest != null) {
                next.setLastMessage(chatMessageSummary(latest));
                ChatAvatarRecord latestSender = latest.getSenderAvatar();
                next.setLastSenderId(latestSender == null ? "" : normalizeId(latestSender.getId()));
                next.setDateIso(latest.getSentAtIso());
            }
            updatedDocuments.add(next);
        }
        activityChatsRepository.saveAll(updatedDocuments);
        if (updatedViewerMessage == null) {
            updatedViewerMessage = updatedDocuments.stream()
                    .flatMap(chat -> safeMessages(chat.getMessages()).stream())
                    .filter(message -> isSameStoredChatMessage(message, targetMessage, normalizedMessageId))
                    .findFirst()
                    .map(this::copyMessageRecord)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Message not found."));
        }
        publishChatEvent(toStreamEvent(snapshot.chatId(), updatedViewerMessage));
        return toMessageDto(updatedViewerMessage, userId);
    }

    private ChatMessageRecord findMessageById(ActivityChat chat, String messageId) {
        String normalizedMessageId = normalizeId(messageId);
        if (chat == null || !StringUtils.hasText(normalizedMessageId)) {
            return null;
        }
        return safeMessages(chat.getMessages()).stream()
                .filter(message -> normalizedMessageId.equals(normalizeId(message.getId())))
                .findFirst()
                .map(this::copyMessageRecord)
                .orElse(null);
    }

    private ChatMessageRecord findMessageById(List<ActivityChat> chats, String messageId) {
        if (chats == null || chats.isEmpty()) {
            return null;
        }
        for (ActivityChat chat : chats) {
            ChatMessageRecord message = findMessageById(chat, messageId);
            if (message != null) {
                return message;
            }
        }
        return null;
    }

    private boolean isSameStoredChatMessage(
            ChatMessageRecord candidate,
            ChatMessageRecord target,
            String messageId) {
        String normalizedMessageId = normalizeId(messageId);
        if (candidate == null
                || target == null
                || !StringUtils.hasText(normalizedMessageId)
                || !normalizedMessageId.equals(normalizeId(candidate.getId()))
                || !normalizedMessageId.equals(normalizeId(target.getId()))) {
            return false;
        }

        String candidateClientId = normalizeId(candidate.getClientId());
        String targetClientId = normalizeId(target.getClientId());
        if (StringUtils.hasText(candidateClientId)
                && StringUtils.hasText(targetClientId)
                && !candidateClientId.equals(targetClientId)) {
            return false;
        }

        String candidateSenderId = messageSenderId(candidate);
        String targetSenderId = messageSenderId(target);
        if (StringUtils.hasText(candidateSenderId)
                && StringUtils.hasText(targetSenderId)
                && !candidateSenderId.equals(targetSenderId)) {
            return false;
        }

        String candidateSentAtIso = normalizeText(candidate.getSentAtIso());
        String targetSentAtIso = normalizeText(target.getSentAtIso());
        if (StringUtils.hasText(candidateSentAtIso) && StringUtils.hasText(targetSentAtIso)) {
            return candidateSentAtIso.equals(targetSentAtIso);
        }

        if (StringUtils.hasText(candidateClientId) && StringUtils.hasText(targetClientId)) {
            return candidateClientId.equals(targetClientId);
        }

        return normalizeText(candidate.getText()).equals(normalizeText(target.getText()));
    }

    private String messageSenderId(ChatMessageRecord message) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        return senderAvatar == null ? "" : normalizeId(senderAvatar.getId());
    }

    private void requireOwnMessage(ChatMessageRecord message, String userId) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        String senderId = senderAvatar == null ? "" : normalizeId(senderAvatar.getId());
        if (!userId.equals(senderId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only your own messages can be changed.");
        }
    }

    private ChatMessageRecord latestMessage(List<ChatMessageRecord> messages) {
        return safeMessages(messages).stream()
                .filter(Objects::nonNull)
                .max(Comparator.comparing(message -> sortableDate(message.getSentAtIso())))
                .orElse(null);
    }

    @FunctionalInterface
    private interface ChatMessageMutator {
        void apply(ChatMessageRecord message, String userId, Users user);
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
                null,
                null,
                isSupportCaseChat(chat) ? normalizeSupportCaseStatus(chat.getSupportCaseStatus()) : "",
                safeText(chat.getSupportCaseAssigneeUserId()),
                safeText(chat.getSupportCaseAssigneeName()),
                safeText(chat.getSupportCaseAssigneeInitials()),
                safeText(chat.getSupportCaseUpdatedAtIso()));
    }

    private ChatSummaryProjection toSummaryProjection(ActivityChat chat) {
        if (chat == null) {
            return null;
        }
        ChatSummaryDto summary = toSummaryDto(chat);
        int unread = normalizeCount(summary.unread());
        int memberCount = Math.max(1, (int) safeMemberIds(chat.getMemberIds()).stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .count());
        int relevanceScore = (unread * 10) + memberCount;
        return new ChatSummaryProjection(summary, sortableDate(summary.dateIso()), Integer.MAX_VALUE, relevanceScore);
    }

    private ChatMessageDto toMessageDto(ChatMessageRecord message, String viewerUserId) {
        ChatAvatarRecord senderAvatar = message == null ? null : message.getSenderAvatar();
        String senderId = senderAvatar == null ? "" : safeText(senderAvatar.getId());
        Users sender = findUser(senderId);
        boolean deletedSender = isDeletedOrPurgedUser(sender, senderId);
        String senderName = deletedSender ? deletedUserName() : message == null ? "" : safeText(message.getSender());
        String senderInitials = deletedSender ? deletedUserInitials() : senderAvatar == null ? buildInitials(senderId) : safeText(senderAvatar.getInitials());
        String senderGender = deletedSender ? "deleted" : senderAvatar == null ? "man" : normalizeGender(senderAvatar.getGender());
        boolean deleted = StringUtils.hasText(message == null ? "" : message.getDeletedAtIso());
        return new ChatMessageDto(
                message == null ? "" : safeText(message.getId()),
                message == null ? "" : safeText(message.getClientId()),
                senderId,
                senderName,
                senderInitials,
                senderGender,
                "deleted".equals(senderGender) ? "" : resolveUserImageUrl(sender),
                deleted ? "" : message == null ? "" : safeText(message.getText()),
                message == null ? Instant.now().toString() : safeText(message.getSentAtIso()),
                Objects.equals(senderId, normalizeId(viewerUserId)),
                deleted ? List.of() : safeReadBy(message == null ? null : message.getReadBy()).stream()
                        .map(this::toReadAvatarDto)
                        .toList(),
                message == null ? "" : safeText(message.getDeletedAtIso()),
                message == null ? "" : safeText(message.getDeletedByUserId()),
                message == null ? "" : safeText(message.getDeletedByName()),
                deleted ? "" : message == null ? "" : safeText(message.getEditedAtIso()),
                deleted ? "" : message == null ? "" : safeText(message.getPinnedAtIso()),
                deleted ? "" : message == null ? "" : safeText(message.getPinnedByUserId()),
                deleted ? null : toReplyDto(message == null ? null : message.getReplyTo()),
                deleted ? List.of() : safeReactions(message == null ? null : message.getReactions()).stream()
                        .map(this::toReactionDto)
                        .toList(),
                deleted ? List.of() : safeAttachments(message == null ? null : message.getAttachments()).stream()
                        .map(this::toAttachmentDto)
                        .toList());
    }

    private ChatMessageReplyDto toReplyDto(ChatMessageReplyRecord record) {
        if (record == null || !StringUtils.hasText(record.getId())) {
            return null;
        }
        return new ChatMessageReplyDto(
                safeText(record.getId()),
                safeText(record.getSender()),
                safeText(record.getText()));
    }

    private ChatMessageReactionDto toReactionDto(ChatMessageReactionRecord record) {
        String userId = record == null ? "" : safeText(record.getUserId());
        Users user = findUser(userId);
        boolean deletedUser = isDeletedOrPurgedUser(user, userId);
        return new ChatMessageReactionDto(
                record == null ? "" : safeText(record.getEmoji()),
                userId,
                deletedUser ? deletedUserName() : record == null ? "" : safeText(record.getUserName()),
                deletedUser ? deletedUserInitials() : record == null ? "" : safeText(record.getUserInitials()),
                deletedUser ? "deleted" : record == null ? "man" : normalizeGender(record.getUserGender()),
                record == null ? "" : safeText(record.getReactedAtIso()));
    }

    private ChatMessageAttachmentDto toAttachmentDto(ChatMessageAttachmentRecord record) {
        return new ChatMessageAttachmentDto(
                record == null ? "" : safeText(record.getId()),
                record == null ? "link" : safeText(record.getType()),
                record == null ? "" : safeText(record.getTitle()),
                record == null ? "" : safeText(record.getEntityId()),
                record == null ? "" : safeText(record.getAssetType()),
                record == null ? "" : safeText(record.getOwnerUserId()),
                record == null ? "available" : normalizeAttachmentStatus(record.getStatus()),
                record == null ? "" : safeText(record.getUnavailableReason()),
                record == null ? "" : safeText(record.getSubtitle()),
                record == null ? "" : presentationAttachmentDescription(record),
                record == null ? "" : safeText(record.getUrl()),
                record == null ? "" : safeText(record.getPreviewUrl()),
                record == null ? "" : safeText(record.getMimeType()),
                record == null ? null : record.getSizeBytes());
    }

    private String presentationAttachmentDescription(ChatMessageAttachmentRecord record) {
        if (record == null) {
            return "";
        }
        String type = safeText(record.getType()).toLowerCase(Locale.US);
        if (!"poll".equals(type)) {
            return safeText(record.getDescription());
        }
        return maskDeletedPollVotes(record.getDescription());
    }

    private String maskDeletedPollVotes(String description) {
        String normalizedDescription = safeText(description);
        if (!StringUtils.hasText(normalizedDescription)) {
            return "";
        }
        try {
            Document root = Document.parse(normalizedDescription);
            Object optionsValue = root.get("options");
            if (!(optionsValue instanceof List<?> optionNodes)) {
                return normalizedDescription;
            }
            boolean changed = false;
            for (Object option : optionNodes) {
                if (!(option instanceof Document optionDocument)) {
                    continue;
                }
                Object votesValue = optionDocument.get("votes");
                if (!(votesValue instanceof List<?> voteNodes)) {
                    continue;
                }
                for (Object vote : voteNodes) {
                    if (!(vote instanceof Document voteObject)) {
                        continue;
                    }
                    String userId = safeText(Objects.toString(voteObject.get("userId"), ""));
                    if (!StringUtils.hasText(userId) || !isDeletedOrPurgedUser(findUser(userId), userId)) {
                        continue;
                    }
                    changed = putIfChanged(voteObject, "name", deletedUserName()) || changed;
                    changed = putIfChanged(voteObject, "initials", deletedUserInitials()) || changed;
                    changed = putIfChanged(voteObject, "gender", "deleted") || changed;
                }
            }
            return changed ? root.toJson() : normalizedDescription;
        } catch (Exception ignored) {
            return normalizedDescription;
        }
    }

    private boolean putIfChanged(Document node, String key, String value) {
        if (Objects.equals(safeText(Objects.toString(node.get(key), "")), safeText(value))) {
            return false;
        }
        node.put(key, safeText(value));
        return true;
    }

    private String chatMessageSummary(ChatMessageRecord message) {
        if (StringUtils.hasText(message == null ? "" : message.getDeletedAtIso())) {
            return "Deleted a message";
        }
        String text = message == null ? "" : safeText(message.getText());
        if (StringUtils.hasText(text)) {
            return text;
        }
        ChatMessageAttachmentRecord attachment = safeAttachments(message == null ? null : message.getAttachments()).stream()
                .findFirst()
                .orElse(null);
        if (attachment == null) {
            return "";
        }
        String type = safeText(attachment.getType()).toLowerCase(Locale.US);
        return switch (type) {
            case "image" -> "Sent an image";
            case "event" -> "Shared an event";
            case "asset" -> "Shared an asset";
            case "voice" -> "Sent a voice clip";
            case "poll" -> "Created a poll";
            case "link" -> "Shared a link";
            default -> StringUtils.hasText(attachment.getTitle()) ? safeText(attachment.getTitle()) : "Shared an attachment";
        };
    }

    private ChatReadAvatarDto toReadAvatarDto(ChatReadAvatarRecord record) {
        String userId = record == null ? "" : safeText(record.getId());
        Users user = findUser(userId);
        boolean deletedUser = isDeletedOrPurgedUser(user, userId);
        String gender = deletedUser ? "deleted" : record == null ? "man" : normalizeGender(record.getGender());
        return new ChatReadAvatarDto(
                userId,
                deletedUser ? deletedUserInitials() : record == null ? "" : safeText(record.getInitials()),
                gender,
                "deleted".equals(gender) ? "" : resolveUserImageUrl(user));
    }

    private ChatMessageRecord buildMessageRecord(
            Users sender,
            String senderUserId,
            String text,
            String clientId,
            ChatMessageReplyRecord replyTo,
            List<ChatMessageAttachmentRecord> attachments) {
        Instant sentAt = Instant.now();
        ChatMessageRecord message = new ChatMessageRecord();
        message.setId(UUID.randomUUID().toString());
        message.setClientId(normalizeText(clientId));
        message.setSender(resolveUserName(sender, senderUserId));
        message.setSenderAvatar(buildSenderAvatarRecord(sender, senderUserId));
        message.setText(text);
        message.setTime(CHAT_TIME_FORMATTER.format(sentAt));
        message.setSentAtIso(sentAt.toString());
        message.setMine(Boolean.FALSE);
        message.setReadBy(new ArrayList<>());
        message.setReplyTo(copyReplyRecord(replyTo));
        message.setReactions(new ArrayList<>());
        message.setAttachments(copyAttachmentRecords(attachments));
        return message;
    }

    private ChatMessageRecord buildSystemMessageRecord(String text, String systemType) {
        Instant sentAt = Instant.now();
        ChatAvatarRecord avatar = new ChatAvatarRecord();
        avatar.setId("");
        avatar.setInitials("MS");
        avatar.setGender("system");
        ChatMessageRecord message = new ChatMessageRecord();
        message.setId(UUID.randomUUID().toString());
        message.setClientId(firstNonBlank(systemType, "system"));
        message.setSender("System");
        message.setSenderAvatar(avatar);
        message.setText(text);
        message.setTime(CHAT_TIME_FORMATTER.format(sentAt));
        message.setSentAtIso(sentAt.toString());
        message.setMine(Boolean.FALSE);
        message.setReadBy(new ArrayList<>());
        message.setReplyTo(null);
        message.setReactions(new ArrayList<>());
        message.setAttachments(new ArrayList<>());
        return message;
    }

    private ChatStreamEvent toStreamEvent(String chatId, ChatMessageRecord messageRecord) {
        ChatAvatarRecord senderAvatar = messageRecord.getSenderAvatar();
        String senderId = senderAvatar == null ? "" : safeText(senderAvatar.getId());
        Users sender = findUser(senderId);
        boolean deletedSender = isDeletedOrPurgedUser(sender, senderId);
        String senderGender = deletedSender ? "deleted" : senderAvatar == null ? "man" : normalizeGender(senderAvatar.getGender());
        return ChatStreamEvent.message(
                chatId,
                messageRecord.getId(),
                safeText(messageRecord.getClientId()),
                senderId,
                deletedSender ? deletedUserName() : safeText(messageRecord.getSender()),
                deletedSender ? deletedUserInitials() : senderAvatar == null ? "CH" : safeText(senderAvatar.getInitials()),
                senderGender,
                "deleted".equals(senderGender) ? "" : resolveUserImageUrl(sender),
                safeText(messageRecord.getText()),
                safeText(messageRecord.getSentAtIso()),
                safeReadBy(messageRecord.getReadBy()).stream()
                        .map(this::toReadAvatarDto)
                        .toList(),
                safeText(messageRecord.getDeletedAtIso()),
                safeText(messageRecord.getDeletedByUserId()),
                safeText(messageRecord.getDeletedByName()),
                safeText(messageRecord.getEditedAtIso()),
                safeText(messageRecord.getPinnedAtIso()),
                safeText(messageRecord.getPinnedByUserId()),
                toReplyDto(messageRecord.getReplyTo()),
                safeReactions(messageRecord.getReactions()).stream()
                        .map(this::toReactionDto)
                        .toList(),
                safeAttachments(messageRecord.getAttachments()).stream()
                        .map(this::toAttachmentDto)
                        .toList());
    }

    private ChatStreamEvent toReadEvent(String chatId, ChatReadUpdate readUpdate) {
        return ChatStreamEvent.read(
                chatId,
                readUpdate.reader().id(),
                readUpdate.reader().initials(),
                readUpdate.reader().gender(),
                readUpdate.readMessageIds(),
                readUpdate.readAtIso());
    }

    private void publishChatEvent(ChatStreamEvent streamEvent) {
        // Always fan out to sockets on this node right away so the sender gets the
        // persisted websocket echo even if Redis stream delivery is delayed.
        chatWebSocketSessionRegistry.broadcast(streamEvent);
        chatStreamPublisher.publish(streamEvent);
    }

    private ActivityChat findOwnerChat(List<ActivityChat> chats, String ownerUserId) {
        String normalizedOwnerUserId = normalizeId(ownerUserId);
        ActivityChat selected = null;
        for (ActivityChat chat : chats) {
            if (chat == null || !normalizedOwnerUserId.equals(normalizeId(chat.getOwnerUserId()))) {
                continue;
            }
            if (selected == null) {
                selected = chat;
                continue;
            }

            long candidateDate = sortableDate(chat.getDateIso());
            long selectedDate = sortableDate(selected.getDateIso());
            if (candidateDate > selectedDate) {
                selected = chat;
                continue;
            }
            if (candidateDate < selectedDate) {
                continue;
            }

            int candidateMessageCount = safeMessages(chat.getMessages()).size();
            int selectedMessageCount = safeMessages(selected.getMessages()).size();
            if (candidateMessageCount > selectedMessageCount) {
                selected = chat;
            }
        }
        return selected;
    }

    private boolean hasChatAccess(ActivityChat chat, String userId) {
        if (chat == null || !StringUtils.hasText(userId)) {
            return false;
        }
        String normalizedUserId = normalizeId(userId);
        if (normalizedUserId.equals(normalizeId(chat.getOwnerUserId()))) {
            return true;
        }
        if (isSupportCaseChat(chat) && isAdminUser(findUser(normalizedUserId))) {
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
        copy.setDistanceKm(null);
        copy.setDistanceMetersExact(null);
        copy.setSupportCaseStatus(source.getSupportCaseStatus());
        copy.setSupportCaseAssigneeUserId(source.getSupportCaseAssigneeUserId());
        copy.setSupportCaseAssigneeName(source.getSupportCaseAssigneeName());
        copy.setSupportCaseAssigneeInitials(source.getSupportCaseAssigneeInitials());
        copy.setSupportCaseUpdatedAtIso(source.getSupportCaseUpdatedAtIso());
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
        copy.setClientId(source.getClientId());
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
        copy.setDeletedAtIso(source.getDeletedAtIso());
        copy.setDeletedByUserId(source.getDeletedByUserId());
        copy.setDeletedByName(source.getDeletedByName());
        copy.setEditedAtIso(source.getEditedAtIso());
        copy.setPinnedAtIso(source.getPinnedAtIso());
        copy.setPinnedByUserId(source.getPinnedByUserId());
        copy.setReplyTo(copyReplyRecord(source.getReplyTo()));
        copy.setReactions(copyReactionRecords(source.getReactions()));
        copy.setAttachments(copyAttachmentRecords(source.getAttachments()));
        return copy;
    }

    private ChatMessageReplyRecord normalizeReply(ChatMessageReplyDto replyTo) {
        if (replyTo == null || !StringUtils.hasText(replyTo.id())) {
            return null;
        }
        ChatMessageReplyRecord record = new ChatMessageReplyRecord();
        record.setId(safeText(replyTo.id()));
        record.setSender(safeText(replyTo.sender()));
        record.setText(safeText(replyTo.text()));
        return record;
    }

    private ChatMessageReplyRecord copyReplyRecord(ChatMessageReplyRecord source) {
        if (source == null) {
            return null;
        }
        ChatMessageReplyRecord copy = new ChatMessageReplyRecord();
        copy.setId(source.getId());
        copy.setSender(source.getSender());
        copy.setText(source.getText());
        return copy;
    }

    private List<ChatMessageAttachmentRecord> normalizeAttachments(List<ChatMessageAttachmentDto> attachments) {
        if (attachments == null || attachments.isEmpty()) {
            return List.of();
        }
        List<ChatMessageAttachmentRecord> normalized = new ArrayList<>();
        for (ChatMessageAttachmentDto attachment : attachments) {
            if (attachment == null) {
                continue;
            }
            String type = safeText(attachment.type());
            String title = safeText(attachment.title());
            String url = safeText(attachment.url());
            String previewUrl = safeText(attachment.previewUrl());
            if (!StringUtils.hasText(type) || (!StringUtils.hasText(title) && !StringUtils.hasText(url) && !StringUtils.hasText(previewUrl))) {
                continue;
            }
            ChatMessageAttachmentRecord record = new ChatMessageAttachmentRecord();
            record.setId(StringUtils.hasText(attachment.id()) ? safeText(attachment.id()) : UUID.randomUUID().toString());
            record.setType(type);
            record.setTitle(title);
            record.setEntityId(safeText(attachment.entityId()));
            record.setAssetType(safeText(attachment.assetType()));
            record.setOwnerUserId(safeText(attachment.ownerUserId()));
            record.setStatus(normalizeAttachmentStatus(attachment.status()));
            record.setUnavailableReason(safeText(attachment.unavailableReason()));
            record.setSubtitle(safeText(attachment.subtitle()));
            record.setDescription(safeText(attachment.description()));
            record.setUrl(url);
            record.setPreviewUrl(previewUrl);
            record.setMimeType(safeText(attachment.mimeType()));
            record.setSizeBytes(attachment.sizeBytes() == null ? null : Math.max(0L, attachment.sizeBytes()));
            normalized.add(record);
        }
        return normalized;
    }

    private List<ChatMessageAttachmentRecord> copyAttachmentRecords(List<ChatMessageAttachmentRecord> attachments) {
        List<ChatMessageAttachmentRecord> copied = new ArrayList<>();
        for (ChatMessageAttachmentRecord attachment : safeAttachments(attachments)) {
            ChatMessageAttachmentRecord copy = new ChatMessageAttachmentRecord();
            copy.setId(attachment.getId());
            copy.setType(attachment.getType());
            copy.setTitle(attachment.getTitle());
            copy.setEntityId(attachment.getEntityId());
            copy.setAssetType(attachment.getAssetType());
            copy.setOwnerUserId(attachment.getOwnerUserId());
            copy.setStatus(normalizeAttachmentStatus(attachment.getStatus()));
            copy.setUnavailableReason(attachment.getUnavailableReason());
            copy.setSubtitle(attachment.getSubtitle());
            copy.setDescription(attachment.getDescription());
            copy.setUrl(attachment.getUrl());
            copy.setPreviewUrl(attachment.getPreviewUrl());
            copy.setMimeType(attachment.getMimeType());
            copy.setSizeBytes(attachment.getSizeBytes());
            copied.add(copy);
        }
        return copied;
    }

    private List<ChatMessageReactionRecord> copyReactionRecords(List<ChatMessageReactionRecord> reactions) {
        List<ChatMessageReactionRecord> copied = new ArrayList<>();
        for (ChatMessageReactionRecord reaction : safeReactions(reactions)) {
            ChatMessageReactionRecord copy = new ChatMessageReactionRecord();
            copy.setEmoji(reaction.getEmoji());
            copy.setUserId(reaction.getUserId());
            copy.setUserName(reaction.getUserName());
            copy.setUserInitials(reaction.getUserInitials());
            copy.setUserGender(reaction.getUserGender());
            copy.setReactedAtIso(reaction.getReactedAtIso());
            copied.add(copy);
        }
        return copied;
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

    private boolean isDeletedOrPurgedUser(Users user, String userId) {
        if (!StringUtils.hasText(safeText(userId))) {
            return false;
        }
        return user == null
                || "D".equalsIgnoreCase(safeText(user.getStatus()))
                || "deleted".equalsIgnoreCase(safeText(user.getProfileStatus()));
    }

    private String deletedUserName() {
        return "Deleted user";
    }

    private String deletedUserInitials() {
        return "DU";
    }

    private String requireResolvedUserId(String requestedUserId) {
        String userId = resolveUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authenticated user.");
        }
        return userId;
    }

    private String resolveUserId(String requestedUserId) {
        String resolvedUserId = normalizeId(homeUserProfileService.resolveSelectedUserId(requestedUserId));
        if (StringUtils.hasText(resolvedUserId)) {
            return resolvedUserId;
        }
        String normalizedRequestedUserId = normalizeId(requestedUserId);
        if (MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO
                && normalizedRequestedUserId.startsWith("admin-demo-")) {
            return normalizedRequestedUserId;
        }
        return "";
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

    private String resolveUserImageUrl(Users user) {
        if (user == null || user.getImages() == null) {
            return "";
        }
        return user.getImages().stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse("");
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
        if ("deleted".equals(normalized)) {
            return "deleted";
        }
        if (normalized.startsWith("w") || normalized.startsWith("f")) {
            return "woman";
        }
        return "man";
    }

    private String normalizeAttachmentStatus(String value) {
        return "unavailable".equals(safeText(value)) ? "unavailable" : "available";
    }

    private List<ChatMessageRecord> safeMessages(List<ChatMessageRecord> messages) {
        return messages == null ? List.of() : messages;
    }

    private List<String> safeMemberIds(List<String> memberIds) {
        return memberIds == null ? List.of() : memberIds;
    }

    private List<ChatReadAvatarRecord> safeReadBy(List<ChatReadAvatarRecord> readBy) {
        return readBy == null ? List.of() : readBy;
    }

    private List<ChatMessageAttachmentRecord> safeAttachments(List<ChatMessageAttachmentRecord> attachments) {
        return attachments == null ? List.of() : attachments;
    }

    private List<ChatMessageReactionRecord> safeReactions(List<ChatMessageReactionRecord> reactions) {
        return reactions == null ? List.of() : reactions;
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

    private String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String normalizeChatContextFilter(String value) {
        String normalized = safeText(value);
        if ("event".equalsIgnoreCase(normalized)
                || "subEvent".equalsIgnoreCase(normalized)
                || "group".equalsIgnoreCase(normalized)
                || "service".equalsIgnoreCase(normalized)) {
            return normalized;
        }
        return "all";
    }

    private boolean matchesChatContextFilter(ChatSummaryDto item, String contextFilter) {
        if (!StringUtils.hasText(contextFilter) || "all".equalsIgnoreCase(contextFilter)) {
            return true;
        }
        String channelType = safeText(item == null ? null : item.channelType());
        if ("event".equalsIgnoreCase(contextFilter)) {
            return "mainEvent".equalsIgnoreCase(channelType);
        }
        if ("subEvent".equalsIgnoreCase(contextFilter)) {
            return "optionalSubEvent".equalsIgnoreCase(channelType);
        }
        if ("group".equalsIgnoreCase(contextFilter)) {
            return "groupSubEvent".equalsIgnoreCase(channelType);
        }
        if ("service".equalsIgnoreCase(contextFilter)) {
            return "serviceEvent".equalsIgnoreCase(channelType);
        }
        return true;
    }

    private boolean matchesSupportCaseFilter(ChatSummaryDto item, String supportCaseFilter) {
        String normalizedFilter = normalizeSupportCaseFilter(supportCaseFilter);
        if (SUPPORT_CASE_FILTER_ALL.equals(normalizedFilter)) {
            return true;
        }
        return normalizedFilter.equals(normalizeSupportCaseStatus(item == null ? null : item.supportCaseStatus()));
    }

    private boolean isSupportCaseChat(ActivityChat chat) {
        if (chat == null) {
            return false;
        }
        return StringUtils.hasText(safeText(chat.getSupportCaseStatus()))
                || normalizeId(chat.getChatId()).startsWith("c-support-admin-");
    }

    private boolean isAdminUser(Users user) {
        return adminMenuCounterService.isAdminUser(user);
    }

    private String normalizeSupportCaseStatus(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case SUPPORT_CASE_STATUS_PICKED, SUPPORT_CASE_STATUS_SOLVED, SUPPORT_CASE_STATUS_BLOCKED -> normalized;
            default -> SUPPORT_CASE_STATUS_PENDING;
        };
    }

    private String normalizeSupportCaseFilter(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case SUPPORT_CASE_STATUS_PENDING, SUPPORT_CASE_STATUS_PICKED, SUPPORT_CASE_STATUS_SOLVED, SUPPORT_CASE_STATUS_BLOCKED -> normalized;
            default -> SUPPORT_CASE_FILTER_ALL;
        };
    }

    private String normalizeSupportCaseAction(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "pick", "unpick", "solve", "block", "reopen" -> normalized;
            default -> "";
        };
    }

    private SupportCaseState nextSupportCaseState(String action, String actorUserId, Users actor) {
        String nowIso = Instant.now().toString();
        return switch (action) {
            case "pick" -> assignedSupportCaseState(SUPPORT_CASE_STATUS_PICKED, actorUserId, actor, nowIso);
            case "solve" -> assignedSupportCaseState(SUPPORT_CASE_STATUS_SOLVED, actorUserId, actor, nowIso);
            case "block" -> assignedSupportCaseState(SUPPORT_CASE_STATUS_BLOCKED, actorUserId, actor, nowIso);
            case "unpick", "reopen" -> new SupportCaseState(SUPPORT_CASE_STATUS_PENDING, "", "", "", nowIso);
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported support case action.");
        };
    }

    private SupportCaseState assignedSupportCaseState(String status, String actorUserId, Users actor, String nowIso) {
        return new SupportCaseState(
                status,
                normalizeId(actorUserId),
                resolveUserName(actor, actorUserId),
                resolveUserInitials(actor, actorUserId),
                nowIso);
    }

    private void applySupportCaseState(ActivityChat chat, SupportCaseState state) {
        chat.setSupportCaseStatus(state.status());
        chat.setSupportCaseAssigneeUserId(state.assigneeUserId());
        chat.setSupportCaseAssigneeName(state.assigneeName());
        chat.setSupportCaseAssigneeInitials(state.assigneeInitials());
        chat.setSupportCaseUpdatedAtIso(state.updatedAtIso());
    }

    private String normalizeChatQuerySort(String sortValue, String secondaryFilterValue) {
        String normalizedSort = safeText(sortValue).toLowerCase(Locale.ROOT);
        if ("relevance".equals(normalizedSort)) {
            return normalizedSort;
        }
        if ("relevant".equalsIgnoreCase(safeText(secondaryFilterValue))) {
            return "relevance";
        }
        return "date";
    }

    private boolean resolveChatSortAscending(String sort, String sortDirectionValue) {
        String normalizedDirection = safeText(sortDirectionValue);
        if ("asc".equalsIgnoreCase(normalizedDirection)) {
            return true;
        }
        if ("desc".equalsIgnoreCase(normalizedDirection)) {
            return false;
        }
        return false;
    }

    private Comparator<ChatSummaryProjection> chatSummaryComparator(String sort, boolean ascending) {
        return (left, right) -> {
            int comparison;
            if ("relevance".equals(sort)) {
                comparison = compareInts(left.relevanceScore(), right.relevanceScore(), ascending);
                if (comparison != 0) {
                    return comparison;
                }
                comparison = compareLongs(left.dateMs(), right.dateMs(), false);
                if (comparison != 0) {
                    return comparison;
                }
            } else {
                comparison = compareLongs(left.dateMs(), right.dateMs(), ascending);
                if (comparison != 0) {
                    return comparison;
                }
            }
            return safeText(left.summary().id()).compareTo(safeText(right.summary().id()));
        };
    }

    private int compareInts(int left, int right, boolean ascending) {
        return ascending ? Integer.compare(left, right) : Integer.compare(right, left);
    }

    private int compareLongs(long left, long right, boolean ascending) {
        return ascending ? Long.compare(left, right) : Long.compare(right, left);
    }

    private int resolveChatCursorStartIndex(List<ChatSummaryProjection> items, String cursor) {
        String cursorId = parseChatCursorId(cursor);
        if (!StringUtils.hasText(cursorId)) {
            return 0;
        }
        for (int index = 0; index < items.size(); index += 1) {
            if (cursorId.equals(normalizeId(items.get(index).summary().id()))) {
                return index + 1;
            }
        }
        return 0;
    }

    private String serializeChatCursor(ChatSummaryDto item) {
        return item == null ? null : normalizeId(item.id());
    }

    private String parseChatCursorId(String cursor) {
        return normalizeId(cursor);
    }

    private int normalizeChatPageLimit(Integer limitValue) {
        if (limitValue == null || limitValue.intValue() <= 0) {
            return 10;
        }
        return Math.min(100, limitValue.intValue());
    }

    private long sortableDate(String value) {
        try {
            return StringUtils.hasText(value) ? Instant.parse(value.trim()).toEpochMilli() : 0L;
        } catch (Exception exception) {
            return 0L;
        }
    }

    private long parseIsoMillis(String value, long fallback) {
        if (!StringUtils.hasText(value)) {
            return fallback;
        }
        try {
            return Instant.parse(value.trim()).toEpochMilli();
        } catch (Exception exception) {
            return fallback;
        }
    }

    private String stableDeviceId(String firebaseToken) {
        return UUID.nameUUIDFromBytes(normalizeText(firebaseToken).getBytes()).toString();
    }

    private String buildMongoId(String ownerUserId, String chatId) {
        String stableKey = normalizeId(ownerUserId) + "|" + normalizeId(chatId);
        return "chat-owner-copy:" + UUID.nameUUIDFromBytes(stableKey.getBytes(StandardCharsets.UTF_8));
    }

    private record ChatSummaryProjection(
            ChatSummaryDto summary,
            long dateMs,
            int distanceMeters,
            int relevanceScore) {
    }

    private record ChatReadUpdate(
            ActivityChat viewerChat,
            List<String> readMessageIds,
            ChatReadAvatarDto reader,
            String readAtIso) {
    }

    private record ChatDocumentsSnapshot(String chatId, ActivityChat viewerChat, List<ActivityChat> chatDocuments) {
    }

    private record SupportCaseState(
            String status,
            String assigneeUserId,
            String assigneeName,
            String assigneeInitials,
            String updatedAtIso) {
    }
}
