package com.raxim.myscoutee.domain.accounts.service;

import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserFeedbackSubmitRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.chat.api.ChatReview;
import com.raxim.myscoutee.domain.content.api.UserFeedback;
import com.raxim.myscoutee.domain.content.api.UserReports;
import com.raxim.myscoutee.domain.events.api.EventHomeReads;
import com.raxim.myscoutee.domain.events.api.EventHomeReads.Event;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
import com.raxim.myscoutee.domain.notifications.api.RoleNotifications;
import static com.raxim.myscoutee.domain.events.api.EventOwnership.Event.STATUS_ACTIVE;

/** Optional report/feedback feature; mandatory profile reads do not depend on its owners. */
@Service
public class ModerationSubmissionService {
    private static final String OWNER_TYPE_EVENT = "event";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_DELETED = "deleted";
    private final SelectedProfileService selectedProfile;
    private final ChatReview chatReview;
    private final EventHomeReads activityEventsRepository;
    private final MemberDirectory activityMembersRepository;
    private final UserFeedback userFeedbackSubmissionsRepository;
    private final UserReports userReportSubmissionsRepository;
    private final OperationalTelemetry adminTelemetryService;
    private RoleNotifications roleNotifications;

    public ModerationSubmissionService(SelectedProfileService selectedProfile, ChatReview chatReview,
            EventHomeReads activityEventsRepository, MemberDirectory activityMembersRepository,
            UserFeedback userFeedbackSubmissionsRepository, UserReports userReportSubmissionsRepository,
            OperationalTelemetry adminTelemetryService) {
        this.selectedProfile = selectedProfile;
        this.chatReview = chatReview;
        this.activityEventsRepository = activityEventsRepository;
        this.activityMembersRepository = activityMembersRepository;
        this.userFeedbackSubmissionsRepository = userFeedbackSubmissionsRepository;
        this.userReportSubmissionsRepository = userReportSubmissionsRepository;
        this.adminTelemetryService = adminTelemetryService;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void bindRoleNotifications(RoleNotifications value) {
        this.roleNotifications = value;
    }

    public UserSubmitActionResponseDto submitFeedback(UserFeedbackSubmitRequestDto request) {
        Users currentUser = selectedProfile.resolveCurrentUser(request == null ? null : request.userId());
        String userId = normalizeId(currentUser == null ? null : currentUser.getId());
        if (!StringUtils.hasText(userId) || request == null) {
            return new UserSubmitActionResponseDto(false, "Unable to send feedback.");
        }

        String submissionId = userFeedbackSubmissionsRepository.submit(userId, safeText(request.category()), safeText(request.subject()), safeText(request.details()));
        if (roleNotifications != null) roleNotifications.moderationSubmitted("feedback-submitted", submissionId);
        adminTelemetryService.record("feedback.submitted", "moderation", submissionId, userId);
        return new UserSubmitActionResponseDto(true, null);
    }

    public UserSubmitActionResponseDto submitReport(UserReportUserSubmitRequestDto request) {
        Users currentUser = selectedProfile.resolveCurrentUser(request == null ? null : request.userId());
        String userId = normalizeId(currentUser == null ? null : currentUser.getId());
        if (!StringUtils.hasText(userId) || request == null) {
            return new UserSubmitActionResponseDto(false, "Unable to submit report.");
        }

        String targetUserId = normalizeId(request.targetUserId());
        String eventId = normalizeId(request.eventId());
        if (!StringUtils.hasText(targetUserId)
                || !StringUtils.hasText(eventId)
                || userId.equals(targetUserId)) {
            return new UserSubmitActionResponseDto(false, "Reports can only be submitted for an event organizer or a member you shared an event with.");
        }

        Event eventRecord = resolvePreferredEventRecord(eventId);
        Member reporterMembership = resolveAcceptedReportMember(eventId, userId);
        Member targetMembership = resolveAcceptedReportMember(eventId, targetUserId);
        boolean sharedAcceptedEvent = reporterMembership != null && targetMembership != null;
        boolean reportableEventOrganizer = isReportableEventOrganizer(eventRecord, targetUserId);
        if (!sharedAcceptedEvent && !reportableEventOrganizer) {
            return new UserSubmitActionResponseDto(false, "Reports can only be submitted for an event organizer or a member you shared an event with.");
        }

        String requestMemberEntryId = normalizeId(request.memberEntryId());
        String resolvedTargetMemberEntryId = resolveActivityMemberEntryId(targetMembership);
        if (StringUtils.hasText(requestMemberEntryId)
                && !requestMemberEntryId.equals(resolvedTargetMemberEntryId)) {
            return new UserSubmitActionResponseDto(false, "Reports can only be submitted for an event organizer or a member you shared an event with.");
        }

        String sourceType = normalizeOptionalText(request.sourceType());
        String sourceId = normalizeOptionalText(request.sourceId());
        String sourceText = normalizeOptionalText(request.sourceText());
        String chatId = normalizeOptionalText(request.chatId());
        String messageId = normalizeOptionalText(request.messageId());
        String assetId = normalizeOptionalText(request.assetId());
        String assetType = normalizeOptionalText(request.assetType());
        if (StringUtils.hasText(chatId) || "chat".equalsIgnoreCase(safeText(sourceType))) {
            var reportedChat = chatReview.reportEvidence(userId, targetUserId, chatId, messageId);
            if (reportedChat == null) {
                return new UserSubmitActionResponseDto(false, "Reports can only include chat messages you can view.");
            }
            chatId = normalizeOptionalText(reportedChat.chatId());
            messageId = normalizeOptionalText(reportedChat.messageId());
            sourceType = "chat";
            sourceId = normalizeOptionalText(firstNonBlank(sourceId, messageId));
            sourceText = normalizeOptionalText(firstNonBlank(sourceText, reportedChat.text()));
        }

        String reportSyncKey = reportSyncKey(
                userId,
                targetUserId,
                eventId,
                request.reason(),
                request.details(),
                sourceType,
                sourceId,
                chatId,
                messageId,
                assetId);
        if (userReportSubmissionsRepository.exists(reportSyncKey)) {
            return new UserSubmitActionResponseDto(true, "Report already submitted.");
        }

        var submission = userReportSubmissionsRepository.submit(new com.raxim.myscoutee.domain.content.api.UserReports.ReportDraft(
                reportSyncKey,
                userId,
                safeText(request.handle()),
                safeText(request.reason()),
                safeText(request.details()),
                targetUserId,
                resolvedTargetMemberEntryId,
                eventId,
                normalizeOptionalText(firstNonBlank(eventRecord == null ? null : eventRecord.getTitle(), request.eventTitle())),
                normalizeOptionalText(firstNonBlank(eventRecord == null ? null : eventRecord.getStartAtIso(), request.eventStartAtIso())),
                sourceType,
                sourceId,
                sourceText,
                chatId,
                messageId,
                assetId,
                assetType));
        if (submission.duplicate()) return new UserSubmitActionResponseDto(true, "Report already submitted.");
        if (roleNotifications != null) roleNotifications.moderationSubmitted("report-submitted", submission.id());
        adminTelemetryService.record("report.submitted", "moderation", submission.id(), userId);
        return new UserSubmitActionResponseDto(true, null);
    }

    private Event resolvePreferredEventRecord(String eventId) {
        String normalizedEventId = normalizeId(eventId);
        if (!StringUtils.hasText(normalizedEventId)) {
            return null;
        }
        return preferredEventRecordsBySourceId(activityEventsRepository.findBySourceId(normalizedEventId)).get(normalizedEventId);
    }

    private Member resolveAcceptedReportMember(String eventId, String userId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedUserId)) {
            return null;
        }

