package com.raxim.myscoutee.domain.content.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.notifications.document.NotificationRuleConfig;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
class ContentModerationWorkerTest {
    final ContentModerationService service = mock(ContentModerationService.class);
    final NotificationRuleRegistryService rules = mock(NotificationRuleRegistryService.class);
    final ScheduledMongoSessionRunner databases = mock(ScheduledMongoSessionRunner.class);
    final ContentModerationWorker worker = new ContentModerationWorker(service, rules, databases);
    final String key = ContentModerationWorker.RULE;
    @BeforeEach void database() {
        org.mockito.Mockito.doAnswer(call -> { com.raxim.myscoutee.domain.platform.service.JobGroupContext.run(null, call.getArgument(1, Runnable.class)); return null; }).when(rules).forEachGroup(anyString(), any(Runnable.class));
        doAnswer(call -> { ((Runnable) call.getArgument(0)).run(); return null; }).when(databases).runAcrossConfiguredDatabases(any());
    }
    @Test void disabledOrNotDueJobDoesNotApproveButRepairsCommittedDelivery() {
        worker.tick();
        verify(service).drainPending(); verify(service, never()).approveDue();
        verify(rules, never()).beginScheduledRun(anyString(), anyString(), anyString(), any());
    }
    @Test void leaseFailurePreventsDuplicateRun() {
        when(rules.shouldRunScheduledRule(eq(key), any())).thenReturn(true);
        worker.tick(); verify(service, never()).approveDue();
    }
    @Test void dueJobRecordsProcessedCountInJobsHistory() {
        when(rules.shouldRunScheduledRule(eq(key), any())).thenReturn(true);
        when(rules.beginScheduledRun(eq(key), anyString(), eq(key), any())).thenReturn(new NotificationRuleConfig());
        when(service.approveDue()).thenReturn(3);
        worker.tick();
        verify(rules).recordRun(eq(key), eq(3), eq("completed"), anyString(), eq(key), any());
    }
    @Test void failureIsRecordedAndPropagated() {
        when(rules.shouldRunScheduledRule(eq(key), any())).thenReturn(true);
        when(rules.beginScheduledRun(eq(key), anyString(), eq(key), any())).thenReturn(new NotificationRuleConfig());
        when(service.approveDue()).thenThrow(new IllegalStateException("database unavailable"));
        assertThrows(IllegalStateException.class, worker::tick);
        verify(rules).recordRun(eq(key), eq(0), eq("failed"), eq("database unavailable"), eq(key), any());
    }
}
