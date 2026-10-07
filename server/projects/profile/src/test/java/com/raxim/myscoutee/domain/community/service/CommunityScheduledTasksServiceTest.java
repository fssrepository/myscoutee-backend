package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.community.document.CommunityScheduledTask;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.repository.CommunityScheduledTasksRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.groups.service.CommunityAccessService;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.time.Instant;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

@org.junit.jupiter.api.Tag("standard")
class CommunityScheduledTasksServiceTest {
    @Test void createsOneSharedCaseAtTheLeadBoundaryAndRetriesNotificationBeforeAdvancing() {
        var tasks = mock(CommunityScheduledTasksRepository.class);
        var cases = mock(ServiceCasesRepository.class);
        var groups = mock(CommunityGroupsRepository.class);
        var members = mock(ActivityMembersRepository.class);
        var notifier = mock(CommunityCasesService.class);
        var service = new CommunityScheduledTasksService(tasks, cases, mock(CommunityAccessService.class), new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(groups), members, notifier);
        var now = Instant.parse("2026-10-05T09:00:00Z");
        var due = "2026-11-19T09:00:00.000Z";
        var task = new CommunityScheduledTask("task", CommunityGroup.COMMUNITY_BASE_ID, "homes", "manager", "Inspection", "Organize visits", "chimney-sweep",
                true, List.of(), due, due, "once", true, false, now.toString(), now.toString(), 0L);
        when(tasks.due(eq(CommunityGroup.COMMUNITY_BASE_ID), eq(due), any(Pageable.class))).thenReturn(List.of(task));
        var group = mock(CommunityGroup.class); when(group.id()).thenReturn("homes"); when(group.effectiveType()).thenReturn("community");
        when(groups.findByIdIn(anyCollection())).thenReturn(List.of(group));
        when(members.findByOwnerTypeAndOwnerIdIn(eq("community"), anyCollection())).thenReturn(List.of(member("manager", "Admin"), member("resident", "Member"), member("resident", "Member")));
        var stored = new HashMap<String, ServiceCase>();
        when(cases.findById(anyString())).thenAnswer(a -> Optional.ofNullable(stored.get(a.getArgument(0))));
        when(cases.insert(any(ServiceCase.class))).thenAnswer(a -> { ServiceCase c = a.getArgument(0); stored.put(c.id(), c); return c; });
        doThrow(new IllegalStateException("temporary notification failure")).doNothing().when(notifier).notifyChange(any(), anyString(), eq("reminder"), anyString());
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID, () -> {
            assertThatThrownBy(() -> service.createDue(now)).isInstanceOf(IllegalStateException.class);
            verify(tasks, never()).save(any());
            assertThat(service.createDue(now)).isZero();
        });
        assertThat(stored).hasSize(1);
        var c = stored.values().iterator().next();
        assertThat(c.audienceAccountIds()).containsExactlyInAnyOrder("manager", "resident");
        assertThat(c.attentionAccountIds()).containsExactlyInAnyOrder("manager", "resident");
        verify(cases, times(1)).insert(any(ServiceCase.class));
        verify(notifier, times(2)).notifyChange(c, CommunityScheduledTasksService.RULE, "reminder", c.id());
        verify(tasks).save(argThat(t -> !t.enabled() && t.nextDueAtIso().equals(due)));
        JobGroupContext.run(CommunityGroup.WORK_BASE_ID, () -> assertThat(service.createDue(now)).isZero());
        verify(tasks, times(2)).due(anyString(), anyString(), any(Pageable.class));
    }
    @Test void recurrenceClampsCalendarDatesAndKeepsCanonicalOccurrenceIdentity() {
        assertThat(CommunityScheduledTasksService.nextDue("2026-01-31T09:00:00.000Z", "monthly")).isEqualTo("2026-02-28T09:00:00.000Z");
        assertThat(CommunityScheduledTasksService.nextDue("2028-02-29T09:00:00.000Z", "yearly")).isEqualTo("2029-02-28T09:00:00.000Z");
        assertThat(CommunityScheduledTasksService.nextDue("2026-01-31T09:00:00.000Z", "once")).isNull();
    }
    private static ActivityMember member(String id, String role) {
        var m = new ActivityMember(); m.setOwnerId("homes"); m.setUserId(id); m.setRole(role); m.setStatus("accepted"); return m;
    }
}
