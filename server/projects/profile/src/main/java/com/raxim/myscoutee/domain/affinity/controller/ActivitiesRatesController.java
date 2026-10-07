package com.raxim.myscoutee.domain.affinity.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.ActivityRatePageResponseDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.RateMenuItemDto;
import com.raxim.myscoutee.domain.affinity.service.UserRatesService;

@RestController
@RequestMapping("/activities/rates")
public class ActivitiesRatesController {
    private final UserRatesService userRatesService;

    public ActivitiesRatesController(UserRatesService userRatesService) {
        this.userRatesService = userRatesService;
    }

    @GetMapping
    public List<RateMenuItemDto> queryRates(@RequestParam("userId") String userId,
            @RequestParam(value = "campaignId", required = false) String campaignId) {
        return userRatesService.queryRateItemsByUser(userId, campaignId);
    }

    @GetMapping("/page")
    public ActivityRatePageResponseDto queryRatePage(
            @RequestParam("userId") String userId,
            @RequestParam("mode") String mode,
            @RequestParam("direction") String direction,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "sortDirection", required = false) String sortDirection,
            @RequestParam(value = "secondaryFilter", required = false) String secondaryFilter,
            @RequestParam(value = "socialBadgeEnabled", required = false) Boolean socialBadgeEnabled,
            @RequestParam(value = "cursor", required = false) String cursor,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "rangeStartIso", required = false) String rangeStartIso,
            @RequestParam(value = "rangeEndIso", required = false) String rangeEndIso,
            @RequestParam(value = "campaignId", required = false) String campaignId) {
        return userRatesService.queryActivityRatePage(
                userId,
                mode,
                direction,
                sort,
                sortDirection,
                secondaryFilter,
                Boolean.TRUE.equals(socialBadgeEnabled),
                cursor,
                limit,
                rangeStartIso,
                rangeEndIso, campaignId);
    }
}
