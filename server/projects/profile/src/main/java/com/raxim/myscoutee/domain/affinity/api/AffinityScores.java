package com.raxim.myscoutee.domain.affinity.api;
import java.util.Collection;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
public interface AffinityScores {
    double resolveUserAffinity(UserDto user);
    double resolveUserAffinity(WorkspaceProfile user);
    double resolveEventAffinity(Event event, Collection<? extends WorkspaceProfile> participants);
    double resolveEventBoost(Event event, Collection<? extends WorkspaceProfile> participants);
    double resolveAssetAffinity(Asset asset, WorkspaceProfile owner);
    double resolveAssetBoost(Asset asset, WorkspaceProfile owner);
}
