package com.raxim.myscoutee.profile.service.operator;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.RegistryDemoProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.OperatorClaimSubmissionSnapshot;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorActionResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorAnnouncementPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimMutationResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimOverviewDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorClaimRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardDeploymentPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorLeaderboardPageDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorNetworkDtos.OperatorRedeemClientTokenRequestDto;
import com.raxim.myscoutee.profile.repository.OperatorClaimSubmissionSnapshotRepository;
import com.raxim.myscoutee.profile.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.registry.RegistryHttpClient.RegistryHttpException;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkOperations;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ActionCommand;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ClaimVerification;
import com.raxim.myscoutee.registry.RegistryOperatorNetworkService.ClaimStatus;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardPage;
import com.raxim.myscoutee.registry.RegistryProtocol.LeaderboardRow;
import com.raxim.myscoutee.registry.RegistryProtocolException;

@Service
public class OperatorNetworkService {
    private final OperatorRegistrySettingsRepository settingsRepository;
    private final OperatorClaimSubmissionSnapshotRepository claimSubmissionRepository;
    private final UsersRepository usersRepository;
    private final RegistryProperties realProperties;
    private final RegistryDemoProperties demoProperties;
    private final RegistryOperatorNetworkOperations operations;
    private final OperatorNetworkMapper mapper;
    private final EnumMap<MongoSessionMode, Object> modeLocks =
            new EnumMap<>(MongoSessionMode.class);

    public OperatorNetworkService(
            OperatorRegistrySettingsRepository settingsRepository,
            OperatorClaimSubmissionSnapshotRepository claimSubmissionRepository,
            UsersRepository usersRepository,
            RegistryProperties realProperties,
            RegistryDemoProperties demoProperties,
            RegistryOperatorNetworkOperations operations,
            OperatorNetworkMapper mapper) {
        this.settingsRepository = Objects.requireNonNull(settingsRepository);
        this.claimSubmissionRepository =
                Objects.requireNonNull(claimSubmissionRepository);
        this.usersRepository = Objects.requireNonNull(usersRepository);
        this.realProperties = Objects.requireNonNull(realProperties);
        this.demoProperties = Objects.requireNonNull(demoProperties);
        this.operations = Objects.requireNonNull(operations);
        this.mapper = Objects.requireNonNull(mapper);
        for (MongoSessionMode mode : MongoSessionMode.values()) {
            modeLocks.put(mode, new Object());
        }
    }

