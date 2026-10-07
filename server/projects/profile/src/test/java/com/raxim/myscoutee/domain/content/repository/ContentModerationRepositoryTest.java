package com.raxim.myscoutee.domain.content.repository;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Item;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
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
        assertTrue(all.getQueryObject().containsKey("workspaceGroupId"));
        assertNull(all.getQueryObject().get("workspaceGroupId"));
    }
    @Test void pagesAndWorkerQueriesStayInTheRequestedGroup() {
        var mongo = mock(MongoTemplate.class);
        var repository = new ContentModerationRepository(mongo);
        repository.page("all", "under-review", null, 21, "A");
        repository.due(new com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Settings(true, true, 5, java.util.List.of("feed")), "2026-09-24T12:00:00Z", 100, "A");
        repository.withheld(100, "A");
        var queries = ArgumentCaptor.forClass(Query.class);
        verify(mongo, times(3)).find(queries.capture(), eq(Item.class));
        queries.getAllValues().forEach(query -> assertEquals("A", query.getQueryObject().get("workspaceGroupId")));
        assertEquals("group:A", repository.state("A").id());
        assertFalse(repository.state("A").settings().categories().contains("group"));
    }
}
