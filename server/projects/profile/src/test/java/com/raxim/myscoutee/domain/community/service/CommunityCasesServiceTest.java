package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.chat.api.CaseConversations;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;
import com.raxim.myscoutee.domain.community.repository.ServiceOfferingsRepository;
import com.raxim.myscoutee.domain.email.service.ScheduledMessageTaskService;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.groups.service.CommunityAccessService;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;

@org.junit.jupiter.api.Tag("standard")
class CommunityCasesServiceTest {
    @Test void calendarUsesBoundedTaskDatesAndExistingVisibilityWithoutListPagination() {
        var cases = mock(ServiceCasesRepository.class); var access = mock(CommunityAccessService.class);
        var groups = mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class);
        var users = mock(com.raxim.myscoutee.domain.accounts.api.ProfileSummaries.class);
        var service = new CommunityCasesService(cases, access, groups, users, mock(NotificationOutboxService.class), mock(CaseConversations.class), mock(ServiceOfferingsRepository.class));
        when(access.managedGroups("owner")).thenReturn(Set.of("homes"));
        when(cases.visibleCalendar(anyString(), eq("owner"), anyCollection(), anyCollection(), anyCollection(), anyString(), anyString())).thenReturn(List.of(record()));
        var page = service.page("owner", "active", "maintenance", 1, null, "2026-10-01", "2026-10-31");
        assertThat(page.items()).extracting(com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem::id).containsExactly("case");
        assertThat(page.total()).isEqualTo(1);
        assertThat(page.nextCursor()).isNull();
        verify(cases).visibleCalendar(CommunityGroup.COMMUNITY_BASE_ID, "owner", Set.of("homes"), List.of("open", "in-progress"), List.of("maintenance"), "2026-10-01T00:00:00Z", "2026-11-01T00:00:00Z");
        verify(cases, never()).visible(anyString(), anyString(), anyCollection(), anyCollection(), anyCollection(), any());
        verify(cases, never()).findById(anyString());
        assertThatThrownBy(() -> service.page("owner", "active", null, 20, null, "2026-10-01", "2027-10-01"))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThatThrownBy(() -> service.page("owner", "active", null, 20, null, "2026-10-01", null))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
    }
    @Test void manualActionsExcludeTheActorButAutomaticRemindersIncludeTheCreatorInCommunityScope() {
        var users = mock(UsersRepository.class); var notifications = mock(NotificationOutboxService.class);
        var service = new CommunityCasesService(mock(ServiceCasesRepository.class), mock(CommunityAccessService.class), new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(mock(CommunityGroupsRepository.class)), new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users), notifications, mock(CaseConversations.class), mock(ServiceOfferingsRepository.class));
        when(users.findByWorkspaceGroupIdAndAccountUserIdIn(eq(CommunityGroup.COMMUNITY_BASE_ID), anyCollection())).thenAnswer(a -> {
            Collection<String> accounts = a.getArgument(1);
            return accounts.stream().map(id -> { var u = new Users(); u.setUserId("group:myscoutee-community:" + id); return u; }).toList();
        });
        var c = record();
        service.notifyChange(c, "owner", "updated", "change-1");
        service.notifyChange(c, CommunityScheduledTasksService.RULE, "reminder", "task:due");
        var intent = ArgumentCaptor.forClass(NotificationOutboxService.NotificationIntent.class);
        verify(notifications, times(2)).enqueueOnce(anyString(), intent.capture());
        assertThat(intent.getAllValues().get(0).recipientUserIds()).containsExactly("group:myscoutee-community:resident");
        assertThat(intent.getAllValues().get(1).recipientUserIds()).containsExactly("group:myscoutee-community:owner", "group:myscoutee-community:resident");
        assertThat(intent.getValue().payload()).containsEntry("workspaceGroupId", CommunityGroup.COMMUNITY_BASE_ID).containsEntry("caseId", "case");
    }
    @Test void anExternalProviderOnlySeesExplicitlyAssignedCases() {
        var cases = mock(ServiceCasesRepository.class); var access = mock(CommunityAccessService.class);
        var service = new CommunityCasesService(cases, access, new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(mock(CommunityGroupsRepository.class)), new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(mock(UsersRepository.class)), mock(NotificationOutboxService.class), mock(CaseConversations.class), mock(ServiceOfferingsRepository.class));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork", new CommunityCaseCounterWork(cases,
                mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class), mock(com.raxim.myscoutee.domain.events.api.CommunityMemberships.class),
                mock(org.springframework.data.mongodb.core.MongoTemplate.class), mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class)));
        when(cases.findById("case")).thenReturn(Optional.of(record()));
        assertThat(service.visible("resident", "case").id()).isEqualTo("case");
        assertThatThrownBy(() -> service.visible("outside-provider", "case")).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(access, never()).requireMember(anyString(), anyString());
    }
    @Test void onlyTheCaseOwnerCanEditAndOwnershipIsClaimedSeparatelyFromJoining() {
        var cases = mock(ServiceCasesRepository.class); var access = mock(CommunityAccessService.class);
        var current = new java.util.concurrent.atomic.AtomicReference<>(record());
        when(cases.findById("case")).thenAnswer(a -> Optional.of(current.get()));
        when(cases.save(any(ServiceCase.class))).thenAnswer(a -> { ServiceCase next = a.getArgument(0); current.set(next); return next; });
        when(access.admin("homes", "resident")).thenReturn(true);
        var service = new CommunityCasesService(cases, access, new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(mock(CommunityGroupsRepository.class)), new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(mock(UsersRepository.class)), mock(NotificationOutboxService.class), mock(CaseConversations.class), mock(ServiceOfferingsRepository.class));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork", new CommunityCaseCounterWork(cases,
                mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class), mock(com.raxim.myscoutee.domain.events.api.CommunityMemberships.class),
                mock(org.springframework.data.mongodb.core.MongoTemplate.class), mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class)));
        assertThat(service.canManage(current.get(), "owner")).isTrue();
        assertThat(service.canManage(current.get(), "resident")).isFalse();
        assertThatThrownBy(() -> service.action("resident", "case", command("save-board-task")))
                .isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        service.action("owner", "case", command("leave"));
        assertThat(current.get().ownerAccountId()).isNull();
        assertThat(current.get().canTakeOver("resident")).isTrue();
        service.action("resident", "case", command("join"));
        assertThat(service.canManage(current.get(), "resident")).isFalse();
        service.action("resident", "case", command("take-over"));
        assertThat(service.canManage(current.get(), "resident")).isTrue();
        assertThat(current.get().canTakeOver("owner")).isFalse();
        service.action("resident", "case", command("leave"));
        assertThat(current.get().status()).isEqualTo("trash");
        assertThat(current.get().ownerAccountId()).isNull();
    }
    @Test void manualCreationDoesNotRequirePreselectedAffectedMembers() {
        var cases = mock(ServiceCasesRepository.class); var access = mock(CommunityAccessService.class);
        when(cases.save(any(ServiceCase.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(access.roster("homes")).thenReturn(List.of());
        when(access.audience(List.of(), false, List.of())).thenReturn(List.of());
        var service = new CommunityCasesService(cases, access, new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(mock(CommunityGroupsRepository.class)), new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(mock(UsersRepository.class)),
                mock(NotificationOutboxService.class), mock(CaseConversations.class), mock(ServiceOfferingsRepository.class));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork", new CommunityCaseCounterWork(cases,
                mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class), mock(com.raxim.myscoutee.domain.events.api.CommunityMemberships.class),
                mock(org.springframework.data.mongodb.core.MongoTemplate.class), mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class)));
        var saved = service.save("owner", new com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.SaveCase(
                "owner", null, "homes", "Repair", "", "maintenance", false, List.of(), null));
        assertThat(saved.audienceAccountIds()).isEmpty();
        assertThat(saved.canManage()).isTrue();
        assertThat(saved.membershipStatus()).isEqualTo("accepted");
        verify(cases).save(argThat(c -> c.participantAccountIds().equals(List.of("owner"))));
    }
    @Test void completionHandsTheSavedSnapshotToTheExistingWorker() {
        var cases = mock(ServiceCasesRepository.class);
        var worker = mock(ScheduledMessageTaskService.class);
        var service = new CommunityCasesService(cases, mock(CommunityAccessService.class), new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(mock(CommunityGroupsRepository.class)),
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(mock(UsersRepository.class)), mock(NotificationOutboxService.class), mock(CaseConversations.class), mock(ServiceOfferingsRepository.class));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork", new CommunityCaseCounterWork(cases,
                mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class), mock(com.raxim.myscoutee.domain.events.api.CommunityMemberships.class),
                mock(org.springframework.data.mongodb.core.MongoTemplate.class), mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class)));
        org.springframework.test.util.ReflectionTestUtils.setField(service, "scheduledMessages", worker);
        var mapper = tools.jackson.databind.json.JsonMapper.builder().build();
        org.springframework.test.util.ReflectionTestUtils.setField(service, "objectMapper", mapper);
        when(cases.findById("case")).thenReturn(Optional.of(record()));
        when(cases.save(any(ServiceCase.class))).thenAnswer(invocation -> invocation.getArgument(0));
        service.action("owner", "case", command("complete"));
        var order = inOrder(cases, worker);
        order.verify(cases).save(argThat(c -> "completed".equals(c.status())));
        order.verify(worker).scheduleCaseFeedback(argThat(request -> {
            var closed = mapper.readValue(request.snapshot(), ServiceCase.class);
            return "completed".equals(closed.status()) && closed.activeParticipantAccountIds().contains("owner")
                    && request.caseId().equals(closed.id()) && request.version() == closed.version()
                    && request.baseGroupId().equals(closed.baseGroupId());
        }));
    }
    private com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Command command(String action) {
        return new com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Command(
                "", action, 0L, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }
    private ServiceCase record() {
        return new ServiceCase("case", CommunityGroup.COMMUNITY_BASE_ID, "homes", "owner", "Title", "Description", "maintenance", "open", true,
                List.of("owner", "resident"), List.of("owner", "resident"), List.of("resident"), List.of(), List.of(), List.of(), null, null, "2026-10-05T00:00:00Z", "2026-10-05T00:00:00Z", 0L,Map.of(),List.of(),List.of());
    }
}
