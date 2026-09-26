package com.raxim.myscoutee.profile.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CalendarExportServiceTest {
    private static final Instant NOW = Instant.parse("2026-09-23T08:00:00Z");
    private EventDto event(String id) {
        EventDto event = mock(EventDto.class);
        when(event.id()).thenReturn(id);
        when(event.status()).thenReturn("A");
        when(event.creatorUserId()).thenReturn("owner");
        when(event.currentUserMembershipStatus()).thenReturn("accepted");
        when(event.startAtIso()).thenReturn("2026-09-24T10:00:00+02:00");
        when(event.endAtIso()).thenReturn("2026-09-24T11:00:00+02:00");
        when(event.title()).thenReturn("Coffee");
        when(event.location()).thenReturn("Budapest");
        return event;
    }

    @Test void exportsStableIdsUtcAndStartReminderWithoutLeakingParticipantData() {
        var event = event("event-1");
        String first = CalendarExportService.render("viewer", List.of(event, event), NOW);
        String second = CalendarExportService.render("viewer", List.of(event), NOW.plusSeconds(60));
        assertEquals(uid(first), uid(second));
        assertEquals(1, first.split("BEGIN:VEVENT", -1).length - 1);
        assertTrue(first.contains("DTSTART:20260924T080000Z\r\n"));
        assertTrue(first.contains("DTEND:20260924T090000Z\r\n"));
        assertTrue(first.contains("TRIGGER:PT0S\r\n"));
        assertFalse(first.contains("ATTENDEE"));
        assertFalse(first.contains("ORGANIZER"));
        when(event.startAtIso()).thenReturn("2026-09-24T08:30:00Z");
        String changed = CalendarExportService.render("viewer", List.of(event), NOW);
        assertEquals(uid(first), uid(changed));
        assertTrue(changed.contains("DTSTART:20260924T083000Z"));
    }

    @Test void excludesUnconfirmedUnpublishedPastInvalidAndForeignEvents() {
        var records = new ArrayList<EventDto>();
        for (String status : List.of("DR", "T", "UR", "B", "D", "I")) {
            var event = event(status); when(event.status()).thenReturn(status); records.add(event);
        }
        for (String membership : List.of("pending", "invited", "none", "deleted", "suppressed")) {
            var event = event(membership); when(event.currentUserMembershipStatus()).thenReturn(membership); records.add(event);
        }
        var past = event("past"); when(past.endAtIso()).thenReturn("2026-09-23T07:00:00Z"); records.add(past);
        var invalid = event("invalid"); when(invalid.startAtIso()).thenReturn("2026-09-24T10:00:00"); records.add(invalid);
        assertFalse(CalendarExportService.render("viewer", records, NOW).contains("BEGIN:VEVENT"));
        var hosted = event("hosted"); when(hosted.currentUserMembershipStatus()).thenReturn("none");
        assertTrue(CalendarExportService.render("owner", List.of(hosted), NOW).contains("BEGIN:VEVENT"));
    }

    @Test void excludesCancelledAndModerationHeldEventsEvenWhenStatusRemainsActive() {
        var cancelled = event("cancelled");
        when(cancelled.cancelled()).thenReturn(true);
        assertFalse(CalendarExportService.render("owner", List.of(cancelled), NOW).contains("BEGIN:VEVENT"));
        for (String status : List.of("under-review", "blocked", "rejected")) {
            var held = event(status);
            when(held.moderationStatus()).thenReturn(status);
            assertFalse(CalendarExportService.render("viewer", List.of(held), NOW).contains("BEGIN:VEVENT"));
        }
        var accepted = event("accepted");
        when(accepted.moderationStatus()).thenReturn("accepted");
        assertTrue(CalendarExportService.render("viewer", List.of(accepted), NOW).contains("BEGIN:VEVENT"));
    }

    @Test void escapesInjectionAndFoldsUnicodeAt75Octets() {
        var event = event("unicode");
        when(event.title()).thenReturn("Á😀".repeat(40) + ",;\\\r\nBEGIN:VEVENT\u0000");
        String output = CalendarExportService.render("viewer", List.of(event), NOW);
        for (String line : output.split("\r\n")) assertTrue(line.getBytes(StandardCharsets.UTF_8).length <= 75);
        assertEquals(1, output.split("\r\nBEGIN:VEVENT\r\n", -1).length - 1);
        assertTrue(output.replace("\r\n ", "").contains("\\,\\;\\\\\\nBEGIN:VEVENT"));
        assertFalse(output.contains("\u0000"));
    }

    @Test void exportUsesExistingActorScopedQuery() {
        var events = mock(ActivitiesEventsService.class);
        when(events.queryCalendarItemsByUser("viewer")).thenReturn(List.of());
        assertEquals("", new CalendarExportService(events).export("viewer"));
        verify(events).queryCalendarItemsByUser("viewer");
    }

    private String uid(String value) { return value.lines().filter(line -> line.startsWith("UID:")).findFirst().orElseThrow(); }
}
