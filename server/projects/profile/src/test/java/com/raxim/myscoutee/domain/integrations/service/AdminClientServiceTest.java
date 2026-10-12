package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;
import com.raxim.myscoutee.domain.administration.repository.AdminStatsRepository;
import com.raxim.myscoutee.domain.administration.service.AdminMenuCounterService;
import com.raxim.myscoutee.domain.administration.service.AdminStatsService;
import com.raxim.myscoutee.domain.affinity.service.AdminGraphScienceService;
import com.raxim.myscoutee.domain.integrations.repository.AdminClientRepository;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
class AdminClientServiceTest {
    @Test void installedModerationKeepsTheExistingNumericJsonFields() {
        var repository = mock(AdminClientRepository.class);
        var access = mock(AdminClientAccessService.class);
        var moderation = mock(AdminModerationAttention.class);
        when(access.requireAdmin("admin")).thenReturn(new Users());
        when(repository.unreadVersion("admin")).thenReturn("revision");
        when(moderation.counts(null)).thenReturn(new AdminModerationAttention.Counts(2, 3, 4));
        var result = new AdminClientService(access, repository, java.util.Optional.of(moderation)).overview("admin");
        var mapper = new tools.jackson.databind.ObjectMapper();
        var json = mapper.readTree(mapper.writeValueAsString(result)).get("attention");
        assertEquals(mapper.readTree("""
                {"unreadMessages":0,"unreadVersion":"revision","unresolvedReports":2,
                 "unresolvedFeedback":3,"supportCases":4,"failedJobs":0}
                """), json);
        verify(moderation).counts(null);
        verifyNoMoreInteractions(moderation);
    }

    @Test void omittedModerationOmitsOnlyItsJsonFieldsAndKeepsTheAdminRead() {
        var repository = mock(AdminClientRepository.class);
        var access = mock(AdminClientAccessService.class);
        when(access.requireAdmin("admin")).thenReturn(new Users());
        when(repository.unreadVersion("admin")).thenReturn("revision");
        var result = new AdminClientService(access, repository, java.util.Optional.empty()).overview("admin");
        var mapper = new tools.jackson.databind.ObjectMapper();
        assertEquals(mapper.readTree("""
                {"unreadMessages":0,"unreadVersion":"revision","failedJobs":0}
                """), mapper.readTree(mapper.writeValueAsString(result)).get("attention"));
        verify(access).requireAdmin("admin");
        verify(repository).stats();
        verify(repository).unreadVersion("admin");
        verifyNoMoreInteractions(repository);
    }

