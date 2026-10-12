package com.raxim.myscoutee.domain.chat.service;

import static com.raxim.myscoutee.domain.chat.service.ChatRecordContext.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DuplicateKeyException;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.chat.api.SupportMessages;
import com.raxim.myscoutee.domain.chat.api.SupportWorkspaceDirectory;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.document.Chat.SupportCaseRecord;
import com.raxim.myscoutee.domain.chat.document.Chat.SupportCaseAssigneeRecord;
import com.raxim.myscoutee.domain.chat.document.ChatMessage;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatAvatarRecord;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatDto;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto;
import com.raxim.myscoutee.domain.chat.mapper.ChatMessageMapper;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;

/** Support creation and case management reuse the ordinary chat persistence owner. */
@Service
public class SupportConversationService implements SupportMessages {
    private final ChatService chats;
    private final ChatsRepository chatsRepository;
    private final ChatMessagesRepository chatMessagesRepository;
    private final SupportCaseCounters supportCaseCounters;
    private final ChatMessageMapper chatMessageMapper;
    private final ChatPushNotificationService chatPushNotificationService;
    private final AccessPermissions accessControlService;
    private final OperationalTelemetry adminTelemetryService;
    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private SupportWorkspaceDirectory supportWorkspaces;

    public SupportConversationService(ChatService chats, ChatsRepository chatsRepository,
            ChatMessagesRepository chatMessagesRepository, SupportCaseCounters supportCaseCounters,
            ChatMessageMapper chatMessageMapper, ChatPushNotificationService chatPushNotificationService,
            AccessPermissions accessControlService, OperationalTelemetry adminTelemetryService) {
        this.chats = chats;
        this.chatsRepository = chatsRepository;
        this.chatMessagesRepository = chatMessagesRepository;
        this.supportCaseCounters = supportCaseCounters;
        this.chatMessageMapper = chatMessageMapper;
        this.chatPushNotificationService = chatPushNotificationService;
        this.accessControlService = accessControlService;
        this.adminTelemetryService = adminTelemetryService;
    }

