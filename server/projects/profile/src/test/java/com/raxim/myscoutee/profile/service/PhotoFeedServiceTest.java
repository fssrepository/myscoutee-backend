package com.raxim.myscoutee.profile.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.ArgumentCaptor;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.PhotoFeedPost;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.feed.PhotoFeedDtos.*;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageEventReference;
import com.raxim.myscoutee.profile.repository.PhotoFeedRepository;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PhotoFeedServiceTest {
    private final PhotoFeedRepository repository = mock(PhotoFeedRepository.class);
    private final PhotoFeedService service = new PhotoFeedService(repository);
    private final ActivitiesEventsService events = mock(ActivitiesEventsService.class);
    private final ImageEventReference event = new ImageEventReference("event", "Event", "organizer", "Organizer", "Budapest");
    @BeforeEach void setUp() {
        org.springframework.test.util.ReflectionTestUtils.setField(service, "events", events);
        when(events.queryFeedEventOptions("alice")).thenReturn(List.of(new EventOption(event, "", "")));
        when(repository.counters("alice")).thenReturn(Users.FeedCountersRecord.empty());
    }
    private final Users actor = actor();
    private static Users actor() {
        var user = new Users(); user.setUserId("alice"); user.setName("Alice");
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(47.5, 19.0)); return user;
    }
    private static String image(String owner, int index) { return "/api/media/private?key=images%2F" + owner + "%2Fpost%2F" + index + "%2Foriginal"; }
    @Test void savesFiveImagesWithAuthenticatedCreatorAndMetadata() {
        when(repository.insert(any())).thenAnswer(call -> call.getArgument(0));
        var images = java.util.stream.IntStream.range(0, 5).mapToObj(i -> image("alice", i)).toList();
        var details = images.stream().collect(java.util.stream.Collectors.toMap(image -> image,
                image -> new ImageDetailsDto("Budapest", "First photo", event)));
        var result = service.create(actor, new Create("someone-else", UUID.randomUUID().toString(), images, details));
        assertEquals("alice", result.creatorUserId()); assertEquals(images, result.imageUrls()); assertEquals(details, result.imageDetails());
        var saved = ArgumentCaptor.forClass(PhotoFeedPost.class); verify(repository).insert(saved.capture());
        assertEquals(19.0, saved.getValue().locationGeo().getX()); assertEquals(47.5, saved.getValue().locationGeo().getY());
    }
    @Test void requiresAnAccessibleEventForEveryImageAndDoesNotTrustSuppliedOrganizer() {
        String first = image("alice", 0), second = image("alice", 1);
        assertThrows(ResponseStatusException.class, () -> service.create(actor,
                new Create("alice", UUID.randomUUID().toString(), List.of(first, second),
                        Map.of(first, new ImageDetailsDto("", "", event)))));
        var unknown = new ImageEventReference("unknown", "", "", "", "");
        assertThrows(ResponseStatusException.class, () -> service.create(actor,
                new Create("alice", UUID.randomUUID().toString(), List.of(first),
                        Map.of(first, new ImageDetailsDto("", "", unknown)))));
        verify(repository, never()).insert(any());
        when(repository.insert(any())).thenAnswer(call -> call.getArgument(0));
        var forged = new ImageEventReference("event", "Forged", "alice", "Alice", "Elsewhere");
        var saved = service.create(actor, new Create("alice", UUID.randomUUID().toString(), List.of(first),
                Map.of(first, new ImageDetailsDto("Elsewhere", "Photo", forged))));
        assertEquals("alice", saved.creatorUserId());
        assertEquals(event, saved.imageDetails().get(first).event());
        assertEquals("Budapest", saved.imageDetails().get(first).location());
    }
    @Test void forbidsPublishingOtherUsersPrivateImages() {
        assertThrows(ResponseStatusException.class, () -> service.create(actor,
                new Create("alice", UUID.randomUUID().toString(), List.of(image("bob", 0)), Map.of())));
        verify(repository, never()).insert(any());
    }
    @Test void validatesImageLimitAndCaptionLength() {
        var images = java.util.stream.IntStream.range(0, 6).mapToObj(i -> image("alice", i)).toList();
        assertThrows(ResponseStatusException.class, () -> service.create(actor, new Create("alice", UUID.randomUUID().toString(), images, Map.of())));
        assertThrows(ResponseStatusException.class, () -> service.create(actor, new Create("alice", UUID.randomUUID().toString(), List.of(images.getFirst()),
                Map.of(images.getFirst(), new ImageDetailsDto("", "x".repeat(41))))));
        verify(repository, never()).insert(any());
    }
    @Test void retryReturnsSavedPostWithoutCreatingDuplicates() {
        var id = UUID.randomUUID().toString();
        var saved = new PhotoFeedPost(id, "alice", "Alice", "", "2026-09-22T10:00:00Z", List.of(image("alice", 0)), Map.of(), null);
        when(repository.find(id)).thenReturn(saved);
        assertEquals(id, service.create(actor, new Create("alice", id, saved.imageUrls(), Map.of())).id());
        verify(repository, never()).insert(any());
    }
    @Test void rejectsIdBelongingToAnotherAuthor() {
        var id = UUID.randomUUID().toString();
        when(repository.find(id)).thenReturn(new PhotoFeedPost(id, "bob", "Bob", "", "", List.of(), Map.of(), null));
        assertThrows(ResponseStatusException.class, () -> service.create(actor, new Create("alice", id, List.of(image("alice", 0)), Map.of())));
    }
    @Test void noLocationCannotPublishOrQuery() {
        actor.setLocationCoordinates(null);
        assertThrows(ResponseStatusException.class, () -> service.page(actor, 10, null));
        assertThrows(ResponseStatusException.class, () -> service.create(actor, new Create("alice", UUID.randomUUID().toString(), List.of(image("alice", 0)), Map.of())));
        verifyNoInteractions(repository);
    }
    @Test void pageBoundsAndCursorAreStable() {
        var id = UUID.randomUUID().toString();
        var post = new PhotoFeedPost(id, "alice", "Alice", "", "2026-09-22T10:00:00Z", List.of(image("alice", 0)), Map.of(), null);
        var located = new PhotoFeedRepository.LocatedPost(post, 7.2);
        when(repository.page("alice", "public", 47.5, 19, null, 2)).thenReturn(List.of(located, located));
        when(repository.count("alice", "public")).thenReturn(2L);
        var result = service.page(actor, 1, null);
        assertEquals(1, result.items().size()); assertEquals(2, result.total());
        assertEquals(new Cursor(1, post.createdAtIso(), id), PhotoFeedService.parseCursor(result.nextCursor()));
        assertThrows(ResponseStatusException.class, () -> PhotoFeedService.parseCursor("not-a-cursor"));
    }
}
