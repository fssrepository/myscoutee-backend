package com.raxim.myscoutee.common.config.firebase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;

import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AppSettingsService;

class FirebaseServiceTest {
    @Test
    void createsOnboardingUserForNewNormalFirebaseLogin() {
        ConfigProperties configProperties = mock(ConfigProperties.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        FirebaseCredential credential = mock(FirebaseCredential.class);

        String email = "new.person@example.com";
        String expectedUserId = stableUserId(email);
        when(credential.getEmail()).thenReturn("New.Person@Example.com");
        when(credential.getName()).thenReturn("");
        when(appSettingsService.isAdminEmail(email)).thenReturn(false);
        when(usersRepository.findFirstByEmail(email)).thenReturn(Optional.empty());
        when(usersRepository.findByUserId(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.findById(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FirebaseService service = new FirebaseService(configProperties, usersRepository, appSettingsService);

        UserDetails userDetails = service.loadUserByCredential(credential, null, "/auth/me");

        assertThat(userDetails).isInstanceOf(FirebasePrincipal.class);
        FirebasePrincipal principal = (FirebasePrincipal) userDetails;
        assertThat(principal.getUserId()).isEqualTo(expectedUserId);
        assertThat(principal.getEmail()).isEqualTo(email);
        assertThat(principal.getAuthorities()).extracting(Object::toString).containsExactly("U");

        verify(usersRepository).save(any(Users.class));
        Users created = principal.getUser();
        assertThat(created).isNotNull();
        assertThat(created.getId()).isEqualTo(expectedUserId);
        assertThat(created.getEmail()).isEqualTo(email);
        assertThat(created.getProfileStatus()).isEqualTo("onboarding");
        assertThat(created.getStatus()).isEqualTo("A");
        assertThat(created.getProfileFormVersion()).isZero();
        assertThat(created.getImages()).isEmpty();
        assertThat(created.getInitials()).isEqualTo("NP");
        assertThat(created.getDeletedAtIso()).isNotBlank();
    }

    @Test
    void doesNotCreateOnboardingUserForAdminLogin() {
        ConfigProperties configProperties = mock(ConfigProperties.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        FirebaseCredential credential = mock(FirebaseCredential.class);

        String email = "admin@example.com";
        String expectedUserId = stableUserId(email);
        when(credential.getEmail()).thenReturn(email);
        when(appSettingsService.isAdminEmail(email)).thenReturn(true);
        when(usersRepository.findFirstByEmail(email)).thenReturn(Optional.empty());
        when(usersRepository.findByUserId(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.findById(expectedUserId)).thenReturn(Optional.empty());

        FirebaseService service = new FirebaseService(configProperties, usersRepository, appSettingsService);

        UserDetails userDetails = service.loadUserByCredential(credential, null, "/admin");

        assertThat(userDetails).isInstanceOf(FirebasePrincipal.class);
        FirebasePrincipal principal = (FirebasePrincipal) userDetails;
        assertThat(principal.getUserId()).isEqualTo(expectedUserId);
        assertThat(principal.getAuthorities()).extracting(Object::toString).containsExactly("A");
        assertThat(principal.getUser()).isNull();
        verify(usersRepository, never()).save(any(Users.class));
    }

    @Test
    void configAdminUserGetsAdminRoleWithoutOnboardingUser() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setAdminUser("Admin@Example.com");
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        FirebaseCredential credential = mock(FirebaseCredential.class);

        String email = "admin@example.com";
        String expectedUserId = stableUserId(email);
        when(credential.getEmail()).thenReturn("Admin@Example.com");
        when(usersRepository.findFirstByEmail(email)).thenReturn(Optional.empty());
        when(usersRepository.findByUserId(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.findById(expectedUserId)).thenReturn(Optional.empty());

        FirebaseService service = new FirebaseService(configProperties, usersRepository, appSettingsService);

        UserDetails userDetails = service.loadUserByCredential(credential, null, "/admin");

        FirebasePrincipal principal = (FirebasePrincipal) userDetails;
        assertThat(principal.getUserId()).isEqualTo(expectedUserId);
        assertThat(principal.getAuthorities()).extracting(Object::toString).containsExactly("A");
        assertThat(principal.getUser()).isNull();
        verify(usersRepository, never()).save(any(Users.class));
    }

    @Test
    void devLookupKeepsLegacyIdentityAndMemberAuthorityForOrdinaryStoredUser() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setDevUser("dev@myscoutee.local");
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        Users ordinary = new Users();
        ordinary.setUserId("ordinary");
        ordinary.setEmail("stored.admin-looking@example.com");
        ordinary.setHostTier("Operator");
        when(usersRepository.findByUserId("ordinary")).thenReturn(Optional.of(ordinary));

        FirebasePrincipal principal = (FirebasePrincipal) new FirebaseService(
                configProperties,
                usersRepository,
                appSettingsService)
                .loadUserById("ordinary");

        assertThat(principal.getEmail()).isEqualTo("dev@myscoutee.local");
        assertThat(principal.getAuthorities()).extracting(Object::toString)
                .containsExactly("U");
    }

    @Test
    void usesFirebaseUidWhenProviderDoesNotReturnEmail() {
        ConfigProperties configProperties = mock(ConfigProperties.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        FirebaseCredential credential = mock(FirebaseCredential.class);

        String fallbackEmail = "facebook-uid-1@firebase.local";
        String expectedUserId = stableUserId(fallbackEmail);
        when(credential.getEmail()).thenReturn(null);
        when(credential.getUid()).thenReturn("facebook-uid-1");
        when(credential.getFacebookId()).thenReturn("facebook-provider-1");
        when(credential.getName()).thenReturn("Facebook User");
        when(appSettingsService.isAdminEmail(fallbackEmail)).thenReturn(false);
        when(usersRepository.findFirstByEmail(fallbackEmail)).thenReturn(Optional.empty());
        when(usersRepository.findByUserId(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.findById(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FirebaseService service = new FirebaseService(configProperties, usersRepository, appSettingsService);

        UserDetails userDetails = service.loadUserByCredential(credential, null, "/auth/me");

        FirebasePrincipal principal = (FirebasePrincipal) userDetails;
        assertThat(principal.getUserId()).isEqualTo(expectedUserId);
        assertThat(principal.getEmail()).isEqualTo(fallbackEmail);
        assertThat(principal.getUser().getEmail()).isEqualTo(fallbackEmail);
        assertThat(principal.getUser().getFirebaseUid()).isEqualTo("facebook-uid-1");
        assertThat(principal.getUser().getFacebookId()).isEqualTo("facebook-provider-1");
        assertThat(principal.getUser().getInitials()).isEqualTo("FU");
    }

    @Test
    void configuredOperatorGetsAdditiveAuthorityAndAnOperatorRecord() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setOperatorUser("operator@example.com");
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        FirebaseCredential credential = mock(FirebaseCredential.class);
        String expectedUserId = stableUserId("operator@example.com");
        when(credential.getEmail()).thenReturn("operator@example.com");
        when(credential.getName()).thenReturn("Configured Operator");
        when(usersRepository.findFirstByEmail("operator@example.com")).thenReturn(Optional.empty());
        when(usersRepository.findByUserId(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.findById(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.save(any(Users.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FirebasePrincipal principal = (FirebasePrincipal) new FirebaseService(
                configProperties,
                usersRepository,
                appSettingsService)
                .loadUserByCredential(credential, null, "/api/operator/registry");

        assertThat(principal.getAuthorities()).extracting(Object::toString)
                .containsExactly("U", "O");
        assertThat(principal.getUser()).isNotNull();
        assertThat(principal.getUser().isOperator()).isTrue();
        assertThat(principal.getUser().getHostTier()).isEqualTo("Operator");
        assertThat(principal.getUser().getProfileStatus()).isEqualTo("public");
    }

    @Test
    void demoOperatorLookupFailsClosedForMissingOrOrdinaryUsers() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setOperatorUser("dev@myscoutee.local");
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        Users ordinary = new Users();
        ordinary.setUserId("ordinary");
        ordinary.setEmail("ordinary@example.com");
        when(usersRepository.findByUserId("missing")).thenReturn(Optional.empty());
        when(usersRepository.findById("missing")).thenReturn(Optional.empty());
        when(usersRepository.findByUserId("ordinary")).thenReturn(Optional.of(ordinary));

        FirebaseService service = new FirebaseService(
                configProperties,
                usersRepository,
                appSettingsService);

        assertThat(service.loadDemoOperatorById("missing")).isNull();
        assertThat(service.loadDemoOperatorById("ordinary")).isNull();
    }

    @Test
    void storedOperatorFlagAddsOperatorAuthorityWithoutChangingLegacyBaseRole() {
        ConfigProperties configProperties = new ConfigProperties();
        configProperties.setDevUser("dev@myscoutee.local");
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        Users operator = new Users();
        operator.setUserId("operator");
        operator.setEmail("operator@example.com");
        operator.setOperator(true);
        when(usersRepository.findByUserId("operator")).thenReturn(Optional.of(operator));

        FirebasePrincipal principal = (FirebasePrincipal) new FirebaseService(
                configProperties,
                usersRepository,
                appSettingsService)
                .loadUserById("operator");

        assertThat(principal.getEmail()).isEqualTo("operator@example.com");
        assertThat(principal.getAuthorities()).extracting(Object::toString)
                .containsExactly("U", "O");
    }

    @Test
    void returnsConcurrentlyCreatedOnboardingUserWhenInsertRaces() {
        ConfigProperties configProperties = mock(ConfigProperties.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        FirebaseCredential credential = mock(FirebaseCredential.class);

        String email = "race.person@example.com";
        String expectedUserId = stableUserId(email);
        Users existing = new Users();
        existing.setUserId(expectedUserId);
        existing.setEmail(email);
        existing.setStatus("A");
        existing.setProfileStatus("onboarding");

        when(credential.getEmail()).thenReturn(email);
        when(credential.getGoogleId()).thenReturn("google-race-id");
        when(appSettingsService.isAdminEmail(email)).thenReturn(false);
        when(usersRepository.findFirstByEmail(email)).thenReturn(Optional.empty());
        when(usersRepository.findByUserId(expectedUserId))
                .thenReturn(Optional.empty())
                .thenReturn(Optional.empty())
                .thenReturn(Optional.of(existing));
        when(usersRepository.findById(expectedUserId)).thenReturn(Optional.empty());
        when(usersRepository.save(any(Users.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate user"))
                .thenAnswer(invocation -> invocation.getArgument(0));

        FirebaseService service = new FirebaseService(configProperties, usersRepository, appSettingsService);

        UserDetails userDetails = service.loadUserByCredential(credential, null, "/auth/me");

        FirebasePrincipal principal = (FirebasePrincipal) userDetails;
        assertThat(principal.getUserId()).isEqualTo(expectedUserId);
        assertThat(principal.getUser()).isSameAs(existing);
        assertThat(existing.getGoogleId()).isEqualTo("google-race-id");
        verify(usersRepository, times(2)).save(any(Users.class));
    }

    private static String stableUserId(String email) {
        return UUID.nameUUIDFromBytes(email.getBytes(StandardCharsets.UTF_8)).toString();
    }
}