    public ChatDto updateSupportCase(String chatId, String requestedUserId, String actionValue) {
        String userId = chats.resolveChatActor(chatId, chats.requireResolvedUserId(requestedUserId));
        String normalizedChatId = normalizeId(chatId);
        if (!StringUtils.hasText(normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chat id is required.");
        }
        if (!accessControlService.can(AccessPolicyKeys.CHAT_SUPPORT_MANAGE, userId, userId, normalizedChatId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Authenticated user is not allowed to manage this support chat.");
        }
        ProfileSummary actor = chats.findUser(userId);
        String action = normalizeSupportCaseAction(actionValue);
        if (!StringUtils.hasText(action)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported support case action.");
        }

        List<Chat> chatDocuments = chats.ensureOwnerCopies(chatsRepository.findByChatId(normalizedChatId));
        if (chatDocuments.isEmpty() || chatDocuments.stream().noneMatch(chats::isSupportCaseChat)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Support case not found.");
        }

        SupportCaseState state = nextSupportCaseState(action, userId, actor);
        List<Chat> updatedDocuments = new ArrayList<>();
        for (Chat existing : chatDocuments) {
            Chat next = chats.copyChat(existing);
            applySupportCaseState(next, state);
            updatedDocuments.add(next);
        }
        chatsRepository.saveAll(updatedDocuments);
        supportCaseCounters.refreshSupportCaseCountersForAdmins();
        adminTelemetryService.record("admin.support.case." + action, "support", normalizedChatId, userId);

        Chat viewerChat = chats.findOwnerChat(updatedDocuments, userId);
        Chat responseChat = viewerChat == null ? updatedDocuments.get(0) : viewerChat;
        return chats.toChatDto(responseChat, chats.chatMemberUsers(List.of(responseChat)));
    }

    public ChatMessageDto sendAdminSupportMessage(
            String targetUserId,
            String adminUserId,
            String adminName,
            String adminInitials,
            String text,
            String supportStatus) {
        return sendAdminSupportMessage(targetUserId, adminUserId, adminName, adminInitials, text, supportStatus, null);
    }

    public ChatMessageDto sendAdminSupportMessage(String targetUserId, String adminUserId, String adminName,
            String adminInitials, String text, String supportStatus, String stableMessageId) {
        String normalizedTargetUserId = normalizeId(targetUserId);
        String normalizedAdminUserId = normalizeId(adminUserId);
        String normalizedText = chats.normalizeText(text);
        if (!StringUtils.hasText(normalizedTargetUserId)
                || !StringUtils.hasText(normalizedAdminUserId)
                || !StringUtils.hasText(normalizedText)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Support target, admin and message are required.");
        }
        ProfileSummary targetUser = chats.findUser(normalizedTargetUserId);
        if (targetUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Support target was not found.");
        }
        ProfileSummary adminUser = chats.findUser(normalizedAdminUserId);
        String workspaceGroupId = normalizeId(targetUser.getWorkspaceGroupId());
        var targetWorkspace = StringUtils.hasText(workspaceGroupId) && supportWorkspaces != null
                ? supportWorkspaces.supportWorkspace(workspaceGroupId) : null;
        boolean appModeration = chats.isAdminUser(adminUser);
        if (appModeration) {
            String targetBase = normalizeId(targetWorkspace == null ? null : targetWorkspace.baseId());
            if (!targetBase.equals(normalizeId(adminUser.getWorkspaceGroupId())))
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Support case unavailable in this base group.");
        }
        boolean groupModeration = StringUtils.hasText(workspaceGroupId) && !appModeration;
        if (groupModeration && (adminUser == null || !workspaceGroupId.equals(normalizeId(adminUser.getWorkspaceGroupId())))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Moderator and recipient must belong to the same workspace.");
        }
        String chatId = (groupModeration ? "c-moderation-group-" : "c-support-admin-") + normalizedTargetUserId;
        if (stableMessageId != null) {
            var delivered = chatMessagesRepository.findByChatIdAndMessageId(chatId, stableMessageId).orElse(null);
            if (delivered != null) return chatMessageMapper.toDto(delivered, normalizedAdminUserId);
        }
        var group = groupModeration && targetWorkspace != null && targetWorkspace.present() ? targetWorkspace : null;
        String chatTitle = groupModeration ? (group == null ? workspaceGroupId : group.name()) : "MyScoutee Support";
        String resolvedAdminName = firstNonBlank(adminName, chats.resolveUserName(adminUser, normalizedAdminUserId));
        String resolvedAdminInitials = firstNonBlank(adminInitials, chats.resolveUserInitials(adminUser, normalizedAdminUserId));
        String nowIso = Instant.now().toString();
        SupportCaseState supportCaseState = new SupportCaseState(
                chats.normalizeSupportCaseStatus(supportStatus),
                normalizedAdminUserId,
                resolvedAdminName,
                resolvedAdminInitials,
                nowIso);
        Map<String, Chat> existingByOwnerUserId = new LinkedHashMap<>();
        for (Chat existing : chatsRepository.findByChatId(chatId)) {
            if (existing != null && StringUtils.hasText(normalizeId(existing.getOwnerUserId()))) {
                existingByOwnerUserId.put(normalizeId(existing.getOwnerUserId()), existing);
            }
        }
        Chat targetChat = supportChatDocument(
                existingByOwnerUserId.get(normalizedTargetUserId),
                normalizedTargetUserId,
                chatId,
                resolvedAdminInitials,
                chatTitle,
                List.of(normalizedTargetUserId, normalizedAdminUserId),
                supportCaseState);
        Chat adminChat = supportChatDocument(
                existingByOwnerUserId.get(normalizedAdminUserId),
                normalizedAdminUserId,
                chatId,
                chats.resolveUserInitials(targetUser, normalizedTargetUserId),
                chatTitle + " · " + chats.resolveUserName(targetUser, normalizedTargetUserId),
                List.of(normalizedTargetUserId, normalizedAdminUserId),
                supportCaseState);
        if (!groupModeration) {
            targetChat.setSupportBaseGroupId(adminUser == null ? null : adminUser.getWorkspaceGroupId());
            adminChat.setSupportBaseGroupId(targetChat.getSupportBaseGroupId());
        }
        if (groupModeration) {
            for (Chat chat : List.of(targetChat, adminChat)) {
                chat.setChannelType(CHAT_CHANNEL_GROUP_SUPPORT);
                chat.setOwnerId(null);
                chat.setSupportCase(null);
            }
        }
        List<Chat> chatDocuments = normalizedTargetUserId.equals(normalizedAdminUserId)
                ? List.of(adminChat) : List.of(targetChat, adminChat);
        chatsRepository.saveAll(chatDocuments);
        if (!groupModeration) supportCaseCounters.refreshSupportCaseCountersForAdmins();

        ChatMessage message = chats.buildMessage(adminUser, normalizedAdminUserId, normalizedText, null, null, List.of());
        message.setSender(resolvedAdminName);
        ChatAvatarRecord senderAvatar = message.getSenderAvatar();
        if (senderAvatar != null) {
            senderAvatar.setInitials(resolvedAdminInitials);
        }
        if (stableMessageId != null) {
            message.setId(stableMessageId);
            message.setChatId(chatId);
            message.setMongoId(ChatMessage.buildMongoId(chatId, stableMessageId));
            message.refreshMessageSearchFields();
            try { chatMessagesRepository.insert(message); }
            catch (DuplicateKeyException duplicate) {
                return chatMessageMapper.toDto(chatMessagesRepository.findByChatIdAndMessageId(chatId, stableMessageId).orElseThrow(), normalizedAdminUserId);
            }
            var updated = chats.updateChatSummaries(chatDocuments, message, normalizedAdminUserId, true);
            var streamEvent = chatMessageMapper.toStreamEvent(chatId, message);
            chats.observeChatEventPublish(chats.publishChatEventAsync(streamEvent), streamEvent);
            chatPushNotificationService.notifyRecipients(updated, streamEvent);
            return chatMessageMapper.toDto(message, normalizedAdminUserId);
        }
        return chats.persistChatMessage(
                new ChatService.ChatDocumentsSnapshot(chatId, adminChat, chatDocuments),
                normalizedAdminUserId,
                message);
    }

    private Chat supportChatDocument(
            Chat existing,
            String ownerUserId,
            String chatId,
            String avatar,
            String title,
            List<String> memberIds,
            SupportCaseState supportCaseState) {
        Chat chat = existing == null ? new Chat() : chats.copyChat(existing);
        if (existing == null) {
            chat.setMongoId(chats.buildMongoId(ownerUserId, chatId));
            chat.setChatId(chatId);
            chat.setOwnerUserId(ownerUserId);
            chat.setUnread(0);
            chat.setLastMessage("");
            chat.setLastSenderId("");
            chat.setDateIso(supportCaseState.updatedAtIso());
        }
        chat.setAvatar(avatar);
        chat.setTitle(title);
        chat.setMemberIds(memberIds);
        chat.setChannelType(CHAT_CHANNEL_APP_SUPPORT);
        chat.setOwnerId(chatId);
        applySupportCaseState(chat, supportCaseState);
        return chat;
    }

    private SupportCaseRecord toSupportCaseRecord(SupportCaseState state) {
        SupportCaseRecord supportCase = new SupportCaseRecord();
        supportCase.setStatus(chats.normalizeSupportCaseStatus(state == null ? null : state.status()));
        supportCase.setUpdatedAtIso(state == null ? "" : safeText(state.updatedAtIso()));
        String assigneeUserId = normalizeId(state == null ? null : state.assigneeUserId());
        if (StringUtils.hasText(assigneeUserId)) {
            SupportCaseAssigneeRecord assignee = new SupportCaseAssigneeRecord();
            assignee.setUserId(assigneeUserId);
            assignee.setName(state == null ? "" : safeText(state.assigneeName()));
            assignee.setInitials(state == null ? "" : safeText(state.assigneeInitials()));
            supportCase.setAssignee(assignee);
        }
        return supportCase;
    }

    private String normalizeSupportCaseAction(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "pick", "unpick", "solve", "block", "reopen" -> normalized;
            default -> "";
        };
    }

    private SupportCaseState nextSupportCaseState(String action, String actorUserId, ProfileSummary actor) {
        String nowIso = Instant.now().toString();
        return switch (action) {
            case "pick" -> assignedSupportCaseState(ChatService.SUPPORT_CASE_STATUS_PICKED, actorUserId, actor, nowIso);
            case "solve" -> assignedSupportCaseState(ChatService.SUPPORT_CASE_STATUS_SOLVED, actorUserId, actor, nowIso);
            case "block" -> assignedSupportCaseState(ChatService.SUPPORT_CASE_STATUS_BLOCKED, actorUserId, actor, nowIso);
            case "unpick", "reopen" -> new SupportCaseState(ChatService.SUPPORT_CASE_STATUS_PENDING, "", "", "", nowIso);
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported support case action.");
        };
    }

    private SupportCaseState assignedSupportCaseState(String status, String actorUserId, ProfileSummary actor, String nowIso) {
        return new SupportCaseState(
                status,
                normalizeId(actorUserId),
                chats.resolveUserName(actor, actorUserId),
                chats.resolveUserInitials(actor, actorUserId),
                nowIso);
    }

    private void applySupportCaseState(Chat chat, SupportCaseState state) {
        chat.setChannelType(CHAT_CHANNEL_APP_SUPPORT);
        if (!StringUtils.hasText(normalizeId(chat.getOwnerId()))) {
            chat.setOwnerId(normalizeId(chat.getChatId()));
        }
        chat.setSupportCase(toSupportCaseRecord(state));
    }

    private record SupportCaseState(
            String status,
            String assigneeUserId,
            String assigneeName,
            String assigneeInitials,
            String updatedAtIso) {
    }
}
