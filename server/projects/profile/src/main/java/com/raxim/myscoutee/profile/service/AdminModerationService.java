package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.ChatMessage;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatAvatarRecord;
import com.raxim.myscoutee.profile.data.document.ChatMessage.ChatReadAvatarRecord;
import com.raxim.myscoutee.profile.data.document.UserFeedbackSubmission;
import com.raxim.myscoutee.profile.data.document.UserReportSubmission;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminDashboardDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminFeedbackDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminReportDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminReportedUserDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminReviewCountsDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminReviewResolveRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.profile.repository.ChatMessagesRepository;
import com.raxim.myscoutee.profile.repository.ChatsRepository;
import com.raxim.myscoutee.profile.repository.UserFeedbackSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UserReportSubmissionsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class AdminModerationService {
    private static final DateTimeFormatter CHAT_TIME_FORMAT = DateTimeFormatter
            .ofPattern("h:mm a", Locale.US)
            .withZone(ZoneId.systemDefault());
    private static final List<AdminUserDto> DEMO_ADMINS = List.of(
            new AdminUserDto("admin-demo-ava", "Ava Moderation", "AM", "ava.admin@myscoutee.local",
                    "Moderation workspace", "Reviews reports, feedback, and support chats.", List.of()),
            new AdminUserDto("admin-demo-noel", "Noel Safety", "NS", "noel.admin@myscoutee.local",
                    "Moderation workspace", "Reviews reports, feedback, and support chats.", List.of()));

    private final ConfigProperties configProperties;
    private final UserReportSubmissionsRepository reportsRepository;
    private final UserFeedbackSubmissionsRepository feedbackRepository;
    private final UsersRepository usersRepository;
    private final ChatsRepository chatsRepository;
    private final ChatMessagesRepository chatMessagesRepository;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;
    private final AppSettingsService appSettingsService;

    public AdminModerationService(
            ConfigProperties configProperties,
            UserReportSubmissionsRepository reportsRepository,
            UserFeedbackSubmissionsRepository feedbackRepository,
            UsersRepository usersRepository,
            ChatsRepository chatsRepository,
            ChatMessagesRepository chatMessagesRepository,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService,
            AppSettingsService appSettingsService) {
        this.configProperties = configProperties;
        this.reportsRepository = reportsRepository;
        this.feedbackRepository = feedbackRepository;
        this.usersRepository = usersRepository;
        this.chatsRepository = chatsRepository;
        this.chatMessagesRepository = chatMessagesRepository;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
        this.appSettingsService = appSettingsService;
    }

    public AdminDashboardDto dashboard(String adminUserId) {
        return dashboard(adminUserId, null, null);
    }

    public AdminDashboardDto dashboard(String adminUserId, String reportsStatus, String feedbackStatus) {
        return dashboardFor(
                resolveAdmin(adminUserId),
                normalizeReviewStatus(reportsStatus),
                normalizeReviewStatus(feedbackStatus));
    }

    public AdminUserDto resolveAdminActor(String adminUserId) {
        return resolveAdmin(adminUserId);
    }

    private AdminDashboardDto dashboardFor(AdminUserDto admin) {
        return dashboardFor(admin, null, null);
    }

    private AdminDashboardDto dashboardFor(AdminUserDto admin, String reportsStatus, String feedbackStatus) {
        List<UserReportSubmission> allReports = reportsRepository.findAllByOrderByCreatedDateDesc();
        List<UserFeedbackSubmission> allFeedback = feedbackRepository.findAllByOrderByCreatedDateDesc();
        List<UserReportSubmission> reports = filterReportsByStatus(allReports, reportsStatus);
        List<UserFeedbackSubmission> feedback = filterFeedbackByStatus(allFeedback, feedbackStatus);
        Map<String, Users> usersById = usersById(allReports, allFeedback);
        Map<String, List<UserReportSubmission>> byTarget = new LinkedHashMap<>();
        for (UserReportSubmission report : reports) {
            String targetUserId = normalize(report.getTargetUserId());
            if (StringUtils.hasText(targetUserId)) {
                byTarget.computeIfAbsent(targetUserId, ignored -> new ArrayList<>()).add(report);
            }
        }
        Map<String, List<UserReportSubmission>> allByTarget = new LinkedHashMap<>();
        for (UserReportSubmission report : allReports) {
            String targetUserId = normalize(report.getTargetUserId());
            if (StringUtils.hasText(targetUserId)) {
                allByTarget.computeIfAbsent(targetUserId, ignored -> new ArrayList<>()).add(report);
            }
        }
        List<AdminReportedUserDto> reportedUsers = byTarget.entrySet().stream()
                .map(entry -> toReportedUser(entry.getKey(), entry.getValue(), usersById, admin.id()))
                .sorted(Comparator.comparing(AdminReportedUserDto::lastReportedAtIso, Comparator.nullsLast(String::compareTo)).reversed())
                .toList();
        List<AdminReportedUserDto> blockedUsers = usersRepository.findByProfileStatus("blocked").stream()
                .map(user -> toBlockedUser(user, allByTarget.getOrDefault(normalize(user.getId()), List.of()), usersById, admin.id()))
                .toList();
        return new AdminDashboardDto(
                admin,
                reportedUsers,
                blockedUsers,
                feedback.stream().map(item -> toFeedback(item, usersById)).toList(),
                reviewCounts(allReports, allFeedback));
    }

    public AdminDashboardDto warn(String userId, AdminActionRequestDto request) {
        String targetUserId = normalize(userId);
        ensureReportedUser(targetUserId);
        AdminUserDto admin = resolveAdmin(request == null ? null : request.adminUserId());
        markReportWarned(targetUserId, admin.id(), request == null ? null : request.reportId());
        String message = normalize(request == null ? null : request.message());
        appendSupportMessage(targetUserId, admin, StringUtils.hasText(message) ? message
                : "Please update the reported behavior before your account is blocked.", "warned");
        adminTelemetryService.record("admin.user.warned", "moderation", targetUserId, admin.id());
        return dashboard(admin.id());
    }

    public AdminDashboardDto block(String userId, AdminActionRequestDto request) {
        String targetUserId = normalize(userId);
        ensureReportedUser(targetUserId);
        AdminUserDto admin = resolveAdmin(request == null ? null : request.adminUserId());
        Users user = usersRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reported user not found."));
        if (!"blocked".equals(normalize(user.getProfileStatus()))) {
            user.setPreviousProfileStatus(StringUtils.hasText(user.getProfileStatus()) ? user.getProfileStatus() : "public");
            user.setProfileStatus("blocked");
            usersRepository.save(user);
            affinityRecomputeTaskService.enqueueAdminStatusChanged(targetUserId);
            adminTelemetryService.record("admin.user.blocked", "moderation", targetUserId, admin.id());
        }
        String message = normalize(request == null ? null : request.message());
        appendSupportMessage(targetUserId, admin, StringUtils.hasText(message) ? message
                : "Your account has been blocked after moderation review. You can reply here to contact MyScoutee support and ask for a review.", "blocked");
        return dashboard(admin.id());
    }

    public AdminDashboardDto unblock(String userId, AdminActionRequestDto request) {
        String targetUserId = normalize(userId);
        AdminUserDto admin = resolveAdmin(request == null ? null : request.adminUserId());
        Users user = usersRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Blocked user not found."));
        String previous = normalize(user.getPreviousProfileStatus());
        user.setProfileStatus(StringUtils.hasText(previous) && !"blocked".equals(previous) ? previous : "public");
        user.setPreviousProfileStatus(null);
        usersRepository.save(user);
        affinityRecomputeTaskService.enqueueAdminStatusChanged(targetUserId);
        adminTelemetryService.record("admin.user.unblocked", "moderation", targetUserId, admin.id());
        return dashboard(admin.id());
    }

    public AdminDashboardDto resolveReport(String reportId, AdminReviewResolveRequestDto request) {
        String normalizedReportId = normalize(reportId);
        if (!StringUtils.hasText(normalizedReportId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Report id is required.");
        }
        AdminUserDto admin = resolveAdmin(request == null ? null : request.adminUserId());
        UserReportSubmission report = reportsRepository.findById(normalizedReportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found."));
        boolean resolved = request == null || request.resolved() == null || Boolean.TRUE.equals(request.resolved());
        boolean wasResolved = isResolved(report.getResolvedAtIso());
        String nowIso = Instant.now().toString();
        if (resolved) {
            report.setResolvedAtIso(nowIso);
            report.setResolvedByAdminUserId(admin.id());
        } else {
            report.setResolvedAtIso(null);
            report.setResolvedByAdminUserId(null);
        }
        report.setUpdatedDate(nowIso);
        report.setUpdatedUser(admin.id());
        reportsRepository.save(report);
        if (resolved && !wasResolved) {
            appendSupportMessage(
                    normalize(report.getUserId()),
                    admin,
                    reportResolvedMessage(report),
                    "solved");
        }
        adminTelemetryService.record(resolved ? "admin.report.resolved" : "admin.report.unresolved", "moderation", normalizedReportId, admin.id());
        return dashboard(admin.id());
    }

    public AdminDashboardDto resolveFeedback(String feedbackId, AdminReviewResolveRequestDto request) {
        String normalizedFeedbackId = normalize(feedbackId);
        if (!StringUtils.hasText(normalizedFeedbackId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Feedback id is required.");
        }
        AdminUserDto admin = resolveAdmin(request == null ? null : request.adminUserId());
        UserFeedbackSubmission feedback = feedbackRepository.findById(normalizedFeedbackId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback not found."));
        boolean resolved = request == null || request.resolved() == null || Boolean.TRUE.equals(request.resolved());
        boolean wasResolved = isResolved(feedback.getResolvedAtIso());
        String nowIso = Instant.now().toString();
        if (resolved) {
            feedback.setResolvedAtIso(nowIso);
            feedback.setResolvedByAdminUserId(admin.id());
        } else {
            feedback.setResolvedAtIso(null);
            feedback.setResolvedByAdminUserId(null);
        }
        feedback.setUpdatedDate(nowIso);
        feedback.setUpdatedUser(admin.id());
        feedbackRepository.save(feedback);
        if (resolved && !wasResolved) {
            appendSupportMessage(
                    normalize(feedback.getUserId()),
                    admin,
                    feedbackResolvedMessage(feedback),
                    "solved");
        }
        adminTelemetryService.record(resolved ? "admin.feedback.resolved" : "admin.feedback.unresolved", "moderation", normalizedFeedbackId, admin.id());
        return dashboard(admin.id());
    }

    private AdminUserDto resolveAdmin(String adminUserId) {
        if (configProperties.isFirebaseEnabled()) {
            return resolveFirebaseAdmin();
        }
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin demo access is restricted to demo data.");
        }
        String normalized = normalize(adminUserId);
        AdminUserDto admin = DEMO_ADMINS.stream()
                .filter(candidate -> candidate.id().equals(normalized))
                .findFirst()
                .orElse(DEMO_ADMINS.get(0));
        return withStoredAdminProfile(admin);
    }

    private AdminUserDto resolveFirebaseAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication == null ? null : authentication.getPrincipal();
        String email = principal instanceof FirebasePrincipal firebasePrincipal
                ? normalize(firebasePrincipal.getEmail())
                : normalize(authentication == null ? null : authentication.getName());
        if (!appSettingsService.isAdminEmail(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is restricted.");
        }
        return withStoredAdminProfile(new AdminUserDto(
                email,
                email,
                initialsForEmail(email),
                email,
                "Moderation workspace",
                "Reviews reports, feedback, and support chats.",
                List.of()));
    }

    private AdminUserDto withStoredAdminProfile(AdminUserDto admin) {
        Users user = usersRepository.findByUserId(admin.id()).orElse(null);
        if (user == null) {
            return admin;
        }
        String name = text(user.getName(), admin.name());
        String initials = text(user.getInitials(), admin.initials());
        String headline = text(user.getHeadline(), admin.headline());
        String about = text(user.getAbout(), admin.about());
        List<String> images = user.getImages() == null
                ? admin.images()
                : user.getImages().stream()
                        .map(this::normalize)
                        .filter(StringUtils::hasText)
                        .toList();
        return new AdminUserDto(admin.id(), name, initials, admin.email(), headline, about, images);
    }

    private void ensureReportedUser(String targetUserId) {
        if (!StringUtils.hasText(targetUserId)
                || reportsRepository.findByTargetUserIdOrderByCreatedDateDesc(targetUserId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only reported users can be moderated.");
        }
    }

    private void markReportWarned(String targetUserId, String adminUserId, String reportId) {
        String normalizedReportId = normalize(reportId);
        if (!StringUtils.hasText(normalizedReportId)) {
            return;
        }
        UserReportSubmission report = reportsRepository.findById(normalizedReportId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found."));
        if (!targetUserId.equals(normalize(report.getTargetUserId()))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Report does not belong to the reported user.");
        }
        String nowIso = Instant.now().toString();
        report.setWarnedAtIso(nowIso);
        report.setWarnedByAdminUserId(adminUserId);
        report.setUpdatedDate(nowIso);
        report.setUpdatedUser(adminUserId);
        reportsRepository.save(report);
    }

    private void appendSupportMessage(String targetUserId, AdminUserDto admin, String text, String supportStatus) {
        Instant now = Instant.now();
        String nowIso = now.toString();
        String chatId = "c-support-admin-" + targetUserId;
        String messageId = "m-admin-" + new ObjectId().toHexString();
        Users targetUser = usersRepository.findByUserId(targetUserId).orElse(null);
        ChatAvatarRecord adminAvatar = chatAvatar(admin.id(), admin.initials(), "woman");
        ChatMessage userMessage = supportMessage(messageId, admin.name(), adminAvatar, text, now, nowIso, false, List.of());
        userMessage.setChatId(chatId);
        userMessage.setMongoId(ChatMessage.buildMongoId(chatId, userMessage.getId()));
        userMessage.refreshMessageSearchFields();
        chatMessagesRepository.save(userMessage);
        Chat userChat = appendSupportMessageForOwner(
                targetUserId,
                chatId,
                admin.initials(),
                "MyScoutee Support",
                List.of(targetUserId, admin.id()),
                text,
                admin.id(),
                nowIso,
                true,
                supportStatus,
                admin);
        Chat adminChat = appendSupportMessageForOwner(
                admin.id(),
                chatId,
                text(targetUser == null ? null : targetUser.getInitials(), "U"),
                "MyScoutee Support · " + text(targetUser == null ? null : targetUser.getName(), "Reported user"),
                List.of(targetUserId, admin.id()),
                text,
                admin.id(),
                nowIso,
                false,
                supportStatus,
                admin);
        chatsRepository.save(userChat);
        chatsRepository.save(adminChat);
    }

    private Chat appendSupportMessageForOwner(
            String ownerUserId,
            String chatId,
            String avatar,
            String title,
            List<String> memberIds,
            String lastMessage,
            String lastSenderId,
            String dateIso,
            boolean unreadForOwner,
            String supportStatus,
            AdminUserDto assignee) {
        Chat chat = chatsRepository.findByOwnerUserIdAndChatId(ownerUserId, chatId).orElseGet(() -> {
            Chat next = new Chat();
            next.setMongoId(new ObjectId().toHexString());
            next.setChatId(chatId);
            next.setOwnerUserId(ownerUserId);
            next.setUnread(0);
            next.setChannelType("appSupport");
            next.setOwnerId(chatId);
            return next;
        });
        chat.setAvatar(avatar);
        chat.setTitle(title);
        chat.setMemberIds(memberIds);
        chat.setChannelType("appSupport");
        chat.setOwnerId(chatId);
        chat.setLastMessage(lastMessage);
        chat.setLastSenderId(lastSenderId);
        chat.setDateIso(dateIso);
        chat.setSupportCase(supportCase(text(supportStatus, "pending"), assignee, dateIso));
        chat.setUnread(unreadForOwner ? Math.max(1, chat.getUnread() == null ? 1 : chat.getUnread() + 1) : 0);
        return chat;
    }

    private Chat.SupportCaseRecord supportCase(String status, AdminUserDto assigneeDto, String updatedAtIso) {
        Chat.SupportCaseRecord supportCase = new Chat.SupportCaseRecord();
        supportCase.setStatus(text(status, "pending"));
        supportCase.setUpdatedAtIso(text(updatedAtIso, ""));
        if (assigneeDto != null && StringUtils.hasText(text(assigneeDto.id(), ""))) {
            Chat.SupportCaseAssigneeRecord assignee = new Chat.SupportCaseAssigneeRecord();
            assignee.setUserId(text(assigneeDto.id(), ""));
            assignee.setName(text(assigneeDto.name(), ""));
            assignee.setInitials(text(assigneeDto.initials(), ""));
            supportCase.setAssignee(assignee);
        }
        return supportCase;
    }

    private ChatMessage supportMessage(
            String messageId,
            String sender,
            ChatAvatarRecord avatar,
            String text,
            Instant now,
            String nowIso,
            boolean mine,
            List<ChatReadAvatarRecord> readBy) {
        ChatMessage message = new ChatMessage();
        message.setId(messageId);
        message.setSender(sender);
        message.setSenderAvatar(avatar);
        message.setText(text);
        message.setTime(CHAT_TIME_FORMAT.format(now));
        message.setSentAtIso(nowIso);
        message.setMine(mine);
        message.setReadBy(readBy);
        return message;
    }

    private ChatAvatarRecord chatAvatar(String id, String initials, String gender) {
        ChatAvatarRecord avatar = new ChatAvatarRecord();
        avatar.setId(id);
        avatar.setInitials(initials);
        avatar.setGender(gender);
        return avatar;
    }

    private AdminReviewCountsDto reviewCounts(List<UserReportSubmission> reports, List<UserFeedbackSubmission> feedback) {
        return new AdminReviewCountsDto(
                (int) reports.stream().filter(report -> !isResolved(report.getResolvedAtIso())).count(),
                (int) reports.stream().filter(report -> isResolved(report.getResolvedAtIso())).count(),
                (int) feedback.stream().filter(item -> !isResolved(item.getResolvedAtIso())).count(),
                (int) feedback.stream().filter(item -> isResolved(item.getResolvedAtIso())).count());
    }

    private List<UserReportSubmission> filterReportsByStatus(List<UserReportSubmission> reports, String status) {
        if (!StringUtils.hasText(status)) {
            return reports;
        }
        return reports.stream()
                .filter(report -> matchesReviewStatus(report.getResolvedAtIso(), status))
                .toList();
    }

    private List<UserFeedbackSubmission> filterFeedbackByStatus(List<UserFeedbackSubmission> feedback, String status) {
        if (!StringUtils.hasText(status)) {
            return feedback;
        }
        return feedback.stream()
                .filter(item -> matchesReviewStatus(item.getResolvedAtIso(), status))
                .toList();
    }

    private boolean matchesReviewStatus(String resolvedAtIso, String status) {
        boolean resolved = isResolved(resolvedAtIso);
        return "resolved".equals(status) ? resolved : !resolved;
    }

    private boolean isResolved(String resolvedAtIso) {
        return StringUtils.hasText(normalize(resolvedAtIso));
    }

    private String normalizeReviewStatus(String value) {
        String normalized = normalize(value).toLowerCase(Locale.ROOT);
        if ("resolved".equals(normalized) || "read".equals(normalized) || "solved".equals(normalized)) {
            return "resolved";
        }
        if ("unresolved".equals(normalized) || "new".equals(normalized) || "open".equals(normalized)) {
            return "unresolved";
        }
        return null;
    }

    private String reportResolvedMessage(UserReportSubmission report) {
        String handle = normalize(report.getHandle());
        if (StringUtils.hasText(handle)) {
            return "Your report about " + handle + " has been reviewed by MyScoutee moderation. Thank you for helping keep MyScoutee safe.";
        }
        return "Your report has been reviewed by MyScoutee moderation. Thank you for helping keep MyScoutee safe.";
    }

    private String feedbackResolvedMessage(UserFeedbackSubmission feedback) {
        String subject = normalize(feedback.getSubject());
        if (StringUtils.hasText(subject)) {
            return "Your feedback \"" + subject + "\" has been reviewed by MyScoutee. Thank you for helping improve the app.";
        }
        return "Your feedback has been reviewed by MyScoutee. Thank you for helping improve the app.";
    }

    private Map<String, Users> usersById(List<UserReportSubmission> reports, List<UserFeedbackSubmission> feedback) {
        List<String> ids = new ArrayList<>();
        reports.forEach(report -> {
            ids.add(normalize(report.getUserId()));
            ids.add(normalize(report.getTargetUserId()));
        });
        feedback.forEach(item -> ids.add(normalize(item.getUserId())));
        Map<String, Users> users = new LinkedHashMap<>();
        for (Users user : usersRepository.findByUserIdIn(ids.stream().filter(StringUtils::hasText).distinct().toList())) {
            users.put(user.getId(), user);
        }
        return users;
    }

    private AdminReportedUserDto toReportedUser(String userId, List<UserReportSubmission> reports, Map<String, Users> usersById, String adminUserId) {
        Users user = usersById.get(userId);
        return new AdminReportedUserDto(
                userId,
                text(user == null ? null : user.getName(), "Reported user"),
                text(user == null ? null : user.getInitials(), "??"),
                text(user == null ? null : user.getGender(), "woman"),
                text(user == null ? null : user.getCity(), ""),
                firstImage(user),
                text(user == null ? null : user.getProfileStatus(), "public"),
                reports.size(),
                reports.isEmpty() ? null : reports.get(0).getCreatedDate(),
                supportChat(adminUserId, userId) != null,
                supportChatUnread(adminUserId, userId),
                reports.stream().map(report -> toReport(report, usersById)).toList());
    }

    private AdminReportedUserDto toBlockedUser(Users user, List<UserReportSubmission> reports, Map<String, Users> usersById, String adminUserId) {
        return new AdminReportedUserDto(
                text(user.getId(), ""),
                text(user.getName(), "Blocked user"),
                text(user.getInitials(), "??"),
                text(user.getGender(), "woman"),
                text(user.getCity(), ""),
                firstImage(user),
                text(user.getProfileStatus(), "blocked"),
                reports.size(),
                reports.isEmpty() ? null : reports.get(0).getCreatedDate(),
                supportChat(adminUserId, user.getId()) != null,
                supportChatUnread(adminUserId, user.getId()),
                reports.stream().map(report -> toReport(report, usersById)).toList());
    }

    private Chat supportChat(String adminUserId, String targetUserId) {
        String adminId = normalize(adminUserId);
        String userId = normalize(targetUserId);
        if (!StringUtils.hasText(adminId) || !StringUtils.hasText(userId)) {
            return null;
        }
        String chatId = "c-support-admin-" + userId;
        return chatsRepository.findByOwnerUserIdAndChatId(adminId, chatId)
                .or(() -> chatsRepository.findByChatId(chatId).stream().findFirst())
                .orElse(null);
    }

    private int supportChatUnread(String adminUserId, String targetUserId) {
        Chat chat = supportChat(adminUserId, targetUserId);
        return chat == null ? 0 : Math.max(0, chat.getUnread() == null ? 0 : chat.getUnread());
    }

    private AdminReportDto toReport(UserReportSubmission report, Map<String, Users> usersById) {
        Users reporter = usersById.get(normalize(report.getUserId()));
        Chat chat = resolveReportedChat(report);
        return new AdminReportDto(report.getId(), report.getUserId(), text(reporter == null ? null : reporter.getName(), "Reporter"),
                firstImage(reporter), report.getTargetUserId(), report.getHandle(), report.getReason(), report.getDetails(), report.getEventId(), report.getEventTitle(),
                report.getEventStartAtIso(), report.getMemberEntryId(), report.getSourceType(), report.getSourceId(), report.getSourceText(),
                report.getChatId(), report.getMessageId(), report.getAssetId(), report.getAssetType(),
                chat == null ? null : chat.getTitle(),
                chat == null ? List.of() : chatMessagesRepository.findByChatIdOrderBySentAtIsoAsc(chat.getChatId()).stream().map(this::toChatMessage).toList(),
                report.getCreatedDate(),
                report.getWarnedAtIso(),
                report.getWarnedByAdminUserId(),
                report.getResolvedAtIso(),
                report.getResolvedByAdminUserId());
    }

    private Chat resolveReportedChat(UserReportSubmission report) {
        String chatId = normalize(report.getChatId());
        String messageId = normalize(report.getMessageId());
        String reporterUserId = normalize(report.getUserId());
        String targetUserId = normalize(report.getTargetUserId());
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

    private AdminFeedbackDto toFeedback(UserFeedbackSubmission item, Map<String, Users> usersById) {
        Users user = usersById.get(normalize(item.getUserId()));
        return new AdminFeedbackDto(item.getId(), item.getUserId(), text(user == null ? null : user.getName(), "User"),
                firstImage(user), item.getCategory(), item.getSubject(), item.getDetails(), item.getCreatedDate(),
                item.getResolvedAtIso(), item.getResolvedByAdminUserId());
    }

    private String firstImage(Users user) {
        if (user == null || user.getImages() == null) {
            return null;
        }
        return user.getImages().stream()
                .map(this::normalize)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);
    }

    private String normalize(String value) { return value == null ? "" : value.trim(); }
    private String text(String value, String fallback) { return StringUtils.hasText(normalize(value)) ? normalize(value) : fallback; }
    private String initialsForEmail(String email) {
        String[] parts = normalize(email).split("@")[0].split("[.\\-_\\s]+");
        StringBuilder out = new StringBuilder();
        for (String part : parts) {
            if (!part.isBlank()) out.append(Character.toUpperCase(part.charAt(0)));
            if (out.length() >= 2) break;
        }
        return out.length() == 0 ? "AD" : out.toString();
    }
}
