package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;

import com.raxim.myscoutee.domain.accounts.security.firebase.FirebaseAuthenticationToken;
import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class HomeUserProfileIdentityTest {
    @Mock
    private UsersRepository usersRepository;
    @InjectMocks
    private HomeUserProfileService service;

    @AfterEach
    void clearAuthentication() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void authenticatedMemberCannotSelectAnotherUsersProfile() {
        authenticate();
        Users own = new Users();
        own.setUserId("member");
        own.setName("Member");
        when(usersRepository.findByUserId("member")).thenReturn(Optional.of(own));

        assertThat(service.resolveCurrentUser("other-member")).isSameAs(own);
        verify(usersRepository, never()).findByUserId("other-member");
    }

    @Test
    void missingAuthenticatedProfileCannotFallBackToAnotherUser() {
        authenticate();
        when(usersRepository.findByUserId("member")).thenReturn(Optional.empty());

        assertThat(service.resolveCurrentUser("other-member")).isNull();
        verify(usersRepository, never()).findByUserId("other-member");
    }

    private void authenticate() {
        FirebasePrincipal principal = new FirebasePrincipal("member", "member@example.invalid", List.of("U"), null);
        SecurityContextHolder.getContext().setAuthentication(
                new FirebaseAuthenticationToken(principal, null, principal.getAuthorities()));
    }
}
