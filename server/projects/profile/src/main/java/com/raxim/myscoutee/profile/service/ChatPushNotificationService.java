package com.raxim.myscoutee.profile.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityChat;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class ChatPushNotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatPushNotificationService.class);

    private final ConfigProperties configProperties;
    private final UsersRepository usersRepository;
    private final ChatWebSocketSessionRegistry sessionRegistry;

    public ChatPushNotificationService(
            ConfigProperties configProperties,
            UsersRepository usersRepository,
            ChatWebSocketSessionRegistry sessionRegistry) {
        this.configProperties = configProperties;
        this.usersRepository = usersRepository;
        this.sessionRegistry = sessionRegistry;
    }

    public void notifyRecipients(List<ActivityChat> chatDocuments, ChatStreamEvent event) {
        if (!configProperties.isFirebaseEnabled() || event == null || chatDocuments == null || chatDocuments.isEmpty()) {
            return;
        }

        ActivityChat referenceChat = chatDocuments.get(0);
        String title = StringUtils.hasText(referenceChat.getTitle())
                ? referenceChat.getTitle().trim()
                : (StringUtils.hasText(event.senderName()) ? event.senderName().trim() : "Chat");
        String body = previewBody(event.text());

        for (String userId : resolveRecipientUserIds(chatDocuments, event.senderId())) {
            if (!StringUtils.hasText(userId) || sessionRegistry.isUserConnected(event.chatId(), userId)) {
                continue;
            }
            Users user = usersRepository.findByUserId(userId).orElse(null);
            if (user == null || user.getDevices() == null || user.getDevices().isEmpty()) {
                continue;
            }
            for (String firebaseToken : resolveFirebaseTokens(user)) {
                try {
                    FirebaseMessaging.getInstance().sendAsync(Message.builder()
                            .setToken(firebaseToken)
                            .setNotification(Notification.builder()
                                    .setTitle(title)
                                    .setBody(body)
                                    .build())
                            .putData("type", "chat-message")
                            .putData("chatId", safeText(event.chatId()))
                            .putData("messageId", safeText(event.id()))
                            .putData("senderId", safeText(event.senderId()))
                            .putData("senderName", safeText(event.senderName()))
                            .putData("text", safeText(event.text()))
                            .build());
                } catch (Exception exception) {
                    LOGGER.warn("Unable to send Firebase chat notification to user {}.", userId, exception);
                }
            }
        }
    }

    private Set<String> resolveRecipientUserIds(List<ActivityChat> chatDocuments, String senderUserId) {
        Set<String> recipients = new LinkedHashSet<>();
        String normalizedSenderUserId = safeText(senderUserId);
        for (ActivityChat chat : chatDocuments) {
            if (chat == null) {
                continue;
            }
            if (StringUtils.hasText(chat.getOwnerUserId()) && !normalizedSenderUserId.equals(chat.getOwnerUserId().trim())) {
                recipients.add(chat.getOwnerUserId().trim());
            }
            if (chat.getMemberIds() == null) {
                continue;
            }
            for (String memberId : chat.getMemberIds()) {
                if (StringUtils.hasText(memberId) && !normalizedSenderUserId.equals(memberId.trim())) {
                    recipients.add(memberId.trim());
                }
            }
        }
        return recipients;
    }

    private Set<String> resolveFirebaseTokens(Users user) {
        Set<String> tokens = new LinkedHashSet<>();
        for (Users.UserDeviceRecord device : user.getDevices()) {
            if (device == null || !Boolean.TRUE.equals(device.getNotificationsEnabled())) {
                continue;
            }
            String token = safeText(device.getFirebaseToken());
            if (StringUtils.hasText(token)) {
                tokens.add(token);
            }
        }
        return tokens;
    }

    private String previewBody(String text) {
        String normalized = safeText(text);
        if (normalized.length() <= 140) {
            return normalized;
        }
        return normalized.substring(0, 137) + "...";
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
