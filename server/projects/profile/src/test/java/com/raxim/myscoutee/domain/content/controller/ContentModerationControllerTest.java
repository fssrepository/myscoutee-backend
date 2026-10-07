package com.raxim.myscoutee.domain.content.controller;

import com.raxim.myscoutee.domain.assets.service.AssetsService;
import com.raxim.myscoutee.domain.content.service.AdminModerationService;
import com.raxim.myscoutee.domain.content.service.ContentModerationService;
import com.raxim.myscoutee.domain.groups.service.CommunityGroupsService;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.WorkspaceSelection;
import com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Decision;

import com.raxim.myscoutee.domain.events.mapper.ActivityEventDetailMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
class ContentModerationControllerTest {
    final AdminModerationService admins = mock(AdminModerationService.class);
    final ContentModerationService moderation = mock(ContentModerationService.class);
    final CommunityGroupsService groups = mock(CommunityGroupsService.class);
    final MongoTemplate mongo = mock(MongoTemplate.class);
    final AssetsService assets = mock(AssetsService.class);
    final ContentModerationController controller = new ContentModerationController(admins, moderation, mongo,
            assets, mock(com.raxim.myscoutee.domain.events.api.EventModeration.class), groups);

    void member(String groupId) {
        var account = new Users(); account.setUserId("account");
        when(groups.actor("profile")).thenReturn(account);
        var profile = mock(UserDto.class);
        when(profile.id()).thenReturn("profile"); when(profile.name()).thenReturn("Moderator");
        when(profile.initials()).thenReturn("MO"); when(profile.images()).thenReturn(List.of());
        when(groups.select(account, groupId)).thenReturn(new WorkspaceSelection(null, profile, null));
    }
    @Test void groupModeratorUsesGroupAuthorityAndScopedStateInsteadOfAppAdminPrivileges() {
        member("A");
        controller.state("A", "profile");
        verify(groups).requireAdmin(any(Users.class), eq("A"));
        verify(moderation).snapshot("A");
        verifyNoInteractions(admins);
    }
    @Test void missingGroupAdminRoleStopsBeforeReadingModerationData() {
        doThrow(new ResponseStatusException(HttpStatus.FORBIDDEN)).when(groups).requireAdmin(any(), eq("A"));
        assertThrows(ResponseStatusException.class, () -> controller.state("A", "profile"));
        verifyNoInteractions(moderation, admins, mongo, assets);
    }
    @Test void foreignScopeItemCannotBeDecidedOrPreviewedEvenByAnotherGroupsAdmin() {
        member("A");
        when(moderation.scopedItem("feed:foreign", "A")).thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND));
        assertThrows(ResponseStatusException.class, () -> controller.decision("A", "feed:foreign",
                new Decision("profile", "decision", 1, "accepted", "")));
        assertThrows(ResponseStatusException.class, () -> controller.detail("A", "feed:foreign", "profile"));
        verify(moderation, never()).decide(anyString(), any(), any());
        verifyNoInteractions(mongo, assets);
    }
    @Test void globalEndpointStillRequiresAppAdmin() {
        when(admins.resolveAdminActor("profile")).thenThrow(new ResponseStatusException(HttpStatus.FORBIDDEN));
        assertThrows(ResponseStatusException.class, () -> controller.state(null, "profile"));
        verifyNoInteractions(groups, moderation);
    }
}
