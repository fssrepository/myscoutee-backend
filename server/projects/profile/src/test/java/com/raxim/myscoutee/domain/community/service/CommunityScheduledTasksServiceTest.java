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
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

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
        var service = new CommunityScheduledTasksService(tasks, cases, mock(CommunityAccessService.class), new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(groups, null), new com.raxim.myscoutee.domain.events.service.CommunityMembershipService(members, null, null), notifier, null, null);
        var counterWork = new CommunityCaseCounterWork(cases,
                mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class), mock(com.raxim.myscoutee.domain.events.api.CommunityMemberships.class),
                mock(org.springframework.data.mongodb.core.MongoTemplate.class), mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class), null);
        org.springframework.test.util.ReflectionTestUtils.setField(counterWork, "tasks", tasks);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork", counterWork);
        when(tasks.save(any())).thenAnswer(call -> call.getArgument(0));
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
        verify(notifier, times(2)).notifyChange(argThat(saved -> saved.id().equals(c.id()) && saved.audienceAccountIds().equals(c.audienceAccountIds())), eq(CommunityScheduledTasksService.RULE), eq("reminder"), eq(c.id()));
        verify(tasks).save(argThat(t -> !t.enabled() && t.nextDueAtIso().equals(due)));
        JobGroupContext.run(CommunityGroup.WORK_BASE_ID, () -> assertThat(service.createDue(now)).isZero());
        verify(tasks, times(2)).due(anyString(), anyString(), any(Pageable.class));
    }
    @Test void recurrenceClampsCalendarDatesAndKeepsCanonicalOccurrenceIdentity() {
        assertThat(CommunityScheduledTasksService.nextDue("2026-01-31T09:00:00.000Z", "monthly")).isEqualTo("2026-02-28T09:00:00.000Z");
        assertThat(CommunityScheduledTasksService.nextDue("2028-02-29T09:00:00.000Z", "yearly")).isEqualTo("2029-02-28T09:00:00.000Z");
        assertThat(CommunityScheduledTasksService.nextDue("2026-01-31T09:00:00.000Z", "once")).isNull();
    }
    @org.junit.jupiter.params.ParameterizedTest
    @org.junit.jupiter.params.provider.CsvSource({"pause,true,false,false,false", "resume,false,false,true,false", "trash,true,false,false,true", "restore,false,true,true,false"})
    void lifecycleCommandsUseLatestWorkerProgress(String action, boolean enabled, boolean deleted, boolean nextEnabled, boolean nextDeleted) {
        var tasks = mock(CommunityScheduledTasksRepository.class);
        var access = mock(com.raxim.myscoutee.domain.groups.api.CommunityAuthority.class);
        var service = new CommunityScheduledTasksService(tasks, mock(ServiceCasesRepository.class), access,
                mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class), mock(com.raxim.myscoutee.domain.events.api.CommunityMemberships.class), mock(CommunityCasesService.class), null, null);
        var counterWork = mock(CommunityCaseCounterWork.class);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork", counterWork);
        var current = new CommunityScheduledTask("task", CommunityGroup.COMMUNITY_BASE_ID, null, "owner", "Current title", "Current description", "maintenance",
                false, List.of("owner"), "2026-11-28T12:52:00.000Z", "2027-11-28T12:52:00.000Z", "yearly", enabled, deleted, "created", "updated", 6L);
        when(tasks.findById("task")).thenReturn(Optional.of(current));
        when(counterWork.saveTask(any(), eq(current))).thenAnswer(call -> call.getArgument(0));
        var command = new com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskCommand("owner", action, 0L);
        var result = service.action("owner", "task", command);
        assertThat(result.enabled()).isEqualTo(nextEnabled);
        assertThat(result.status()).isEqualTo(nextDeleted ? "trash" : nextEnabled ? "active" : "paused");
        assertThat(result.nextDueAtIso()).isEqualTo(current.nextDueAtIso());
        assertThat(result.description()).isEqualTo(current.description());
        verify(counterWork).saveTask(argThat(t -> t.version().equals(6L) && t.startAtIso().equals(current.startAtIso()) && t.deleted() == nextDeleted), eq(current));
        assertThatThrownBy(() -> service.action("outsider", "task", command))
                .isInstanceOfSatisfying(org.springframework.web.server.ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(403));
        var invalid = new com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskCommand("owner", deleted ? "pause" : "restore", 0L);
        assertThatThrownBy(() -> service.action("owner", "task", invalid))
                .isInstanceOfSatisfying(org.springframework.web.server.ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(409));
        var staleEditor = new com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.SaveTask("owner", "task", null, "Overwrite", "", "maintenance", false, List.of("owner"), current.startAtIso(), "yearly", enabled, 0L);
        assertThatThrownBy(() -> service.save("owner", staleEditor))
                .isInstanceOfSatisfying(org.springframework.web.server.ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(409));
        when(counterWork.saveTask(any(), eq(current))).thenThrow(new org.springframework.dao.OptimisticLockingFailureException("concurrent writer"));
        assertThatThrownBy(() -> service.action("owner", "task", command))
                .isInstanceOfSatisfying(org.springframework.web.server.ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(409));
    }
    private static ActivityMember member(String id, String role) {
        var m = new ActivityMember(); m.setOwnerId("homes"); m.setUserId(id); m.setRole(role); m.setStatus("accepted"); return m;
    }
}
