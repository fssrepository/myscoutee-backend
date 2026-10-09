package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.media.api.MediaCleanup;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Tag("standard")
class EventPrivacyOwnershipTest {
    @Test void discoveryDeduplicatesAndExportsOnlyStoredIdentifiers() {
        var events = mock(ActivityEventsRepository.class);
        var event = new ActivityEvent(); event.setId("document"); event.setSourceId("source");
        when(events.findByOwnerUserId("user")).thenReturn(List.of(event));
        when(events.findByCreatorUserId("user")).thenReturn(List.of(event));
        var owner = new EventPrivacyService(events, mock(ActivityMembersRepository.class), mock(MongoTemplate.class), mock(MediaCleanup.class));
        assertEquals(List.of(new EventPurgeTargetDto("document", "source")), owner.findOwnedEventsForPurge("user"));
    }
    @Test void failedMediaDeletionKeepsNativeDocumentsAndMembershipsForExistingJobRetry() {
        var events = mock(ActivityEventsRepository.class);
        var members = mock(ActivityMembersRepository.class);
        var media = mock(MediaCleanup.class);
        var event = new ActivityEvent(); event.setId("document"); event.setImageUrl("stored-media");
        when(events.findAllById(List.of("document"))).thenReturn(List.of(event));
        doThrow(new IllegalStateException("unavailable")).when(media).deletePublicObjectOrThrow("stored-media");
        var owner = new EventPrivacyService(events, members, mock(MongoTemplate.class), media);
        assertThrows(IllegalStateException.class, () -> owner.purgeOwnedEvents(List.of("document"), List.of("source")));
        verify(events, never()).deleteAll(any(Iterable.class));
        verifyNoInteractions(members);
    }
    @Test void retryWithAlreadyRemovedDocumentsStillCleansPersistedMembershipSources() {
        var events = mock(ActivityEventsRepository.class);
        var members = mock(ActivityMembersRepository.class);
        var media = mock(MediaCleanup.class);
        when(events.findAllById(List.of("document"))).thenReturn(List.of());
        var member = new ActivityMember(); member.setId("membership");
        when(members.findByOwnerTypeAndOwnerIdIn("event", List.of("persisted-source"))).thenReturn(List.of(member));
        var owner = new EventPrivacyService(events, members, mock(MongoTemplate.class), media);
        owner.purgeOwnedEvents(List.of("document"), List.of("persisted-source"));
        verify(members).deleteAll(List.of(member));
        verifyNoInteractions(media);
    }
}
