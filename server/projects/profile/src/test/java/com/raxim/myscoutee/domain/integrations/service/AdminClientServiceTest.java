package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;
import com.raxim.myscoutee.domain.administration.repository.AdminStatsRepository;
import com.raxim.myscoutee.domain.administration.service.AdminMenuCounterService;
import com.raxim.myscoutee.domain.administration.service.AdminStatsService;
import com.raxim.myscoutee.domain.affinity.service.AdminGraphScienceService;
import com.raxim.myscoutee.domain.content.service.AdminModerationService;
import com.raxim.myscoutee.domain.integrations.repository.AdminClientRepository;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
class AdminClientServiceTest {
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
        var result = new AdminClientService(access, repository).overview("admin");
        assertEquals(5, result.statistics().activeProfiles()); assertEquals(5, result.statistics().registrations7Days());
        assertEquals(14, result.statistics().registrations30Days()); assertTrue(result.statistics().ready());
        verify(access).requireAdmin("admin");
    }
    @Test void noSnapshotIsExplicitlyNotReady() {
        var repository = mock(AdminClientRepository.class); var access = mock(AdminClientAccessService.class);
        when(access.requireAdmin("admin")).thenReturn(new Users());
        assertFalse(new AdminClientService(access, repository).overview("admin").statistics().ready());
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
        new AdminStatsService(repository, new com.raxim.myscoutee.domain.accounts.service.ProfileStatisticsService(users), mock(AdminModerationService.class),
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
