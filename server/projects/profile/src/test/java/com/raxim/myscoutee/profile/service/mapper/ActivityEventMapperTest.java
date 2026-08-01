package com.raxim.myscoutee.profile.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.SubEventItem;

class ActivityEventMapperTest {
    private final ActivityEventMapper mapper = new ActivityEventMapper();

    @Test
    void activityContainsRuntimeChangesButNotEventMemberInvitations() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setMode("Casual");
        event.setActivity(0);
        event.setPendingMembers(45);
        event.setSubEvents(List.of(new SubEventItem(
                "sub-1",
                "Optional activity",
                "",
                null,
                null,
                "",
                "admin",
                null,
                null,
                null,
                null,
                true,
                null,
                0,
                16,
                0,
                2,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null)));

        var dto = mapper.toDto(event, null);

        assertThat(dto.pendingMembers()).isEqualTo(45);
        assertThat(dto.activity()).isEqualTo(3);
    }

    @Test
    void tournamentActivityUsesTheCounterPersistedOnTheParentEvent() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setMode("Casual");
        event.setActivity(3);
        event.setPendingMembers(45);

        var dto = mapper.toDto(event, null);

        assertThat(dto.pendingMembers()).isEqualTo(45);
        assertThat(dto.activity()).isEqualTo(3);
    }

    @Test
    void systemEventWithoutCreatorUserDoesNotTryToResolveAUserAvatar() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("random-room:event-1:stage-1:room-1");
        event.setTitle("Random Room R1");
        event.setCreatorUserId(null);
        event.setCreatorName("MyScoutee System");
        event.setEventType("random-room");

        var dto = mapper.toDto(
                event,
                new ActivityEventMapper.MappingContext(
                        null,
                        Map.of(),
                        Map.of(),
                        Map.of()));

        assertThat(dto.creatorUserId()).isEmpty();
        assertThat(dto.creatorName()).isEqualTo("MyScoutee System");
        assertThat(dto.creatorAvatarUrl()).isEmpty();
    }
}
