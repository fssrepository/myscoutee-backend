package com.raxim.myscoutee.profile.service.mapper;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.Chat.SupportCaseAssigneeRecord;
import com.raxim.myscoutee.profile.data.document.Chat.SupportCaseRecord;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMemberDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatMetricsDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatSupportCaseAssigneeDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatSupportCaseDto;

@Component
public class ChatMapper {
    private static final String SUPPORT_CASE_STATUS_PENDING = "pending";
    private static final String SUPPORT_CASE_STATUS_WARNED = "warned";
    private static final String SUPPORT_CASE_STATUS_PICKED = "picked";
    private static final String SUPPORT_CASE_STATUS_SOLVED = "solved";
    private static final String SUPPORT_CASE_STATUS_BLOCKED = "blocked";

    public ChatDto toDto(Chat record) {
        return toDto(record, Map.of());
    }

    public ChatDto toDto(Chat record, Map<String, Users> usersById) {
        if (record == null) {
            return null;
        }
        List<String> memberIds = new ArrayList<>(record.getMemberIds() == null ? List.of() : record.getMemberIds());
        return new ChatDto(
                normalizeId(record.getChatId()),
                safeText(record.getAvatar()),
                safeText(record.getTitle()),
                safeText(record.getLastMessage()),
                safeText(record.getLastSenderId()),
                memberIds,
                toMemberDtos(memberIds, usersById),
                normalizeCount(record.getUnread()),
                record.getDateIso(),
                record.getChannelType(),
                record.getOwnerId(),
                record.getDistanceKm(),
                record.getDistanceMetersExact(),
                null,
                toSupportCaseDto(record));
    }

    public Map<String, ChatDto> toMap(Collection<Chat> records) {
        return toMap(records, Map.of());
    }

    public Map<String, ChatDto> toMap(Collection<Chat> records, Map<String, Users> usersById) {
        Map<String, ChatDto> result = new LinkedHashMap<>();
        for (Chat record : records == null ? List.<Chat>of() : records) {
            ChatDto dto = toDto(record, usersById);
            String ownerId = normalizeId(dto == null ? null : dto.ownerId());
            if (StringUtils.hasText(ownerId)) {
                result.put(ownerId, dto);
            }
        }
        return result;
    }

    public ChatDto withMetrics(ChatDto dto, ChatMetricsDto metrics) {
        if (dto == null || Objects.equals(dto.metrics(), metrics)) {
            return dto;
        }
        return new ChatDto(
                dto.id(),
                dto.avatar(),
                dto.title(),
                dto.lastMessage(),
                dto.lastSenderId(),
                new ArrayList<>(dto.memberIds() == null ? List.of() : dto.memberIds()),
                new ArrayList<>(dto.members() == null ? List.of() : dto.members()),
                dto.unread(),
                dto.dateIso(),
                dto.channelType(),
                dto.ownerId(),
                dto.distanceKm(),
                dto.distanceMetersExact(),
                metrics,
                dto.supportCase());
    }

    private List<ChatMemberDto> toMemberDtos(List<String> memberIds, Map<String, Users> usersById) {
        if (memberIds == null || memberIds.isEmpty() || usersById == null || usersById.isEmpty()) {
            return List.of();
        }
        List<ChatMemberDto> members = new ArrayList<>();
        for (String memberId : memberIds) {
            String normalizedMemberId = normalizeId(memberId);
            if (!StringUtils.hasText(normalizedMemberId)) {
                continue;
            }
            Users user = usersById.get(normalizedMemberId);
            if (user == null) {
                continue;
            }
            String name = safeText(user.getName());
            String label = StringUtils.hasText(name) ? name : normalizedMemberId;
            members.add(new ChatMemberDto(
                    normalizedMemberId,
                    label,
                    StringUtils.hasText(safeText(user.getInitials())) ? safeText(user.getInitials()) : initialsFromText(label),
                    normalizeGender(user.getGender()),
                    firstImageUrl(user.getImages()),
                    "accepted"));
        }
        return members;
    }

    public ChatMemberDto toMemberDto(Users user) {
        return toMemberDto(user, "accepted");
    }

    public ChatMemberDto toMemberDto(Users user, String status) {
        if (user == null || !StringUtils.hasText(normalizeId(user.getUserId()))) {
            return null;
        }
        String userId = normalizeId(user.getUserId());
        String name = safeText(user.getName());
        String label = StringUtils.hasText(name) ? name : userId;
        return new ChatMemberDto(
                userId,
                label,
                StringUtils.hasText(safeText(user.getInitials())) ? safeText(user.getInitials()) : initialsFromText(label),
                normalizeGender(user.getGender()),
                firstImageUrl(user.getImages()),
                "pending".equals(safeText(status)) ? "pending" : "accepted");
    }

    private ChatSupportCaseDto toSupportCaseDto(Chat record) {
        if (!isSupportCaseChat(record)) {
            return null;
        }
        SupportCaseRecord supportCase = record.getSupportCase();
        SupportCaseAssigneeRecord assignee = supportCase == null ? null : supportCase.getAssignee();
        ChatSupportCaseAssigneeDto assigneeDto = assignee == null || !StringUtils.hasText(normalizeId(assignee.getUserId()))
                ? null
                : new ChatSupportCaseAssigneeDto(
                        normalizeId(assignee.getUserId()),
                        safeText(assignee.getName()),
                        safeText(assignee.getInitials()));
        return new ChatSupportCaseDto(
                normalizeSupportCaseStatus(supportCase == null ? null : supportCase.getStatus()),
                assigneeDto,
                supportCase == null ? "" : safeText(supportCase.getUpdatedAtIso()));
    }

    private boolean isSupportCaseChat(Chat record) {
        if (record == null) {
            return false;
        }
        return "supportCase".equalsIgnoreCase(safeText(record.getChannelType()))
                || record.getSupportCase() != null
                || normalizeId(record.getChatId()).startsWith("c-support-admin-");
    }

    private String normalizeSupportCaseStatus(String value) {
        String normalized = safeText(value).toLowerCase();
        return switch (normalized) {
            case SUPPORT_CASE_STATUS_WARNED -> SUPPORT_CASE_STATUS_WARNED;
            case SUPPORT_CASE_STATUS_PICKED -> SUPPORT_CASE_STATUS_PICKED;
            case SUPPORT_CASE_STATUS_SOLVED -> SUPPORT_CASE_STATUS_SOLVED;
            case SUPPORT_CASE_STATUS_BLOCKED -> SUPPORT_CASE_STATUS_BLOCKED;
            default -> SUPPORT_CASE_STATUS_PENDING;
        };
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeId(String value) {
        return safeText(value);
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }

    private String normalizeGender(String value) {
        String normalized = safeText(value).toLowerCase();
        return "woman".equals(normalized) ? "woman" : "man";
    }

    private String firstImageUrl(List<String> images) {
        if (images == null) {
            return null;
        }
        return images.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .findFirst()
                .orElse(null);
    }

    private String initialsFromText(String value) {
        String text = safeText(value);
        if (!StringUtils.hasText(text)) {
            return "";
        }
        StringBuilder builder = new StringBuilder();
        for (String part : text.split("\\s+")) {
            if (StringUtils.hasText(part)) {
                builder.append(Character.toUpperCase(part.charAt(0)));
            }
            if (builder.length() >= 2) {
                break;
            }
        }
        return builder.toString();
    }
}
