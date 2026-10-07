package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.chat.service.ChatService;
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
    @Test void manualActionsExcludeTheActorButAutomaticRemindersIncludeTheCreatorInCommunityScope() {
        var users = mock(UsersRepository.class); var notifications = mock(NotificationOutboxService.class);
        var service = new CommunityCasesService(mock(ServiceCasesRepository.class), mock(CommunityAccessService.class), mock(CommunityGroupsRepository.class), users, notifications, mock(ChatService.class), mock(ServiceOfferingsRepository.class));
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
        var service = new CommunityCasesService(cases, access, mock(CommunityGroupsRepository.class), mock(UsersRepository.class), mock(NotificationOutboxService.class), mock(ChatService.class), mock(ServiceOfferingsRepository.class));
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
        var service = new CommunityCasesService(cases, access, mock(CommunityGroupsRepository.class), mock(UsersRepository.class), mock(NotificationOutboxService.class), mock(ChatService.class), mock(ServiceOfferingsRepository.class));
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
        var service = new CommunityCasesService(cases, access, mock(CommunityGroupsRepository.class), mock(UsersRepository.class),
                mock(NotificationOutboxService.class), mock(ChatService.class), mock(ServiceOfferingsRepository.class));
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
        var service = new CommunityCasesService(cases, mock(CommunityAccessService.class), mock(CommunityGroupsRepository.class),
                mock(UsersRepository.class), mock(NotificationOutboxService.class), mock(ChatService.class), mock(ServiceOfferingsRepository.class));
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
