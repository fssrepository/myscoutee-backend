package com.raxim.myscoutee.domain.operator.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.security.SecureRandom;
import java.time.Clock;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.operator.repository.GlobalIdentityLinkStateRepository;
import com.raxim.myscoutee.domain.accounts.repository.PrivacyConsentsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import com.raxim.myscoutee.domain.registry.api.GlobalIdentityVoprfClient;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.GlobalIdentityVoprfKey;

import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
class OperatorGlobalIdentityServiceTest {

    @Test
    void qualifiedUserRequiresTheExistingPrivacyAcceptance() {
        GlobalIdentityLinkStateRepository linkRepository = mock(
                GlobalIdentityLinkStateRepository.class);
        UsersRepository usersRepository = mock(UsersRepository.class);
        PrivacyConsentsRepository privacyConsentsRepository = mock(
                PrivacyConsentsRepository.class);
        GlobalIdentityVoprfClient voprfClient = mock(
                GlobalIdentityVoprfClient.class);
        OperatorGlobalIdentityService service =
                new OperatorGlobalIdentityService(
                        RegistryRuntimeTestSupport.resolver(),
                        linkRepository,
                        new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository),
                        new com.raxim.myscoutee.domain.accounts.service.AccountConsentService(privacyConsentsRepository),
                        mock(ObjectMapper.class),
                        voprfClient,
                        Clock.systemUTC(),
                        new SecureRandom());

        Users user = new Users();
        user.setUserId("user-1");
        user.setEmail("member@example.test");
        when(usersRepository.findByUserIdIn(anyCollection()))
                .thenReturn(List.of(user));
        when(privacyConsentsRepository
                .findTopByUserIdOrderByUpdatedAtIsoDesc("user-1"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.prepareQualifiedUsersForRegistry(
                mock(RegisteredRuntime.class),
                mock(GlobalIdentityVoprfKey.class),
                "2026-06",
                List.of("user-1")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("accepted privacy context");

        verifyNoInteractions(linkRepository, voprfClient);
    }
}
