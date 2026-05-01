package com.raxim.myscoutee.profile.controller.admin;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminDashboardDto;
import com.raxim.myscoutee.profile.service.AdminModerationService;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private final AdminModerationService adminModerationService;

    public AdminController(AdminModerationService adminModerationService) {
        this.adminModerationService = adminModerationService;
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
}