    @Test void deniedAdminCannotReadTheOverviewOrOptionalModerationData() {
        var repository = mock(AdminClientRepository.class);
        var access = mock(AdminClientAccessService.class);
        var moderation = mock(AdminModerationAttention.class);
        when(access.requireAdmin("member")).thenThrow(new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.FORBIDDEN));
        assertThrows(org.springframework.web.server.ResponseStatusException.class,
                () -> new AdminClientService(access, repository, java.util.Optional.of(moderation)).overview("member"));
        verifyNoInteractions(repository, moderation);
    }

    @Test void nativeModerationAttentionKeepsBothCountReadsAndDoesNotQueryTheFeed() {
        var content = mock(com.raxim.myscoutee.domain.content.api.ContentStatistics.class);
        when(content.unresolvedReports()).thenReturn(2L);
        when(content.unresolvedFeedback()).thenReturn(3L);
        var chat = mock(com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile.ChatCounts.class, RETURNS_DEEP_STUBS);
        when(chat.supportCases().pending()).thenReturn(1);
        when(chat.supportCases().warned()).thenReturn(2);
        when(chat.supportCases().picked()).thenReturn(3);
        assertEquals(new AdminModerationAttention.Counts(2, 3, 6), new AdminModerationAttentionService(content).counts(chat));
        verify(content).unresolvedReports();
        verify(content).unresolvedFeedback();
        verifyNoMoreInteractions(content);
    }

    @Test void reportsStoredActivePopulationAndCalendarRegistrationWindowsWithoutFirstSeenGuessing() {
        var repository = mock(AdminClientRepository.class); var access = mock(AdminClientAccessService.class);
        when(access.requireAdmin("admin")).thenReturn(new Users());
        var stats = AdminStatsSnapshot.createDefault("global");
        stats.setActiveProfileGenders(Map.of("female", 3L, "male", 2L));
        var today = LocalDate.now(ZoneOffset.UTC);
        stats.setDailyActivity(Map.of(today.toString(), Map.of("registrations", 2L), today.minusDays(6).toString(), Map.of("registrations", 3L),
                today.minusDays(7).toString(), Map.of("registrations", 4L), today.minusDays(29).toString(), Map.of("registrations", 5L),
                today.minusDays(30).toString(), Map.of("registrations", 100L)));
        when(repository.stats()).thenReturn(new com.raxim.myscoutee.domain.administration.api.AdministrativeStatistics.Summary(stats.getGeneratedAtIso(), stats.getActiveProfileGenders(), stats.getDailyActivity()));
        var result = new AdminClientService(access, repository, java.util.Optional.empty()).overview("admin");
        assertEquals(5, result.statistics().activeProfiles()); assertEquals(5, result.statistics().registrations7Days());
        assertEquals(14, result.statistics().registrations30Days()); assertTrue(result.statistics().ready());
        verify(access).requireAdmin("admin");
    }
    @Test void noSnapshotIsExplicitlyNotReady() {
        var repository = mock(AdminClientRepository.class); var access = mock(AdminClientAccessService.class);
        when(access.requireAdmin("admin")).thenReturn(new Users());
        assertFalse(new AdminClientService(access, repository, java.util.Optional.empty()).overview("admin").statistics().ready());
    }
    @Test void statisticsRefreshExcludesInactiveDeletedBlockedAndStaffFromActiveGenderDistribution() {
        var repository = mock(AdminStatsRepository.class); var users = mock(UsersRepository.class);
        var snapshot = AdminStatsSnapshot.createDefault("global"); when(repository.ensureGlobalSnapshot()).thenReturn(snapshot);
        when(repository.ensureSnapshot("myscoutee-work")).thenReturn(AdminStatsSnapshot.createDefault("myscoutee-work"));
        when(repository.ensureSnapshot("myscoutee-community")).thenReturn(AdminStatsSnapshot.createDefault("myscoutee-community"));
        List<Users> records = new ArrayList<>();
        for (String status : List.of("public", "friends only", "host only", "inactive", "deleted", "blocked")) {
            var user = new Users(); user.setUserId(status); user.setProfileStatus(status); user.setGender("female"); records.add(user);
        }
        var staff = new Users(); staff.setUserId("staff"); staff.setProfileStatus("public"); staff.setHostTier("Admin"); staff.setGender("male"); records.add(staff);
        when(users.findAll()).thenReturn(records);
        new AdminStatsService(repository, new com.raxim.myscoutee.domain.accounts.service.ProfileStatisticsService(users), mock(com.raxim.myscoutee.domain.administration.api.AdministrativeActors.class),
                mock(com.raxim.myscoutee.domain.administration.service.AdminTelemetryScopeService.class),
                new AdminGraphScienceService(mock(com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository.class),
                    mock(com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository.class),
                    new com.raxim.myscoutee.domain.events.service.MemberDirectoryService(mock(com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository.class)), new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users))).refreshGraphScienceSnapshot();
        assertEquals(Map.of("female", 3L), snapshot.getActiveProfileGenders());
    }
    @Test void administratorAccessIsRecheckedAndRemovedRolesAreDenied() {
        var users = mock(UsersRepository.class); var roles = mock(AdminMenuCounterService.class);
        var user = new Users(); user.setUserId("admin"); user.setProfileStatus("public");
        when(users.findByUserId("admin")).thenReturn(Optional.of(user)); when(roles.isAdminUser(user)).thenReturn(true);
        var access = new AdminClientAccessService(new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users),  roles); assertSame(user, access.requireAdmin("admin"));
        user.setProfileStatus("inactive"); assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> access.requireAdmin("admin"));
        user.setProfileStatus("public"); when(roles.isAdminUser(user)).thenReturn(false);
        assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> access.requireAdmin("admin"));
    }
}
