package com.raxim.myscoutee.domain.community.service;
import com.raxim.myscoutee.domain.community.dto.CaseDetails;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.chat.api.CaseConversations;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceOfferingsRepository;
import com.raxim.myscoutee.domain.email.api.ScheduledMessages;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.CommunityAuthority;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.*;

import com.raxim.myscoutee.domain.community.mapper.CommunityCaseMapper;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery;
import static com.raxim.myscoutee.domain.groups.api.CommunityAuthority.error;

@Service
public class CommunityCasesService implements com.raxim.myscoutee.domain.community.api.Cases {
    public static final List<String> TYPES = List.of("fault", "maintenance", "meter-replacement", "chimney-sweep", "renovation", "other");
    @org.springframework.beans.factory.annotation.Autowired
    private ScheduledMessages scheduledMessages;
    private final ServiceCasesRepository cases;
    private final CommunityAuthority access;
    private final GroupDirectory groups;
    private final ProfileSummaries users;
    private final NotificationDelivery notifications;
    private final CaseConversations chats;
    private final ServiceOfferingsRepository offerings;
    public CommunityCasesService(ServiceCasesRepository cases, CommunityAuthority access, GroupDirectory groups,
            ProfileSummaries users, NotificationDelivery notifications, CaseConversations chats, ServiceOfferingsRepository offerings) {
        this.cases = cases; this.access = access; this.groups = groups; this.users = users; this.notifications = notifications; this.chats = chats; this.offerings = offerings;
    }
    @org.springframework.beans.factory.annotation.Autowired
    private tools.jackson.databind.ObjectMapper objectMapper;
    private void scheduleFeedback(ServiceCase closed) {
        try {
            scheduledMessages.scheduleCaseFeedback(new com.raxim.myscoutee.domain.community.api.CaseFeedbackPreparation.Request(
                    closed.id(), closed.version(), closed.baseGroupId(), objectMapper.writeValueAsString(closed)));
        } catch (tools.jackson.core.JacksonException error) { throw new IllegalStateException(error); }
    }
    public String actor(String id) { return access.actor(id); }
    public boolean canManage(ServiceCase c, String actor) {
        return actor.equals(c.ownerAccountId());
    }
    public ServiceCase visible(String actor, String id) {
        var c = cases.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (!BaseGroups.COMMUNITY_BASE_ID.equals(c.baseGroupId()) || (!c.participantAccountIds().contains(actor) || "removed".equals(c.membershipStatus(actor))) && !canManage(c, actor) && !(c.communityId() != null && access.admin(c.communityId(), actor)))
            throw error(HttpStatus.NOT_FOUND);
        return c;
    }
    public CaseItem detail(String actor, String id) { return dto(actor, visible(actor, id)); }
    public CaseItem read(String actor, String id) {
        visible(actor, id); cases.markRead(id, actor); return detail(actor, id);
    }
    public Page<CaseItem> page(String actor, String status, String type, int size, String cursor) {
        var statuses = statuses(status);
        var types = type == null || type.isBlank() ? TYPES : List.of(type);
        if (!TYPES.containsAll(types)) throw error(HttpStatus.BAD_REQUEST);
        var managed = access.managedGroups(actor);
        int page = page(cursor), limit = Math.max(1, Math.min(50, size));
        var rows = cases.visible(BaseGroups.COMMUNITY_BASE_ID, actor, managed, statuses, types,
                PageRequest.of(page, limit, Sort.by(Sort.Order.desc("updatedAtIso"), Sort.Order.asc("id"))));
        long total = cases.countVisible(BaseGroups.COMMUNITY_BASE_ID, actor, managed, statuses, types);
        var groupIds = rows.stream().map(ServiceCase::communityId).filter(Objects::nonNull).distinct().toList();
        var groupsById = groups.findByIdIn(groupIds).stream().collect(Collectors.toMap(GroupView::id, g -> g));
        var people = users.findByUserIdIn(rows.stream().flatMap(c -> displayAccounts(c).stream()).collect(Collectors.toSet()))
                .stream().collect(Collectors.toMap(ProfileSummary::getUserId, u -> u));
        Map<String, Long> context = new java.util.HashMap<>();
        context.put("total", 0L);
        for (var bucket : cases.bucketCounts(BaseGroups.COMMUNITY_BASE_ID, actor, managed)) {
            context.put(bucket.status() + ":" + bucket.caseType(), bucket.count());
            if (!"trash".equals(bucket.status())) context.merge("total", bucket.count(), Long::sum);
        }
        return new Page<>(rows.stream().map(c -> CommunityCaseMapper.toDto(c, actor,
                canManage(c, actor), groupsById.get(c.communityId()), people)).toList(),
                total, (long) (page + 1) * limit < total ? Integer.toString(page + 1) : null,
                context);
    }
    public CaseItem save(String actor, SaveCase r) {
        validateFields(r.title(), r.description(), r.caseType());
        ServiceCase old = r.id() == null ? null : visible(actor, r.id());
        if (old != null && (!canManage(old, actor) || "trash".equals(old.status()))) throw error(HttpStatus.FORBIDDEN);
        if (old != null && !Objects.equals(old.version(), r.version())) throw error(HttpStatus.CONFLICT);
        String communityId = old == null ? blank(r.communityId()) : old.communityId();
        if (communityId == null && (old == null || old.scheduledTaskId() == null)) throw error(HttpStatus.BAD_REQUEST);
        if (communityId != null) access.requireMember(communityId, actor);
        var roster = communityId == null ? List.<CommunityMember>of() : access.roster(communityId);
        boolean manager = old == null ? access.admin(communityId, actor) : canManage(old, actor);
        boolean all = r.audienceAll();
        if (!manager && (all || r.audienceAccountIds() != null && r.audienceAccountIds().stream().anyMatch(id -> !actor.equals(id)))) throw error(HttpStatus.FORBIDDEN);
        var audience = communityId == null ? List.of(actor) : access.audience(roster, all, r.audienceAccountIds());
        var admins = roster.stream().filter(m -> "Admin".equals(m.getRole())).map(CommunityMember::getUserId).toList();
        String now = Instant.now().toString();
        var participants = new LinkedHashSet<>(audience); participants.addAll(admins); participants.add(old == null ? actor : old.ownerAccountId());
        if (old != null) { participants.addAll(old.participantAccountIds()); participants.removeIf(id -> "removed".equals(old.memberStates().get(id))); }
        var memberStates = old == null ? new LinkedHashMap<String, String>() : new LinkedHashMap<>(old.memberStates());
        for (String id : participants) if (old == null || !old.participantAccountIds().contains(id)) memberStates.put(id, id.equals(actor) ? "accepted" : "invited");
        var saved = persist(new ServiceCase(old == null ? UUID.randomUUID().toString() : old.id(), BaseGroups.COMMUNITY_BASE_ID,
                communityId, old == null ? actor : old.ownerAccountId(), r.title().trim(), r.description().trim(), r.caseType(), old == null ? "open" : old.status(),
                all, audience, List.copyOf(participants), participants.stream().filter(id -> !actor.equals(id) && (old == null || old.membershipStatus(id) == null || List.of("accepted", "invited").contains(old.membershipStatus(id)))).toList(),
                old == null ? List.of() : old.support(), old == null ? List.of() : old.recommendations(), old == null ? List.of() : old.offers(),
                old == null ? null : old.scheduledTaskId(), old == null ? null : old.dueAtIso(), old == null ? now : old.createdAtIso(), now, old == null ? null : old.version(), memberStates, old == null ? List.of() : old.boardTasks(), old == null ? List.of() : old.chatAccountIds()));
        notifyChange(saved, actor, old == null ? "created" : "updated", saved.id() + ":" + saved.version());
        return dto(actor, saved);
    }
    public CaseItem action(String actor, String id, Command r) {
        var c = visible(actor, id);
        if (!Objects.equals(c.version(), r.version())) throw error(HttpStatus.CONFLICT);
        boolean manager = canManage(c, actor);
        var support = new ArrayList<>(c.support()); var recommendations = new ArrayList<>(c.recommendations()); var offers = new ArrayList<>(c.offers());
        var participants = new LinkedHashSet<>(c.participantAccountIds());
        var memberStates = new LinkedHashMap<>(c.memberStates());
        var boardTasks = new ArrayList<>(c.boardTasks());
        var chatAccounts = new LinkedHashSet<>(c.chatAccountIds());
        String owner = c.ownerAccountId();
        String status = c.status(), action = r.action() == null ? "" : r.action();
        switch (action) {
            case "take-over" -> {
                if (!c.canTakeOver(actor)) throw error(HttpStatus.FORBIDDEN);
                owner = actor; memberStates.put(actor, "accepted");
            }
            case "join", "decline", "leave" -> {
                String current = c.membershipStatus(actor);
                if ("trash".equals(status) || current == null || "removed".equals(current)) throw error(HttpStatus.FORBIDDEN);
                if ("decline".equals(action) && !"invited".equals(current) || "leave".equals(action) && !"accepted".equals(current)) throw error(HttpStatus.CONFLICT);
                String next = "join".equals(action) ? "accepted" : "decline".equals(action) ? "declined" : "left";
                if (next.equals(current)) return dto(actor, c);
                memberStates.put(actor, next);
                if ("leave".equals(action) && manager) owner = null;
                if (participants.stream().noneMatch(member -> List.of("accepted", "invited").contains(memberStates.getOrDefault(member, c.membershipStatus(member))))) status = "trash";
                for (int i = 0; i < support.size(); i++) if (support.get(i).accountId().equals(actor)) {
                    var own = support.get(i); support.set(i, new CaseDetails.Support(actor, own.serviceId(), "accepted".equals(next) ? "accepted" : "declined"));
                }
            }
            case "invite-members", "remove-member" -> {
                if (!manager || "trash".equals(status) || r.memberAccountIds() == null || r.memberAccountIds().isEmpty() || r.memberAccountIds().size() > 100) throw error(HttpStatus.FORBIDDEN);
                for (String member : new LinkedHashSet<>(r.memberAccountIds())) {
                    if ("invite-members".equals(action)) {
                        access.requireBaseMember(member);
                        if (!"accepted".equals(c.membershipStatus(member))) memberStates.put(member, "invited");
                        participants.add(member);
                    } else {
                        if (!participants.contains(member) || actor.equals(member)) throw error(HttpStatus.BAD_REQUEST);
                        memberStates.put(member, "removed"); participants.remove(member);
                    }
                }
            }
            case "invite-chat" -> {
                if (!manager || "trash".equals(status) || r.memberAccountIds() == null || r.memberAccountIds().isEmpty()
                        || r.memberAccountIds().size() > 100 || !participants.containsAll(r.memberAccountIds())) throw error(HttpStatus.FORBIDDEN);
                chatAccounts.addAll(r.memberAccountIds());
            }
            case "save-board-task", "delete-board-task" -> {
                if (!manager) throw error(HttpStatus.FORBIDDEN);
                if ("delete-board-task".equals(action)) {
                    if (boardTasks.stream().noneMatch(t -> t.id().equals(r.taskId()))) throw error(HttpStatus.NOT_FOUND);
                    boardTasks.replaceAll(t -> t.id().equals(r.taskId()) ? new CaseDetails.BoardTask(t.id(), t.title(), t.description(), "deleted",
                            t.assigneeAccountIds(), t.dependsOnIds(), t.startAtIso(), t.endAtIso(), t.offerIds()) : t);
                } else {
                    if (!List.of("open", "in-progress").contains(status)) throw error(HttpStatus.CONFLICT);
                    var task = r.task();
                    validateBoardTask(task, c);
                    boardTasks.removeIf(t -> t.id().equals(task.id())); boardTasks.add(task);
                    validateTaskGraph(boardTasks);
                }
            }

            case "start", "complete", "cancel", "trash", "reopen" -> {
                if (!manager) throw error(HttpStatus.FORBIDDEN);
                status = switch (action) { case "start" -> "in-progress"; case "complete" -> "completed"; case "cancel" -> "cancelled"; case "trash" -> "trash"; default -> "open"; };
            }
            case "recommend", "invite-provider" -> {
                if (r.providerAccountId() == null || "trash".equals(status)) throw error(HttpStatus.BAD_REQUEST);
                access.requireBaseMember(r.providerAccountId());
                if (r.serviceId() != null) {
                    var offering = offerings.findById(r.serviceId()).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
                    if (!BaseGroups.COMMUNITY_BASE_ID.equals(offering.baseGroupId()) || !"published".equals(offering.status())
                            || !offering.ownerAccountId().equals(r.providerAccountId()) && !offering.staffAccountIds().contains(r.providerAccountId())) throw error(HttpStatus.BAD_REQUEST);
                }
                if ("recommend".equals(action)) {
                    if (!c.activeParticipantAccountIds().contains(actor) && !manager) throw error(HttpStatus.FORBIDDEN);
                    recommendations.removeIf(v -> v.accountId().equals(actor) && v.providerAccountId().equals(r.providerAccountId()));
                    recommendations.add(new CaseDetails.Recommendation(actor, r.providerAccountId(), r.serviceId()));
                } else {
                    if (!manager) throw error(HttpStatus.FORBIDDEN);
                    if (support.stream().anyMatch(v -> v.accountId().equals(r.providerAccountId()) && Objects.equals(v.serviceId(), r.serviceId()) && !"declined".equals(v.status()))) return dto(actor, c);
                    support.removeIf(v -> v.accountId().equals(r.providerAccountId()));
                    String membership = "accepted".equals(c.membershipStatus(r.providerAccountId())) ? "accepted" : "invited";
                    support.add(new CaseDetails.Support(r.providerAccountId(), r.serviceId(), membership));
                    participants.add(r.providerAccountId());
                    memberStates.put(r.providerAccountId(), membership);
                }
            }
            case "accept-invite", "decline-invite" -> {
                var own = support.stream().filter(v -> v.accountId().equals(actor) && "invited".equals(v.status())).findFirst().orElseThrow(() -> error(HttpStatus.FORBIDDEN));
                support.remove(own); support.add(new CaseDetails.Support(actor, own.serviceId(), "accept-invite".equals(action) ? "accepted" : "declined"));
                memberStates.put(actor, "accept-invite".equals(action) ? "accepted" : "declined");
            }
            case "offer", "edit-offer" -> {
                boolean editing = "edit-offer".equals(action);
                var existing = editing ? offers.stream().filter(o -> o.id().equals(r.offerId())).findFirst().orElse(null) : null;
                var own = support.stream().filter(v -> v.accountId().equals(actor) && "accepted".equals(v.status()) && "accepted".equals(c.membershipStatus(actor))).findFirst().orElse(null);
                if (editing ? !manager : own == null) throw error(HttpStatus.FORBIDDEN);
                if (editing && existing == null || !List.of("open", "in-progress").contains(status)) throw error(HttpStatus.CONFLICT);
                if (r.amount() == null || !Double.isFinite(r.amount()) || r.amount() < 0 || r.amount() > 100000000 || r.note() == null || r.note().length() > 4000
                        || r.workPolicy() != null && r.workPolicy().length() > 4000 || r.refundPolicy() != null && r.refundPolicy().length() > 4000)
                    throw error(HttpStatus.BAD_REQUEST);
                try { java.util.Currency.getInstance(r.currency()); } catch (RuntimeException error) { throw error(HttpStatus.BAD_REQUEST); }
                validateOfferPolicies(r.workPolicies()); validateOfferPolicies(r.refundPolicies());
                var offer = new CaseDetails.Offer(editing ? existing.id() : UUID.randomUUID().toString(), editing ? existing.providerAccountId() : actor,
                        editing ? existing.serviceId() : own.serviceId(), r.amount(), r.currency(), r.note(), editing ? existing.status() : "pending",
                        editing ? existing.createdAtIso() : Instant.now().toString(), r.workPolicy(), r.refundPolicy(), r.workPolicies(), r.refundPolicies());
                if (editing) offers.set(offers.indexOf(existing), offer); else offers.add(offer);
            }
            case "accept-offer", "reject-offer", "pending-offer" -> {
                if (!manager) throw error(HttpStatus.FORBIDDEN);
                int index = -1; for (int i = 0; i < offers.size(); i++) if (offers.get(i).id().equals(r.offerId())) index = i;
                if (index < 0 || "trash".equals(status)) throw error(HttpStatus.CONFLICT);
                var o = offers.get(index); offers.set(index, new CaseDetails.Offer(o.id(), o.providerAccountId(), o.serviceId(), o.amount(), o.currency(), o.note(),
                        "accept-offer".equals(action) ? "accepted" : "reject-offer".equals(action) ? "rejected" : "pending", o.createdAtIso(), o.workPolicy(), o.refundPolicy(), o.workPolicies(), o.refundPolicies()));
            }
            default -> throw error(HttpStatus.BAD_REQUEST);
        }
        var saved = persist(new ServiceCase(c.id(), c.baseGroupId(), c.communityId(), owner, c.title(), c.description(), c.caseType(), status,
                c.audienceAll(), c.audienceAccountIds(), List.copyOf(participants), participants.stream().filter(v -> !actor.equals(v) && !List.of("removed", "left", "declined").contains(memberStates.getOrDefault(v, c.membershipStatus(v) == null ? "invited" : c.membershipStatus(v)))).toList(),
                support, recommendations, offers, c.scheduledTaskId(), c.dueAtIso(), c.createdAtIso(), Instant.now().toString(), c.version(), memberStates, boardTasks, List.copyOf(chatAccounts)));
        if ("complete".equals(action) && !"completed".equals(c.status())) scheduleFeedback(saved);
        notifyChange(saved, actor, "leave".equals(action) && manager ? "owner-left" : List.of("join", "decline", "leave", "invite-members", "remove-member", "invite-chat", "save-board-task", "delete-board-task", "edit-offer", "pending-offer").contains(action) ? "updated" : action, saved.id() + ":" + saved.version());
        return dto(actor, saved);
    }
    public void notifyChange(ServiceCase c, String actor, String action, String occurrenceKey) {
        chats.synchronizeCase(com.raxim.myscoutee.domain.community.mapper.CaseConversationMapper.toConversation(c));
        var recipientAccounts = c.notifiedParticipantAccountIds().stream().filter(id -> !id.equals(actor)).toList();
        var recipients = users.findByWorkspaceGroupIdAndAccountUserIdIn(BaseGroups.COMMUNITY_BASE_ID, recipientAccounts)
                .stream().map(ProfileSummary::getUserId).toList();
        if (recipients.isEmpty()) return;
        String kind = "case-" + action;
        var payload = new LinkedHashMap<String, String>();
        payload.put("workspaceGroupId", BaseGroups.COMMUNITY_BASE_ID); payload.put("caseId", c.id());
        payload.put("senderUserId", actor); payload.put("notification_message_key", "notification.kind." + kind + ".message");
        JobGroupContext.run(BaseGroups.COMMUNITY_BASE_ID, () -> notifications.enqueueOnce(kind + ":" + occurrenceKey,
                new NotificationDelivery.NotificationIntent(kind, "case", c.id(), "participants", recipients, c.title(), c.title(),
                        "/game?caseId=" + java.net.URLEncoder.encode(c.id(), java.nio.charset.StandardCharsets.UTF_8), null,
                        "/assets/logo/heart.webp", "case:" + c.id(), payload, actor)));
    }
    private static void validateOfferPolicies(List<com.raxim.myscoutee.common.dto.SharedDtos.PolicyItemDto> policies) {
        if (policies == null) return;
        var ids = new HashSet<String>();
        if (policies.size() > 100) throw error(HttpStatus.BAD_REQUEST);
        for (var p : policies) {
            if (p == null || p.id() == null || p.id().isBlank() || p.id().length() > 100 || !ids.add(p.id())
                    || p.title() == null || p.title().isBlank() || p.title().length() > 120
                    || p.description() == null || p.description().isBlank() || p.description().length() > 4000 || p.required() == null) throw error(HttpStatus.BAD_REQUEST);
        }
    }
    private static void validateBoardTask(CaseDetails.BoardTask task, ServiceCase c) {
        if (task == null || task.id() == null || task.id().isBlank() || task.id().length() > 100 || task.title() == null || task.title().isBlank() || task.title().length() > 120
                || task.description() == null || task.description().length() > 4000 || task.status() == null || !List.of("todo", "in-progress", "done", "deleted").contains(task.status())
                || task.assigneeAccountIds() == null || task.dependsOnIds() == null || task.assigneeAccountIds().size() > 100 || task.dependsOnIds().size() > 200) throw error(HttpStatus.BAD_REQUEST);
        var offerIds = c.offers().stream().filter(o -> "accepted".equals(o.status())).map(CaseDetails.Offer::id).collect(Collectors.toSet());
        if (task.offerIds().size() > 100 || !offerIds.containsAll(task.offerIds()) || new HashSet<>(task.offerIds()).size() != task.offerIds().size()) throw error(HttpStatus.BAD_REQUEST);
        var old = c.boardTasks().stream().filter(t -> t.id().equals(task.id())).findFirst().orElse(null);
        if (task.assigneeAccountIds().stream().anyMatch(id -> !c.activeParticipantAccountIds().contains(id) && (old == null || !old.assigneeAccountIds().contains(id)))) throw error(HttpStatus.BAD_REQUEST);
        try {
            Instant start = task.startAtIso() == null ? null : Instant.parse(task.startAtIso());
            Instant end = task.endAtIso() == null ? null : Instant.parse(task.endAtIso());
            if (end != null && (start == null || !end.isAfter(start))) throw error(HttpStatus.BAD_REQUEST);
        } catch (RuntimeException invalid) { throw error(HttpStatus.BAD_REQUEST); }
    }
    private static void validateTaskGraph(List<CaseDetails.BoardTask> tasks) {
        if (tasks.size() > 200) throw error(HttpStatus.BAD_REQUEST);
        var byId = tasks.stream().collect(Collectors.toMap(CaseDetails.BoardTask::id, t -> t));
        var completed = new HashSet<String>();
        for (var task : tasks) visitTask(task.id(), byId, new HashSet<>(), completed);
    }
    private static void visitTask(String id, Map<String, CaseDetails.BoardTask> tasks, Set<String> path, Set<String> completed) {
        if (completed.contains(id)) return;
        if (!tasks.containsKey(id) || !path.add(id)) throw error(HttpStatus.BAD_REQUEST);
        for (String dependency : tasks.get(id).dependsOnIds()) visitTask(dependency, tasks, path, completed);
        path.remove(id); completed.add(id);
    }
    private static Set<String> displayAccounts(ServiceCase c) {
        var ids = new LinkedHashSet<>(c.participantAccountIds());
        c.recommendations().forEach(r -> { ids.add(r.providerAccountId()); ids.add(r.accountId()); }); return ids;
    }
    private CaseItem dto(String actor, ServiceCase c) {
        var people = users.findByUserIdIn(displayAccounts(c)).stream().collect(Collectors.toMap(ProfileSummary::getUserId, u -> u));
        return CommunityCaseMapper.toDto(c, actor, canManage(c, actor), c.communityId() == null ? null : groups.findById(c.communityId()).orElse(null), people);
    }
    private ServiceCase persist(ServiceCase c) {
        try { return cases.save(c); } catch (org.springframework.dao.OptimisticLockingFailureException error) { throw error(HttpStatus.CONFLICT); }
    }
    public static void validateFields(String title, String description, String type) {
        if (title == null || title.isBlank() || title.trim().length() > 120 || description == null || description.length() > 120 || !TYPES.contains(type))
            throw error(HttpStatus.BAD_REQUEST);
    }
    public static int page(String cursor) {
        try { int value = cursor == null || cursor.isBlank() ? 0 : Integer.parseInt(cursor); if (value >= 0 && value <= 1000000) return value; }
        catch (NumberFormatException ignored) {}
        throw error(HttpStatus.BAD_REQUEST);
    }
    private static List<String> statuses(String status) {
        if (status == null || status.isBlank() || "active".equals(status)) return List.of("open", "in-progress");
        if (Set.of("open", "in-progress", "completed", "cancelled", "trash").contains(status)) return List.of(status);
        throw error(HttpStatus.BAD_REQUEST);
    }
    private static String blank(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
