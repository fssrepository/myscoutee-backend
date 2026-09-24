package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.*;
import com.raxim.myscoutee.profile.data.dto.groups.CommunityGroupDtos.*;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.*;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.*;
import com.raxim.myscoutee.profile.repository.*;
import com.raxim.myscoutee.profile.service.mapper.CommunityGroupMapper;

@Service
public class CommunityGroupsService {
    public static final String OWNER_TYPE = "community";
    private static final Set<String> CATEGORIES = Set.of("friends", "work", "sport", "learning", "hobbies", "neighbourhood");
    private static final Set<String> VISIBILITIES = Set.of("public", "private", "invitation");
    private static final Set<String> FIELDS = Set.of("profile.name", "profile.city", "profile.birthday", "profile.height",
            "profile.physique", "profile.languages", "profile.profession", "profile.experience.workplace", "profile.experience.school",
            "profile.horoscope", "profile.details.interest", "profile.details.drinking", "profile.details.smoking", "profile.details.workout", "profile.details.pets",
            "profile.details.familyPlans", "profile.details.children", "profile.details.loveStyle", "profile.details.communicationStyle",
            "profile.details.sexualOrientation", "profile.gender", "profile.details.religion", "profile.details.values");
    private final CommunityGroupsRepository groups;
    private final ActivityMembersRepository memberships;
    private final UsersRepository users;
    private final HomeUserProfileService profiles;
    private final CommunityGroupProfilesService groupProfiles;
    private final ContentModerationService moderation;
    private final UserReportSubmissionsRepository reports;
    private final AdminTelemetryService telemetry;
    public CommunityGroupsService(CommunityGroupsRepository groups, ActivityMembersRepository memberships,
            UsersRepository users, HomeUserProfileService profiles, CommunityGroupProfilesService groupProfiles,
            ContentModerationService moderation, UserReportSubmissionsRepository reports, AdminTelemetryService telemetry) {
        this.groups = groups; this.memberships = memberships; this.users = users; this.profiles = profiles; this.groupProfiles = groupProfiles;
        this.moderation = moderation; this.reports = reports; this.telemetry = telemetry;
    }
    public Users actor(String requestedId) {
        Users actor = profiles.resolveCurrentUser(requestedId);
        if (actor == null) throw error(HttpStatus.UNAUTHORIZED);
        if (actor.getAccountUserId() != null) return users.findByUserId(actor.getAccountUserId()).orElseThrow(() -> error(HttpStatus.UNAUTHORIZED));
        return actor;
    }
    public List<Workspace> workspaces(Users actor) {
        var memberships = this.memberships.findByOwnerTypeAndUserId(OWNER_TYPE, actor.getUserId()).stream()
                .filter(m -> "accepted".equals(m.getStatus())).collect(Collectors.toMap(ActivityMember::getOwnerId, m -> m));
        var profiles = groupProfiles.profilesByGroup(actor.getUserId());
        return groups.findByIdIn(memberships.keySet()).stream().filter(g -> g.policy().workspace() && profiles.containsKey(g.id()))
                .map(g -> new Workspace(g.id(), profiles.get(g.id()).getUserId(), g.name(), memberships.get(g.id()).getRole(),
                    com.raxim.myscoutee.profile.service.mapper.CommunityGroupProfileMapper.attention(profiles.get(g.id())), g.policy()))
                .sorted(Comparator.comparing(Workspace::name).thenComparing(Workspace::groupId)).toList();
    }
    public WorkspaceSelection select(Users actor, String id) {
        if (id == null || id.isBlank()) return new WorkspaceSelection(null, profiles.toUserDto(actor));
        var selected = groupProfiles.select(actor.getUserId(), id);
        var descriptor = workspaces(actor).stream().filter(w -> w.groupId().equals(id)).findFirst().orElseThrow(() -> error(HttpStatus.FORBIDDEN));
        return new WorkspaceSelection(descriptor, profiles.toUserDto(selected));
    }
    public Group detail(Users actor, String id) {
        var group = visible(actor, id);
        return dto(actor, group, members(id));
    }
    private Page snapshot(Users actor, String bucket, String category) {
        if (!Set.of("hosting", "participation", "explore").contains(bucket)) throw error(HttpStatus.BAD_REQUEST);
        var own = memberships.findByOwnerTypeAndUserId(OWNER_TYPE, actor.getUserId()).stream()
                .filter(m -> Set.of("accepted", "pending").contains(m.getStatus())).toList();
        var ownById = own.stream().collect(Collectors.toMap(ActivityMember::getOwnerId, m -> m));
        var records = bucket.equals("explore") ? groups.findDiscoverable(ownById.keySet())
                : groups.findByIdIn(own.stream().filter(m -> bucket.equals("hosting")
                    ? "accepted".equals(m.getStatus()) && "Admin".equals(m.getRole())
                    : !("accepted".equals(m.getStatus()) && "Admin".equals(m.getRole())))
                    .map(ActivityMember::getOwnerId).toList());
        var groupIds = records.stream().map(CommunityGroup::id).toList();
        var membersByGroup = memberships.findByOwnerTypeAndOwnerIdIn(OWNER_TYPE, groupIds).stream()
                .collect(Collectors.groupingBy(ActivityMember::getOwnerId));
        var owners = users.findByUserIdIn(records.stream().map(CommunityGroup::ownerUserId).distinct().toList()).stream()
                .collect(Collectors.toMap(Users::getUserId, u -> u));
        var profileByGroup = groupProfiles.profilesByGroup(actor.getUserId());
        var rows = records.stream().filter(g -> !bucket.equals("explore") || g.moderationVisible() || isAdmin(ownById.get(g.id())))
                .filter(g -> category == null || category.isBlank() || category.equals(g.category()))
                .filter(g -> owners.containsKey(g.ownerUserId()))
                .map(g -> CommunityGroupMapper.toDto(g, owners.get(g.ownerUserId()), actor,
                        membersByGroup.getOrDefault(g.id(), List.of()), com.raxim.myscoutee.profile.service.mapper.CommunityGroupProfileMapper.attention(profileByGroup.get(g.id()))))
                .sorted(Comparator.comparingDouble((Group g) -> g.distanceKm() == null ? Double.MAX_VALUE : Math.ceil(g.distanceKm() / 5))
                        .thenComparing(Group::createdAtIso, Comparator.reverseOrder()).thenComparing(Group::id)).toList();
        return new Page(rows, rows.size(), null,
                Map.of("hosting", own.stream().filter(this::isAdmin).mapToLong(m -> com.raxim.myscoutee.profile.service.mapper.CommunityGroupProfileMapper.attention(profileByGroup.get(m.getOwnerId()))).sum(),
                    "participation", own.stream().filter(m -> !isAdmin(m)).mapToLong(m -> com.raxim.myscoutee.profile.service.mapper.CommunityGroupProfileMapper.attention(profileByGroup.get(m.getOwnerId()))).sum()));
    }
    public Page page(Users actor, String bucket, String category, int pageSize, String cursor) {
        var snapshot = snapshot(actor, bucket, category);
        int offset = 0;
        try { if (cursor != null && !cursor.isBlank()) offset = Integer.parseInt(cursor); }
        catch (NumberFormatException ex) { throw error(HttpStatus.BAD_REQUEST); }
        if (offset < 0) throw error(HttpStatus.BAD_REQUEST);
        var result = snapshot.items().stream().skip(offset).limit(Math.max(1, Math.min(pageSize, 50))).toList();
        return new Page(result, snapshot.total(), offset + result.size() < snapshot.total() ? "" + (offset + result.size()) : null, snapshot.context());
    }
    public SyncResponse sync(Users actor, SyncRequest request) {
        if (request.knownItems() == null || request.knownItems().size() > 500) throw error(HttpStatus.BAD_REQUEST);
        var snapshot = snapshot(actor, request.bucket(), request.category());
        var known = request.knownItems().stream().collect(Collectors.toMap(KnownGroup::id, KnownGroup::revision, (a,b) -> b));
        var byId = snapshot.items().stream().collect(Collectors.toMap(Group::id, g -> g));
        int tailIndex = -1;
        for (int i = 0; i < snapshot.items().size(); i++) if (snapshot.items().get(i).id().equals(request.tailId())) { tailIndex = i; break; }
        int window = tailIndex < 0 ? Math.min(500, known.size() + Math.max(1, Math.min(request.limit(), 50))) : tailIndex + 1;
        var upserts = new LinkedHashMap<String, Group>();
        snapshot.items().stream().limit(window).filter(g -> !g.revision().equals(known.get(g.id()))).forEach(g -> upserts.put(g.id(), g));
        known.forEach((id, revision) -> { var g = byId.get(id); if (g != null && !g.revision().equals(revision)) upserts.put(id, g); });
        return new SyncResponse(List.copyOf(upserts.values()), known.keySet().stream().filter(id -> !byId.containsKey(id)).toList(), snapshot.total());
    }
    public Group save(Users actor, Save request) {
        if (request == null || request.name() == null || request.name().isBlank() || request.name().codePointCount(0, request.name().length()) > 20
                || request.description() != null && request.description().length() > 4000
                || !CATEGORIES.contains(request.category()) || !VISIBILITIES.contains(request.visibility())) throw error(HttpStatus.BAD_REQUEST);
        var policy = request.policy();
        if (policy == null || policy.requiredFields() == null || !FIELDS.containsAll(policy.requiredFields())) throw error(HttpStatus.BAD_REQUEST);
        var existing = request.id() == null || request.id().isBlank() ? null : visible(actor, request.id());
        if (existing != null) requireAdmin(actor, existing.id());
        if (existing != null && !Objects.equals(existing.version(), request.version())) throw error(HttpStatus.CONFLICT);
        String now = Instant.now().toString();
        String id = existing == null ? UUID.randomUUID().toString() : existing.id();
        var group = new CommunityGroup(id, existing == null ? actor.getUserId() : existing.ownerUserId(), request.name().trim(),
                request.description() == null ? "" : request.description().trim(), request.imageUrl(), request.category(),
                request.visibility(), request.hideMembers(), new CommunityGroup.Policy(policy.workspace(), policy.enabled(),
                    policy.requiredFields().stream().distinct().toList()), existing == null ? now : existing.createdAtIso(), now,
                    existing == null ? null : existing.version(), existing == null ? null : existing.moderationStatus(),
                    existing == null ? null : existing.moderationVersion());
        group = groups.save(group);
        if (existing == null) memberships.save(newMember(group, actor.getUserId(), "Admin", "accepted", null, actor.getUserId()));
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
    public void report(Users actor, Report request) {
        var group = visible(actor, request.groupId());
        String details = request.details() == null ? "" : request.details().trim();
        if (group.ownerUserId().equals(actor.getUserId())) throw error(HttpStatus.FORBIDDEN);
        if (details.length() < 12 || details.length() > 2000) throw error(HttpStatus.BAD_REQUEST);
        String key = "community:" + UUID.nameUUIDFromBytes((actor.getUserId() + "\n" + group.id() + "\n" + details)
                .getBytes(java.nio.charset.StandardCharsets.UTF_8));
        if (reports.findBySyncKey(key).isPresent()) return;
        var report = new UserReportSubmission();
        String now = Instant.now().toString();
        report.setId(UUID.randomUUID().toString()); report.setSyncKey(key); report.setUserId(actor.getUserId());
        report.setTargetUserId(group.ownerUserId()); report.setHandle(group.name());
        report.setReason("groups.report"); report.setDetails(details);
        report.setSourceType("community"); report.setSourceId(group.id()); report.setSourceText(group.name());
        report.setCreatedDate(now); report.setUpdatedDate(now); report.setCreatedUser(actor.getUserId()); report.setUpdatedUser(actor.getUserId());
        try { reports.save(report); }
        catch (org.springframework.dao.DuplicateKeyException duplicate) { return; }
        telemetry.record("report.submitted", "moderation", report.getId(), actor.getUserId());
    }
    public Group join(Users actor, String id) {
        var group = visible(actor, id);
        if (!group.moderationVisible()) throw error(HttpStatus.FORBIDDEN);
        var old = membership(id, actor.getUserId());
        if (old != null && Set.of("accepted", "pending").contains(old.getStatus())) return dto(actor, group, members(id));
        if ("invitation".equals(group.visibility())) throw error(HttpStatus.FORBIDDEN);
        // Admission always goes through an administrator; pending users have no group profile.
        memberships.save(newMember(group, actor.getUserId(), "Member", "pending", "join", null));
        return dto(actor, group, members(id));
    }
    public List<ActivityMemberEntryDto> roster(Users actor, String id, boolean pendingOnly) {
        var group = visible(actor, id);
        var own = membership(id, actor.getUserId());
        boolean admin = isAdmin(own);
        var rows = members(id).stream().filter(m -> !pendingOnly || "pending".equals(m.getStatus()))
                .filter(m -> admin || "accepted".equals(m.getStatus()) || actor.getUserId().equals(m.getUserId()))
                .filter(m -> admin || !group.hideMembers() || "Admin".equals(m.getRole()) || actor.getUserId().equals(m.getUserId())).toList();
        var people = users.findByUserIdIn(rows.stream().map(ActivityMember::getUserId).toList()).stream()
                .collect(Collectors.toMap(Users::getUserId, u -> u));
        return rows.stream().filter(m -> people.containsKey(m.getUserId()))
                .map(m -> CommunityGroupMapper.member(m, people.get(m.getUserId()), actor.getUserId())).toList();
    }
    public ActivityMembersSummaryDto summary(Users actor, String id) {
        var group = detail(actor, id);
        var rows = roster(actor, id, false);
        return new ActivityMembersSummaryDto(OWNER_TYPE, id, group.acceptedMembers(), group.pendingMembers(), group.acceptedMembers(),
                rows.stream().filter(m -> "accepted".equals(m.status())).map(ActivityMemberEntryDto::userId).toList(),
                rows.stream().filter(m -> "pending".equals(m.status())).map(ActivityMemberEntryDto::userId).toList());
    }
    public ActivityMembersSyncResponseDto sync(Users actor, ActivityMembersSyncRequestDto request) {
        var rows = roster(actor, request.owner().ownerId(), false);
        var known = request.knownItems() == null ? List.<ActivityMemberSyncKnownItemDto>of() : request.knownItems();
        var revisions = known.stream().collect(Collectors.toMap(ActivityMemberSyncKnownItemDto::id, k -> Objects.toString(k.revision(), ""), (a,b) -> b));
        var ids = rows.stream().map(ActivityMemberEntryDto::id).collect(Collectors.toSet());
        return new ActivityMembersSyncResponseDto(rows.stream().filter(m -> !Objects.equals(m.revision(), revisions.get(m.id()))).toList(),
                known.stream().map(ActivityMemberSyncKnownItemDto::id).filter(id -> !ids.contains(id)).toList(), rows.size());
    }
    public ActivityMembersInviteResponseDto invite(Users actor, String id, List<String> userIds) {
        var group = visible(actor, id); requireAdmin(actor, id);
        if (userIds == null || userIds.size() > 200) throw error(HttpStatus.BAD_REQUEST);
        var candidates = users.findByUserIdIn(userIds).stream().filter(u -> u.getWorkspaceGroupId() == null).map(Users::getUserId).collect(Collectors.toSet());
        var existing = members(id).stream().filter(m -> Set.of("accepted", "pending").contains(m.getStatus()))
                .map(ActivityMember::getUserId).collect(Collectors.toSet());
        var invited = userIds.stream().distinct().filter(candidates::contains).filter(uid -> !existing.contains(uid)).toList();
        memberships.saveAll(invited.stream().map(uid -> newMember(group, uid, "Member", "pending", "invite", actor.getUserId())).toList());
        return new ActivityMembersInviteResponseDto(roster(actor, id, false), invited, List.of(), dto(actor, group, members(id)));
    }
    public ActivityMemberActionResponseDto action(Users actor, ActivityMemberActionRequestDto request) {
        String id = request.owner().ownerId(); var group = visible(actor, id);
        var target = membership(id, request.targetUserId());
        if (target == null) throw error(HttpStatus.NOT_FOUND);
        boolean self = actor.getUserId().equals(target.getUserId());
        boolean admin = isAdmin(membership(id, actor.getUserId()));
        boolean owner = group.ownerUserId().equals(target.getUserId());
        switch (request.action()) {
            case "accept" -> {
                if (!"pending".equals(target.getStatus()) || !("invite".equals(target.getRequestKind()) ? self : admin && !self)) throw error(HttpStatus.FORBIDDEN);
                groupProfiles.admit(group, target.getUserId());
                target.setStatus("accepted"); target.setRequestKind(null); target.setPendingSource(null);
            }
            case "remove" -> {
                if (owner || !(self || admin)) throw error(HttpStatus.FORBIDDEN);
                target.setStatus("deleted");
            }
            case "promote-admin" -> {
                if (!admin || !"accepted".equals(target.getStatus())) throw error(HttpStatus.FORBIDDEN);
                target.setRole("Admin");
            }
            case "step-down-admin" -> {
                if (owner || !self || !isAdmin(target)) throw error(HttpStatus.FORBIDDEN);
                target.setRole("Member"); target.setOrganizerOnly(false);
            }
            case "set-organizer-only", "set-participant" -> {
                if (!self || !isAdmin(target)) throw error(HttpStatus.FORBIDDEN);
                target.setOrganizerOnly("set-organizer-only".equals(request.action()));
            }
            default -> throw error(HttpStatus.BAD_REQUEST);
        }
        target.setUpdatedDate(Instant.now().toString()); target.setActionAtIso(target.getUpdatedDate());
        memberships.save(target);
        return new ActivityMemberActionResponseDto(self && "deleted".equals(target.getStatus()) ? List.of() : roster(actor, id, false), null, dto(actor, group, members(id)));
    }
    private CommunityGroup visible(Users actor, String id) {
        var group = groups.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        var own = membership(id, actor.getUserId());
        if ("invitation".equals(group.visibility()) && (own == null || !Set.of("pending", "accepted").contains(own.getStatus()))) throw error(HttpStatus.NOT_FOUND);
        return group;
    }
    private Group dto(Users actor, CommunityGroup group, List<ActivityMember> members) {
        var owner = users.findByUserId(group.ownerUserId()).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        return CommunityGroupMapper.toDto(group, owner, actor, members, com.raxim.myscoutee.profile.service.mapper.CommunityGroupProfileMapper.attention(groupProfiles.profilesByGroup(actor.getUserId()).get(group.id())));
    }
    private List<ActivityMember> members(String id) {
        return memberships.findByOwnerTypeAndOwnerId(OWNER_TYPE, id).stream()
                .filter(m -> Set.of("accepted", "pending").contains(m.getStatus())).toList();
    }
    private ActivityMember membership(String id, String userId) { return memberships.findByOwnerTypeAndOwnerIdAndUserId(OWNER_TYPE, id, userId).orElse(null); }
    private boolean isAdmin(ActivityMember m) { return m != null && "accepted".equals(m.getStatus()) && "Admin".equals(m.getRole()); }
    public void requireAdmin(Users actor, String id) { if (!isAdmin(membership(id, actor.getUserId()))) throw error(HttpStatus.FORBIDDEN); }
    private ActivityMember newMember(CommunityGroup group, String userId, String role, String status, String request, String inviter) {
        var m = new ActivityMember(); String now = Instant.now().toString();
        m.setId(OWNER_TYPE + ":" + group.id() + ":" + userId); m.setOwnerType(OWNER_TYPE); m.setOwnerId(group.id()); m.setUserId(userId);
        m.setRole(role); m.setStatus(status); m.setRequestKind(request); m.setPendingSource(request == null ? null : "invite".equals(request) ? "admin" : "member");
        m.setInvitedByUserId(inviter); m.setMetWhere(group.name()); m.setMetAtIso(now); m.setActionAtIso(now); m.setUpdatedDate(now); m.setCreatedDate(now);
        return m;
    }
    private ResponseStatusException error(HttpStatus status) { return new ResponseStatusException(status); }
}
