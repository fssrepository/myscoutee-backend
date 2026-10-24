package com.raxim.myscoutee.domain.community.service;

import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement.*;
import com.raxim.myscoutee.domain.community.repository.CommunityAnnouncementsRepository;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;

/** Announcement versions retain unfinished projection work; account receipts make delivery retryable. */
@Service
public class CommunityVoteCounterWork {
    private final MongoTemplate mongo;
    private final MenuCounterUpdates counters;
    private final ProfileSummaries profiles;
    private final CommunityMemberships memberships;
    private final GroupDirectory groups;
    private final CommunityAnnouncementsRepository announcements;
    public CommunityVoteCounterWork(MongoTemplate mongo, MenuCounterUpdates counters, ProfileSummaries profiles,
            CommunityMemberships memberships, GroupDirectory groups, CommunityAnnouncementsRepository announcements) {
        this.mongo = mongo; this.counters = counters; this.profiles = profiles;
        this.memberships = memberships; this.groups = groups; this.announcements = announcements;
    }
    public void sync(CommunityAnnouncement initial) {
        var row = initial;
        for (int attempt = 0; attempt < 8 && row != null; attempt++) {
            finish(row);
            var previous = row.voteCounters();
            var before = previous == null ? Map.<String, VoteContribution>of() : previous.recipients();
            var eligible = new LinkedHashSet<String>();
            var visible = new LinkedHashSet<String>();
            var group = groups.findById(row.communityId()).orElse(null);
            boolean active = group != null && "community".equals(group.effectiveType()) && !group.deleted() && !group.awaitingOwner();
            boolean open = active && row.voting() && "published".equals(row.status()) && row.closedAtIso() == null
                    && row.deadlineIso() != null && Instant.parse(row.deadlineIso()).isAfter(Instant.now());
            if (active) {
                var voted = new HashSet<String>(); row.ballots().forEach(b -> voted.add(b.voterAccountId()));
                var accounts = new LinkedHashSet<String>();
                var voters = new HashSet<String>();
                for (var member : memberships.forGroup(row.communityId())) {
                    if (!"accepted".equals(member.getStatus())) continue;
                    if ("published".equals(row.status()) || "Admin".equals(member.getRole())) accounts.add(member.getUserId());
                    if (open && Boolean.TRUE.equals(member.getVotingEligible()) && !voted.contains(member.getUserId())) voters.add(member.getUserId());
                }
                profiles.findByWorkspaceGroupIdAndAccountUserIdIn(row.communityId(), accounts).forEach(p -> {
                    visible.add(p.getUserId());
                    if (voters.contains(p.getAccountUserId())) eligible.add(p.getUserId());
                });
            }
            String bucket = "announcement_" + row.status() + (row.voting() ? "_votes" : "_notices");
            var recipients = new LinkedHashMap<>(before);
            var affected = new LinkedHashSet<>(before.keySet()); affected.addAll(visible);
            var pending = new ArrayList<MenuCounterUpdates.Change>();
            // Stable persisted receipt/counter identity; never a password, signature or integrity proof.
            @SuppressWarnings("java:S4790")
            String source = "vote-" + org.springframework.util.DigestUtils.md5DigestAsHex(row.id().getBytes(java.nio.charset.StandardCharsets.UTF_8));
            for (var id : affected) {
                var old = before.get(id); boolean next = eligible.contains(id);
                String oldBucket = old == null ? null : old.bucket(), nextBucket = visible.contains(id) ? bucket : null;
                var delta = new LinkedHashMap<String, Integer>();
                if ((old != null && old.eligible()) != next) delta.put("votes", next ? 1 : -1);
                if (!Objects.equals(oldBucket, nextBucket)) {
                    if (oldBucket != null) delta.put(oldBucket, -1);
                    if (nextBucket != null) delta.put(nextBucket, 1);
                }
                if (delta.isEmpty()) continue;
                long revision = old == null ? 1 : old.revision() + 1;
                pending.add(new MenuCounterUpdates.Change(id, row.communityId(), source, revision, Map.copyOf(delta)));
                recipients.put(id, new VoteContribution(revision, next, nextBucket));
            }
            String expires = eligible.isEmpty() ? null : row.deadlineIso();
            if (pending.isEmpty() && previous != null && Objects.equals(previous.sourceVersion(), row.version())
                    && Objects.equals(previous.expiresAtIso(), expires)) return;
            var state = new VoteCounters(row.version(), Map.copyOf(recipients), expires, List.copyOf(pending));
            // Counter acknowledgments do not invalidate an open business editor.
            var saved = mongo.findAndModify(Query.query(Criteria.where("_id").is(row.id()).and("version").is(row.version())
                            .and("voteCounters.recipients").is(previous == null ? null : previous.recipients())),
                    new Update().set("voteCounters", state).inc("version", 0L), FindAndModifyOptions.options().returnNew(true), CommunityAnnouncement.class);
            if (saved != null) { finish(saved); return; }
            row = announcements.findById(row.id()).orElse(null);
        }
        if (row != null) throw new IllegalStateException("Vote counter projection changed concurrently");
    }
    private void finish(CommunityAnnouncement row) {
        if (row.voteCounters() == null || row.voteCounters().pending().isEmpty()) return;
        var pending = row.voteCounters().pending();
        for (int start = 0; start < pending.size(); start += 100)
            counters.applyAll(pending.subList(start, Math.min(start + 100, pending.size())));
        mongo.updateFirst(Query.query(Criteria.where("_id").is(row.id()).and("voteCounters.pending").is(pending)),
                new Update().set("voteCounters.pending", List.of()).inc("version", 0L), CommunityAnnouncement.class);
    }
    public void membersChanged(String groupId) {
        for (int page = 0; ; page++) {
            var rows = announcements.findByCommunityId(groupId, PageRequest.of(page, 50, Sort.by("id")));
            rows.forEach(this::sync);
            if (rows.size() < 50) return;
        }
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watch(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("CommunityVoteCounters", Set.of("communityAnnouncements"),
                Set.of("status", "voting", "deadlineIso", "closedAtIso", "ballots", "voteCounters"), () -> {
            var query = Query.query(new Criteria().orOperator(Criteria.where("voteCounters").is(null),
                    Criteria.where("voteCounters.pending.0").exists(true),
                    Criteria.where("voteCounters.expiresAtIso").ne(null).lte(Instant.now().toString()),
                    Criteria.where("$expr").is(new org.bson.Document("$ne", List.of("$voteCounters.sourceVersion", "$version")))));
            for (var row : mongo.find(query.limit(20), CommunityAnnouncement.class)) sync(row);
            if (mongo.exists(query, CommunityAnnouncement.class)) return Instant.now().plusSeconds(10);
            var next = mongo.findOne(Query.query(Criteria.where("voteCounters.expiresAtIso").ne(null))
                    .with(Sort.by("voteCounters.expiresAtIso")), CommunityAnnouncement.class);
            return next == null ? null : Instant.parse(next.voteCounters().expiresAtIso());
        });
    }
}
