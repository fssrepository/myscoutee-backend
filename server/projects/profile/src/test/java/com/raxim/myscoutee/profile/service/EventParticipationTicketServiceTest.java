package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.EventTicket;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;

@ExtendWith(MockitoExtension.class)
class EventParticipationTicketServiceTest {
    private static final String EVENT_ID = "event-1";
    private static final String CREATOR_ID = "creator";
    private static final String ADMIN_ID = "admin";
    private static final String PARTICIPANT_ID = "participant";

    @Mock
    private ActivityEventsRepository activityEventsRepository;
    @Mock
    private ActivityMembersRepository activityMembersRepository;
    @Mock
    private EventTicketService eventTicketService;

    private EventParticipationTicketService service;

    @BeforeEach
    void setUp() {
        service = new EventParticipationTicketService(
                activityEventsRepository,
                activityMembersRepository,
                eventTicketService);
    }

    @Test
    void queryTicketRecordsExcludesCreatorAndAdminButKeepsAcceptedParticipant() {
        ActivityEvent canonical = ticketEvent(CREATOR_ID);
        ActivityEvent adminRecord = ticketEvent(ADMIN_ID);
        ActivityEvent participantRecord = ticketEvent(PARTICIPANT_ID);
        when(eventTicketService.findActiveForHolder(CREATOR_ID)).thenReturn(List.of(ticket(CREATOR_ID)));
        when(eventTicketService.findActiveForHolder(ADMIN_ID)).thenReturn(List.of(ticket(ADMIN_ID)));
        when(eventTicketService.findActiveForHolder(PARTICIPANT_ID)).thenReturn(List.of(ticket(PARTICIPANT_ID)));
        when(activityEventsRepository.findDirectOwnerEvents(CREATOR_ID)).thenReturn(List.of(canonical));
        when(activityEventsRepository.findDirectOwnerEvents(ADMIN_ID)).thenReturn(List.of(adminRecord));
        when(activityEventsRepository.findDirectOwnerEvents(PARTICIPANT_ID)).thenReturn(List.of(participantRecord));

        assertThat(service.queryTicketRecordsForUser(CREATOR_ID)).isEmpty();
        assertThat(service.queryTicketRecordsForUser(ADMIN_ID)).isEmpty();
        assertThat(service.queryTicketRecordsForUser(PARTICIPANT_ID)).containsExactly(participantRecord);
        assertThat(service.queryTicketSnapshotRecordsForUser(PARTICIPANT_ID))
                .singleElement()
                .satisfies(snapshot -> {
                    assertThat(snapshot.event()).isSameAs(participantRecord);
                    assertThat(snapshot.credential().getHolderUserId()).isEqualTo(PARTICIPANT_ID);
                });
    }

    @Test
    void ticketSyncDoesNotCreateAnOverlayForAnAcceptedAdmin() {
        ActivityEvent canonical = ticketEvent(CREATOR_ID);
        canonical.setAcceptedMemberUserIds(List.of(ADMIN_ID));
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(canonical));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", EVENT_ID))
                .thenReturn(List.of(acceptedMember(ADMIN_ID)));

        service.syncParticipationTicketsForEvent(EVENT_ID);

        verify(activityEventsRepository, never()).saveAll(org.mockito.ArgumentMatchers.anyList());
        verify(eventTicketService).synchronizeForEvent(eq(canonical), eq(Set.of()), any(Instant.class));
    }

    @Test
    void pendingParticipantGetsNoPhysicalTicketUntilApproval() {
        ActivityEvent canonical = ticketEvent(CREATOR_ID);
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(canonical));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", EVENT_ID))
                .thenReturn(List.of(member(PARTICIPANT_ID, "pending")));

        service.syncParticipationTicketsForEvent(EVENT_ID);

        verify(eventTicketService).synchronizeForEvent(eq(canonical), eq(Set.of()), any(Instant.class));
    }

    @Test
    void approvedParticipantIsPassedToPhysicalTicketCreation() {
        ActivityEvent canonical = ticketEvent(CREATOR_ID);
        when(activityEventsRepository.findBySourceId(EVENT_ID)).thenReturn(List.of(canonical));
        when(activityMembersRepository.findByOwnerTypeAndOwnerId("event", EVENT_ID))
                .thenReturn(List.of(acceptedMember(PARTICIPANT_ID)));

        service.syncParticipationTicketsForEvent(EVENT_ID);

        verify(eventTicketService).synchronizeForEvent(
                eq(canonical),
                eq(Set.of(PARTICIPANT_ID)),
                any(Instant.class));
    }

    private ActivityEvent ticketEvent(String ownerUserId) {
        ActivityEvent event = new ActivityEvent();
        event.setId("record-" + ownerUserId);
        event.setSourceId(EVENT_ID);
        event.setOwnerUserId(ownerUserId);
        event.setCreatorUserId(CREATOR_ID);
        event.setAdmins(List.of(CREATOR_ID, ADMIN_ID));
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setTicketing(true);
        return event;
    }

    private ActivityMember acceptedMember(String userId) {
        return member(userId, "accepted");
    }

    private EventTicket ticket(String holderUserId) {
        EventTicket ticket = new EventTicket();
        ticket.setEventId(EVENT_ID);
        ticket.setHolderUserId(holderUserId);
        ticket.setCode("TKT-" + holderUserId);
        ticket.setStatus(EventTicket.STATUS_ACTIVE);
        return ticket;
    }

    private ActivityMember member(String userId, String status) {
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId(EVENT_ID);
        member.setUserId(userId);
        member.setStatus(status);
        return member;
    }
}
