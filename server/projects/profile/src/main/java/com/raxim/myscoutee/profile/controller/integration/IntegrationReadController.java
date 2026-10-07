package com.raxim.myscoutee.profile.controller.integration;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.service.*;
import com.raxim.myscoutee.profile.service.notifications.UserNotificationService;

/** Read/Full-pack reads. Actor identity never comes from query parameters or model arguments. */
@RestController
@RequestMapping("/integrations/v1")
public class IntegrationReadController {
    private final IntegrationCapabilitiesService access;
    private final ActivitiesEventsService events;
    private final CommunityGroupsService groups;
    private final ChatService chats;
    private final UserNotificationService notifications;
    private final UserRatesService ratings;
    private final AssetsService assets;
    private final CampaignsService campaigns;
    private final ServiceOfferingsService services;
    private final CommunityCasesService cases;
    private final CommunityAnnouncementsService announcements;
    private final CommunityScheduledTasksService tasks;
    public IntegrationReadController(IntegrationCapabilitiesService access, ActivitiesEventsService events, CommunityGroupsService groups, ChatService chats, UserNotificationService notifications, UserRatesService ratings, AssetsService assets, CampaignsService campaigns, ServiceOfferingsService services, CommunityCasesService cases, CommunityAnnouncementsService announcements, CommunityScheduledTasksService tasks) {
        this.access = access;
        this.events = events;
        this.groups = groups;
        this.chats = chats;
        this.notifications = notifications;
        this.ratings = ratings;
        this.assets = assets;
        this.campaigns = campaigns;
        this.services = services;
        this.cases = cases;
        this.announcements = announcements;
        this.tasks = tasks;
    }

    @GetMapping("/events")
    public Object listEvents(Authentication authentication, @RequestParam(defaultValue = "events") String bucket, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, null);
        pageLimit(limit);
        return switch (bucket) { case "events" -> events.queryItemsByUserPage(actor, limit, cursor); case "hosting" -> events.queryHostingPage(actor, limit, cursor); case "attending" -> events.queryAttendingPage(actor, limit, cursor); case "invitations" -> events.queryInvitationsPage(actor, limit, cursor); case "trash" -> events.queryTrashPage(actor, limit, cursor); default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST); };
    }

    @GetMapping("/events/{id}/details")
    public Object eventDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, null);
        return found(events.loadEventDetailById(actor, id));
    }

    @GetMapping("/groups")
    public Object listGroups(Authentication authentication, @RequestParam(defaultValue = "explore") String bucket, @RequestParam(required = false) String category, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, null);
        pageLimit(limit);
        return groups.page(groups.actor(actor), bucket, category, limit, cursor, null);
    }

    @GetMapping("/groups/{id}")
    public Object groupDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, null);
        return groups.detail(groups.actor(actor), id);
    }

    @GetMapping("/chats")
    public Object listChats(Authentication authentication, @RequestParam(required = false) String context, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, null);
        pageLimit(limit);
        return chats.queryChatPage(actor, context, "recent", null, null, cursor, limit, null, null, false, null);
    }

    @GetMapping("/chats/{id}")
    public Object chatDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, null);
        return found(chats.queryChatById(id, actor));
    }

    @GetMapping("/chats/{id}/messages")
    public Object chatMessages(Authentication authentication, @PathVariable String id, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, null);
        pageLimit(limit);
        return chats.queryMessagesPage(id, actor, limit, cursor, null, false);
    }

    @GetMapping("/notifications")
    public Object listNotifications(Authentication authentication, @RequestParam(required = false) String bucket, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, null);
        pageLimit(limit);
        return notifications.queryPage(actor, bucket, limit, cursor, null);
    }

    @GetMapping("/ratings")
    public Object listRatings(Authentication authentication, @RequestParam(defaultValue = "single") String mode, @RequestParam(defaultValue = "given") String direction, @RequestParam(required = false) String campaignId, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, null);
        pageLimit(limit);
        return ratings.queryActivityRatePage(actor, mode, direction, "recent", null, null, false, cursor, limit, null, null, campaignId);
    }

    @GetMapping("/assets")
    public Object listAssets(Authentication authentication, @RequestParam(defaultValue = "Transport") String type, @RequestParam(required = false) String category, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, null);
        pageLimit(limit);
        return assets.queryVisibleAssetsPage(actor, type, category, null, null, 0, limit, cursor, null);
    }

    @GetMapping("/assets/{id}")
    public Object assetDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, null);
        return found(assets.queryAssetDetail(actor, id));
    }

    @GetMapping("/campaigns")
    public Object listCampaigns(Authentication authentication, @RequestParam(defaultValue = "own") String scope, @RequestParam(defaultValue = "published") String status, @RequestParam(required = false) String kind, @RequestParam(required = false) String category, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, "work");
        pageLimit(limit);
        return campaigns.page(campaigns.actor(actor), scope, status, null, kind, category, "updated", limit, cursor);
    }

    @GetMapping("/campaigns/{id}")
    public Object campaignDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, "work");
        return campaigns.detail(campaigns.actor(actor), id);
    }

    @GetMapping("/campaign-history/{id}")
    public Object campaignHistory(Authentication authentication, @PathVariable String id, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, "work");
        pageLimit(limit);
        return campaigns.history(campaigns.actor(actor), id, limit, cursor);
    }

    @GetMapping("/services")
    public Object listServices(Authentication authentication, @RequestParam(defaultValue = "own") String scope, @RequestParam(defaultValue = "published") String status, @RequestParam(required = false) String category, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, "community");
        pageLimit(limit);
        return services.page(services.actor(actor), scope, status, category, null, null, limit, cursor);
    }

    @GetMapping("/services/{id}")
    public Object serviceDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, "community");
        return services.detail(services.actor(actor), id);
    }

    @GetMapping("/cases")
    public Object listCases(Authentication authentication, @RequestParam(defaultValue = "active") String status, @RequestParam(required = false) String caseType, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, "community");
        pageLimit(limit);
        return cases.page(cases.actor(actor), status, caseType, limit, cursor);
    }

    @GetMapping("/cases/{id}")
    public Object caseDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, "community");
        return cases.detail(cases.actor(actor), id);
    }

    @GetMapping("/announcements")
    public Object listAnnouncements(Authentication authentication, @RequestParam String communityId, @RequestParam(defaultValue = "published") String status, @RequestParam(required = false) Boolean voting, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, "community");
        pageLimit(limit);
        return announcements.page(announcements.actor(actor), communityId, status, limit, cursor, voting);
    }

    @GetMapping("/announcements/{id}")
    public Object announcementDetails(Authentication authentication, @PathVariable String id) {
        String actor = access.requireRead(authentication, "community");
        return announcements.detail(announcements.actor(actor), id);
    }

    @GetMapping("/scheduled-tasks")
    public Object listScheduledTasks(Authentication authentication, @RequestParam(defaultValue = "active") String status, @RequestParam(defaultValue = "20") int limit, @RequestParam(required = false) String cursor) {
        String actor = access.requireRead(authentication, "community");
        pageLimit(limit);
        return tasks.page(tasks.actor(actor), limit, cursor, status);
    }

    private static void pageLimit(int limit) {
        if (limit < 1 || limit > 100) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "limit must be between 1 and 100.");
    }
    private static <T> T found(T value) {
        if (value == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return value;
    }
}
