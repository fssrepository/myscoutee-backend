package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushFcmOptions;
import com.google.firebase.messaging.WebpushNotification;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.mongo.ActivityChat;
import com.raxim.myscoutee.profile.data.document.mongo.Users;
import com.raxim.myscoutee.profile.repository.mongo.UsersRepository;

@Service
public class ChatPushNotificationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatPushNotificationService.class);
    private static final String APP_BADGE_URL = "/assets/logo/heart.webp";
    private static final String APP_FALLBACK_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_URL = "/game";

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
        String chatTitle = resolveChatTitle(referenceChat, event);
        String body = buildBody(event);
        String senderAvatarUrl = resolveSenderAvatarUrl(event.senderId());
        String clickUrl = buildClickUrl(event);
        String notificationTag = buildNotificationTag(event);
        long timestampMillis = resolveTimestampMillis(event.sentAtIso());

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
                    Message.Builder messageBuilder = Message.builder()
                            .setToken(firebaseToken)
                            .putData("type", "chat-message")
                            .putData("chatId", safeText(event.chatId()))
                            .putData("messageId", safeText(event.id()))
                            .putData("senderId", safeText(event.senderId()))
                            .putData("senderName", safeText(event.senderName()))
                            .putData("chatTitle", chatTitle)
                            .putData("title", chatTitle)
                            .putData("body", body)
                            .putData("text", safeText(event.text()))
                            .putData("icon", senderAvatarUrl)
                            .putData("badge", APP_BADGE_URL)
                            .putData("url", clickUrl)
                            .putData("tag", notificationTag);
                    WebpushNotification.Builder notificationBuilder = WebpushNotification.builder()
                            .setTitle(chatTitle)
                            .setBody(body)
                            .setIcon(senderAvatarUrl)
                            .setBadge(APP_BADGE_URL)
                            .setTag(notificationTag)
                            .setRenotify(true)
                            .setRequireInteraction(false);
                    if (timestampMillis > 0) {
                        notificationBuilder.setTimestampMillis(timestampMillis);
                    }
                    messageBuilder.setWebpushConfig(WebpushConfig.builder()
                            .putHeader("Urgency", "high")
                            .putData("type", "chat-message")
                            .putData("chatId", safeText(event.chatId()))
                            .putData("messageId", safeText(event.id()))
                            .putData("senderId", safeText(event.senderId()))
                            .putData("senderName", safeText(event.senderName()))
                            .putData("chatTitle", chatTitle)
                            .putData("title", chatTitle)
                            .putData("body", body)
                            .putData("text", safeText(event.text()))
                            .putData("icon", senderAvatarUrl)
                            .putData("badge", APP_BADGE_URL)
                            .putData("url", clickUrl)
                            .putData("tag", notificationTag)
                            .setFcmOptions(WebpushFcmOptions.withLink(clickUrl))
                            .setNotification(notificationBuilder.build())
                            .build());
                    FirebaseMessaging.getInstance().sendAsync(messageBuilder.build());
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

    private String resolveChatTitle(ActivityChat referenceChat, ChatStreamEvent event) {
        if (referenceChat != null && StringUtils.hasText(referenceChat.getTitle())) {
            return referenceChat.getTitle().trim();
        }
        if (StringUtils.hasText(event.senderName())) {
            return event.senderName().trim();
        }
        return "Chat";
    }

    private String buildBody(ChatStreamEvent event) {
        String senderName = safeText(event.senderName());
        String preview = previewBody(event.text());
        if (StringUtils.hasText(senderName) && StringUtils.hasText(preview)) {
            return senderName + ": " + preview;
        }
        if (StringUtils.hasText(preview)) {
            return preview;
        }
        if (StringUtils.hasText(senderName)) {
            return senderName + " sent a message.";
        }
        return "New chat message";
    }

    private String resolveSenderAvatarUrl(String senderUserId) {
        Users sender = usersRepository.findByUserId(safeText(senderUserId)).orElse(null);
        if (sender != null && sender.getImages() != null) {
            for (String imageUrl : sender.getImages()) {
                String normalizedImageUrl = safeText(imageUrl);
                if (StringUtils.hasText(normalizedImageUrl)) {
                    return normalizedImageUrl;
                }
            }
        }
        return APP_FALLBACK_ICON_URL;
    }

    private String buildClickUrl(ChatStreamEvent event) {
        String chatId = safeText(event.chatId());
        if (!StringUtils.hasText(chatId)) {
            return DEFAULT_CLICK_URL;
        }
        return DEFAULT_CLICK_URL + "?chatId=" + chatId;
    }

    private String buildNotificationTag(ChatStreamEvent event) {
        String chatId = safeText(event.chatId());
        return StringUtils.hasText(chatId) ? "chat-" + chatId : "chat";
    }

    private long resolveTimestampMillis(String sentAtIso) {
        String normalized = safeText(sentAtIso);
        if (!StringUtils.hasText(normalized)) {
            return 0L;
        }
        try {
            return Instant.parse(normalized).toEpochMilli();
        } catch (Exception exception) {
            return 0L;
        }
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
