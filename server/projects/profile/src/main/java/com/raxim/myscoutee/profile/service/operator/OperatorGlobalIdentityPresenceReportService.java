package com.raxim.myscoutee.profile.service.operator;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityLinkState;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem.Failure;
import com.raxim.myscoutee.profile.data.document.GlobalIdentityPresenceOutboxItem.SignedAttempt;
import com.raxim.myscoutee.profile.data.document.QualifiedMauReportOutboxItem;
import com.raxim.myscoutee.profile.repository.GlobalIdentityLinkStateRepository;
import com.raxim.myscoutee.profile.repository.GlobalIdentityPresenceOutboxRepository;
import com.raxim.myscoutee.profile.repository.QualifiedMauReportOutboxRepository;
import com.raxim.myscoutee.profile.service.operator.OperatorQualifiedMauCalculator.QualifiedMauDetailedSnapshot;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.RegisteredRuntime;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.Resolution;
import com.raxim.myscoutee.registry.RegistryHttpClient;
import com.raxim.myscoutee.registry.RegistryHttpClient.RegistryHttpException;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityEvent;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityPresenceBatchRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityPresenceBatchResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentitySnapshot;
import com.raxim.myscoutee.registry.RegistryProtocol.GlobalIdentityVoprfKey;

import tools.jackson.databind.ObjectMapper;

/**
 * Converts accepted completed-period QMAU revisions into a second durable,
 * privacy-preserving presence outbox. Only sorted VOPRF commitments leave the
 * deployment; the QMAU aggregate and evidence commitment remain unchanged.
 */
@Service
public class OperatorGlobalIdentityPresenceReportService {
    private static final Logger LOGGER = LoggerFactory.getLogger(
            OperatorGlobalIdentityPresenceReportService.class);
    private static final int MAX_COMMITMENTS = 4_096;
    private static final int MAX_DELIVERIES = 16;
    private static final Duration MAX_RETRY_DELAY = Duration.ofHours(24);

    private final OperatorRevenueRegistryRuntimeResolver runtimeResolver;
    private final OperatorGlobalIdentityService globalIdentityService;
    private final OperatorQualifiedMauCalculator calculator;
    private final QualifiedMauReportOutboxRepository qmauRepository;
    private final GlobalIdentityLinkStateRepository linkRepository;
    private final GlobalIdentityPresenceOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final SecureRandom secureRandom;
    private final AtomicBoolean running = new AtomicBoolean();

