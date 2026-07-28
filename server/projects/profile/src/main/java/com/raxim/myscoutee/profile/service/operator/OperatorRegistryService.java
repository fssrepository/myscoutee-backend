package com.raxim.myscoutee.profile.service.operator;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.EnumMap;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.RegistryDemoProperties;
import com.raxim.myscoutee.common.config.properties.RegistryProperties;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.CandidateDefaultsDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.NodeIdentityDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.OperatorRegistryMutationResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.OperatorRegistryStatusDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryOptionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryRegisterRequestDto;
import com.raxim.myscoutee.profile.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.registry.RegistryOperatorOperations;
import com.raxim.myscoutee.registry.RegistryPreflightService.RegistryInspection;
import com.raxim.myscoutee.registry.RegistryProtocol;

@Service
public class OperatorRegistryService {
    private static final Duration INSPECTION_TTL = Duration.ofMinutes(30);

    private final OperatorRegistrySettingsRepository repository;
    private final RegistryProperties realProperties;
    private final RegistryDemoProperties demoProperties;
    private final RegistryOperatorOperations operations;
    private final OperatorRegistryEndpointService endpointService;
    private final OperatorRegistryMapper mapper;
    private final Clock clock;
    private final SecureRandom secureRandom;
    private final EnumMap<MongoSessionMode, Object> modeLocks = new EnumMap<>(MongoSessionMode.class);

    @Autowired
    public OperatorRegistryService(
            OperatorRegistrySettingsRepository repository,
            RegistryProperties realProperties,
            RegistryDemoProperties demoProperties,
            RegistryOperatorOperations operations,
            OperatorRegistryEndpointService endpointService,
            OperatorRegistryMapper mapper) {
        this(
                repository,
                realProperties,
                demoProperties,
                operations,
                endpointService,
                mapper,
                Clock.systemUTC(),
                new SecureRandom());
    }

    OperatorRegistryService(
            OperatorRegistrySettingsRepository repository,
            RegistryProperties realProperties,
            RegistryDemoProperties demoProperties,
            RegistryOperatorOperations operations,
            OperatorRegistryEndpointService endpointService,
            OperatorRegistryMapper mapper,
            Clock clock,
            SecureRandom secureRandom) {
        this.repository = Objects.requireNonNull(repository);
        this.realProperties = Objects.requireNonNull(realProperties);
        this.demoProperties = Objects.requireNonNull(demoProperties);
        this.operations = Objects.requireNonNull(operations);
        this.endpointService = Objects.requireNonNull(endpointService);
        this.mapper = Objects.requireNonNull(mapper);
        this.clock = Objects.requireNonNull(clock);
        this.secureRandom = Objects.requireNonNull(secureRandom);
        for (MongoSessionMode mode : MongoSessionMode.values()) {
            modeLocks.put(mode, new Object());
        }
    }

    public OperatorRegistryStatusDto status() {
        MongoSessionMode mode = currentMode();
        synchronized (modeLocks.get(mode)) {
            OperatorRegistrySettings settings = load().orElse(null);
            return toStatus(settings, mode);
        }
    }

    public RegistryInspectionDto inspect(RegistryInspectRequestDto request, String actorUserId) {
        MongoSessionMode mode = currentMode();
        synchronized (modeLocks.get(mode)) {
            String baseUrl = resolveCandidateBaseUrl(request == null ? null : request.baseUrl(), mode);
            String expectedScope = resolveExpectedScope(
                    request == null ? null : request.expectedScope());
            RegistryInspection inspection = inspectLive(mode, baseUrl, expectedScope, "");

            Instant now = clock.instant();
            String token = randomInspectionToken();
            OperatorRegistrySettings settings = load().orElseGet(OperatorRegistrySettings::new);
            initializeAudit(settings, now);
            OperatorRegistrySettings.DraftInspection draft = draft(
                    baseUrl,
                    inspection,
                    tokenHash(token),
                    now,
                    actorUserId);
            settings.setDraftInspection(draft);
            if (settings.getSelection() == null) {
                settings.setLifecycle("INSPECTED");
            }
            touch(settings, now, actorUserId);
            save(settings);
            return mapper.toInspection(draft, token);
        }
    }

