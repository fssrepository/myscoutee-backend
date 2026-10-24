package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
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

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
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
    @Mock
    private UserActivityCountersService userActivityCountersService;

    @Mock
    private EventFriendshipProjectionService eventFriendshipProjectionService;

    private EventCounterExpiryService service;

    @BeforeEach
    void setUp() {
        org.mockito.Mockito.lenient().when(notificationRuleRegistryService.beginRun(
                any(String.class), any(String.class), any(String.class), any(Instant.class)))
                .thenReturn(new NotificationRuleConfig());
        service = new EventCounterExpiryService(
                activityMembersRepository,
                mongoTemplate,
                notificationRuleRegistryService,
                adminTelemetryService,
                userActivityCountersService,
                eventFriendshipProjectionService,
                20, null, null);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "eventCounterUpdates", new com.raxim.myscoutee.domain.accounts.service.AccountEventCounterUpdateService(usersRepository));
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
                .thenReturn(List.of(pastTicket))
                .thenReturn(List.of());
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
        ActivityMember liveInvitationMembership = member("invite-event", "member", "I");

        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of(dueEvent))
                .thenReturn(List.of())
                .thenReturn(List.of())
                .thenReturn(List.of(dueEvent, pastMemberEvent))
                .thenReturn(List.of(pastMemberEvent, liveMemberEvent, liveInvitation, pastInvitation))
                .thenReturn(List.of(dueEvent, liveCanonical, liveInvitation));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdIn(eq("event"), any()))
                .thenReturn(List.of(sourceMember));
        when(mongoTemplate.find(any(Query.class), eq(ActivityMember.class)))
                .thenReturn(List.of(pastMembership, liveMembership, liveInvitationMembership));

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
                new Users.UserChatCountersRecord(2, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(18, 6, 0, 5, 7, 0, 0),
                new Users.UserAssetCountersRecord(8, 9, 10, 11),
                new Users.UserFeedbackCountersRecord(0, 13, 0, 0),
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

    @Test
    void runExpiryPassNowProjectsOnlyDueFeedbackCounterSourcesThroughTheWriteModel() {
        Instant now = Instant.now();
        ActivityEvent feedbackDue = event(
                "feedback-due",
                "host",
                "feedback",
                now.minusSeconds(10_800L).toString(),
                now.minusSeconds(10_800L).toString(),
                false);
        feedbackDue.setAcceptedMemberUserIds(List.of("member"));

        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class)))
                .thenReturn(List.of())
                .thenReturn(List.of())
                .thenReturn(List.of(feedbackDue));
        when(userActivityCountersService.syncFeedbackEligibilityForSourceIds(any(), any(Instant.class)))
                .thenReturn(1);

        int processed = service.runExpiryPassNow();

        assertThat(processed).isEqualTo(1);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<java.util.Collection<String>> sourceIdsCaptor = ArgumentCaptor.forClass(java.util.Collection.class);
        verify(userActivityCountersService).syncFeedbackEligibilityForSourceIds(
                sourceIdsCaptor.capture(),
                any(Instant.class));
        assertThat(sourceIdsCaptor.getValue()).containsExactly("feedback-due");
        verify(usersRepository, never()).saveAll(any());
    }

    @Test
    void runScheduledExpiryPassDoesNotReadOrWriteWhenAnotherInstanceOwnsTheRun() {
        int processed = service.runScheduledExpiryPass(Instant.now());

        assertThat(processed).isZero();
        verify(notificationRuleRegistryService).beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY),
                any(String.class),
                any(String.class),
                any(Instant.class));
        verify(mongoTemplate, never()).find(any(Query.class), eq(ActivityEvent.class));
        verify(mongoTemplate, never()).updateMulti(
                any(Query.class),
                any(Update.class),
                eq(ActivityEvent.class));
        verify(usersRepository, never()).saveAll(any());
    }

    @Test
    void runScheduledExpiryPassClaimsBeforeScanningDueEvents() {
        when(notificationRuleRegistryService.beginScheduledRun(
                eq(NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY),
                any(String.class),
                any(String.class),
                any(Instant.class)))
                .thenReturn(new NotificationRuleConfig());
        when(mongoTemplate.find(any(Query.class), eq(ActivityEvent.class))).thenReturn(List.of());

        int processed = service.runScheduledExpiryPass(Instant.now());

        assertThat(processed).isZero();
        verify(notificationRuleRegistryService).claimPendingCount(
                eq(NotificationRuleRegistryService.RULE_EVENT_COUNTER_EXPIRY), any(Instant.class));
        verify(mongoTemplate, atLeastOnce()).find(any(Query.class), eq(ActivityEvent.class));
    }

    @Test
    void activitiesDifferWhenOnlyTheNestedEventCountersDiffer() {
        Users.UserActivitiesRecord first = activities(
                new Users.UserEventCountersRecord(99, 1, 2, 3, 4, 5, 6));
        Users.UserActivitiesRecord second = activities(
                new Users.UserEventCountersRecord(21, 1, 2, 3, 4, 5, 6));

        assertThat(new com.raxim.myscoutee.domain.accounts.service.AccountEventCounterUpdateService(usersRepository).activitiesEqual(first, second)).isFalse();
    }

    private Users.UserActivitiesRecord activities(
            Users.UserEventCountersRecord eventCounters) {
        return new Users.UserActivitiesRecord(
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                new Users.UserChatCountersRecord(2, 0, 0, 0, 0, 0),
                eventCounters,
                new Users.UserAssetCountersRecord(8, 9, 10, 11),
                new Users.UserFeedbackCountersRecord(0, 13, 0, 0),
                14,
                15);
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
