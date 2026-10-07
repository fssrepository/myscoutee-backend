package com.raxim.myscoutee.profile.service.notifications;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AppSettingsService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

/** Role events use the same durable outbox, inbox counters and delivery preferences as member events. */
@Service
public class RoleNotificationService {
    private final UsersRepository users;
    private final ConfigProperties config;
    private final AppSettingsService settings;
    private final NotificationOutboxService outbox;

    public RoleNotificationService(UsersRepository users, ConfigProperties config,
            AppSettingsService settings, NotificationOutboxService outbox) {
        this.users = users;
        this.config = config;
        this.settings = settings;
        this.outbox = outbox;
    }

    public void releaseAvailable(String version) {
        publish("release-available", version, true, false, "New MyScoutee version",
                "MyScoutee " + version + " is available. Review it before installing.",
                Map.of("releaseVersion", version), "updates", null);
    }

    public void memberJoined(Users member) {
        if (member == null || member.isOperator() || settings.isAdminEmail(member.getEmail())
                || StringUtils.hasText(member.getWorkspaceGroupId())
                || StringUtils.hasText(member.getAccountUserId())) return;
        // A node-level alert needs neither an email/address nor the member's private profile.
        publish("node-member-joined", member.getUserId(), true, true, "New node member",
                "A new member completed registration on this node.", Map.of(), null, "stats");
    }

    public void moderationSubmitted(String kind, String submissionId) {
        boolean report = "report-submitted".equals(kind);
        if (!report && !"feedback-submitted".equals(kind)) throw new IllegalArgumentException("Unknown moderation event.");
        publish(kind, submissionId, false, true, report ? "New report" : "New feedback",
                report ? "A report is waiting for review." : "A member sent feedback.", Map.of(), null,
                report ? "reports" : "feedback");
    }

    private void publish(String kind, String eventId, boolean operators, boolean admins,
            String title, String body, Map<String, String> parameters, String operatorTarget, String adminTarget) {
        if (!StringUtils.hasText(eventId)) return;
        LinkedHashSet<String> emails = new LinkedHashSet<>();
        if (operators) {
            config.getOperatorUsers().forEach(email -> emails.add(email.trim().toLowerCase(Locale.ROOT)));
            if (StringUtils.hasText(config.getOperatorBootstrapEmail())) {
                emails.add(config.getOperatorBootstrapEmail().trim().toLowerCase(Locale.ROOT));
            }
        }
        if (admins) settings.adminEmails().stream().filter(settings::isAdminEmail).forEach(emails::add);
        if (emails.isEmpty()) return;
        // One bounded recipient lookup, not a users collection scan or a query per recipient.
        for (Users recipient : users.findByEmailIn(emails)) {
            if (StringUtils.hasText(recipient.getWorkspaceGroupId()) || "D".equals(recipient.getStatus())) continue;
            boolean operator = operators && recipient.isOperator();
            if (!operator && (!admins || !settings.isAdminEmail(recipient.getEmail()))) continue;
            String target = operator ? operatorTarget : adminTarget;
            String path = operator ? "/operator" : "/admin";
            var payload = new java.util.LinkedHashMap<>(parameters);
            payload.put("notification_title_key", "notification.kind." + kind + ".title");
            payload.put("notification_message_key", "notification.kind." + kind + ".message");
            payload.put("notification_tone", "info");
            if (target != null) payload.put("roleTarget", target);
            if (target != null) path += "?notificationTarget=" + target;
            outbox.enqueueOnce("role:" + kind + ":" + eventId + ":" + recipient.getUserId(), new NotificationIntent(
                    kind, operator ? "operator" : "app-admin", eventId,
                    operator ? "app-admin:operator" : "app-admin", List.of(recipient.getUserId()),
                    title, body, path, null, null, kind + "-" + eventId, payload, null));
        }
    }
}
