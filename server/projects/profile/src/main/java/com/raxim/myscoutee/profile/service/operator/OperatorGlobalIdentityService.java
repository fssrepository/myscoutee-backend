package com.raxim.myscoutee.profile.service.operator;

import java.security.SecureRandom;
import java.text.Normalizer;
import java.time.Clock;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityLinkState;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityLinkState.PendingOperation;
import com.raxim.myscoutee.profile.data.dto.auth.GlobalIdentityDtos.GlobalIdentityConsentRequestDto;
import com.raxim.myscoutee.profile.data.dto.auth.GlobalIdentityDtos.GlobalIdentityStatusDto;
import com.raxim.myscoutee.profile.data.dto.auth.GlobalIdentityDtos.GlobalIdentityUnlinkRequestDto;
import com.raxim.myscoutee.profile.repository.GlobalIdentityLinkStateRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.RegisteredRuntime;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.Resolution;
import com.raxim.myscoutee.registry.GlobalIdentityVoprfClient;
import com.raxim.myscoutee.registry.GlobalIdentityVoprfClient.BlindSession;
import com.raxim.myscoutee.registry.RegistryCrypto;
import com.raxim.myscoutee.registry.RegistryHttpClient;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityEvaluationRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityEvaluationResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityLink;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityLinkActionRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityLinkRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityMutationResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityVoprfKey;

import tools.jackson.databind.ObjectMapper;

/**
 * Member-facing privacy rail for optional cross-deployment identity linking.
 *
 * <p>Only an RFC 9497 VOPRF-derived commitment leaves this deployment. The
 * verified email is held in memory only for blinding; local user ids remain in
 * Mongo only, and neither value is written to registry payloads, logs, or
 * errors. A verified-email change is intentionally handled by explicit
 * unlink followed by a new consent/link; the old and new raw addresses are
 * never retained here for comparison.</p>
 */
@Service
public class OperatorGlobalIdentityService {
    private static final String ACTION_LINK = "LINK";
    private static final String INPUT_DOMAIN =
            "myscoutee-global-identity-email-v1";
    private static final String CONSENT_EVIDENCE_DOMAIN =
            "myscoutee-global-identity-consent-evidence-v1";
    private static final String REASON_DOMAIN =
            "myscoutee-global-identity-reason-v1";

    private final OperatorRevenueRegistryRuntimeResolver runtimeResolver;
    private final GlobalIdentityLinkStateRepository linkRepository;
    private final UsersRepository usersRepository;
    private final ObjectMapper objectMapper;
    private final GlobalIdentityVoprfClient voprfClient;
    private final Clock clock;
    private final SecureRandom secureRandom;
    private final AtomicBoolean pendingSynchronizationRunning =
            new AtomicBoolean();

