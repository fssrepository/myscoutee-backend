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
    IntegrationParticipantInviteService service;
    final String token = "a".repeat(43);

    @BeforeEach void setup() { service = new IntegrationParticipantInviteService(mongo, events, access, members, endpoint, profiles); }

    @Test void claimBindsTheAuthenticatedActorAndCreatesOnlyAnInvitation() {
        var event = event();
        when(profiles.resolveSelectedUserId("spoofed")).thenReturn("actual-user");
        var open = invite(null);
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(open);
        var mapping = new IntegrationExternalId(); mapping.setInternalId("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationExternalId.class))).thenReturn(mapping);
        var claimed = invite("actual-user");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationParticipantInvite.class))).thenReturn(claimed);
        assertThat(service.claim("spoofed", token).eventId()).isEqualTo("event");
        verify(members).claimIntegrationInvite(claimed, event, "actual-user");
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
