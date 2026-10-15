package com.raxim.myscoutee.domain.events.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventSubEventsQueryDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventSubEventsSlotPage;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventSubEventsSlotDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto;

@org.junit.jupiter.api.Tag("standard")
class ActivityEventSubEventsMapperTest {
    private final ActivityEventSubEventsMapper mapper = new ActivityEventSubEventsMapper();

    private EventSubEventsSlotDto calendarSlot(String id, String start, String end) {
        return new EventSubEventsSlotDto(id, "event", null, null, id, null, start, end, List.of());
    }

    private EventSubEventsQueryDto calendarQuery(String view, int limit, String first, String last, String zone) {
        return new EventSubEventsQueryDto("user", "event", "upcoming", view, first, first, last, false, 0, 240, null, limit, zone);
    }

    @Test
    void calendarGeneratesAll300OccurrencesInVisibleMonthWithoutPageCap() {
        Instant first = Instant.parse("2099-04-01T00:00:00Z");
        ActivityEvent parent = parentEvent(first, java.util.stream.IntStream.range(0, 10)
                .mapToObj(i -> slotTemplate("template-" + i, first.plus(i + 1, ChronoUnit.HOURS), subEventDefinition(30))).toList());
        parent.setStartAtIso(first.toString());
        parent.setEndAtIso(first.plus(30, ChronoUnit.DAYS).toString());
        parent.setFrequency("Daily");
        var query = calendarQuery("month", 5, "2099-04-01", "2099-04-30", "UTC");
        var page = mapper.toCalendarSlots("event-1", parent, query);
        assertThat(page.slots()).hasSize(300);
        var result = mapper.compactCalendarSlots(page.slots(), query);
        assertThat(result.slots()).isEmpty();
        assertThat(result.cells()).hasSize(30).allSatisfy(cell -> assertThat(cell.count()).isEqualTo(10));
    }

    @Test
    void calendarKeepsFiveBadgesButReturnsOnlyCountForSixAndDoesNotTruncateAt240() {
        var slots = new java.util.ArrayList<EventSubEventsSlotDto>();
        for (int i = 0; i < 5; i++) slots.add(calendarSlot("sparse-" + i, "2027-04-01T10:00:00Z", "2027-04-01T11:00:00Z"));
        for (int i = 0; i < 300; i++) slots.add(calendarSlot("dense-" + i, "2027-04-02T10:00:00Z", "2027-04-02T11:00:00Z"));
        var result = mapper.compactCalendarSlots(slots, calendarQuery("month", 5, "2027-04-01", "2027-04-02", "UTC"));
        assertThat(result.slots()).hasSize(5);
        assertThat(result.cells()).singleElement().satisfies(cell -> {
            assertThat(cell.count()).isEqualTo(300);
            assertThat(cell.startAt()).isEqualTo("2027-04-02T00:00:00Z");
        });
        var six = mapper.compactCalendarSlots(slots.subList(5, 11), calendarQuery("month", 5, "2027-04-02", "2027-04-02", "UTC"));
        assertThat(six.slots()).isEmpty();
        assertThat(six.cells().get(0).count()).isEqualTo(6);
    }

    @Test
    void weeklyDenseHourKeepsDetailsForSparsePortionOfCrossingSlot() {
        var longSlot = calendarSlot("long", "2027-04-01T09:00:00Z", "2027-04-01T11:00:00Z");
        var result = mapper.compactCalendarSlots(List.of(longSlot,
                calendarSlot("short", "2027-04-01T10:00:00Z", "2027-04-01T11:00:00Z")),
                calendarQuery("week", 1, "2027-04-01", "2027-04-01", "UTC"));
        assertThat(result.slots()).containsExactly(longSlot);
        assertThat(result.cells()).singleElement().satisfies(cell -> {
            assertThat(cell.startAt()).isEqualTo("2027-04-01T10:00:00Z");
            assertThat(cell.count()).isEqualTo(2);
        });
    }

    @Test
    void calendarUsesLocalDayAndExclusiveMidnightAcrossDaylightSaving() {
        var slots = java.util.stream.IntStream.range(0, 6).mapToObj(i -> calendarSlot("s" + i,
                "2026-10-24T22:00:00Z", "2026-10-25T23:00:00Z")).toList();
        var result = mapper.compactCalendarSlots(slots, calendarQuery("month", 5, "2026-10-24", "2026-10-26", "Europe/Bratislava"));
        assertThat(result.cells()).singleElement().satisfies(cell -> {
            assertThat(cell.startAt()).isEqualTo("2026-10-24T22:00:00Z");
            assertThat(cell.endAt()).isEqualTo("2026-10-25T23:00:00Z");
            assertThat(cell.count()).isEqualTo(6);
        });
        assertThat(result.slots()).isEmpty();
    }

    @Test
    void calendarRejectsUnboundedOrInvalidRequests() {
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> mapper.compactCalendarSlots(List.of(),
                calendarQuery("month", 5, "2027-01-01", "2028-01-01", "UTC")))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
    }

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

    @Test
    void slotsWithoutSubEventDefinitionsEachExposeTheirOwnMainEventRuntime() {
        // Both slots belong to the queried UTC day, including when this test runs near midnight.
        Instant eventStart = Instant.now().plus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS)
                .plus(10, ChronoUnit.HOURS);
        ActivityEvent parent = parentEvent(eventStart, List.of(
                emptySlotTemplate("slot-1", eventStart),
                emptySlotTemplate("slot-2", eventStart.plus(1, ChronoUnit.HOURS))));
        parent.setTitle("Runtime Event");
        parent.setSubtitle("Slot-scoped main runtimes");
        parent.setLocation("Austin");
        parent.setCreatorUserId("user-1");
        parent.setCapacityMin(1);
        parent.setCapacityMax(8);
        parent.setAcceptedMembers(1);
        parent.setPendingMembers(0);
        parent.setStartAtIso(eventStart.toString());
        parent.setEndAtIso(eventStart.plus(3, ChronoUnit.HOURS).toString());
        parent.setFrequency("Custom");
        parent.setSubEventsEnabled(false);

        List<EventSubEventsSlotDto> slots = mapper.toSlotDtos("event-1", parent, query("upcoming", eventStart));

        assertThat(slots).hasSize(2);
        assertThat(slots).allSatisfy(slot -> {
            assertThat(slot.subEventItems()).singleElement().satisfies(item -> {
                assertThat(item.id()).isEqualTo("main-event:" + slot.slotSourceId());
                assertThat(item.runtimeKind()).isEqualTo("MAIN_EVENT");
                assertThat(item.eventId()).isEqualTo("event-1");
                assertThat(item.name()).isEqualTo("Runtime Event");
                assertThat(item.capacityMax()).isEqualTo(8);
            });
        });
        assertThat(slots)
                .extracting(EventSubEventsSlotDto::slotTemplateId)
                .containsExactly("slot-1", "slot-2");
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

    private EventSlotTemplateDto emptySlotTemplate(String id, Instant startAt) {
        return new EventSlotTemplateDto(id, startAt.toString(), null, false, List.of());
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
