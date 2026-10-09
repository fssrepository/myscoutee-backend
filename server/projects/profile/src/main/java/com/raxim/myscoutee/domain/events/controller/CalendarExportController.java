package com.raxim.myscoutee.domain.events.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.events.service.CalendarExportService;

@RestController
@RequestMapping("/activities/events/calendar")
public class CalendarExportController {
    private final AccessPermissions access;
    private final CalendarExportService calendar;

    public CalendarExportController(AccessPermissions access, CalendarExportService calendar) {
        this.access = access;
        this.calendar = calendar;
    }

    @GetMapping(value = "/export", produces = "text/calendar;charset=UTF-8")
    public ResponseEntity<String> export(Authentication authentication) {
        String actor = access.resolveActorUserId(authentication);
        if (actor == null || actor.isBlank() || "anonymousUser".equals(actor)) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED);
        }
        String content = calendar.export(actor);
        if (content.isEmpty()) {
            return ResponseEntity.noContent().header(HttpHeaders.CACHE_CONTROL, "private, no-store").build();
        }
        return ResponseEntity.ok().header(HttpHeaders.CACHE_CONTROL, "private, no-store")
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"myscoutee-calendar.ics\"")
                .header("X-Content-Type-Options", "nosniff")
                .body(content);
    }
}