    public OperatorRegistryStatusDto confirm(String inspectionToken, String actorUserId) {
        MongoSessionMode mode = currentMode();
        synchronized (modeLocks.get(mode)) {
            OperatorRegistrySettings settings = requireSettings();
            OperatorRegistrySettings.DraftInspection draft =
                    requireValidDraft(settings, inspectionToken);
            RegistryInspection fresh = inspectLive(
                    mode,
                    draft.getBaseUrl(),
                    draft.getRegistryScope(),
                    draft.getRegistryPublicKeyFingerprint());
            requireSameIdentity(draft, fresh);
            requireCompatibleSelection(settings.getSelection(), draft);

            Instant now = clock.instant();
            settings.setSelection(selection(draft, now, actorUserId));
            settings.setDraftInspection(null);
            settings.setRegistrationRequest(null);
            settings.setEnabled(true);
            settings.setLifecycle("CONFIGURED");
            settings.setLastError(null);
            touch(settings, now, actorUserId);
            save(settings);
            return toStatus(settings, mode);
        }
    }

    public OperatorRegistryMutationResultDto register(
            RegistryRegisterRequestDto request,
            String actorUserId) {
        MongoSessionMode mode = currentMode();
        synchronized (modeLocks.get(mode)) {
            RegistrationTarget target = requireRegistrationTarget(request, mode);
            RegistryInspection fresh = inspectLive(
                    mode,
                    target.baseUrl(),
                    target.registryScope(),
                    "");

            Instant now = clock.instant();
            OperatorRegistrySettings settings = load().orElseGet(OperatorRegistrySettings::new);
            initializeAudit(settings, now);
            OperatorRegistrySettings.DraftInspection inspectedTarget = draft(
                    target.baseUrl(),
                    fresh,
                    "",
                    now,
                    actorUserId);
            requireCompatibleSelection(settings.getSelection(), inspectedTarget);
            OperatorRegistrySettings.RegistrySelection selection =
                    selection(inspectedTarget, now, actorUserId);
            settings.setSelection(selection);
            settings.setDraftInspection(null);
            settings.setRegistrationRequest(registrationRequest(selection, now, actorUserId));
            settings.setEnabled(true);
            settings.setLifecycle("REGISTERING");
            settings.setLastError(null);
            touch(settings, now, actorUserId);
            save(settings);

            RegistryOperatorOperations.EnrollmentOutcome outcome =
                    synchronizeLive(settings, mode, actorUserId);
            boolean created = outcome != null
                    && !outcome.registrationDuplicate()
                    && "REGISTERED".equals(settings.getLifecycle());
            return mapper.toRegistrationMutation(
                    toStatus(settings, mode),
                    outcome != null && "REGISTERED".equals(settings.getLifecycle())
                            ? outcome.deploymentCode()
                            : null,
                    created);
        }
    }

