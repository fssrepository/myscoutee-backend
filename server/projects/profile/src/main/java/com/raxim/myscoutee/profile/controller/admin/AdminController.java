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
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminDashboardDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterRevisionSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostSaveRequestDto;
import com.raxim.myscoutee.profile.service.AdminModerationService;
import com.raxim.myscoutee.profile.service.HelpCenterService;
import com.raxim.myscoutee.profile.service.IdeaPostsService;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminModerationService adminModerationService;
    private final HelpCenterService helpCenterService;
    private final IdeaPostsService ideaPostsService;

    public AdminController(
            AdminModerationService adminModerationService,
            HelpCenterService helpCenterService,
            IdeaPostsService ideaPostsService) {
        this.adminModerationService = adminModerationService;
        this.helpCenterService = helpCenterService;
        this.ideaPostsService = ideaPostsService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardDto dashboard(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return adminModerationService.dashboard(adminUserId);
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

    @GetMapping("/help")
    public HelpCenterStateDto helpState(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return helpCenterService.adminState(adminUserId);
    }

    @GetMapping("/privacy")
    public HelpCenterStateDto privacyState(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return helpCenterService.adminState(adminUserId, "privacy");
    }

    @PostMapping("/help/revisions")
    public HelpCenterStateDto saveHelpRevision(@RequestBody(required = false) HelpCenterRevisionSaveRequestDto request) {
        return helpCenterService.saveRevision(request);
    }

    @PostMapping("/privacy/revisions")
    public HelpCenterStateDto savePrivacyRevision(@RequestBody(required = false) HelpCenterRevisionSaveRequestDto request) {
        return helpCenterService.saveRevision(request, "privacy");
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

    @GetMapping("/ideas")
    public List<IdeaPostDto> ideas(@RequestParam(value = "adminUserId", required = false) String adminUserId) {
        return ideaPostsService.adminPosts(adminUserId);
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
}
