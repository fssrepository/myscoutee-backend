package com.raxim.myscoutee.domain.accounts.service;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import com.raxim.myscoutee.domain.accounts.api.SupportCaseCounters;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.chat.api.ChatDirectory;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.ChatCounters;
import com.raxim.myscoutee.domain.accounts.document.Users;
@Service
public class AccountChatCounterService implements ChatCounters, SupportCaseCounters {
    @org.springframework.beans.factory.annotation.Autowired private UsersRepository usersRepository;
    @org.springframework.beans.factory.annotation.Autowired private ChatDirectory chatDirectory;
    private static final List<String> DEMO_ADMIN_IDS = List.of("admin-demo-ava", "admin-demo-noel");
    private final MongoTemplate mongo;
    public AccountChatCounterService(MongoTemplate mongo) { this.mongo = mongo; }
    public void increment(Change change) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(change.ownerUserId())), update(change), Users.class);
    }
    public void increment(Collection<Change> changes) {
        if (changes.isEmpty()) return;
        var bulk = mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class);
        for (var change : changes) bulk.updateOne(Query.query(Criteria.where("userId").is(change.ownerUserId())), update(change));
        bulk.execute();
    }
    private Update update(Change change) {
        var update = new Update().inc("activities.chats", change.delta()).inc("activities.chat.all", change.delta());
        if (StringUtils.hasText(change.context())) update.inc("activities.chat." + change.context(), change.delta());
        return update;
    }

    public void refreshSupportCaseCountersForAdmins() {
        Map<String, Users> adminsById = new LinkedHashMap<>();
        for (Users admin : usersRepository.findByHostTier("Admin")) {
            String userId = normalizeId(admin == null ? null : admin.getUserId());
            if (StringUtils.hasText(userId)) {
                adminsById.put(userId, admin);
            }
        }
        for (Users admin : usersRepository.findByUserIdIn(DEMO_ADMIN_IDS)) {
            String userId = normalizeId(admin == null ? null : admin.getUserId());
            if (StringUtils.hasText(userId)) {
                adminsById.put(userId, admin);
            }
        }
        Map<String, SupportCaseCounts> byBase = new LinkedHashMap<>();
        for (Users admin : adminsById.values()) {
            String base = admin.getWorkspaceGroupId();
            SupportCaseCounts counters = byBase.computeIfAbsent(base, this::resolveSupportCaseCounters);
            updateSupportCaseCounters(admin.getUserId(), counters);
        }
    }

    private SupportCaseCounts resolveSupportCaseCounters(String baseGroupId) {
        var counts = chatDirectory.supportCaseCounts(baseGroupId);
        int pending = counts.getOrDefault("pending", 0), warned = counts.getOrDefault("warned", 0), picked = counts.getOrDefault("picked", 0), solved = counts.getOrDefault("solved", 0), blocked = counts.getOrDefault("blocked", 0);
        return new SupportCaseCounts(pending, warned, picked, solved, blocked, pending + warned + picked + solved + blocked);
    }

    private void updateSupportCaseCounters(String userId, SupportCaseCounts counters) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId) || counters == null) {
            return;
        }
        Update update = new Update()
                .set("activities.chat.supportCases.pending", count(counters.pending()))
                .set("activities.chat.supportCases.warned", count(counters.warned()))
                .set("activities.chat.supportCases.picked", count(counters.picked()))
                .set("activities.chat.supportCases.solved", count(counters.solved()))
                .set("activities.chat.supportCases.blocked", count(counters.blocked()))
                .set("activities.chat.supportCases.all", count(counters.all()));
        updateUserActivityFields(normalizedUserId, update);
    }

    @Override public boolean hasSupportCaseCounters(String userId) {
        Users user = userId == null ? null : usersRepository.findByUserId(userId).orElse(null);
        var activities = user == null ? null : user.getActivities();
        var chat = activities == null ? null : activities.chat();
        return chat != null && chat.supportCases() != null;
    }

    private record SupportCaseCounts(
            int pending,
            int warned,
            int picked,
            int solved,
            int blocked,
            int all) {
    }

    private void updateUserActivityFields(String userId, Update update) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(userId)), update, Users.class);
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private int count(Integer value) {
        return value == null ? 0 : Math.max(0, value.intValue());
    }
}
