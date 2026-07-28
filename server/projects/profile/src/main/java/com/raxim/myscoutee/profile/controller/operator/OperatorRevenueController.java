package com.raxim.myscoutee.profile.controller.operator;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorRevenueDtos.OperatorRevenueDto;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueService;

@RestController
@RequestMapping("/operator/revenue")
@PreAuthorize("hasAuthority('O')")
public class OperatorRevenueController {
    private final OperatorRevenueService service;

    public OperatorRevenueController(OperatorRevenueService service) {
        this.service = service;
    }

    @GetMapping
    public OperatorRevenueDto revenue() {
        return service.revenue();
    }
}
