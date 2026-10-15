package com.raxim.myscoutee.domain.accounts.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.AdminCounterRefresh;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.administration.api.AdministrativeQueues;
import com.raxim.myscoutee.domain.administration.api.AdministratorClassification;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
@Service
public class AdminProfileCounterService implements AdminCounterRefresh {
    private static final List<String> DEMO_ADMIN_IDS = List.of("admin-demo-ava", "admin-demo-noel");
    private final UsersRepository usersRepository;
    private final AdministrativeQueues queues;
    private final AdministratorClassification administrators;
    public AdminProfileCounterService(UsersRepository usersRepository, AdministrativeQueues queues, AdministratorClassification administrators) {
        this.usersRepository = usersRepository;
        this.queues = queues;
        this.administrators = administrators;
    }
    public void refreshAdminMenuCounters() {
        Map<String, AdministrativeQueues.Counts> scoped = new LinkedHashMap<>();
        for (Users admin : adminUsers()) {
            if (JobGroupContext.isActive() && !java.util.Objects.equals(JobGroupContext.groupId(), admin.getWorkspaceGroupId())) continue;
            Users.UserActivitiesRecord before = admin.getActivities();
            String groupId = admin.getWorkspaceGroupId();
            String key = groupId == null ? "global" : groupId;
            Users updated = applyCounters(admin, scoped.computeIfAbsent(key, ignored -> JobGroupContext.call(groupId, () -> {
                return queues.counters(true);
            })));
            if (!activitiesEqual(before, updated.getActivities())) {
                usersRepository.save(updated);
            }
        }
    }

    public Users syncAdminUserCounters(Users user) {
        if (!administrators.isAdminUser(user)) {
            return user;
        }
        Users.UserActivitiesRecord before = user.getActivities();
        Users updated = applyCounters(user, JobGroupContext.call(user.getWorkspaceGroupId(), () -> queues.counters(false)));
        if (activitiesEqual(before, updated.getActivities())) {
            return user;
        }
        return usersRepository.save(updated);
    }

    private List<Users> adminUsers() {
        Map<String, Users> byId = new LinkedHashMap<>();
        for (Users user : usersRepository.findByHostTier("Admin")) {
            if (user != null && StringUtils.hasText(safeText(user.getUserId()))) {
                byId.put(safeText(user.getUserId()), user);
            }
        }
        for (Users user : usersRepository.findByUserIdIn(DEMO_ADMIN_IDS)) {
            if (user != null && StringUtils.hasText(safeText(user.getUserId()))) {
                byId.put(safeText(user.getUserId()), user);
            }
        }
        return new ArrayList<>(byId.values());
    }

    private Users applyCounters(Users user, AdministrativeQueues.Counts counters) {
        if (user == null) {
            return user;
        }
        Users.UserActivitiesRecord existing = user.getActivities();
        Users.UserActivitiesRecord next = new Users.UserActivitiesRecord(
                count(existing == null ? null : existing.game()),
                count(existing == null ? null : existing.chats()),
                count(existing == null ? null : existing.invitations()),
                count(existing == null ? null : existing.events()),
                count(existing == null ? null : existing.hosting()),
                count(existing == null ? null : existing.cars()),
                count(existing == null ? null : existing.accommodation()),
                count(existing == null ? null : existing.supplies()),
                count(existing == null ? null : existing.tickets()),
                count(existing == null ? null : existing.contacts()),
                count(existing == null ? null : existing.feedback()),
                existing == null ? null : existing.chat(),
                existing == null ? null : existing.event(),
                existing == null ? null : existing.asset(),
                existing == null ? null : existing.feedbackCounts(),
                counters.jobs(),
                counters.metrics(),
                count(existing == null ? null : existing.notifications()));
        if (activitiesEqual(existing, next)) {
            return user;
        }
        user.setActivities(next);
        return user;
    }

    private boolean activitiesEqual(Users.UserActivitiesRecord first, Users.UserActivitiesRecord second) {
        if (first == second) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }
        return Objects.equals(count(first.game()), count(second.game()))
                && Objects.equals(count(first.chats()), count(second.chats()))
                && Objects.equals(first.chat(), second.chat())
                && Objects.equals(count(first.invitations()), count(second.invitations()))
                && Objects.equals(count(first.events()), count(second.events()))
                && Objects.equals(count(first.hosting()), count(second.hosting()))
                && Objects.equals(count(first.cars()), count(second.cars()))
                && Objects.equals(count(first.accommodation()), count(second.accommodation()))
                && Objects.equals(count(first.supplies()), count(second.supplies()))
                && Objects.equals(count(first.tickets()), count(second.tickets()))
                && Objects.equals(count(first.contacts()), count(second.contacts()))
                && Objects.equals(count(first.feedback()), count(second.feedback()))
                && Objects.equals(count(first.adminJobs()), count(second.adminJobs()))
                && Objects.equals(count(first.adminMetrics()), count(second.adminMetrics()))
                && Objects.equals(count(first.notifications()), count(second.notifications()));
    }

    private int count(Number value) {
        if (value == null) {
            return 0;
        }
        return Math.max(0, value.intValue());
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}
