package com.raxim.myscoutee.domain.chat.service;
import java.util.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.document.ChatMessage;
import com.raxim.myscoutee.domain.chat.document.ChatMessage.ChatAvatarRecord;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.api.ChatReview;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminChatMessageDto;
@org.springframework.stereotype.Service
public class ChatReviewService implements ChatReview {
    private final ChatsRepository chatsRepository;
    private final ChatMessagesRepository chatMessagesRepository;
    public ChatReviewService(ChatsRepository chats, ChatMessagesRepository messages) { chatsRepository = chats; chatMessagesRepository = messages; }
    public ReportedChat reported(String chatId, String messageId, String reporterId, String targetId) {
        var chat = resolveReportedChat(chatId, messageId, reporterId, targetId);
        return chat == null ? null : new ReportedChat(chat.getTitle(), recentReportedChatMessages(chat.getChatId()));
    }
    private List<AdminChatMessageDto> recentReportedChatMessages(String chatId) {
        List<ChatMessage> messages = new ArrayList<>(chatMessagesRepository
                .findByChatIdOrderBySentAtIsoDesc(chatId, PageRequest.of(0, 50)));
        java.util.Collections.reverse(messages);
        return messages.stream().map(this::toChatMessage).toList();
    }

    private Chat resolveReportedChat(String requestedChatId, String requestedMessageId, String requestedReporterId, String requestedTargetId) {
        String chatId = normalize(requestedChatId);
        String messageId = normalize(requestedMessageId);
        String reporterUserId = normalize(requestedReporterId);
        String targetUserId = normalize(requestedTargetId);
        if (!StringUtils.hasText(chatId)
                || !StringUtils.hasText(messageId)
                || !StringUtils.hasText(reporterUserId)
                || !StringUtils.hasText(targetUserId)) {
            return null;
        }
        return chatsRepository.findByOwnerUserIdAndChatId(reporterUserId, chatId)
                .filter(chat -> chatIncludesMember(chat, targetUserId))
                .filter(chat -> chatContainsReportedMessage(chat, messageId, targetUserId))
                .orElse(null);
    }

    private boolean chatIncludesMember(Chat chat, String userId) {
        String normalizedUserId = normalize(userId);
        if (chat == null || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return chat.getMemberIds().stream()
                .map(this::normalize)
                .anyMatch(normalizedUserId::equals);
    }

    private boolean chatContainsReportedMessage(Chat chat, String messageId, String targetUserId) {
        String normalizedMessageId = normalize(messageId);
        String normalizedTargetUserId = normalize(targetUserId);
        if (chat == null || !StringUtils.hasText(normalizedMessageId) || !StringUtils.hasText(normalizedTargetUserId)) {
            return false;
        }
        return chatMessagesRepository.findByChatIdAndMessageId(chat.getChatId(), normalizedMessageId).stream()
                .anyMatch(message -> normalizedMessageId.equals(normalize(message.getId()))
                        && message.getSenderAvatar() != null
                        && normalizedTargetUserId.equals(normalize(message.getSenderAvatar().getId())));
    }

    private AdminChatMessageDto toChatMessage(ChatMessage message) {
        ChatAvatarRecord avatar = message.getSenderAvatar();
        return new AdminChatMessageDto(
                message.getId(),
                message.getSender(),
                avatar == null ? null : avatar.getId(),
                avatar == null ? null : avatar.getInitials(),
                avatar == null ? null : avatar.getGender(),
                message.getText(),
                message.getTime(),
                message.getSentAtIso());
    }

    private String normalize(String value) { return value == null ? "" : value.trim(); }
}
