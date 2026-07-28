package com.raxim.myscoutee.profile.controller.operator;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationUpdateDto;
import com.raxim.myscoutee.profile.service.operator.OperatorConfigurationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/operator/configuration")
@PreAuthorize("hasAuthority('O')")
public class OperatorConfigurationController {
    private final OperatorConfigurationService service;

    public OperatorConfigurationController(OperatorConfigurationService service) {
        this.service = service;
    }

    @GetMapping
    public OperatorConfigurationDto configuration() {
        return service.configuration();
    }

    @PutMapping
    public OperatorConfigurationDto update(
            @Valid @RequestBody OperatorConfigurationUpdateDto request) {
        return service.update(request);
    }

    @PostMapping("/tests")
    public ConfigurationTestResultDto test(
            @Valid @RequestBody ConfigurationTestRequestDto request) {
        return service.test(request);
    }
}
