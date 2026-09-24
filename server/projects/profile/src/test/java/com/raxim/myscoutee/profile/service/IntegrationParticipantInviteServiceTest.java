package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.*;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.*;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@ExtendWith(MockitoExtension.class)
class IntegrationParticipantInviteServiceTest {
    @Mock MongoTemplate mongo;
    @Mock ActivityEventsRepository events;
    @Mock AccessControlService access;
    @Mock ActivitiesMembersService members;
    @Mock IntegrationPublicEndpointResolver endpoint;
    @Mock HomeUserProfileService profiles;
    @Mock CommunityGroupsService groups;
    @Mock com.raxim.myscoutee.profile.repository.UsersRepository users;
    IntegrationParticipantInviteService service;
    final String token = "a".repeat(43);

    @BeforeEach void setup() {
        service = new IntegrationParticipantInviteService(mongo, events, access, members, endpoint, profiles);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "groups", groups);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "users", users);
    }

    @Test void groupClaimUsesTheSameIdentityBindingAndAdmitsTheBoundRecipient() {
        when(profiles.resolveSelectedUserId("actual-user")).thenReturn("actual-user");
        var owner = new Users(); owner.setId("owner"); owner.setUserId("owner");
        when(users.findByUserId("owner")).thenReturn(Optional.of(owner));
        var open = new IntegrationParticipantInvite("invite", "owner", "group", "guest", token,
                "hash", null, "now", null, "community");
        var claimed = new IntegrationParticipantInvite("invite", "owner", "group", "guest", token,
                "hash", "actual-user", "now", "now", "community");
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(open);
        var mapping = new IntegrationExternalId(); mapping.setInternalId("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationExternalId.class))).thenReturn(mapping);
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationParticipantInvite.class))).thenReturn(claimed);

        var result = service.claim("actual-user", token);

        assertThat(result.groupId()).isEqualTo("group");
        assertThat(result.eventId()).isNull();
        assertThat(result.invitationAvailable()).isTrue();
        verify(groups).requireAdmin(owner, "group");
        verify(groups).claimIntegrationInvite(claimed, "actual-user");
        verifyNoInteractions(members, events);
    }

    @Test void ongoingEventClaimBindsTheAuthenticatedActorAndCreatesOnlyAnInvitation() {
        var event = event();
        event.setStartAtIso(java.time.Instant.now().minusSeconds(3600).toString());
        event.setEndAtIso(java.time.Instant.now().plusSeconds(3600).toString());
        when(profiles.resolveSelectedUserId("spoofed")).thenReturn("actual-user");
        var open = invite(null);
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(open);
        var mapping = new IntegrationExternalId(); mapping.setInternalId("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationExternalId.class))).thenReturn(mapping);
        var claimed = invite("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationParticipantInvite.class))).thenReturn(claimed);
        var result = service.claim("spoofed", token);
        assertThat(result.eventId()).isEqualTo("event");
        assertThat(result.invitationAvailable()).isTrue();
        verify(members).claimIntegrationInvite(claimed, event, "actual-user");
    }

    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.ValueSource(strings = {"Casual", "Tournament", "Mingle"})
    void lateClaimBindsIdentityWithoutInvitingOrChangingExistingMembership(String mode) {
        var event = event();
        event.setMode(mode);
        event.setEndAtIso(java.time.Instant.now().minusSeconds(60).toString());
        // Expired events need no new invitation permission; ownership is still required.
        clearInvocations(access);
        lenient().when(access.canInviteEventMembers("event", "owner")).thenReturn(false);
        when(profiles.resolveSelectedUserId("actual-user")).thenReturn("actual-user");
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class)))
                .thenReturn(invite(null), invite("actual-user"));
        var mapping = new IntegrationExternalId(); mapping.setInternalId("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationExternalId.class))).thenReturn(mapping);
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationParticipantInvite.class)))
                .thenReturn(invite("actual-user"));
        for (int replay = 0; replay < 2; replay++) {
            var result = service.claim("actual-user", token);
            assertThat(result.eventId()).isEqualTo("event");
            assertThat(result.invitationAvailable()).isFalse();
        }
        verify(mongo, times(2)).findAndModify(any(), any(), any(), eq(IntegrationExternalId.class));
        verifyNoInteractions(members, access);
    }

    @Test void completedMeetingDoesNotInviteEvenBeforeItsScheduledEnd() {
        var event = event(); event.setMode("Mingle");
        event.setEndAtIso(java.time.Instant.now().plusSeconds(3600).toString());
        lenient().when(access.canInviteEventMembers("event", "owner")).thenReturn(false);
        when(mongo.exists(any(Query.class), eq(ActivityMingleSession.class))).thenReturn(true);
        when(profiles.resolveSelectedUserId("actual-user")).thenReturn("actual-user");
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(invite(null));
        var mapping = new IntegrationExternalId(); mapping.setInternalId("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationExternalId.class))).thenReturn(mapping);
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationParticipantInvite.class)))
                .thenReturn(invite("actual-user"));
        assertThat(service.claim("actual-user", token).invitationAvailable()).isFalse();
        verifyNoInteractions(members);
    }

    @Test void aClaimedLinkCannotBeTransferredToAnotherAccount() {
        event();
        when(profiles.resolveSelectedUserId("other")).thenReturn("other");
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(invite("actual-user"));
        assertThatThrownBy(() -> service.claim("other", token)).isInstanceOf(ResponseStatusException.class);
        verify(mongo, never()).findAndModify(any(), any(), any(), any(Class.class));
        verifyNoInteractions(members);
    }

    @Test void anExternalParticipantAlreadyBoundToAnotherAccountCannotBeClaimed() {
        event();
        when(profiles.resolveSelectedUserId("other")).thenReturn("other");
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(invite(null));
        var mapping = new IntegrationExternalId(); mapping.setInternalId("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationExternalId.class))).thenReturn(mapping);
        assertThatThrownBy(() -> service.claim("other", token)).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(members);
    }

    @Test void rejectsUnknownOwnersAndDuplicateParticipantIdsBeforeWriting() {
        assertThatThrownBy(() -> service.create("outsider", "event", new IntegrationParticipantInviteRequestDto(List.of("one"))))
                .isInstanceOf(ResponseStatusException.class);
        event();
        assertThatThrownBy(() -> service.create("owner", "event", new IntegrationParticipantInviteRequestDto(List.of("one", " one "))))
                .isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(mongo, members);
    }

    private ActivityEvent event() {
        var event = new ActivityEvent(); event.setSourceId("event"); event.setOwnerUserId("owner"); event.setCreatorUserId("owner");
        when(events.findByOwnerUserIdAndSourceId("owner", "event")).thenReturn(Optional.of(event));
        when(access.canInviteEventMembers("event", "owner")).thenReturn(true);
        return event;
    }
    private IntegrationParticipantInvite invite(String actor) {
        return new IntegrationParticipantInvite("invite", "owner", "event", "partner-123", token, "hash", actor, "now", actor == null ? null : "now");
    }
}
