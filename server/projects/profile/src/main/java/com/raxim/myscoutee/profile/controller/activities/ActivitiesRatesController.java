package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.rates.RatesDtos.RateMenuItemDto;

@RestController
@RequestMapping("/activities/rates")
public class ActivitiesRatesController {

    @GetMapping
    public List<RateMenuItemDto> queryRates(@RequestParam("userId") String userId) {
        return List.of();
    }
}
