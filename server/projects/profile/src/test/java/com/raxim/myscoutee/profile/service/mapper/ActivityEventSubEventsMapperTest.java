package com.raxim.myscoutee.profile.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsQueryDto;
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
        return new EventSubEventsQueryDto("user-1", "event-1", order, "day", date, date, date);
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
                List.of(),
                2,
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
