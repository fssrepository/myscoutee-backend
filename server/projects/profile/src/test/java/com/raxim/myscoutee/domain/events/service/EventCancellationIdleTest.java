package com.raxim.myscoutee.domain.events.service;

import static org.mockito.Mockito.*;
import java.util.*;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.test.util.ReflectionTestUtils;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.notifications.api.*;
import com.raxim.myscoutee.domain.payments.api.*;

@Tag("standard")
class EventCancellationIdleTest {
    @Test void emptyQueuesNeverStartJobsAndEachWorkSourceStillRequiresAdmission() {
        var mongo = mock(MongoTemplate.class);
        var payments = mock(EventPayments.class);
        var cancellations = mock(EventPaymentCancellations.class);
        var scopes = mock(EventJobQueries.class);
        var jobs = mock(NotificationJobs.class, CALLS_REAL_METHODS);
        when(jobs.configuredGroupIds(any())).thenReturn(Arrays.asList((String) null));
        when(scopes.workspaceCriteria("workspaceGroupId")).thenReturn(Criteria.where("workspaceGroupId").is(null));
        var worker = new EventCancellationService(mongo, payments,
                new ScheduledMongoSessionRunner("same", "same"), mock(NotificationDelivery.class), null);
        ReflectionTestUtils.setField(worker, "groupRules", jobs);
        ReflectionTestUtils.setField(worker, "jobGroupScope", scopes);
        ReflectionTestUtils.setField(worker, "paymentCancellations", cancellations);

        worker.finishPendingCancellations();
        verify(jobs, never()).beginScheduledRun(any(), any(), any(), any());
        verify(jobs, never()).recordRun(any(), anyInt(), any(), any(), any(), any());

        // All three independent work sources must reach the same existing claim.
        // A denied/disabled/not-due claim must never mutate payment state.
        for (String source : List.of("cancelled", "terms", "payment")) {
            clearInvocations(jobs, cancellations);
            when(mongo.find(any(Query.class), eq(ActivityEvent.class))).thenAnswer(call -> {
                var query = call.getArgument(0, Query.class).getQueryObject();
                return (source.equals("cancelled") && query.containsKey("cancelledAtIso"))
                        || (source.equals("terms") && query.containsKey("paidTermsRefundsPending"))
                        ? List.of(new ActivityEvent()) : List.of();
            });
            doReturn(source.equals("payment") ? List.of(mock(CancellationPayment.class)) : List.of())
                    .when(cancellations).pendingRequestedCancellations();
            worker.finishPendingCancellations();
            verify(jobs).beginScheduledRun(eq("event-cancellation"), any(), any(), any());
            verify(cancellations).pendingRequestedCancellations();
            verifyNoMoreInteractions(cancellations);
            verifyNoInteractions(payments);
            verify(jobs, never()).recordRun(any(), anyInt(), any(), any(), any(), any());
        }
    }
}
