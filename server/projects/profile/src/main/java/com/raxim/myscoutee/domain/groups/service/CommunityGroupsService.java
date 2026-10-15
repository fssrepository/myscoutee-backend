package com.raxim.myscoutee.domain.groups.service;

import com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.groups.api.WorkspaceContext;

import com.raxim.myscoutee.domain.groups.dto.GroupPolicy;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile;
import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles;
import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;
import com.raxim.myscoutee.domain.accounts.api.ProfileCards;
import com.raxim.myscoutee.domain.groups.api.GroupCounters;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.content.api.CommunityReports;
import com.raxim.myscoutee.domain.content.api.ContentRegistration;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.*;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.ProfileExtByIdResponseDto;
import com.raxim.myscoutee.domain.events.dto.ActivityMembersDtos.*;
import com.raxim.myscoutee.common.dto.SharedDtos.*;

import com.raxim.myscoutee.domain.groups.mapper.CommunityGroupMapper;

@Service
public class CommunityGroupsService implements com.raxim.myscoutee.domain.groups.api.Groups {
    public static final String OWNER_TYPE = "community";
    private static final Set<String> CATEGORIES = Set.of("friends", "work", "sport", "learning", "hobbies", "neighbourhood");
    private static final Set<String> VISIBILITIES = Set.of("public", "private", "invitation");
    private static final Set<String> FIELDS = Set.of("profile.name", "profile.city", "profile.birthday", "profile.height",
            "profile.physique", "profile.languages", "profile.profession", "profile.experience.workplace", "profile.experience.school",
            "profile.horoscope", "profile.details.interest", "profile.details.drinking", "profile.details.smoking", "profile.details.workout", "profile.details.pets",
            "profile.details.familyPlans", "profile.details.children", "profile.details.loveStyle", "profile.details.communicationStyle",
            "profile.details.sexualOrientation", "profile.gender", "profile.details.religion", "profile.details.values");
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.accounts.api.ProfileSummaries summaries;
    private final CommunityGroupsRepository groups;
    private final CommunityMemberships memberships;
    private final DiscoveryProfiles users;
    private final SelectedProfile profiles;
    private final ProfileCards cards;
    private final AccountWorkspaces groupProfiles;
    private final ContentRegistration moderation;
    private final CommunityReports reports;
    private final OperationalTelemetry telemetry;
    private final GroupCounters counters;
    @org.springframework.beans.factory.annotation.Autowired
    private Optional<com.raxim.myscoutee.domain.community.api.CaseParticipants> caseParticipants = Optional.empty();
    private final com.raxim.myscoutee.domain.notifications.api.NotificationDelivery notifications;
    public CommunityGroupsService(CommunityGroupsRepository groups, CommunityMemberships memberships,
            DiscoveryProfiles users, SelectedProfile profiles, ProfileCards cards, AccountWorkspaces groupProfiles,
            ContentRegistration moderation, CommunityReports reports, OperationalTelemetry telemetry, GroupCounters counters,
            com.raxim.myscoutee.domain.notifications.api.NotificationDelivery notifications) {
        this.groups = groups; this.memberships = memberships; this.users = users; this.profiles = profiles; this.cards = cards; this.groupProfiles = groupProfiles;
        this.moderation = moderation; this.reports = reports; this.telemetry = telemetry; this.counters = counters; this.notifications = notifications;
    }
    public DiscoveryProfile actor(String requestedId) {
        var actor = profiles.resolveSelectedIdentity(requestedId);
        if (actor == null) throw error(HttpStatus.UNAUTHORIZED);
        return users.findByUserId(actor.accountUserId() == null ? actor.userId() : actor.accountUserId())
                .orElseThrow(() -> error(HttpStatus.UNAUTHORIZED));
    }
    public List<Workspace> workspaces(DiscoveryProfile actor) {
        var memberships = this.memberships.forAccount(actor.getUserId()).stream()
                .filter(m -> Set.of("accepted", "pending").contains(m.getStatus())).collect(Collectors.toMap(CommunityMember::getOwnerId, m -> m));
        for (String baseId : BaseGroups.BASE_IDS) if ("Admin".equalsIgnoreCase(actor.getHostTier()) && !memberships.containsKey(baseId)
                && membership(baseId, actor.getUserId()) == null) {
            groups.findById(baseId).filter(group -> !group.deleted()).ifPresent(group -> {
                // App administration uses the same workspace/profile admission path.
                var member = this.memberships.register(newMember(group, actor.getUserId(), "Admin", "accepted", null, null));
                groupProfiles.admit(group, actor.getUserId());
                memberships.put(group.id(), member);
            });
        }
        var profiles = groupProfiles.profilesByGroup(actor.getUserId());
        return groups.findByIdIn(memberships.keySet()).stream().filter(g -> !g.deleted())
                .map(g -> new Workspace(g.id(), profiles.containsKey(g.id()) ? profiles.get(g.id()).profileId() : null, g.name(), memberships.get(g.id()).getRole(),
                    ("accepted".equals(memberships.get(g.id()).getStatus())
                        ? attention(profiles.get(g.id())) : 0)
                        + CommunityGroupMapper.membersActivity(g, memberships.get(g.id()))
                        + (isAdmin(memberships.get(g.id())) ? g.pendingModerationCount() : 0), g.policy(),
                    isAdmin(memberships.get(g.id())) ? g.pendingModerationCount() : 0,
                    isAdmin(memberships.get(g.id())) && g.moderationQueueRevision() != null ? g.moderationQueueRevision() : 0, g.category(), memberships.get(g.id()).getStatus(),
                    CommunityGroupMapper.membersActivity(g, memberships.get(g.id())), memberships.get(g.id()).getRequestKind(), g.effectiveType()))
                .sorted(Comparator.comparing(Workspace::name).thenComparing(Workspace::groupId)).toList();
    }
    public ProfileExtByIdResponseDto completeProfileLoad(
            DiscoveryProfile account, ProfileExtByIdResponseDto response,
            String requestedGroup) {
        var context = completeProfileWorkspace(account, WorkspaceContext.currentGroupId(), requestedGroup);
        return new ProfileExtByIdResponseDto(
                response.profileExt(), response.filterCount(), response.filterPreferences(), response.counterOverrides(),
                context.workspace(), context.accountProfile());
    }
    @Override public com.raxim.myscoutee.domain.groups.dto.ProfileWorkspaceDto loadProfileWorkspace(
            String accountId, String currentGroupId, String requestedGroupId) {
        var account = users.findByUserId(accountId).orElseThrow(() -> error(HttpStatus.UNAUTHORIZED));
        if (account.getAccountUserId() != null) throw error(HttpStatus.UNAUTHORIZED);
        return completeProfileWorkspace(account, currentGroupId, requestedGroupId);
    }
    private com.raxim.myscoutee.domain.groups.dto.ProfileWorkspaceDto completeProfileWorkspace(
            DiscoveryProfile account, String currentGroupId, String requestedGroup) {
        var context = select(account, currentGroupId);
        var result = new com.raxim.myscoutee.domain.groups.dto.ProfileWorkspaceDto(context.workspace(), context.accountProfile());
        // A failed profile load must not replace the saved selection.
        if (requestedGroup != null) groupProfiles.activate(account.getUserId(), requestedGroup);
        return result;
    }
    /** Read-only profile resolution, also used by group moderation. */
    public WorkspaceSelection select(DiscoveryProfile actor, String id) {
        if (id == null || id.isBlank()) return new WorkspaceSelection(null, presented(List.of(actor.getUserId())).get(actor.getUserId()), null);
        var selected = groupProfiles.select(actor.getUserId(), id);
        var descriptor = workspaces(actor).stream().filter(w -> w.groupId().equals(id)).findFirst().orElseThrow(() -> error(HttpStatus.FORBIDDEN));
        var presented = presented(java.util.stream.Stream.of(selected.getUserId(), actor.getUserId()).distinct().toList());
        return new WorkspaceSelection(descriptor, presented.get(selected.getUserId()), presented.get(actor.getUserId()));
    }
    private Map<String, com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto> presented(List<String> ids) {
        return cards.presentProfiles(ids).stream().collect(Collectors.toMap(
                com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto::id, java.util.function.Function.identity()));
    }
    private static long attention(com.raxim.myscoutee.domain.accounts.dto.AccountWorkspaceDto value) {
        return value == null ? 0 : value.attention();
    }
    public Group detail(DiscoveryProfile actor, String id) {
        var group = visible(actor, id);
        return dto(actor, group, members(id));
    }
    private record GroupSnapshot(List<Group> items, long total, Map<String, Long> context) {}
    private GroupSnapshot snapshot(DiscoveryProfile actor, String bucket, String category, String sort) {
        if (!Set.of("hosting", "participation", "pending", "invitations", "explore", "trash").contains(bucket)) throw error(HttpStatus.BAD_REQUEST);
        String order = sort == null || sort.isBlank() ? (bucket.equals("explore") ? "distance" : "updated") : sort;
        if (!Set.of("distance", "updated").contains(order)) throw error(HttpStatus.BAD_REQUEST);
        var own = memberships.forAccount(actor.getUserId()).stream()
                .filter(m -> Set.of("accepted", "pending").contains(m.getStatus()) || CommunityGroupMapper.restorableMembership(m)).toList();
        var ownById = own.stream().collect(Collectors.toMap(CommunityMember::getOwnerId, m -> m));
        var records = bucket.equals("explore") ? groups.findDiscoverable(ownById.keySet(), actor.getUserId())
                : groups.findByIdIn(own.stream().filter(m -> bucket.equals(CommunityGroupMapper.membershipBucket(m.getRole(), m.getStatus(), m.getRequestKind())))
                    .map(CommunityMember::getOwnerId).toList());
        var groupIds = records.stream().map(CommunityGroup::id).toList();
        var membersByGroup = memberships.forGroups(groupIds).stream()
                .collect(Collectors.groupingBy(CommunityMember::getOwnerId));
        var owners = users.findByUserIdIn(records.stream().map(CommunityGroup::ownerUserId).distinct().toList()).stream()
                .collect(Collectors.toMap(DiscoveryProfile::getUserId, u -> u));
        var profileByGroup = groupProfiles.profilesByGroup(actor.getUserId());
        var rows = records.stream().filter(g -> !g.deleted() || bucket.equals("trash")).filter(g -> !bucket.equals("explore") || !g.awaitingOwner() && g.moderationVisible())
                .filter(g -> category == null || category.isBlank() || category.equals(g.category()))
                .filter(g -> owners.containsKey(g.ownerUserId()))
                .map(g -> CommunityGroupMapper.toDto(g, owners.get(g.ownerUserId()), actor,
                        membersByGroup.getOrDefault(g.id(), List.of()), attention(profileByGroup.get(g.id()))))
                .sorted(Comparator.comparingInt((Group g) -> BaseGroups.isBaseId(g.id()) ? 0 : 1)
                    .thenComparing(order.equals("distance")
                    ? Comparator.comparingDouble((Group g) -> g.distanceKm() == null ? Double.MAX_VALUE : g.distanceKm())
                    : Comparator.comparing(Group::updatedAtIso, Comparator.reverseOrder()))
                    .thenComparing(Group::id)).toList();
        var counts = storedGroupCounters(actor.getUserId());
        return new GroupSnapshot(rows, rows.size(), counts.entrySet().stream().collect(Collectors.toMap(
                e -> e.getKey().substring("groups_".length()), e -> e.getValue().longValue())));
    }
    public Page page(DiscoveryProfile actor, String bucket, String category, int pageSize, String cursor) {
        return page(actor, bucket, category, pageSize, cursor, null);
    }
    public Page page(DiscoveryProfile actor, String bucket, String category, int pageSize, String cursor, String sort) {
        var snapshot = snapshot(actor, bucket, category, sort);
        int offset = 0;
        try { if (cursor != null && !cursor.isBlank()) offset = Integer.parseInt(cursor); }
        catch (NumberFormatException ex) { throw error(HttpStatus.BAD_REQUEST); }
        if (offset < 0) throw error(HttpStatus.BAD_REQUEST);
        var result = snapshot.items().stream().skip(offset).limit(Math.max(1, Math.min(pageSize, 50))).toList();
        return new Page(result.stream().map(Summary::from).toList(), snapshot.total(), offset + result.size() < snapshot.total() ? "" + (offset + result.size()) : null, snapshot.context());
    }
    public SyncResponse sync(DiscoveryProfile actor, SyncRequest request) {
        if (request.knownItems() == null || request.knownItems().size() > 500) throw error(HttpStatus.BAD_REQUEST);
        var snapshot = snapshot(actor, request.bucket(), request.category(), request.sort());
        var known = request.knownItems().stream().collect(Collectors.toMap(KnownGroup::id, KnownGroup::revision, (a,b) -> b));
        var byId = snapshot.items().stream().collect(Collectors.toMap(Group::id, g -> g));
        int tailIndex = -1;
        for (int i = 0; i < snapshot.items().size(); i++) if (snapshot.items().get(i).id().equals(request.tailId())) { tailIndex = i; break; }
        int window = tailIndex < 0 ? Math.min(500, known.size() + Math.max(1, Math.min(request.limit(), 50))) : tailIndex + 1;
        var upserts = new LinkedHashMap<String, Group>();
        snapshot.items().stream().limit(window).filter(g -> !g.revision().equals(known.get(g.id()))).forEach(g -> upserts.put(g.id(), g));
        known.forEach((id, revision) -> { var g = byId.get(id); if (g != null && !g.revision().equals(revision)) upserts.put(id, g); });
        return new SyncResponse(upserts.values().stream().map(Summary::from).toList(), known.keySet().stream().filter(id -> !byId.containsKey(id)).toList(), snapshot.total());
    }
    public synchronized Group save(DiscoveryProfile actor, Save request) {
        if (request == null || request.name() == null || request.name().isBlank() || request.name().codePointCount(0, request.name().length()) > 20
                || request.description() != null && request.description().length() > 4000
                || !CATEGORIES.contains(request.category()) || !VISIBILITIES.contains(request.visibility())) throw error(HttpStatus.BAD_REQUEST);
        if (request.groupType() != null && !Set.of("dating", "work", "community").contains(request.groupType())) throw error(HttpStatus.BAD_REQUEST);
        var policy = request.policy();
        if (policy == null || policy.requiredFields() == null || !FIELDS.containsAll(policy.requiredFields())) throw error(HttpStatus.BAD_REQUEST);
        var existing = request.id() == null || request.id().isBlank() ? null : visible(actor, request.id());
        if (existing != null) requireAdmin(actor, existing.id());
        if (existing != null && !Objects.equals(existing.version(), request.version())) throw error(HttpStatus.CONFLICT);
        String now = Instant.now().toString();
        String id = existing == null ? UUID.randomUUID().toString() : existing.id();
        var group = new CommunityGroup(id, existing == null ? actor.getUserId() : existing.ownerUserId(), request.name().trim(),
                request.description() == null ? "" : request.description().trim(), request.imageUrl(), request.category(),
                request.visibility(), request.hideMembers(), new GroupPolicy(policy.workspace(), policy.enabled(),
                    policy.requiredFields().stream().distinct().toList(), Boolean.TRUE.equals(policy.policiesEnabled()),
                    policy.policies() == null ? List.of() : policy.policies().stream().filter(Objects::nonNull).toList()), existing == null ? now : existing.createdAtIso(), now,
                    existing == null ? null : existing.version(), existing == null ? null : existing.moderationStatus(),
                    existing == null ? null : existing.moderationVersion(),
                    existing == null ? null : existing.moderationPending(), existing == null ? null : existing.moderationQueueRevision(), existing == null ? 0L : existing.pendingMembers(), existing == null ? null : existing.lifecycleStatus(),
                    existing == null ? null : existing.ownerReleasedAtIso(), existing == null ? null : existing.takeoverCandidates(), request.groupType() == null ? (existing == null ? "dating" : existing.effectiveType()) : request.groupType());
        group = groups.save(group);
        if (existing == null) memberships.register(newMember(group, actor.getUserId(), "Admin", "accepted", null, actor.getUserId()));
        groupProfiles.applyPolicy(group);
        moderation.register("group", group.id(), group.ownerUserId(), group.name(), group.imageUrl());
        group = groups.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        return dto(actor, group, members(id));
    }
    public Group moderationDetail(String id) {
        var group = groups.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var owner = users.findByUserId(group.ownerUserId()).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        return dto(owner, group, members(id));
    }
    public void report(DiscoveryProfile actor, Report request) {
        var group = visible(actor, request.groupId());
        String details = request.details() == null ? "" : request.details().trim();
        if (group.ownerUserId().equals(actor.getUserId())) throw error(HttpStatus.FORBIDDEN);
        if (details.length() < 12 || details.length() > 2000) throw error(HttpStatus.BAD_REQUEST);
        reports.submitGroupReport(actor.getUserId(), group.ownerUserId(), group.id(), group.name(), details);
    }
    public synchronized Group join(DiscoveryProfile actor, String id) {
        var group = visible(actor, id);
        if (group.awaitingOwner() || !group.moderationVisible()) throw error(HttpStatus.FORBIDDEN);
        var old = membership(id, actor.getUserId());
        if (BaseGroups.isBaseId(id)) {
            if (old != null && "blocked".equals(old.getStatus())) throw error(HttpStatus.FORBIDDEN);
            if (old == null || !"accepted".equals(old.getStatus())) {
                memberships.register(newMember(group, actor.getUserId(), "Member", "accepted", null, null));
                if (old != null && "pending".equals(old.getStatus())) counters.applyCommunityMemberDelta(id, -1);
                groupProfiles.admit(group, actor.getUserId());
            }
            return dto(actor, groups.findById(id).orElseThrow(), members(id));
        }
        if (old != null && Set.of("accepted", "pending").contains(old.getStatus())) {
            if ("pending".equals(old.getStatus()) && "join".equals(old.getRequestKind())) {
                notifyMembers(group, "join-requested", actor.getUserId(), old, members(id).stream().filter(this::isAdmin).map(CommunityMember::getUserId).toList(), false);
            }
            return dto(actor, groups.findById(id).orElseThrow(), members(id));
        }
        if ("invitation".equals(group.visibility())) throw error(HttpStatus.FORBIDDEN);
        // Independent workspace admission goes through an administrator.
        var requested = memberships.register(newMember(group, actor.getUserId(), "Member", "pending", "join", null));
        counters.applyCommunityMemberDelta(id, 1);
        notifyMembers(group, "join-requested", actor.getUserId(), requested, members(id).stream().filter(this::isAdmin).map(CommunityMember::getUserId).toList(), false);
        return dto(actor, groups.findById(id).orElseThrow(), members(id));
    }
    public void joinWorkspaceBase(DiscoveryProfile actor, String groupId) {
        var workspace = visible(actor, groupId);
        var member = membership(groupId, actor.getUserId());
        if (member == null || !"accepted".equals(member.getStatus())) throw error(HttpStatus.FORBIDDEN);
        if (workspace.baseId() != null && !workspace.baseId().equals(groupId))
            join(actor, workspace.baseId());
    }
    public List<ActivityMemberEntryDto> roster(DiscoveryProfile actor, String id, boolean pendingOnly) {
        var group = visible(actor, id);
        var own = membership(id, actor.getUserId());
        boolean admin = isAdmin(own);
        var rows = members(id).stream().filter(m -> !pendingOnly || "pending".equals(m.getStatus()))
                .filter(m -> admin || "accepted".equals(m.getStatus()) || actor.getUserId().equals(m.getUserId()))
                .filter(m -> admin || !group.hideMembers() || "Admin".equals(m.getRole()) || actor.getUserId().equals(m.getUserId())).toList();
        var people = users.findByUserIdIn(rows.stream().map(CommunityMember::getUserId).toList()).stream()
                .collect(Collectors.toMap(DiscoveryProfile::getUserId, u -> u));
        return rows.stream().filter(m -> people.containsKey(m.getUserId()))
                .map(m -> CommunityGroupMapper.member(m, people.get(m.getUserId()), actor.getUserId())).toList();
    }
    public ActivityMembersSummaryDto summary(DiscoveryProfile actor, String id) {
        var group = detail(actor, id);
        var rows = roster(actor, id, false);
        return new ActivityMembersSummaryDto(OWNER_TYPE, id, group.acceptedMembers(), group.pendingMembers(), group.acceptedMembers(),
                rows.stream().filter(m -> "accepted".equals(m.status())).map(ActivityMemberEntryDto::userId).toList(),
                rows.stream().filter(m -> "pending".equals(m.status())).map(ActivityMemberEntryDto::userId).toList());
    }
    public ActivityMembersSyncResponseDto sync(DiscoveryProfile actor, ActivityMembersSyncRequestDto request) {
        var rows = roster(actor, request.owner().ownerId(), false);
        var known = request.knownItems() == null ? List.<ActivityMemberSyncKnownItemDto>of() : request.knownItems();
        var revisions = known.stream().collect(Collectors.toMap(ActivityMemberSyncKnownItemDto::id, k -> Objects.toString(k.revision(), ""), (a,b) -> b));
        var ids = rows.stream().map(ActivityMemberEntryDto::id).collect(Collectors.toSet());
        return new ActivityMembersSyncResponseDto(rows.stream().filter(m -> !Objects.equals(m.revision(), revisions.get(m.id()))).toList(),
                known.stream().map(ActivityMemberSyncKnownItemDto::id).filter(id -> !ids.contains(id)).toList(), rows.size());
    }
    public synchronized ActivityMembersInviteResponseDto invite(DiscoveryProfile actor, String id, List<String> userIds) {
        var group = visible(actor, id); requireAdmin(actor, id);
        if (userIds == null || userIds.size() > 200) throw error(HttpStatus.BAD_REQUEST);
        var candidates = users.findByUserIdIn(userIds).stream().filter(u -> u.getWorkspaceGroupId() == null).map(DiscoveryProfile::getUserId).collect(Collectors.toSet());
        var existing = members(id).stream().filter(m -> Set.of("accepted", "pending").contains(m.getStatus()))
                .map(CommunityMember::getUserId).collect(Collectors.toSet());
        var invited = userIds.stream().distinct().filter(candidates::contains).filter(uid -> !existing.contains(uid)).toList();
        memberships.registerAll(invited.stream().map(uid -> newMember(group, uid, "Member", "pending", "invite", actor.getUserId())).toList());
        counters.applyCommunityMemberDelta(id, invited.size());
        for (var member : members(id)) if (userIds.contains(member.getUserId()) && "pending".equals(member.getStatus())
                && "invite".equals(member.getRequestKind()) && actor.getUserId().equals(member.getInvitedByUserId()))
            notifyMembers(group, "invite", actor.getUserId(), member, List.of(member.getUserId()), false);
        return new ActivityMembersInviteResponseDto(roster(actor, id, false), invited, List.of(), dto(actor, groups.findById(id).orElseThrow(), members(id)));
    }
    /** Called after the shared partner-link flow has bound the invitation to its recipient. */
    public void claimIntegrationInvite(ParticipantInvitation invite, String actorUserId) {
        if (!OWNER_TYPE.equals(invite.ownerType()) || !actorUserId.equals(invite.claimedUserId())) {
            throw error(HttpStatus.FORBIDDEN);
        }
        var owner = users.findByUserId(invite.ownerUserId()).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var recipient = users.findByUserId(actorUserId).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (recipient.getWorkspaceGroupId() != null) throw error(HttpStatus.FORBIDDEN);
        invite(owner, invite.eventId(), List.of(actorUserId));
        var member = membership(invite.eventId(), actorUserId);
        if (member == null) throw error(HttpStatus.CONFLICT);
        if ("accepted".equals(member.getStatus())) {
            groupProfiles.activate(recipient.getUserId(), invite.eventId());
            return;
        }
        var acceptingActor = "invite".equals(member.getRequestKind()) ? recipient : owner;
        action(acceptingActor, new ActivityMemberActionRequestDto(
                new ActivityMemberOwnerRefDto(OWNER_TYPE, invite.eventId()),
                acceptingActor.getUserId(), actorUserId, "accept", null));
        groupProfiles.activate(recipient.getUserId(), invite.eventId());
    }
    /** A validated event sharing link also admits its recipient to the event workspace. */
    public synchronized DiscoveryProfile claimEventInvite(String groupId, String inviterProfileId, String accountId) {
        var inviter = users.findByUserId(inviterProfileId).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var recipient = users.findByUserId(accountId).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var group = groups.findById(groupId).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var inviterMembership = membership(groupId, inviter.getAccountUserId());
        if (!groupId.equals(inviter.getWorkspaceGroupId()) || inviterMembership == null
                || !"accepted".equals(inviterMembership.getStatus()) || recipient.getWorkspaceGroupId() != null
                || group.deleted() || group.awaitingOwner() || !group.moderationVisible() || !group.policy().workspace())
            throw error(HttpStatus.FORBIDDEN);
        var member = membership(groupId, accountId);
        if (member != null && ("blocked".equals(member.getStatus())
                || "pending".equals(member.getStatus()) && "restore".equals(member.getCommunityAction())))
            throw error(HttpStatus.FORBIDDEN);
        if (member == null || !"accepted".equals(member.getStatus())) {
            boolean wasPending = member != null && "pending".equals(member.getStatus());
            memberships.register(newMember(group, accountId, "Member", "pending", "invite", inviter.getAccountUserId()));
            if (!wasPending) counters.applyCommunityMemberDelta(groupId, 1);
            action(recipient, new ActivityMemberActionRequestDto(new ActivityMemberOwnerRefDto(OWNER_TYPE, groupId),
                    accountId, accountId, "accept", null));
        }
        return groupProfiles.activate(recipient.getUserId(), groupId);
    }

