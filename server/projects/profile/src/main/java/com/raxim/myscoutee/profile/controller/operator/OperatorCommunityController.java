package com.raxim.myscoutee.profile.controller.operator;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorCommunityDtos.CommunityProviderDto;
import com.raxim.myscoutee.profile.service.operator.CommunityProviderService;

@RestController
@RequestMapping("/operator/community")
@PreAuthorize("hasAuthority('O')")
public class OperatorCommunityController {
    private final CommunityProviderService service;

    public OperatorCommunityController(CommunityProviderService service) {
        this.service = service;
    }

    @GetMapping("/providers")
    public List<CommunityProviderDto> providers() {
        return service.availableProviders();
    }
}
