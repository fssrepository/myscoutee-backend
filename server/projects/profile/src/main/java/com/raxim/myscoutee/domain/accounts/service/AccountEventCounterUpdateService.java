package com.raxim.myscoutee.domain.accounts.service;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.accounts.api.EventCounterUpdates;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
@Service
public class AccountEventCounterUpdateService implements EventCounterUpdates {
    private final UsersRepository users;
    public AccountEventCounterUpdateService(UsersRepository users) { this.users = users; }
    private record EventCounterState(int invitations, int events, int hosting) {}
    public int replaceExpired(Collection<Change> changes) {
        List<Users> changed = new ArrayList<>();
        var byUserId = new LinkedHashMap<String, Change>();
        for (var change : changes) byUserId.put(change.userId(), change);
        if (byUserId.isEmpty()) return 0;
        for (var user : users.findByUserIdIn(byUserId.keySet())) {
            if (user == null) continue;
            var change = byUserId.get(user.getUserId());
            if (change == null) continue;
            var next = withEventCounters(user.getActivities(), new EventCounterState(change.invitations(), change.events(), change.hosting()));
            if (!activitiesEqual(user.getActivities(), next)) { user.setActivities(next); changed.add(user); }
        }
        if (!changed.isEmpty()) users.saveAll(changed);
        return changed.size();
    }
    private Users.UserActivitiesRecord withEventCounters(
            Users.UserActivitiesRecord existing,
            EventCounterState counters) {
        EventCounterState safeCounters = counters == null ? new EventCounterState(0, 0, 0) : counters;
        return new Users.UserActivitiesRecord(
                count(existing == null ? null : existing.game()),
                count(existing == null ? null : existing.chats()),
                safeCounters.invitations(),
                safeCounters.events(),
                safeCounters.hosting(),
                count(existing == null ? null : existing.cars()),
                count(existing == null ? null : existing.accommodation()),
                count(existing == null ? null : existing.supplies()),
                count(existing == null ? null : existing.tickets()),
                count(existing == null ? null : existing.contacts()),
                count(existing == null ? null : existing.feedback()),
                existing == null ? null : existing.chat(),
                new Users.UserEventCountersRecord(
                        safeCounters.events()
                                + safeCounters.invitations()
                                + safeCounters.hosting()
                                + count(existing == null || existing.event() == null ? null : existing.event().pending())
                                + count(existing == null || existing.event() == null ? null : existing.event().drafts()),
                        safeCounters.events(),
                        count(existing == null || existing.event() == null ? null : existing.event().pending()),
                        safeCounters.invitations(),
                        safeCounters.hosting(),
                        count(existing == null || existing.event() == null ? null : existing.event().drafts()),
                        count(existing == null || existing.event() == null ? null : existing.event().trash()),
                        count(existing == null || existing.event() == null ? null : existing.event().watchlist())),
                existing == null ? null : existing.asset(),
                existing == null ? null : existing.eventFeedback(),
                count(existing == null ? null : existing.adminJobs()),
                count(existing == null ? null : existing.adminMetrics()),
                count(existing == null ? null : existing.notifications()));
    }

    public boolean activitiesEqual(Users.UserActivitiesRecord first, Users.UserActivitiesRecord second) {
        if (first == second) {
            return true;
        }
        if (first == null || second == null) {
            return false;
        }
        return Objects.equals(count(first.game()), count(second.game()))
                && Objects.equals(count(first.chats()), count(second.chats()))
                && Objects.equals(first.chat(), second.chat())
                && Objects.equals(first.event(), second.event())
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


    private Integer count(Integer value) { return Math.max(0, value == null ? 0 : value); }
}
