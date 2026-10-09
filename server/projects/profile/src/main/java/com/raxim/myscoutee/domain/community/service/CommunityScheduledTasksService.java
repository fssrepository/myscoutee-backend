package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.community.document.CommunityScheduledTask;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.repository.CommunityScheduledTasksRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.CommunityAuthority;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.*;

import com.raxim.myscoutee.domain.community.mapper.CommunityCaseMapper;
import static com.raxim.myscoutee.domain.groups.api.CommunityAuthority.error;

@Service
public class CommunityScheduledTasksService implements com.raxim.myscoutee.domain.community.api.ScheduledCases {
    public static final String RULE = "community-scheduled-cases";
    public static final int LEAD_DAYS = 45;
    private final CommunityScheduledTasksRepository tasks;
    private final ServiceCasesRepository cases;
    private final CommunityAuthority access;
    private final GroupDirectory groups;
    private final CommunityMemberships members;
    private final CommunityCasesService caseService;
    public CommunityScheduledTasksService(CommunityScheduledTasksRepository tasks, ServiceCasesRepository cases,
            CommunityAuthority access, GroupDirectory groups, CommunityMemberships members, CommunityCasesService caseService) {
        this.tasks = tasks; this.cases = cases; this.access = access; this.groups = groups; this.members = members; this.caseService = caseService;
    }
    public String actor(String id) { return access.actor(id); }
    public Page<TaskItem> page(String actor, int size, String cursor, String status) {
        if (!Set.of("active", "paused", "trash").contains(status)) throw error(HttpStatus.BAD_REQUEST);
        var managed = access.managedGroups(actor);
        var memberIds = members.forAccount(actor).stream().filter(m -> "accepted".equals(m.getStatus())).map(CommunityMember::getOwnerId).toList();
        var joined = memberIds.isEmpty() ? List.<String>of() : groups.findByIdIn(memberIds).stream()
                .filter(g -> "community".equals(g.effectiveType()) && !BaseGroups.isBaseId(g.id()) && !g.deleted() && !g.awaitingOwner()).map(GroupView::id).toList();
        int page = CommunityCasesService.page(cursor), limit = Math.max(1, Math.min(50, size));
        var filter = "trash".equals(status) ? new org.bson.Document("deleted", true)
                : new org.bson.Document("deleted", new org.bson.Document("$ne", true)).append("enabled", "active".equals(status));
        var records = tasks.visible(BaseGroups.COMMUNITY_BASE_ID, actor, managed, joined, filter, PageRequest.of(page, limit, Sort.by("nextDueAtIso", "id")));
        var ids = records.stream().map(CommunityScheduledTask::communityId).filter(Objects::nonNull).distinct().toList();
        var groupById = ids.isEmpty() ? Map.<String, GroupView>of() : groups.findByIdIn(ids).stream().collect(Collectors.toMap(GroupView::id, g -> g));
        var roster = ids.isEmpty() ? Map.<String, Set<String>>of() : members.forGroups(ids).stream().filter(m -> "accepted".equals(m.getStatus()))
                .collect(Collectors.groupingBy(CommunityMember::getOwnerId, Collectors.mapping(CommunityMember::getUserId, Collectors.toSet())));
        var context = new HashMap<String, Long>(); for (var key : List.of("active", "paused", "trash")) context.put(key, 0L);
        tasks.counters(BaseGroups.COMMUNITY_BASE_ID, actor, managed, joined).forEach(row -> context.put(row.status(), row.count()));
        context.put("total", context.get("active") + context.get("paused"));
        long total = context.get(status);
        return new Page<>(records.stream().map(t -> {
            var accepted = t.communityId() == null ? Set.of(t.ownerAccountId()) : roster.getOrDefault(t.communityId(), Set.of());
            int count = t.audienceAll() ? accepted.size() : (int) t.audienceAccountIds().stream().distinct().filter(accepted::contains).count();
            return CommunityCaseMapper.toDto(t, t.communityId() == null ? null : groupById.get(t.communityId()), count, t.communityId() == null ? actor.equals(t.ownerAccountId()) : managed.contains(t.communityId()));
        }).toList(), total, (long) (page + 1) * limit < total ? Integer.toString(page + 1) : null, context);
    }
    private void requireManage(CommunityScheduledTask task, String actor) {
        if (!BaseGroups.COMMUNITY_BASE_ID.equals(task.baseGroupId())) throw error(HttpStatus.NOT_FOUND);
        if (task.communityId() != null) access.requireAdmin(task.communityId(), actor);
        else if (!actor.equals(task.ownerAccountId())) throw error(HttpStatus.FORBIDDEN);
    }
    private TaskItem dto(CommunityScheduledTask task, String actor) {
        var group = task.communityId() == null ? null : access.group(task.communityId());
        var accepted = group == null ? Set.of(task.ownerAccountId()) : access.roster(group.id()).stream().map(m -> m.getUserId()).collect(Collectors.toSet());
        int count = task.audienceAll() ? accepted.size() : (int) task.audienceAccountIds().stream().distinct().filter(accepted::contains).count();
        return CommunityCaseMapper.toDto(task, group, count, group == null ? actor.equals(task.ownerAccountId()) : access.admin(group.id(), actor));
    }
    public TaskItem save(String actor, SaveTask r) {
        CommunityCasesService.validateFields(r.title(), r.description(), r.caseType());
        if (r.frequency() == null || !Set.of("once", "monthly", "quarterly", "yearly").contains(r.frequency())) throw error(HttpStatus.BAD_REQUEST);
        String start; try { start = iso(Instant.parse(r.startAtIso())); } catch (RuntimeException failure) { throw error(HttpStatus.BAD_REQUEST); }
        CommunityScheduledTask old = r.id() == null ? null : tasks.findById(r.id()).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (old != null) { requireManage(old, actor); if (old.deleted()) throw error(HttpStatus.CONFLICT); }
        String groupId = old == null ? (r.communityId() == null || r.communityId().isBlank() ? null : r.communityId()) : old.communityId();
        if (groupId != null) access.requireAdmin(groupId, actor);
        if (old != null && !Objects.equals(old.version(), r.version())) throw error(HttpStatus.CONFLICT);
        var audience = groupId == null ? List.of(actor) : access.audience(access.roster(groupId), r.audienceAll(), r.audienceAccountIds());
        if (audience.isEmpty()) throw error(HttpStatus.BAD_REQUEST);
        String now = Instant.now().toString();
        String next = old != null && start.equals(old.startAtIso()) && r.frequency().equals(old.frequency()) ? old.nextDueAtIso() : start;
        var task = new CommunityScheduledTask(old == null ? UUID.randomUUID().toString() : old.id(), BaseGroups.COMMUNITY_BASE_ID,
                groupId, old == null ? actor : old.ownerAccountId(), r.title().trim(), r.description().trim(), r.caseType(), groupId != null && r.audienceAll(),
                groupId != null && r.audienceAll() ? List.of() : audience, start, next, r.frequency(), old == null || old.enabled(), false, old == null ? now : old.createdAtIso(), now, old == null ? null : old.version());
        try { return dto(tasks.save(task), actor); }
        catch (org.springframework.dao.OptimisticLockingFailureException failure) { throw error(HttpStatus.CONFLICT); }
    }
    public TaskItem action(String actor, String id, TaskCommand command) {
        var old = tasks.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND)); requireManage(old, actor);
        if (!Objects.equals(old.version(), command.version())) throw error(HttpStatus.CONFLICT);
        String action = command.action();
        if (!(old.deleted() ? "restore".equals(action) : "trash".equals(action) || (old.enabled() ? "pause" : "resume").equals(action))) throw error(HttpStatus.CONFLICT);
        var updated = new CommunityScheduledTask(old.id(), old.baseGroupId(), old.communityId(), old.ownerAccountId(), old.title(), old.description(), old.caseType(), old.audienceAll(), old.audienceAccountIds(),
                old.startAtIso(), old.nextDueAtIso(), old.frequency(), "resume".equals(action) || "restore".equals(action), "trash".equals(action), old.createdAtIso(), Instant.now().toString(), old.version());
        try { return dto(tasks.save(updated), actor); }
        catch (org.springframework.dao.OptimisticLockingFailureException failure) { throw error(HttpStatus.CONFLICT); }
    }
    public Instant nextScheduledWakeup() {
        var next = tasks.nextScheduled(BaseGroups.COMMUNITY_BASE_ID, PageRequest.of(0, 1, Sort.by("nextDueAtIso", "id")));
        if (next.isEmpty()) return null;
        Instant due = Instant.parse(next.getFirst().nextDueAtIso()).minus(LEAD_DAYS, ChronoUnit.DAYS);
        Instant retry = Instant.now().plusSeconds(60);
        return due.isAfter(retry) ? due : retry;
    }

    /** Insert-first identity and advance-after-notification make a interrupted occurrence retryable. */
    public int createDue(Instant now) {
        if (!BaseGroups.COMMUNITY_BASE_ID.equals(JobGroupContext.groupId())) return 0;
        var due = tasks.due(BaseGroups.COMMUNITY_BASE_ID, iso(now.plus(LEAD_DAYS, ChronoUnit.DAYS)),
                PageRequest.of(0, 100, Sort.by("nextDueAtIso", "id")));
        var ids = due.stream().map(CommunityScheduledTask::communityId).filter(Objects::nonNull).distinct().toList();
        var groupById = groups.findByIdIn(ids).stream().collect(Collectors.toMap(GroupView::id, g -> g));
        var rosters = members.forGroups(ids).stream().filter(m -> "accepted".equals(m.getStatus()))
                .collect(Collectors.groupingBy(CommunityMember::getOwnerId));
        int created = 0;
        for (var task : due) {
            var group = task.communityId() == null ? null : groupById.get(task.communityId());
            if (task.communityId() != null && (group == null || group.deleted() || group.awaitingOwner() || !"community".equals(group.effectiveType()))) continue;
            var roster = task.communityId() == null ? List.<CommunityMember>of() : rosters.getOrDefault(task.communityId(), List.of());
            var accepted = task.communityId() == null ? Set.of(task.ownerAccountId()) : roster.stream().map(CommunityMember::getUserId).collect(Collectors.toSet());
            var audience = task.audienceAll() ? List.copyOf(accepted) : task.audienceAccountIds().stream().filter(accepted::contains).toList();
            if (audience.isEmpty()) continue;
            var participants = new LinkedHashSet<>(audience);
            roster.stream().filter(m -> "Admin".equals(m.getRole())).map(CommunityMember::getUserId).forEach(participants::add);
            String caseId = occurrenceId(task.id(), task.nextDueAtIso());
            ServiceCase c = cases.findById(caseId).orElse(null);
            if (c == null) {
                var candidate = new ServiceCase(caseId, BaseGroups.COMMUNITY_BASE_ID, task.communityId(), task.communityId() == null ? task.ownerAccountId() : null,
                        task.title(), task.description(), task.caseType(), "open", task.audienceAll(), audience, List.copyOf(participants),
                        List.copyOf(participants), List.of(), List.of(), List.of(), task.id(), task.nextDueAtIso(), now.toString(), now.toString(), null, participants.stream().collect(Collectors.toMap(id -> id, id -> task.communityId() == null ? "accepted" : "invited")), List.of(), List.of());
                try { c = cases.insert(candidate); created++; }
                catch (org.springframework.dao.DuplicateKeyException duplicate) { c = cases.findById(caseId).orElseThrow(() -> duplicate); }
            }
            caseService.notifyChange(c, RULE, "reminder", caseId);
            String next = nextDue(task.nextDueAtIso(), task.frequency());
            try {
                tasks.save(new CommunityScheduledTask(task.id(), task.baseGroupId(), task.communityId(), task.ownerAccountId(), task.title(),
                        task.description(), task.caseType(), task.audienceAll(), task.audienceAccountIds(), task.startAtIso(), next == null ? task.nextDueAtIso() : next,
                        task.frequency(), next != null, false, task.createdAtIso(), now.toString(), task.version()));
            } catch (org.springframework.dao.OptimisticLockingFailureException changed) {
                // A concurrent edit wins; the committed occurrence and reminder remain idempotent.
            }
        }
        return created;
    }
    public static String occurrenceId(String taskId, String due) {
        return "scheduled-case:" + taskId + ":" + due;
    }
    private static String iso(Instant instant) { return new java.time.format.DateTimeFormatterBuilder().appendInstant(3).toFormatter().format(instant); }
    public static String nextDue(String due, String frequency) {
        var date = Instant.parse(due).atZone(ZoneOffset.UTC);
        return switch (frequency) { case "monthly" -> iso(date.plusMonths(1).toInstant());
            case "quarterly" -> iso(date.plusMonths(3).toInstant()); case "yearly" -> iso(date.plusYears(1).toInstant()); default -> null; };
    }
}
