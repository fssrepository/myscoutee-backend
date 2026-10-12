package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.*;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.accounts.api.ProfileReadState;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.*;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.repository.UserSessionActionsRepository;
import com.raxim.myscoutee.domain.access.api.AccessPermissions;
import com.raxim.myscoutee.domain.access.api.RegionSecurity;
import com.raxim.myscoutee.domain.administration.api.OperationalTelemetry;
import com.raxim.myscoutee.domain.notifications.api.NotificationJobs;
import com.raxim.myscoutee.domain.platform.api.CountryDirectory;
import com.raxim.myscoutee.domain.platform.api.JobAudience;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

@Tag("standard")
class AccountCoreOperationsTest {
    final UsersRepository users = mock(UsersRepository.class);
    final UserSessionActionsRepository actions = mock(UserSessionActionsRepository.class);
    final ProfileStatusWork status = mock(ProfileStatusWork.class);
    final AccessPermissions access = mock(AccessPermissions.class);
    final ProfileReadState reads = mock(ProfileReadState.class);
    final OperationalTelemetry telemetry = mock(OperationalTelemetry.class);
    final JobAudience scope = mock(JobAudience.class);
    final NotificationJobs jobs = mock(NotificationJobs.class);
    final CountryDirectory countries = mock(CountryDirectory.class);
    final RegionSecurity regions = mock(RegionSecurity.class);
    AnnotationConfigApplicationContext context;
    AccountLifecycleService lifecycle;
    AccountLocationService locations;

    @BeforeEach void startWithoutProductServices() {
        context = new AnnotationConfigApplicationContext();
        var beans = context.getBeanFactory();
        beans.registerSingleton("users", users);
        beans.registerSingleton("actions", actions);
        beans.registerSingleton("status", status);
        beans.registerSingleton("access", access);
        beans.registerSingleton("reads", reads);
        beans.registerSingleton("telemetry", telemetry);
        beans.registerSingleton("scope", scope);
        beans.registerSingleton("jobs", jobs);
        beans.registerSingleton("countries", countries);
        beans.registerSingleton("regions", regions);
        context.register(SelectedProfileService.class, AccountLifecycleService.class, AccountLocationService.class);
        context.refresh();
        lifecycle = context.getBean(AccountLifecycleService.class);
        locations = context.getBean(AccountLocationService.class);
    }

    @AfterEach void close() { context.close(); }

    @Test void logoutStillWritesOnlyTheExistingSessionAudit() {
        account("member");
        assertThat(lifecycle.logout(new UserLogoutRequestDto("member")).submitted()).isTrue();
        verify(users).findByUserId("member");
        verifyNoMoreInteractions(users);
        verify(actions).save(argThat(row -> "member".equals(row.getUserId()) && "logout".equals(row.getAction())
                && "session".equals(row.getMetadata()) && row.getId() != null && row.getSyncKey() != null));
        verifyNoInteractions(status, access, reads, telemetry, jobs, countries);
    }

    @Test void deletionKeepsAuthorizationReadsSideEffectOrderAndOnePurgeCounterIncrement() {
        var user = account("member");
        when(access.canCurrentActorDeleteProfile("member")).thenReturn(true);
        when(scope.forUser("member")).thenReturn("workspace");
        doAnswer(call -> {
            assertThat(JobGroupContext.groupId()).isEqualTo("workspace");
            return null;
        }).when(jobs).adjustPendingCount(NotificationJobs.RULE_ACCOUNT_PURGE, 1, "admin.jobs.table.affected");
        assertThat(lifecycle.deleteUser(new UserDeleteRequestDto("member")).submitted()).isTrue();
        assertThat(user.getStatus()).isEqualTo("D");
        assertThat(user.getProfileStatus()).isEqualTo("deleted");
        assertThat(user.getPreviousProfileStatus()).isEqualTo("public");
        assertThat(user.getDeletedAtIso()).isNotBlank();
        assertThat(user.getAccountPurgePendingCounterTracked()).isTrue();
        var order = inOrder(users, access, status, scope, jobs, reads, actions, telemetry);
        order.verify(users).findByUserId("member");
        order.verify(access).canCurrentActorDeleteProfile("member");
        order.verify(users).findByUserId("member");
        order.verify(status).save(user);
        order.verify(scope).forUser("member");
        order.verify(jobs).adjustPendingCount(NotificationJobs.RULE_ACCOUNT_PURGE, 1, "admin.jobs.table.affected");
        order.verify(reads).evictUserReadCaches("member");
        order.verify(actions).save(argThat(row -> "delete".equals(row.getAction()) && "status:D".equals(row.getMetadata())));
        order.verify(telemetry).record("profile.deleted", "profiles", "member", "member");
        order.verifyNoMoreInteractions();
        assertThat(JobGroupContext.isActive()).isFalse();
        lifecycle.scheduleUserDeletionByUserId("member", "facebook-data-deletion");
        verify(jobs, times(1)).adjustPendingCount(NotificationJobs.RULE_ACCOUNT_PURGE, 1, "admin.jobs.table.affected");
        assertThat(user.getPreviousProfileStatus()).isEqualTo("public");
    }

