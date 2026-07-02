package com.raxim.myscoutee.profile.service.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.Chat.SupportCaseAssigneeRecord;
import com.raxim.myscoutee.profile.data.document.Chat.SupportCaseRecord;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatSupportCaseAssigneeDto;
import com.raxim.myscoutee.profile.data.dto.activities.ChatDtos.ChatSupportCaseDto;

@Component
public class ChatMapper {
    private static final String SUPPORT_CASE_STATUS_PENDING = "pending";
    private static final String SUPPORT_CASE_STATUS_PICKED = "picked";
    private static final String SUPPORT_CASE_STATUS_SOLVED = "solved";
    private static final String SUPPORT_CASE_STATUS_BLOCKED = "blocked";

    public ChatDto toDto(Chat record) {
        if (record == null) {
            return null;
        }
        return new ChatDto(
                normalizeId(record.getChatId()),
                safeText(record.getAvatar()),
                safeText(record.getTitle()),
                safeText(record.getLastMessage()),
                safeText(record.getLastSenderId()),
                new ArrayList<>(record.getMemberIds() == null ? List.of() : record.getMemberIds()),
                normalizeCount(record.getUnread()),
                record.getDateIso(),
                record.getChannelType(),
                record.getOwnerId(),
                record.getDistanceKm(),
                record.getDistanceMetersExact(),
                toSupportCaseDto(record));
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
}