    public synchronized ActivityMemberActionResponseDto action(DiscoveryProfile actor, ActivityMemberActionRequestDto request) {
        String id = request.owner().ownerId(); var group = groups.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var target = membership(id, request.targetUserId());
        if (target == null) throw error(HttpStatus.NOT_FOUND);
        String previousStatus = target.getStatus();
        String previousRole = target.getRole();
        String previousActionAtIso = target.getActionAtIso();
        boolean self = actor.getUserId().equals(target.getUserId());
        boolean admin = isAdmin(membership(id, actor.getUserId()));
        boolean owner = group.ownerUserId().equals(target.getUserId());
        if (request.action().equals(target.getCommunityAction()) && actor.getUserId().equals(target.getCommunityActor()) && (Set.of("grant-vote", "revoke-vote").contains(request.action()) ? admin : self || admin)) {
            group = groups.findById(id).orElseThrow();
            updateCaseAdministrators(group, members(id));
            notifyMemberTransition(group, actor.getUserId(), target, request.action());
            if (group.awaitingOwner() && group.ownerUserId().equals(target.getUserId()) && Objects.equals(group.ownerReleasedAtIso(), target.getActionAtIso()))
                notifyHandover(group, actor.getUserId(), target, "owner-left");
            if ("take-over".equals(request.action())) notifyHandover(group, actor.getUserId(), target, "takeover");
            return new ActivityMemberActionResponseDto(group.deleted() || self && "deleted".equals(target.getStatus()) ? List.of() : roster(actor, id, false), null, dto(actor, group, members(id)));
        }
        boolean restoreGroup = "restore".equals(request.action()) && self && CommunityGroupMapper.canRestoreGroup(group, target);
        if (group.deleted() && !restoreGroup) throw error(HttpStatus.NOT_FOUND);
        if (!"restore".equals(request.action())) group = visible(actor, id);
        if (group.awaitingOwner() && !Set.of("take-over", "remove", "restore").contains(request.action())) throw error(HttpStatus.CONFLICT);
        switch (request.action()) {
            case "restore" -> {
                if (!self || !CommunityGroupMapper.restorableMembership(target)) throw error(HttpStatus.FORBIDDEN);
                if (restoreGroup && groups.claimResponsibility(id, group.ownerReleasedAtIso(), actor.getUserId(), Instant.now().toString(), "deleted") == 0)
                    throw error(HttpStatus.CONFLICT);
                target.setRole(restoreGroup ? "Admin" : "Member"); target.setOrganizerOnly(false); target.setManagerGrantedByUserId(null);
                if ("blocked".equals(target.getStatus())) {
                    target.setStatus("pending"); target.setRole("Member"); target.setRequestKind("join"); target.setPendingSource("member");
                } else target.setStatus("accepted");
            }
            case "accept" -> {
                if (!"pending".equals(target.getStatus()) || !("invite".equals(target.getRequestKind()) ? self : admin && !self)) throw error(HttpStatus.FORBIDDEN);
                groupProfiles.admit(group, target.getUserId());
                target.setStatus("accepted"); target.setRequestKind(null); target.setPendingSource(null);
            }
            case "remove" -> {
                if (!Set.of("accepted", "pending").contains(target.getStatus()) || !(self || admin && !owner && !isAdmin(target))) throw error(HttpStatus.FORBIDDEN);
                target.setStatus(self ? "deleted" : "blocked"); target.setManagerGrantedByUserId(null);
            }
            case "grant-vote", "revoke-vote" -> {
                if (!admin || !"accepted".equals(target.getStatus())) throw error(HttpStatus.FORBIDDEN);
                target.setVotingEligible("grant-vote".equals(request.action()));
            }
            case "promote-admin" -> {
                if (!admin || self || !"accepted".equals(target.getStatus()) || isAdmin(target)) throw error(HttpStatus.FORBIDDEN);
                target.setRole("Admin"); target.setManagerGrantedByUserId(actor.getUserId());
            }
            case "step-down-admin" -> {
                if (!self || !isAdmin(target)) throw error(HttpStatus.FORBIDDEN);
                target.setRole("Member"); target.setOrganizerOnly(false); target.setManagerGrantedByUserId(null);
            }
            case "revoke-admin" -> {
                if (!admin || self || owner || !isAdmin(target)
                        || !actor.getUserId().equals(target.getManagerGrantedByUserId())) throw error(HttpStatus.FORBIDDEN);
                target.setRole("Member"); target.setOrganizerOnly(false); target.setManagerGrantedByUserId(null);
            }
            case "take-over" -> {
                if (!self || !CommunityGroupMapper.canTakeOver(group, members(id), target)) throw error(HttpStatus.FORBIDDEN);
                if (groups.claimResponsibility(id, group.ownerReleasedAtIso(), actor.getUserId(), Instant.now().toString(), "under-review") == 0)
                    throw error(HttpStatus.CONFLICT);
                target.setRole("Admin"); target.setManagerGrantedByUserId(null);
            }
            case "set-organizer-only", "set-participant" -> {
                if (!self || !isAdmin(target)) throw error(HttpStatus.FORBIDDEN);
                target.setOrganizerOnly("set-organizer-only".equals(request.action()));
            }
            default -> throw error(HttpStatus.BAD_REQUEST);
        }
        if (Objects.equals(previousStatus, target.getStatus()) && Objects.equals(previousRole, target.getRole())
                && !Set.of("set-organizer-only", "set-participant", "take-over", "grant-vote", "revoke-vote").contains(request.action()))
            return new ActivityMemberActionResponseDto(roster(actor, id, false), null, dto(actor, group, members(id)));
        target.setUpdatedDate(Instant.now().toString()); target.setActionAtIso(target.getUpdatedDate());
        target.setCommunityAction(request.action()); target.setCommunityActor(actor.getUserId());
        if (memberships.transition(target.getId(), previousStatus, previousRole, previousActionAtIso,
                target.getStatus(), target.getRole(), target.getRequestKind(), target.getPendingSource(),
                Boolean.TRUE.equals(target.getOrganizerOnly()), target.getActionAtIso(), request.action(), actor.getUserId(), target.getManagerGrantedByUserId(), Boolean.TRUE.equals(target.getVotingEligible())) == 0)
            throw error(HttpStatus.CONFLICT);
        int pendingDelta = ("pending".equals(target.getStatus()) ? 1 : 0) - ("pending".equals(previousStatus) ? 1 : 0);
        if (pendingDelta == 0) counters.touchCommunityGroup(id, target.getActionAtIso());
        else counters.applyCommunityMemberDelta(id, pendingDelta);
        var remaining = members(id);
        if (remaining.isEmpty()) groups.updateLifecycle(id, "deleted", target.getActionAtIso(), List.of());
        else if (owner && ("remove".equals(request.action()) || "step-down-admin".equals(request.action()))
                || remaining.stream().noneMatch(this::isAdmin)) {
            if (!group.awaitingOwner()) groups.updateLifecycle(id, "under-review", target.getActionAtIso(), takeoverCandidates(remaining, actor.getUserId()));
        }
        group = groups.findById(id).orElseThrow();
        updateCaseAdministrators(group, remaining);
        if (group.awaitingOwner() && group.ownerUserId().equals(target.getUserId()) && Objects.equals(group.ownerReleasedAtIso(), target.getActionAtIso()))
            notifyHandover(group, actor.getUserId(), target, "owner-left");
        if ("take-over".equals(request.action())) notifyHandover(group, actor.getUserId(), target, "takeover");
        if (Set.of("deleted", "blocked").contains(target.getStatus())) groupProfiles.clearActiveWorkspace(target.getUserId(), id);
        notifyMemberTransition(group, actor.getUserId(), target, request.action());
        return new ActivityMemberActionResponseDto(group.deleted() || self && "deleted".equals(target.getStatus()) ? List.of() : roster(actor, id, false), null, dto(actor, group, members(id)));
    }
    private void updateCaseAdministrators(CommunityGroup group, List<CommunityMember> remaining) {
        if (!"community".equals(group.effectiveType())) return;
        var admins = group.deleted() || group.awaitingOwner() ? List.<String>of()
                : remaining.stream().filter(this::isAdmin).map(CommunityMember::getUserId).toList();
        caseParticipants.ifPresent(cases -> cases.groupAdminsChanged(group.id(), admins));
    }
    private void notifyMemberTransition(CommunityGroup group, String actorId, CommunityMember target, String action) {
        if ("restore".equals(action) && "pending".equals(target.getStatus())) {
            notifyMembers(group, "join-requested", actorId, target, members(group.id()).stream().filter(this::isAdmin).map(CommunityMember::getUserId).toList(), false);
        } else if ("accept".equals(action) || "restore".equals(action)) {
            boolean hideMembers = group.hideMembers();
            var recipients = members(group.id()).stream().filter(m -> "accepted".equals(m.getStatus()))
                    .filter(m -> !hideMembers || isAdmin(m) || m.getUserId().equals(target.getUserId()))
                    .map(CommunityMember::getUserId).toList();
            notifyMembers(group, "member-joined", actorId, target, recipients, true);
        } else if ("remove".equals(action)) {
            // Responsibility release is one change, represented by its takeover notice.
            if (group.ownerUserId().equals(target.getUserId()) && Objects.equals(group.ownerReleasedAtIso(), target.getActionAtIso())) return;
            var recipients = new ArrayList<String>();
            recipients.add(target.getUserId());
            members(group.id()).stream().filter(this::isAdmin).map(CommunityMember::getUserId).forEach(recipients::add);
            notifyMembers(group, "member-removed", actorId, target, recipients, true);
        } else if (Set.of("promote-admin", "revoke-admin", "step-down-admin").contains(action)) {
            notifyMembers(group, "role-changed", actorId, target, List.of(target.getUserId()), true);
        }
    }
    private boolean isAdminRole(String role) { return "Admin".equals(role); }
    private List<String> takeoverCandidates(List<CommunityMember> rows, String departingId) {
        var accepted = rows.stream().filter(m -> "accepted".equals(m.getStatus()) && !departingId.equals(m.getUserId())).toList();
        var admins = accepted.stream().filter(this::isAdmin).toList();
        return (admins.isEmpty() ? accepted : admins).stream().map(CommunityMember::getUserId).toList();
    }
    private void notifyHandover(CommunityGroup group, String actorId, CommunityMember subject, String action) {
        notifyMembers(group, action, actorId, subject,
            group.takeoverCandidates() == null ? List.of() : group.takeoverCandidates(), true);
    }
    private void notifyMembers(CommunityGroup group, String action, String actorId, CommunityMember subject,
            List<String> recipientIds, boolean attention) {
        var recipients = recipientIds.stream().filter(id -> !id.equals(actorId)).distinct().toList();
        if (recipients.isEmpty()) return;
        var payload = new LinkedHashMap<String, String>();
        payload.put("workspaceGroupId", group.id()); payload.put("workspaceGroupName", group.name());
        payload.put("communityGroupId", group.id()); payload.put("senderUserId", actorId);
        payload.put("memberUserId", subject.getUserId());
        payload.put("notification_message_key", "notification.kind.community-" + action + ".message");
        if (attention) payload.put("communityAttention", "members");
        String kind = "community-" + action;
        notifications.enqueueOnce(kind + ":" + subject.getId() + ":" + subject.getActionAtIso(),
            new com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent(
                kind, OWNER_TYPE, group.id(), "members", recipients, group.name(), group.name(), "/game?communityGroupId=" + java.net.URLEncoder.encode(group.id(), java.nio.charset.StandardCharsets.UTF_8),
                group.imageUrl(), "/assets/logo/heart.webp", kind + ":" + group.id(), payload, actorId));
    }
    private CommunityGroup visible(DiscoveryProfile actor, String id) {
        var group = groups.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (group.deleted()) throw error(HttpStatus.NOT_FOUND);
        var own = membership(id, actor.getUserId());
        if (group.awaitingOwner() && (own == null || !Set.of("accepted", "pending").contains(own.getStatus()))) throw error(HttpStatus.NOT_FOUND);
        if ("invitation".equals(group.visibility()) && (own == null || !Set.of("pending", "accepted").contains(own.getStatus()))) throw error(HttpStatus.NOT_FOUND);
        if (!group.moderationVisible() && (own == null || !Set.of("pending", "accepted").contains(own.getStatus()))) throw error(HttpStatus.NOT_FOUND);
        return group;
    }
    private Group dto(DiscoveryProfile actor, CommunityGroup group, List<CommunityMember> members) {
        var owner = users.findByUserId(group.ownerUserId()).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var own = membership(group.id(), actor.getUserId());
        if (CommunityGroupMapper.restorableMembership(own) && members.stream().noneMatch(m -> actor.getUserId().equals(m.getUserId()))) {
            members = new ArrayList<>(members); members.add(own);
        }
        return CommunityGroupMapper.toDto(group, owner, actor, members, attention(groupProfiles.profilesByGroup(actor.getUserId()).get(group.id())), storedGroupCounters(actor.getUserId()));
    }
    private Map<String, Integer> storedGroupCounters(String accountId) {
        var stored = summaries.findByUserId(accountId).map(com.raxim.myscoutee.domain.accounts.api.ProfileSummary::getMenuCounters).orElse(Map.of());
        var result = new LinkedHashMap<String, Integer>();
        for (String bucket : List.of("hosting", "participation", "pending", "invitations", "trash"))
            result.put("groups_" + bucket, stored.getOrDefault("groups_" + bucket, 0));
        return result;
    }
    private List<CommunityMember> members(String id) {
        return memberships.forGroup(id).stream()
                .filter(m -> Set.of("accepted", "pending").contains(m.getStatus())).toList();
    }
    private CommunityMember membership(String id, String userId) { return memberships.member(id, userId).orElse(null); }
    private boolean isAdmin(CommunityMember m) { return m != null && "accepted".equals(m.getStatus()) && "Admin".equals(m.getRole()); }
    public List<CommunityGroup> administeredGroups(DiscoveryProfile actor) {
        var ids = memberships.forAccount(actor.getUserId()).stream()
                .filter(this::isAdmin).map(CommunityMember::getOwnerId).distinct().toList();
        return ids.isEmpty() ? List.of() : groups.findByIdIn(ids);
    }
    public void requireAdmin(DiscoveryProfile actor, String id) {
        var group = groups.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (group.deleted() || group.awaitingOwner() || !isAdmin(membership(id, actor.getUserId()))) throw error(HttpStatus.FORBIDDEN);
    }
    private CommunityMember newMember(CommunityGroup group, String userId, String role, String status, String request, String inviter) {
        var m = new CommunityMember(); String now = Instant.now().toString();
        m.setId(OWNER_TYPE + ":" + group.id() + ":" + userId); m.setOwnerType(OWNER_TYPE); m.setOwnerId(group.id()); m.setUserId(userId);
        m.setRole(role); m.setStatus(status); m.setRequestKind(request); m.setPendingSource(request == null ? null : "invite".equals(request) ? "admin" : "member");
        m.setInvitedByUserId(inviter); m.setMetWhere(group.name()); m.setMetAtIso(now); m.setActionAtIso(now); m.setUpdatedDate(now); m.setCreatedDate(now);
        return m;
    }
    private ResponseStatusException error(HttpStatus status) { return new ResponseStatusException(status); }
}
