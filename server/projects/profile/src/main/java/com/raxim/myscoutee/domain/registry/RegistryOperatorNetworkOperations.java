package com.raxim.myscoutee.domain.registry;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.registry.config.RegistryProperties;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkService.ActionCommand;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkService.ActionOutcome;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkService.AnnouncementOutcome;
import com.raxim.myscoutee.domain.registry.RegistryOperatorNetworkService.ClaimStatus;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardDeploymentPage;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardPage;

import tools.jackson.databind.ObjectMapper;

/**
 * Stateless Spring bridge for per-mode, operator-selected registry settings.
 */
@Component
public class RegistryOperatorNetworkOperations {
    private final ObjectMapper objectMapper;

    public RegistryOperatorNetworkOperations(ObjectMapper objectMapper) {
        this.objectMapper = Objects.requireNonNull(objectMapper, "Object mapper must not be null.");
    }

    public ActionOutcome apply(RegistryProperties properties, ActionCommand command) {
        return new RegistryOperatorNetworkService(properties, objectMapper).apply(command);
    }

    public LeaderboardPage leaderboard(
            RegistryProperties properties,
            String view,
            String throughPeriod,
            Integer limit,
            String cursor) {
        return new RegistryOperatorNetworkService(properties, objectMapper)
                .leaderboard(view, throughPeriod, limit, cursor);
    }

    public ClaimStatus claimStatus(RegistryProperties properties) {
        return new RegistryOperatorNetworkService(properties, objectMapper).claimStatus();
    }

    public AnnouncementOutcome announcements(
            RegistryProperties properties,
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
            RegistryProperties properties,
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor) {
        return new RegistryOperatorNetworkService(properties, objectMapper)
                .leaderboardDeployments(groupId, throughPeriod, limit, cursor);
    }
}
