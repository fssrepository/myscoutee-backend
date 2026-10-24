package com.raxim.myscoutee.domain.events.service;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
@Service
public class CommunityMembershipService implements CommunityMemberships {
    private final com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates counters;
    private final org.springframework.data.mongodb.core.MongoTemplate mongo;
    @Override public java.util.Set<String> acceptedAccounts(String groupId, java.util.Collection<String> accounts, int limit) {
        return members.findByOwnerTypeAndOwnerIdAndStatusAndUserIdIn("community", groupId, "accepted", accounts,
                org.springframework.data.domain.PageRequest.of(0, limit)).getContent().stream()
                .map(ActivityMember::getUserId).collect(java.util.stream.Collectors.toSet());
    }
    private final ActivityMembersRepository members;
    public CommunityMembershipService(ActivityMembersRepository members,
            com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates counters,
            org.springframework.data.mongodb.core.MongoTemplate mongo) {
        this.counters = counters;
        this.mongo = mongo;
 this.members = members; }
    @Override public List<CommunityMember> forAccount(String id) { return members.findByOwnerTypeAndUserId("community", id).stream().map(this::view).toList(); }
    @Override public List<CommunityMember> forGroup(String id) { return members.findByOwnerTypeAndOwnerId("community", id).stream().map(this::view).toList(); }
    @Override public List<CommunityMember> forGroups(Collection<String> ids) { return members.findByOwnerTypeAndOwnerIdIn("community", ids).stream().map(this::view).toList(); }
    @Override public List<CommunityMember> accepted(String id) { return members.findByOwnerTypeAndOwnerIdAndStatus("community", id, "accepted").stream().map(this::view).toList(); }
    @Override public Optional<CommunityMember> member(String group, String account) { return members.findByOwnerTypeAndOwnerIdAndUserId("community", group, account).map(this::view); }
    @Override public CommunityMember register(CommunityMember member) {
        return registerAll(List.of(member)).getFirst();
    }
    @Override public List<CommunityMember> registerAll(List<CommunityMember> values) {
        var previous = new HashMap<String, ActivityMember>();
        members.findAllById(values.stream().map(CommunityMember::getId).toList()).forEach(m -> previous.put(m.getId(), m));
        finishCounters(new ArrayList<>(previous.values()));
        var next = values.stream().map(value -> {
            var record = registration(value);
            record.setGroupCounterState(counterState(record, previous.get(record.getId())));
            return record;
        }).toList();
        var saved = members.saveAll(next);
        finishCounters(saved);
        return saved.stream().map(this::view).toList();
    }
    @Override public long transition(String id, String expectedStatus, String expectedRole, String expectedActionAtIso,
            String status, String role, String requestKind, String pendingSource, boolean organizerOnly,
            String actionAtIso, String action, String actor, String managerGrantedByUserId, boolean votingEligible) {
        var previous = members.findById(id).orElse(null);
        if (previous == null || !Objects.equals(previous.getStatus(), expectedStatus)
                || !Objects.equals(previous.getRole(), expectedRole) || !Objects.equals(previous.getActionAtIso(), expectedActionAtIso)) return 0;
        finishCounters(List.of(previous));
        var next = registration(view(previous));
        next.setStatus(status); next.setRole(role); next.setRequestKind(requestKind);
        next.setCommunityAction(action); next.setCommunityActor(actor);
        var state = counterState(next, previous);
        long changed = members.updateCommunityState(id, expectedStatus, expectedRole, expectedActionAtIso, status, role, requestKind,
                pendingSource, organizerOnly, actionAtIso, action, actor, managerGrantedByUserId, votingEligible, state,
                previous.getGroupCounterState() == null ? null : previous.getGroupCounterState().revision());
        if (changed > 0) { next.setGroupCounterState(state); finishCounters(List.of(next)); }
        return changed;
    }

