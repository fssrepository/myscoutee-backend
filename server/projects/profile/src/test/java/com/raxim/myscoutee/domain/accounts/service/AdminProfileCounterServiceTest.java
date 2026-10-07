package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.administration.api.AdministrativeQueues;
import com.raxim.myscoutee.domain.administration.api.AdministratorClassification;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

@Tag("standard")
class AdminProfileCounterServiceTest {
    @Test void batchesCountersPerWorkspaceAndDoesNotSaveUnchangedProfiles() {
        var users = mock(UsersRepository.class);
        var queues = mock(AdministrativeQueues.class);
        var first = profile("first", "work");
        var second = profile("second", "work");
        var global = profile("global", null);
        when(users.findByHostTier("Admin")).thenReturn(List.of(first, second, global));
        var visited = new ArrayList<String>();
        when(queues.counters(true)).thenAnswer(invocation -> {
            visited.add(JobGroupContext.groupId());
            return new AdministrativeQueues.Counts(3, 5);
        });
        var service = new AdminProfileCounterService(users, queues, mock(AdministratorClassification.class));
        service.refreshAdminMenuCounters();
        assertThat(visited).containsExactly("work", null);
        assertThat(first.getActivities().adminJobs()).isEqualTo(3);
        assertThat(second.getActivities().adminMetrics()).isEqualTo(5);
        verify(users).save(first);
        verify(users).save(second);
        verify(users).save(global);
        clearInvocations(users, queues);
        service.refreshAdminMenuCounters();
        verify(users, never()).save(any());
        verify(queues, times(2)).counters(true);
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    @Test void scopedRefreshSkipsOtherWorkspacesAndRestoresCallerContext() {
        var users = mock(UsersRepository.class);
        var queues = mock(AdministrativeQueues.class);
        var work = profile("work-admin", "work");
        var other = profile("other-admin", "other");
        when(users.findByHostTier("Admin")).thenReturn(List.of(work, other));
        when(queues.counters(anyBoolean())).thenReturn(new AdministrativeQueues.Counts(1, 2));
        var service = new AdminProfileCounterService(users, queues, mock(AdministratorClassification.class));
        JobGroupContext.call("work", () -> {
            service.refreshAdminMenuCounters();
            assertThat(JobGroupContext.groupId()).isEqualTo("work");
            return null;
        });
        verify(users).save(work);
        verify(users, never()).save(other);
        verify(queues).counters(true);
        assertThat(other.getActivities()).isNull();
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    private Users profile(String id, String group) {
        var user = new Users();
        user.setUserId(id);
        user.setWorkspaceGroupId(group);
        return user;
    }
}
