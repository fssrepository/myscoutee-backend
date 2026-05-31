package com.raxim.myscoutee.common.config.firebase;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.Test;
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

    private static String stableUserId(String email) {
        return UUID.nameUUIDFromBytes(email.getBytes(StandardCharsets.UTF_8)).toString();
    }
}
