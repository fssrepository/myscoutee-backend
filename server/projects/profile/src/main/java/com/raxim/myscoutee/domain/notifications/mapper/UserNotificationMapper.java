package com.raxim.myscoutee.domain.notifications.mapper;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.notifications.document.UserNotification;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.notifications.dto.NotificationDtos.UserNotificationDto;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@Component
public class UserNotificationMapper {
    private final UsersRepository usersRepository;

    public UserNotificationMapper(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public List<UserNotificationDto> toDtos(List<UserNotification> notifications) {
        if (notifications == null || notifications.isEmpty()) {
            return List.of();
        }
        List<String> senderUserIds = notifications.stream()
                .filter(Objects::nonNull)
                .map(UserNotification::getSenderUserId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
        Map<String, Users> usersById = senderUserIds.isEmpty()
                ? Map.of()
                : usersRepository.findByUserIdIn(senderUserIds).stream()
                        .filter(Objects::nonNull)
                        .filter(user -> StringUtils.hasText(user.getId()))
                        .collect(Collectors.toMap(
                                Users::getId,
                                Function.identity(),
                                (left, right) -> left,
                                LinkedHashMap::new));
        return notifications.stream()
                .filter(Objects::nonNull)
                .map(notification -> toDto(
                        notification,
                        StringUtils.hasText(notification.getSenderUserId())
                                ? usersById.get(notification.getSenderUserId())
                                : null))
                .toList();
    }

    public UserNotificationDto toDto(UserNotification notification) {
        if (notification == null) {
            return null;
        }
        Users sender = StringUtils.hasText(notification.getSenderUserId())
                ? usersRepository.findByUserId(notification.getSenderUserId()).orElse(null)
                : null;
        return toDto(notification, sender);
    }

    private UserNotificationDto toDto(UserNotification notification, Users sender) {
        Map<String, String> payload = notification.getPayload() == null
                ? Map.of()
                : Map.copyOf(notification.getPayload());
        return new UserNotificationDto(
                safeText(notification.getId()),
                safeText(notification.getRecipientUserId()),
                safeText(notification.getKind()),
                safeText(notification.getCategory()),
                safeText(notification.getTitle()),
                safeText(notification.getMessage()),
                safeText(notification.getCreatedDate()),
                nullableText(notification.getReadAtIso()),
                nullableText(notification.getSenderUserId()),
                firstNonBlank(sender == null ? null : sender.getName(), payload.get("senderName")),
                firstNonBlank(firstImage(sender), payload.get("senderAvatarUrl")),
                safeText(notification.getActionPath()),
                safeText(notification.getSourceType()),
                safeText(notification.getSourceId()),
                payload,
                notification.getOccurrenceCount() == null
                        ? 1
                        : Math.max(1, notification.getOccurrenceCount()),
                notification.getRevision() == null
                        ? 1L
                        : Math.max(1L, notification.getRevision()));
    }

    private String firstImage(Users user) {
        if (user == null || user.getImages() == null) {
            return null;
        }
        return user.getImages().stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .findFirst()
                .orElse(null);
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
