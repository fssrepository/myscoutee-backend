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
            new AdminUserDto("admin-demo-ava", "Ava Moderation", "AM", "ava.admin@myscoutee.local"),
            new AdminUserDto("admin-demo-noel", "Noel Safety", "NS", "noel.admin@myscoutee.local"));

    private final ConfigProperties configProperties;
    private final UserReportSubmissionsRepository reportsRepository;
    private final UserFeedbackSubmissionsRepository feedbackRepository;
    private final UsersRepository usersRepository;
    private final ActivityChatsRepository chatsRepository;

    public AdminModerationService(
            ConfigProperties configProperties,
            UserReportSubmissionsRepository reportsRepository,
            UserFeedbackSubmissionsRepository feedbackRepository,
            UsersRepository usersRepository,
            ActivityChatsRepository chatsRepository) {
        this.configProperties = configProperties;
        this.reportsRepository = reportsRepository;
        this.feedbackRepository = feedbackRepository;
        this.usersRepository = usersRepository;
        this.chatsRepository = chatsRepository;
    }

    public AdminDashboardDto dashboard(String adminUserId) {
        return dashboardFor(resolveAdmin(adminUserId));
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
                .map(entry -> toReportedUser(entry.getKey(), entry.getValue(), usersById))
                .sorted(Comparator.comparing(AdminReportedUserDto::lastReportedAtIso, Comparator.nullsLast(String::compareTo)).reversed())
                .toList();
        return new AdminDashboardDto(
                admin,
                reportedUsers,
                feedback.stream().map(item -> toFeedback(item, usersById)).toList());
    }

    public AdminDashboardDto warn(String userId, AdminActionRequestDto request) {
        String targetUserId = normalize(userId);
        ensureReportedUser(targetUserId);
        AdminUserDto admin = resolveAdmin(request == null ? null : request.adminUserId());
        String message = normalize(request == null ? null : request.message());
        appendSupportMessage(targetUserId, admin, StringUtils.hasText(message) ? message
                : "Please update the reported behavior before your account is blocked.");
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
        }
        String message = normalize(request == null ? null : request.message());
        appendSupportMessage(targetUserId, admin, StringUtils.hasText(message) ? message
                : "Your account has been blocked after moderation review. You can reply here to contact MyScoutee support and ask for a review.");
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
        return DEMO_ADMINS.stream().filter(admin -> admin.id().equals(normalized)).findFirst().orElse(DEMO_ADMINS.get(0));
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
        return new AdminUserDto(email, email, initialsForEmail(email), email);
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
        ActivityChat chat = chatsRepository.findByOwnerUserIdAndChatId(targetUserId, chatId).orElseGet(() -> {
            ActivityChat next = new ActivityChat();
            next.setMongoId(new ObjectId().toHexString());
            next.setChatId(chatId);
            next.setOwnerUserId(targetUserId);
            next.setAvatar(admin.initials());
            next.setTitle("MyScoutee Support");
            next.setMemberIds(List.of(targetUserId, admin.id()));
            next.setUnread(1);
            next.setChannelType("serviceEvent");
            return next;
        });
        ActivityChat.ChatAvatarRecord avatar = new ActivityChat.ChatAvatarRecord();
        avatar.setId(admin.id());
        avatar.setInitials(admin.initials());
        avatar.setGender("woman");
        ActivityChat.ChatMessageRecord message = new ActivityChat.ChatMessageRecord();
        message.setId("m-admin-" + new ObjectId().toHexString());
        message.setSender(admin.name());
        message.setSenderAvatar(avatar);
        message.setText(text);
        message.setTime(CHAT_TIME_FORMAT.format(now));
        message.setSentAtIso(nowIso);
        message.setMine(false);
        message.setReadBy(List.of());
        List<ActivityChat.ChatMessageRecord> messages = new ArrayList<>(chat.getMessages());
        messages.add(message);
        chat.setMessages(messages);
        chat.setLastMessage(text);
        chat.setLastSenderId(admin.id());
        chat.setDateIso(nowIso);
        chat.setUnread(Math.max(1, chat.getUnread() == null ? 1 : chat.getUnread() + 1));
        chatsRepository.save(chat);
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

    private AdminReportedUserDto toReportedUser(String userId, List<UserReportSubmission> reports, Map<String, Users> usersById) {
        Users user = usersById.get(userId);
        return new AdminReportedUserDto(
                userId,
                text(user == null ? null : user.getName(), "Reported user"),
                text(user == null ? null : user.getInitials(), "??"),
                text(user == null ? null : user.getGender(), "woman"),
                text(user == null ? null : user.getCity(), ""),
                text(user == null ? null : user.getProfileStatus(), "public"),
                reports.size(),
                reports.isEmpty() ? null : reports.get(0).getCreatedDate(),
                reports.stream().map(report -> toReport(report, usersById)).toList());
    }

    private AdminReportDto toReport(UserReportSubmission report, Map<String, Users> usersById) {
        Users reporter = usersById.get(normalize(report.getUserId()));
        ActivityChat chat = resolveReportedChat(report);
        return new AdminReportDto(report.getId(), report.getUserId(), text(reporter == null ? null : reporter.getName(), "Reporter"),
                report.getTargetUserId(), report.getReason(), report.getDetails(), report.getEventId(), report.getEventTitle(),
                report.getEventStartAtIso(), report.getSourceType(), report.getSourceId(), report.getSourceText(),
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
