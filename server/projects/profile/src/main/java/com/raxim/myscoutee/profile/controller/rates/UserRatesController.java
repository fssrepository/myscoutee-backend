package com.raxim.myscoutee.profile.controller.rates;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.dto.rates.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.profile.dto.rates.RatesDtos.UserRatesSyncResponseDto;

@RestController
@RequestMapping("/user-rates")
public class UserRatesController {

    @PostMapping("/sync")
    public UserRatesSyncResponseDto sync(@RequestBody UserRatesSyncRequestDto request) {
        List<String> syncedRateIds = request == null || request.rates() == null
                ? List.of()
                : request.rates().stream()
                        .map(rate -> rate.id())
                        .filter(id -> id != null && !id.isBlank())
                        .toList();
        return new UserRatesSyncResponseDto(syncedRateIds, List.of());
    }
}