    public OperatorRegistryStatusDto retry(String actorUserId) {
        MongoSessionMode mode = currentMode();
        synchronized (modeLocks.get(mode)) {
            OperatorRegistrySettings settings = requireSettings();
            if (!Boolean.TRUE.equals(settings.getEnabled())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Registry connection is disabled; inspect and confirm it before retrying.");
            }
            if (settings.getSelection() == null) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "No confirmed registry selection is available.");
            }
            if ("REGISTERED".equals(settings.getLifecycle())) {
                return toStatus(settings, mode);
            }
            requirePendingRegistrationRequest(settings);
            synchronizeLive(settings, mode, actorUserId);
            return toStatus(settings, mode);
        }
    }

    public OperatorRegistryMutationResultDto disconnect(String actorUserId) {
        MongoSessionMode mode = currentMode();
        synchronized (modeLocks.get(mode)) {
            OperatorRegistrySettings settings = load().orElseGet(OperatorRegistrySettings::new);
            String removedLeaderboardEntryId =
                    Boolean.TRUE.equals(settings.getEnabled())
                            && settings.getEnrollment() != null
                            ? safeText(settings.getEnrollment().getDeploymentCode())
                            : "";
            Instant now = clock.instant();
            initializeAudit(settings, now);
            settings.setEnabled(false);
            settings.setLifecycle(settings.getSelection() == null ? "UNCONFIGURED" : "DISABLED");
            settings.setDraftInspection(null);
            settings.setRegistrationRequest(null);
            OperatorRegistrySettings.Audit audit = settings.getAudit();
            audit.setDisabledAt(now.toString());
            audit.setDisabledBy(safeActor(actorUserId));
            touch(settings, now, actorUserId);
            save(settings);
            return mapper.toDisconnectMutation(
                    toStatus(settings, mode),
                    removedLeaderboardEntryId);
        }
    }

    private RegistryOperatorOperations.EnrollmentOutcome synchronizeLive(
            OperatorRegistrySettings settings,
            MongoSessionMode mode,
            String actorUserId) {
        Instant now = clock.instant();
        RegistryProperties runtime = runtimeProperties(
                mode,
                settings.getSelection().getBaseUrl(),
                settings.getSelection().getRegistryScope(),
                settings.getSelection().getRegistryPublicKeyFingerprint(),
                true);
        try {
            OperatorRegistrySettings.Audit audit = settings.getAudit();
            audit.setLastAttemptAt(now.toString());
            settings.setLifecycle("REGISTERING");
            settings.setLastError(null);
            touch(settings, now, actorUserId);
            save(settings);

            RegistryOperatorOperations.NodeStatus observed = operations.inspectNodeIdentity(runtime);
            if ("INCOMPLETE".equals(observed.state())) {
                fail(settings, "NODE_IDENTITY_INCOMPLETE",
                        "Deployment identity is incomplete; restore the matching key files.", false, actorUserId);
                return null;
            }
            if ("MISSING".equals(observed.state())) {
                if (settings.getNodeIdentity() != null || settings.getEnrollment() != null) {
                    fail(settings, "NODE_IDENTITY_MISSING",
                            "Deployment identity is missing; restore the matching key files.", false, actorUserId);
                    return null;
                }
                var initialized = operations.initializeNodeIdentity(runtime);
                OperatorRegistrySettings.NodeIdentity node = new OperatorRegistrySettings.NodeIdentity();
                node.setState("READY");
                node.setPublicKeyFingerprint(initialized.publicKeyFingerprint());
                node.setInitializedAt(clock.instant().toString());
                settings.setNodeIdentity(node);
                touch(settings, clock.instant(), actorUserId);
                save(settings);
            } else {
                requireMatchingPersistedNode(settings, observed.publicKeyFingerprint(), actorUserId);
                if ("ERROR".equals(settings.getLifecycle())) {
                    return null;
                }
                if (settings.getNodeIdentity() == null) {
                    OperatorRegistrySettings.NodeIdentity node = new OperatorRegistrySettings.NodeIdentity();
                    node.setState("READY");
                    node.setPublicKeyFingerprint(observed.publicKeyFingerprint());
                    node.setInitializedAt(clock.instant().toString());
                    settings.setNodeIdentity(node);
                    save(settings);
                }
            }

            if (settings.getEnrollment() != null
                    && !Files.exists(runtime.statePath(), LinkOption.NOFOLLOW_LINKS)) {
                fail(settings, "LOCAL_STATE_MISSING",
                        "Signed registry state is missing; restore the matching state and receipt files.",
                        false, actorUserId);
                return null;
            }

            RegistryOperatorOperations.EnrollmentOutcome outcome = operations.synchronize(runtime);
            OperatorRegistrySettings.EnrollmentSummary enrollment =
                    new OperatorRegistrySettings.EnrollmentSummary();
            enrollment.setDeploymentCode(outcome.deploymentCode());
            enrollment.setInstallationTestBatchId(outcome.installationTestBatchId());
            enrollment.setInstallationTestAcceptedAt(outcome.installationTestAcceptedAt());
            enrollment.setInstallationTestLedgerIndex(outcome.installationTestLedgerIndex());
            enrollment.setCompletedAt(clock.instant().toString());
            settings.setEnrollment(enrollment);
            settings.setLifecycle("REGISTERED");
            settings.setEnabled(true);
            settings.setLastError(null);
            settings.getAudit().setLastSuccessAt(clock.instant().toString());
            touch(settings, clock.instant(), actorUserId);
            save(settings);
            return outcome;
        } catch (ResponseStatusException exception) {
            if (exception.getStatusCode().value() == HttpStatus.CONFLICT.value()) {
                throw exception;
            }
            fail(settings, failureCode(exception), failureMessage(exception),
                    failureRetryable(exception), actorUserId);
            return null;
        } catch (RuntimeException exception) {
            fail(settings, failureCode(exception), failureMessage(exception),
                    failureRetryable(exception), actorUserId);
            return null;
        }
    }

    private void requireMatchingPersistedNode(
            OperatorRegistrySettings settings,
            String observedFingerprint,
            String actorUserId) {
        String persisted = settings.getNodeIdentity() == null
                ? ""
                : safeText(settings.getNodeIdentity().getPublicKeyFingerprint());
        if (StringUtils.hasText(persisted) && !RegistryProtocol.hashEquals(persisted, observedFingerprint)) {
            fail(settings, "NODE_IDENTITY_CHANGED",
                    "Deployment identity differs from the persisted operator record.", false, actorUserId);
        }
    }

    private OperatorRegistryStatusDto toStatus(
            OperatorRegistrySettings settings,
            MongoSessionMode mode) {
        List<RegistryOptionDto> options =
                endpointService.options(settings == null ? null : settings.getSelection());
        CandidateDefaultsDto candidateDefaults = options.isEmpty()
                ? new CandidateDefaultsDto(null, null)
                : new CandidateDefaultsDto(
                        options.getFirst().baseUrl(),
                        options.getFirst().registryScope());
        NodeIdentityDto observed = null;
        RegistryProperties runtime = runtimeProperties(
                mode,
                settings != null && settings.getSelection() != null
                        ? settings.getSelection().getBaseUrl()
                        : "",
                settings != null && settings.getSelection() != null
                        ? settings.getSelection().getRegistryScope()
                        : "",
                settings != null && settings.getSelection() != null
                        ? settings.getSelection().getRegistryPublicKeyFingerprint()
                        : "",
                settings != null && settings.getSelection() != null);
        try {
            RegistryOperatorOperations.NodeStatus node = operations.inspectNodeIdentity(runtime);
            String initializedAt = settings != null && settings.getNodeIdentity() != null
                    ? settings.getNodeIdentity().getInitializedAt()
                    : null;
            observed = new NodeIdentityDto(node.state(), initializedAt);
        } catch (RuntimeException exception) {
            observed = new NodeIdentityDto("INCOMPLETE",
                    settings != null && settings.getNodeIdentity() != null
                            ? settings.getNodeIdentity().getInitializedAt()
                            : null);
        }
        return mapper.toStatus(
                settings,
                mode.name(),
                options,
                candidateDefaults,
                observed);
    }

    private RegistryInspection inspectLive(
            MongoSessionMode mode,
            String baseUrl,
            String expectedScope,
            String expectedFingerprint) {
        try {
            return operations.inspect(runtimeProperties(
                    mode,
                    baseUrl,
                    expectedScope,
                    expectedFingerprint,
                    false));
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Registry identity could not be verified.", exception);
        }
    }

    private RegistryProperties runtimeProperties(
            MongoSessionMode mode,
            String baseUrl,
            String scope,
            String fingerprint,
            boolean operatorConfirmed) {
        RegistryProperties runtime = new RegistryProperties();
        // operatorConfirmed is true only for an explicit register/retry action.
        // A persisted selection alone is configuration, never enrollment consent.
        runtime.setEnabled(true);
        runtime.setOperatorRegistrationConfirmed(operatorConfirmed);
        // Production egress remains subject to the host policy kill switch.
        // The isolated local DEMO topology is explicitly enabled by its own
        // local-only configuration below.
        runtime.setOutboundAllowed(
                mode == MongoSessionMode.DEMO || realProperties.isOutboundAllowed());
        runtime.setBaseUrl(safeText(baseUrl));
        runtime.setRegistryScope(safeText(scope));
        runtime.setConnectTimeout(realProperties.getConnectTimeout());
        runtime.setRequestTimeout(realProperties.getRequestTimeout());
        runtime.setRetryDelay(realProperties.getRetryDelay());
        runtime.setMaxResponseBytes(realProperties.getMaxResponseBytes());
        runtime.setSoftwareVersion(realProperties.getSoftwareVersion());
        runtime.setExpectedRegistryKeyFingerprint(safeText(fingerprint));
        runtime.setTrustOnFirstUse(false);
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
        return runtime;
    }

    private OperatorRegistrySettings.DraftInspection draft(
            String baseUrl,
            RegistryInspection inspection,
            String tokenHash,
            Instant now,
            String actorUserId) {
        OperatorRegistrySettings.DraftInspection draft =
                new OperatorRegistrySettings.DraftInspection();
        draft.setBaseUrl(baseUrl);
        draft.setProtocolVersion(inspection.protocolVersion());
        draft.setRegistryScope(inspection.registryScope());
        draft.setRegistryKeyId(inspection.registryKeyId());
        draft.setRegistryPublicKeyFingerprint(inspection.registryPublicKeyFingerprint());
        draft.setIdentityEndpoint(inspection.registryEndpoint());
        draft.setTokenHash(tokenHash);
        draft.setInspectedAt(now.toString());
        draft.setExpiresAt(now.plus(INSPECTION_TTL).toString());
        draft.setInspectedBy(safeActor(actorUserId));
        return draft;
    }

    private OperatorRegistrySettings.RegistrySelection selection(
            OperatorRegistrySettings.DraftInspection draft,
            Instant now,
            String actorUserId) {
        OperatorRegistrySettings.RegistrySelection selection =
                new OperatorRegistrySettings.RegistrySelection();
        selection.setBaseUrl(draft.getBaseUrl());
        selection.setProtocolVersion(draft.getProtocolVersion());
        selection.setRegistryScope(draft.getRegistryScope());
        selection.setRegistryKeyId(draft.getRegistryKeyId());
        selection.setRegistryPublicKeyFingerprint(draft.getRegistryPublicKeyFingerprint());
        selection.setIdentityEndpoint(draft.getIdentityEndpoint());
        selection.setConfirmedAt(now.toString());
        selection.setConfirmedBy(safeActor(actorUserId));
        return selection;
    }

    private OperatorRegistrySettings.RegistrationRequest registrationRequest(
            OperatorRegistrySettings.RegistrySelection selection,
            Instant now,
            String actorUserId) {
        OperatorRegistrySettings.RegistrationRequest request =
                new OperatorRegistrySettings.RegistrationRequest();
        request.setBaseUrl(selection.getBaseUrl());
        request.setRegistryScope(selection.getRegistryScope());
        request.setRegistryKeyId(selection.getRegistryKeyId());
        request.setRegistryPublicKeyFingerprint(selection.getRegistryPublicKeyFingerprint());
        request.setRequestedAt(now.toString());
        request.setRequestedBy(safeActor(actorUserId));
        return request;
    }

    private OperatorRegistrySettings.DraftInspection requireValidDraft(
            OperatorRegistrySettings settings,
            String rawToken) {
        OperatorRegistrySettings.DraftInspection draft = settings.getDraftInspection();
        if (draft == null || !StringUtils.hasText(rawToken)
                || !MessageDigest.isEqual(
                        safeText(draft.getTokenHash()).getBytes(StandardCharsets.US_ASCII),
                        tokenHash(rawToken.trim()).getBytes(StandardCharsets.US_ASCII))) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Registry inspection is missing, stale, or already consumed.");
        }
        Instant expiresAt;
        try {
            expiresAt = Instant.parse(draft.getExpiresAt());
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Registry inspection is invalid.");
        }
        if (!expiresAt.isAfter(clock.instant())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Registry inspection has expired.");
        }
        return draft;
    }

    private void requireSameIdentity(
            OperatorRegistrySettings.DraftInspection draft,
            RegistryInspection fresh) {
        if (!Objects.equals(draft.getProtocolVersion(), fresh.protocolVersion())
                || !Objects.equals(draft.getRegistryScope(), fresh.registryScope())
                || !Objects.equals(draft.getRegistryKeyId(), fresh.registryKeyId())
                || !Objects.equals(
                        draft.getRegistryPublicKeyFingerprint(),
                        fresh.registryPublicKeyFingerprint())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Registry identity changed after inspection; inspect it again.");
        }
    }

    private void requireCompatibleSelection(
            OperatorRegistrySettings.RegistrySelection selected,
            OperatorRegistrySettings.DraftInspection draft) {
        if (selected == null) {
            return;
        }
        if (!Objects.equals(selected.getRegistryScope(), draft.getRegistryScope())
                || !Objects.equals(selected.getRegistryKeyId(), draft.getRegistryKeyId())
                || !Objects.equals(
                        selected.getRegistryPublicKeyFingerprint(),
                        draft.getRegistryPublicKeyFingerprint())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "EXPLICIT_UNREGISTER_REQUIRED: This deployment is already bound to a "
                            + "different signed registry. Central unregister is not available yet.");
        }
    }

    private RegistrationTarget requireRegistrationTarget(
            RegistryRegisterRequestDto request,
            MongoSessionMode mode) {
        if (request == null
                || !StringUtils.hasText(request.registryBaseUrl())
                || !StringUtils.hasText(request.expectedRegistryScope())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Selected registry URL and scope are required.");
        }
        String requestedBaseUrl = resolveCandidateBaseUrl(request.registryBaseUrl(), mode);
        String requestedScope = resolveExpectedScope(request.expectedRegistryScope());
        return new RegistrationTarget(requestedBaseUrl, requestedScope);
    }

    private void requirePendingRegistrationRequest(OperatorRegistrySettings settings) {
        OperatorRegistrySettings.RegistrationRequest request = settings.getRegistrationRequest();
        OperatorRegistrySettings.RegistrySelection selection = settings.getSelection();
        if (request == null
                || selection == null
                || (!"REGISTERING".equals(settings.getLifecycle())
                        && !"ERROR".equals(settings.getLifecycle()))
                || !Objects.equals(request.getBaseUrl(), selection.getBaseUrl())
                || !Objects.equals(request.getRegistryScope(), selection.getRegistryScope())
                || !Objects.equals(request.getRegistryKeyId(), selection.getRegistryKeyId())
                || !Objects.equals(
                        request.getRegistryPublicKeyFingerprint(),
                        selection.getRegistryPublicKeyFingerprint())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No explicitly requested pending registration is available to retry.");
        }
    }

    private void fail(
            OperatorRegistrySettings settings,
            String code,
            String message,
            boolean retryable,
            String actorUserId) {
        Instant now = clock.instant();
        OperatorRegistrySettings.Failure failure = new OperatorRegistrySettings.Failure();
        failure.setCode(code);
        failure.setMessage(message);
        failure.setAt(now.toString());
        failure.setRetryable(retryable);
        settings.setLastError(failure);
        settings.setLifecycle("ERROR");
        touch(settings, now, actorUserId);
        save(settings);
    }

    private String failureCode(RuntimeException exception) {
        String message = safeText(exception.getMessage()).toLowerCase();
        if (message.contains("fingerprint") || message.contains("registry public")) {
            return "REGISTRY_IDENTITY_CHANGED";
        }
        if (message.contains("key") || message.contains("identity")) {
            return "NODE_IDENTITY_INVALID";
        }
        if (message.contains("state") || message.contains("receipt")) {
            return "LOCAL_STATE_INVALID";
        }
        return "REGISTRY_UNAVAILABLE";
    }

    private String failureMessage(RuntimeException exception) {
        return switch (failureCode(exception)) {
            case "NODE_IDENTITY_INVALID" ->
                "Deployment identity could not be validated; restore the matching key files.";
            case "LOCAL_STATE_INVALID" ->
                "Signed registry state or receipts could not be validated.";
            case "REGISTRY_IDENTITY_CHANGED" ->
                "Registry identity no longer matches the confirmed fingerprint.";
            default -> "Registry is unavailable; the deployment remains local and can be retried.";
        };
    }

    private boolean failureRetryable(RuntimeException exception) {
        return "REGISTRY_UNAVAILABLE".equals(failureCode(exception));
    }

    private java.util.Optional<OperatorRegistrySettings> load() {
        return repository.findById(OperatorRegistrySettings.SINGLETON_ID);
    }

    private OperatorRegistrySettings requireSettings() {
        return load().orElseThrow(() -> new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Inspect a registry before configuring or retrying."));
    }

    private OperatorRegistrySettings save(OperatorRegistrySettings settings) {
        try {
            return repository.save(settings);
        } catch (OptimisticLockingFailureException | DuplicateKeyException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Registry settings changed concurrently; reload the operator status and retry.",
                    exception);
        }
    }

    private void initializeAudit(OperatorRegistrySettings settings, Instant now) {
        if (settings.getAudit() == null) {
            settings.setAudit(new OperatorRegistrySettings.Audit());
        }
        if (!StringUtils.hasText(settings.getAudit().getCreatedAt())) {
            settings.getAudit().setCreatedAt(now.toString());
        }
    }

    private void touch(
            OperatorRegistrySettings settings,
            Instant now,
            String actorUserId) {
        initializeAudit(settings, now);
        settings.setSchemaVersion(OperatorRegistrySettings.SCHEMA_VERSION);
        settings.getAudit().setUpdatedAt(now.toString());
        settings.getAudit().setUpdatedBy(safeActor(actorUserId));
    }

    private String resolveCandidateBaseUrl(String requested, MongoSessionMode mode) {
        String candidate = StringUtils.hasText(requested) ? requested.trim() : "";
        if (!StringUtils.hasText(candidate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registry base URL is required.");
        }
        String normalized = normalizeBaseUrl(candidate);
        if (mode == MongoSessionMode.REAL
                && !"https".equalsIgnoreCase(URI.create(normalized).getScheme())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Production registry base URL must use HTTPS.");
        }
        return normalized;
    }

    private String resolveExpectedScope(String requested) {
        String scope = StringUtils.hasText(requested) ? requested.trim() : "";
        if (!StringUtils.hasText(scope)) {
            return "";
        }
        try {
            return RegistryProtocol.requireRegistryScope(scope);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registry scope is invalid.");
        }
    }

    private String normalizeBaseUrl(String value) {
        try {
            URI uri = URI.create(safeText(value));
            String scheme = safeText(uri.getScheme()).toLowerCase();
            if ((!"https".equals(scheme) && !"http".equals(scheme))
                    || uri.getHost() == null
                    || uri.getUserInfo() != null
                    || uri.getQuery() != null
                    || uri.getFragment() != null
                    || (StringUtils.hasText(uri.getPath()) && !"/".equals(uri.getPath()))) {
                throw new IllegalArgumentException("unsupported registry URL shape");
            }
            String normalized = uri.toString();
            return normalized.endsWith("/")
                    ? normalized.substring(0, normalized.length() - 1)
                    : normalized;
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registry base URL is invalid.");
        }
    }

    private MongoSessionMode currentMode() {
        return MongoSessionModeContext.currentMode();
    }

    private String randomInspectionToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return "inspection_" + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String tokenHash(String token) {
        return RegistryProtocol.sha256(safeText(token).getBytes(StandardCharsets.UTF_8));
    }

    private String safeActor(String value) {
        String actor = safeText(value);
        return StringUtils.hasText(actor) ? actor : "operator";
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record RegistrationTarget(
            String baseUrl,
            String registryScope) {
    }
}
