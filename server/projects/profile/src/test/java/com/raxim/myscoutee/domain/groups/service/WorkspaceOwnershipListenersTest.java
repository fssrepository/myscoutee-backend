package com.raxim.myscoutee.domain.groups.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import com.raxim.myscoutee.domain.accounts.api.ProfileIdentities;
import com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.assets.service.AssetWorkspaceDocumentListener;
import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.service.EventWorkspaceDocumentListener;

@Tag("standard")
class WorkspaceOwnershipListenersTest {
    @Test void eachOwnerStampsItsOwnDocumentUsingTheStoredProfileAndClearsUnownedScope() {
        var profiles = mock(ProfileIdentities.class);
        @SuppressWarnings("unchecked") var provider = (ObjectProvider<ProfileIdentities>) mock(ObjectProvider.class);
        when(provider.getObject()).thenReturn(profiles);
        var owner = new ProfileIdentityDto("owner", "account", "workspace");
        doReturn(Optional.of(owner)).when(profiles).findIdentityByUserId("owner");
        var event = new ActivityEvent(); event.setCreatorUserId("owner"); event.setWorkspaceGroupId("untrusted");
        var asset = new Asset(); asset.setOwnerUserId("owner"); asset.setWorkspaceGroupId("untrusted");
        var eventListener = new EventWorkspaceDocumentListener(provider);
        var assetListener = new AssetWorkspaceDocumentListener(provider);
        eventListener.onBeforeConvert(new BeforeConvertEvent<>(event, "events"));
        assetListener.onBeforeConvert(new BeforeConvertEvent<>(asset, "assets"));
        assertThat(event.getWorkspaceGroupId()).isEqualTo("workspace");
        assertThat(asset.getWorkspaceGroupId()).isEqualTo("workspace");
        verify(profiles, times(2)).findIdentityByUserId("owner");
        doReturn(Optional.empty()).when(profiles).findIdentityByUserId("owner");
        eventListener.onBeforeConvert(new BeforeConvertEvent<>(event, "events"));
        assetListener.onBeforeConvert(new BeforeConvertEvent<>(asset, "assets"));
        assertThat(event.getWorkspaceGroupId()).isNull(); assertThat(asset.getWorkspaceGroupId()).isNull();
    }
}
