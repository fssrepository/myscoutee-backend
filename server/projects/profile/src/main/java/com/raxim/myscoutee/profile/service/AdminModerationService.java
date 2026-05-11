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
import com.raxim.myscoutee.profile.data.document.ActivityChat;
import com.raxim.myscoutee.profile.data.document.UserFeedbackSubmission;
import com.raxim.myscoutee.profile.data.document.UserReportSubmission;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminChatMessageDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminDashboardDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminFeedbackDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminReportDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminReportedUserDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.profile.repository.ActivityChatsRepository;
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
    private final ActivityChatsRepository chatsRepository;
    private final AffinityRecomputeTaskService affinityRecomputeTaskService;
    private final AdminTelemetryService adminTelemetryService;

    public AdminModerationService(
            ConfigProperties configProperties,
            UserReportSubmissionsRepository reportsRepository,
            UserFeedbackSubmissionsRepository feedbackRepository,
            UsersRepository usersRepository,
            ActivityChatsRepository chatsRepository,
            AffinityRecomputeTaskService affinityRecomputeTaskService,
            AdminTelemetryService adminTelemetryService) {
        this.configProperties = configProperties;
        this.reportsRepository = reportsRepository;
        this.feedbackRepository = feedbackRepository;
        this.usersRepository = usersRepository;
        this.chatsRepository = chatsRepository;
        this.affinityRecomputeTaskService = affinityRecomputeTaskService;
        this.adminTelemetryService = adminTelemetryService;
    }

    public AdminDashboardDto dashboard(String adminUserId) {
        return dashboardFor(resolveAdmin(adminUserId));
    }

    public AdminUserDto resolveAdminActor(String adminUserId) {
        return resolveAdmin(adminUserId);
    }

    private AdminDashboardDto dashboardFor(AdminUserDto admin) {
        List<UserReportSubmission> reports = reportsRepository.findAllByOrderByCreatedDateDesc();
        List<UserFeedbackSubmission> feedback = feedbackRepository.findAllByOrderByCreatedDateDesc();
        Map<String, Users> usersById = usersById(reports, feedback);
        Map<String, List<UserReportSubmission>> byTarget = new LinkedHashMap<>();
        for (UserReportSubmission report : reports) {
            String targetUserId = normalize(report.getTargetUserId());
            if (StringUtils.hasText(targetUserId)) {
                byTarget.computeIfAbsent(targetUserId, ignored -> new ArrayList<>()).add(report);
            }
        }
        List<AdminReportedUserDto> reportedUsers = byTarget.entrySet().stream()
                .map(entry -> toReportedUser(entry.getKey(), entry.getValue(), usersById, admin.id()))
                .sorted(Comparator.comparing(AdminReportedUserDto::lastReportedAtIso, Comparator.nullsLast(String::compareTo)).reversed())
                .toList();
        List<AdminReportedUserDto> blockedUsers = usersRepository.findByProfileStatus("blocked").stream()
                .map(user -> toBlockedUser(user, byTarget.getOrDefault(normalize(user.getId()), List.of()), usersById, admin.id()))
                .toList();
        return new AdminDashboardDto(
                admin,
                reportedUsers,
                blockedUsers,
                feedback.stream().map(item -> toFeedback(item, usersById)).toList());
    }

    public AdminDashboardDto warn(String userId, AdminActionRequestDto request) {
        String targetUserId = normalize(userId);
        ensureReportedUser(targetUserId);
        AdminUserDto admin = resolveAdmin(request == null ? null : request.adminUserId());
        String message = normalize(request == null ? null : request.message());
        appendSupportMessage(targetUserId, admin, StringUtils.hasText(message) ? message
                : "Please update the reported behavior before your account is blocked.");
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
                : "Your account has been blocked after moderation review. You can reply here to contact MyScoutee support and ask for a review.");
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
        String configured = normalize(configProperties.getAdminUser());
        if (!StringUtils.hasText(email) || !StringUtils.hasText(configured) || !configured.equalsIgnoreCase(email)) {
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

    private void appendSupportMessage(String targetUserId, AdminUserDto admin, String text) {
        Instant now = Instant.now();
        String nowIso = now.toString();
        String chatId = "c-support-admin-" + targetUserId;
        String messageId = "m-admin-" + new ObjectId().toHexString();
        Users targetUser = usersRepository.findByUserId(targetUserId).orElse(null);
        ActivityChat.ChatAvatarRecord adminAvatar = chatAvatar(admin.id(), admin.initials(), "woman");
        ActivityChat.ChatMessageRecord userMessage = supportMessage(messageId, admin.name(), adminAvatar, text, now, nowIso, false, List.of());
        ActivityChat userChat = appendSupportMessageForOwner(
                targetUserId,
                chatId,
                admin.initials(),
                "MyScoutee Support",
                List.of(targetUserId, admin.id()),
                text,
                admin.id(),
                nowIso,
                userMessage,
                true);
        ActivityChat.ChatMessageRecord adminMessage = supportMessage(messageId, admin.name(), adminAvatar, text, now, nowIso, true,
                List.of());
        ActivityChat adminChat = appendSupportMessageForOwner(
                admin.id(),
                chatId,
                text(targetUser == null ? null : targetUser.getInitials(), "U"),
                "MyScoutee Support · " + text(targetUser == null ? null : targetUser.getName(), "Reported user"),
                List.of(targetUserId, admin.id()),
                text,
                admin.id(),
                nowIso,
                adminMessage,
                false);
        chatsRepository.save(userChat);
        chatsRepository.save(adminChat);
    }

    private ActivityChat appendSupportMessageForOwner(
            String ownerUserId,
            String chatId,
            String avatar,
            String title,
            List<String> memberIds,
            String lastMessage,
            String lastSenderId,
            String dateIso,
            ActivityChat.ChatMessageRecord message,
            boolean unreadForOwner) {
        ActivityChat chat = chatsRepository.findByOwnerUserIdAndChatId(ownerUserId, chatId).orElseGet(() -> {
            ActivityChat next = new ActivityChat();
            next.setMongoId(new ObjectId().toHexString());
            next.setChatId(chatId);
            next.setOwnerUserId(ownerUserId);
            next.setUnread(0);
            next.setChannelType("serviceEvent");
            return next;
        });
        chat.setAvatar(avatar);
        chat.setTitle(title);
        chat.setMemberIds(memberIds);
        chat.setChannelType("serviceEvent");
        chat.setLastMessage(lastMessage);
        chat.setLastSenderId(lastSenderId);
        chat.setDateIso(dateIso);
        chat.setUnread(unreadForOwner ? Math.max(1, chat.getUnread() == null ? 1 : chat.getUnread() + 1) : 0);
        List<ActivityChat.ChatMessageRecord> messages = new ArrayList<>(chat.getMessages());
        messages.add(message);
        chat.setMessages(messages);
        return chat;
    }

    private ActivityChat.ChatMessageRecord supportMessage(
            String messageId,
            String sender,
            ActivityChat.ChatAvatarRecord avatar,
            String text,
            Instant now,
            String nowIso,
            boolean mine,
            List<ActivityChat.ChatReadAvatarRecord> readBy) {
        ActivityChat.ChatMessageRecord message = new ActivityChat.ChatMessageRecord();
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

    private ActivityChat.ChatAvatarRecord chatAvatar(String id, String initials, String gender) {
        ActivityChat.ChatAvatarRecord avatar = new ActivityChat.ChatAvatarRecord();
        avatar.setId(id);
        avatar.setInitials(initials);
        avatar.setGender(gender);
        return avatar;
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

    private ActivityChat supportChat(String adminUserId, String targetUserId) {
        String adminId = normalize(adminUserId);
        String userId = normalize(targetUserId);
        if (!StringUtils.hasText(adminId) || !StringUtils.hasText(userId)) {
            return null;
        }
        return chatsRepository.findByOwnerUserIdAndChatId(adminId, "c-support-admin-" + userId).orElse(null);
    }

    private int supportChatUnread(String adminUserId, String targetUserId) {
        ActivityChat chat = supportChat(adminUserId, targetUserId);
        return chat == null ? 0 : Math.max(0, chat.getUnread() == null ? 0 : chat.getUnread());
    }

    private AdminReportDto toReport(UserReportSubmission report, Map<String, Users> usersById) {
        Users reporter = usersById.get(normalize(report.getUserId()));
        ActivityChat chat = resolveReportedChat(report);
        return new AdminReportDto(report.getId(), report.getUserId(), text(reporter == null ? null : reporter.getName(), "Reporter"),
                firstImage(reporter), report.getTargetUserId(), report.getHandle(), report.getReason(), report.getDetails(), report.getEventId(), report.getEventTitle(),
                report.getEventStartAtIso(), report.getMemberEntryId(), report.getSourceType(), report.getSourceId(), report.getSourceText(),
                report.getChatId(), report.getMessageId(), report.getAssetId(), report.getAssetType(),
                chat == null ? null : chat.getTitle(),
                chat == null ? List.of() : chat.getMessages().stream().map(this::toChatMessage).toList(),
                report.getCreatedDate());
    }

    private ActivityChat resolveReportedChat(UserReportSubmission report) {
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

    private boolean chatIncludesMember(ActivityChat chat, String userId) {
        String normalizedUserId = normalize(userId);
        if (chat == null || !StringUtils.hasText(normalizedUserId)) {
            return false;
        }
        return chat.getMemberIds().stream()
                .map(this::normalize)
                .anyMatch(normalizedUserId::equals);
    }

    private boolean chatContainsReportedMessage(ActivityChat chat, String messageId, String targetUserId) {
        String normalizedMessageId = normalize(messageId);
        String normalizedTargetUserId = normalize(targetUserId);
        if (chat == null || !StringUtils.hasText(normalizedMessageId) || !StringUtils.hasText(normalizedTargetUserId)) {
            return false;
        }
        return chat.getMessages().stream()
                .filter(message -> message != null)
                .anyMatch(message -> normalizedMessageId.equals(normalize(message.getId()))
                        && message.getSenderAvatar() != null
                        && normalizedTargetUserId.equals(normalize(message.getSenderAvatar().getId())));
    }

    private AdminChatMessageDto toChatMessage(ActivityChat.ChatMessageRecord message) {
        ActivityChat.ChatAvatarRecord avatar = message.getSenderAvatar();
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
                firstImage(user), item.getCategory(), item.getSubject(), item.getDetails(), item.getCreatedDate());
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
