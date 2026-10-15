package com.raxim.myscoutee.domain.community.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.List;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.media.api.MediaDeletionQueue;
import com.raxim.myscoutee.domain.community.api.CommunityMediaVisibility;
import com.raxim.myscoutee.domain.campaigns.api.CampaignMediaVisibility;

@Tag("standard")
class CommunityDocumentDeletionWorkTest {
    MongoTemplate mongo = mock(MongoTemplate.class);
    MediaDeletionQueue queue = mock(MediaDeletionQueue.class);
    CommunityMediaVisibility announcements = mock(CommunityMediaVisibility.class);
    CampaignMediaVisibility campaigns = mock(CampaignMediaVisibility.class);
    CommunityDocumentDeletionWork work = new CommunityDocumentDeletionWork(mongo, queue, announcements, campaigns);
    @BeforeEach void setup() {
        when(mongo.find(any(Query.class), eq(Document.class), eq("communityAnnouncements")))
                .thenReturn(List.of(new Document("_id", "first").append("pendingDocumentDeletes", List.of("one", "shared")),
                        new Document("_id", "second").append("pendingDocumentDeletes", List.of("two"))));
        when(announcements.referencedDocuments(anyList())).thenReturn(List.of("shared"));
        when(campaigns.referencedDocuments(anyList())).thenReturn(List.of());
    }
    @Test void usesOneReferenceBatchAndAcknowledgesOnlyAfterDurableEnqueue() {
        work.drain();
        verify(announcements).referencedDocuments(List.of("one", "shared", "two"));
        verify(campaigns).referencedDocuments(List.of("one", "shared", "two"));
        var order = inOrder(queue, mongo);
        order.verify(queue).enqueue("myscoutee-community", List.of("one", "two"));
        order.verify(mongo, times(2)).updateMulti(any(Query.class), any(Update.class), eq("communityAnnouncements"));
    }
    @Test void lostEnqueueReplyKeepsOwnerOutboxForReplay() {
        doThrow(new IllegalStateException("timeout")).when(queue).enqueue(anyString(), anyList());
        assertThatThrownBy(work::drain).isInstanceOf(IllegalStateException.class);
        verify(mongo, never()).updateMulti(any(Query.class), any(Update.class), anyString());
    }
}
