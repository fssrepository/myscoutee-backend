package com.raxim.myscoutee.domain.administration.controller;

import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.domain.content.api.AdministrativeAccess;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminReviewResolveRequestDto;

/** Report and feedback workflows, independently selectable from other admin routes. */
@RestController
@RequestMapping("/admin")
public class AdminModerationController {
    private final AdministrativeAccess adminModerationService;
    public AdminModerationController(AdministrativeAccess adminModerationService) {
        this.adminModerationService = adminModerationService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardDto dashboard(
            @RequestParam(value = "adminUserId", required = false) String adminUserId,
            @RequestParam(value = "reportsStatus", required = false) String reportsStatus,
            @RequestParam(value = "feedbackStatus", required = false) String feedbackStatus) {
        return adminModerationService.dashboard(adminUserId, reportsStatus, feedbackStatus);
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

    @PostMapping("/reports/{reportId}/resolve")
    public AdminDashboardDto resolveReport(
            @PathVariable String reportId,
            @RequestBody(required = false) AdminReviewResolveRequestDto request) {
        return adminModerationService.resolveReport(reportId, request);
    }

    @PostMapping("/feedback/{feedbackId}/resolve")
    public AdminDashboardDto resolveFeedback(
            @PathVariable String feedbackId,
            @RequestBody(required = false) AdminReviewResolveRequestDto request) {
        return adminModerationService.resolveFeedback(feedbackId, request);
    }
}
