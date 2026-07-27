package com.raxim.myscoutee.profile.service.notifications;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.UserNotification;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationPreferenceDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationReadResponseDto;
import com.raxim.myscoutee.profile.data.dto.notifications.NotificationDtos.UserNotificationsPageResponseDto;
import com.raxim.myscoutee.profile.repository.UserNotificationPageRepository;
import com.raxim.myscoutee.profile.repository.UserNotificationPageRepository.UserNotificationCursor;
import com.raxim.myscoutee.profile.repository.UserNotificationPageRepository.UserNotificationSlice;
import com.raxim.myscoutee.profile.repository.UserNotificationsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.mapper.UserNotificationMapper;

@Service
public class UserNotificationService {
    private static final String BUCKET_NEW = "new";
    private static final String BUCKET_ALL = "all";
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 50;

    private final UserNotificationsRepository userNotificationsRepository;
    private final UserNotificationPageRepository userNotificationPageRepository;
    private final UsersRepository usersRepository;
    private final UserNotificationMapper userNotificationMapper;

    public UserNotificationService(
            UserNotificationsRepository userNotificationsRepository,
            UserNotificationPageRepository userNotificationPageRepository,
            UsersRepository usersRepository,
            UserNotificationMapper userNotificationMapper) {
        this.userNotificationsRepository = userNotificationsRepository;
        this.userNotificationPageRepository = userNotificationPageRepository;
        this.usersRepository = usersRepository;
        this.userNotificationMapper = userNotificationMapper;
    }

    public UserNotificationsPageResponseDto queryPage(
            String recipientUserId,
            String requestedBucket,
            Integer requestedLimit,
            String cursor) {
        String normalizedRecipientUserId = requiredUserId(recipientUserId);
        String bucket = normalizeBucket(requestedBucket);
        int limit = normalizeLimit(requestedLimit);
        UserNotificationCursor parsedCursor = parseCursor(cursor, bucket);
        UserNotificationSlice slice = userNotificationPageRepository.findPage(
                normalizedRecipientUserId,
                BUCKET_NEW.equals(bucket),
                limit,
                parsedCursor);
        List<UserNotificationDto> records = userNotificationMapper.toDtos(slice.records());
        String nextCursor = slice.hasNext() && !slice.records().isEmpty()
                ? encodeCursor(bucket, slice.records().getLast())
                : null;
        int unreadCount = currentUnreadCount(normalizedRecipientUserId);
        return new UserNotificationsPageResponseDto(
                records,
                slice.total(),
                nextCursor,
                unreadCount,
                isMuted(normalizedRecipientUserId));
    }

