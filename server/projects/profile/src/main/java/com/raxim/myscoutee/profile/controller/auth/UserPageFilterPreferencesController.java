package com.raxim.myscoutee.profile.controller.auth;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.document.UserPageFilterPreferences.EventExploreFilters;
import com.raxim.myscoutee.profile.service.UserPageFilterPreferencesService;

@RestController
@RequestMapping("/auth/me/page-filter-preferences")
public class UserPageFilterPreferencesController {
    private final UserPageFilterPreferencesService service;

    public UserPageFilterPreferencesController(UserPageFilterPreferencesService service) { this.service = service; }

    public record SaveRequest(String userId, String pageKey, EventExploreFilters filters) { }

    @GetMapping
    public EventExploreFilters load(@RequestParam(required = false) String userId, @RequestParam String pageKey) {
        return service.load(userId, pageKey);
    }

    @PostMapping
    public void save(@RequestBody SaveRequest request) {
        service.save(request.userId(), request.pageKey(), request.filters());
    }
}
