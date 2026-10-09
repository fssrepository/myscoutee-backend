package com.raxim.myscoutee.domain.administration.service;

import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import com.raxim.myscoutee.domain.administration.repository.AdminMonitoringRepository;
import com.raxim.myscoutee.domain.administration.document.AdminMonitoringSnapshot;
import com.raxim.myscoutee.domain.notifications.api.NotificationCatalog;
import com.raxim.myscoutee.domain.affinity.api.RecomputeQueue;

@Tag("standard")
class AdminMenuCounterServiceTest {
    @Test void unavailableQueueSourceDoesNotPersistFalseZeroCounts() {
        var repository = mock(AdminMonitoringRepository.class);
        var catalog = mock(NotificationCatalog.class);
        when(catalog.failedJobs(null)).thenThrow(new IllegalStateException("owner unavailable"));
        var service = new AdminMenuCounterService(catalog, mock(RecomputeQueue.class), repository);
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> service.counters(true))
                .isInstanceOf(IllegalStateException.class);
        verifyNoInteractions(repository);
    }

    @Test void unchangedQueuesPreserveSnapshotAndTimestampButChangesPersist() {
        var repository = mock(AdminMonitoringRepository.class);
        var catalog = mock(NotificationCatalog.class);
        var snapshot = AdminMonitoringSnapshot.createDefault("global");
        when(repository.ensureSnapshot(null)).thenReturn(snapshot);
        var service = new AdminMenuCounterService(catalog, mock(RecomputeQueue.class), repository);
        service.counters(true);
        clearInvocations(repository);
        String generated = snapshot.getGeneratedAtIso();
        service.counters(true);
        verify(repository, never()).save(any());
        assertThat(snapshot.getGeneratedAtIso()).isEqualTo(generated);
        when(catalog.countOutbox(null, "pending")).thenReturn(1L);
        service.counters(true);
        verify(repository).save(snapshot);
        assertThat(snapshot.getNodeCounters().get("queues.outbox.pending")).isEqualTo(1L);
    }
}
