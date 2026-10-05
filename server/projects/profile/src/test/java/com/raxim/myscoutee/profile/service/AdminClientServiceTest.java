package com.raxim.myscoutee.profile.service;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.profile.data.document.*;
import com.raxim.myscoutee.profile.repository.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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
        when(repository.stats()).thenReturn(stats);
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
        List<Users> records = new ArrayList<>();
        for (String status : List.of("public", "friends only", "host only", "inactive", "deleted", "blocked")) {
            var user = new Users(); user.setUserId(status); user.setProfileStatus(status); user.setGender("female"); records.add(user);
        }
        var staff = new Users(); staff.setUserId("staff"); staff.setProfileStatus("public"); staff.setHostTier("Admin"); staff.setGender("male"); records.add(staff);
        when(users.findAll()).thenReturn(records);
        new AdminStatsService(repository, users, mock(AdminModerationService.class), mock(AdminGraphScienceService.class)).refreshGraphScienceSnapshot();
        assertEquals(Map.of("female", 3L), snapshot.getActiveProfileGenders());
    }
    @Test void administratorAccessIsRecheckedAndRemovedRolesAreDenied() {
        var users = mock(UsersRepository.class); var roles = mock(AdminMenuCounterService.class);
        var user = new Users(); user.setUserId("admin"); user.setProfileStatus("public");
        when(users.findByUserId("admin")).thenReturn(Optional.of(user)); when(roles.isAdminUser(user)).thenReturn(true);
        var access = new AdminClientAccessService(users, roles); assertSame(user, access.requireAdmin("admin"));
        user.setProfileStatus("inactive"); assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> access.requireAdmin("admin"));
        user.setProfileStatus("public"); when(roles.isAdminUser(user)).thenReturn(false);
        assertThrows(org.springframework.web.server.ResponseStatusException.class, () -> access.requireAdmin("admin"));
    }
}