    @Test void deniedDeletionDoesNotStartStatusWorkOrWriteAnAudit() {
        account("member");
        assertThatThrownBy(() -> lifecycle.deleteUser(new UserDeleteRequestDto("member")))
                .isInstanceOfSatisfying(ResponseStatusException.class, error -> assertThat(error.getStatusCode().value()).isEqualTo(403));
        verify(users).findByUserId("member");
        verifyNoInteractions(status, actions, jobs, reads, telemetry);
    }

    @Test void failedStatusSaveDoesNotReportDeletionSuccessOrAdvanceLaterSteps() {
        var user = account("member");
        when(status.save(user)).thenThrow(new IllegalStateException("save failed"));
        assertThatThrownBy(() -> lifecycle.scheduleUserDeletionByUserId("member", "facebook-data-deletion"))
                .isInstanceOf(IllegalStateException.class).hasMessage("save failed");
        verifyNoInteractions(actions, jobs, reads, telemetry);
    }

    @Test void accountAndSelectedProfileLocationShareOneCountryLookupAndTargetedWrites() {
        var account = account("account");
        var profile = account("profile");
        profile.setAccountUserId("account");
        profile.setWorkspaceGroupId("workspace");
        when(access.canCurrentActorEditProfile("profile")).thenReturn(true);
        var point = new LocationCoordinatesDto(47.5, 19.0);
        when(countries.resolvePartitionKey(point, null)).thenReturn("country:hu");
        locations.updateLoadedLocation("profile", 47.5, 19.0);
        verify(countries).resolvePartitionKey(point, null);
        verifyNoMoreInteractions(countries);
        verify(users).findByUserId("profile");
        verify(users).findByUserId("account");
        verify(users).updateLocation("account", new Users.LocationCoordinatesRecord(47.5, 19.0), "country:hu");
        verify(users).updateLocation("profile", new Users.LocationCoordinatesRecord(47.5, 19.0), "country:hu");
        verifyNoMoreInteractions(users);
        verify(reads).evictUserReadCaches("account");
        verify(reads).evictUserReadCaches("profile");
        assertThat(account.getLocationCoordinates()).isEqualTo(profile.getLocationCoordinates());
    }

    @Test void rejectedPendingLocationRetainsTheAdmittedLocationButMissingLocationStillDenies() {
        var user = account("member");
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(47.5, 19.0));
        when(access.canCurrentActorEditProfile("member")).thenReturn(true);
        when(regions.isEnabled()).thenReturn(true);
        locations.updateLoadedLocation("member", 10.0, 10.0);
        assertThat(user.getLocationCoordinates()).isEqualTo(new Users.LocationCoordinatesRecord(47.5, 19.0));
        user.setLocationCoordinates(null);
        assertThatThrownBy(() -> locations.updateLoadedLocation("member", 10.0, 10.0))
                .isInstanceOfSatisfying(ResponseStatusException.class, error -> assertThat(error.getStatusCode().value()).isEqualTo(403));
        verify(users, never()).updateLocation(anyString(), any(), any());
        verifyNoInteractions(reads);
    }

    @Test void disabledRegionGateSkipsCountryLookupAndCountryFailureIsNotAccepted() {
        assertThat(locations.queryLocationEligibility(null, null).eligible()).isTrue();
        verifyNoInteractions(countries);
        when(regions.isEnabled()).thenReturn(true);
        when(countries.resolvePartitionKey(new LocationCoordinatesDto(47.5, 19.0)))
                .thenThrow(new IllegalStateException("country owner unavailable"));
        assertThatThrownBy(() -> locations.queryLocationEligibility(47.5, 19.0))
                .isInstanceOf(IllegalStateException.class).hasMessage("country owner unavailable");
    }

    private Users account(String id) {
        var user = new Users();
        user.setUserId(id); user.setName(id); user.setStatus("A"); user.setProfileStatus("public");
        when(users.findByUserId(id)).thenReturn(Optional.of(user));
        return user;
    }
}
