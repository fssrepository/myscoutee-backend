package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.events.service.EventParticipationTicketService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.service.AssetCatalog;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.events.document.EventFeedbackState;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class UserActivityCountersServiceTest {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private AssetsRepository assetsRepository;
    @Mock
    private EventFeedbackStatesRepository eventFeedbackStatesRepository;
    @Mock
    private com.raxim.myscoutee.domain.events.repository.EventWatchSubscriptionsRepository eventWatchSubscriptionsRepository;
    @Mock
    private EventParticipationTicketService eventParticipationTicketService;
    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private com.mongodb.client.MongoCollection<Document> usersCollection;

    private UserActivityCountersService service;

    @BeforeEach
    void setUp() {
        service = new UserActivityCountersService(
                usersRepository,
                activityEventsRepository,
                activityMembersRepository,
                assetsRepository,
                eventFeedbackStatesRepository,
                eventWatchSubscriptionsRepository,
                eventParticipationTicketService,
                mongoTemplate, org.mockito.Mockito.mock(OrganizerFollowingService.class));
    }

    @Test
    void communityMemberCounterAppliesTheTransitionDeltaWithoutLoadingOrRecountingMembers() {
        service.applyCommunityMemberDelta("community-a", -1);
        service.applyCommunityMemberDelta("community-a", 0);
        var query = ArgumentCaptor.forClass(Query.class);
        var update = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(query.capture(), update.capture(),
                eq(com.raxim.myscoutee.domain.groups.document.CommunityGroup.class));
        assertThat(query.getValue().getQueryObject().getString("_id")).isEqualTo("community-a");
        assertThat(update.getValue().getUpdateObject().get("$inc", Document.class).getInteger("pendingMembers")).isEqualTo(-1);
        org.mockito.Mockito.verifyNoMoreInteractions(mongoTemplate);
        org.mockito.Mockito.verifyNoInteractions(activityMembersRepository);
    }

    @Test
    void refreshAssetCountersForUserStoresActiveOwnedAssetCounts() {
        Users user = user("owner", activitiesWithAssetAndFeedback(0, 0, 0, 5, 2, 1, 3, 4));
        Asset transport = asset(AssetCatalog.TYPE_TRANSPORT, "A");
        transport.setRequests(List.of(
                assetRequest("pending", "borrow"),
                assetRequest("pending", "manual"),
                assetRequest("accepted", "borrow")));
        Asset accommodation = asset(AssetCatalog.TYPE_ACCOMMODATION, "A");
        accommodation.setRequests(List.of(assetRequest("pending", "borrow")));
        Asset deletedTransport = asset(AssetCatalog.TYPE_TRANSPORT, "D");
        deletedTransport.setRequests(List.of(assetRequest("pending", "borrow")));
        when(usersRepository.findByUserId("owner")).thenReturn(Optional.of(user));
        when(assetsRepository.findByOwnerUserId("owner")).thenReturn(List.of(
                transport,
                accommodation,
                asset(AssetCatalog.TYPE_SUPPLIES, "A"),
                asset(AssetCatalog.TYPE_SUPPLIES, "UR"),
                deletedTransport));

        service.refreshAssetCountersForUser("owner");

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.cars")).isEqualTo(1);
        assertThat(fields.getInteger("activities.accommodation")).isEqualTo(1);
        assertThat(fields.getInteger("activities.supplies")).isEqualTo(1);
        assertThat(fields.getInteger("activities.asset.cars")).isEqualTo(1);
        assertThat(fields.getInteger("activities.asset.accommodation")).isEqualTo(1);
        assertThat(fields.getInteger("activities.asset.supplies")).isEqualTo(1);
        assertThat(fields.getInteger("activities.asset.tickets")).isEqualTo(5);
        assertThat(fields.getInteger("activities.asset.carsPending")).isEqualTo(1);
        assertThat(fields.getInteger("activities.asset.accommodationPending")).isEqualTo(1);
        assertThat(fields.getInteger("activities.asset.suppliesPending")).isZero();
    }

    @Test
    void refreshEventCountersUsesTheSameTicketProjectionAsTheTicketList() {
        Users user = user("viewer", activitiesWithAssetAndFeedback(0, 0, 0, 0, 0, 0, 0, 0));
        ActivityEvent firstTicket = event("event-one", "host", "A");
        ActivityEvent duplicateProjection = event("event-one", "host", "A");
        ActivityEvent secondTicket = event("event-two", "viewer", "A");
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user));
        when(eventParticipationTicketService.queryTicketRecordsForUser("viewer"))
                .thenReturn(List.of(firstTicket, duplicateProjection, secondTicket));

        service.refreshEventCountersForUsers(List.of("viewer"));

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.tickets")).isEqualTo(2);
        assertThat(fields.getInteger("activities.asset.tickets")).isEqualTo(2);
    }

    @ParameterizedTest
    @ValueSource(booleans = { false, true })
    void refreshExcludesPastBeforeAndAfterExpiryAndDeduplicatesPendingHostingInAll(boolean expired) {
        Users viewer = user("viewer", activitiesWithAssetAndFeedback(0, 0, 0, 0, 0, 0, 0, 0));
        Instant now = Instant.now();
        ActivityEvent pastHost = event("past-host", "viewer", "A");
        ActivityEvent pastInvite = event("past-invite", "host", "A");
        pastInvite.setInvitedMemberUserIds(List.of("viewer"));
        ActivityEvent pastPending = event("past-pending", "viewer", "UR");
        ActivityEvent pastMember = event("past-member", "host", "A");
        pastMember.setAcceptedMemberUserIds(List.of("viewer"));
        for (ActivityEvent past : List.of(pastHost, pastInvite, pastPending, pastMember)) {
            past.setStartAtIso(now.minusSeconds(7200).toString());
            past.setEndAtIso(now.minusSeconds(3600).toString());
            past.setIsExpired(expired);
        }
        ActivityEvent ongoing = event("ongoing", "host", "A");
        ongoing.setAcceptedMemberUserIds(List.of("viewer"));
        ongoing.setStartAtIso(now.minusSeconds(3600).toString());
        ongoing.setEndAtIso(now.plusSeconds(3600).toString());
        ActivityEvent futureReview = event("future-review", "viewer", "UR");
        futureReview.setEndAtIso(now.plusSeconds(7200).toString());
        List<ActivityEvent> records = List.of(pastHost, pastInvite, pastPending, pastMember, ongoing, futureReview);
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(viewer));
        when(activityEventsRepository.findDirectOwnerEvents("viewer")).thenReturn(records);
        when(activityEventsRepository.findBySourceIdIn(any())).thenReturn(records);

        service.refreshEventCountersForUsers(List.of("viewer"));

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.event.all")).isEqualTo(2);
        assertThat(fields.getInteger("activities.event.active")).isEqualTo(1);
        assertThat(fields.getInteger("activities.event.hosting")).isEqualTo(1);
        assertThat(fields.getInteger("activities.event.pending")).isEqualTo(1);
        assertThat(fields.getInteger("activities.event.invitations")).isZero();
        assertThat(fields).doesNotContainKey("activities.feedback");
    }

    @Test
    void readStoredEventCountersReturnsTheCompleteWriteSideSnapshot() {
        Users.UserActivitiesRecord base = activitiesWithAssetAndFeedback(0, 0, 0, 0, 0, 0, 0, 0);
        Users user = user("viewer", new Users.UserActivitiesRecord(
                base.game(),
                base.chats(),
                2,
                3,
                4,
                base.cars(),
                base.accommodation(),
                base.supplies(),
                base.tickets(),
                base.contacts(),
                base.feedback(),
                base.chat(),
                new Users.UserEventCountersRecord(9, 3, 1, 2, 4, 5, 6),
                base.asset(),
                base.eventFeedback(),
                base.adminJobs(),
                base.adminMetrics(),
                base.notifications()));
        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user));

        var snapshot = service.readStoredEventCounters("viewer");

        assertThat(snapshot.all()).isEqualTo(9);
        assertThat(snapshot.active()).isEqualTo(3);
        assertThat(snapshot.pending()).isEqualTo(1);
        assertThat(snapshot.invitations()).isEqualTo(2);
        assertThat(snapshot.hosting()).isEqualTo(4);
        assertThat(snapshot.drafts()).isEqualTo(5);
        assertThat(snapshot.trash()).isEqualTo(6);
    }

    @Test
    void refreshEventCountersPersistsGlobalTrashAndEventsLeftByTheUser() {
        Users user = user("viewer", activitiesWithAssetAndFeedback(0, 0, 0, 0, 0, 0, 0, 0));
        ActivityEvent globalTrash = event("event-trash", "viewer", "T");
        globalTrash.setOwnerUserId("viewer");
        ActivityEvent leftEvent = event("event-left", "new-owner", "A");
        ActivityMember deletedMembership = new ActivityMember();
        deletedMembership.setOwnerType("event");
        deletedMembership.setOwnerId("event-left");
        deletedMembership.setUserId("viewer");
        deletedMembership.setStatus("deleted");

        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user));
        when(activityEventsRepository.findDirectOwnerEvents("viewer")).thenReturn(List.of(globalTrash));
        when(activityMembersRepository.findByOwnerTypeAndUserId("event", "viewer"))
                .thenReturn(List.of(deletedMembership));
        when(activityEventsRepository.findBySourceIdIn(any()))
                .thenReturn(List.of(globalTrash, leftEvent));

        service.refreshEventCountersForUsers(List.of("viewer"));

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.event.trash")).isEqualTo(2);
        assertThat(fields.getInteger("activities.event.all")).isZero();
        assertThat(fields.getInteger("activities.events")).isZero();
        assertThat(fields.getInteger("activities.hosting")).isZero();
    }

    @Test
    void refreshEventCountersDoesNotProjectOrganizerTrashIntoAcceptedParticipantTrash() {
        Users user = user("viewer", activitiesWithAssetAndFeedback(0, 0, 0, 0, 0, 0, 0, 0));
        ActivityEvent organizerTrash = event("event-trash", "host", "T");
        organizerTrash.setOwnerUserId("host");
        organizerTrash.setAdmins(List.of("host"));
        organizerTrash.setAcceptedMemberUserIds(List.of("host", "viewer"));

        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user));
        when(activityEventsRepository.findAcceptedMembershipEvents("viewer"))
                .thenReturn(List.of(organizerTrash));
        when(activityEventsRepository.findBySourceIdIn(any()))
                .thenReturn(List.of(organizerTrash));

        service.refreshEventCountersForUsers(List.of("viewer"));

        verify(mongoTemplate, never()).updateFirst(any(Query.class), any(Update.class), eq(Users.class));
    }

    @Test
    void refreshEventCountersPersistsRestorableParticipantTrashBesideActiveCanonicalEvent() {
        Users user = user("viewer", activitiesWithAssetAndFeedback(0, 0, 0, 0, 0, 0, 0, 0));
        ActivityEvent canonical = event("event-left", "host", "A");
        canonical.setOwnerUserId("host");
        canonical.setAdmins(List.of("host"));
        canonical.setAcceptedMemberUserIds(List.of("host"));
        ActivityEvent personalTrash = event("event-left", "host", "T");
        personalTrash.setOwnerUserId("viewer");
        personalTrash.setStatusBeforeSuppression("A");
        ActivityMember suppressedMembership = new ActivityMember();
        suppressedMembership.setOwnerType("event");
        suppressedMembership.setOwnerId("event-left");
        suppressedMembership.setUserId("viewer");
        suppressedMembership.setStatus("suppressed");
        suppressedMembership.setStatusBeforeSuppression("accepted");
        suppressedMembership.setSuppressionRootOwnerId("event-left");

        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user));
        when(activityMembersRepository.findByOwnerTypeAndUserId("event", "viewer"))
                .thenReturn(List.of(suppressedMembership));
        when(activityEventsRepository.findDirectOwnerEvents("viewer"))
                .thenReturn(List.of(personalTrash));
        when(activityEventsRepository.findBySourceIdIn(any()))
                .thenReturn(List.of(canonical, personalTrash));

        service.refreshEventCountersForUsers(List.of("viewer"));

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.event.trash")).isEqualTo(1);
        assertThat(fields.getInteger("activities.event.all")).isZero();
        assertThat(fields.getInteger("activities.events")).isZero();
        assertThat(fields.getInteger("activities.hosting")).isZero();
    }

    @Test
    void refreshEventCountersUsesCanonicalActiveEventWithoutPersonalTrashOverlay() {
        Users user = user("viewer", activitiesWithAssetAndFeedback(0, 0, 0, 0, 0, 0, 0, 0));
        ActivityEvent canonical = event("event-suppressed", "host", "A");
        canonical.setOwnerUserId("host");
        canonical.setAdmins(List.of("host"));
        ActivityMember suppressedMembership = new ActivityMember();
        suppressedMembership.setOwnerType("event");
        suppressedMembership.setOwnerId("event-suppressed");
        suppressedMembership.setUserId("viewer");
        suppressedMembership.setStatus("suppressed");
        suppressedMembership.setStatusBeforeSuppression("accepted");
        suppressedMembership.setSuppressionRootOwnerId("event-suppressed");

        when(usersRepository.findByUserId("viewer")).thenReturn(Optional.of(user));
        when(activityMembersRepository.findByOwnerTypeAndUserId("event", "viewer"))
                .thenReturn(List.of(suppressedMembership));
        when(activityEventsRepository.findBySourceIdIn(any()))
                .thenReturn(List.of(canonical));

        service.refreshEventCountersForUsers(List.of("viewer"));

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.event.trash")).isZero();
        assertThat(fields.getInteger("activities.event.all")).isEqualTo(1);
        assertThat(fields.getInteger("activities.events")).isEqualTo(1);
    }

    @Test
    void applyFeedbackStateTransitionMovesStoredMenuAndPopupBuckets() {
        ActivityEvent event = event("event-feedback", "host", "A");
        event.setOwnerUserId("host");
        event.setAdmins(List.of("host"));
        Users user = user("viewer", activitiesWithAssetAndFeedback(2, 2, 2, 0, 4, 3, 1, 0));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(user));

        stubFeedbackTotalCollection();
        service.applyFeedbackStateTransition(event, "viewer", false, false, true, false);

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.feedback")).isEqualTo(6);
        assertThat(fields.getInteger("activities.eventFeedback.ownEvents")).isEqualTo(4);
        assertThat(fields.getInteger("activities.eventFeedback.pending")).isEqualTo(2);
        assertThat(fields.getInteger("activities.eventFeedback.feedbacked")).isEqualTo(2);
        assertThat(fields.getInteger("activities.eventFeedback.removed")).isZero();
        assertAtomicFeedbackTotal("viewer");
    }

    @Test
    void syncFeedbackEligibilityAddsPendingAndMenuAggregateDeltaOnlyOnce() {
        Instant now = Instant.parse("2026-08-05T09:00:00Z");
        ActivityEvent eligible = event("event-eligible", "host", "A");
        eligible.setOwnerUserId("host");
        eligible.setAdmins(List.of("host"));
        eligible.setAcceptedMemberUserIds(List.of("host", "viewer"));
        eligible.setStartAtIso(now.minusSeconds(10_800L).toString());
        eligible.setEndAtIso(now.minusSeconds(10_800L).toString());
        Users viewer = user("viewer", activitiesWithAssetAndFeedback(0, 0, 0, 0, 4, 0, 2, 1));
        EventFeedbackState alreadyTracked = state("event-eligible", "viewer", "", "");
        alreadyTracked.setEligible(true);
        alreadyTracked.setCounterTracked(true);

        when(activityEventsRepository.findBySourceIdIn(any())).thenReturn(List.of(eligible));
        when(eventFeedbackStatesRepository.findByEventIdInOrderByEventIdAscUpdatedDateDesc(any()))
                .thenReturn(List.of())
                .thenReturn(List.of(alreadyTracked));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(viewer));

        stubFeedbackTotalCollection();
        int firstUpdatedUsers = service.syncFeedbackEligibilityForSourceIds(List.of("event-eligible"), now);
        int secondUpdatedUsers = service.syncFeedbackEligibilityForSourceIds(List.of("event-eligible"), now);

        assertThat(firstUpdatedUsers).isEqualTo(1);
        assertThat(secondUpdatedUsers).isZero();
        ArgumentCaptor<Iterable<EventFeedbackState>> stateCaptor = ArgumentCaptor.forClass(Iterable.class);
        verify(eventFeedbackStatesRepository).saveAll(stateCaptor.capture());
        assertThat(stateCaptor.getValue())
                .singleElement()
                .satisfies(state -> {
                    assertThat(state.getViewerUserId()).isEqualTo("viewer");
                    assertThat(state.getEventId()).isEqualTo("event-eligible");
                    assertThat(state.getEligible()).isTrue();
                    assertThat(state.getCounterTracked()).isTrue();
                });
        ArgumentCaptor<Update> updateCaptor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate, times(1)).updateFirst(any(Query.class), updateCaptor.capture(), eq(Users.class));
        Document fields = updateCaptor.getValue().getUpdateObject().get("$set", Document.class);
        assertThat(fields.getInteger("activities.feedback")).isEqualTo(5);
        assertThat(fields.getInteger("activities.eventFeedback.ownEvents")).isEqualTo(4);
        assertThat(fields.getInteger("activities.eventFeedback.pending")).isEqualTo(1);
        assertThat(fields.getInteger("activities.eventFeedback.feedbacked")).isEqualTo(2);
        assertThat(fields.getInteger("activities.eventFeedback.removed")).isEqualTo(1);
        assertAtomicFeedbackTotal("viewer");
    }

    @Test
    void applyFeedbackStateTransitionAddsOwnEventAndStoredMenuAggregateForNewSubmission() {
        ActivityEvent event = event("event-own", "host", "A");
        event.setOwnerUserId("host");
        event.setAdmins(List.of("host"));
        Users host = user("host", activitiesWithAssetAndFeedback(2, 2, 2, 0, 0, 3, 1, 0));
        when(usersRepository.findByUserIdIn(any())).thenReturn(List.of(host));

        stubFeedbackTotalCollection();
        service.applyFeedbackStateTransition(event, "viewer", false, false, true, false);

        Document fields = updatedFields();
        assertThat(fields.getInteger("activities.feedback")).isEqualTo(4);
        assertThat(fields.getInteger("activities.eventFeedback.ownEvents")).isEqualTo(1);
        assertThat(fields.getInteger("activities.eventFeedback.pending")).isEqualTo(3);
        assertThat(fields.getInteger("activities.eventFeedback.feedbacked")).isEqualTo(1);
        assertThat(fields.getInteger("activities.eventFeedback.removed")).isZero();
        assertAtomicFeedbackTotal("host");
    }

    private void stubFeedbackTotalCollection() {
        when(mongoTemplate.getCollection("users")).thenReturn(usersCollection);
    }

    private void assertAtomicFeedbackTotal(String userId) {
        var total = new Document("$add", List.of(
                new Document("$ifNull", List.of("$activities.eventFeedback.pending", 0)),
                new Document("$ifNull", List.of("$activities.eventFeedback.ownEvents", 0)),
                new Document("$ifNull", List.of("$activities.serviceFeedbackPending", 0))));
        verify(usersCollection).updateOne(new Document("userId", userId),
                List.of(new Document("$set", new Document("activities.feedback", total))));
    }

    private Document updatedFields() {
        ArgumentCaptor<Update> captor = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).updateFirst(any(Query.class), captor.capture(), eq(Users.class));
        return captor.getValue().getUpdateObject().get("$set", Document.class);
    }

    private Users user(String userId, Users.UserActivitiesRecord activities) {
        Users user = new Users();
        user.setUserId(userId);
        user.setActivities(activities);
        return user;
    }

    private Users.UserActivitiesRecord activitiesWithAssetAndFeedback(
            int cars,
            int accommodation,
            int supplies,
            int tickets,
            int ownEvents,
            int pending,
            int feedbacked,
            int removed) {
        return new Users.UserActivitiesRecord(
                0,
                0,
                0,
                0,
                0,
                cars,
                accommodation,
                supplies,
                tickets,
                0,
                pending + ownEvents,
                new Users.UserChatCountersRecord(0, 0, 0, 0, 0, 0),
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(cars, accommodation, supplies, tickets),
                new Users.UserEventFeedbackCountersRecord(ownEvents, pending, feedbacked, removed),
                0,
                0);
    }

    private Asset asset(String type, String status) {
        Asset asset = new Asset();
        asset.setType(type);
        asset.setStatus(status);
        return asset;
    }

    private Asset.AssetRequestRecord assetRequest(String status, String requestKind) {
        return new Asset.AssetRequestRecord(
                status + '-' + requestKind,
                "member",
                "Member",
                "ME",
                "woman",
                status,
                "",
                requestKind,
                "2030-01-01T00:00:00Z",
                null);
    }

    private ActivityEvent event(String sourceId, String creatorUserId, String status) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId(sourceId);
        event.setCreatorUserId(creatorUserId);
        event.setStatus(status);
        return event;
    }

    private EventFeedbackState state(String eventId, String viewerUserId, String submittedAtIso, String organizerNote) {
        EventFeedbackState state = new EventFeedbackState();
        state.setEventId(eventId);
        state.setViewerUserId(viewerUserId);
        state.setSubmittedAtIso(submittedAtIso);
        state.setOrganizerNote(organizerNote);
        state.setRemoved(false);
        return state;
    }
}
