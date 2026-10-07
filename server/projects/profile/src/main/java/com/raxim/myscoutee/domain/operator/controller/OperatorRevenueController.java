package com.raxim.myscoutee.domain.operator.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueReportDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueReportPageDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueSyncDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorSettlementPageDto;
import com.raxim.myscoutee.domain.operator.service.OperatorRevenueReportService;
import com.raxim.myscoutee.domain.operator.service.OperatorRevenueService;
import com.raxim.myscoutee.domain.operator.service.OperatorSettlementService;

@RestController
@RequestMapping("/operator/revenue")
@PreAuthorize("hasAuthority('O')")
public class OperatorRevenueController {
    private final OperatorRevenueService service;
    private final OperatorRevenueReportService reportService;
    private final OperatorSettlementService settlementService;

    public OperatorRevenueController(
            OperatorRevenueService service,
            OperatorRevenueReportService reportService,
            OperatorSettlementService settlementService) {
        this.service = service;
        this.reportService = reportService;
        this.settlementService = settlementService;
    }

    @GetMapping
    public OperatorRevenueDto revenue() {
        return service.revenue();
    }

    @PostMapping("/synchronize")
    public OperatorRevenueSyncDto synchronize() {
        return reportService.synchronizeNow();
    }

    @GetMapping("/reports")
    public OperatorRevenueReportPageDto reports(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return reportService.reports(status, page, size);
    }

    @PostMapping("/reports/{reportId}/requeue")
    public OperatorRevenueReportDto requeue(
            @PathVariable String reportId) {
        return reportService.requeue(reportId);
    }

    @GetMapping("/settlements")
    public OperatorSettlementPageDto settlements(
            @RequestParam(required = false) String currencyCode,
            @RequestParam(required = false) String fromPeriod,
            @RequestParam(required = false) String throughPeriod,
            @RequestParam(defaultValue = "false")
                    boolean includeSuperseded,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String afterPeriod,
            @RequestParam(required = false)
                    String afterSettlementId) {
        return settlementService.settlements(
                currencyCode,
                fromPeriod,
                throughPeriod,
                includeSuperseded,
                limit,
                afterPeriod,
                afterSettlementId);
    }
}
