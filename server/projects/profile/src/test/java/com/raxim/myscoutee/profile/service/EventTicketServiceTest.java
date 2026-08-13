package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.EventTicket;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.EventTicketsRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;

@ExtendWith(MockitoExtension.class)
class EventTicketServiceTest {
    private static final String EVENT_ID = "private-event-42";
    private static final String HOLDER_USER_ID = "jane.doe@example.test";
    private static final String SCANNER_USER_ID = "host-user";
    private static final String TICKET_ID = "ticket-document-1";
    private static final String CODE = "TKT-123e4567-e89b-42d3-a456-426614174000";
    private static final Instant NOW = Instant.parse("2026-08-01T10:00:00Z");

    @Mock
    private EventTicketsRepository eventTicketsRepository;
    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private AccessControlService accessControlService;
    @Mock
    private MongoTemplate mongoTemplate;

    private EventTicketService service;

    @BeforeEach
    void setUp() {
        service = new EventTicketService(
                eventTicketsRepository,
                activityEventsRepository,
                activityMembersRepository,
                accessControlService,
                mongoTemplate);
    }

    @Test
    void writeSideActivationIsIdempotentAndIssuesAnOpaquePiiFreeCode() {
        stubEligibleHolder(activeEvent());
        when(eventTicketsRepository.findByEventIdAndHolderUserIdAndStatus(
                EVENT_ID, HOLDER_USER_ID, EventTicket.STATUS_ACTIVE))
                .thenReturn(Optional.empty());
        when(eventTicketsRepository.save(any(EventTicket.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        EventTicket first = service.activateForEligibleHolder(
                " " + EVENT_ID + " ",
                " " + HOLDER_USER_ID + " ",
                NOW);

        when(eventTicketsRepository.findByEventIdAndHolderUserIdAndStatus(
                EVENT_ID, HOLDER_USER_ID, EventTicket.STATUS_ACTIVE))
                .thenReturn(Optional.of(first));
        EventTicket second = service.activateForEligibleHolder(EVENT_ID, HOLDER_USER_ID, NOW.plusSeconds(30));

        assertThat(first).isNotNull();
        assertThat(second).isSameAs(first);
        assertThat(first.getCode())
                .matches("^TKT-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
                .doesNotContain(EVENT_ID)
                .doesNotContain(HOLDER_USER_ID)
                .doesNotContain("jane")
                .doesNotContain("@");
        assertThat(first.getEventId()).isEqualTo(EVENT_ID);
        assertThat(first.getHolderUserId()).isEqualTo(HOLDER_USER_ID);
        assertThat(first.getStatus()).isEqualTo(EventTicket.STATUS_ACTIVE);
        assertThat(first.getIssuedAtIso()).isEqualTo(NOW.toString());
        verify(eventTicketsRepository, times(1)).save(any(EventTicket.class));
    }

    @Test
    void writeSideActivationReturnsTheConcurrentCredentialAfterAUniqueKeyRace() {
        stubEligibleHolder(activeEvent());
        EventTicket concurrent = activeTicket();
        when(eventTicketsRepository.findByEventIdAndHolderUserIdAndStatus(
                EVENT_ID, HOLDER_USER_ID, EventTicket.STATUS_ACTIVE))
                .thenReturn(Optional.empty(), Optional.of(concurrent));
        when(eventTicketsRepository.save(any(EventTicket.class)))
                .thenThrow(new DuplicateKeyException("concurrent issue"));

        EventTicket result = service.activateForEligibleHolder(EVENT_ID, HOLDER_USER_ID, NOW);

        assertThat(result).isSameAs(concurrent);
        verify(eventTicketsRepository, times(1)).save(any(EventTicket.class));
    }

    @Test
    void creatorCannotReceiveAParticipantCredential() {
        ActivityEvent event = activeEvent();
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(event));

        EventTicket result = service.activateForEligibleHolder(EVENT_ID, SCANNER_USER_ID, NOW);

        assertThat(result).isNull();
        verifyNoInteractions(eventTicketsRepository, activityMembersRepository);
    }

    @Test
    void eventAdminCannotReceiveAParticipantCredential() {
        ActivityEvent event = activeEvent();
        event.setAdmins(List.of(HOLDER_USER_ID));
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(event));

        EventTicket result = service.activateForEligibleHolder(EVENT_ID, HOLDER_USER_ID, NOW);

        assertThat(result).isNull();
        verifyNoInteractions(eventTicketsRepository, activityMembersRepository);
    }

    @Test
    void ticketingOffSoftDeletesThePhysicalActiveTicket() {
        ActivityEvent event = activeEvent();
        event.setTicketing(false);
        EventTicket ticket = activeTicket();
        when(eventTicketsRepository.findByEventId(EVENT_ID)).thenReturn(List.of(ticket));

        service.synchronizeForEvent(event, Set.of(HOLDER_USER_ID), NOW);

        assertThat(ticket.getStatus()).isEqualTo(EventTicket.STATUS_DELETED);
        verify(eventTicketsRepository).saveAll(List.of(ticket));
        verify(eventTicketsRepository, never()).save(any(EventTicket.class));
    }

    @Test
    void unpublishedEventSoftDeletesThePhysicalActiveTicketEvenWhenTicketingStaysOn() {
        ActivityEvent event = activeEvent();
        event.setStatus(ActivityEvent.STATUS_DRAFT);
        EventTicket ticket = activeTicket();
        when(eventTicketsRepository.findByEventId(EVENT_ID)).thenReturn(List.of(ticket));

        service.synchronizeForEvent(event, Set.of(HOLDER_USER_ID), NOW);

        assertThat(ticket.getStatus()).isEqualTo(EventTicket.STATUS_DELETED);
        verify(eventTicketsRepository).saveAll(List.of(ticket));
        verify(eventTicketsRepository, never()).save(any(EventTicket.class));
    }

    @Test
    void republishAfterTicketingOffCreatesANewPhysicalTicketAndQrCode() {
        ActivityEvent event = activeEvent();
        EventTicket deleted = activeTicket();
        deleted.setStatus(EventTicket.STATUS_DELETED);
        when(eventTicketsRepository.findByEventId(EVENT_ID)).thenReturn(List.of(deleted));
        when(eventTicketsRepository.findByEventIdAndHolderUserIdAndStatus(
                EVENT_ID, HOLDER_USER_ID, EventTicket.STATUS_ACTIVE))
                .thenReturn(Optional.empty());
        when(eventTicketsRepository.save(any(EventTicket.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        stubEligibleHolder(event);

        service.synchronizeForEvent(event, Set.of(HOLDER_USER_ID), NOW);

        ArgumentCaptor<EventTicket> created = ArgumentCaptor.forClass(EventTicket.class);
        verify(eventTicketsRepository).save(created.capture());
        assertThat(created.getValue().getId()).isNotEqualTo(deleted.getId());
        assertThat(created.getValue().getCode()).isNotEqualTo(deleted.getCode());
        assertThat(created.getValue().getStatus()).isEqualTo(EventTicket.STATUS_ACTIVE);
        assertThat(created.getValue().getIssuedAtIso()).isEqualTo(NOW.toString());
    }

    @Test
    void unauthorizedCheckInDoesNotConsumeTheTicket() {
        EventTicket ticket = activeTicket();
        ActivityEvent event = activeEvent();
        when(eventTicketsRepository.findByCode(CODE)).thenReturn(Optional.of(ticket));
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(event));
        when(accessControlService.canManageEvent(EVENT_ID, SCANNER_USER_ID)).thenReturn(false);

        EventTicketService.CheckInResult result = service.checkIn(CODE, SCANNER_USER_ID, NOW);

        assertThat(result.valid()).isFalse();
        assertThat(result.reason()).isEqualTo("not_authorized");
        assertThat(result.ticket()).isSameAs(ticket);
        assertThat(ticket.getUsedAtIso()).isNull();
        assertThat(ticket.getUsedByUserId()).isNull();
        verify(mongoTemplate, never()).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class));
    }

    @Test
    void firstCheckInAtomicallyConsumesTheTicketAndReturnsValid() {
        EventTicket ticket = activeTicket();
        ActivityEvent event = activeEvent();
        EventTicket consumed = usedTicket(NOW, SCANNER_USER_ID);
        stubValidCheckIn(ticket, event);
        when(mongoTemplate.findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class))).thenReturn(consumed);

        EventTicketService.CheckInResult result = service.checkIn(
                " " + CODE.toUpperCase(java.util.Locale.ROOT) + " ",
                " " + SCANNER_USER_ID + " ",
                NOW);

        assertThat(result.valid()).isTrue();
        assertThat(result.reason()).isEqualTo("valid");
        assertThat(result.ticket()).isSameAs(consumed);
        assertThat(result.event()).isSameAs(event);

        ArgumentCaptor<Query> query = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> update = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).findAndModify(
                query.capture(),
                update.capture(),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class));
        assertThat(query.getValue().getQueryObject().toJson())
                .contains("\"_id\": \"" + TICKET_ID + "\"")
                .contains("\"code\": \"" + CODE + "\"")
                .contains("\"status\": \"A\"")
                .contains("\"usedAtIso\": {\"$exists\": false}")
                .contains("\"usedAtIso\": null")
                .contains("\"usedAtIso\": \"\"");
        assertThat(update.getValue().getUpdateObject().toJson())
                .contains("\"usedAtIso\": \"" + NOW + "\"")
                .contains("\"usedByUserId\": \"" + SCANNER_USER_ID + "\"");

        ArgumentCaptor<Query> memberQuery = ArgumentCaptor.forClass(Query.class);
        ArgumentCaptor<Update> memberUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).findAndModify(
                memberQuery.capture(),
                memberUpdate.capture(),
                any(FindAndModifyOptions.class),
                eq(ActivityMember.class));
        assertThat(memberQuery.getValue().getQueryObject().toJson())
                .contains("\"ownerType\": \"event\"")
                .contains("\"ownerId\": \"" + EVENT_ID + "\"")
                .contains("\"userId\": \"" + HOLDER_USER_ID + "\"")
                .contains("\"status\": \"accepted\"")
                .contains("\"checkedInAtIso\": {\"$exists\": false}")
                .contains("\"checkedInAtIso\": null")
                .contains("\"checkedInAtIso\": \"\"");
        assertThat(memberUpdate.getValue().getUpdateObject().toJson())
                .contains("\"attendanceStatus\": \"checked-in\"")
                .contains("\"checkedInAtIso\": \"" + NOW + "\"")
                .contains("\"checkedInByUserId\": \"" + SCANNER_USER_ID + "\"")
                .contains("\"checkedInTicketId\": \"" + TICKET_ID + "\"")
                .contains("\"updatedDate\": \"" + NOW + "\"")
                .doesNotContain("\"actionAtIso\"")
                .doesNotContain("\"status\":");
    }

    @Test
    void repeatedCheckInReturnsAlreadyUsedAndIdempotentlyRepairsAttendanceFromOriginalUse() {
        Instant originalUse = NOW.minusSeconds(30);
        EventTicket used = usedTicket(originalUse, SCANNER_USER_ID);
        stubValidCheckIn(used, activeEvent());

        EventTicketService.CheckInResult result = service.checkIn(CODE, SCANNER_USER_ID, NOW);

        assertThat(result.valid()).isFalse();
        assertThat(result.reason()).isEqualTo("already_used");
        assertThat(result.ticket()).isSameAs(used);
        verify(mongoTemplate, never()).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class));
        ArgumentCaptor<Update> memberUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).findAndModify(
                any(Query.class),
                memberUpdate.capture(),
                any(FindAndModifyOptions.class),
                eq(ActivityMember.class));
        assertThat(memberUpdate.getValue().getUpdateObject().toJson())
                .contains("\"checkedInAtIso\": \"" + originalUse + "\"")
                .contains("\"checkedInByUserId\": \"" + SCANNER_USER_ID + "\"")
                .contains("\"checkedInTicketId\": \"" + TICKET_ID + "\"");
    }

    @Test
    void casRaceLoserReloadsTheTicketAndReturnsAlreadyUsed() {
        EventTicket ticket = activeTicket();
        ActivityEvent event = activeEvent();
        EventTicket winner = usedTicket(NOW.minusMillis(1), "other-scanner");
        stubValidCheckIn(ticket, event);
        when(mongoTemplate.findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class))).thenReturn(null);
        when(eventTicketsRepository.findById(TICKET_ID)).thenReturn(Optional.of(winner));

        EventTicketService.CheckInResult result = service.checkIn(CODE, SCANNER_USER_ID, NOW);

        assertThat(result.valid()).isFalse();
        assertThat(result.reason()).isEqualTo("already_used");
        assertThat(result.ticket()).isSameAs(winner);
        verify(mongoTemplate, times(1)).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class));
        ArgumentCaptor<Update> memberUpdate = ArgumentCaptor.forClass(Update.class);
        verify(mongoTemplate).findAndModify(
                any(Query.class),
                memberUpdate.capture(),
                any(FindAndModifyOptions.class),
                eq(ActivityMember.class));
        assertThat(memberUpdate.getValue().getUpdateObject().toJson())
                .contains("\"checkedInAtIso\": \"" + NOW.minusMillis(1) + "\"")
                .contains("\"checkedInByUserId\": \"other-scanner\"")
                .contains("\"checkedInTicketId\": \"" + TICKET_ID + "\"");
    }

    @Test
    void malformedCodeIsRejectedBeforeRepositoryAccess() {
        EventTicketService.CheckInResult result = service.checkIn(
                "jane.doe@example.test:private-event-42",
                SCANNER_USER_ID,
                NOW);

        assertThat(result.valid()).isFalse();
        assertThat(result.reason()).isEqualTo("invalid_code");
        assertThat(result.ticket()).isNull();
        verifyNoInteractions(
                eventTicketsRepository,
                activityEventsRepository,
                activityMembersRepository,
                accessControlService,
                mongoTemplate);
    }

    @Test
    void expiredEventRejectsCheckInWithoutConsumingTheTicket() {
        EventTicket ticket = activeTicket();
        ActivityEvent event = activeEvent();
        event.setEndAtIso(NOW.toString());
        stubValidCheckIn(ticket, event);

        EventTicketService.CheckInResult result = service.checkIn(CODE, SCANNER_USER_ID, NOW);

        assertThat(result.valid()).isFalse();
        assertThat(result.reason()).isEqualTo("expired");
        verify(mongoTemplate, never()).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class));
    }

    @Test
    void inactiveEventRejectsCheckInWithoutLookingUpHolderOrConsuming() {
        EventTicket ticket = activeTicket();
        ActivityEvent event = activeEvent();
        event.setStatus(ActivityEvent.STATUS_INACTIVE);
        when(eventTicketsRepository.findByCode(CODE)).thenReturn(Optional.of(ticket));
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(event));
        when(accessControlService.canManageEvent(EVENT_ID, SCANNER_USER_ID)).thenReturn(true);

        EventTicketService.CheckInResult result = service.checkIn(CODE, SCANNER_USER_ID, NOW);

        assertThat(result.valid()).isFalse();
        assertThat(result.reason()).isEqualTo("event_unavailable");
        verifyNoInteractions(activityMembersRepository);
        verify(mongoTemplate, never()).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class));
    }

    @Test
    void nonAcceptedHolderRevokesTheTicketWithoutConsumingIt() {
        EventTicket ticket = activeTicket();
        ActivityEvent event = activeEvent();
        when(eventTicketsRepository.findByCode(CODE)).thenReturn(Optional.of(ticket));
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(event));
        when(accessControlService.canManageEvent(EVENT_ID, SCANNER_USER_ID)).thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                "event",
                EVENT_ID,
                HOLDER_USER_ID)).thenReturn(Optional.empty());

        EventTicketService.CheckInResult result = service.checkIn(CODE, SCANNER_USER_ID, NOW);

        assertThat(result.valid()).isFalse();
        assertThat(result.reason()).isEqualTo("revoked");
        assertThat(result.ticket()).isSameAs(ticket);
        verify(mongoTemplate, never()).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(EventTicket.class));
    }

    private void stubValidCheckIn(EventTicket ticket, ActivityEvent event) {
        when(eventTicketsRepository.findByCode(CODE)).thenReturn(Optional.of(ticket));
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(event));
        when(accessControlService.canManageEvent(EVENT_ID, SCANNER_USER_ID)).thenReturn(true);
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                "event",
                EVENT_ID,
                HOLDER_USER_ID)).thenReturn(Optional.of(member("accepted")));
    }

    private void stubEligibleHolder(ActivityEvent event) {
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(event));
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndUserId(
                "event",
                EVENT_ID,
                HOLDER_USER_ID)).thenReturn(Optional.of(member("accepted")));
    }

    private ActivityEvent activeEvent() {
        ActivityEvent event = new ActivityEvent();
        event.setId("canonical-event-document");
        event.setSourceId(EVENT_ID);
        event.setOwnerUserId(SCANNER_USER_ID);
        event.setCreatorUserId(SCANNER_USER_ID);
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setTicketing(true);
        event.setIsExpired(false);
        event.setEndAtIso(NOW.plusSeconds(3_600).toString());
        event.setUpdatedDate(NOW.minusSeconds(60).toString());
        return event;
    }

    private EventTicket activeTicket() {
        EventTicket ticket = new EventTicket();
        ticket.setId(TICKET_ID);
        ticket.setCode(CODE);
        ticket.setEventId(EVENT_ID);
        ticket.setHolderUserId(HOLDER_USER_ID);
        ticket.setStatus(EventTicket.STATUS_ACTIVE);
        ticket.setIssuedAtIso(NOW.minusSeconds(300).toString());
        return ticket;
    }

    private EventTicket usedTicket(Instant usedAt, String usedByUserId) {
        EventTicket ticket = activeTicket();
        ticket.setUsedAtIso(usedAt.toString());
        ticket.setUsedByUserId(usedByUserId);
        return ticket;
    }

    private ActivityMember member(String status) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(EVENT_ID);
        member.setUserId(HOLDER_USER_ID);
        member.setStatus(status);
        return member;
    }
}