    public OperatorActionResultDto apply(
            OperatorActionRequestDto request,
            String actorUserId) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Operator action request is required.");
        }
        if (RegistryProtocol.OPERATOR_ACTION_CLAIM.equals(safeText(request.action()))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Submit structured company claims through /operator/claim.");
        }
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toActionResult(operations.apply(
                        requireRegisteredRuntime(mode),
                        new ActionCommand(
                                request.action(),
                                request.operatorName(),
                                request.operatorAvatarUrl(),
                                request.clientToken(),
                                request.tokenTtlSeconds(),
                                request.tokenId(),
                                request.linkId(),
                                request.idempotencyKey())));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorClaimMutationResultDto submitClaim(
            OperatorClaimRequestDto request,
            String actorUserId,
            String idempotencyKey) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Operator company verification request is required.");
        }
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                RegisteredRuntime registered = requireRegisteredContext(mode);
                RegistryProperties runtime = registered.properties();
                String avatarUrl = operatorAvatar(actorUserId);
                operations.apply(
                        runtime,
                        new ActionCommand(
                                RegistryProtocol.OPERATOR_ACTION_CLAIM,
                                null,
                                avatarUrl,
                                null,
                                null,
                                null,
                                null,
                                safeText(idempotencyKey),
                                new ClaimVerification(
                                        request.legalName(),
                                        request.registrationNumber(),
                                        request.jurisdiction(),
                                        request.registeredAddress(),
                                        request.website(),
                                        request.verificationContactName(),
                                        request.verificationContactRole(),
                                        request.verificationContactEmail(),
                                        request.authorityAttested())));
                ClaimStatus status = operations.claimStatus(runtime);
                requireRegistryVerifiedClaimStatus(status);
                LeaderboardRow leaderboardEntry = requireClaimedLeaderboardRow(
                        runtime,
                        status.groupId());
                OperatorClaimSubmissionSnapshot submission =
                        persistClaimSubmission(
                                request,
                                status,
                                actorUserId,
                                registered);
                return mapper.toClaimMutation(
                        status,
                        safeText(actorUserId),
                        submission,
                        leaderboardEntry,
                        registered.deploymentId());
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorClaimMutationResultDto redeemClientToken(
            OperatorRedeemClientTokenRequestDto request,
            String actorUserId) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Operator client token redemption request is required.");
        }
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                RegisteredRuntime registered = requireRegisteredContext(mode);
                RegistryProperties runtime = registered.properties();
                ClaimStatus previousStatus = operations.claimStatus(runtime);
                requireRegistryVerifiedClaimStatus(previousStatus);
                operations.apply(
                        runtime,
                        new ActionCommand(
                                RegistryProtocol.OPERATOR_ACTION_REDEEM_CLIENT_TOKEN,
                                null,
                                null,
                                request.clientToken(),
                                null,
                                null,
                                null,
                                request.idempotencyKey()));
                ClaimStatus status = operations.claimStatus(runtime);
                requireRegistryVerifiedClaimStatus(status);
                String currentGroupId = safeText(status.groupId());
                String previousGroupId = previousStatus.claimed()
                        ? safeText(previousStatus.groupId())
                        : "";
                ClaimMutationLeaderboardRows leaderboardRows =
                        requireClaimMutationLeaderboardRows(
                                runtime,
                                currentGroupId,
                                previousGroupId);
                List<LeaderboardRow> leaderboardUpserts = new ArrayList<>();
                leaderboardUpserts.add(leaderboardRows.current());
                boolean sameGroup = StringUtils.hasText(previousGroupId)
                        && previousGroupId.equals(currentGroupId);
                boolean previousGroupSurvives = !sameGroup
                        && leaderboardRows.previous() != null;
                if (previousGroupSurvives) {
                    leaderboardUpserts.add(leaderboardRows.previous());
                }
                List<String> removedLeaderboardEntryIds;
                int leaderboardTotalDelta;
                if (sameGroup) {
                    removedLeaderboardEntryIds = List.of();
                    leaderboardTotalDelta = 0;
                } else if (StringUtils.hasText(previousGroupId)) {
                    removedLeaderboardEntryIds = previousGroupSurvives
                            ? List.of()
                            : List.of(previousGroupId);
                    leaderboardTotalDelta = previousGroupSurvives ? 0 : -1;
                } else {
                    removedLeaderboardEntryIds =
                            List.of(registered.deploymentId());
                    leaderboardTotalDelta = -1;
                }
                return mapper.toClaimMutation(
                        status,
                        safeText(actorUserId),
                        loadClaimSubmission(registered, status),
                        leaderboardRows.current(),
                        List.copyOf(leaderboardUpserts),
                        removedLeaderboardEntryIds,
                        leaderboardTotalDelta);
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorLeaderboardPageDto leaderboard(
            String view,
            String throughPeriod,
            Integer limit,
            String cursor) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toLeaderboardPage(operations.leaderboard(
                        requireRegisteredRuntime(mode),
                        StringUtils.hasText(view) ? view.trim() : "claimed",
                        safeText(throughPeriod),
                        limit,
                        safeText(cursor)));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorAnnouncementPageDto announcements(
            String kind,
            String severity,
            String channel,
            Boolean includeExpired,
            Integer limit,
            String cursor) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toAnnouncementPage(operations.announcements(
                        requireRegisteredRuntime(mode),
                        safeText(kind),
                        safeText(severity),
                        safeText(channel),
                        Boolean.TRUE.equals(includeExpired),
                        limit,
                        safeText(cursor)));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorClaimOverviewDto claimStatus(String actorUserId) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                RegisteredRuntime registered = requireRegisteredContext(mode);
                ClaimStatus status = operations.claimStatus(
                        registered.properties());
                return mapper.toClaimOverview(
                        status,
                        safeText(actorUserId),
                        loadClaimSubmission(registered, status));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    public OperatorLeaderboardDeploymentPageDto leaderboardDeployments(
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            try {
                return mapper.toLeaderboardDeploymentPage(
                        operations.leaderboardDeployments(
                                requireRegisteredRuntime(mode),
                                groupId,
                                safeText(throughPeriod),
                                limit,
                                safeText(cursor)));
            } catch (RegistryHttpException exception) {
                throw registryHttpFailure(exception);
            } catch (RegistryProtocolException exception) {
                throw registryProtocolFailure(exception);
            } catch (IllegalArgumentException exception) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        safeMessage(exception),
                        exception);
            } catch (IllegalStateException exception) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        safeMessage(exception),
                        exception);
            }
        }
    }

    private String operatorAvatar(String actorUserId) {
        String userId = safeText(actorUserId);
        if (!StringUtils.hasText(userId)) {
            return "";
        }
        return usersRepository.findByUserId(userId)
                .map(Users::getImages)
                .map(OperatorNetworkService::firstAbsoluteHttpsImage)
                .orElse("");
    }

    private RegistryProperties requireRegisteredRuntime(MongoSessionMode mode) {
        return requireRegisteredContext(mode).properties();
    }

    private RegisteredRuntime requireRegisteredContext(MongoSessionMode mode) {
        OperatorRegistrySettings settings = settingsRepository
                .findById(OperatorRegistrySettings.SINGLETON_ID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Register this deployment before using the operator network."));
        if (!Boolean.TRUE.equals(settings.getEnabled())
                || !"REGISTERED".equals(settings.getLifecycle())
                || settings.getSelection() == null
                || settings.getEnrollment() == null
                || !StringUtils.hasText(settings.getEnrollment().getDeploymentCode())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Register this deployment before using the operator network.");
        }
        OperatorRegistrySettings.RegistrySelection selection = settings.getSelection();
        RegistryProperties runtime = new RegistryProperties();
        runtime.setEnabled(true);
        runtime.setOutboundAllowed(
                mode == MongoSessionMode.DEMO || realProperties.isOutboundAllowed());
        runtime.setOperatorRegistrationConfirmed(false);
        String selectedBaseUrl = safeText(selection.getBaseUrl());
        String selectedScope = safeText(selection.getRegistryScope());
        if (mode == MongoSessionMode.DEMO) {
            if (StringUtils.hasText(demoProperties.getBaseUrl())) {
                String configuredBaseUrl =
                        stripTrailingSlash(demoProperties.getBaseUrl());
                if (!configuredBaseUrl.equals(
                        stripTrailingSlash(selectedBaseUrl))) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Explore registry selection does not match its isolated demo registry.");
                }
                selectedBaseUrl = configuredBaseUrl;
            }
            if (StringUtils.hasText(
                    demoProperties.getRegistryScope())) {
                String configuredScope =
                        demoProperties.getRegistryScope().trim();
                if (!configuredScope.equals(selectedScope)) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Explore registry selection does not match its isolated demo registry scope.");
                }
                selectedScope = configuredScope;
            }
        }
        runtime.setBaseUrl(selectedBaseUrl);
        runtime.setRegistryScope(selectedScope);
        runtime.setExpectedRegistryKeyFingerprint(
                selection.getRegistryPublicKeyFingerprint());
        runtime.setTrustOnFirstUse(false);
        runtime.setConnectTimeout(realProperties.getConnectTimeout());
        runtime.setRequestTimeout(realProperties.getRequestTimeout());
        runtime.setRetryDelay(realProperties.getRetryDelay());
        runtime.setMaxResponseBytes(realProperties.getMaxResponseBytes());
        runtime.setSoftwareVersion(realProperties.getSoftwareVersion());
        runtime.setPackageSigningPublicKeyPath(
                realProperties.getPackageSigningPublicKeyPath());
        if (mode == MongoSessionMode.DEMO) {
            runtime.setPrivateKeyPath(demoProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(demoProperties.getPublicKeyPath());
            runtime.setStateDir(demoProperties.getStateDir());
            runtime.setAllowInsecureHttp(demoProperties.isAllowInsecureHttp());
            runtime.setInsecureHttpAllowedHosts(demoProperties.getInsecureHttpAllowedHosts());
        } else {
            runtime.setPrivateKeyPath(realProperties.getPrivateKeyPath());
            runtime.setPublicKeyPath(realProperties.getPublicKeyPath());
            runtime.setStateDir(realProperties.getStateDir());
            runtime.setAllowInsecureHttp(false);
            runtime.setInsecureHttpAllowedHosts("");
        }
        if (!runtime.isOutboundAllowed()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Outbound registry communication is disabled.");
        }
        return new RegisteredRuntime(
                runtime,
                settings.getEnrollment().getDeploymentCode().trim(),
                selectedScope);
    }

    private String stripTrailingSlash(String value) {
        String normalized = safeText(value);
        return normalized.endsWith("/")
                ? normalized.substring(0, normalized.length() - 1)
                : normalized;
    }

    private LeaderboardRow requireClaimedLeaderboardRow(
            RegistryProperties runtime,
            String groupId) {
        return requireClaimMutationLeaderboardRows(runtime, groupId, null)
                .current();
    }

    private ClaimMutationLeaderboardRows requireClaimMutationLeaderboardRows(
            RegistryProperties runtime,
            String currentGroupId,
            String previousGroupId) {
        String normalizedCurrentGroupId = safeText(currentGroupId);
        String normalizedPreviousGroupId = safeText(previousGroupId);
        if (normalizedCurrentGroupId.isEmpty()) {
            throw new RegistryProtocolException(
                    "Registry claim status has no operator group.");
        }
        if (normalizedCurrentGroupId.equals(normalizedPreviousGroupId)) {
            normalizedPreviousGroupId = "";
        }
        LeaderboardRow current = null;
        LeaderboardRow previous = null;
        String cursor = "";
        for (int pageCount = 1; pageCount <= 1_000; pageCount++) {
            LeaderboardPage page = operations.leaderboard(
                    runtime,
                    "claimed",
                    null,
                    100,
                    cursor);
            for (LeaderboardRow row : page.items()) {
                if (normalizedCurrentGroupId.equals(row.groupId())) {
                    current = row;
                } else if (normalizedPreviousGroupId.equals(row.groupId())) {
                    previous = row;
                }
            }
            cursor = safeText(page.nextCursor());
            if (current != null
                    && (normalizedPreviousGroupId.isEmpty() || previous != null)) {
                return new ClaimMutationLeaderboardRows(current, previous);
            }
            if (cursor.isEmpty()) {
                if (current == null) {
                    throw new RegistryProtocolException(
                            "Registry claim status has no canonical claimed leaderboard row.");
                }
                return new ClaimMutationLeaderboardRows(current, previous);
            }
        }
        throw new RegistryProtocolException(
                "Registry claimed leaderboard pagination limit was exceeded.");
    }

    private static void requireRegistryVerifiedClaimStatus(ClaimStatus status) {
        if (status == null
                || !"AVAILABLE".equals(status.verificationCapability())
                || !StringUtils.hasText(status.verificationStatus())) {
            throw new RegistryProtocolException(
                    "Registry did not return a verified operator claim status.");
        }
    }

    private OperatorClaimSubmissionSnapshot persistClaimSubmission(
            OperatorClaimRequestDto request,
            ClaimStatus status,
            String actorUserId,
            RegisteredRuntime registered) {
        OperatorClaimSubmissionSnapshot submission = claimSubmissionRepository
                .findById(OperatorClaimSubmissionSnapshot.SINGLETON_ID)
                .orElseGet(OperatorClaimSubmissionSnapshot::new);
        submission.setId(OperatorClaimSubmissionSnapshot.SINGLETON_ID);
        submission.setSchemaVersion(
                OperatorClaimSubmissionSnapshot.SCHEMA_VERSION);
        submission.setLegalName(request.legalName());
        submission.setRegistrationNumber(request.registrationNumber());
        submission.setJurisdiction(request.jurisdiction());
        submission.setRegisteredAddress(request.registeredAddress());
        submission.setWebsite(request.website());
        submission.setVerificationContactName(
                request.verificationContactName());
        submission.setVerificationContactRole(
                request.verificationContactRole());
        submission.setVerificationContactEmail(
                request.verificationContactEmail());
        submission.setAuthorityAttested(request.authorityAttested());
        submission.setRegistryScope(registered.registryScope());
        submission.setDeploymentId(registered.deploymentId());
        submission.setOperatorGroupId(status.groupId());
        submission.setSubmittedAt(status.verificationSubmittedAt());
        submission.setSubmittedBy(safeText(actorUserId));
        return claimSubmissionRepository.save(submission);
    }

    private OperatorClaimSubmissionSnapshot loadClaimSubmission(
            RegisteredRuntime registered,
            ClaimStatus status) {
        return claimSubmissionRepository
                .findById(OperatorClaimSubmissionSnapshot.SINGLETON_ID)
                .map(OperatorNetworkService::requireSupportedClaimSubmission)
                .filter(submission -> currentClaimOwnsSubmission(
                        submission,
                        registered,
                        status))
                .orElse(null);
    }

    private static boolean currentClaimOwnsSubmission(
            OperatorClaimSubmissionSnapshot submission,
            RegisteredRuntime registered,
            ClaimStatus status) {
        return status != null
                && status.claimed()
                && "AVAILABLE".equals(status.verificationCapability())
                && StringUtils.hasText(status.groupId())
                && StringUtils.hasText(status.verificationSubmittedAt())
                && Objects.equals(
                        submission.getRegistryScope(),
                        registered.registryScope())
                && Objects.equals(
                        submission.getDeploymentId(),
                        registered.deploymentId())
                && Objects.equals(
                        submission.getOperatorGroupId(),
                        status.groupId())
                && Objects.equals(
                        submission.getSubmittedAt(),
                        status.verificationSubmittedAt());
    }

    private static OperatorClaimSubmissionSnapshot requireSupportedClaimSubmission(
            OperatorClaimSubmissionSnapshot submission) {
        if (!OperatorClaimSubmissionSnapshot.SINGLETON_ID.equals(
                        submission.getId())
                || submission.getSchemaVersion() == null
                || submission.getSchemaVersion()
                        != OperatorClaimSubmissionSnapshot.SCHEMA_VERSION) {
            throw new IllegalStateException(
                    "Operator claim submission snapshot is unsupported.");
        }
        return submission;
    }

    private ResponseStatusException registryHttpFailure(RegistryHttpException exception) {
        HttpStatus status = switch (exception.getStatusCode()) {
            case 400 -> HttpStatus.BAD_REQUEST;
            case 404 -> HttpStatus.NOT_FOUND;
            case 409 -> HttpStatus.CONFLICT;
            case 410 -> HttpStatus.GONE;
            case 429 -> HttpStatus.TOO_MANY_REQUESTS;
            case 503 -> HttpStatus.SERVICE_UNAVAILABLE;
            default -> HttpStatus.BAD_GATEWAY;
        };
        return new ResponseStatusException(status, safeMessage(exception), exception);
    }

    private ResponseStatusException registryProtocolFailure(
            RegistryProtocolException exception) {
        return new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                safeMessage(exception),
                exception);
    }

    private static String firstAbsoluteHttpsImage(List<String> images) {
        if (images == null) {
            return "";
        }
        return images.stream()
                .map(OperatorNetworkService::safeText)
                .filter(image -> image.startsWith("https://"))
                .findFirst()
                .orElse("");
    }

    private static String safeMessage(Exception exception) {
        String message = exception == null ? "" : safeText(exception.getMessage());
        return StringUtils.hasText(message) ? message : "Registry operation failed.";
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record RegisteredRuntime(
            RegistryProperties properties,
            String deploymentId,
            String registryScope) {
    }

    private record ClaimMutationLeaderboardRows(
            LeaderboardRow current,
            LeaderboardRow previous) {
    }
}
