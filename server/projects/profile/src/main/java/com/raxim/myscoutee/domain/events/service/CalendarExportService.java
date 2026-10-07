package com.raxim.myscoutee.domain.events.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Base64;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDto;

/** A private snapshot for manual import, not a calendar subscription or scheduling invitation. */
@Service
public class CalendarExportService {
    private static final DateTimeFormatter ICS_TIME = DateTimeFormatter.ofPattern("uuuuMMdd'T'HHmmss'Z'")
            .withZone(ZoneOffset.UTC);
    private final ActivitiesEventsService events;

    public CalendarExportService(ActivitiesEventsService events) {
        this.events = events;
    }

    public String export(String actorId) {
        return render(actorId, events.queryCalendarItemsByUser(actorId), Instant.now());
    }

    static String render(String actorId, List<EventDto> records, Instant now) {
        StringBuilder out = new StringBuilder();
        for (String line : List.of("BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MyScoutee//Calendar Export//EN",
                "CALSCALE:GREGORIAN")) line(out, line);
        var unique = new LinkedHashMap<String, EventDto>();
        for (EventDto event : records) {
            Instant start = instant(event.startAtIso());
            Instant end = instant(event.endAtIso());
            boolean owner = actorId.equals(event.creatorUserId()) || actorId.equals(event.organizerUserId());
            if (!"A".equals(event.status()) || Boolean.TRUE.equals(event.cancelled())
                    || List.of("under-review", "blocked", "rejected").contains(event.moderationStatus() == null ? "" : event.moderationStatus())
                    || (!owner && !"accepted".equals(event.currentUserMembershipStatus()))
                    || event.id() == null || event.id().isBlank() || start == null || end == null
                    || !end.isAfter(start) || !end.isAfter(now)) continue;
            unique.putIfAbsent(event.id(), event);
        }
        if (unique.isEmpty()) return "";
        unique.values().stream().sorted(Comparator.comparing(e -> instant(e.startAtIso()))).forEach(event -> {
            line(out, "BEGIN:VEVENT");
            line(out, "UID:" + Base64.getUrlEncoder().withoutPadding().encodeToString(
                    ("myscoutee:event:" + event.id()).getBytes(StandardCharsets.UTF_8))
                    + "@myscoutee");
            line(out, "DTSTAMP:" + ICS_TIME.format(now));
            line(out, "DTSTART:" + ICS_TIME.format(instant(event.startAtIso())));
            line(out, "DTEND:" + ICS_TIME.format(instant(event.endAtIso())));
            line(out, "SUMMARY:" + escape(event.title()));
            line(out, "LOCATION:" + escape(event.location()));
            line(out, "STATUS:CONFIRMED");
            line(out, "BEGIN:VALARM");
            line(out, "ACTION:DISPLAY");
            line(out, "TRIGGER:PT0S");
            line(out, "DESCRIPTION:" + escape(event.title()));
            line(out, "END:VALARM");
            line(out, "END:VEVENT");
        });
        line(out, "END:VCALENDAR");
        return out.toString();
    }

    private static Instant instant(String value) {
        try { return OffsetDateTime.parse(value).toInstant(); }
        catch (RuntimeException exception) { return null; }
    }

    private static String escape(String value) {
        return (value == null ? "" : value).replace("\\", "\\\\").replace("\r\n", "\n").replace("\r", "\n")
                .replace("\n", "\\n").replace(";", "\\;").replace(",", "\\,")
                .replaceAll("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]", "");
    }

    /** RFC 5545 folds at 75 octets without splitting a UTF-8 code point. */
    private static void line(StringBuilder out, String value) {
        int octets = 0;
        for (int offset = 0; offset < value.length();) {
            int codePoint = value.codePointAt(offset);
            String character = new String(Character.toChars(codePoint));
            int size = character.getBytes(StandardCharsets.UTF_8).length;
            if (octets + size > 75) { out.append("\r\n "); octets = 1; }
            out.append(character); octets += size; offset += Character.charCount(codePoint);
        }
        out.append("\r\n");
    }
}
