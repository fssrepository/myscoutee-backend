package com.raxim.myscoutee.profile.controller.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphForestsDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphNeighborhoodDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphTileDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminDashboardDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminMonitoringStateDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleRunRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleRunResultDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminNotificationRuleSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsHistoryDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsRevertRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsStateDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminStatsDashboardDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterRevisionSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostSaveRequestDto;
import com.raxim.myscoutee.profile.service.AdminAffinityGraphService;
import com.raxim.myscoutee.profile.service.AdminModerationService;
import com.raxim.myscoutee.profile.service.AdminMonitoringService;
import com.raxim.myscoutee.profile.service.AdminParamsService;
import com.raxim.myscoutee.profile.service.AdminStatsService;
import com.raxim.myscoutee.profile.service.AffinityRecomputeMetricsService;
import com.raxim.myscoutee.profile.service.HelpCenterService;
import com.raxim.myscoutee.profile.service.IdeaPostsService;
import com.raxim.myscoutee.profile.service.notifications.AdminNotificationService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminModerationService adminModerationService;
    private final HelpCenterService helpCenterService;
    private final IdeaPostsService ideaPostsService;
    private final AdminNotificationService adminNotificationService;
    private final AdminStatsService adminStatsService;
    private final AdminParamsService adminParamsService;
    private final AdminMonitoringService adminMonitoringService;
    private final AdminAffinityGraphService adminAffinityGraphService;
    private final AffinityRecomputeMetricsService affinityRecomputeMetricsService;

    public AdminController(
            AdminModerationService adminModerationService,
            HelpCenterService helpCenterService,
            IdeaPostsService ideaPostsService,
            AdminNotificationService adminNotificationService,
            AdminStatsService adminStatsService,
            AdminParamsService adminParamsService,
            AdminMonitoringService adminMonitoringService,
            AdminAffinityGraphService adminAffinityGraphService,
            AffinityRecomputeMetricsService affinityRecomputeMetricsService) {
        this.adminModerationService = adminModerationService;
        this.helpCenterService = helpCenterService;
        this.ideaPostsService = ideaPostsService;
        this.adminNotificationService = adminNotificationService;
        this.adminStatsService = adminStatsService;
        this.adminParamsService = adminParamsService;
        this.adminMonitoringService = adminMonitoringService;
        this.adminAffinityGraphService = adminAffinityGraphService;
        this.affinityRecomputeMetricsService = affinityRecomputeMetricsService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardDto dashboard(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminModerationService.dashboard(adminUserId);
    }

    @GetMapping("/stats")
    public AdminStatsDashboardDto stats(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminStatsService.dashboard(adminUserId);
    }

    @GetMapping("/monitoring")
    public AdminMonitoringStateDto monitoring(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminMonitoringService.state(adminUserId);
    }

    @GetMapping("/affinity-recompute/metrics")
    public AffinityRecomputeMetricsService.Snapshot affinityRecomputeMetrics() {
        return affinityRecomputeMetricsService.snapshot();
    }

    @GetMapping("/affinity-graph/full")
    public AdminAffinityGraphDto affinityGraph(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "minWeight", required = false) Double minWeight,
            @RequestParam(value = "maxWeight", required = false) Double maxWeight) {
        return adminAffinityGraphService.full(adminUserId, minWeight, maxWeight);
    }

    @GetMapping("/affinity-graph/meta")
    public AdminAffinityGraphMetaDto affinityGraphMeta(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "minWeight", required = false) Double minWeight,
            @RequestParam(value = "maxWeight", required = false) Double maxWeight) {
        return adminAffinityGraphService.meta(adminUserId, minWeight, maxWeight);
    }

    @GetMapping("/affinity-graph/forests")
    public AdminAffinityGraphForestsDto affinityGraphForests(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "minWeight", required = false) Double minWeight,
            @RequestParam(value = "maxWeight", required = false) Double maxWeight,
            @RequestParam(value = "forestLevel", required = false) Integer forestLevel,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "offset", required = false) Integer offset) {
        return adminAffinityGraphService.forests(adminUserId, minWeight, maxWeight, forestLevel, limit, offset);
    }

    @GetMapping("/affinity-graph/tiles")
    public AdminAffinityGraphTileDto affinityGraphTile(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "layoutVersion", required = false) String layoutVersion,
            @RequestParam(value = "z", required = false) Integer z,
            @RequestParam(value = "x", required = false) Integer x,
            @RequestParam(value = "y", required = false) Integer y,
            @RequestParam(value = "minWeight", required = false) Double minWeight,
            @RequestParam(value = "maxWeight", required = false) Double maxWeight,
            @RequestParam(value = "componentId", required = false) String componentId) {
        return adminAffinityGraphService.tile(adminUserId, layoutVersion, z, x, y, minWeight, maxWeight, componentId);
    }

    @GetMapping("/affinity-graph/members/{userId}/neighborhood")
    public AdminAffinityGraphNeighborhoodDto affinityGraphNeighborhood(
            @PathVariable String userId,
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "depth", required = false) Integer depth,
            @RequestParam(value = "minWeight", required = false) Double minWeight,
            @RequestParam(value = "maxWeight", required = false) Double maxWeight) {
        return adminAffinityGraphService.neighborhood(adminUserId, userId, depth, minWeight, maxWeight);
    }

    @PostMapping("/affinity-graph/layout/rebuild")
    public AdminAffinityGraphMetaDto rebuildAffinityGraphLayout(
            @RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminAffinityGraphService.rebuildLayout(adminUserId);
    }

    @GetMapping("/params")
    public AdminParamsStateDto params(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminParamsService.state(adminUserId);
    }

    @PostMapping("/params")
    public AdminParamsStateDto saveParams(@RequestBody(required = false) AdminParamsSaveRequestDto request) {
        return adminParamsService.save(request);
    }

    @GetMapping("/params/{sectionKey}/history")
    public AdminParamsHistoryDto paramsHistory(@PathVariable String sectionKey) {
        return adminParamsService.history(sectionKey);
    }

    @PostMapping("/params/{sectionKey}/revert")
    public AdminParamsStateDto revertParams(
            @PathVariable String sectionKey,
            @RequestBody(required = false) AdminParamsRevertRequestDto request) {
        return adminParamsService.revert(sectionKey, request);
    }

    @PostMapping("/users/{userId}/warn")
    public AdminDashboardDto warn(@PathVariable String userId, @RequestBody(required = false) AdminActionRequestDto request) {
        return adminModerationService.warn(userId, request);
    }

    @PostMapping("/users/{userId}/block")
    public AdminDashboardDto block(@PathVariable String userId, @RequestBody(required = false) AdminActionRequestDto request) {
        return adminModerationService.block(userId, request);
    }

    @PostMapping("/users/{userId}/unblock")
    public AdminDashboardDto unblock(@PathVariable String userId, @RequestBody(required = false) AdminActionRequestDto request) {
        return adminModerationService.unblock(userId, request);
    }

    @GetMapping("/notifications")
    public AdminNotificationCenterStateDto notifications(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminNotificationService.state(adminUserId);
    }

    @PostMapping("/notifications")
    public AdminNotificationCenterStateDto saveNotifications(@RequestBody(required = false) AdminNotificationRuleSaveRequestDto request) {
        return adminNotificationService.save(request);
    }

    @PostMapping("/notifications/{ruleKey}/run")
    public AdminNotificationRuleRunResultDto runNotificationRule(
            @PathVariable String ruleKey,
            @RequestBody(required = false) AdminNotificationRuleRunRequestDto request) {
        return adminNotificationService.run(ruleKey, request);
    }

    @GetMapping("/notifications/{ruleKey}/runtime")
    public AdminNotificationRuleDto notificationRuleRuntime(
            @PathVariable String ruleKey,
            @RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminNotificationService.ruleState(ruleKey, adminUserId);
    }

    @GetMapping("/help")
    public HelpCenterStateDto helpState(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "lang", required = false) String lang) {
        return helpCenterService.adminState(adminUserId, "help", lang);
    }

    @GetMapping("/privacy")
    public HelpCenterStateDto privacyState(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "lang", required = false) String lang) {
        return helpCenterService.adminState(adminUserId, "privacy", lang);
    }

    @GetMapping("/explanation")
    public HelpCenterStateDto explanationState(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "lang", required = false) String lang,
            @RequestParam(value = "contextKey", required = false) String contextKey) {
        return helpCenterService.adminState(adminUserId, "explanation", lang, contextKey);
    }

    @PostMapping("/help/revisions")
    public HelpCenterStateDto saveHelpRevision(@RequestBody(required = false) HelpCenterRevisionSaveRequestDto request) {
        return helpCenterService.saveRevision(request);
    }

    @PostMapping("/privacy/revisions")
    public HelpCenterStateDto savePrivacyRevision(@RequestBody(required = false) HelpCenterRevisionSaveRequestDto request) {
        return helpCenterService.saveRevision(request, "privacy");
    }

    @PostMapping("/explanation/revisions")
    public HelpCenterStateDto saveExplanationRevision(@RequestBody(required = false) HelpCenterRevisionSaveRequestDto request) {
        return helpCenterService.saveRevision(request, "explanation");
    }

    @PostMapping("/help/revisions/{revisionId}/activate")
    public HelpCenterStateDto activateHelpRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.activateRevision(revisionId, request);
    }

    @PostMapping("/privacy/revisions/{revisionId}/activate")
    public HelpCenterStateDto activatePrivacyRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.activateRevision(revisionId, request, "privacy");
    }

    @PostMapping("/explanation/revisions/{revisionId}/activate")
    public HelpCenterStateDto activateExplanationRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.activateRevision(revisionId, request, "explanation");
    }

    @DeleteMapping("/help/revisions/{revisionId}")
    public HelpCenterStateDto deleteHelpRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.deleteRevision(revisionId, request);
    }

    @DeleteMapping("/privacy/revisions/{revisionId}")
    public HelpCenterStateDto deletePrivacyRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.deleteRevision(revisionId, request, "privacy");
    }

    @DeleteMapping("/explanation/revisions/{revisionId}")
    public HelpCenterStateDto deleteExplanationRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.deleteRevision(revisionId, request, "explanation");
    }

    @GetMapping("/ideas")
    public List<IdeaPostDto> ideas(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "lang", required = false) String lang) {
        return ideaPostsService.adminPosts(adminUserId, lang);
    }

    @PostMapping("/ideas")
    public IdeaPostDto saveIdea(@RequestBody(required = false) IdeaPostSaveRequestDto request) {
        return ideaPostsService.savePost(request);
    }

    @DeleteMapping("/ideas/{postId}")
    public List<IdeaPostDto> deleteIdea(
            @PathVariable String postId,
            @RequestBody(required = false) IdeaPostAdminActionRequestDto request) {
        return ideaPostsService.deletePost(postId, request);
    }

    @PostMapping("/ideas/{postId}/restore")
    public IdeaPostDto restoreIdea(
            @PathVariable String postId,
            @RequestBody(required = false) IdeaPostAdminActionRequestDto request) {
        return ideaPostsService.restorePost(postId, request);
    }
}
