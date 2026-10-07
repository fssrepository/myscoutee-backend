package com.raxim.myscoutee.domain.operator.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.OperatorMeasurementReportDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.OperatorMeasurementReportPageDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.OperatorMeasurementSyncDto;
import com.raxim.myscoutee.domain.operator.service.OperatorQualifiedMauReportService;

@RestController
@RequestMapping("/operator/measurements")
@PreAuthorize("hasAuthority('O')")
public class OperatorMeasurementController {
    private final OperatorQualifiedMauReportService service;

    public OperatorMeasurementController(
            OperatorQualifiedMauReportService service) {
        this.service = service;
    }

    @PostMapping("/synchronize")
    public OperatorMeasurementSyncDto synchronize() {
        return service.synchronizeNow();
    }

    @GetMapping("/reports")
    public OperatorMeasurementReportPageDto reports(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        return service.reports(status, page, size);
    }

    @PostMapping("/reports/{reportId}/requeue")
    public OperatorMeasurementReportDto requeue(
            @PathVariable String reportId) {
        return service.requeue(reportId);
    }
}
