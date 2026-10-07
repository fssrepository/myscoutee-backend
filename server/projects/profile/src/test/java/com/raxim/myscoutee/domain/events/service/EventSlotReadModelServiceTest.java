package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class EventSlotReadModelServiceTest {
    @Mock
    private ActivityEventsRepository activityEventsRepository;

    private EventSlotReadModelService service;

    @BeforeEach
    void setUp() {
        service = new EventSlotReadModelService(activityEventsRepository);
    }

    @Test
    void refreshParentUpcomingSlotsStoresSortedSlotSummariesOnParentDocuments() {
        ActivityEvent firstParent = parent("event-1", "first");
        ActivityEvent secondParent = parent("event-1", "second");
        ActivityEvent laterSlot = slot("slot-2", "event-1", "2099-06-02T12:00:00Z", 1, 0);
        ActivityEvent earlierSlot = slot("slot-1", "event-1", "2099-06-02T10:00:00Z", 2, 1);

        when(activityEventsRepository.findBySourceIdIn(List.of("event-1")))
                .thenReturn(List.of(firstParent, secondParent));
        when(activityEventsRepository.findByParentEventIdIn(List.of("event-1")))
                .thenReturn(List.of(laterSlot, earlierSlot));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<ActivityEvent> saved = service.refreshParentUpcomingSlots(List.of("event-1"));

        assertThat(saved).hasSize(2);
        assertThat(saved).allSatisfy(parent ->
                assertThat(parent.getUpcomingSlots()).extracting(slot -> slot.id())
                        .containsExactly("slot-1", "slot-2"));
        assertThat(saved.get(0).getUpcomingSlots().get(0).acceptedMembers()).isEqualTo(2);
        assertThat(saved.get(0).getUpcomingSlots().get(0).pendingMembers()).isEqualTo(1);
        verify(activityEventsRepository).saveAll(anyList());
    }

    @Test
    void refreshForChangedEventsUsesSlotParentId() {
        ActivityEvent parent = parent("event-1", "events");
        ActivityEvent changedSlot = slot("slot-1", "event-1", "2099-06-02T10:00:00Z", 2, 1);

        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(parent));
        when(activityEventsRepository.findByParentEventIdIn(List.of("event-1"))).thenReturn(List.of(changedSlot));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        service.refreshForChangedEvents(List.of(changedSlot));

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ActivityEvent>> captor = ArgumentCaptor.forClass(List.class);
        verify(activityEventsRepository).saveAll(captor.capture());
        assertThat(captor.getValue()).singleElement().satisfies(savedParent ->
                assertThat(savedParent.getUpcomingSlots()).extracting(slot -> slot.id()).containsExactly("slot-1"));
    }

    @Test
    void refreshParentUpcomingSlotsUsesCanonicalSlotOnceWhenParticipantOverlayIsActive() {
        ActivityEvent eventParent = parent("event-1", "first");
        ActivityEvent canonicalSlot = slot("slot-1", "event-1", "2099-06-02T10:00:00Z", 2, 0);
        canonicalSlot.setOwnerUserId("creator-1");
        canonicalSlot.setCreatorUserId("creator-1");
        ActivityEvent participantOverlay = slot("slot-1", "event-1", "2099-06-02T10:00:00Z", 9, 0);
        participantOverlay.setId("slot-1-participant-overlay");
        participantOverlay.setOwnerUserId("member-1");
        participantOverlay.setCreatorUserId("creator-1");

        when(activityEventsRepository.findBySourceIdIn(List.of("event-1"))).thenReturn(List.of(eventParent));
        when(activityEventsRepository.findByParentEventIdIn(List.of("event-1")))
                .thenReturn(List.of(participantOverlay, canonicalSlot));
        when(activityEventsRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<ActivityEvent> saved = service.refreshParentUpcomingSlots(List.of("event-1"));

        assertThat(saved).singleElement().satisfies(savedParent -> {
            assertThat(savedParent.getUpcomingSlots()).extracting(slot -> slot.id()).containsExactly("slot-1");
            assertThat(savedParent.getUpcomingSlots().get(0).acceptedMembers()).isEqualTo(2);
        });
    }

    private ActivityEvent parent(String sourceId, String suffix) {
        ActivityEvent event = new ActivityEvent();
        event.setId(sourceId + "-" + suffix);
        event.setSourceId(sourceId);
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setSlotsEnabled(true);
        event.setSlotTemplates(List.of(new EventSlotTemplateDto("template-1", "2099-06-02T10:00:00Z", null, false, List.of())));
        event.setGenerated(false);
        event.setEventType("main");
        return event;
    }

    private ActivityEvent slot(String sourceId, String parentEventId, String startAtIso, int acceptedMembers, int pendingMembers) {
        ActivityEvent event = new ActivityEvent();
        event.setId(sourceId + "-document");
        event.setSourceId(sourceId);
        event.setParentEventId(parentEventId);
        event.setSlotTemplateId("template-1");
        event.setTitle(sourceId);
        event.setStartAtIso(startAtIso);
        event.setEndAtIso(startAtIso.replace("T10:", "T11:").replace("T12:", "T13:"));
        event.setCapacityTotal(10);
        event.setAcceptedMembers(acceptedMembers);
        event.setPendingMembers(pendingMembers);
        event.setGenerated(true);
        event.setEventType("slot");
        return event;
    }
}
