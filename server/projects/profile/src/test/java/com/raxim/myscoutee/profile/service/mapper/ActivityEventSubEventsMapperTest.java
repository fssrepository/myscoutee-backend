package com.raxim.myscoutee.profile.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotPage;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsSlotDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;

class ActivityEventSubEventsMapperTest {
    private final ActivityEventSubEventsMapper mapper = new ActivityEventSubEventsMapper();

    @Test
    void generatedSlotsUseWholeSlotEndForUpcomingAndPastOrders() {
        Instant now = Instant.now();
        Instant slotStart = now.minus(90, ChronoUnit.MINUTES);
        ActivityEvent parent = parentEvent(now, List.of(slotTemplate(
                "slot-ended",
                slotStart,
                subEventDefinition(30))));

        List<EventSubEventsSlotDto> upcoming = mapper.toSlotDtos("event-1", parent, query("upcoming", slotStart));
        List<EventSubEventsSlotDto> past = mapper.toSlotDtos("event-1", parent, query("past", slotStart));

        assertThat(upcoming).isEmpty();
        assertThat(past).hasSize(1);
        assertThat(Instant.parse(past.get(0).endAt())).isBeforeOrEqualTo(Instant.now());
    }

    @Test
    void generatedSlotsStayUpcomingUntilWholeSlotHasEnded() {
        Instant now = Instant.now();
        Instant slotStart = now.minus(15, ChronoUnit.MINUTES);
        ActivityEvent parent = parentEvent(now, List.of(slotTemplate(
                "slot-ongoing",
                slotStart,
                subEventDefinition(60))));

        List<EventSubEventsSlotDto> upcoming = mapper.toSlotDtos("event-1", parent, query("upcoming", slotStart));
        List<EventSubEventsSlotDto> past = mapper.toSlotDtos("event-1", parent, query("past", slotStart));

        assertThat(upcoming).hasSize(1);
        assertThat(Instant.parse(upcoming.get(0).startAt())).isBeforeOrEqualTo(Instant.now());
        assertThat(Instant.parse(upcoming.get(0).endAt())).isAfter(Instant.now());
        assertThat(past).isEmpty();
    }

    @Test
    void upcomingOrderStartsAtFarFutureEventWhenNoCalendarRangeIsProvided() {
        Instant now = Instant.now();
        Instant eventStart = now.plus(180, ChronoUnit.DAYS);
        ActivityEvent parent = parentEvent(eventStart, List.of(slotTemplate(
                "slot-future",
                eventStart,
                subEventDefinition(60))));
        parent.setStartAtIso(eventStart.toString());
        parent.setEndAtIso(eventStart.plus(10, ChronoUnit.DAYS).toString());

        List<EventSubEventsSlotDto> upcoming = mapper.toSlotDtos(
                "event-1",
                parent,
                new EventSubEventsQueryDto("user-1", "event-1", "upcoming", "day", null, null, null, false));

        assertThat(upcoming).singleElement().satisfies(slot -> {
            assertThat(slot.slotTemplateId()).isEqualTo("slot-future");
            assertThat(slot.subEventItems()).extracting(item -> item.id()).containsExactly("stage-1");
        });
    }

    @Test
    void recurringSlotsArePaginatedThroughTheEventEnd() {
        Instant eventStart = Instant.now().plus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.SECONDS);
        ActivityEvent parent = parentEvent(eventStart, List.of(slotTemplate(
                "slot-daily",
                eventStart,
                subEventDefinition(60))));
        parent.setStartAtIso(eventStart.toString());
        parent.setEndAtIso(eventStart.plus(1_000, ChronoUnit.DAYS).toString());
        parent.setFrequency("Daily");

        EventSubEventsSlotPage first = mapper.toSlotPage(
                "event-1",
                parent,
                new EventSubEventsQueryDto(
                        "user-1", "event-1", "upcoming", "day", null, null, null, false, 0, 12, null));
        EventSubEventsSlotPage second = mapper.toSlotPage(
                "event-1",
                parent,
                new EventSubEventsQueryDto(
                        "user-1", "event-1", "upcoming", "day", null, null, null, false, 1, 12, first.nextCursor()));

