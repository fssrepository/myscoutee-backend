package com.raxim.myscoutee.domain.accounts.service;

import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.json.JsonMapper;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Tag("standard")
class ProfileIdentitiesTest {
    @Test void projectsOnlyIdentityAndPreservesAbsenceAndNullAccount() {
        var users = mock(UsersRepository.class);
        var profile = new Users();
        profile.setUserId("workspace-profile");
        profile.setAccountUserId("account");
        profile.setWorkspaceGroupId("work");
        profile.setEmail("private@example.invalid");
        profile.setName("Private name");
        when(users.findByUserId("workspace-profile")).thenReturn(Optional.of(profile));
        when(users.findByUserId("missing")).thenReturn(Optional.empty());
        var directory = new ProfileDirectoryService(users, null);
        var identity = directory.findIdentityByUserId("workspace-profile").orElseThrow();
        assertEquals(new ProfileIdentityDto("workspace-profile", "account", "work"), identity);
        var json = new JsonMapper().valueToTree(identity);
        assertEquals(3, json.size());
        assertFalse(json.has("email"));
        assertFalse(json.has("name"));
        assertTrue(directory.findIdentityByUserId("missing").isEmpty());
        profile.setAccountUserId(null);
        profile.setWorkspaceGroupId(null);
        var base = directory.findIdentityByUserId("workspace-profile").orElseThrow();
        assertNull(base.accountUserId());
        assertNull(base.workspaceGroupId());
        verify(users, times(2)).findByUserId("workspace-profile");
        verify(users).findByUserId("missing");
        verifyNoMoreInteractions(users);
    }
}
