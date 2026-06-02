package com.raxim.myscoutee.profile.security;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AdminMenuCounterService;

@Component
public class ChatPolicyFacts {
    private final ActivityChatsRepository activityChatsRepository;
    private final UsersRepository usersRepository;
    private final AdminMenuCounterService adminMenuCounterService;

    public ChatPolicyFacts(
            ActivityChatsRepository activityChatsRepository,
            UsersRepository usersRepository,
            AdminMenuCounterService adminMenuCounterService) {
        this.activityChatsRepository = activityChatsRepository;
        this.usersRepository = usersRepository;
        this.adminMenuCounterService = adminMenuCounterService;
    }

    public boolean canAccessChat(String chatId, String actorUserId) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        ActivityChat viewerChat = activityChatsRepository
                .findByOwnerUserIdAndChatId(normalizedActorUserId, normalizedChatId)
                .orElse(null);
        if (viewerChat != null) {
            return hasChatAccess(viewerChat, normalizedActorUserId);
        }
        return safeChats(activityChatsRepository.findByChatId(normalizedChatId)).stream()
                .anyMatch(chat -> hasChatAccess(chat, normalizedActorUserId));
    }

    public boolean canManageSupportChat(String chatId, String actorUserId) {
        String normalizedChatId = normalizeId(chatId);
        String normalizedActorUserId = normalizeId(actorUserId);
        if (!StringUtils.hasText(normalizedChatId) || !StringUtils.hasText(normalizedActorUserId)) {
            return false;
        }
        return isAdminUser(normalizedActorUserId)
                && safeChats(activityChatsRepository.findByChatId(normalizedChatId)).stream()
                        .anyMatch(this::isSupportCaseChat);
    }

    private boolean hasChatAccess(ActivityChat chat, String actorUserId) {
        if (chat == null || !StringUtils.hasText(actorUserId)) {
            return false;
        }
        String normalizedActorUserId = normalizeId(actorUserId);
        if (normalizedActorUserId.equals(normalizeId(chat.getOwnerUserId()))) {
            return true;
        }
        if (isSupportCaseChat(chat) && isAdminUser(normalizedActorUserId)) {
            return true;
        }
        return chat.getMemberIds() != null
                && chat.getMemberIds().stream()
                        .map(this::normalizeId)
                        .anyMatch(normalizedActorUserId::equals);
    }

    private boolean isSupportCaseChat(ActivityChat chat) {
        if (chat == null) {
            return false;
        }
        String chatId = normalizeId(chat.getChatId());
        return StringUtils.hasText(safeText(chat.getSupportCaseStatus()))
                || (StringUtils.hasText(chatId) && chatId.startsWith("c-support-admin-"));
    }

    private boolean isAdminUser(String userId) {
        Users user = usersRepository.findByUserId(userId).orElse(null);
        return adminMenuCounterService.isAdminUser(user);
    }

    private List<ActivityChat> safeChats(List<ActivityChat> chats) {
        return chats == null ? List.of() : chats;
    }

    private String normalizeId(String value) {
        String normalizedValue = safeText(value);
        return StringUtils.hasText(normalizedValue) ? normalizedValue : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
