package com.raxim.myscoutee.domain.events.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import com.raxim.myscoutee.domain.accounts.api.ActivityCounters;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;

@Tag("standard")
class EventMembershipCounterWorkTest {
    @Test void lostCounterReplyRetainsRemovedUsersAndNeverReplaysAnIncrement() {
        var mongo = mock(MongoTemplate.class);
        var counters = mock(ActivityCounters.class);
        var event = new ActivityEvent(); event.setId("event-row"); event.setSourceId("event");
        event.setMembershipCounterUsers(List.of("earlier-removed"));
        EventMembershipCounterWork.prepare(event, List.of("joined", "left", "joined"));
        String operation = event.getMembershipCounterWork();
        assertThat(event.getMembershipCounterUsers()).containsExactly("earlier-removed", "joined", "left");
        doThrow(new IllegalStateException("lost reply")).doNothing()
                .when(counters).refreshEventCountersForUsers(event.getMembershipCounterUsers());
        new EventMembershipCounterWork(mongo, counters, null).deliver(event);
        verify(mongo, never()).updateFirst(any(), any(Update.class), eq(ActivityEvent.class));
        new EventMembershipCounterWork(mongo, counters, null).deliver(event);
        var guard = ArgumentCaptor.forClass(Query.class);
        verify(mongo).updateFirst(guard.capture(), any(Update.class), eq(ActivityEvent.class));
        assertThat(guard.getValue().getQueryObject()).containsEntry("_id", "event-row").containsEntry("membershipCounterWork", operation);
        verify(counters, never()).applyActiveEventMembershipDeltas(any(), any());
    }
}
