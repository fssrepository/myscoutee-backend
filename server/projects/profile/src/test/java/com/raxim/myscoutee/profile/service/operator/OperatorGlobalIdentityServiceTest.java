package com.raxim.myscoutee.profile.service.operator;

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

import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.GlobalIdentityLinkStateRepository;
import com.raxim.myscoutee.profile.repository.PrivacyConsentsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.RegisteredRuntime;
import com.raxim.myscoutee.registry.GlobalIdentityVoprfClient;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityVoprfKey;

import tools.jackson.databind.ObjectMapper;

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
                        mock(OperatorRevenueRegistryRuntimeResolver.class),
                        linkRepository,
                        usersRepository,
                        privacyConsentsRepository,
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