    public UserNotificationReadResponseDto markRead(String recipientUserId, String notificationId) {
        String normalizedRecipientUserId = requiredUserId(recipientUserId);
        String normalizedNotificationId = requiredText(notificationId, "Notification id is required.");
        String nowIso = Instant.now().toString();
        var markedRead = userNotificationPageRepository.markRead(
                normalizedNotificationId,
                normalizedRecipientUserId,
                nowIso);
        UserNotification notification = markedRead.orElseGet(() -> userNotificationsRepository
                .findByIdAndRecipientUserId(normalizedNotificationId, normalizedRecipientUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification was not found.")));
        if (markedRead.isPresent()) {
            userNotificationPageRepository.incrementUnreadCounter(normalizedRecipientUserId, -1);
        }
        int unreadCount = currentUnreadCount(normalizedRecipientUserId);
        return new UserNotificationReadResponseDto(
                userNotificationMapper.toDto(notification),
                unreadCount);
    }

    public UserNotificationPreferenceDto updateMutedPreference(String recipientUserId, Boolean muted) {
        String normalizedRecipientUserId = requiredUserId(recipientUserId);
        if (muted == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Muted preference is required.");
        }
        userNotificationPageRepository.setMutedPreference(normalizedRecipientUserId, muted);
        return new UserNotificationPreferenceDto(muted);
    }

    public void materialize(NotificationOutboxItem outboxItem) {
        if (outboxItem == null) {
            return;
        }
        List<String> recipientUserIds = compactIds(outboxItem.getRecipientUserIds());
        if (recipientUserIds.isEmpty()) {
            return;
        }
        String outboxKey = firstNonBlank(outboxItem.getSyncKey(), outboxItem.getId());
        if (!StringUtils.hasText(outboxKey)) {
            return;
        }

        String nowIso = Instant.now().toString();
        String createdDate = firstNonBlank(outboxItem.getCreatedDate(), nowIso);
        Map<String, String> payload = normalizedPayload(outboxItem.getPayload());
        for (String recipientUserId : recipientUserIds) {
            UserNotification notification = toUserNotification(
                    outboxItem,
                    recipientUserId,
                    payload,
                    createdDate,
                    nowIso,
                    outboxKey);
            if (userNotificationPageRepository.insertIfAbsent(notification)) {
                userNotificationPageRepository.incrementUnreadCounter(recipientUserId, 1);
            }
        }
    }

    public int currentUnreadCount(String recipientUserId) {
        String normalizedRecipientUserId = requiredUserId(recipientUserId);
        return safeInt(userNotificationPageRepository.countUnread(normalizedRecipientUserId));
    }

    private UserNotification toUserNotification(
            NotificationOutboxItem outboxItem,
            String recipientUserId,
            Map<String, String> payload,
            String createdDate,
            String nowIso,
            String outboxKey) {
        String kind = safeText(outboxItem.getNotificationType());
        String sourceType = safeText(outboxItem.getEntityType());
        String sourceId = safeText(outboxItem.getEntityId());
        String senderUserId = firstNonBlank(
                payload.get("senderUserId"),
                payload.get("actorUserId"),
                outboxItem.getCreatedUser());
        UserNotification notification = new UserNotification();
        notification.setId(new ObjectId().toHexString());
        notification.setSyncKey(outboxKey + ":" + recipientUserId);
        notification.setOutboxId(nullableText(outboxItem.getId()));
        notification.setRecipientUserId(recipientUserId);
        notification.setKind(kind);
        notification.setCategory(resolveCategory(kind, outboxItem.getRecipientScope(), sourceType));
        notification.setTitle(firstNonBlank(outboxItem.getTitle(), payload.get("title"), "Notification"));
        notification.setMessage(firstNonBlank(
                outboxItem.getBody(),
                payload.get("body"),
                "You have a new update."));
        notification.setSenderUserId(nullableText(senderUserId));
        notification.setActionPath(toInternalActionPath(firstNonBlank(
                outboxItem.getClickUrl(),
                payload.get("url"),
                "/game")));
        notification.setSourceType(sourceType);
        notification.setSourceId(sourceId);
        notification.setPayload(payload);
        notification.setReadAtIso(null);
        notification.setCreatedDate(createdDate);
        notification.setCreatedUser(nullableText(outboxItem.getCreatedUser()));
        notification.setUpdatedDate(nowIso);
        notification.setUpdatedUser(nullableText(outboxItem.getCreatedUser()));
        return notification;
    }

    private String resolveCategory(String kind, String recipientScope, String sourceType) {
        String haystack = String.join(" ",
                safeText(kind),
                safeText(recipientScope),
                safeText(sourceType)).toLowerCase(Locale.ROOT);
        if (haystack.contains("scheduled")
                || haystack.contains("scheduler")
                || haystack.contains("random-group")
                || haystack.contains("random-room")) {
            return "scheduled";
        }
        if (haystack.contains("app-admin")
                || haystack.contains("admin-param")
                || haystack.contains("moderation")) {
            return "app-admin";
        }
        if (haystack.contains("asset")) {
            return "asset";
        }
        if (haystack.contains("chat")) {
            return "chat";
        }
        if (haystack.contains("event")) {
            if (haystack.contains("manager")
                    || haystack.contains("admin")
                    || haystack.contains("stage")
                    || haystack.contains("tournament")
                    || haystack.contains("ticketing")
                    || haystack.contains("checkout")) {
                return "event-admin";
            }
            return "event";
        }
        return "user";
    }

    private String toInternalActionPath(String clickUrl) {
        String candidate = firstNonBlank(clickUrl, "/game");
        try {
            URI uri = URI.create(candidate);
            String path = safeText(uri.getRawPath());
            if (!StringUtils.hasText(path)) {
                return "/game";
            }
            StringBuilder actionPath = new StringBuilder(path.startsWith("/") ? path : "/" + path);
            if (StringUtils.hasText(uri.getRawQuery())) {
                actionPath.append('?').append(uri.getRawQuery());
            }
            if (StringUtils.hasText(uri.getRawFragment())) {
                actionPath.append('#').append(uri.getRawFragment());
            }
            return actionPath.toString();
        } catch (IllegalArgumentException ignored) {
            return "/game";
        }
    }

    private UserNotificationCursor parseCursor(String cursor, String bucket) {
        String normalized = safeText(cursor);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        try {
            String decoded = new String(
                    Base64.getUrlDecoder().decode(normalized),
                    StandardCharsets.UTF_8);
            String[] fields = decoded.split("\\n", -1);
            if (fields.length != 3
                    || !bucket.equals(normalizeBucket(fields[0]))
                    || !StringUtils.hasText(fields[1])
                    || !StringUtils.hasText(fields[2])) {
                throw new IllegalArgumentException("Cursor does not match the notification bucket.");
            }
            Instant.parse(fields[1]);
            return new UserNotificationCursor(bucket, fields[1].trim(), fields[2].trim());
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid notification cursor.", exception);
        }
    }

    private String encodeCursor(String bucket, UserNotification notification) {
        String value = bucket
                + "\n"
                + safeText(notification == null ? null : notification.getCreatedDate())
                + "\n"
                + safeText(notification == null ? null : notification.getId());
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private boolean isMuted(String recipientUserId) {
        return usersRepository.findByUserId(recipientUserId)
                .map(Users::getNotificationPreferences)
                .map(Users.UserNotificationPreferencesRecord::muted)
                .map(Boolean.TRUE::equals)
                .orElse(false);
    }

    private String normalizeBucket(String bucket) {
        String normalized = safeText(bucket).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(normalized)) {
            return BUCKET_NEW;
        }
        if (!BUCKET_NEW.equals(normalized) && !BUCKET_ALL.equals(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Notification bucket must be new or all.");
        }
        return normalized;
    }

    private int normalizeLimit(Integer limit) {
        if (limit == null) {
            return DEFAULT_PAGE_SIZE;
        }
        return Math.max(1, Math.min(MAX_PAGE_SIZE, limit));
    }

    private List<String> compactIds(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        LinkedHashSet<String> compact = new LinkedHashSet<>();
        values.stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .forEach(compact::add);
        return new ArrayList<>(compact);
    }

    private Map<String, String> normalizedPayload(Map<String, String> payload) {
        if (payload == null || payload.isEmpty()) {
            return Map.of();
        }
        LinkedHashMap<String, String> normalized = new LinkedHashMap<>();
        payload.forEach((key, value) -> {
            String normalizedKey = safeText(key);
            if (StringUtils.hasText(normalizedKey)) {
                normalized.put(normalizedKey, safeText(value));
            }
        });
        return Map.copyOf(normalized);
    }

    private String requiredUserId(String userId) {
        return requiredText(userId, "Current user is required.");
    }

    private String requiredText(String value, String message) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return normalized;
    }

    private int safeInt(long value) {
        if (value <= 0L) {
            return 0;
        }
        return value > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) value;
    }

    private String firstNonBlank(String... values) {
        if (values == null) {
            return null;
        }
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value.trim();
            }
        }
        return null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String nullableText(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }
}