        Member storedMember = activityMembersRepository
                .findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE_EVENT, normalizedEventId, normalizedUserId)
                .orElse(null);
        if (storedMember != null) {
            return STATUS_ACCEPTED.equals(normalizeMemberStatus(storedMember.getStatus()))
                    ? storedMember
                    : null;
        }
        return null;
    }

    private boolean isReportableEventOrganizer(Event eventRecord, String userId) {
        String normalizedUserId = normalizeId(userId);
        if (eventRecord == null
                || !STATUS_ACTIVE.equals(eventRecord.getStatus())
                || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        if (normalizedUserId.equals(normalizeId(eventRecord.getOwnerUserId()))
                || normalizedUserId.equals(normalizeId(eventRecord.getCreatorUserId()))) {
            return true;
        }
        return (eventRecord.getAdmins() == null ? List.<String>of() : eventRecord.getAdmins()).stream()
                .map(this::normalizeId)
                .anyMatch(normalizedUserId::equals);
    }

    private String resolveActivityMemberEntryId(Member member) {
        if (member == null) {
            return null;
        }
        String syncKey = normalizeId(member.getSyncKey());
        if (StringUtils.hasText(syncKey)) {
            return syncKey;
        }
        String id = normalizeId(member.getId());
        return StringUtils.hasText(id) ? id : null;
    }

    private String normalizeMemberStatus(String status) {
        String normalizedStatus = safeText(status);
        if (STATUS_ACCEPTED.equals(normalizedStatus)) {
            return STATUS_ACCEPTED;
        }
        if (STATUS_PENDING.equals(normalizedStatus)) {
            return STATUS_PENDING;
        }
        if (STATUS_DELETED.equals(normalizedStatus)) {
            return STATUS_DELETED;
        }
        return normalizedStatus;
    }

    private Map<String, Event> preferredEventRecordsBySourceId(List<? extends Event> records) {
        LinkedHashMap<String, Event> preferredBySourceId = new LinkedHashMap<>();
        for (Event record : records == null ? List.<Event>of() : records) {
            if (record == null) {
                continue;
            }
            String sourceId = normalizeId(record.getSourceId());
            if (!StringUtils.hasText(sourceId)) {
                continue;
            }
            Event current = preferredBySourceId.get(sourceId);
            if (current == null || shouldPreferEventRecord(record, current)) {
                preferredBySourceId.put(sourceId, record);
            }
        }
        return preferredBySourceId;
    }

    private boolean shouldPreferEventRecord(Event next, Event current) {
        if (next == null) return false;
        if (current == null) return true;
        boolean nextActive = "A".equals(safeText(next.getStatus()));
        boolean currentActive = "A".equals(safeText(current.getStatus()));
        if (nextActive != currentActive) {
            return nextActive;
        }
        return normalizeCount(next.getAcceptedMembers()) >= normalizeCount(current.getAcceptedMembers());
    }

    private String reportSyncKey(
            String reporterUserId,
            String targetUserId,
            String eventId,
            String reason,
            String details,
            String sourceType,
            String sourceId,
            String chatId,
            String messageId,
            String assetId) {
        String identity = String.join("|",
                normalizeId(reporterUserId),
                normalizeId(targetUserId),
                normalizeId(eventId),
                normalizeId(reason),
                normalizeId(details),
                normalizeToken(sourceType),
                normalizeId(sourceId),
                normalizeId(chatId),
                normalizeId(messageId),
                normalizeId(assetId));
        return "user-report:" + UUID.nameUUIDFromBytes(identity.getBytes(StandardCharsets.UTF_8));
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeOptionalText(String value) {
        String normalized = normalizeId(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private static String normalizeToken(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private String safeText(String value) {
        return normalizeId(value);
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            String normalized = normalizeOptionalText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return null;
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }
}
