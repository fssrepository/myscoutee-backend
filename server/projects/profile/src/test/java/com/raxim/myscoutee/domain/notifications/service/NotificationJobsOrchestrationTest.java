package com.raxim.myscoutee.domain.notifications.service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/** Shared native/remote orchestration; callback execution is never delegated to the state owner. */
@Tag("standard")
class NotificationJobsOrchestrationTest {
    @Test void allSeededGroupsRunAndOuterScopeIsRestoredAfterFailure() {
        var jobs = mock(NotificationJobs.class, CALLS_REAL_METHODS);
        when(jobs.configuredGroupIds(Set.of("rule"))).thenReturn(Arrays.asList(null, "work", "community"));
        var visited = new ArrayList<String>();
        var first = new IllegalStateException("first");
        var second = new IllegalStateException("second");
        JobGroupContext.run("outer", () -> {
            var failure = assertThrows(IllegalStateException.class, () -> jobs.forEachGroup("rule", () -> {
                assertTrue(JobGroupContext.isActive());
                String group = JobGroupContext.groupId(); visited.add(group);
                if (group == null) throw first;
                if ("community".equals(group)) throw second;
            }));
            assertSame(first, failure);
            assertArrayEquals(new Throwable[]{second}, failure.getSuppressed());
            assertEquals("outer", JobGroupContext.groupId());
        });
        assertEquals(Arrays.asList(null, "work", "community"), visited);
        assertFalse(JobGroupContext.isActive());
    }
    @Test void callbackRunsOnlyForAnAcknowledgedClaimInItsSelectedGroup() {
        var jobs = mock(NotificationJobs.class, CALLS_REAL_METHODS);
        when(jobs.configuredGroupIds(Set.of("rule"))).thenReturn(Arrays.asList(null, "work"));
        var config = mock(NotificationJobs.Configuration.class);
        when(jobs.beginScheduledRun(eq("rule"), anyString(), eq("rule"), any()))
                .thenAnswer(call -> JobGroupContext.groupId() == null ? config : null);
        var calls = new AtomicInteger();
        jobs.runScheduledGroups("rule", () -> {
            assertTrue(JobGroupContext.isActive()); assertNull(JobGroupContext.groupId()); calls.incrementAndGet();
        });
        assertEquals(1, calls.get());
        verify(jobs, never()).shouldRunScheduledRule(anyString(), any());
        verify(jobs).recordRun(eq("rule"), eq(0), eq("completed"), anyString(), eq("rule"), any());
        assertFalse(JobGroupContext.isActive());
    }
    @Test void unknownClaimOutcomeNeverStartsTheCallback() {
        var jobs = mock(NotificationJobs.class, CALLS_REAL_METHODS);
        when(jobs.configuredGroupIds(Set.of("rule"))).thenReturn(List.of("work"));
        when(jobs.beginScheduledRun(eq("rule"), anyString(), eq("rule"), any()))
                .thenThrow(new IllegalStateException("transport unavailable"));
        var callback = mock(Runnable.class);
        assertThrows(IllegalStateException.class, () -> jobs.runScheduledGroups("rule", callback));
        verifyNoInteractions(callback);
        assertFalse(JobGroupContext.isActive());
    }
}
