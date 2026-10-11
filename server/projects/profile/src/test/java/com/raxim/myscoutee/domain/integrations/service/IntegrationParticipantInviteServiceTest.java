package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.api.SelectedProfile;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMingleSession;
import com.raxim.myscoutee.domain.events.service.ActivitiesEventsService;
import com.raxim.myscoutee.domain.events.service.ActivitiesMembersService;
import com.raxim.myscoutee.domain.accounts.service.CommunityGroupProfilesService;
import com.raxim.myscoutee.domain.groups.service.CommunityGroupsService;
import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;
import com.raxim.myscoutee.domain.integrations.document.IntegrationParticipantInvite;
import com.raxim.myscoutee.domain.payments.service.AffiliateService;

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

import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.*;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.access.security.AccessControlService;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class IntegrationParticipantInviteServiceTest {
    @Mock MongoTemplate mongo;
    @Mock ActivityEventsRepository events;
    @Mock AccessControlService access;
    @Mock ActivitiesMembersService members;
    @Mock IntegrationPublicEndpointResolver endpoint;
    @Mock SelectedProfile profiles;
    @Mock AffiliateService affiliates;
    @Mock ActivitiesEventsService eventActions;
    @Mock CommunityGroupsService groups;
    @Mock com.raxim.myscoutee.domain.accounts.repository.UsersRepository users;
    IntegrationParticipantInviteService service;
    final String token = "a".repeat(43);

    @BeforeEach void setup() {
        service = new IntegrationParticipantInviteService(mongo, new com.raxim.myscoutee.domain.events.service.EventOwnershipService(events),  access,  members,  endpoint,  profiles);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "groups", groups);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "affiliates", affiliates);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "eventActions", eventActions);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "users", new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "profileAuthentication", new com.raxim.myscoutee.domain.accounts.service.ProfileAuthenticationService());
        org.springframework.test.util.ReflectionTestUtils.setField(service, "encounters", new com.raxim.myscoutee.domain.events.service.MingleEncounterService(null, null, mongo, null));
    }

    @Test void groupEventLinkUsesTheAdmittedProfileAndRestoresTheAccountAuthentication() {
        var account = new Users(); account.setId("account"); account.setUserId("account");
        var inviter = new Users(); inviter.setId("owner"); inviter.setUserId("owner"); inviter.setWorkspaceGroupId("group");
        var recipient = new Users(); recipient.setId("group-recipient"); recipient.setUserId("group-recipient");
        recipient.setWorkspaceGroupId("group"); recipient.setAccountUserId("account");
        var principal = new com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal("account", "", List.of(), account);
        var original = new com.raxim.myscoutee.domain.accounts.security.firebase.FirebaseAuthenticationToken(principal, null, principal.getAuthorities());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(original);
        try {
            when(profiles.resolveSelectedUserId("account")).thenReturn("account");
            when(users.findByUserId("account")).thenReturn(Optional.of(account));
            when(users.findByUserId("group-recipient")).thenReturn(Optional.of(recipient));
            when(users.findByUserId("owner")).thenReturn(Optional.of(inviter));
            var event = new ActivityEvent(); event.setId("event-record"); event.setSourceId("event"); event.setOwnerUserId("owner"); event.setWorkspaceGroupId("group");
            when(events.findBySourceId("event")).thenReturn(List.of(event));
            when(access.canInviteEventMembers("event", "owner")).thenReturn(true);
            when(groups.claimEventInvite("group", "owner", "account")).thenReturn(recipient);
            when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(
                    new IntegrationParticipantInvite("link", "owner", "event", null, token, "hash", null, "now", null, "event", true));
            doAnswer(call -> {
                assertThat(CommunityGroupProfilesService.currentGroupId()).isEqualTo("group");
                return null;
            }).when(members).claimIntegrationInvite(any(), eq("event-record"), eq("group-recipient"));
            assertThat(service.claim("account", token).workspaceGroupId()).isEqualTo("group");
            verify(members).claimIntegrationInvite(argThat(invite -> "group-recipient".equals(invite.claimedUserId())), eq("event-record"), eq("group-recipient"));
            assertThat(org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()).isSameAs(original);
        } finally { org.springframework.security.core.context.SecurityContextHolder.clearContext(); }
    }

    @Test void groupClaimUsesTheSameIdentityBindingAndAdmitsTheBoundRecipient() {
        when(profiles.resolveSelectedUserId("actual-user")).thenReturn("actual-user");
        var owner = new Users(); owner.setId("owner"); owner.setUserId("owner");
        var recipient = new Users(); recipient.setUserId("actual-user");
        when(groups.actor("actual-user")).thenReturn(recipient);
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
        verify(members).claimIntegrationInvite(claimed, "event-record", "actual-user");
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

    @Test void reusableGroupLinkAdmitsDifferentAccountsWithoutApiParticipantBindings() {
        var owner = new Users(); owner.setUserId("owner");
        when(users.findByUserId("owner")).thenReturn(Optional.of(owner));
        var shared = new IntegrationParticipantInvite("link", "owner", "group", null, token, "hash", null, "now", null, "community", true);
        when(mongo.findOne(any(Query.class), eq(IntegrationParticipantInvite.class))).thenReturn(shared);
        for (String actor : List.of("one", "two")) {
            var recipient = new Users(); recipient.setUserId(actor);
            when(profiles.resolveSelectedUserId(actor)).thenReturn(actor);
            when(groups.actor(actor)).thenReturn(recipient);
            assertThat(service.claim(actor, token).groupId()).isEqualTo("group");
            verify(groups).claimIntegrationInvite(argThat(invite -> ((IntegrationParticipantInvite) invite).reusable() && actor.equals(invite.claimedUserId())), eq(actor));
        }
        verify(mongo, never()).findAndModify(any(), any(), any(), any(Class.class));
    }

    @Test void externalLinkCarriesTheSameAffiliateCodeAndStoredInviteToken() {
        when(profiles.resolveSelectedUserId("owner")).thenReturn("owner");
        when(eventActions.loadEventDetailById("owner", "event")).thenReturn(mock(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto.class));
        when(endpoint.resolve()).thenReturn("https://app.example/api/integrations/v1");
        when(affiliates.link("owner")).thenReturn("/entry?affiliate=referral-code");
        when(mongo.findAndModify(any(), any(), any(), eq(IntegrationParticipantInvite.class))).thenReturn(
                new IntegrationParticipantInvite("link", "owner", "event", null, token, "hash", null, "now", null, "event", true));
        assertThat(service.externalLink("owner", "event", "event").url())
                .isEqualTo("https://app.example/game?affiliate=referral-code&partnerInvite=" + token + "&mode=dating");
        verifyNoInteractions(members);
    }

    private ActivityEvent event() {
        var event = new ActivityEvent(); event.setId("event-record"); event.setSourceId("event"); event.setOwnerUserId("owner"); event.setCreatorUserId("owner");
        when(events.findByOwnerUserIdAndSourceId("owner", "event")).thenReturn(Optional.of(event));
        when(access.canInviteEventMembers("event", "owner")).thenReturn(true);
        return event;
    }
    private IntegrationParticipantInvite invite(String actor) {
        return new IntegrationParticipantInvite("invite", "owner", "event", "partner-123", token, "hash", actor, "now", actor == null ? null : "now");
    }
}
