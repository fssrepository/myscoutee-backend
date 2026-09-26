package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.document.CommunityGroup;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.profile.security.AccessControlService;
import com.raxim.myscoutee.profile.service.IntegrationTokenService.AuthenticatedIntegrationClient;

class IntegrationCapabilitiesServiceTest {
    private final CommunityGroupsService groups = mock(CommunityGroupsService.class);
    private final CommunityGroupsRepository repository = mock(CommunityGroupsRepository.class);
    private final AccessControlService access = mock(AccessControlService.class);
    private final IntegrationCapabilitiesService service = new IntegrationCapabilitiesService(groups, repository, access);

    private UsernamePasswordAuthenticationToken authentication(Users profile) {
        var auth = new UsernamePasswordAuthenticationToken(new FirebasePrincipal(profile.getUserId(), null, "INTEGRATION", profile), null, List.of());
        auth.setDetails(new AuthenticatedIntegrationClient(profile.getUserId(), "key", "client"));
        return auth;
    }

    @Test void baseProfileUsesExistingCreatePoliciesAndDoesNotInventAdminRights() {
        var profile = new Users(); profile.setUserId("base"); profile.setName("Base");
        when(groups.actor("base")).thenReturn(profile);
        when(groups.administeredGroups(profile)).thenReturn(List.of());
        when(access.canCurrentActorCreateAsset("base", "*")).thenReturn(true);
        var result = service.describe(authentication(profile));
        assertThat(result.profileId()).isEqualTo("base");
        assertThat(result.groupId()).isNull();
        assertThat(result.operations()).contains("createAssets", "event").doesNotContain("createEvents", "inviteGroupParticipants");
        assertThat(result.inviteGroups()).isEmpty();
        verifyNoInteractions(repository);
    }

    @Test void groupProfileAdvertisesItsActualScopeAndNoAssetCreation() {
        var profile = new Users(); profile.setUserId("group-profile"); profile.setWorkspaceGroupId("g1");
        var account = new Users(); account.setUserId("account");
        var group = new CommunityGroup("g1", "account", "Team", null, null, null, "private", false, null, null, null, null, null, null);
        when(groups.actor("group-profile")).thenReturn(account);
        when(groups.administeredGroups(account)).thenReturn(List.of(group));
        when(repository.findById("g1")).thenReturn(Optional.of(group));
        when(access.canCurrentActorCreateEvent("group-profile", "*")).thenReturn(true);
        var result = service.describe(authentication(profile));
        assertThat(result.groupId()).isEqualTo("g1");
        assertThat(result.groupName()).isEqualTo("Team");
        assertThat(result.operations()).contains("createEvents", "inviteGroupParticipants").doesNotContain("createAssets");
        assertThat(result.inviteGroups()).extracting(item -> item.id()).containsExactly("g1");
        verify(access, never()).canCurrentActorCreateAsset(anyString(), anyString());
    }

    @Test void rejectsNonIntegrationOrMismatchedIdentity() {
        assertThatThrownBy(() -> service.describe(null)).isInstanceOf(ResponseStatusException.class);
        var profile = new Users(); profile.setUserId("owner");
        var auth = authentication(profile);
        auth.setDetails(new AuthenticatedIntegrationClient("other", "key", "client"));
        assertThatThrownBy(() -> service.describe(auth)).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(groups, repository, access);
    }
}