    public OperatorGlobalIdentityPresenceReportService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            OperatorGlobalIdentityService globalIdentityService,
            OperatorQualifiedMauCalculator calculator,
            QualifiedMauReportOutboxRepository qmauRepository,
            GlobalIdentityLinkStateRepository linkRepository,
            GlobalIdentityPresenceOutboxRepository outboxRepository,
            ObjectMapper objectMapper) {
        this(
                runtimeResolver,
                globalIdentityService,
                calculator,
                qmauRepository,
                linkRepository,
                outboxRepository,
                objectMapper,
                Clock.systemUTC(),
                new SecureRandom());
    }

    OperatorGlobalIdentityPresenceReportService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            OperatorGlobalIdentityService globalIdentityService,
            OperatorQualifiedMauCalculator calculator,
            QualifiedMauReportOutboxRepository qmauRepository,
            GlobalIdentityLinkStateRepository linkRepository,
            GlobalIdentityPresenceOutboxRepository outboxRepository,
            ObjectMapper objectMapper,
            Clock clock,
            SecureRandom secureRandom) {
        this.runtimeResolver = Objects.requireNonNull(runtimeResolver);
        this.globalIdentityService =
                Objects.requireNonNull(globalIdentityService);
        this.calculator = Objects.requireNonNull(calculator);
        this.qmauRepository = Objects.requireNonNull(qmauRepository);
        this.linkRepository = Objects.requireNonNull(linkRepository);
        this.outboxRepository = Objects.requireNonNull(outboxRepository);
        this.objectMapper = Objects.requireNonNull(objectMapper);
        this.clock = Objects.requireNonNull(clock);
        this.secureRandom = Objects.requireNonNull(secureRandom);
    }

    @Scheduled(
            fixedDelayString =
                    "${operator.global-identity.reporter-delay-ms:3600000}",
            initialDelayString =
                    "${operator.global-identity.reporter-initial-delay-ms:120000}")
    public void synchronizeScheduled() {
        MongoSessionMode previous = MongoSessionModeContext.currentMode();
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        try {
            synchronize(MongoSessionMode.REAL, false);
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Global identity presence synchronization failed; its durable outbox will be retried.");
        } finally {
            MongoSessionModeContext.set(previous);
        }
    }

    public void synchronizeNow() {
        synchronize(MongoSessionModeContext.currentMode(), true);
    }

    private void synchronize(
            MongoSessionMode mode,
            boolean forceDelivery) {
        if (!running.compareAndSet(false, true)) {
            return;
        }
        try {
            Resolution resolution = runtimeResolver.resolveGlobalIdentity(
                    mode);
            if (!resolution.isReady()) {
                return;
            }
            RegisteredRuntime runtime = resolution.runtime();
            GlobalIdentityVoprfKey key =
                    globalIdentityService.verifiedCurrentKey(runtime);
            materialize(runtime, key);
            deliverPending(runtime, forceDelivery);
        } finally {
            running.set(false);
        }
    }

    private void materialize(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key) {
        List<QualifiedMauReportOutboxItem> accepted = qmauRepository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId())
                .stream()
                .filter(item -> QualifiedMauReportOutboxItem.STATUS_ACCEPTED
                        .equals(item.getStatus()))
                .sorted(Comparator
                        .comparing(QualifiedMauReportOutboxItem::getPeriod)
                        .thenComparingLong(item -> value(
                                item.getRevision())))
                .toList();
        List<GlobalIdentityPresenceOutboxItem> existing = outboxRepository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId());
        Map<String, GlobalIdentityPresenceOutboxItem> byRevision =
                new HashMap<>();
        Map<String, GlobalIdentityPresenceOutboxItem> latestByPeriod =
                new HashMap<>();
        for (GlobalIdentityPresenceOutboxItem item : existing) {
            validateStored(runtime, item);
            byRevision.put(revisionKey(item.getPeriod(), item.getRevision()),
                    item);
            GlobalIdentityPresenceOutboxItem previous =
                    latestByPeriod.get(item.getPeriod());
            if (previous == null
                    || value(item.getRevision())
                            > value(previous.getRevision())) {
                latestByPeriod.put(item.getPeriod(), item);
            }
        }

        for (QualifiedMauReportOutboxItem qmau : accepted) {
            String revisionKey = revisionKey(
                    qmau.getPeriod(),
                    qmau.getRevision());
            if (byRevision.containsKey(revisionKey)) {
                continue;
            }
            GlobalIdentityPresenceOutboxItem previous =
                    latestByPeriod.get(qmau.getPeriod());
            if (previous != null
                    && !GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED
                            .equals(previous.getStatus())) {
                continue;
            }
            QualifiedMauDetailedSnapshot detailed = calculator
                    .calculateDetailed(YearMonth.parse(qmau.getPeriod()));
            List<String> commitments = List.of();
            if (Objects.equals(
                        detailed.snapshot().evidenceCommitmentHash(),
                        qmau.getCommitmentHash())
                    && detailed.snapshot().qualifiedMauCount()
                            == value(qmau.getQualifiedMauCount())) {
                commitments = eligibleCommitments(
                        runtime,
                        key,
                        qmau.getPeriod(),
                        detailed.qualifiedUserIds());
            }
            GlobalIdentityPresenceOutboxItem created = newItem(
                    runtime,
                    key,
                    qmau,
                    previous,
                    commitments);
            try {
                created = outboxRepository.save(created);
                byRevision.put(revisionKey, created);
                latestByPeriod.put(qmau.getPeriod(), created);
            } catch (DataIntegrityViolationException exception) {
                LOGGER.debug(
                        "Global identity presence revision already exists.");
            }
        }
    }

    private List<String> eligibleCommitments(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            String period,
            List<String> qualifiedUserIds) {
        if (qualifiedUserIds.isEmpty()) {
            return List.of();
        }
        return linkRepository
                .findByDeploymentIdAndLocalUserIdInAndStatusAndKeyVersionAndSuite(
                        runtime.state().deploymentId(),
                        qualifiedUserIds,
                        GlobalIdentityLinkState.STATUS_ACTIVE,
                        key.keyVersion(),
                        key.suite())
                .stream()
                .filter(link -> link.getActiveFromPeriod() != null
                        && link.getActiveFromPeriod().compareTo(period) <= 0)
                .filter(link -> link.getInactiveFromPeriod() == null
                        || link.getInactiveFromPeriod().isBlank()
                        || link.getInactiveFromPeriod().compareTo(period) > 0)
                .map(GlobalIdentityLinkState::getNetworkIdentityCommitment)
                .map(commitment -> RegistryProtocol.requireHash(
                        commitment,
                        "network_identity_commitment"))
                .sorted()
                .limit(MAX_COMMITMENTS)
                .toList();
    }

    private GlobalIdentityPresenceOutboxItem newItem(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            QualifiedMauReportOutboxItem qmau,
            GlobalIdentityPresenceOutboxItem previous,
            List<String> commitments) {
        String now = clock.instant().toString();
        String supersedes = previous == null
                ? null
                : previous.getAcceptedResponse().batchId();
        String payloadHash = RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityPresenceBatchPayload(
                        qmau.getPeriod(),
                        qmau.getRevision(),
                        supersedes,
                        qmau.getQualifiedMauCount(),
                        key.keyVersion(),
                        key.suite(),
                        commitments));
        GlobalIdentityPresenceOutboxItem item =
                new GlobalIdentityPresenceOutboxItem();
        item.setId(new ObjectId().toHexString());
        item.setSchemaVersion(
                GlobalIdentityPresenceOutboxItem.SCHEMA_VERSION);
        item.setRegistryScope(runtime.state().registryScope());
        item.setDeploymentId(runtime.state().deploymentId());
        item.setQmauReportId(qmau.getId());
        item.setQmauCommitmentHash(qmau.getCommitmentHash());
        item.setPeriod(qmau.getPeriod());
        item.setRevision(qmau.getRevision());
        item.setSupersedesBatchId(supersedes);
        item.setReportedQmauCount(qmau.getQualifiedMauCount());
        item.setKeyVersion(key.keyVersion());
        item.setSuite(key.suite());
        item.setNetworkIdentityCommitments(commitments);
        item.setPayloadHash(payloadHash);
        item.setIdempotencyKey(RegistryProtocol.randomToken(
                "gipresence_",
                secureRandom));
        item.setStatus(GlobalIdentityPresenceOutboxItem.STATUS_PENDING);
        item.setAttemptCount(0);
        item.setCreatedAt(now);
        item.setUpdatedAt(now);
        validateStored(runtime, item);
        return item;
    }

    private void deliverPending(
            RegisteredRuntime runtime,
            boolean forceDelivery) {
        List<GlobalIdentityPresenceOutboxItem> pending = outboxRepository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId())
                .stream()
                .filter(item -> GlobalIdentityPresenceOutboxItem.STATUS_PENDING
                        .equals(item.getStatus()))
                .filter(item -> forceDelivery
                        || retryDue(item, clock.instant()))
                .limit(MAX_DELIVERIES)
                .toList();
        for (GlobalIdentityPresenceOutboxItem item : pending) {
            try {
                deliver(runtime, item);
            } catch (RuntimeException exception) {
                recordFailure(runtime, item, exception);
            }
        }
    }

    private void deliver(
            RegisteredRuntime runtime,
            GlobalIdentityPresenceOutboxItem item) {
        validateStored(runtime, item);
        String timestamp = clock.instant().toString();
        String nonce = RegistryProtocol.randomToken("nonce_", secureRandom);
        String signature = runtime.deploymentCrypto().signBase64(
                RegistryProtocol.signedRequest(
                        "POST",
                        RegistryProtocol.GLOBAL_IDENTITY_PRESENCE_BATCH_PATH,
                        RegistryProtocol.PROTOCOL_VERSION,
                        item.getRegistryScope(),
                        item.getDeploymentId(),
                        timestamp,
                        nonce,
                        item.getIdempotencyKey(),
                        item.getPayloadHash()));
        item.setAttemptCount(value(item.getAttemptCount()) + 1);
        item.setLastAttempt(new SignedAttempt(
                timestamp,
                nonce,
                signature));
        item.setUpdatedAt(clock.instant().toString());
        item = outboxRepository.save(item);

        GlobalIdentityPresenceBatchRequest request =
                new GlobalIdentityPresenceBatchRequest(
                        RegistryProtocol.PROTOCOL_VERSION,
                        item.getRegistryScope(),
                        item.getDeploymentId(),
                        timestamp,
                        nonce,
                        item.getIdempotencyKey(),
                        item.getPeriod(),
                        item.getRevision(),
                        item.getSupersedesBatchId(),
                        item.getReportedQmauCount(),
                        item.getKeyVersion(),
                        item.getSuite(),
                        item.getNetworkIdentityCommitments(),
                        item.getPayloadHash(),
                        signature);
        GlobalIdentityPresenceBatchResponse response =
                new RegistryHttpClient(
                        runtime.properties(),
                        objectMapper).submitGlobalIdentityPresenceBatch(
                                request);
        verifyResponse(runtime, item, response);

        item.setAcceptedResponse(response);
        item.setAcceptedAt(response.event().acceptedAt());
        item.setStatus(GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED);
        item.setNextRetryAt(null);
        item.setLastFailure(null);
        item.setUpdatedAt(clock.instant().toString());
        outboxRepository.save(item);
    }

    private void verifyResponse(
            RegisteredRuntime runtime,
            GlobalIdentityPresenceOutboxItem item,
            GlobalIdentityPresenceBatchResponse response) {
        if (response == null
                || response.event() == null
                || response.snapshot() == null
                || !RegistryProtocol.PROTOCOL_VERSION.equals(
                        response.protocolVersion())
                || !item.getRegistryScope().equals(
                        response.registryScope())
                || !item.getDeploymentId().equals(
                        response.deploymentId())
                || !item.getPeriod().equals(response.period())
                || !Objects.equals(item.getRevision(), response.revision())
                || !Objects.equals(
                        (long) item.getNetworkIdentityCommitments().size(),
                        response.linkedCount())
                || !Objects.equals(
                        value(item.getReportedQmauCount())
                                - item.getNetworkIdentityCommitments().size(),
                        response.unlinkedCount())
                || response.duplicate() == null) {
            throw new IllegalStateException(
                    "Global identity presence response changed the signed batch.");
        }
        RegistryProtocol.requireBatchId(response.batchId());
        OperatorGlobalIdentityService.verifyEvent(
                runtime,
                response.event(),
                RegistryProtocol.GLOBAL_IDENTITY_EVENT_ACTION_PRESENCE);
        verifySnapshot(runtime, response.event(), response.snapshot());
    }

    private void verifySnapshot(
            RegisteredRuntime runtime,
            GlobalIdentityEvent event,
            GlobalIdentitySnapshot snapshot) {
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                    snapshot.protocolVersion())
                || !runtime.state().registryScope().equals(
                        snapshot.registryScope())
                || !Objects.equals(event.period(), snapshot.period())
                || snapshot.revision() == null
                || snapshot.revision() <= 0L
                || snapshot.reportedQmauCount() == null
                || snapshot.reportedQmauCount() < 0L
                || snapshot.linkedObservationCount() == null
                || snapshot.linkedObservationCount() < 0L
                || snapshot.globallyUniqueLinkedCount() == null
                || snapshot.globallyUniqueLinkedCount() < 0L
                || snapshot.unlinkedQmauCount() == null
                || snapshot.unlinkedQmauCount() < 0L
                || snapshot.deduplicatedNetworkQmau() == null
                || snapshot.deduplicatedNetworkQmau() < 0L
                || snapshot.duplicateReduction() == null
                || snapshot.duplicateReduction() < 0L
                || snapshot.coveredDeploymentCount() == null
                || snapshot.coveredDeploymentCount() <= 0L
                || !Objects.equals(
                        snapshot.reportedQmauCount(),
                        snapshot.linkedObservationCount()
                                + snapshot.unlinkedQmauCount())
                || !Objects.equals(
                        snapshot.deduplicatedNetworkQmau(),
                        snapshot.globallyUniqueLinkedCount()
                                + snapshot.unlinkedQmauCount())
                || !Objects.equals(
                        snapshot.duplicateReduction(),
                        snapshot.reportedQmauCount()
                                - snapshot.deduplicatedNetworkQmau())
                || !Objects.equals(
                        snapshot.throughEventIndex(),
                        event.eventIndex())
                || !Objects.equals(
                        snapshot.throughEventHash(),
                        event.eventHash())
                || !Objects.equals(
                        snapshot.generatedAt(),
                        event.acceptedAt())
                || !Objects.equals(
                        snapshot.aggregateCommitment(),
                        event.aggregateCommitment())
                || !Objects.equals(
                        snapshot.reportedQmauCount(),
                        event.reportedCount())
                || !Objects.equals(
                        snapshot.deduplicatedNetworkQmau(),
                        event.deduplicatedCount())) {
            throw new IllegalStateException(
                    "Global identity snapshot is inconsistent with its signed event.");
        }
        RegistryProtocol.requireHash(
                snapshot.aggregateCommitment(),
                "aggregate_commitment");
        RegistryProtocol.requireUtcTimestamp(
                snapshot.generatedAt(),
                "generated_at");
    }

    private void recordFailure(
            RegisteredRuntime runtime,
            GlobalIdentityPresenceOutboxItem candidate,
            RuntimeException exception) {
        GlobalIdentityPresenceOutboxItem item = outboxRepository
                .findById(candidate.getId())
                .orElse(candidate);
        validateStored(runtime, item);
        boolean retryable = !(exception instanceof RegistryHttpException http)
                || http.getStatusCode() >= 500
                || http.getStatusCode() == 408
                || http.getStatusCode() == 429;
        String now = clock.instant().toString();
        item.setLastFailure(new Failure(
                retryable
                        ? "REGISTRY_TEMPORARILY_UNAVAILABLE"
                        : "REGISTRY_REJECTED_BATCH",
                now,
                retryable));
        if (retryable) {
            item.setStatus(GlobalIdentityPresenceOutboxItem.STATUS_PENDING);
            item.setNextRetryAt(clock.instant()
                    .plus(retryDelay(item.getAttemptCount()))
                    .toString());
        } else {
            item.setStatus(GlobalIdentityPresenceOutboxItem.STATUS_BLOCKED);
            item.setNextRetryAt(null);
        }
        item.setUpdatedAt(now);
        try {
            outboxRepository.save(item);
        } catch (DataAccessException saveException) {
            LOGGER.warn(
                    "Global identity presence failure state could not be persisted.");
        }
    }

    private void validateStored(
            RegisteredRuntime runtime,
            GlobalIdentityPresenceOutboxItem item) {
        if (item == null
                || !Objects.equals(
                        item.getSchemaVersion(),
                        GlobalIdentityPresenceOutboxItem.SCHEMA_VERSION)
                || !runtime.state().registryScope().equals(
                        item.getRegistryScope())
                || !runtime.state().deploymentId().equals(
                        item.getDeploymentId())
                || item.getRevision() == null
                || item.getRevision() <= 0L
                || item.getReportedQmauCount() == null
                || item.getReportedQmauCount() < 0L
                || item.getKeyVersion() == null
                || item.getKeyVersion() <= 0L
                || !RegistryProtocol.GLOBAL_IDENTITY_VOPRF_SUITE.equals(
                        item.getSuite())
                || item.getNetworkIdentityCommitments().size()
                        > item.getReportedQmauCount()
                || item.getNetworkIdentityCommitments().size()
                        > MAX_COMMITMENTS) {
            throw new IllegalStateException(
                    "Stored global identity presence item is invalid.");
        }
        RegistryProtocol.requirePeriod(item.getPeriod());
        RegistryProtocol.requireHash(
                item.getQmauCommitmentHash(),
                "qmau_commitment_hash");
        RegistryProtocol.requireHash(item.getPayloadHash(), "payload_hash");
        RegistryProtocol.requireToken(
                item.getIdempotencyKey(),
                "idempotency_key");
        String expectedPayloadHash = RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityPresenceBatchPayload(
                        item.getPeriod(),
                        item.getRevision(),
                        item.getSupersedesBatchId(),
                        item.getReportedQmauCount(),
                        item.getKeyVersion(),
                        item.getSuite(),
                        item.getNetworkIdentityCommitments()));
        if (!expectedPayloadHash.equals(item.getPayloadHash())) {
            throw new IllegalStateException(
                    "Stored global identity presence payload changed.");
        }
        QualifiedMauReportOutboxItem qmau = qmauRepository
                .findByIdAndDeploymentId(
                        item.getQmauReportId(),
                        item.getDeploymentId())
                .orElseThrow(() -> new IllegalStateException(
                        "Accepted QMAU source is missing."));
        if (!QualifiedMauReportOutboxItem.STATUS_ACCEPTED.equals(
                    qmau.getStatus())
                || qmau.getAcceptedResponse() == null
                || !Objects.equals(qmau.getPeriod(), item.getPeriod())
                || !Objects.equals(qmau.getRevision(), item.getRevision())
                || !Objects.equals(
                        qmau.getQualifiedMauCount(),
                        item.getReportedQmauCount())
                || !Objects.equals(
                        qmau.getCommitmentHash(),
                        item.getQmauCommitmentHash())) {
            throw new IllegalStateException(
                    "Global identity presence does not match its accepted QMAU source.");
        }
        if (GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED.equals(
                item.getStatus())) {
            verifyResponse(runtime, item, item.getAcceptedResponse());
            if (!Objects.equals(
                    item.getAcceptedAt(),
                    item.getAcceptedResponse().event().acceptedAt())) {
                throw new IllegalStateException(
                        "Stored global identity presence acceptance time changed.");
            }
        }
    }

    private static boolean retryDue(
            GlobalIdentityPresenceOutboxItem item,
            Instant now) {
        if (item.getNextRetryAt() == null
                || item.getNextRetryAt().isBlank()) {
            return true;
        }
        try {
            return !Instant.parse(item.getNextRetryAt()).isAfter(now);
        } catch (RuntimeException exception) {
            return true;
        }
    }

    private static Duration retryDelay(Integer attempts) {
        int normalized = Math.max(1, Math.min(value(attempts), 12));
        Duration delay = Duration.ofMinutes(1L << (normalized - 1));
        return delay.compareTo(MAX_RETRY_DELAY) > 0
                ? MAX_RETRY_DELAY
                : delay;
    }

    private static String revisionKey(String period, Long revision) {
        return period + ":" + value(revision);
    }

    private static int value(Integer value) {
        return value == null ? 0 : value;
    }

    private static long value(Long value) {
        return value == null ? 0L : value;
    }
}
