package com.raxim.myscoutee.domain.registry.api;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import java.net.URI;
public interface RegistryTransport {
    RegistryProtocol.RegistryIdentityResponse inspectIdentity();
    RegistryProtocol.RegistrationResponse register(RegistryProtocol.RegistrationRequest request);
    RegistryProtocol.BatchResponse submitInstallationBatch(RegistryProtocol.BatchRequest request);
    RegistryProtocol.BatchResponse submitMauBatch(
            RegistryProtocol.BatchRequest request);
    RegistryProtocol.RevenueBatchResponse submitRevenueBatch(
            RegistryProtocol.RevenueBatchRequest request);
    RegistryProtocol.SettlementQueryResponse querySettlements(
            RegistryProtocol.SettlementQueryRequest request);
    RegistryProtocol.GlobalIdentityVoprfKey
            currentGlobalIdentityVoprfKey();
    RegistryProtocol.GlobalIdentityEvaluationResponse
            evaluateGlobalIdentity(
                    RegistryProtocol.GlobalIdentityEvaluationRequest request);
    RegistryProtocol.GlobalIdentityMutationResponse linkGlobalIdentity(
            RegistryProtocol.GlobalIdentityLinkRequest request);
    RegistryProtocol.GlobalIdentityMutationResponse
            applyGlobalIdentityLinkAction(
                    RegistryProtocol.GlobalIdentityLinkActionRequest request);
    RegistryProtocol.GlobalIdentityPresenceBatchResponse
            submitGlobalIdentityPresenceBatch(
                    RegistryProtocol.GlobalIdentityPresenceBatchRequest request);
    RegistryProtocol.OperatorActionResponse applyOperatorAction(
            RegistryProtocol.OperatorActionRequest request);
    RegistryProtocol.OperatorClaimStatusResponse operatorClaimStatus(
            String deploymentId);
    RegistryProtocol.LeaderboardPage leaderboard(
            String view,
            String throughPeriod,
            Integer limit,
            String cursor);
    RegistryProtocol.LeaderboardDeploymentPage leaderboardDeployments(
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor);
    RegistryProtocol.AnnouncementPage announcements(
            String kind,
            String severity,
            String channel,
            boolean includeExpired,
            Integer limit,
            String cursor);
    URI endpoint(String path);
}
