package com.raxim.myscoutee.domain.community.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.document.CommunityScheduledTask;
import com.raxim.myscoutee.domain.community.document.ServiceCase.CounterContribution;
import com.raxim.myscoutee.domain.community.document.ServiceCase.CounterState;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.BaseGroups;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/** Case writes retain their counter intent, using the Campaign/Feedback durable-work pattern. */
@Service
public class CommunityCaseCounterWork {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.community.repository.CommunityScheduledTasksRepository tasks;

    public CommunityScheduledTask saveTask(CommunityScheduledTask next, CommunityScheduledTask previous) {
        finishTask(previous);
        var before = previous == null || previous.counterState() == null ? Map.<String, CounterContribution>of() : previous.counterState().recipients();
        var visible = new LinkedHashSet<String>();
        if (next.communityId() == null) visible.add(next.ownerAccountId());
        else {
            var group = groups.findById(next.communityId()).orElse(null);
            if (group != null && "community".equals(group.effectiveType()) && !BaseGroups.isBaseId(group.id()) && !group.deleted() && !group.awaitingOwner())
                memberships.forGroup(group.id()).stream().filter(m -> "accepted".equals(m.getStatus())
                        && ("Admin".equals(m.getRole()) || next.audienceAll() || next.audienceAccountIds().contains(m.getUserId())))
                        .map(m -> m.getUserId()).forEach(visible::add);
        }
        String bucket = "communityTask_" + (next.deleted() ? "trash" : next.enabled() ? "active" : "paused");
        var recipients = new LinkedHashMap<>(before);
        var affected = new LinkedHashSet<>(before.keySet()); affected.addAll(visible);
        var pending = new ArrayList<MenuCounterUpdates.Change>();
        String source = "scheduled-" + org.springframework.util.DigestUtils.md5DigestAsHex(next.id().getBytes(java.nio.charset.StandardCharsets.UTF_8));
        for (var account : affected) {
            var old = before.get(account);
            String oldBucket = old == null ? null : old.bucket(), nextBucket = visible.contains(account) ? bucket : null;
            if (Objects.equals(oldBucket, nextBucket)) continue;
            var delta = new LinkedHashMap<String, Integer>();
            if (oldBucket != null) delta.put(oldBucket, -1);
            if (nextBucket != null) delta.merge(nextBucket, 1, Integer::sum);
            long revision = old == null ? 1 : old.revision() + 1;
            pending.add(new MenuCounterUpdates.Change(account, null, source, revision, Map.copyOf(delta)));
            recipients.put(account, new CounterContribution(revision, nextBucket));
        }
        var state = new CounterState(Map.copyOf(recipients), List.of(), List.copyOf(pending));
        if (next == previous && previous.counterState() != null && pending.isEmpty()) return previous;
        var saved = tasks.save(next.withCounterState(state));
        finishTask(saved);
        return saved.withCounterState(new CounterState(state.recipients(), List.of(), List.of()));
    }
    private void finishTask(CommunityScheduledTask task) {
        if (task == null || task.counterState() == null || task.counterState().pending().isEmpty()) return;
        var pending = task.counterState().pending();
        for (int start = 0; start < pending.size(); start += 100)
            counters.applyAll(pending.subList(start, Math.min(start + 100, pending.size())));
        mongo.updateFirst(Query.query(Criteria.where("_id").is(task.id()).and("counterState.pending").is(pending)),
                new Update().set("counterState.pending", List.of()).inc("version", 0L), CommunityScheduledTask.class);
    }
    private void taskMembersChanged(String groupId) {
        for (int page = 0; ; page++) {
            var rows = tasks.findByCommunityId(groupId, PageRequest.of(page, 50, Sort.by("id")));
            for (var task : rows) saveTask(task, task);
            if (rows.size() < 50) return;
        }
    }
    public record Saved(ServiceCase record, List<MenuCounterUpdates.Snapshot> accounts) {}
    private final ServiceCasesRepository cases;
    private final MenuCounterUpdates counters;
    private final CommunityMemberships memberships;
    private final MongoTemplate mongo;
    private final GroupDirectory groups;
    public CommunityCaseCounterWork(ServiceCasesRepository cases, MenuCounterUpdates counters,
            CommunityMemberships memberships, MongoTemplate mongo, GroupDirectory groups) {
        this.cases = cases; this.counters = counters; this.memberships = memberships; this.mongo = mongo; this.groups = groups;
    }
    public Saved save(ServiceCase next, ServiceCase previous) {
        var admins = previous != null && previous.counterState() != null ? previous.counterState().admins() : administrators(next);
        return save(next, previous, admins);
    }
    private List<String> administrators(ServiceCase next) {
        if (next.communityId() == null || BaseGroups.isBaseId(next.communityId())) return List.of();
        var group = groups.findById(next.communityId()).orElse(null);
        if (group == null || !"community".equals(group.effectiveType()) || group.deleted() || group.awaitingOwner()) return List.of();
        return memberships.forGroup(next.communityId()).stream()
                .filter(m -> "accepted".equals(m.getStatus()) && "Admin".equals(m.getRole()))
                .map(m -> m.getUserId()).distinct().toList();
    }
    public Saved save(ServiceCase next, ServiceCase previous, List<String> admins) {
        finish(previous);
        var state = prepare(next, previous, admins);
        var saved = cases.save(next.withCounterState(state));
        var accounts = finishAll(List.of(saved));
        return new Saved(saved.withCounterState(new CounterState(state.recipients(), state.admins(), List.of())), accounts);
    }
    public ServiceCase insert(ServiceCase next, List<String> admins) {
        var state = prepare(next, null, admins);
        var saved = cases.insert(next.withCounterState(state));
        finish(saved);
        return saved.withCounterState(new CounterState(state.recipients(), state.admins(), List.of()));
    }
    private CounterState prepare(ServiceCase next, ServiceCase previous, List<String> admins) {
        Map<String, CounterContribution> before = previous == null || previous.counterState() == null
                ? Map.of() : previous.counterState().recipients();
        var visible = new LinkedHashSet<>(next.participantAccountIds()); visible.addAll(admins);
        var recipients = new LinkedHashMap<>(before);
        var affected = new LinkedHashSet<>(before.keySet()); affected.addAll(visible);
        var pending = new ArrayList<MenuCounterUpdates.Change>();
        String source = "case-" + org.springframework.util.DigestUtils.md5DigestAsHex(
                next.id().getBytes(java.nio.charset.StandardCharsets.UTF_8));
        for (var account : affected) {
            var old = before.get(account);
            String oldBucket = old == null ? null : old.bucket();
            String nextBucket = visible.contains(account) ? bucket(next.status(), next.caseType()) : null;
            if (Objects.equals(oldBucket, nextBucket)) continue;
            Map<String, Integer> delta = new LinkedHashMap<>();
            if (oldBucket != null) delta.put(oldBucket, -1);
            if (nextBucket != null) delta.merge(nextBucket, 1, Integer::sum);
            delta.put("communityCases", active(nextBucket) - active(oldBucket));
            long revision = old == null ? 1 : old.revision() + 1;
            pending.add(new MenuCounterUpdates.Change(account, null, source, revision, Map.copyOf(delta)));
            recipients.put(account, new CounterContribution(revision, nextBucket));
        }
        return new CounterState(Map.copyOf(recipients), List.copyOf(admins), List.copyOf(pending));
    }
    public void finish(ServiceCase saved) {
        if (saved != null) finishAll(List.of(saved));
    }
    private List<MenuCounterUpdates.Snapshot> finishAll(List<ServiceCase> saved) {
        var accounts = new ArrayList<MenuCounterUpdates.Snapshot>();
        var pending = saved.stream().filter(c -> c.counterState() != null)
                .flatMap(c -> c.counterState().pending().stream()).toList();
        for (int start = 0; start < pending.size(); start += 100)
            accounts.addAll(counters.applyAll(pending.subList(start, Math.min(start + 100, pending.size()))));
        for (var c : saved) if (c.counterState() != null && !c.counterState().pending().isEmpty())
            mongo.updateFirst(Query.query(Criteria.where("_id").is(c.id())
                            .and("counterState.pending").is(c.counterState().pending())),
                    new Update().set("counterState.pending", List.of()).inc("version", 0L), ServiceCase.class);
        return List.copyOf(accounts);
    }
    public void groupAdminsChanged(String groupId, List<String> admins) {
        taskMembersChanged(groupId);
        for (int page = 0; ; page++) {
            var rows = cases.findByCommunityId(groupId, PageRequest.of(page, 50, Sort.by("id")));
            finishAll(rows);
            var changed = new ArrayList<ServiceCase>();
            for (var c : rows) {
                if (!BaseGroups.COMMUNITY_BASE_ID.equals(c.baseGroupId())) continue;
                if (c.counterState() != null && new HashSet<>(c.counterState().admins()).equals(new HashSet<>(admins))) continue;
                changed.add(cases.save(c.withCounterState(prepare(c, c, admins))));
            }
            finishAll(changed);
            if (rows.size() < 50) return;
        }
    }
    static String bucket(String status, String type) { return "communityCase_" + status.replace('-', '_') + "__" + type.replace('-', '_'); }
    private static int active(String bucket) { return bucket == null || bucket.startsWith("communityCase_trash__") ? 0 : 1; }
    static Map<String, Long> context(Map<String, Integer> values) {
        var result = new LinkedHashMap<String, Long>();
        result.put("total", (long) values.getOrDefault("communityCases", 0));
        values.forEach((key, value) -> {
            if (key.startsWith("communityCase_")) {
                var parts = key.substring("communityCase_".length()).split("__", 2);
                if (parts.length == 2) result.put(parts[0].replace('_', '-') + ":" + parts[1].replace('_', '-'), value.longValue());
            }
        });
        return result;
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watchPending(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("CommunityTaskCounterWork", Set.of("communityScheduledTasks"), Set.of("counterState"), () -> {
            var pending = Query.query(Criteria.where("baseGroupId").is(BaseGroups.COMMUNITY_BASE_ID).orOperator(
                    Criteria.where("counterState").is(null), Criteria.where("counterState.pending.0").exists(true)));
            for (var task : mongo.find(pending.limit(20), CommunityScheduledTask.class)) {
                if (task.counterState() == null) saveTask(task, task); else finishTask(task);
            }
            return mongo.exists(pending, CommunityScheduledTask.class) ? java.time.Instant.now().plusSeconds(10) : null;
        });
        changes.watch("CommunityCaseCounterWork", Set.of("serviceCases"), Set.of("counterState"), () -> {
            var pending = Query.query(new Criteria().andOperator(Criteria.where("baseGroupId").is(BaseGroups.COMMUNITY_BASE_ID),
                    new Criteria().orOperator(Criteria.where("counterState").is(null), Criteria.where("counterState.pending.0").exists(true))));
            for (var c : mongo.find(pending.limit(20), ServiceCase.class)) {
                try { if (c.counterState() == null) save(c, c); else finish(c); }
                catch (RuntimeException failure) { org.slf4j.LoggerFactory.getLogger(getClass()).warn(
                        "Case counter work remains pending ({})", failure.getClass().getSimpleName()); }
            }
            return mongo.exists(pending, ServiceCase.class) ? java.time.Instant.now().plusSeconds(10) : null;
        });
    }
}
