package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.platform.service.AppSettingsService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@org.junit.jupiter.api.Tag("standard")
class AdminAudienceServiceTest {
    @AfterEach
    void clearMongoMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void demoAudienceIncludesBothDemoAdmins() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        AdminAudienceService service = new AdminAudienceService(new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(mock(UsersRepository.class), null), mock(AppSettingsService.class));

        List<String> recipients = service.adminNotificationRecipientUserIds("admin-demo-ava");

        assertThat(recipients).containsExactly("admin-demo-ava", "admin-demo-noel");
    }

    @Test
    void realAudienceResolvesConfiguredEmailsAndSkipsSuppressedUsers() {
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        AppSettingsService appSettingsService = mock(AppSettingsService.class);
        when(appSettingsService.adminEmails()).thenReturn(List.of("lead@example.com", "inactive-admin"));
        UsersRepository usersRepository = mock(UsersRepository.class);
        Users lead = user("lead-user", "lead@example.com", "public");
        Users inactive = user("inactive-admin", "inactive@example.com", "inactive");
        when(usersRepository.findByUserIdIn(anyCollection())).thenReturn(List.of(inactive));
        when(usersRepository.findByEmailIn(anyCollection())).thenReturn(List.of(lead));
        when(usersRepository.findByUserId("actor-admin")).thenReturn(Optional.empty());
        AdminAudienceService service = new AdminAudienceService(new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(usersRepository, null), appSettingsService);

        List<String> recipients = service.adminNotificationRecipientUserIds("actor-admin");

        assertThat(recipients).containsExactly("lead-user", "actor-admin");
    }

    private Users user(String userId, String email, String profileStatus) {
        Users user = new Users();
        user.setUserId(userId);
        user.setEmail(email);
        user.setProfileStatus(profileStatus);
        return user;
    }
}
