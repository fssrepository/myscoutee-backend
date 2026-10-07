package com.raxim.myscoutee.domain.events.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.SubEventItem;
import com.raxim.myscoutee.domain.events.service.ActivitiesMembersService;

@org.junit.jupiter.api.Tag("standard")
class ActivityEventMapperTest {
    private final ActivityEventMapper mapper = new ActivityEventMapper();

    @Test
    void listResponsePreservesExternalEventLinkForEveryMode() {
        for (String mode : List.of("Casual", "Tournament", "Mingle")) {
            ActivityEvent event = new ActivityEvent();
            event.setSourceId("external-event");
            event.setMode(mode);
            event.setSourceLink("https://example.org/events/external");

            assertThat(mapper.toDto(event, null).sourceLink())
                    .isEqualTo("https://example.org/events/external");

            event.setSourceLink("");
            assertThat(mapper.toDto(event, null).sourceLink()).isEmpty();
        }
    }

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
        event.setSlotsEnabled(true);
        event.setActivity(3);
        event.setPendingMembers(45);

        var dto = mapper.toDto(event, null);

        assertThat(dto.pendingMembers()).isEqualTo(45);
        assertThat(dto.activity()).isEqualTo(3);
        assertThat(dto.slotsEnabled()).isTrue();
    }

    @Test
    void activityKeepsThePersistedCounterIndependentOfViewerResourceReads() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setActivity(2);

        var dto = mapper.toDto(
                event,
                new ActivityEventMapper.MappingContext(
                        null,
                        Map.of(),
                        Map.of(),
                        Map.of(),
                        Map.of(),
                        "user-1",
                        Map.of("event-1", 1)));

        assertThat(dto.activity()).isEqualTo(2);
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
                        Map.of(),
                        Map.of(),
                        null));

        assertThat(dto.creatorUserId()).isNull();
        assertThat(dto.creatorName()).isEqualTo("MyScoutee System");
        assertThat(dto.creatorAvatarUrl()).isEmpty();
    }

    @Test
    void creatorIdentityDoesNotFallbackToAcceptedMembership() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setCreatorUserId("host");
        event.setCapacityTotal(8);
        event.setAcceptedMembers(0);
        event.setAcceptedMemberUserIds(List.of());
        event.setAdmins(List.of());

        var dto = mapper.toDto(event, null);

        assertThat(dto.acceptedMembers()).isZero();
        assertThat(dto.acceptedMemberUserIds()).isEmpty();
        assertThat(dto.adminIds()).isEmpty();
    }

    @Test
    void canonicalCreatorMembershipDrivesAcceptedAndAdminProjection() {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setCreatorUserId("host");
        event.setCapacityTotal(8);
        ActivityMember creatorMembership = new ActivityMember();
        creatorMembership.setOwnerType("event");
        creatorMembership.setOwnerId("event-1");
        creatorMembership.setUserId("host");
        creatorMembership.setRole("Admin");
        creatorMembership.setStatus("accepted");
        ActivitiesMembersService.OwnerMembersSnapshot snapshot =
                new ActivitiesMembersService.OwnerMembersSnapshot(
                        "event",
                        "event-1",
                        List.of(creatorMembership),
                        List.of("host"),
                        List.of("host"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of("host"),
                        8);

        var dto = mapper.toDto(
                event,
                new ActivityEventMapper.MappingContext(
                        null,
                        Map.of("event-1", snapshot),
                        Map.of(),
                        Map.of(),
                        Map.of("event-1", "accepted"),
                        "host"));

        assertThat(dto.acceptedMembers()).isEqualTo(1);
        assertThat(dto.acceptedMemberUserIds()).containsExactly("host");
        assertThat(dto.adminIds()).containsExactly("host");
        assertThat(dto.currentUserMembershipStatus()).isEqualTo("accepted");
    }
}
