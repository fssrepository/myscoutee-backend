package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.NoOpDbRefResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.web.server.ResponseStatusException;
import org.bson.Document;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto;
import com.raxim.myscoutee.domain.events.mapper.ActivityEventDetailMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
class EventImageGalleryTest {
    @Test void fiveImagesSurviveMongoMappingAndDetailReadWithFirstAsCover() throws Exception {
        var request = mock(EventDetailDto.class);
        var images = List.of("/a.webp", "/b.webp", "/c.webp", "/d.webp", "/e.webp");
        when(request.imageUrls()).thenReturn(images);
        var event = new ActivityEvent();
        event.setImageUrls(ActivitiesEventsService.resolveEventImages(request, null, false));
        event.setImageUrl(event.getImageUrls().getFirst());
        event.setImageDetails(java.util.Map.of("/a.webp", new com.raxim.myscoutee.domain.media.dto.MediaDtos.ImageDetailsDto("Budapest", "A short caption")));
        var context = new MongoMappingContext(); context.afterPropertiesSet();
        var converter = new MappingMongoConverter(NoOpDbRefResolver.INSTANCE, context); converter.preserveMapKeys(true); converter.afterPropertiesSet();
        var document = new Document(); converter.write(event, document);
        var restored = converter.read(ActivityEvent.class, document);
        var detail = new ActivityEventDetailMapper().toDto(restored, null);
        assertEquals(images, detail.imageUrls()); assertEquals(images.getFirst(), detail.imageUrl());
        assertEquals(event.getImageDetails(), detail.imageDetails());
    }
    @Test void publishedEventKeepsGalleryDespiteSubmittedChanges() {
        var event = new ActivityEvent(); event.setImageUrls(List.of("/original.webp", "/second.webp"));
        var request = mock(EventDetailDto.class); when(request.imageUrls()).thenReturn(List.of("/replacement.webp"));
        assertEquals(event.getImageUrls(), ActivitiesEventsService.resolveEventImages(request, event, true));
    }
    @Test void explicitEmptyGalleryClearsWhileOmittedGalleryRetainsImages() {
        var event = new ActivityEvent(); event.setImageUrls(List.of("/original.webp"));
        var request = mock(EventDetailDto.class); when(request.imageUrls()).thenReturn(null);
        assertEquals(event.getImageUrls(), ActivitiesEventsService.resolveEventImages(request, event, false));
        when(request.imageUrls()).thenReturn(List.of());
        assertEquals(List.of(), ActivitiesEventsService.resolveEventImages(request, event, false));
    }
    @Test void rejectsSixImages() {
        var request = mock(EventDetailDto.class); when(request.imageUrls()).thenReturn(List.of("1", "2", "3", "4", "5", "6"));
        assertThrows(ResponseStatusException.class, () -> ActivitiesEventsService.resolveEventImages(request, null, false));
    }
    @Test void legacySingleImageStillOpensAsOneImageGallery() {
        var event = new ActivityEvent(); event.setImageUrl("/old.webp");
        assertEquals(List.of("/old.webp"), new ActivityEventDetailMapper().toDto(event, null).imageUrls());
    }
}
