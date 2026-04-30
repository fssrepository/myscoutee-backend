package com.raxim.myscoutee.profile.data.dto.admin;

import java.util.List;

public final class AdminDtos {
    private AdminDtos() {}

    public record AdminUserDto(String id, String name, String initials, String email) {}
    public record AdminActionRequestDto(String adminUserId, String message) {}
    public record AdminChatMessageDto(
            String id,
            String sender,
            String senderUserId,
            String senderInitials,
            String senderGender,
            String text,
            String time,
            String sentAtIso) {}
    public record AdminDashboardDto(
            AdminUserDto activeAdmin,
            List<AdminReportedUserDto> reportedUsers,
            List<AdminFeedbackDto> feedback) {}
    public record AdminReportedUserDto(
            String userId,
            String name,
            String initials,
            String gender,
            String city,
            String profileStatus,
            Integer reportCount,
            String lastReportedAtIso,
            List<AdminReportDto> reports) {}
    public record AdminReportDto(
            String id,
            String reporterUserId,
            String reporterName,
            String targetUserId,
            String reason,
            String details,
            String eventId,
            String eventTitle,
            String eventStartAtIso,
            String sourceType,
            String sourceId,
            String sourceText,
            String chatId,
            String messageId,
            String assetId,
            String assetType,
            String chatTitle,
            List<AdminChatMessageDto> chatMessages,
            String createdDate) {}
    public record AdminFeedbackDto(
            String id,
            String userId,
            String userName,
            String category,
            String subject,
            String details,
            String createdDate) {}
}
