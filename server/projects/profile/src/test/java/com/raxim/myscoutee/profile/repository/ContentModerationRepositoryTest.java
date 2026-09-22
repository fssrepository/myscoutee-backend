package com.raxim.myscoutee.profile.repository;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.profile.data.dto.admin.ContentModerationDtos.Item;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ContentModerationRepositoryTest {
    @Test void allOmitsCategoryRestrictionButRetainsBucketCursorAndBoundedPage() {
        var mongo = mock(MongoTemplate.class);
        var repository = new ContentModerationRepository(mongo);
        repository.page("all", "blocked", "event:last", 21);
        repository.page("feed", "accepted", null, 20);
        var queries = ArgumentCaptor.forClass(Query.class);
        verify(mongo, times(2)).find(queries.capture(), eq(Item.class));
        Query all = queries.getAllValues().get(0), feed = queries.getAllValues().get(1);
        assertFalse(all.getQueryObject().containsKey("category"));
        assertEquals("blocked", all.getQueryObject().get("status"));
        assertEquals("event:last", all.getQueryObject().get("_id", org.bson.Document.class).get("$gt"));
        assertEquals(21, all.getLimit());
        assertEquals("feed", feed.getQueryObject().get("category"));
        assertEquals("accepted", feed.getQueryObject().get("status"));
    }
}