        assertThat(first.slots()).hasSize(12);
        assertThat(first.total()).isEqualTo(1_000);
        assertThat(first.nextCursor()).isEqualTo("12");
        assertThat(second.slots()).hasSize(12);
        assertThat(second.total()).isEqualTo(1_000);
        assertThat(second.nextCursor()).isEqualTo("24");
        assertThat(second.slots().get(0).startAt()).isEqualTo(eventStart.plus(12, ChronoUnit.DAYS).toString());
    }

    @Test
    void baseSlotBeforeParentStartMatchesFrontendLocalAndBeginsOnNextDailyOccurrence() {
        Instant eventStart = Instant.parse("2027-04-01T19:30:00Z");
        ActivityEvent parent = parentEvent(eventStart, List.of(slotTemplate(
                "slot-1",
                Instant.parse("2027-04-01T13:30:00Z"),
                subEventDefinition(60))));
        parent.setStartAtIso(eventStart.toString());
        parent.setEndAtIso(Instant.parse("2027-05-08T22:15:00Z").toString());
        parent.setFrequency("Daily");

        EventSubEventsSlotPage firstDay = mapper.toSlotPage(
                "event-1",
                parent,
                new EventSubEventsQueryDto(
                        "user-1", "event-1", "upcoming", "day",
                        "2027-04-01", "2027-04-01", "2027-04-01", false, 0, 12, null));
        EventSubEventsSlotPage secondDay = mapper.toSlotPage(
                "event-1",
                parent,
                new EventSubEventsQueryDto(
                        "user-1", "event-1", "upcoming", "day",
                        "2027-04-02", "2027-04-02", "2027-04-02", false, 0, 12, null));

        assertThat(firstDay.slots()).isEmpty();
        assertThat(secondDay.slots()).singleElement().satisfies(slot ->
                assertThat(slot.startAt()).isEqualTo("2027-04-02T13:30:00Z"));
    }

    @Test
    void dailySlotsMirrorFrontendLocalWhenParentMovesBeforeTemplateAnchorDate() {
        ActivityEvent parent = parentEvent(
                Instant.parse("2026-05-01T23:30:00Z"),
                List.of(new EventSlotTemplateDto(
                        "slot-1",
                        "2027-04-01T13:30",
                        null,
                        false,
                        List.of(subEventDefinition(60)))));
        parent.setStartAtIso("2026-05-01T23:30:00Z");
        parent.setEndAtIso("2027-05-09T02:15:00Z");
        parent.setFrequency("Daily");

        EventSubEventsSlotPage page = mapper.toSlotPage(
                "event-1",
                parent,
                new EventSubEventsQueryDto(
                        "user-1", "event-1", "upcoming", "day",
                        "2026-12-01", "2026-12-01", "2026-12-01", false, 0, 12, null));

        assertThat(page.slots()).singleElement().satisfies(slot ->
                assertThat(slot.startAt()).isEqualTo("2026-12-01T13:30:00Z"));
    }

    private ActivityEvent parentEvent(Instant now, List<EventSlotTemplateDto> slotTemplates) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setStartAtIso(now.minus(1, ChronoUnit.DAYS).toString());
        event.setEndAtIso(now.plus(1, ChronoUnit.DAYS).toString());
        event.setFrequency("One-time");
        event.setSlotsEnabled(true);
        event.setSubEventsEnabled(true);
        event.setSlotTemplates(slotTemplates);
        return event;
    }

    private EventSlotTemplateDto slotTemplate(
            String id,
            Instant startAt,
            SubEventDefinitionDto definition) {
        return new EventSlotTemplateDto(
                id,
                startAt.toString(),
                null,
                false,
                List.of(definition));
    }

    private EventSubEventsQueryDto query(String order, Instant anchor) {
        String date = anchor.atOffset(ZoneOffset.UTC).toLocalDate().toString();
        return new EventSubEventsQueryDto("user-1", "event-1", order, "day", date, date, date, false);
    }

    private SubEventDefinitionDto subEventDefinition(int durationMinutes) {
        return new SubEventDefinitionDto(
                "stage-1",
                "Stage 1",
                "",
                "During",
                0,
                durationMinutes,
                "",
                1,
                2,
                "Score",
                1,
                false,
                null,
                0,
                0,
                null);
    }
}
