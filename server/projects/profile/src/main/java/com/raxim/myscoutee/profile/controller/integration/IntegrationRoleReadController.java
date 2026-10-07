package com.raxim.myscoutee.profile.controller.integration;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.service.AdminClientService;
import com.raxim.myscoutee.profile.service.IntegrationCapabilitiesService;
import com.raxim.myscoutee.profile.service.operator.OperatorQualifiedMauReportService;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueReportService;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorMeasurementDtos.OperatorMeasurementReportPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRevenueDtos.OperatorRevenueReportPageDto;

/** Delegates to the existing bounded report readers; exposes no role management commands. */
@RestController
@RequestMapping("/integrations/v1/query")
@PreAuthorize("hasAuthority('INTEGRATION')")
public class IntegrationRoleReadController {
    private final IntegrationCapabilitiesService access;
    private final AdminClientService admin;
    private final OperatorQualifiedMauReportService measurements;
    private final OperatorRevenueReportService revenue;

    public IntegrationRoleReadController(IntegrationCapabilitiesService access, AdminClientService admin,
            OperatorQualifiedMauReportService measurements, OperatorRevenueReportService revenue) {
        this.access = access; this.admin = admin; this.measurements = measurements; this.revenue = revenue;
    }

    @GetMapping("/admin/overview")
    public AdminClientService.Overview adminOverview(Authentication authentication) {
        return admin.overview(access.requireRoleRead(authentication, "admin"));
    }

    @GetMapping("/operator/measurements")
    public OperatorMeasurementReportPageDto measurements(Authentication authentication,
            @RequestParam(required = false) String status, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        access.requireRoleRead(authentication, "operator");
        return measurements.reports(status, page, size);
    }

    @GetMapping("/operator/revenue-reports")
    public OperatorRevenueReportPageDto revenue(Authentication authentication,
            @RequestParam(required = false) String status, @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        access.requireRoleRead(authentication, "operator");
        return revenue.reports(status, page, size);
    }
}