    @Autowired
    public OperatorGlobalIdentityService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            GlobalIdentityLinkStateRepository linkRepository,
            UsersRepository usersRepository,
            ObjectMapper objectMapper) {
        this(
                runtimeResolver,
                linkRepository,
                usersRepository,
                objectMapper,
                new GlobalIdentityVoprfClient(),
                Clock.systemUTC(),
                new SecureRandom());
    }

    OperatorGlobalIdentityService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            GlobalIdentityLinkStateRepository linkRepository,
            UsersRepository usersRepository,
            ObjectMapper objectMapper,
            GlobalIdentityVoprfClient voprfClient,
            Clock clock,
            SecureRandom secureRandom) {
        this.runtimeResolver = Objects.requireNonNull(runtimeResolver);
        this.linkRepository = Objects.requireNonNull(linkRepository);
        this.usersRepository = Objects.requireNonNull(usersRepository);
        this.objectMapper = Objects.requireNonNull(objectMapper);
        this.voprfClient = Objects.requireNonNull(voprfClient);
        this.clock = Objects.requireNonNull(clock);
        this.secureRandom = Objects.requireNonNull(secureRandom);
    }

    @Scheduled(
            fixedDelayString =
                    "${operator.global-identity.link-retry-delay-ms:300000}",
            initialDelayString =
                    "${operator.global-identity.link-retry-initial-delay-ms:90000}")
    public void synchronizePendingScheduled() {
        if (!pendingSynchronizationRunning.compareAndSet(false, true)) {
            return;
        }
        MongoSessionMode previous = MongoSessionModeContext.currentMode();
        try {
            for (MongoSessionMode mode : List.of(
                    MongoSessionMode.REAL,
                    MongoSessionMode.DEMO)) {
                MongoSessionModeContext.set(mode);
                synchronizePending(mode);
            }
        } finally {
            MongoSessionModeContext.set(previous);
            pendingSynchronizationRunning.set(false);
        }
    }

    public void preparePurgeUnlink(String localUserId) {
        if (!StringUtils.hasText(localUserId)) {
            return;
        }
        GlobalIdentityLinkState state = linkRepository
                .findFirstByLocalUserIdOrderByUpdatedAtDesc(
                        localUserId.trim())
                .orElse(null);
        if (state == null) {
            return;
        }
        if (!Boolean.TRUE.equals(state.getPurgeRequested())) {
            String now = clock.instant().toString();
            state.setPurgeRequested(true);
            state.setPurgeRequestedAt(now);
            state.setPurgeTombstoneId(RegistryProtocol.randomToken(
                    "gitomb_",
                    secureRandom));
            state.setUpdatedAt(now);
            state = saveConcurrent(state);
        }
        Resolution resolution = runtimeResolver.resolveGlobalIdentity(
                MongoSessionModeContext.currentMode());
        if (!resolution.isReady()) {
            return;
        }
        try {
            processPurgeState(resolution.runtime(), state);
        } catch (RuntimeException ignored) {
            /*
             * Purge must not lose its durable local unlink intent merely
             * because the registry is unavailable. The scheduled worker
             * resumes the exact idempotent operation.
             */
        }
    }

    private void synchronizePending(MongoSessionMode mode) {
        Resolution resolution = runtimeResolver.resolveGlobalIdentity(mode);
        if (!resolution.isReady()) {
            return;
        }
        RegisteredRuntime runtime = resolution.runtime();
        LinkedHashMap<String, GlobalIdentityLinkState> work =
                new LinkedHashMap<>();
        for (GlobalIdentityLinkState state :
                linkRepository
                        .findByPendingOperationIsNotNullOrderByUpdatedAtAsc()) {
            work.put(state.getId(), state);
        }
        for (GlobalIdentityLinkState state :
                linkRepository
                        .findByPurgeRequestedTrueOrderByUpdatedAtAsc()) {
            work.put(state.getId(), state);
        }
        for (GlobalIdentityLinkState state : work.values()) {
            try {
                validateStoredLink(
                        runtime,
                        state,
                        state.getLocalUserId());
                if (Boolean.TRUE.equals(state.getPurgeRequested())) {
                    processPurgeState(runtime, state);
                } else if (state.getPendingOperation() != null) {
                    completePending(runtime, state, null);
                }
            } catch (RuntimeException ignored) {
                /*
                 * The persisted operation is the retry journal. Individual
                 * registry or integrity failures must not stop other links.
                 */
            }
        }
    }

    public GlobalIdentityStatusDto status(Authentication authentication) {
        AuthenticatedMember member = requireAuthenticatedMember(
                authentication);
        Resolution resolution = runtimeResolver.resolveGlobalIdentity(
                MongoSessionModeContext.currentMode());
        if (!resolution.isReady()) {
            GlobalIdentityLinkState persisted = linkRepository
                    .findFirstByLocalUserIdOrderByUpdatedAtDesc(
                            member.localUserId())
                    .orElse(null);
            return toStatus(persisted, null, false);
        }
        RegisteredRuntime runtime = resolution.runtime();
        GlobalIdentityLinkState state = linkRepository
                .findByDeploymentIdAndLocalUserId(
                        runtime.state().deploymentId(),
                        member.localUserId())
                .orElse(null);
        if (state != null) {
            validateStoredLink(runtime, state, member.localUserId());
        }
        try {
            GlobalIdentityVoprfKey key = verifiedCurrentKey(runtime);
            return toStatus(state, key.keyVersion(), true);
        } catch (RuntimeException exception) {
            return toStatus(state, null, false);
        }
    }

    public GlobalIdentityStatusDto link(
            Authentication authentication,
            GlobalIdentityConsentRequestDto request) {
        if (request == null || !Boolean.TRUE.equals(request.accepted())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Explicit global identity consent is required.");
        }
        Member member = requireVerifiedMember(authentication);
        RegisteredRuntime runtime = requireRuntime();
        GlobalIdentityVoprfKey key = verifiedCurrentKey(runtime);
        GlobalIdentityLinkState state = linkRepository
                .findByDeploymentIdAndLocalUserId(
                        runtime.state().deploymentId(),
                        member.localUserId())
                .orElse(null);
        if (state != null) {
            validateStoredLink(runtime, state, member.localUserId());
        }
        if (state != null && state.getPendingOperation() != null) {
            return completePending(runtime, state, key.keyVersion());
        }
        if (state != null
                && GlobalIdentityLinkState.STATUS_ACTIVE.equals(
                        state.getStatus())) {
            if (Objects.equals(state.getKeyVersion(), key.keyVersion())) {
                return toStatus(state, key.keyVersion(), true);
            }
            return rotate(runtime, member, state, key);
        }

        EvaluatedIdentity evaluated = evaluate(
                runtime,
                key,
                member.normalizedEmail());
        String now = clock.instant().toString();
        String consentNonce = RegistryProtocol.randomToken(
                "consent_",
                secureRandom);
        String consentCommitment = RegistryProtocol.sha256(
                RegistryProtocol.canonical(
                        CONSENT_EVIDENCE_DOMAIN,
                        RegistryProtocol.GLOBAL_IDENTITY_CONSENT_VERSION,
                        now,
                        consentNonce));
        PendingOperation pending = pendingLink(
                evaluated,
                consentCommitment,
                consentNonce,
                now,
                currentPeriod());
        if (state == null) {
            state = new GlobalIdentityLinkState();
            state.setId(new ObjectId().toHexString());
            state.setSchemaVersion(GlobalIdentityLinkState.SCHEMA_VERSION);
            state.setRegistryScope(runtime.state().registryScope());
            state.setDeploymentId(runtime.state().deploymentId());
            state.setLocalUserId(member.localUserId());
            state.setStatus(GlobalIdentityLinkState.STATUS_PENDING);
            state.setCreatedAt(now);
        }
        state.setPendingOperation(pending);
        state.setUpdatedAt(now);
        state = saveConcurrent(state);
        return completePending(runtime, state, key.keyVersion());
    }

    public GlobalIdentityStatusDto rotate(Authentication authentication) {
        Member member = requireVerifiedMember(authentication);
        RegisteredRuntime runtime = requireRuntime();
        GlobalIdentityVoprfKey key = verifiedCurrentKey(runtime);
        GlobalIdentityLinkState state = linkRepository
                .findByDeploymentIdAndLocalUserId(
                        runtime.state().deploymentId(),
                        member.localUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Global identity is not linked."));
        validateStoredLink(runtime, state, member.localUserId());
        if (state.getPendingOperation() != null) {
            return completePending(runtime, state, key.keyVersion());
        }
        if (!GlobalIdentityLinkState.STATUS_ACTIVE.equals(state.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Global identity is not active.");
        }
        if (Objects.equals(state.getKeyVersion(), key.keyVersion())) {
            return toStatus(state, key.keyVersion(), true);
        }
        return rotate(runtime, member, state, key);
    }

    public GlobalIdentityStatusDto unlink(
            Authentication authentication,
            GlobalIdentityUnlinkRequestDto request) {
        if (request == null || !Boolean.TRUE.equals(request.confirmed())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Global identity unlink confirmation is required.");
        }
        AuthenticatedMember member = requireAuthenticatedMember(
                authentication);
        RegisteredRuntime runtime = requireRuntime();
        GlobalIdentityLinkState state = linkRepository
                .findByDeploymentIdAndLocalUserId(
                        runtime.state().deploymentId(),
                        member.localUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Global identity is not linked."));
        validateStoredLink(runtime, state, member.localUserId());
        if (state.getPendingOperation() != null) {
            String pendingAction = state.getPendingOperation().getAction();
            GlobalIdentityStatusDto completed = completePending(
                    runtime,
                    state,
                    null);
            if (RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_UNLINK.equals(
                    pendingAction)) {
                return completed;
            }
            state = linkRepository
                    .findByDeploymentIdAndLocalUserId(
                            runtime.state().deploymentId(),
                            member.localUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Global identity changed concurrently; reload and retry."));
            validateStoredLink(runtime, state, member.localUserId());
        }
        if (GlobalIdentityLinkState.STATUS_UNLINKED.equals(state.getStatus())) {
            return toStatus(state, null, true);
        }
        if (!GlobalIdentityLinkState.STATUS_ACTIVE.equals(state.getStatus())
                || !StringUtils.hasText(state.getLinkId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Global identity is not active.");
        }
        state = queueUnlink(state, "USER_WITHDRAWN");
        return completePending(runtime, state, null);
    }

    private GlobalIdentityStatusDto rotate(
            RegisteredRuntime runtime,
            Member member,
            GlobalIdentityLinkState state,
            GlobalIdentityVoprfKey key) {
        EvaluatedIdentity evaluated = evaluate(
                runtime,
                key,
                member.normalizedEmail());
        String now = clock.instant().toString();
        PendingOperation pending = new PendingOperation();
        pending.setAction(
                RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_CORRECT);
        pending.setIdempotencyKey(RegistryProtocol.randomToken(
                "gicorrect_",
                secureRandom));
        pending.setKeyVersion(evaluated.keyVersion());
        pending.setSuite(evaluated.suite());
        pending.setNetworkIdentityCommitment(evaluated.commitment());
        pending.setConsentVersion(state.getConsentVersion());
        pending.setConsentEvidenceCommitment(
                state.getConsentEvidenceCommitment());
        pending.setConsentEvidenceNonce(state.getConsentEvidenceNonce());
        pending.setVerifiedAt(state.getVerifiedAt());
        pending.setEffectivePeriod(currentPeriod());
        pending.setReasonCommitment(reasonCommitment("KEY_ROTATION", now));
        pending.setCreatedAt(now);
        pending.setPayloadHash(RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityLinkActionPayload(
                        pending.getAction(),
                        state.getLinkId(),
                        pending.getKeyVersion(),
                        pending.getSuite(),
                        pending.getNetworkIdentityCommitment(),
                        pending.getConsentVersion(),
                        pending.getConsentEvidenceCommitment(),
                        pending.getVerifiedAt(),
                        pending.getEffectivePeriod(),
                        pending.getReasonCommitment())));
        state.setPendingOperation(pending);
        state.setUpdatedAt(now);
        state = saveConcurrent(state);
        return completePending(runtime, state, key.keyVersion());
    }

    private PendingOperation pendingLink(
            EvaluatedIdentity evaluated,
            String consentCommitment,
            String consentNonce,
            String verifiedAt,
            String effectivePeriod) {
        PendingOperation pending = new PendingOperation();
        pending.setAction(ACTION_LINK);
        pending.setIdempotencyKey(RegistryProtocol.randomToken(
                "gilink_",
                secureRandom));
        pending.setKeyVersion(evaluated.keyVersion());
        pending.setSuite(evaluated.suite());
        pending.setNetworkIdentityCommitment(evaluated.commitment());
        pending.setConsentVersion(
                RegistryProtocol.GLOBAL_IDENTITY_CONSENT_VERSION);
        pending.setConsentEvidenceCommitment(consentCommitment);
        pending.setConsentEvidenceNonce(consentNonce);
        pending.setVerifiedAt(verifiedAt);
        pending.setEffectivePeriod(effectivePeriod);
        pending.setCreatedAt(verifiedAt);
        pending.setPayloadHash(RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityLinkPayload(
                        pending.getKeyVersion(),
                        pending.getSuite(),
                        pending.getNetworkIdentityCommitment(),
                        pending.getConsentVersion(),
                        pending.getConsentEvidenceCommitment(),
                        pending.getVerifiedAt(),
                        pending.getEffectivePeriod())));
        return pending;
    }

    private GlobalIdentityStatusDto completePending(
            RegisteredRuntime runtime,
            GlobalIdentityLinkState state,
            Long currentKeyVersion) {
        PendingOperation pending = Objects.requireNonNull(
                state.getPendingOperation(),
                "Pending global identity operation is missing.");
        validateStoredLink(
                runtime,
                state,
                state.getLocalUserId());
        RegistryHttpClient client = new RegistryHttpClient(
                runtime.properties(),
                objectMapper);
        String timestamp = clock.instant().toString();
        String nonce = RegistryProtocol.randomToken("nonce_", secureRandom);
        String path = ACTION_LINK.equals(pending.getAction())
                ? RegistryProtocol.GLOBAL_IDENTITY_LINK_PATH
                : RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_PATH;
        String signature = runtime.deploymentCrypto().signBase64(
                RegistryProtocol.signedRequest(
                        "POST",
                        path,
                        RegistryProtocol.PROTOCOL_VERSION,
                        runtime.state().registryScope(),
                        runtime.state().deploymentId(),
                        timestamp,
                        nonce,
                        pending.getIdempotencyKey(),
                        pending.getPayloadHash()));
        GlobalIdentityMutationResponse response;
        try {
            if (ACTION_LINK.equals(pending.getAction())) {
                response = client.linkGlobalIdentity(
                        new GlobalIdentityLinkRequest(
                                RegistryProtocol.PROTOCOL_VERSION,
                                runtime.state().registryScope(),
                                runtime.state().deploymentId(),
                                timestamp,
                                nonce,
                                pending.getIdempotencyKey(),
                                pending.getKeyVersion(),
                                pending.getSuite(),
                                pending.getNetworkIdentityCommitment(),
                                pending.getConsentVersion(),
                                pending.getConsentEvidenceCommitment(),
                                pending.getVerifiedAt(),
                                pending.getEffectivePeriod(),
                                pending.getPayloadHash(),
                                signature));
            } else {
                boolean correction =
                        RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_CORRECT
                                .equals(pending.getAction());
                response = client.applyGlobalIdentityLinkAction(
                        new GlobalIdentityLinkActionRequest(
                                RegistryProtocol.PROTOCOL_VERSION,
                                runtime.state().registryScope(),
                                runtime.state().deploymentId(),
                                timestamp,
                                nonce,
                                pending.getIdempotencyKey(),
                                pending.getAction(),
                                state.getLinkId(),
                                correction ? pending.getKeyVersion() : 0L,
                                correction ? pending.getSuite() : "",
                                correction
                                        ? pending.getNetworkIdentityCommitment()
                                        : "",
                                correction ? pending.getConsentVersion() : "",
                                correction
                                        ? pending.getConsentEvidenceCommitment()
                                        : "",
                                correction ? pending.getVerifiedAt() : "",
                                pending.getEffectivePeriod(),
                                pending.getReasonCommitment(),
                                pending.getPayloadHash(),
                                signature));
            }
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Global identity registry synchronization is temporarily unavailable.");
        }
        verifyMutationResponse(runtime, state, pending, response);
        applyResponse(state, pending, response);
        validateStoredLink(runtime, state, state.getLocalUserId());
        state.setUpdatedAt(clock.instant().toString());
        state = saveConcurrent(state);
        return toStatus(state, currentKeyVersion, true);
    }

    private void applyResponse(
            GlobalIdentityLinkState state,
            PendingOperation pending,
            GlobalIdentityMutationResponse response) {
        GlobalIdentityLink link = response.link();
        if (!RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_UNLINK.equals(
                pending.getAction())) {
            state.setKeyVersion(pending.getKeyVersion());
            state.setSuite(pending.getSuite());
            state.setNetworkIdentityCommitment(
                    pending.getNetworkIdentityCommitment());
            state.setConsentVersion(pending.getConsentVersion());
            state.setConsentEvidenceCommitment(
                    pending.getConsentEvidenceCommitment());
            state.setConsentEvidenceNonce(pending.getConsentEvidenceNonce());
            state.setVerifiedAt(pending.getVerifiedAt());
        }
        state.setStatus("ACTIVE".equals(link.status())
                ? GlobalIdentityLinkState.STATUS_ACTIVE
                : GlobalIdentityLinkState.STATUS_UNLINKED);
        state.setLinkId(link.linkId());
        state.setActiveFromPeriod(link.activeFromPeriod());
        state.setInactiveFromPeriod(link.inactiveFromPeriod());
        state.setLatestEventIndex(link.latestEventIndex());
        state.setLatestEventHash(link.latestEventHash());
        state.setAcceptedResponse(response);
        state.setPendingOperation(null);
    }

    private EvaluatedIdentity evaluate(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            String normalizedEmail) {
        byte[] privateInput = RegistryProtocol.canonical(
                INPUT_DOMAIN,
                normalizedEmail);
        try (BlindSession blind = voprfClient.blind(privateInput)) {
            String payloadHash = RegistryProtocol.sha256(
                    RegistryProtocol.globalIdentityEvaluationPayload(
                            key.keyVersion(),
                            key.suite(),
                            blind.blindedElement()));
            String timestamp = clock.instant().toString();
            String nonce = RegistryProtocol.randomToken(
                    "nonce_",
                    secureRandom);
            String idempotencyKey = RegistryProtocol.randomToken(
                    "gieval_",
                    secureRandom);
            byte[] signedMessage = RegistryProtocol.signedRequest(
                    "POST",
                    RegistryProtocol.GLOBAL_IDENTITY_EVALUATE_PATH,
                    RegistryProtocol.PROTOCOL_VERSION,
                    runtime.state().registryScope(),
                    runtime.state().deploymentId(),
                    timestamp,
                    nonce,
                    idempotencyKey,
                    payloadHash);
            String signature = runtime.deploymentCrypto().signBase64(
                    signedMessage);
            GlobalIdentityEvaluationResponse response;
            try {
                response = new RegistryHttpClient(
                        runtime.properties(),
                        objectMapper).evaluateGlobalIdentity(
                                new GlobalIdentityEvaluationRequest(
                                        RegistryProtocol.PROTOCOL_VERSION,
                                        runtime.state().registryScope(),
                                        runtime.state().deploymentId(),
                                        timestamp,
                                        nonce,
                                        idempotencyKey,
                                        key.keyVersion(),
                                        key.suite(),
                                        blind.blindedElement(),
                                        payloadHash,
                                        signature));
            } catch (RuntimeException exception) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "Global identity registry evaluation is temporarily unavailable.");
            }
            verifyEvaluationResponse(
                    runtime,
                    key,
                    RegistryProtocol.sha256(signedMessage),
                    response);
            byte[] output = voprfClient.finish(
                    blind,
                    response.publicKey(),
                    response.evaluatedElement(),
                    response.proof());
            try {
                return new EvaluatedIdentity(
                        key.keyVersion(),
                        key.suite(),
                        GlobalIdentityVoprfClient.networkIdentityCommitment(
                                key.keyVersion(),
                                output));
            } finally {
                Arrays.fill(output, (byte) 0);
            }
        } finally {
            Arrays.fill(privateInput, (byte) 0);
        }
    }

    GlobalIdentityVoprfKey verifiedCurrentKey(
            RegisteredRuntime runtime) {
        GlobalIdentityVoprfKey key;
        try {
            key = new RegistryHttpClient(
                    runtime.properties(),
                    objectMapper).currentGlobalIdentityVoprfKey();
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Global identity registry key is temporarily unavailable.");
        }
        if (key == null
                || !RegistryProtocol.PROTOCOL_VERSION.equals(
                        key.protocolVersion())
                || !runtime.state().registryScope().equals(
                        key.registryScope())
                || key.keyVersion() == null
                || key.keyVersion() <= 0L
                || !RegistryProtocol.GLOBAL_IDENTITY_VOPRF_SUITE.equals(
                        key.suite())
                || !RegistryProtocol.GLOBAL_IDENTITY_VOPRF_MODE.equals(
                        key.mode())
                || !RegistryProtocol
                        .GLOBAL_IDENTITY_VOPRF_KEY_STATUS_ACTIVE.equals(
                                key.status())
                || !runtime.registryKeyId().equals(key.registryKeyId())
                || !runtime.registryPublicKeyBase64().equals(
                        key.registryPublicKey())
                || !RegistryCrypto.verifyBase64(
                        runtime.registryPublicKey(),
                        RegistryProtocol.globalIdentityVoprfKey(key),
                        key.signature())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Global identity registry key failed its trust check.");
        }
        RegistryProtocol.requireUtcTimestamp(
                key.activatedAt(),
                "activated_at");
        return key;
    }

    private void verifyEvaluationResponse(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            String expectedRequestHash,
            GlobalIdentityEvaluationResponse response) {
        if (response == null
                || !RegistryProtocol.PROTOCOL_VERSION.equals(
                        response.protocolVersion())
                || !runtime.state().registryScope().equals(
                        response.registryScope())
                || !runtime.state().deploymentId().equals(
                        response.deploymentId())
                || !Objects.equals(key.keyVersion(), response.keyVersion())
                || !key.suite().equals(response.suite())
                || !key.publicKey().equals(response.publicKey())
                || !expectedRequestHash.equals(response.requestHash())
                || !runtime.registryKeyId().equals(
                        response.registryKeyId())
                || !runtime.registryPublicKeyBase64().equals(
                        response.registryPublicKey())
                || response.duplicate() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Global identity evaluation failed its trust check.");
        }
        String expectedResponseHash = RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityEvaluationResult(response));
        RegistryProtocol.requireUtcTimestamp(
                response.evaluatedAt(),
                "evaluated_at");
        if (!expectedResponseHash.equals(response.responseHash())
                || !RegistryCrypto.verifyBase64(
                        runtime.registryPublicKey(),
                        RegistryProtocol.globalIdentityEvaluationReceipt(
                                response),
                        response.receiptSignature())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Global identity evaluation failed its trust check.");
        }
    }

    static void verifyMutationResponse(
            RegisteredRuntime runtime,
            GlobalIdentityLinkState state,
            PendingOperation pending,
            GlobalIdentityMutationResponse response) {
        if (response == null
                || response.link() == null
                || response.event() == null
                || !RegistryProtocol.PROTOCOL_VERSION.equals(
                        response.protocolVersion())
                || !runtime.state().registryScope().equals(
                        response.registryScope())
                || !runtime.registryPublicKeyBase64().equals(
                        response.registryPublicKey())
                || response.duplicate() == null) {
            throw new IllegalStateException(
                    "Global identity mutation response is incomplete.");
        }
        GlobalIdentityLink link = response.link();
        String expectedAction = pending.getAction();
        String expectedStatus =
                RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_UNLINK.equals(
                        expectedAction)
                        ? "UNLINKED"
                        : "ACTIVE";
        boolean initialLink = ACTION_LINK.equals(expectedAction);
        boolean unlink =
                RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_UNLINK.equals(
                        expectedAction);
        boolean correction =
                RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_CORRECT.equals(
                        expectedAction);
        RegistryProtocol.requireToken(link.linkId(), "link_id");
        if (!runtime.state().deploymentId().equals(link.deploymentId())
                || !expectedStatus.equals(link.status())
                || !pending.getEffectivePeriod().equals(
                        response.event().period())
                || (!initialLink
                        && !Objects.equals(
                                state.getLinkId(),
                                link.linkId()))
                || (initialLink
                        && !pending.getEffectivePeriod().equals(
                                link.activeFromPeriod()))
                || (!initialLink
                        && !Objects.equals(
                                state.getActiveFromPeriod(),
                                link.activeFromPeriod()))
                || (unlink
                        && !pending.getEffectivePeriod().equals(
                                link.inactiveFromPeriod()))
                || (!unlink
                        && StringUtils.hasText(
                                link.inactiveFromPeriod()))
                || link.latestEventIndex() == null
                || link.latestEventIndex() <= 0L
                || !Objects.equals(
                        link.latestEventIndex(),
                        response.event().eventIndex())
                || !Objects.equals(
                        link.latestEventHash(),
                        response.event().eventHash())) {
            throw new IllegalStateException(
                    "Global identity link does not match the mutation.");
        }
        Long expectedKeyVersion = unlink
                ? state.getKeyVersion()
                : pending.getKeyVersion();
        String expectedSuite = unlink
                ? state.getSuite()
                : pending.getSuite();
        String expectedConsentVersion = unlink
                ? state.getConsentVersion()
                : pending.getConsentVersion();
        String expectedVerifiedAt = unlink
                ? state.getVerifiedAt()
                : pending.getVerifiedAt();
        if (!Objects.equals(expectedKeyVersion, link.keyVersion())
                || !Objects.equals(expectedSuite, link.suite())
                || !Objects.equals(
                        expectedConsentVersion,
                        link.consentVersion())
                || !Objects.equals(expectedVerifiedAt, link.verifiedAt())
                || (correction
                        && !GlobalIdentityLinkState.STATUS_ACTIVE.equals(
                                state.getStatus()))) {
            throw new IllegalStateException(
                    "Global identity link changed immutable metadata.");
        }
        verifyEvent(runtime, response.event(), expectedAction);
    }

    static void verifyEvent(
            RegisteredRuntime runtime,
            RegistryProtocol.GlobalIdentityEvent event,
            String expectedAction) {
        if (event.eventIndex() == null
                || event.eventIndex() <= 0L
                || !expectedAction.equals(event.action())
                || !runtime.state().deploymentId().equals(
                        event.deploymentId())
                || !runtime.state().registryScope().equals(
                        event.registryScope())
                || !runtime.registryKeyId().equals(event.registryKeyId())
                || event.reportedCount() == null
                || event.reportedCount() < 0L
                || event.deduplicatedCount() == null
                || event.deduplicatedCount() < 0L
                || event.deduplicatedCount() > event.reportedCount()) {
            throw new IllegalStateException(
                    "Global identity event does not match the request.");
        }
        RegistryProtocol.requireHash(
                event.aggregateCommitment(),
                "aggregate_commitment");
        RegistryProtocol.requireToken(event.eventId(), "event_id");
        RegistryProtocol.requirePeriod(event.period());
        RegistryProtocol.requireHash(
                event.previousEventHash(),
                "previous_event_hash");
        RegistryProtocol.requireHash(event.eventHash(), "event_hash");
        RegistryProtocol.requireUtcTimestamp(
                event.acceptedAt(),
                "accepted_at");
        String expectedHash = RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityEvent(event));
        if (!expectedHash.equals(event.eventHash())
                || !RegistryCrypto.verifyBase64(
                        runtime.registryPublicKey(),
                        RegistryProtocol.globalIdentityEventReceipt(event),
                        event.signature())) {
            throw new IllegalStateException(
                    "Global identity event signature is invalid.");
        }
    }

    private void validateStoredLink(
            RegisteredRuntime runtime,
            GlobalIdentityLinkState state,
            String expectedLocalUserId) {
        if (state == null
                || !Objects.equals(
                        state.getSchemaVersion(),
                        GlobalIdentityLinkState.SCHEMA_VERSION)
                || !runtime.state().registryScope().equals(
                        state.getRegistryScope())
                || !runtime.state().deploymentId().equals(
                        state.getDeploymentId())
                || !Objects.equals(
                        expectedLocalUserId,
                        state.getLocalUserId())
                || !java.util.Set.of(
                                GlobalIdentityLinkState.STATUS_PENDING,
                                GlobalIdentityLinkState.STATUS_ACTIVE,
                                GlobalIdentityLinkState.STATUS_UNLINKED)
                        .contains(state.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Stored global identity state failed its integrity check.");
        }
        PendingOperation pending = state.getPendingOperation();
        if (pending != null) {
            RegistryProtocol.requireToken(
                    pending.getIdempotencyKey(),
                    "idempotency_key");
            RegistryProtocol.requireHash(
                    pending.getPayloadHash(),
                    "payload_hash");
            String expectedPayload;
            if (ACTION_LINK.equals(pending.getAction())) {
                expectedPayload = RegistryProtocol.sha256(
                        RegistryProtocol.globalIdentityLinkPayload(
                                pending.getKeyVersion(),
                                pending.getSuite(),
                                pending.getNetworkIdentityCommitment(),
                                pending.getConsentVersion(),
                                pending.getConsentEvidenceCommitment(),
                                pending.getVerifiedAt(),
                                pending.getEffectivePeriod()));
            } else if (RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_CORRECT
                    .equals(pending.getAction())
                    || RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_UNLINK
                            .equals(pending.getAction())) {
                boolean correction =
                        RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_CORRECT
                                .equals(pending.getAction());
                expectedPayload = RegistryProtocol.sha256(
                        RegistryProtocol.globalIdentityLinkActionPayload(
                                pending.getAction(),
                                state.getLinkId(),
                                correction ? pending.getKeyVersion() : null,
                                correction ? pending.getSuite() : null,
                                correction
                                        ? pending.getNetworkIdentityCommitment()
                                        : null,
                                correction
                                        ? pending.getConsentVersion()
                                        : null,
                                correction
                                        ? pending.getConsentEvidenceCommitment()
                                        : null,
                                correction ? pending.getVerifiedAt() : null,
                                pending.getEffectivePeriod(),
                                pending.getReasonCommitment()));
            } else {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Stored global identity operation is invalid.");
            }
            if (!expectedPayload.equals(pending.getPayloadHash())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Stored global identity operation failed its integrity check.");
            }
        } else if (GlobalIdentityLinkState.STATUS_PENDING.equals(
                state.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Stored global identity operation is incomplete.");
        }
        if (!GlobalIdentityLinkState.STATUS_PENDING.equals(state.getStatus())) {
            if (!StringUtils.hasText(state.getLinkId())
                    || state.getKeyVersion() == null
                    || state.getKeyVersion() <= 0L
                    || !RegistryProtocol.GLOBAL_IDENTITY_VOPRF_SUITE.equals(
                            state.getSuite())
                    || !RegistryProtocol.GLOBAL_IDENTITY_CONSENT_VERSION
                            .equals(state.getConsentVersion())
                    || !StringUtils.hasText(
                            state.getConsentEvidenceNonce())
                    || !Objects.equals(
                            RegistryProtocol.sha256(
                                    RegistryProtocol.canonical(
                                            CONSENT_EVIDENCE_DOMAIN,
                                            state.getConsentVersion(),
                                            state.getVerifiedAt(),
                                            state.getConsentEvidenceNonce())),
                            state.getConsentEvidenceCommitment())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Stored global identity state failed its integrity check.");
            }
            RegistryProtocol.requireHash(
                    state.getNetworkIdentityCommitment(),
                    "network_identity_commitment");
            RegistryProtocol.requireUtcTimestamp(
                    state.getVerifiedAt(),
                    "verified_at");
            RegistryProtocol.requirePeriod(state.getActiveFromPeriod());
            if (StringUtils.hasText(state.getInactiveFromPeriod())) {
                RegistryProtocol.requirePeriod(state.getInactiveFromPeriod());
            }
        }
        GlobalIdentityMutationResponse accepted = state.getAcceptedResponse();
        if (accepted != null) {
            if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                        accepted.protocolVersion())
                    || !runtime.state().registryScope().equals(
                            accepted.registryScope())
                    || !runtime.registryPublicKeyBase64().equals(
                            accepted.registryPublicKey())
                    || accepted.link() == null
                    || accepted.event() == null
                    || accepted.duplicate() == null
                    || !Objects.equals(
                            state.getLinkId(),
                            accepted.link().linkId())
                    || !Objects.equals(
                            state.getLatestEventIndex(),
                            accepted.event().eventIndex())
                    || !Objects.equals(
                            state.getLatestEventHash(),
                            accepted.event().eventHash())) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Stored global identity receipt failed its trust check.");
            }
            verifyEvent(runtime, accepted.event(), accepted.event().action());
        }
    }

    private RegisteredRuntime requireRuntime() {
        Resolution resolution = runtimeResolver.resolveGlobalIdentity(
                MongoSessionModeContext.currentMode());
        if (!resolution.isReady()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Global identity is unavailable until this deployment is registered.");
        }
        return resolution.runtime();
    }

    private AuthenticatedMember requireAuthenticatedMember(
            Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal()
                        instanceof FirebasePrincipal principal)
                || !StringUtils.hasText(principal.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "An authenticated member profile is required.");
        }
        String localUserId = principal.getUserId().trim();
        if (usersRepository.findByUserId(localUserId).isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "A persisted member profile is required.");
        }
        return new AuthenticatedMember(localUserId, principal);
    }

    private Member requireVerifiedMember(Authentication authentication) {
        AuthenticatedMember authenticated = requireAuthenticatedMember(
                authentication);
        FirebasePrincipal principal = authenticated.principal();
        if (!principal.isEmailVerified()
                || !StringUtils.hasText(principal.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "A verified sign-in email is required.");
        }
        return new Member(
                authenticated.localUserId(),
                normalizeEmail(principal.getEmail()));
    }

    private GlobalIdentityLinkState saveConcurrent(
            GlobalIdentityLinkState state) {
        try {
            return linkRepository.save(state);
        } catch (DataAccessException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Global identity changed concurrently; reload and retry.");
        }
    }

    private GlobalIdentityStatusDto toStatus(
            GlobalIdentityLinkState state,
            Long currentKeyVersion,
            boolean syncAvailable) {
        if (state == null) {
            return new GlobalIdentityStatusDto(
                    syncAvailable ? "UNLINKED" : "UNAVAILABLE",
                    false,
                    RegistryProtocol.GLOBAL_IDENTITY_CONSENT_VERSION,
                    currentKeyVersion,
                    RegistryProtocol.GLOBAL_IDENTITY_VOPRF_SUITE,
                    null,
                    null,
                    null,
                    null,
                    syncAvailable,
                    null);
        }
        boolean linked = GlobalIdentityLinkState.STATUS_ACTIVE.equals(
                state.getStatus());
        return new GlobalIdentityStatusDto(
                state.getPendingOperation() == null
                        ? state.getStatus()
                        : state.getPendingOperation().getAction(),
                linked,
                state.getConsentVersion(),
                state.getKeyVersion(),
                state.getSuite(),
                state.getActiveFromPeriod(),
                state.getInactiveFromPeriod(),
                state.getVerifiedAt(),
                linked && currentKeyVersion != null
                        ? !Objects.equals(
                                state.getKeyVersion(),
                                currentKeyVersion)
                        : null,
                syncAvailable,
                state.getUpdatedAt());
    }

    private String reasonCommitment(String reasonCode, String at) {
        return RegistryProtocol.sha256(RegistryProtocol.canonical(
                REASON_DOMAIN,
                reasonCode,
                at,
                RegistryProtocol.randomToken("reason_", secureRandom)));
    }

    private String currentPeriod() {
        return YearMonth.from(clock.instant().atZone(ZoneOffset.UTC))
                .toString();
    }

    private static String normalizeEmail(String email) {
        String normalized = Normalizer.normalize(
                Objects.requireNonNull(email),
                Normalizer.Form.NFC)
                .trim()
                .toLowerCase(Locale.ROOT);
        if (normalized.isEmpty()
                || normalized.length() > 320
                || normalized.indexOf('@') <= 0
                || normalized.endsWith("@")
                || normalized.indexOf('\r') >= 0
                || normalized.indexOf('\n') >= 0) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "A verified sign-in email is required.");
        }
        return normalized;
    }

    private record AuthenticatedMember(
            String localUserId,
            FirebasePrincipal principal) {
    }

    private record Member(String localUserId, String normalizedEmail) {
    }

    private record EvaluatedIdentity(
            long keyVersion,
            String suite,
            String commitment) {
    }
}