    static String counterBucket(ActivityMember member) {
        String status = member.getStatus();
        if ("blocked".equals(status) || "deleted".equals(status) && member.getRequestKind() == null
                && "remove".equals(member.getCommunityAction()) && Objects.equals(member.getUserId(), member.getCommunityActor())) return "trash";
        if ("accepted".equals(status)) return "Admin".equals(member.getRole()) ? "hosting" : "participation";
        if ("pending".equals(status)) return "invite".equals(member.getRequestKind()) ? "invitations" : "pending";
        return null;
    }
    static ActivityMember.GroupCounterState counterState(ActivityMember next, ActivityMember previous) {
        var old = previous == null ? null : previous.getGroupCounterState();
        String bucket = counterBucket(next), before = old == null ? null : old.bucket();
        if (old != null && Objects.equals(before, bucket)) return new ActivityMember.GroupCounterState(old.revision(), bucket, null);
        long revision = old == null ? 1 : old.revision() + 1;
        var deltas = new LinkedHashMap<String, Integer>();
        if (before != null) deltas.put("groups_" + before, -1);
        if (bucket != null) deltas.merge("groups_" + bucket, 1, Integer::sum);
        // Every response/poll can carry explicit zeroes for all five buckets.
        for (String key : List.of("hosting", "participation", "pending", "invitations", "trash")) deltas.putIfAbsent("groups_" + key, 0);
        // Stable persisted receipt/counter identity; never a password, signature or integrity proof.
        @SuppressWarnings("java:S4790")
        String source = "group-member-" + org.springframework.util.DigestUtils.md5DigestAsHex(next.getId().getBytes(java.nio.charset.StandardCharsets.UTF_8));
        var change = new com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.Change(next.getUserId(), null, source, revision, Map.copyOf(deltas));
        return new ActivityMember.GroupCounterState(revision, bucket, change);
    }
    private void finishCounters(List<ActivityMember> records) {
        var pending = records.stream().filter(m -> m.getGroupCounterState() != null && m.getGroupCounterState().pending() != null).toList();
        if (pending.isEmpty()) return;
        for (int start = 0; start < pending.size(); start += 100)
            counters.applyAll(pending.subList(start, Math.min(start + 100, pending.size())).stream().map(m -> m.getGroupCounterState().pending()).toList());
        var bulk = mongo.bulkOps(org.springframework.data.mongodb.core.BulkOperations.BulkMode.UNORDERED, ActivityMember.class);
        for (var record : pending) bulk.updateOne(org.springframework.data.mongodb.core.query.Query.query(
                org.springframework.data.mongodb.core.query.Criteria.where("_id").is(record.getId()).and("groupCounterState").is(record.getGroupCounterState())),
                new org.springframework.data.mongodb.core.query.Update().set("groupCounterState.pending", null));
        bulk.execute();
        pending.forEach(record -> { var state = record.getGroupCounterState();
            record.setGroupCounterState(new ActivityMember.GroupCounterState(state.revision(), state.bucket(), null)); });
    }
    @org.springframework.beans.factory.annotation.Autowired
    void recoverCounters(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("CommunityMembershipCounters", Set.of("activityMembers"), Set.of("groupCounterState"), () -> {
            var query = org.springframework.data.mongodb.core.query.Query.query(
                    org.springframework.data.mongodb.core.query.Criteria.where("ownerType").is("community").orOperator(
                        org.springframework.data.mongodb.core.query.Criteria.where("groupCounterState").is(null),
                        org.springframework.data.mongodb.core.query.Criteria.where("groupCounterState.pending").ne(null)));
            var records = mongo.find(query.limit(50), ActivityMember.class);
            for (var record : records) if (record.getGroupCounterState() == null) {
                var state = counterState(record, null);
                if (mongo.updateFirst(org.springframework.data.mongodb.core.query.Query.query(
                        org.springframework.data.mongodb.core.query.Criteria.where("_id").is(record.getId()).and("groupCounterState").is(null)
                            .and("status").is(record.getStatus()).and("role").is(record.getRole()).and("actionAtIso").is(record.getActionAtIso())),
                        new org.springframework.data.mongodb.core.query.Update().set("groupCounterState", state), ActivityMember.class).getModifiedCount() > 0)
                    record.setGroupCounterState(state);
            }
            finishCounters(records);
            return mongo.exists(query, ActivityMember.class) ? java.time.Instant.now().plusSeconds(10) : null;
        });
    }
    private CommunityMember view(ActivityMember source) {
        if (source == null) return null;
        var result = new CommunityMember();
        com.raxim.myscoutee.domain.events.api.CommunityMemberState.copy(source, result);
        return result;
    }
    private ActivityMember registration(CommunityMember source) {
        var result = new ActivityMember();
        com.raxim.myscoutee.domain.events.api.CommunityMemberState.copy(source, result);
        if (!"community".equals(result.getOwnerType())) throw new IllegalArgumentException("Community membership requires community ownership.");
        return result;
    }
}
