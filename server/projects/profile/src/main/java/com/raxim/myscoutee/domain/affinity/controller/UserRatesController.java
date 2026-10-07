package com.raxim.myscoutee.domain.affinity.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.UserRatesSyncResponseDto;
import com.raxim.myscoutee.domain.affinity.service.UserRatesService;

@RestController
@RequestMapping("/user-rates")
public class UserRatesController {
    private final UserRatesService userRatesService;

    public UserRatesController(UserRatesService userRatesService) {
        this.userRatesService = userRatesService;
    }

    @PostMapping("/sync")
    public UserRatesSyncResponseDto sync(@RequestBody UserRatesSyncRequestDto request) {
        return userRatesService.sync(request);
    }
}
