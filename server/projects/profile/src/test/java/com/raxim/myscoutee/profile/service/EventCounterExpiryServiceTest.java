package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.mongodb.client.result.UpdateResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;

@ExtendWith(MockitoExtension.class)
class EventCounterExpiryServiceTest {
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private NotificationRuleRegistryService notificationRuleRegistryService;
    @Mock
    private AdminTelemetryService adminTelemetryService;

    private EventCounterExpiryService service;

    @BeforeEach
    void setUp() {
        service = new EventCounterExpiryService(
                activityMembersRepository,
                usersRepository,
                mongoTemplate,
                notificationRuleRegistryService,
                adminTelemetryService,
                20);
    }

    @Test
    void runExpiryPassNowDoesNothingWhenNoPastEventsAreDue() {
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of());

        int processed = service.runExpiryPassNow();

        assertThat(processed).isZero();
        verify(usersRepository, never()).saveAll(any());
        verify(mongoTemplate, never()).updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class));
    }

    @Test
    void runExpiryPassNowMarksPastTicketExpiredWhenNoCounterEventsAreDue() {
        Instant now = Instant.now();
        String pastStart = now.minusSeconds(172_800L).toString();
        String pastEnd = now.minusSeconds(86_400L).toString();
        ActivityEvent pastTicket = event("past-ticket", "member", "ticket", pastStart, pastEnd, false);
        pastTicket.setTicketing(true);

        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of())
                .thenReturn(List.of(pastTicket));
        when(mongoTemplate.updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class)))
                .thenReturn(UpdateResult.acknowledged(1L, 1L, null));

        int processed = service.runExpiryPassNow();

        assertThat(processed).isZero();
        verify(usersRepository, never()).saveAll(any());
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateMulti(queryCaptor.capture(), updateCaptor.capture(), eq(ActivityEvent.class));
        assertThat(queryCaptor.getValue().getQueryObject().toJson()).contains("\"ticketing\": true", "\"_id\"");
        assertThat(updateCaptor.getValue().getUpdateObject().toJson()).contains("\"expired\": true");
    }

    @Test
    void runExpiryPassNowRecomputesAffectedCountersAndMarksPastEventExpired() {
        Instant now = Instant.now();
        String pastStart = now.minusSeconds(172_800L).toString();
        String pastEnd = now.minusSeconds(86_400L).toString();
        String futureStart = now.plusSeconds(86_400L).toString();
        String futureEnd = now.plusSeconds(172_800L).toString();

        ActivityEvent dueEvent = event("past-event", "host", "due", pastStart, pastEnd, false);
        ActivityEvent pastMemberEvent = event("past-event", "host", "past-member", pastStart, pastEnd, false);
        pastMemberEvent.setAcceptedMemberUserIds(List.of("member"));
        ActivityEvent liveMemberEvent = event("live-event", "host", "live-member", futureStart, futureEnd, false);
        liveMemberEvent.setAcceptedMemberUserIds(List.of("member"));
        ActivityEvent liveInvitation = event("invite-event", "host", "live-invite", futureStart, futureEnd, false);
        liveInvitation.setInvitedMemberUserIds(List.of("member"));
        ActivityEvent pastInvitation = event("past-invite", "host", "past-invite", pastStart, pastEnd, false);
        pastInvitation.setInvitedMemberUserIds(List.of("member"));
        ActivityEvent liveCanonical = event("live-event", "host", "canonical", futureStart, futureEnd, false);
        liveCanonical.setAcceptedMemberUserIds(List.of("member"));

        ActivityMember sourceMember = member("past-event", "member", "accepted");
        ActivityMember pastMembership = member("past-event", "member", "accepted");
        ActivityMember liveMembership = member("live-event", "member", "accepted");

        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(dueEvent))
                .thenReturn(List.of())
                .thenReturn(List.of(dueEvent, pastMemberEvent))
                .thenReturn(List.of(pastMemberEvent, liveMemberEvent, liveInvitation, pastInvitation))
                .thenReturn(List.of(dueEvent, liveCanonical));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdIn(eq("event"), any()))
                .thenReturn(List.of(sourceMember));
        when(mongoTemplate.find(any(Query.class), eq(ActivityMember.class)))
                .thenReturn(List.of(pastMembership, liveMembership));

        Users member = new Users();
        member.setUserId("member");
        member.setActivities(new Users.UserActivitiesRecord(
                1,
                2,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                new Users.UserEventCountersRecord(18, 6, 0, 5, 7, 0, 0),
                new Users.UserAssetCountersRecord(8, 9, 10, 11),
                new Users.UserEventFeedbackCountersRecord(0, 13, 0, 0),
                14,
                15));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(member));
        when(usersRepository.saveAll(any())).thenAnswer(invocation -> toList(invocation.getArgument(0)));
        when(mongoTemplate.updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class)))
                .thenReturn(UpdateResult.acknowledged(2L, 2L, null));

        int processed = service.runExpiryPassNow();

        assertThat(processed).isEqualTo(1);
        ArgumentCaptor<Iterable<Users>> savedUsersCaptor = ArgumentCaptor.forClass(Iterable.class);
        verify(usersRepository).saveAll(savedUsersCaptor.capture());
        List<Users> savedUsers = toList(savedUsersCaptor.getValue());
        assertThat(savedUsers).hasSize(1);
        Users.UserActivitiesRecord activities = savedUsers.get(0).getActivities();
        assertThat(activities.invitations()).isEqualTo(1);
        assertThat(activities.events()).isEqualTo(1);
        assertThat(activities.hosting()).isZero();
        assertThat(activities.game()).isEqualTo(1);
        assertThat(activities.adminJobs()).isEqualTo(14);
        verify(mongoTemplate).updateMulti(any(Query.class), any(Update.class), eq(ActivityEvent.class));
    }

    private ActivityEvent event(String sourceId, String ownerUserId, String suffix, String startAtIso, String endAtIso, boolean expired) {
        ActivityEvent event = new ActivityEvent();
        event.setId(sourceId + ":" + ownerUserId + ":" + suffix);
        event.setSourceId(sourceId);
        event.setOwnerUserId(ownerUserId);
        event.setCreatorUserId("host");
        event.setAdmins(List.of("host"));
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setStartAtIso(startAtIso);
        event.setEndAtIso(endAtIso);
        event.setIsExpired(expired);
        return event;
    }

    private ActivityMember member(String ownerId, String userId, String status) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setStatus(status);
        return member;
    }

    private <T> List<T> toList(Iterable<T> values) {
        List<T> list = new ArrayList<>();
        if (values != null) {
            values.forEach(list::add);
        }
        return list;
    }
}
