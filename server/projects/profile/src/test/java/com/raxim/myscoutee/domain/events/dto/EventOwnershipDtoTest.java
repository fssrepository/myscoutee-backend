package com.raxim.myscoutee.domain.events.dto;

import static org.assertj.core.api.Assertions.*;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.events.mapper.SubEventItemMapper;

@Tag("standard")
class EventOwnershipDtoTest {
    @Test void roundTripKeepsNativeReadFactsAndExistingSubEventPresentation() throws Exception {
        var mapper = new JsonConfig().objectMapper();
        var stage = mapper.readValue("""
                {"id":"stage-1","name":"Final","description":"Existing presentation",
                 "startAt":"2026-10-08T12:00:00Z","endAt":"2026-10-08T13:00:00Z",
                 "location":"Court","createdByUserId":"host","optional":true,
                 "tournamentGroupCapacityMin":2,"tournamentGroupCapacityMax":6,
                 "tournamentLeaderboardType":"points","tournamentAdvancePerGroup":2,
                 "membersAccepted":5,"membersPending":1,"groupsPending":2,
                 "carsAccepted":1,"slotStartOffsetMinutes":15,"slotDurationMinutes":60,
                 "stageStatus":"finalized","stageFinalizedByUserId":"host","stageResultRevision":7,
                 "groups":[]}
                """, SubEventItem.class);
        var nativeEvent = new ActivityEvent();
        nativeEvent.setId("row-1"); nativeEvent.setSourceId("event-1");
        nativeEvent.setOwnerUserId("host"); nativeEvent.setCreatorUserId("host");
        nativeEvent.setTitle("Final event"); nativeEvent.setStatus("A");
        nativeEvent.setAffinity(12.5); nativeEvent.setBoost(0.75);
        nativeEvent.setUpdatedDate("2026-10-08T10:00:00Z");
        nativeEvent.setAdmins(new ArrayList<>(List.of("host", "moderator")));
        nativeEvent.setSubEvents(new ArrayList<>(List.of(stage)));

        var dto = EventOwnershipDto.from(nativeEvent);
        var decoded = mapper.readValue(mapper.writeValueAsBytes(dto), EventOwnershipDto.class);
        for (var getter : EventOwnership.Event.class.getMethods()) {
            if (getter.getParameterCount() != 0 || !getter.getName().startsWith("get")
                    || getter.getName().equals("getSubEvents")) continue;
            assertThat(mapper.<tools.jackson.databind.JsonNode>valueToTree(getter.invoke(decoded))).as(getter.getName())
                    .isEqualTo(mapper.valueToTree(getter.invoke(nativeEvent)));
        }
        assertThat(decoded.getSubEvents().getFirst().presentation()).isEqualTo(SubEventItemMapper.toDto(stage));
        assertThat(decoded.getSubEvents().getFirst().stageResultRevision()).isEqualTo(7);
        nativeEvent.getAdmins().clear(); nativeEvent.getSubEvents().clear();
        assertThat(dto.getAdmins()).containsExactly("host", "moderator");
        assertThat(dto.getSubEvents()).hasSize(1);
        assertThatThrownBy(() -> dto.getAdmins().add("other")).isInstanceOf(UnsupportedOperationException.class);
    }
}
