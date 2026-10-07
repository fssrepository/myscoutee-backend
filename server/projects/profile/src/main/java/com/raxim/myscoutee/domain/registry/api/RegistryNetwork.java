package com.raxim.myscoutee.domain.registry.api;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionCommand;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionOutcome;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.AnnouncementOutcome;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ClaimStatus;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardDeploymentPage;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardPage;
public interface RegistryNetwork {
    ActionOutcome apply(RegistryConfiguration properties, ActionCommand command);
    LeaderboardPage leaderboard(
            RegistryConfiguration properties,
            String view,
            String throughPeriod,
            Integer limit,
            String cursor);
    ClaimStatus claimStatus(RegistryConfiguration properties);
    AnnouncementOutcome announcements(
            RegistryConfiguration properties,
            String kind,
            String severity,
            String channel,
            boolean includeExpired,
            Integer limit,
            String cursor);
    LeaderboardDeploymentPage leaderboardDeployments(
            RegistryConfiguration properties,
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor);
}
