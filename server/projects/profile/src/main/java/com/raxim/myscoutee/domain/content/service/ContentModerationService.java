package com.raxim.myscoutee.domain.content.service;

import com.raxim.myscoutee.domain.groups.api.GroupDirectory;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.chat.api.SupportMessages;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.*;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.domain.content.repository.ContentModerationRepository;
import static com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.*;

/** Scope-owned write-side counters and durable mutation intents. Reads never rebuild counts from rows. */
@Service
public class ContentModerationService implements com.raxim.myscoutee.domain.content.api.ContentRegistration {
    @org.springframework.beans.factory.annotation.Autowired
    private GroupDirectory groupDirectory;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.groups.api.GroupModerationProjection groupModeration;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.events.api.EventModeration eventModeration;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.assets.api.AssetModerationProjection assetModeration;
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.accounts.api.ProfileDirectory profiles;
    private final ContentModerationRepository repository;
    private final MongoTemplate mongo;
    private final SupportMessages chats;
    private final ActivityCounters counters;
    public ContentModerationService(ContentModerationRepository repository, MongoTemplate mongo, SupportMessages chats, ActivityCounters counters) {
        this.repository = repository; this.mongo = mongo; this.chats = chats; this.counters = counters;
    }
    private State state(String groupId) { return groupId == null ? repository.state() : repository.state(groupId); }
    public Snapshot snapshot() { return snapshot(repository.state()); }
    public Snapshot snapshot(String groupId) { return snapshot(state(groupId)); }
    public Item scopedItem(String id, String groupId) {
        Item item = repository.item(id);
        if (item == null || item.deleted() || !Objects.equals(groupId, item.workspaceGroupId()))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return item;
    }
    static Snapshot snapshot(State state) {
        long pending = state.counts().values().stream().mapToLong(c -> c.getOrDefault("under-review", 0L)).sum();
        return new Snapshot(state.revision(), state.settings(), state.counts(), pending);
    }
    public Page page(String category, String status, String cursor, int pageSize) {
        return page(category, status, cursor, pageSize, null);
    }
    public Page page(String category, String status, String cursor, int pageSize, String groupId) {
        if (groupId != null && !com.raxim.myscoutee.domain.groups.api.BaseGroups.isBaseId(groupId) && !"all".equals(category) && !GROUP_CATEGORIES.contains(category)) throw invalid();
        if (!"all".equals(category)) validate(category, status);
        else if (!STATUSES.contains(status)) throw invalid();
        int limit = Math.max(1, Math.min(50, pageSize));
        var rows = groupId == null ? repository.page(category, status, cursor, limit + 1) : repository.page(category, status, cursor, limit + 1, groupId);
        var items = rows.stream().limit(limit).toList();
        var state = snapshot(groupId);
        long total = ("all".equals(category) ? CATEGORIES : List.of(category)).stream()
                .mapToLong(key -> state.counts().getOrDefault(key, Map.of()).getOrDefault(status, 0L)).sum();
        return new Page(items, total,
                rows.size() > limit ? items.getLast().id() : null, state);
    }
    public Snapshot settings(SaveSettings request) { return settings(request, null); }
    public Snapshot settings(SaveSettings request, String groupId) {
        Settings next = request.settings();
        if (next == null || next.delayMinutes() < 0 || next.delayMinutes() > 43200 || next.categories() == null
                || !(groupId == null || com.raxim.myscoutee.domain.groups.api.BaseGroups.isBaseId(groupId) ? CATEGORIES : GROUP_CATEGORIES).containsAll(next.categories())) throw invalid();
        next = new Settings(next.enabled(), next.autoApprove(), next.delayMinutes(), next.categories().stream().distinct().toList());
        State current = state(groupId);
        if (current.revision() != request.expectedRevision() || !repository.compareAndSet(current, next, current.counts(), current.pending())) throw conflict();
        return snapshot(groupId);
    }
    public Item register(String category, String sourceId, String ownerId, String title, String imageUrl) {
        validate(category, "under-review");
        String id = category + ":" + sourceId;
        Item existing = repository.item(id);
        if (existing != null) {
            if (existing.deleted()) throw new ResponseStatusException(HttpStatus.GONE);
            applyResource(existing); return existing;
        }
        var owner = "group".equals(category) ? null : profiles.findByUserId(ownerId).orElse(null);
        String groupId = owner == null ? null : owner.getWorkspaceGroupId();
        if ("group".equals(category)) {
            var group = groupDirectory.findById(sourceId).orElse(null);
            if (group != null) groupId = group.baseId();
        }
        Settings settings = state(groupId).settings();
        String status = !Boolean.TRUE.equals(settings.enabled()) || (settings.autoApprove() && settings.delayMinutes() == 0 && settings.categories().contains(category))
                ? "accepted" : "under-review";
        Item proposed = new Item(id, category, sourceId, ownerId, title, imageUrl, Instant.now().toString(), status, 1,
                "submit:" + id, "", "", "accepted".equals(status), false, groupId);
        return enlist(null, proposed, "", "", "");
    }
    public Item decide(String id, Decision request, AdminUserDto actor) {
        Item before = repository.item(id);
        if (before == null || before.deleted()) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        validate(before.category(), request.status());
        if (request.commandId() == null || request.commandId().isBlank() || request.commandId().length() > 100) throw invalid();
        String message = request.message() == null ? "" : request.message().trim();
        if (message.length() > 1000) throw invalid();
        if (request.commandId().equals(before.commandId())) { drainPending(before.workspaceGroupId()); return repository.item(id); }
        if (request.expectedVersion() != before.version()) throw conflict();
        if (("rejected".equals(request.status()) && before.hasBeenPublic())
                || ("blocked".equals(request.status()) && !before.hasBeenPublic())) throw invalid();
        Item next = new Item(before.id(), before.category(), before.sourceId(), before.ownerUserId(), before.title(), before.imageUrl(),
                before.submittedAtIso(), request.status(), before.version() + 1, request.commandId(), actor.id(), Instant.now().toString(),
                before.hasBeenPublic() || "accepted".equals(request.status()), false, before.workspaceGroupId());
        return enlist(before, next, actor.name(), actor.initials(), message);
    }
    public void removeFeed(String sourceId, String ownerId) {
        Item before = repository.item("feed:" + sourceId);
        if (before == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        if (!ownerId.equals(before.ownerUserId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if (before.deleted()) { drainPending(before.workspaceGroupId()); return; }
        Item next = new Item(before.id(), before.category(), before.sourceId(), before.ownerUserId(), before.title(), before.imageUrl(),
                before.submittedAtIso(), before.status(), before.version() + 1, "remove:" + before.id(), ownerId,
                Instant.now().toString(), before.publiclyVisibleOnce(), true, before.workspaceGroupId());
        enlist(before, next, "", "", "");
    }
    private Item enlist(Item previous, Item next, String adminName, String adminInitials, String message) {
        for (int attempt = 0; attempt < 10; attempt++) {
            var current = state(next.workspaceGroupId());
            if (!next.deleted() && !Boolean.TRUE.equals(current.settings().enabled()) && !"accepted".equals(next.status())) {
                // A publication racing with disable must not reintroduce a moderation hold.
                if (previous != null) throw conflict();
                next = new Item(next.id(), next.category(), next.sourceId(), next.ownerUserId(), next.title(), next.imageUrl(),
                        next.submittedAtIso(), "accepted", next.version(), next.commandId(), next.reviewedBy(), next.reviewedAtIso(), true, false, next.workspaceGroupId());
            }
            String itemId = next.id();
            var pending = current.pending().stream().filter(m -> m.item().id().equals(itemId)).findFirst().orElse(null);
            if (pending != null) {
                if (!pending.commandId().equals(next.commandId())) throw conflict();
                apply(pending); acknowledge(pending.commandId(), next.workspaceGroupId()); return repository.item(next.id());
            }
            var actual = repository.item(next.id());
            if (actual != null && next.commandId().equals(actual.commandId())) return actual;
            if (previous == null ? actual != null : actual == null || actual.version() != previous.version()) throw conflict();
            if (current.pending().size() >= 100) throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE);
            Map<String, Map<String, Long>> counts = new LinkedHashMap<>(current.counts());
            Map<String, Long> category = new LinkedHashMap<>(counts.getOrDefault(next.category(), Map.of()));
            if (previous != null) category.merge(previous.status(), -1L, Long::sum);
            if (!next.deleted()) category.merge(next.status(), 1L, Long::sum);
            counts.put(next.category(), category);
            var mutation = new Mutation(next.commandId(), next, adminName, adminInitials,
                    List.of("rejected", "blocked").contains(next.status()) ? message : "");
            var queue = new ArrayList<>(current.pending()); queue.add(mutation);
            // Intent and counter delta commit in one Mongo document. Retrying delivery cannot count twice.
            if (!repository.compareAndSet(current, current.settings(), counts, queue)) continue;
            apply(mutation); acknowledge(mutation.commandId(), next.workspaceGroupId()); return next;
        }
        throw conflict();
    }
    public void drainPending() {
        drainPending(JobGroupContext.groupId());
    }
    private void drainPending(String groupId) {
        for (Mutation mutation : state(groupId).pending()) { apply(mutation); acknowledge(mutation.commandId(), groupId); }
    }
    private int releaseWithheld(String groupId) {
        int changed = 0;
        // Use the same bounded Job batch as delayed approval; the next run continues the release.
        for (Item item : groupId == null ? repository.withheld(100) : repository.withheld(100, groupId)) {
            if (Boolean.TRUE.equals(state(groupId).settings().enabled())) break;
            try {
                decide(item.id(), new Decision("", "disable:" + item.id() + ":" + item.version(), item.version(), "accepted", ""),
                        new AdminUserDto("content-moderation-disabled", "", "", "", "", "", List.of()));
                changed++;
            } catch (ResponseStatusException ex) { if (ex.getStatusCode() != HttpStatus.CONFLICT) throw ex; }
        }
        return changed;
    }
    private void acknowledge(String commandId, String groupId) {
        for (int attempt = 0; attempt < 10; attempt++) {
            var state = state(groupId);
            var remaining = state.pending().stream().filter(p -> !p.commandId().equals(commandId)).toList();
            if (remaining.size() == state.pending().size() || repository.compareAndSet(state, state.settings(), state.counts(), remaining)) return;
        }
        throw conflict();
    }
    private void apply(Mutation mutation) {
        var item = mutation.item();
        repository.saveItem(item);
        applyResource(item);
        if (item.workspaceGroupId() != null) {
            var state = state(item.workspaceGroupId());
            // Part of the durable write intent: menus read this stored count; they never count content rows.
            groupModeration.queue(item.workspaceGroupId(), state.revision(), snapshot(state).pendingCount());
        }
        if (!mutation.message().isBlank()) chats.sendAdminSupportMessage(item.ownerUserId(), item.reviewedBy(),
                mutation.adminName(), mutation.adminInitials(), mutation.message(), "warned", "content-moderation:" + mutation.commandId());
    }
    private void applyResource(Item item) {
        if (item.category().equals("group")) {
            groupModeration.resource(item.sourceId(), item.version(), item.status());
            return;
        }
        if (item.category().equals("event")) {
            eventModeration.apply(item.sourceId(), item.version(), item.status());
            counters.refreshEventCountersForSourceIds(List.of(item.sourceId()));
        } else if (item.category().equals("asset")) {
            assetModeration.apply(item.sourceId(), item.version(), item.status());
            counters.refreshAssetCountersForUser(item.ownerUserId());
        } else {
            var query = Query.query(Criteria.where("_id").is(item.sourceId()).andOperator(new Criteria().orOperator(
                Criteria.where("moderationVersion").lte(item.version()), Criteria.where("moderationVersion").exists(false))));
            mongo.updateMulti(query, new Update().set("moderationStatus", item.status()).set("moderationVersion", item.version())
                .set("deleted", item.deleted()), "photoFeedPosts");
            counters.refreshFeedCountersForUser(item.ownerUserId());
        }
    }
    public int approveDue() {
        drainPending();
        return approveDue(JobGroupContext.groupId());
    }
    private int approveDue(String groupId) {
        Settings settings = state(groupId).settings();
        if (!Boolean.TRUE.equals(settings.enabled())) return releaseWithheld(groupId);
        if (!settings.autoApprove() || settings.categories().isEmpty()) return 0;
        String before = Instant.now().minus(settings.delayMinutes(), ChronoUnit.MINUTES).toString();
        var due = groupId == null ? repository.due(settings, before, 100) : repository.due(settings, before, 100, groupId);
        int changed = 0;
        for (Item item : due) {
            try {
                decide(item.id(), new Decision("", "auto:" + item.id() + ":" + item.version(), item.version(), "accepted", ""),
                        new AdminUserDto("content-auto-approve", "", "", "", "", "", List.of()));
                changed++;
            } catch (ResponseStatusException ex) { if (ex.getStatusCode() != HttpStatus.CONFLICT) throw ex; }
        }
        return changed;
    }
    private static void validate(String category, String status) { if (!CATEGORIES.contains(category) || !STATUSES.contains(status)) throw invalid(); }
    private static ResponseStatusException invalid() { return new ResponseStatusException(HttpStatus.BAD_REQUEST); }
    private static ResponseStatusException conflict() { return new ResponseStatusException(HttpStatus.CONFLICT, "Content moderation changed. Reload and retry."); }
}
