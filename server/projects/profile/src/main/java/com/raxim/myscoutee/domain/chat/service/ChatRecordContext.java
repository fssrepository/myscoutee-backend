package com.raxim.myscoutee.domain.chat.service;

import java.util.*;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.chat.document.Chat;

/** Existing channel/owner parsing shared by chat operations and their presentation. */
final class ChatRecordContext {
    private ChatRecordContext() {}
    static final String CHAT_CHANNEL_MAIN_EVENT = "mainEvent";
    static final String CHAT_CHANNEL_OPTIONAL_SUB_EVENT = "optionalSubEvent";
    static final String CHAT_CHANNEL_GROUP_SUB_EVENT = "groupSubEvent";
    static final String CHAT_CHANNEL_SERVICE_EVENT = "serviceEvent";
    static final String CHAT_CHANNEL_GROUP_SUPPORT = "groupSupport";
    static final String CHAT_CHANNEL_APP_SUPPORT = "appSupport";
    static final String CHAT_CHANNEL_SUPPORT_CASE = "supportCase";
    static final String OWNER_TYPE_EVENT = "event";
    static final String OWNER_TYPE_SUB_EVENT = "subEvent";
    static final String OWNER_TYPE_GROUP = "group";
    static final String MEMBER_STATUS_ACCEPTED = "accepted";
    static final String MEMBER_STATUS_PENDING = "pending";
    static final String RUNTIME_STATUS_DELETED = "D";

    static int normalizeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    static String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    static String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    static boolean supportsChatMetrics(String channelType) {
        return CHAT_CHANNEL_MAIN_EVENT.equals(channelType)
                || CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType);
    }

    static boolean metricChatRecord(Chat record) {
        return StringUtils.hasText(normalizeId(record == null ? null : record.getOwnerId()))
                && supportsChatMetrics(chatChannelType(record));
    }

    static String memberOwnerType(String channelType) {
        if (CHAT_CHANNEL_MAIN_EVENT.equals(channelType)) {
            return OWNER_TYPE_EVENT;
        }
        if (CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)) {
            return OWNER_TYPE_SUB_EVENT;
        }
        if (CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)) {
            return OWNER_TYPE_GROUP;
        }
        return "";
    }

    static String chatChannelType(Chat record) {
        String channelType = safeText(record == null ? null : record.getChannelType());
        if ("campaign".equals(channelType) || "case".equals(channelType) || "contact".equals(channelType)
                || CHAT_CHANNEL_MAIN_EVENT.equals(channelType)
                || CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)
                || CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)
                || CHAT_CHANNEL_SERVICE_EVENT.equals(channelType)
                || CHAT_CHANNEL_GROUP_SUPPORT.equals(channelType)
                || CHAT_CHANNEL_APP_SUPPORT.equals(channelType)
                || CHAT_CHANNEL_SUPPORT_CASE.equals(channelType)) {
            return channelType;
        }
        List<String> parts = splitOwnerId(record == null ? null : record.getOwnerId());
        if (parts.size() >= 3) {
            return CHAT_CHANNEL_GROUP_SUB_EVENT;
        }
        if (parts.size() == 2) {
            return CHAT_CHANNEL_OPTIONAL_SUB_EVENT;
        }
        return parts.size() == 1 ? CHAT_CHANNEL_MAIN_EVENT : "general";
    }

    static ChatOwnerParts chatOwnerParts(Chat record) {
        String channelType = chatChannelType(record);
        String ownerId = normalizeId(record == null ? null : record.getOwnerId());
        String eventId = normalizeId(record == null ? null : record.getEventId());
        String subEventId = normalizeId(record == null ? null : record.getSubEventId());
        String groupId = normalizeId(record == null ? null : record.getGroupId());
        List<String> parts = splitOwnerId(ownerId);
        if (CHAT_CHANNEL_GROUP_SUB_EVENT.equals(channelType)) {
            return new ChatOwnerParts(
                    StringUtils.hasText(eventId) ? eventId : parts.isEmpty() ? "" : parts.get(0),
                    StringUtils.hasText(subEventId) ? subEventId : parts.size() > 1 ? parts.get(1) : "",
                    StringUtils.hasText(groupId)
                            ? groupId
                            : parts.size() > 2 ? String.join(":", parts.subList(2, parts.size())) : "");
        }
        if (CHAT_CHANNEL_OPTIONAL_SUB_EVENT.equals(channelType)) {
            return new ChatOwnerParts(
                    StringUtils.hasText(eventId) ? eventId : parts.size() > 1 ? parts.get(0) : "",
                    StringUtils.hasText(subEventId)
                            ? subEventId
                            : parts.size() > 1 ? String.join(":", parts.subList(1, parts.size())) : ownerId,
                    "");
        }
        if (CHAT_CHANNEL_MAIN_EVENT.equals(channelType)) {
            return new ChatOwnerParts(StringUtils.hasText(eventId) ? eventId : ownerId, "", "");
        }
        return new ChatOwnerParts("", "", "");
    }

    static List<String> splitOwnerId(String ownerId) {
        String normalizedOwnerId = normalizeId(ownerId);
        if (!StringUtils.hasText(normalizedOwnerId)) {
            return List.of();
        }
        List<String> parts = new ArrayList<>();
        for (String part : normalizedOwnerId.split(":")) {
            String normalizedPart = normalizeId(part);
            if (StringUtils.hasText(normalizedPart)) {
                parts.add(normalizedPart);
            }
        }
        return parts;
    }

    static int safePageTotal(long total) {
        return total >= Integer.MAX_VALUE ? Integer.MAX_VALUE : Math.max(0, (int) total);
    }

    static int countValue(Integer value) {
        return normalizeCount(value);
    }

    record ChatOwnerParts(
            String eventId,
            String subEventId,
            String groupId) {
    }
}
