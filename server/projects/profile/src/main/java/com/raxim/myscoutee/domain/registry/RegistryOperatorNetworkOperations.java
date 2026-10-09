package com.raxim.myscoutee.domain.registry;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionCommand;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ActionOutcome;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.AnnouncementOutcome;
import com.raxim.myscoutee.domain.registry.dto.RegistryNetworkValues.ClaimStatus;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardDeploymentPage;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.LeaderboardPage;

import tools.jackson.databind.ObjectMapper;

/**
 * Stateless Spring bridge for per-mode, operator-selected registry settings.
 */
@Component
public class RegistryOperatorNetworkOperations implements com.raxim.myscoutee.domain.registry.api.RegistryNetwork {
    private final ObjectMapper objectMapper;

    public RegistryOperatorNetworkOperations(ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "Object mapper must not be null.");
    }

    public ActionOutcome apply(RegistryConfiguration properties, ActionCommand command) {
        return new RegistryOperatorNetworkService(properties, objectMapper).apply(command);
    }

    public LeaderboardPage leaderboard(
            RegistryConfiguration properties,
            String view,
            String throughPeriod,
            Integer limit,
            String cursor) {
        return new RegistryOperatorNetworkService(properties, objectMapper)
                .leaderboard(view, throughPeriod, limit, cursor);
    }

    public ClaimStatus claimStatus(RegistryConfiguration properties) {
        return new RegistryOperatorNetworkService(properties, objectMapper).claimStatus();
    }

    public AnnouncementOutcome announcements(
            RegistryConfiguration properties,
            String kind,
            String severity,
            String channel,
            boolean includeExpired,
            Integer limit,
            String cursor) {
        return new RegistryOperatorNetworkService(properties, objectMapper)
                .announcements(
                        kind,
                        severity,
                        channel,
                        includeExpired,
                        limit,
                        cursor);
    }

    public LeaderboardDeploymentPage leaderboardDeployments(
            RegistryConfiguration properties,
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor) {
        return new RegistryOperatorNetworkService(properties, objectMapper)
                .leaderboardDeployments(groupId, throughPeriod, limit, cursor);
    }
}
