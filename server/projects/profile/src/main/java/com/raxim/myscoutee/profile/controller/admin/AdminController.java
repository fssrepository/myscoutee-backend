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
import com.raxim.myscoutee.profile.service.AdminModerationService;
import com.raxim.myscoutee.profile.service.HelpCenterService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminModerationService adminModerationService;
    private final HelpCenterService helpCenterService;

    public AdminController(AdminModerationService adminModerationService, HelpCenterService helpCenterService) {
        this.adminModerationService = adminModerationService;
        this.helpCenterService = helpCenterService;
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

    @PostMapping("/help/revisions")
    public HelpCenterStateDto saveHelpRevision(@RequestBody(required = false) HelpCenterRevisionSaveRequestDto request) {
        return helpCenterService.saveRevision(request);
    }

    @PostMapping("/help/revisions/{revisionId}/activate")
    public HelpCenterStateDto activateHelpRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.activateRevision(revisionId, request);
    }

    @DeleteMapping("/help/revisions/{revisionId}")
    public HelpCenterStateDto deleteHelpRevision(
            @PathVariable String revisionId,
            @RequestBody(required = false) HelpCenterAdminActionRequestDto request) {
        return helpCenterService.deleteRevision(revisionId, request);
    }
}
