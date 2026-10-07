package com.raxim.myscoutee.domain.events.service;

import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.accounts.service.UserActivityCountersService;
import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InOrder;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackQueryDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackCardDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackDetailDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackPageQueryDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackPageResultDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackSubmitRequestDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.EventFeedbackAnswer;
import com.raxim.myscoutee.domain.events.document.EventFeedbackState;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMingleRoundsRepository;
import com.raxim.myscoutee.domain.events.document.ActivityMingleRound;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackStatesRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.security.AccessControlService;
import com.raxim.myscoutee.domain.events.mapper.EventFeedbackStatMapper;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class ActivitiesEventFeedbackServiceTest {
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMingleRoundsRepository mingleRoundsRepository;
    @Mock
    private EventFeedbackStatesRepository eventFeedbackStatesRepository;
    @Mock
    private EventFeedbackAnswersRepository eventFeedbackAnswersRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private AffinityRecomputeTaskService affinityRecomputeTaskService;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private UserActivityCountersService userActivityCountersService;
    @Mock
    private EventFeedbackStatMapper eventFeedbackStatMapper;
    @Mock
    private NotificationOutboxService notificationOutboxService;

    private ActivitiesEventFeedbackService service;

    @BeforeEach
    void setUp() {
        service = new ActivitiesEventFeedbackService(
                homeUserProfileService,
                activityEventsRepository,
                mingleRoundsRepository,
                eventFeedbackStatesRepository,
                eventFeedbackAnswersRepository,
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                affinityRecomputeTaskService,
                adminTelemetryService,
                accessControlService,
                userActivityCountersService,
                eventFeedbackStatMapper,
                notificationOutboxService);
    }

    @Test
    void mingleFeedbackUnionsSharedTablesAcrossRoundsWithoutDuplicatesOrFivePersonLimit() {
        ActivityEvent event = finishedFeedbackEvent("Mingle");
        Users viewer = feedbackUser("viewer");
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(activityEventsRepository.findAcceptedMembershipEvents("viewer")).thenReturn(List.of(event));
        when(usersRepository.findByUserIdIn(anyCollection())).thenAnswer(invocation -> {
            java.util.Collection<String> ids = invocation.getArgument(0);
            return ids.stream().map(this::feedbackUser).toList();
        });
        when(mingleRoundsRepository.findByEventIdInAndStatusOrderByRoundNumberAsc(Set.of("event-1"), "COMPLETED"))
                .thenReturn(List.of(
                        feedbackRound(1, List.of("viewer", "peer-1", "peer-2"), List.of("outsider")),
                        feedbackRound(2, List.of("peer-2", "viewer", "peer-3", "peer-4")),
                        feedbackRound(3, List.of("peer-5", "peer-6", "viewer", "peer-1"))));

        EventFeedbackDetailDto detail = service.loadDetail(new EventFeedbackQueryDto("viewer", "event-1"));
        EventFeedbackPageResultDto page = service.loadPage(new EventFeedbackPageQueryDto("viewer", "pending", 0, 20));

        assertThat(detail.cards()).filteredOn(card -> "attendee".equals(card.kind()))
                .extracting(EventFeedbackCardDto::targetUserId)
                .containsExactly("peer-1", "peer-2", "peer-3", "peer-4", "peer-5", "peer-6");
        assertThat(page.items()).singleElement().satisfies(item -> {
            assertThat(item.totalCards()).isEqualTo(detail.cards().size());
            assertThat(item.pendingCards()).isEqualTo(7);
        });
    }

    @Test
    void mingleWithoutSharedCompletedTablesDoesNotFallBackToEventMembers() {
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(feedbackUser("viewer"));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(finishedFeedbackEvent("Mingle")));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                feedbackUser("viewer"), feedbackUser("host"), feedbackUser("outsider")));

        EventFeedbackDetailDto detail = service.loadDetail(new EventFeedbackQueryDto("viewer", "event-1"));

        assertThat(detail.cards()).extracting(EventFeedbackCardDto::targetUserId).containsExactly("host");
        verify(mingleRoundsRepository).findByEventIdInAndStatusOrderByRoundNumberAsc(Set.of("event-1"), "COMPLETED");
    }

    @ParameterizedTest
    @ValueSource(strings = {"Casual", "Tournament"})
    void ordinaryEventFeedbackStillUsesItsMembers(String mode) {
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(feedbackUser("viewer"));
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(finishedFeedbackEvent(mode)));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                feedbackUser("viewer"), feedbackUser("host"), feedbackUser("outsider")));

        EventFeedbackDetailDto detail = service.loadDetail(new EventFeedbackQueryDto("viewer", "event-1"));

        assertThat(detail.cards()).extracting(EventFeedbackCardDto::targetUserId).containsExactly("host", "outsider");
        verifyNoInteractions(mingleRoundsRepository);
    }

    @Test
    void mingleRejectsSubmittedFeedbackForAnotherTableBeforeSaving() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(feedbackUser("viewer"));
        when(accessControlService.canCurrentActorSubmitEventFeedback("viewer", "event-1")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(finishedFeedbackEvent("Mingle")));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                feedbackUser("viewer"), feedbackUser("host"), feedbackUser("outsider"), feedbackUser("peer")));
        when(mingleRoundsRepository.findByEventIdInAndStatusOrderByRoundNumberAsc(Set.of("event-1"), "COMPLETED"))
                .thenReturn(List.of(feedbackRound(1, List.of("viewer", "peer"), List.of("outsider"))));

        assertThatThrownBy(() -> service.submit(new EventFeedbackSubmitRequestDto("viewer",
                new EventFeedbackDetailDto("event-1", "Finished Event", "", "", List.of(attendeeFeedback("outsider"))))))
                .hasMessageContaining("Invalid feedback target");

        verifyNoInteractions(eventFeedbackAnswersRepository, eventFeedbackStatesRepository,
                userActivityCountersService, affinityRecomputeTaskService, notificationOutboxService);
    }

    @Test
    void mingleSharedTableFeedbackUsesExistingAnswerPersistenceAndReload() {
        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(feedbackUser("viewer"));
        when(accessControlService.canCurrentActorSubmitEventFeedback("viewer", "event-1")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(finishedFeedbackEvent("Mingle")));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(
                feedbackUser("viewer"), feedbackUser("host"), feedbackUser("peer")));
        when(mingleRoundsRepository.findByEventIdInAndStatusOrderByRoundNumberAsc(Set.of("event-1"), "COMPLETED"))
                .thenReturn(List.of(feedbackRound(1, List.of("viewer", "peer"))));
        AtomicReference<List<EventFeedbackAnswer>> saved = new AtomicReference<>(List.of());
        when(eventFeedbackAnswersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<EventFeedbackAnswer> answers = List.copyOf(invocation.getArgument(0));
            saved.set(answers);
            return answers;
        });
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenAnswer(ignored -> saved.get());

        EventFeedbackDetailDto reloaded = service.submit(new EventFeedbackSubmitRequestDto("viewer",
                new EventFeedbackDetailDto("event-1", "Finished Event", "", "", List.of(attendeeFeedback("peer")))));

        assertThat(reloaded.cards()).filteredOn(card -> "attendee".equals(card.kind())).singleElement()
                .satisfies(card -> {
                    assertThat(card.targetUserId()).isEqualTo("peer");
                    assertThat(card.answerPrimary()).isEqualTo("great");
                    assertThat(card.selectedTraitIds()).containsExactly("reliable-one");
                });
        assertThat(saved.get()).singleElement().satisfies(answer -> {
            assertThat(answer.getEventId()).isEqualTo("event-1");
            assertThat(answer.getTargetUserId()).isEqualTo("peer");
        });
    }

    private ActivityEvent finishedFeedbackEvent(String mode) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Finished Event");
        event.setMode(mode);
        event.setCreatorUserId("host");
        event.setOwnerUserId("host");
        event.setAcceptedMemberUserIds(List.of("viewer", "outsider"));
        event.setStartAtIso("2020-01-01T10:00:00Z");
        event.setEndAtIso("2020-01-01T12:00:00Z");
        return event;
    }

    private Users feedbackUser(String id) {
        Users user = new Users();
        user.setUserId(id);
        user.setName(id);
        return user;
    }

    @SafeVarargs
    private ActivityMingleRound feedbackRound(int number, List<String>... tables) {
        ActivityMingleRound round = new ActivityMingleRound();
        round.setEventId("event-1");
        round.setRoundNumber(number);
        round.setStatus("COMPLETED");
        round.setTables(java.util.stream.IntStream.range(0, tables.length)
                .mapToObj(index -> new ActivityMingleRound.TableAssignment(index + 1, tables[index])).toList());
        return round;
    }

    private EventFeedbackCardDto attendeeFeedback(String userId) {
        return new EventFeedbackCardDto("feedback-attendee-event-1-" + userId, "event-1", "attendee", userId,
                userId, "Member", "Finished Event", "", "", "", "", "", userId, null, "", "", "", "",
                "great", "clear", "", List.of("reliable-one"));
    }

    @Test
    void submitRejectsDeniedUserBeforeSavingFeedback() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorSubmitEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.submit(new EventFeedbackSubmitRequestDto(
                "u1",
                new EventFeedbackDetailDto(
                        "event-1",
                        "Event",
                        "2026-06-02T00:00:00Z",
                        "",
                        List.of(new EventFeedbackCardDto(
                                "card-1",
                                "event-1",
                                "event",
                                null,
                                "host",
                                "Admin",
                                "Event",
                                "",
                                "",
                                "",
                                "",
                                "",
                                "Host",
                                null,
                                "",
                                "",
                                "",
                                "",
                                "great",
                                "clear",
                                "A concise event opinion.",
                                List.of("reliable-one")))))))
                .hasMessageContaining("submit feedback");

        verifyNoInteractions(
                eventFeedbackStatesRepository,
                eventFeedbackAnswersRepository,
                affinityRecomputeTaskService,
                adminTelemetryService,
                notificationOutboxService);
    }

    @Test
    void loadPagePreservesEmptyEventImageForTheSharedNeutralPlaceholder() {
        Users viewer = new Users();
        viewer.setUserId("viewer");
        viewer.setName("Viewer");
        Users host = new Users();
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Finished Event");
        event.setCreatorUserId("host");
        event.setOwnerUserId("host");
        event.setAcceptedMemberUserIds(List.of("viewer"));
        event.setStartAtIso("2020-01-01T10:00:00Z");
        event.setEndAtIso("2020-01-01T12:00:00Z");
        event.setImageUrl("");

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findAcceptedMembershipEvents("viewer")).thenReturn(List.of(event));
        when(activityEventsRepository.findAdminVisibleEvents("viewer")).thenReturn(List.of());
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdOrderByUpdatedDateDesc("viewer"))
                .thenReturn(List.of());
        when(eventFeedbackAnswersRepository.findByViewerUserIdOrderByEventIdAscSubmittedAtIsoDesc("viewer"))
                .thenReturn(List.of());

        EventFeedbackPageResultDto page = service.loadPage(
                new EventFeedbackPageQueryDto("viewer", "pending", 0, 20));

        assertThat(page.items()).singleElement().satisfies(item -> assertThat(item.imageUrl()).isEmpty());
    }

    @Test
    void loadPageIncludesFeedbackReadyOwnEventBeforeAnyResponses() {
        Users host = new Users();
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-own");
        event.setTitle("Feedback-ready Event");
        event.setCreatorUserId("host");
        event.setOwnerUserId("host");
        event.setAdmins(List.of("host"));
        event.setStartAtIso("2020-01-01T10:00:00Z");
        event.setEndAtIso("2020-01-01T12:00:00Z");
        event.setImageUrl("/media/event-own.webp");

        when(homeUserProfileService.resolveCurrentUser("host")).thenReturn(host);
        when(activityEventsRepository.findAcceptedMembershipEvents("host")).thenReturn(List.of());
        when(activityEventsRepository.findAdminVisibleEvents("host")).thenReturn(List.of(event));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(host));
        when(eventFeedbackStatesRepository.findByViewerUserIdOrderByUpdatedDateDesc("host"))
                .thenReturn(List.of());
        when(eventFeedbackAnswersRepository.findByViewerUserIdOrderByEventIdAscSubmittedAtIsoDesc("host"))
                .thenReturn(List.of());
        when(eventFeedbackStatesRepository.findByEventIdInOrderByEventIdAscUpdatedDateDesc(List.of("event-own")))
                .thenReturn(List.of());
        when(eventFeedbackAnswersRepository.findByEventIdInOrderByEventIdAscSubmittedAtIsoDesc(List.of("event-own")))
                .thenReturn(List.of());

        EventFeedbackPageResultDto page = service.loadPage(
                new EventFeedbackPageQueryDto("host", "own-events", 0, 20));

        assertThat(page.items()).singleElement().satisfies(item -> {
            assertThat(item.eventId()).isEqualTo("event-own");
            assertThat(item.imageUrl()).isEqualTo("/media/event-own.webp");
            assertThat(item.pendingCards()).isZero();
            assertThat(item.totalCards()).isZero();
            assertThat(item.isOwnEvent()).isTrue();
        });
        assertThat(page.counts().ownEvents()).isZero();
    }

    @Test
    void loadDetailPrefersLaterCanonicalEventOverLargerMemberScopedCopy() {
        Users viewer = new Users();
        viewer.setUserId("viewer");
        viewer.setName("Viewer");
        Users host = new Users();
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent canonical = new ActivityEvent();
        canonical.setSourceId("event-1");
        canonical.setTitle("Finished Event");
        canonical.setCreatorUserId("host");
        canonical.setOwnerUserId("host");
        canonical.setAcceptedMemberUserIds(List.of("viewer"));
        canonical.setStartAtIso("2020-01-01T10:00:00Z");
        canonical.setEndAtIso("2020-01-01T12:00:00Z");

        ActivityEvent memberScoped = new ActivityEvent();
        memberScoped.setSourceId("event-1");
        memberScoped.setTitle("Finished Event");
        memberScoped.setCreatorUserId("host");
        memberScoped.setOwnerUserId("viewer");
        memberScoped.setAcceptedMemberUserIds(List.of("viewer", "participant-2", "participant-3"));
        memberScoped.setStartAtIso("2020-01-01T10:00:00Z");
        memberScoped.setEndAtIso("2020-01-01T12:00:00Z");

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceId("event-1"))
                .thenReturn(List.of(memberScoped, canonical));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(Optional.empty());
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(List.of());

        EventFeedbackDetailDto detail = service.loadDetail(
                new com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackQueryDto("viewer", "event-1"));

        assertThat(detail.eventId()).isEqualTo("event-1");
        assertThat(detail.cards()).singleElement().satisfies(card -> {
            assertThat(card.kind()).isEqualTo("event");
            assertThat(card.targetUserId()).isEqualTo("host");
        });
    }

    @Test
    void loadDetailHydratesLegacyAnswerByKindAndTargetWhenCardIdChanged() {
        Users viewer = new Users();
        viewer.setUserId("viewer");
        viewer.setName("Viewer");
        Users host = new Users();
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent event = new ActivityEvent();
        event.setSourceId("event-1");
        event.setTitle("Finished Event");
        event.setCreatorUserId("host");
        event.setOwnerUserId("host");
        event.setAcceptedMemberUserIds(List.of("viewer"));
        event.setStartAtIso("2020-01-01T10:00:00Z");
        event.setEndAtIso("2020-01-01T12:00:00Z");

        EventFeedbackState state = new EventFeedbackState();
        state.setViewerUserId("viewer");
        state.setEventId("event-1");
        state.setSubmittedAtIso("2026-07-23T18:00:00Z");

        EventFeedbackAnswer answer = new EventFeedbackAnswer();
        answer.setCardId("legacy-host-card");
        answer.setEventId("event-1");
        answer.setViewerUserId("viewer");
        answer.setKind("event");
        answer.setTargetUserId("host");
        answer.setPrimaryValue("excellent");
        answer.setSecondaryValue("resources");
        answer.setPersonalityTraitIds(List.of("reliable-one"));

        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(event));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(java.util.Optional.of(state));
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(List.of(answer));

        EventFeedbackDetailDto detail = service.loadDetail(
                new com.raxim.myscoutee.domain.events.dto.EventsDtos.EventFeedbackQueryDto("viewer", "event-1"));

        assertThat(detail.submittedAtIso()).isEqualTo("2026-07-23T18:00:00Z");
        assertThat(detail.cards()).hasSize(1);
        assertThat(detail.cards().getFirst().answerPrimary()).isEqualTo("excellent");
        assertThat(detail.cards().getFirst().answerSecondary()).isEqualTo("resources");
        assertThat(detail.cards().getFirst().selectedTraitIds()).containsExactly("reliable-one");
    }

    @Test
    void submitReturnsMongoReloadedDetailAfterAnswersAndStateAreSaved() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setUserId("viewer");
        viewer.setName("Viewer");
        Users host = new Users();
        host.setId("host");
        host.setUserId("host");
        host.setName("Host");

        ActivityEvent source = new ActivityEvent();
        source.setSourceId("event-1");
        source.setTitle("Finished Event");
        source.setCreatorUserId("host");
        source.setOwnerUserId("host");
        source.setAcceptedMemberUserIds(List.of("viewer"));
        source.setStartAtIso("2020-01-01T10:00:00Z");
        source.setEndAtIso("2020-01-01T12:00:00Z");

        EventFeedbackCardDto card = new EventFeedbackCardDto(
                "feedback-event-event-1",
                "event-1",
                "event",
                null,
                "host",
                "Admin",
                "Finished Event",
                "",
                "",
                "",
                "2020-01-01T10:00:00Z",
                "",
                "Host",
                null,
                "",
                "man",
                "",
                "",
                "excellent",
                "resources",
                "A focused and welcoming event.",
                List.of("reliable-one"));
        AtomicReference<EventFeedbackState> persistedState = new AtomicReference<>();
        AtomicReference<List<EventFeedbackAnswer>> persistedAnswers = new AtomicReference<>(List.of());

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(accessControlService.canCurrentActorSubmitEventFeedback("viewer", "event-1")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(source));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(Optional.empty(), Optional.empty())
                .thenAnswer(ignored -> Optional.ofNullable(persistedState.get()));
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventIdAndCardId(
                "viewer",
                "event-1",
                "feedback-event-event-1"))
                .thenReturn(Optional.empty());
        when(eventFeedbackAnswersRepository.saveAll(anyList())).thenAnswer(invocation -> {
            List<EventFeedbackAnswer> answers = List.copyOf(invocation.getArgument(0));
            persistedAnswers.set(answers);
            return answers;
        });
        when(eventFeedbackStatesRepository.save(any(EventFeedbackState.class))).thenAnswer(invocation -> {
            EventFeedbackState state = invocation.getArgument(0);
            persistedState.set(state);
            return state;
        });
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenAnswer(ignored -> persistedAnswers.get());

        EventFeedbackDetailDto persisted = service.submit(new EventFeedbackSubmitRequestDto(
                "viewer",
                new EventFeedbackDetailDto(
                        "event-1",
                        "Finished Event",
                        "2026-07-23T18:00:00Z",
                        "",
                        List.of(card))));

        assertThat(persisted.submittedAtIso()).isEqualTo("2026-07-23T18:00:00Z");
        assertThat(persisted.cards()).hasSize(1);
        assertThat(persisted.cards().getFirst().answerPrimary()).isEqualTo("excellent");
        assertThat(persisted.cards().getFirst().answerSecondary()).isEqualTo("resources");
        assertThat(persisted.cards().getFirst().eventComment()).isEqualTo("A focused and welcoming event.");

        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        NotificationIntent intent = intentCaptor.getValue();
        assertThat(intent.type()).isEqualTo("event-feedback-submitted");
        assertThat(intent.entityType()).isEqualTo("event");
        assertThat(intent.entityId()).isEqualTo("event-1");
        assertThat(intent.recipientScope()).isEqualTo("feedback-targets");
        assertThat(intent.recipientUserIds()).containsExactly("host");
        assertThat(intent.recipientUserIds()).doesNotContain("viewer");
        assertThat(intent.clickUrl()).isEqualTo("/game");
        assertThat(intent.createdUser()).isEqualTo("viewer");
        assertThat(intent.payload())
                .containsEntry("eventId", "event-1")
                .containsEntry("eventTitle", "Finished Event")
                .containsEntry("senderUserId", "viewer");

        InOrder persistenceOrder = inOrder(
                eventFeedbackAnswersRepository,
                eventFeedbackStatesRepository,
                notificationOutboxService);
        persistenceOrder.verify(eventFeedbackAnswersRepository).saveAll(anyList());
        persistenceOrder.verify(eventFeedbackStatesRepository).save(any(EventFeedbackState.class));
        persistenceOrder.verify(notificationOutboxService).enqueue(any(NotificationIntent.class));
    }

    @Test
    void resubmittingAlreadySubmittedFeedbackDoesNotDuplicateBellNotification() {
        Users viewer = new Users();
        viewer.setId("viewer");
        viewer.setUserId("viewer");
        Users host = new Users();
        host.setId("host");
        host.setUserId("host");

        ActivityEvent source = new ActivityEvent();
        source.setSourceId("event-1");
        source.setTitle("Finished Event");
        source.setCreatorUserId("host");
        source.setOwnerUserId("host");
        source.setAcceptedMemberUserIds(List.of("viewer"));
        source.setStartAtIso("2020-01-01T10:00:00Z");
        source.setEndAtIso("2020-01-01T12:00:00Z");

        EventFeedbackState existingState = new EventFeedbackState();
        existingState.setViewerUserId("viewer");
        existingState.setEventId("event-1");
        existingState.setSubmittedAtIso("2026-07-23T17:00:00Z");

        when(homeUserProfileService.resolveSelectedUserId("viewer")).thenReturn("viewer");
        when(homeUserProfileService.resolveCurrentUser("viewer")).thenReturn(viewer);
        when(accessControlService.canCurrentActorSubmitEventFeedback("viewer", "event-1")).thenReturn(true);
        when(activityEventsRepository.findBySourceId("event-1")).thenReturn(List.of(source));
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(viewer, host));
        when(eventFeedbackStatesRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(Optional.of(existingState));
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventIdAndCardId(
                "viewer",
                "event-1",
                "feedback-event-event-1"))
                .thenReturn(Optional.empty());
        when(eventFeedbackAnswersRepository.findByViewerUserIdAndEventId("viewer", "event-1"))
                .thenReturn(List.of());

        service.submit(new EventFeedbackSubmitRequestDto(
                "viewer",
                new EventFeedbackDetailDto(
                        "event-1",
                        "Finished Event",
                        "2026-07-23T18:00:00Z",
                        "",
                        List.of(new EventFeedbackCardDto(
                                "feedback-event-event-1",
                                "event-1",
                                "event",
                                null,
                                "host",
                                "Admin",
                                "Finished Event",
                                "",
                                "",
                                "",
                                "2020-01-01T10:00:00Z",
                                "",
                                "Host",
                                null,
                                "",
                                "",
                                "",
                                "",
                                "excellent",
                                "resources",
                                "",
                                List.of())))));

        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void saveNoteRejectsDeniedUserBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorSaveEventFeedbackNote("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.saveNote(new EventFeedbackNoteRequestDto("u1", "event-1", "Needs better timing.")))
                .hasMessageContaining("feedback note");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }

    @Test
    void removeRejectsDeniedUserBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorRemoveEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.markRemoved(new EventFeedbackToggleRequestDto("u1", "event-1"), true))
                .hasMessageContaining("feedback state");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }

    @Test
    void restoreRejectsDeniedUserBeforeSavingState() {
        when(homeUserProfileService.resolveSelectedUserId("u1")).thenReturn("u1");
        when(accessControlService.canCurrentActorRestoreEventFeedback("u1", "event-1")).thenReturn(false);

        assertThatThrownBy(() -> service.markRemoved(new EventFeedbackToggleRequestDto("u1", "event-1"), false))
                .hasMessageContaining("feedback state");

        verifyNoInteractions(eventFeedbackStatesRepository, eventFeedbackAnswersRepository);
    }
}
