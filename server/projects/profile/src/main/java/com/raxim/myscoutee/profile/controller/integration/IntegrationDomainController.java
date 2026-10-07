package com.raxim.myscoutee.profile.controller.integration;

import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.service.*;
import com.raxim.myscoutee.profile.data.dto.campaigns.CampaignDtos;
import com.raxim.myscoutee.profile.data.dto.community.*;

/** Write-pack organizing commands. Existing services retain ownership, version and lifecycle checks. */
@RestController
@RequestMapping("/integrations/v1")
public class IntegrationDomainController {
    private final IntegrationCapabilitiesService access;
    private final CampaignsService campaigns;
    private final CommunityCasesService cases;
    private final CommunityAnnouncementsService announcements;
    private final CommunityScheduledTasksService tasks;
    private final ServiceOfferingsService services;

    public IntegrationDomainController(IntegrationCapabilitiesService access, CampaignsService campaigns,
            CommunityCasesService cases, CommunityAnnouncementsService announcements,
            CommunityScheduledTasksService tasks, ServiceOfferingsService services) {
        this.access = access; this.campaigns = campaigns; this.cases = cases;
        this.announcements = announcements; this.tasks = tasks; this.services = services;
    }

    public record Receipt(String id, String status, Long version) { }

    public record Action(String action, Long version) { }

    // An explicit integration contract: new domain actions do not automatically
    // become AI capabilities. Personal ratings, feedback and ballots stay in-app.
    private static void requireAction(String action, String... allowed) {
        if (action == null || !java.util.Arrays.asList(allowed).contains(action))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported integration action.");
    }

    @PutMapping("/campaigns/{id}")
    public Receipt updateCampaign(Authentication authentication, @PathVariable String id, @RequestBody CampaignDtos.Save r) {
        String actor = access.requireWrite(authentication, "work");
        var result = campaigns.save(campaigns.actor(actor), new CampaignDtos.Save(actor, id, r.title(), r.description(),
                r.kind(), r.category(), r.imageUrls(), r.attachments(), r.version()));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/campaigns/{id}/action")
    public Receipt campaignAction(Authentication authentication, @PathVariable String id, @RequestBody Action r) {
        String actor = access.requireWrite(authentication, "work");
        requireAction(r.action(), "publish", "unpublish", "trash", "restore");
        var result = campaigns.action(campaigns.actor(actor), id, new CampaignDtos.Command(actor, r.action(), r.version()));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/cases")
    public Receipt saveCase(Authentication authentication, @RequestBody CommunityCaseDtos.SaveCase r) {
        String actor = access.requireWrite(authentication, "community");
        var result = cases.save(cases.actor(actor), new CommunityCaseDtos.SaveCase(actor, r.id(), r.communityId(), r.title(),
                r.description(), r.caseType(), r.audienceAll(), r.audienceAccountIds(), r.version()));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/cases/{id}/action")
    public Receipt caseAction(Authentication authentication, @PathVariable String id, @RequestBody CommunityCaseDtos.Command r) {
        String actor = access.requireWrite(authentication, "community");
        requireAction(r.action(), "invite-members", "remove-member", "invite-chat", "save-board-task",
                "delete-board-task", "start", "complete", "cancel", "trash", "reopen", "invite-provider");
        var result = cases.action(cases.actor(actor), id, new CommunityCaseDtos.Command(actor, r.action(), r.version(),
                r.providerAccountId(), r.serviceId(), null, null, null, null, r.memberAccountIds(),
                r.task(), r.taskId(), null, null, null, null));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/announcements")
    public Receipt saveAnnouncement(Authentication authentication, @RequestBody CommunityAnnouncementDtos.Save r) {
        String actor = access.requireWrite(authentication, "community");
        var result = announcements.save(announcements.actor(actor), new CommunityAnnouncementDtos.Save(actor, r.id(), r.communityId(),
                r.title(), r.body(), r.attachments(), r.voting(), r.deadlineIso(), r.version()));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/announcements/{id}/action")
    public Receipt announcementAction(Authentication authentication, @PathVariable String id, @RequestBody Action r) {
        String actor = access.requireWrite(authentication, "community");
        requireAction(r.action(), "publish", "unpublish", "trash", "restore", "close");
        var result = announcements.action(announcements.actor(actor), id, new CommunityAnnouncementDtos.Command(actor, r.action(), null, r.version()));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/scheduled-tasks")
    public Receipt saveScheduledTask(Authentication authentication, @RequestBody CommunityCaseDtos.SaveTask r) {
        String actor = access.requireWrite(authentication, "community");
        var result = tasks.save(tasks.actor(actor), new CommunityCaseDtos.SaveTask(actor, r.id(), r.communityId(), r.title(), r.description(),
                r.caseType(), r.audienceAll(), r.audienceAccountIds(), r.startAtIso(), r.frequency(), r.enabled(), r.version()));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/scheduled-tasks/{id}/action")
    public Receipt scheduledTaskAction(Authentication authentication, @PathVariable String id, @RequestBody Action r) {
        String actor = access.requireWrite(authentication, "community");
        requireAction(r.action(), "pause", "resume", "trash", "restore");
        var result = tasks.action(tasks.actor(actor), id, new CommunityCaseDtos.TaskCommand(actor, r.action(), r.version()));
        return new Receipt(result.id(), result.status(), result.version());
    }

    @PostMapping("/services/{id}/action")
    public Receipt serviceAction(Authentication authentication, @PathVariable String id, @RequestBody Action r) {
        String actor = access.requireWrite(authentication, "community");
        requireAction(r.action(), "publish", "unpublish", "trash", "restore");
        var result = services.action(services.actor(actor), id, new ServiceOfferingDtos.Command(actor, r.action(), r.version()));
        return new Receipt(result.service().id(), result.service().status(), result.service().version());
    }
}
