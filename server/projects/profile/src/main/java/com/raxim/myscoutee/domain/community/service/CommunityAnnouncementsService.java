package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.community.document.CommunityAnnouncement;
import com.raxim.myscoutee.domain.community.repository.CommunityAnnouncementsRepository;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.service.CommunityAccessService;
import com.raxim.myscoutee.domain.media.document.DocumentAttachment;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

import java.time.Instant;
import java.time.format.DateTimeFormatterBuilder;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.*;

import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import static com.raxim.myscoutee.domain.groups.service.CommunityAccessService.error;

@Service
public class CommunityAnnouncementsService {
    public static final String CLOSE_RULE = "community-voting-close";
    public static final List<String> CHOICES = List.of("yes", "no", "abstain");
    private final CommunityAnnouncementsRepository announcements;
    private final CommunityAccessService access;
    private final MongoTemplate mongo;
    private final UsersRepository users;
    private final NotificationOutboxService notifications;
    public CommunityAnnouncementsService(CommunityAnnouncementsRepository announcements,
            CommunityAccessService access, MongoTemplate mongo, UsersRepository users, NotificationOutboxService notifications) {
        this.announcements = announcements; this.access = access; this.mongo = mongo; this.users = users; this.notifications = notifications;
    }
    public String actor(String profileId) { return access.actor(profileId); }
    private CommunityAnnouncement visible(String actor, String id) {
        var a = announcements.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        access.requireMember(a.communityId(), actor);
        if (!"published".equals(a.status()) && !access.admin(a.communityId(), actor)) throw error(HttpStatus.NOT_FOUND);
        return a;
    }
    public Item detail(String actor, String id) { return dto(actor, visible(actor, id)); }
    public Page<Item> page(String actor, String communityId, String status, int size, String cursor, Boolean voting) {
        access.requireMember(communityId, actor);
        if (!Set.of("published", "draft", "trash").contains(status)) throw error(HttpStatus.BAD_REQUEST);
        boolean manager = access.admin(communityId, actor);
        if (!"published".equals(status) && !manager) throw error(HttpStatus.FORBIDDEN);
        int offset = CommunityCasesService.page(cursor), limit = Math.max(1, Math.min(50, size));
        var page = PageRequest.of(offset, limit, Sort.by(Sort.Order.desc("publishedAtIso"), Sort.Order.desc("createdAtIso"), Sort.Order.asc("id")));
        var rows = voting == null ? announcements.findByCommunityIdAndStatus(communityId, status, page)
                : announcements.findByCommunityIdAndStatusAndVoting(communityId, status, voting, page);
        long total = voting == null ? announcements.countByCommunityIdAndStatus(communityId, status)
                : announcements.countByCommunityIdAndStatusAndVoting(communityId, status, voting);
        var voters = eligibleVoters(communityId);
        return new Page<>(rows.stream().map(a -> dto(actor, a, manager, voters)).toList(), total, (long)(offset + 1) * limit < total ? "" + (offset + 1) : null);
    }
    public Item save(String actor, Save r) {
        access.requireAdmin(r.communityId(), actor);
        if (r.title() == null || r.title().isBlank() || r.title().trim().length() > 160 || r.body() == null || r.body().length() > 12000)
            throw error(HttpStatus.BAD_REQUEST);
        var old = r.id() == null ? null : visible(actor, r.id());
        if (old != null && (!old.communityId().equals(r.communityId()) || "trash".equals(old.status()))) throw error(HttpStatus.BAD_REQUEST);
        if (old != null && !Objects.equals(old.version(), r.version())) throw error(HttpStatus.CONFLICT);
        if (old != null && !old.ballots().isEmpty() && !r.voting()) throw error(HttpStatus.CONFLICT);
        String deadline = r.voting() ? iso(r.deadlineIso()) : null, now = iso(Instant.now().toString());
        var attachments = r.attachments() == null ? List.<com.raxim.myscoutee.domain.media.document.DocumentAttachment>of() : r.attachments();
        if (attachments.size() > 10) throw error(HttpStatus.BAD_REQUEST);
        for (var file : attachments) com.raxim.myscoutee.domain.media.service.DocumentAttachments.validate(file, List.of(r.userId(), actor), old == null ? List.of() : old.attachments());
        boolean reopened = old != null && "published".equals(old.status()) && r.voting() && deadline.compareTo(now) > 0
                && !Objects.equals(deadline, old.deadlineIso());
        var a = persist(new CommunityAnnouncement(old == null ? UUID.randomUUID().toString() : old.id(), r.communityId(), old == null ? actor : old.authorAccountId(),
                r.title().trim(), r.body().trim(), List.copyOf(attachments), old == null ? "draft" : old.status(), r.voting(), deadline,
                reopened || old == null ? null : old.closedAtIso(), reopened || old == null ? null : old.closureNotifiedAtIso(),
                old == null ? List.of() : old.ballots(), old == null ? null : old.publishedAtIso(),
                old == null ? now : old.createdAtIso(), now, old == null ? null : old.version()));
        if ("published".equals(a.status())) notifyMembers(a, actor, reopened ? "reopened" : "updated", "" + a.version(), false);
        return dto(actor, a);
    }
    public Item action(String actor, String id, Command r) {
        var a = visible(actor, id);
        if (!Objects.equals(a.version(), r.version())) throw error(HttpStatus.CONFLICT);
        if ("vote".equals(r.action())) return cast(actor, a, r);
        access.requireAdmin(a.communityId(), actor);
        if ("close".equals(r.action())) {
            if (!a.voting() || !"published".equals(a.status())) throw error(HttpStatus.BAD_REQUEST);
            var closed = close(a, Instant.now()); notifyClosure(closed, actor); return dto(actor, closed);
        }
        String status = switch (r.action()) {
            case "publish" -> "published"; case "unpublish", "restore" -> "draft"; case "trash" -> "trash";
            default -> throw error(HttpStatus.BAD_REQUEST);
        };
        String now = iso(Instant.now().toString());
        var saved = persist(new CommunityAnnouncement(a.id(), a.communityId(), a.authorAccountId(), a.title(), a.body(), a.attachments(), status,
                a.voting(), a.deadlineIso(), a.closedAtIso(), a.closureNotifiedAtIso(), a.ballots(),
                "published".equals(status) && a.publishedAtIso() == null ? now : a.publishedAtIso(), a.createdAtIso(), now, a.version()));
        if ("published".equals(status) || "published".equals(a.status())) notifyMembers(saved, actor, r.action(), "" + saved.version(), false);
        return dto(actor, saved);
    }
    private Item cast(String actor, CommunityAnnouncement a, Command r) {
        if (!"published".equals(a.status()) || !a.voting() || a.closedAtIso() != null || r.choice() == null || !CHOICES.contains(r.choice()) || a.ballots().stream().anyMatch(b -> b.voterAccountId().equals(actor))) throw error(HttpStatus.CONFLICT);
        var member = access.member(a.communityId(), actor);
        if (member == null || !Boolean.TRUE.equals(member.getVotingEligible())) throw error(HttpStatus.FORBIDDEN);
        String now = iso(Instant.now().toString());
        var ballot = new CommunityAnnouncement.Ballot(actor, r.choice(), now);
        var q = Query.query(Criteria.where("_id").is(a.id()).and("version").is(a.version()).and("status").is("published")
                .and("voting").is(true).and("closedAtIso").is(null).and("deadlineIso").gt(now).and("ballots.voterAccountId").ne(actor));
        var saved = mongo.findAndModify(q, new Update().push("ballots", ballot).inc("version", 1).set("updatedAtIso", now),
                FindAndModifyOptions.options().returnNew(true), CommunityAnnouncement.class);
        if (saved == null) throw error(HttpStatus.CONFLICT);
        notifyMembers(saved, actor, "voted", actor, true); return dto(actor, saved);
    }
    public int closeDue(Instant now) {
        if (!CommunityGroup.COMMUNITY_BASE_ID.equals(JobGroupContext.groupId())) return 0;
        int count = 0;
        var due = announcements.pendingClosure(iso(now.toString()), PageRequest.of(0, 100));
        for (var a : due) {
            var closed = a.closedAtIso() == null ? close(a, now) : a;
            notifyClosure(closed, CLOSE_RULE); count++;
        }
        return count;
    }
    private CommunityAnnouncement close(CommunityAnnouncement a, Instant instant) {
        if (a.closedAtIso() != null) return a;
        String now = iso(instant.toString());
        var closed = mongo.findAndModify(Query.query(Criteria.where("_id").is(a.id()).and("version").is(a.version()).and("status").is("published").and("closedAtIso").is(null)),
                new Update().set("closedAtIso", now).set("updatedAtIso", now).inc("version", 1), FindAndModifyOptions.options().returnNew(true), CommunityAnnouncement.class);
        if (closed == null) throw error(HttpStatus.CONFLICT); return closed;
    }
    private void notifyClosure(CommunityAnnouncement a, String actor) {
        if (a.closureNotifiedAtIso() != null) return;
        notifyMembers(a, actor, "closed", a.closedAtIso(), false);
        mongo.updateFirst(Query.query(Criteria.where("_id").is(a.id()).and("closedAtIso").is(a.closedAtIso())),
                new Update().set("closureNotifiedAtIso", iso(Instant.now().toString())), CommunityAnnouncement.class);
    }
    private void notifyMembers(CommunityAnnouncement a, String actor, String action, String occurrence, boolean adminsOnly) {
        var accounts = access.roster(a.communityId()).stream().filter(m -> !actor.equals(m.getUserId()) && (!adminsOnly || "Admin".equals(m.getRole())))
                .map(ActivityMember::getUserId).distinct().toList();
        var recipients = users.findByWorkspaceGroupIdAndAccountUserIdIn(a.communityId(), accounts).stream().map(Users::getUserId).toList();
        if (recipients.isEmpty()) return;
        String kind = "announcement-" + action;
        var payload = new LinkedHashMap<String, String>(); payload.put("workspaceGroupId", a.communityId()); payload.put("announcementId", a.id());
        payload.put("notification_message_key", "notification.kind." + kind + ".message");
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID, () -> notifications.enqueueOnce(kind + ":" + a.id() + ":" + occurrence,
                new NotificationOutboxService.NotificationIntent(kind, "announcement", a.id(), "community-members", recipients, a.title(), a.title(),
                        "/game?announcementId=" + a.id(), null, "/assets/logo/heart.webp", "announcement:" + a.id(), payload, actor)));
    }
    private Set<String> eligibleVoters(String group) {
        return access.roster(group).stream().filter(m -> Boolean.TRUE.equals(m.getVotingEligible()))
                .map(ActivityMember::getUserId).collect(Collectors.toSet());
    }
    private Item dto(String actor, CommunityAnnouncement a) {
        return dto(actor, a, access.admin(a.communityId(), actor), eligibleVoters(a.communityId()));
    }
    private Item dto(String actor, CommunityAnnouncement a, boolean manager, Set<String> voters) {
        var results = new LinkedHashMap<String, Integer>(); CHOICES.forEach(c -> results.put(c, 0));
        a.ballots().forEach(b -> results.merge(b.choice(), 1, Integer::sum));
        var own = a.ballots().stream().filter(b -> b.voterAccountId().equals(actor)).map(CommunityAnnouncement.Ballot::choice).findFirst().orElse(null);
        var electorate = new HashSet<>(voters); a.ballots().forEach(b -> electorate.add(b.voterAccountId()));
        boolean closed = a.closedAtIso() != null || a.voting() && !Instant.parse(a.deadlineIso()).isAfter(Instant.now());
        return new Item(a.id(), a.communityId(), a.authorAccountId(), a.title(), a.body(), a.attachments(), a.status(), a.voting(), a.deadlineIso(), closed,
                voters.contains(actor), own, results, electorate.size(), a.ballots().size(), manager,
                a.publishedAtIso(), a.createdAtIso(), a.updatedAtIso(), a.version());
    }
    private CommunityAnnouncement persist(CommunityAnnouncement a) {
        try { return announcements.save(a); } catch (org.springframework.dao.OptimisticLockingFailureException ex) { throw error(HttpStatus.CONFLICT); }
    }
    public static String iso(String value) {
        try { return new DateTimeFormatterBuilder().appendInstant(3).toFormatter().format(Instant.parse(value)); }
        catch (RuntimeException ex) { throw error(HttpStatus.BAD_REQUEST); }
    }

}
