package com.raxim.myscoutee.domain.campaigns.service;

import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.campaigns.repository.CampaignsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.groups.service.CommunityGroupProfilesService;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.*;

import com.raxim.myscoutee.domain.campaigns.mapper.CampaignMapper;

@Service
public class CampaignsService {
    private final UserRatesRepository rates;
    private final ChatsRepository chats;
    private final CampaignsRepository campaigns;
    private final UsersRepository users;
    private final CommunityGroupsRepository groups;
    private final CommunityGroupProfilesService workspaces;
    private final HomeUserProfileService profiles;
    public CampaignsService(UserRatesRepository rates, ChatsRepository chats, CampaignsRepository campaigns, UsersRepository users, CommunityGroupsRepository groups,
            CommunityGroupProfilesService workspaces, HomeUserProfileService profiles) {
        this.rates = rates; this.chats = chats; this.campaigns = campaigns; this.users = users; this.groups = groups; this.workspaces = workspaces; this.profiles = profiles;
    }
    public Users actor(String requestedId) {
        var actor = profiles.resolveCurrentUser(requestedId);
        if (actor == null) throw error(HttpStatus.UNAUTHORIZED);
        var group = actor.getWorkspaceGroupId() == null ? null : groups.findById(actor.getWorkspaceGroupId()).orElse(null);
        if (group == null || !"work".equals(group.effectiveType()) || actor.getAccountUserId() == null) throw error(HttpStatus.FORBIDDEN);
        return workspaces.select(actor.getAccountUserId(), group.id());
    }
    public Campaign visible(Users actor, String id) {
        var c = campaigns.findById(id).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (!Objects.equals(c.workspaceGroupId(), actor.getWorkspaceGroupId())
            || (!c.ownerUserId().equals(actor.getUserId()) && !"published".equals(c.status()))) throw error(HttpStatus.NOT_FOUND);
        return c;
    }
    private Item dto(Users actor, Campaign c) {
        var owner = users.findByUserId(c.ownerUserId()).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (!Objects.equals(owner.getWorkspaceGroupId(), actor.getWorkspaceGroupId()) || !visibleOwner(owner, actor)) throw error(HttpStatus.NOT_FOUND);
        var rating = c.ownerUserId().equals(actor.getUserId()) ? null
            : viewerRatings(actor, rates.findRelevantInCampaign(actor.getUserId(), c.id())).get(c.id());
        return ratedDto(c, owner, actor, rating);
    }
    public Item detail(Users actor, String id) { return dto(actor, visible(actor, id)); }
    public HistoryPage history(Users actor, String targetUserId, int pageSize, String cursor) {
        var target = users.findByUserId(targetUserId).orElseThrow(() -> error(HttpStatus.NOT_FOUND));
        if (!Objects.equals(actor.getWorkspaceGroupId(), target.getWorkspaceGroupId()) || !visibleOwner(target, actor)) throw error(HttpStatus.NOT_FOUND);
        int offset;
        try { offset = cursor == null || cursor.isBlank() ? 0 : Integer.parseInt(cursor); }
        catch (NumberFormatException ex) { throw error(HttpStatus.BAD_REQUEST); }
        if (offset < 0) throw error(HttpStatus.BAD_REQUEST);
        var dates = new HashMap<String, Instant>();
        var evidence = rates.findEvidenceForPair(actor.getUserId(), targetUserId);
        var viewerRatings = viewerRatings(actor, evidence);
        for (var rate : evidence) {
            if (!"single".equals(rate.getMode())) continue;
            rememberInteraction(dates, rate.getCampaignId(), rate.getUpdatedDate() == null || rate.getUpdatedDate().isBlank() ? rate.getCreatedDate() : rate.getUpdatedDate());
        }
        for (var chat : chats.findByOwnerUserIdAndChannelTypeAndMemberIdsContaining(actor.getUserId(), "campaign", targetUserId)) {
            if (chat.getMemberIds().contains(actor.getUserId())) rememberInteraction(dates, chat.getOwnerId(), chat.getDateIso());
        }
        // Fetch campaign records once, then preserve the ordinary detail visibility rules before paging.
        var rows = new ArrayList<HistoryItem>();
        for (var campaign : campaigns.findAllById(dates.keySet())) {
            boolean own = campaign.ownerUserId().equals(actor.getUserId());
            if (!Objects.equals(campaign.workspaceGroupId(), actor.getWorkspaceGroupId())
                || (!own && (!campaign.ownerUserId().equals(targetUserId) || !"published".equals(campaign.status())))) continue;
            rows.add(new HistoryItem(ratedDto(campaign, own ? actor : target, actor, viewerRatings.get(campaign.id())), dates.get(campaign.id()).toString()));
        }
        rows.sort(Comparator.<HistoryItem, Instant>comparing(row -> dates.get(row.campaign().id())).reversed()
            .thenComparing(row -> row.campaign().id()));
        int start = Math.min(offset, rows.size()); int end = Math.min(start + Math.min(50, Math.max(1, pageSize)), rows.size());
        return new HistoryPage(rows.subList(start, end), rows.size(), end < rows.size() ? Integer.toString(end) : null);
    }
    private static void rememberInteraction(Map<String, Instant> dates, String campaignId, String date) {
        if (campaignId == null || campaignId.isBlank() || date == null) return;
        try { dates.merge(campaignId, Instant.parse(date), (a, b) -> a.isAfter(b) ? a : b); }
        catch (java.time.format.DateTimeParseException ignored) { /* Undated evidence cannot supply a history date. */ }
    }
    public Page page(Users actor, String scope, String status, String search, String kind, String category,
            String sort, int pageSize, String cursor) {
        boolean own = "own".equals(scope);
        String selectedStatus = own ? status : "published";
        var records = own ? campaigns.findByWorkspaceGroupIdAndOwnerUserIdAndStatus(actor.getWorkspaceGroupId(), actor.getUserId(), selectedStatus)
            : campaigns.findByWorkspaceGroupIdAndStatus(actor.getWorkspaceGroupId(), selectedStatus);
        String needle = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);
        records = records.stream().filter(c -> !"discover".equals(scope) || !c.ownerUserId().equals(actor.getUserId()))
            .filter(c -> kind == null || kind.isBlank() || "both".equals(kind) || kind.equals(c.kind()) || "both".equals(c.kind()))
            .filter(c -> category == null || category.isBlank() || category.equals(c.category()))
            .filter(c -> needle.isBlank() || (c.title() + "\n" + c.description()).toLowerCase(Locale.ROOT).contains(needle)).toList();
        var owners = users.findByUserIdIn(records.stream().map(Campaign::ownerUserId).collect(Collectors.toSet())).stream()
            .filter(u -> Objects.equals(u.getWorkspaceGroupId(), actor.getWorkspaceGroupId()) && visibleOwner(u, actor))
            .collect(Collectors.toMap(Users::getUserId, u -> u));
        Comparator<Item> order = "distance".equals(sort)
            ? Comparator.comparing(Item::distanceKm, Comparator.nullsLast(Comparator.naturalOrder()))
            : Comparator.comparing(Item::updatedAtIso).reversed();
        var viewerRatings = viewerRatings(actor, rates.findByOwnerUserId(actor.getUserId()));
        var rows = records.stream().filter(c -> owners.containsKey(c.ownerUserId()))
            .map(c -> ratedDto(c, owners.get(c.ownerUserId()), actor, viewerRatings.get(c.id())))
            .sorted(order.thenComparing(Item::id)).toList();
        int offset;
        try { offset = cursor == null || cursor.isBlank() ? 0 : Integer.parseInt(cursor); }
        catch (NumberFormatException ex) { throw error(HttpStatus.BAD_REQUEST); }
        if (offset < 0) throw error(HttpStatus.BAD_REQUEST);
        int limit = Math.min(50, Math.max(1, pageSize));
        int start = Math.min(offset, rows.size()); int end = Math.min(start + limit, rows.size());
        return new Page(rows.subList(start, end), rows.size(), end < rows.size() ? Integer.toString(end) : null);
    }
    private static Map<String, UserRate> viewerRatings(Users actor, Collection<UserRate> evidence) {
        return evidence.stream()
            .filter(r -> actor.getUserId().equals(r.getOwnerUserId()) && "single".equals(r.getMode())
                && r.getCampaignId() != null && r.getScoreGiven() != null)
            .collect(Collectors.toMap(UserRate::getCampaignId, r -> r, (a, b) ->
                Objects.toString(a.getUpdatedDate(), "").compareTo(Objects.toString(b.getUpdatedDate(), "")) >= 0 ? a : b));
    }
    private static Item ratedDto(Campaign campaign, Users owner, Users actor, UserRate rating) {
        return CampaignMapper.toDto(campaign, owner, actor, rating == null ? 0d : rating.getScoreGiven(),
            rating == null || rating.getRatingSnapshots() == null ? null : rating.getRatingSnapshots().get(actor.getUserId()));
    }
    public Item save(Users actor, Save request) {
        validate(request);
        Campaign old = request.id() == null ? null : visible(actor, request.id());
        if (old != null) {
            if (!old.ownerUserId().equals(actor.getUserId()) || "trash".equals(old.status())) throw error(HttpStatus.FORBIDDEN);
            if (!Objects.equals(old.version(), request.version())) throw error(HttpStatus.CONFLICT);
        }
        return saveRecord(actor, request, old, old == null ? UUID.randomUUID().toString() : old.id());
    }
    /** Integration imports allocate a stable ID before creation so retries cannot create a second campaign. */
    public Item createImported(Users actor, Save request, String allocatedId) {
        validate(request);
        return saveRecord(actor, request, null, allocatedId);
    }
    private Item saveRecord(Users actor, Save request, Campaign old, String id) {
        if (request.imageUrls().stream().anyMatch(url -> !com.raxim.myscoutee.domain.media.api.MediaAccessPaths.ownedImageReference(url, actor.getUserId()))) throw error(HttpStatus.BAD_REQUEST);
        var attachments = request.attachments() == null ? List.<com.raxim.myscoutee.domain.media.dto.DocumentAttachment>of() : request.attachments();
        if (attachments.size() > 10) throw error(HttpStatus.BAD_REQUEST);
        for (var file : attachments) com.raxim.myscoutee.domain.media.api.DocumentAttachments.validate(file, List.of(actor.getUserId()), old == null ? List.of() : old.attachments());
        String now = Instant.now().toString();
        return dto(actor, persist(new Campaign(id, actor.getWorkspaceGroupId(), actor.getUserId(),
            request.title().trim(), request.description().trim(), request.kind(), request.category(), List.copyOf(request.imageUrls()), List.copyOf(attachments),
            old == null ? "draft" : old.status(),
            old == null ? now : old.createdAtIso(), now, old == null ? null : old.version())));
    }
    public Item action(Users actor, String id, Command request) {
        var c = visible(actor, id);
        if (!c.ownerUserId().equals(actor.getUserId())) throw error(HttpStatus.FORBIDDEN);
        if (!Objects.equals(c.version(), request.version())) throw error(HttpStatus.CONFLICT);
        String status = switch (request.action() == null ? "" : request.action()) {
            case "publish" -> "draft".equals(c.status()) ? "published" : null;
            case "unpublish" -> "published".equals(c.status()) ? "draft" : null;
            case "trash" -> !"trash".equals(c.status()) ? "trash" : null;
            case "restore" -> "trash".equals(c.status()) ? "draft" : null;
            default -> null;
        };
        if (status == null) throw error(HttpStatus.BAD_REQUEST);
        return dto(actor, persist(new Campaign(c.id(), c.workspaceGroupId(), c.ownerUserId(), c.title(), c.description(), c.kind(), c.category(),
            c.imageUrls(), c.attachments(), status, c.createdAtIso(), Instant.now().toString(), c.version())));
    }
    private boolean visibleOwner(Users owner, Users actor) {
        return owner.getUserId().equals(actor.getUserId()) || !Set.of("inactive", "blocked", "deleted").contains(
                owner.getProfileStatus() == null ? "" : owner.getProfileStatus());
    }
    private Campaign persist(Campaign campaign) {
        try { return campaigns.save(campaign); }
        catch (org.springframework.dao.OptimisticLockingFailureException ex) { throw error(HttpStatus.CONFLICT); }
    }
    private void validate(Save r) {
        if (r.title() == null || r.title().isBlank() || r.title().trim().length() > 120 || r.description() == null || r.description().length() > 4000
            || r.kind() == null || !Set.of("work", "business", "both").contains(r.kind())
            || r.category() == null || !Set.of("technology", "creative", "services", "education", "community", "other").contains(r.category())
            || r.imageUrls() == null || r.imageUrls().size() > 4 || r.imageUrls().stream().anyMatch(Objects::isNull)) throw error(HttpStatus.BAD_REQUEST);
    }
    private static ResponseStatusException error(HttpStatus status) { return new ResponseStatusException(status); }
}
