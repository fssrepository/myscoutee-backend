package com.raxim.myscoutee.profile.service.operator;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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
import com.raxim.myscoutee.registry.RegistryCrypto;
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
    static final int COMMITMENTS_PER_CHUNK = 512;
    private static final int LOCAL_LINK_QUERY_SIZE = 512;
    private static final int SERVER_MAX_COMMITMENTS_PER_CHUNK = 4_096;
    static final int SERVER_MAX_CHUNKS_PER_SUBMISSION = 4_096;
    static final long MAX_COMMITMENTS_PER_SUBMISSION =
            (long) COMMITMENTS_PER_CHUNK
                    * SERVER_MAX_CHUNKS_PER_SUBMISSION;
    private static final int MAX_SIGNED_REQUEST_HASHES = 4_096;
    private static final int MAX_DELIVERIES = 16;
    private static final Duration MAX_RETRY_DELAY = Duration.ofHours(24);
    private static final String FAILURE_EVIDENCE_MISMATCH =
            "GLOBAL_IDENTITY_QMAU_EVIDENCE_MISMATCH";
    private static final String FAILURE_SUPERSEDED_BEFORE_PRESENCE =
            "GLOBAL_IDENTITY_SUPERSEDED_BEFORE_PRESENCE";
    private static final String FAILURE_CAPACITY_EXCEEDED =
            "GLOBAL_IDENTITY_PRESENCE_CAPACITY_EXCEEDED";

    private final OperatorRevenueRegistryRuntimeResolver runtimeResolver;
    private final OperatorGlobalIdentityService globalIdentityService;
    private final OperatorQualifiedMauCalculator calculator;
    private final OperatorQualifiedMauReportService qmauReportService;
    private final QualifiedMauReportOutboxRepository qmauRepository;
    private final GlobalIdentityLinkStateRepository linkRepository;
    private final GlobalIdentityPresenceOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final SecureRandom secureRandom;
    private final AtomicBoolean running = new AtomicBoolean();

    @Autowired
    public OperatorGlobalIdentityPresenceReportService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            OperatorGlobalIdentityService globalIdentityService,
            OperatorQualifiedMauCalculator calculator,
            OperatorQualifiedMauReportService qmauReportService,
            QualifiedMauReportOutboxRepository qmauRepository,
            GlobalIdentityLinkStateRepository linkRepository,
            GlobalIdentityPresenceOutboxRepository outboxRepository,
            ObjectMapper objectMapper) {
        this(
                runtimeResolver,
                globalIdentityService,
                calculator,
                qmauReportService,
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
            OperatorQualifiedMauReportService qmauReportService,
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
        this.qmauReportService = Objects.requireNonNull(qmauReportService);
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
        try {
            for (MongoSessionMode mode : List.of(
                    MongoSessionMode.REAL,
                    MongoSessionMode.DEMO)) {
                MongoSessionModeContext.set(mode);
                try {
                    synchronize(mode, false);
                } catch (RuntimeException exception) {
                    LOGGER.warn(
                            "Global identity presence synchronization failed; its durable outbox will be retried.");
                }
            }
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
                .findByDeploymentIdOrderByPeriodAscRevisionAscChunkIndexAsc(
                        runtime.state().deploymentId());
        Map<String, List<GlobalIdentityPresenceOutboxItem>> byRevision =
                new HashMap<>();
        Map<String, PresenceRevision> latestByPeriod =
                new HashMap<>();
        Map<String, PresenceRevision> latestAcceptedByPeriod =
                new HashMap<>();
        for (GlobalIdentityPresenceOutboxItem item : existing) {
            validateStored(runtime, item);
            byRevision.computeIfAbsent(
                            revisionKey(item.getPeriod(), item.getRevision()),
                            ignored -> new ArrayList<>())
                    .add(item);
        }
        for (List<GlobalIdentityPresenceOutboxItem> items :
                byRevision.values()) {
            PresenceRevision revision = validateRevision(items);
            PresenceRevision previous = latestByPeriod.get(revision.period());
            if (previous == null
                    || revision.revision() > previous.revision()) {
                latestByPeriod.put(revision.period(), revision);
            }
            if (revision.finalized()) {
                PresenceRevision acceptedPrevious =
                        latestAcceptedByPeriod.get(revision.period());
                if (acceptedPrevious == null
                        || revision.revision()
                                > acceptedPrevious.revision()) {
                    latestAcceptedByPeriod.put(
                            revision.period(),
                            revision);
                }
            }
        }

        for (QualifiedMauReportOutboxItem qmau : accepted) {
            qmauReportService.validateAcceptedForGlobalIdentity(
                    runtime,
                    qmau);
            String revisionKey = revisionKey(
                    qmau.getPeriod(),
                    qmau.getRevision());
            List<GlobalIdentityPresenceOutboxItem> existingItems =
                    byRevision.get(revisionKey);
            if (existingItems != null) {
                PresenceRevision acceptedHead =
                        latestAcceptedByPeriod.get(qmau.getPeriod());
                boolean laterRevisionAccepted = acceptedHead != null
                        && acceptedHead.revision()
                                > value(qmau.getRevision());
                PresenceRevision revision = validateRevision(existingItems);
                if (!laterRevisionAccepted
                        && (!revision.materializationComplete()
                                || !revision.structurallyComplete()
                                || (!revision.started()
                                        && !Objects.equals(
                                                revision.items()
                                                        .get(0)
                                                        .getKeyVersion(),
                                                key.keyVersion())))) {
                    PresenceRevision repaired = materializeRevision(
                            runtime,
                            key,
                            qmau,
                            revision.previousBatchId(),
                            existingItems);
                    byRevision.put(revisionKey, repaired.items());
                    latestByPeriod.put(qmau.getPeriod(), repaired);
                }
                continue;
            }
            PresenceRevision previous =
                    latestByPeriod.get(qmau.getPeriod());
            if (previous != null
                    && !previous.finalized()) {
                if (latestAcceptedByPeriod.get(qmau.getPeriod()) == null
                        && previous.skippableMaterialization()) {
                    markSupersededBeforePresence(previous);
                    previous = null;
                } else {
                    continue;
                }
            }
            PresenceRevision created = materializeRevision(
                    runtime,
                    key,
                    qmau,
                    previous == null ? null : previous.batchId(),
                    List.of());
            byRevision.put(revisionKey, created.items());
            latestByPeriod.put(qmau.getPeriod(), created);
        }
    }

    private PresenceRevision materializeRevision(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            QualifiedMauReportOutboxItem qmau,
            String supersedesBatchId,
            List<GlobalIdentityPresenceOutboxItem> existing) {
        boolean frozen = existing.stream().anyMatch(item ->
                value(item.getAttemptCount()) > 0
                        || GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED
                                .equals(item.getStatus()));
        if (frozen) {
            return validateRevision(existing);
        }

        QualifiedMauDetailedSnapshot detailed = calculator
                .calculateDetailed(YearMonth.parse(qmau.getPeriod()));
        if (!matchesAcceptedSource(qmau, detailed)) {
            GlobalIdentityPresenceOutboxItem marker = existing.isEmpty()
                    ? newChunk(
                            runtime,
                            key,
                            qmau,
                            supersedesBatchId,
                            "gipsub_" + deterministicHex(
                                    "presence-mismatch",
                                    runtime.state().deploymentId(),
                                    qmau.getPeriod(),
                                    Long.toString(value(qmau.getRevision())),
                                    qmau.getCommitmentHash()).substring(0, 32),
                            0,
                            1,
                            0L,
                            RegistryProtocol.globalIdentityPresenceSetHash(
                                    List.of()),
                            List.of())
                    : existing.get(0);
            blockMaterialization(marker, FAILURE_EVIDENCE_MISMATCH);
            marker = saveChunk(marker);
            removeUnattemptedExtras(existing, Set.of(marker.getId()));
            return validateRevision(List.of(marker));
        }

        List<String> commitments;
        try {
            globalIdentityService.ensureQualifiedUsersLinked(
                    runtime,
                    key,
                    detailed.qualifiedUserIds());
            commitments = eligibleCommitments(
                    runtime,
                    key,
                    qmau.getPeriod(),
                    detailed.qualifiedUserIds());
        } catch (PresenceCapacityExceededException exception) {
            return blockCapacityExceeded(
                    runtime,
                    key,
                    qmau,
                    supersedesBatchId,
                    existing);
        }
        List<GlobalIdentityPresenceOutboxItem> expected = newChunks(
                runtime,
                key,
                qmau,
                supersedesBatchId,
                commitments);
        Map<Integer, GlobalIdentityPresenceOutboxItem> storedByIndex =
                new HashMap<>();
        for (GlobalIdentityPresenceOutboxItem item : existing) {
            storedByIndex.put(item.getChunkIndex(), item);
        }
        List<GlobalIdentityPresenceOutboxItem> materialized =
                new ArrayList<>(expected.size());
        for (GlobalIdentityPresenceOutboxItem candidate : expected) {
            GlobalIdentityPresenceOutboxItem stored =
                    storedByIndex.get(candidate.getChunkIndex());
            if (stored != null) {
                candidate.setId(stored.getId());
                candidate.setVersion(stored.getVersion());
                candidate.setCreatedAt(stored.getCreatedAt());
            }
            validateStored(runtime, candidate);
            materialized.add(saveChunk(candidate));
        }
        Set<String> retainedIds = new HashSet<>();
        for (GlobalIdentityPresenceOutboxItem item : materialized) {
            retainedIds.add(item.getId());
        }
        removeUnattemptedExtras(existing, retainedIds);
        return validateRevision(materialized);
    }

    private List<String> eligibleCommitments(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            String period,
            List<String> qualifiedUserIds) {
        if (qualifiedUserIds.isEmpty()) {
            return List.of();
        }
        List<String> commitments = new ArrayList<>();
        for (int offset = 0;
                offset < qualifiedUserIds.size();
                offset += LOCAL_LINK_QUERY_SIZE) {
            int toIndex = Math.min(
                    qualifiedUserIds.size(),
                    offset + LOCAL_LINK_QUERY_SIZE);
            List<String> pageCommitments = linkRepository
                    .findByDeploymentIdAndLocalUserIdInAndStatusInAndKeyVersionAndSuite(
                            runtime.state().deploymentId(),
                            qualifiedUserIds.subList(offset, toIndex),
                            List.of(
                                    GlobalIdentityLinkState.STATUS_ACTIVE,
                                    GlobalIdentityLinkState.STATUS_UNLINKED),
                            key.keyVersion(),
                            key.suite())
                    .stream()
                    .filter(link -> link.getActiveFromPeriod() != null
                            && link.getActiveFromPeriod()
                                    .compareTo(period) <= 0)
                    .filter(link -> link.getInactiveFromPeriod() == null
                            || link.getInactiveFromPeriod().isBlank()
                            || link.getInactiveFromPeriod()
                                    .compareTo(period) > 0)
                    .map(GlobalIdentityLinkState
                            ::getNetworkIdentityCommitment)
                    .map(commitment -> RegistryProtocol.requireHash(
                            commitment,
                            "network_identity_commitment"))
                    .toList();
            requiredChunkCount(
                    (long) commitments.size() + pageCommitments.size());
            commitments.addAll(pageCommitments);
        }
        commitments.sort(String::compareTo);
        return List.copyOf(commitments);
    }

    private static boolean matchesAcceptedSource(
            QualifiedMauReportOutboxItem qmau,
            QualifiedMauDetailedSnapshot detailed) {
        return Objects.equals(
                    detailed.snapshot().evidenceCommitmentHash(),
                    qmau.getCommitmentHash())
                && detailed.snapshot().qualifiedMauCount()
                        == value(qmau.getQualifiedMauCount());
    }

    private void blockMaterialization(
            GlobalIdentityPresenceOutboxItem item,
            String code) {
        String now = clock.instant().toString();
        item.setMaterializationComplete(false);
        item.setStatus(GlobalIdentityPresenceOutboxItem.STATUS_BLOCKED);
        item.setNextRetryAt(null);
        item.setLastFailure(new Failure(code, now, false));
        item.setUpdatedAt(now);
    }

    private PresenceRevision blockCapacityExceeded(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            QualifiedMauReportOutboxItem qmau,
            String supersedesBatchId,
            List<GlobalIdentityPresenceOutboxItem> existing) {
        String submissionId = "gipsub_" + deterministicHex(
                "presence-capacity-exceeded",
                runtime.state().registryScope(),
                runtime.state().deploymentId(),
                qmau.getPeriod(),
                Long.toString(value(qmau.getRevision())),
                qmau.getCommitmentHash(),
                Long.toString(key.keyVersion()),
                key.suite()).substring(0, 32);
        GlobalIdentityPresenceOutboxItem marker = newChunk(
                runtime,
                key,
                qmau,
                supersedesBatchId,
                submissionId,
                0,
                1,
                0L,
                RegistryProtocol.globalIdentityPresenceSetHash(List.of()),
                List.of());
        if (!existing.isEmpty()) {
            GlobalIdentityPresenceOutboxItem stored = existing.stream()
                    .min(Comparator.comparingInt(item ->
                            value(item.getChunkIndex())))
                    .orElseThrow();
            marker.setId(stored.getId());
            marker.setVersion(stored.getVersion());
            marker.setCreatedAt(stored.getCreatedAt());
        }
        blockMaterialization(marker, FAILURE_CAPACITY_EXCEEDED);
        marker = saveChunk(marker);
        removeUnattemptedExtras(existing, Set.of(marker.getId()));
        return validateRevision(List.of(marker));
    }

    private void markSupersededBeforePresence(
            PresenceRevision revision) {
        String now = clock.instant().toString();
        for (GlobalIdentityPresenceOutboxItem item : revision.items()) {
            item.setMaterializationComplete(false);
            item.setStatus(GlobalIdentityPresenceOutboxItem.STATUS_BLOCKED);
            item.setLastFailure(new Failure(
                    FAILURE_SUPERSEDED_BEFORE_PRESENCE,
                    now,
                    false));
            item.setNextRetryAt(null);
            item.setUpdatedAt(now);
            outboxRepository.save(item);
        }
    }

    private List<GlobalIdentityPresenceOutboxItem> newChunks(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            QualifiedMauReportOutboxItem qmau,
            String supersedesBatchId,
            List<String> commitments) {
        int chunkCount = requiredChunkCount(commitments.size());
        String commitmentSetHash =
                RegistryProtocol.globalIdentityPresenceSetHash(commitments);
        String submissionId = "gipsub_" + deterministicHex(
                "presence-submission",
                runtime.state().registryScope(),
                runtime.state().deploymentId(),
                qmau.getPeriod(),
                Long.toString(value(qmau.getRevision())),
                qmau.getCommitmentHash(),
                Long.toString(key.keyVersion()),
                key.suite(),
                commitmentSetHash).substring(0, 32);
        List<GlobalIdentityPresenceOutboxItem> chunks =
                new ArrayList<>(chunkCount);
        for (int chunkIndex = 0;
                chunkIndex < chunkCount;
                chunkIndex++) {
            int fromIndex = chunkIndex * COMMITMENTS_PER_CHUNK;
            int toIndex = Math.min(
                    commitments.size(),
                    fromIndex + COMMITMENTS_PER_CHUNK);
            List<String> chunkCommitments = fromIndex == toIndex
                    ? List.of()
                    : commitments.subList(fromIndex, toIndex);
            chunks.add(newChunk(
                    runtime,
                    key,
                    qmau,
                    supersedesBatchId,
                    submissionId,
                    chunkIndex,
                    chunkCount,
                    commitments.size(),
                    commitmentSetHash,
                    chunkCommitments));
        }
        return List.copyOf(chunks);
    }

    private GlobalIdentityPresenceOutboxItem newChunk(
            RegisteredRuntime runtime,
            GlobalIdentityVoprfKey key,
            QualifiedMauReportOutboxItem qmau,
            String supersedesBatchId,
            String submissionId,
            int chunkIndex,
            int chunkCount,
            long totalCommitmentCount,
            String commitmentSetHash,
            List<String> commitments) {
        String now = clock.instant().toString();
        String payloadHash = RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityPresenceChunkPayload(
                        submissionId,
                        qmau.getPeriod(),
                        qmau.getRevision(),
                        supersedesBatchId,
                        qmau.getQualifiedMauCount(),
                        key.keyVersion(),
                        key.suite(),
                        chunkIndex,
                        chunkCount,
                        totalCommitmentCount,
                        commitmentSetHash,
                        commitments));
        String stableIdentity = deterministicHex(
                "presence-chunk",
                runtime.state().registryScope(),
                runtime.state().deploymentId(),
                submissionId,
                Integer.toString(chunkIndex));
        GlobalIdentityPresenceOutboxItem item =
                new GlobalIdentityPresenceOutboxItem();
        item.setId(stableIdentity.substring(0, 24));
        item.setSchemaVersion(
                GlobalIdentityPresenceOutboxItem.SCHEMA_VERSION);
        item.setRegistryScope(runtime.state().registryScope());
        item.setDeploymentId(runtime.state().deploymentId());
        item.setQmauReportId(qmau.getId());
        item.setQmauCommitmentHash(qmau.getCommitmentHash());
        item.setPeriod(qmau.getPeriod());
        item.setRevision(qmau.getRevision());
        item.setSupersedesBatchId(supersedesBatchId);
        item.setReportedQmauCount(qmau.getQualifiedMauCount());
        item.setKeyVersion(key.keyVersion());
        item.setSuite(key.suite());
        item.setSubmissionId(submissionId);
        item.setChunkIndex(chunkIndex);
        item.setChunkCount(chunkCount);
        item.setTotalCommitmentCount(totalCommitmentCount);
        item.setCommitmentSetHash(commitmentSetHash);
        item.setNetworkIdentityCommitments(commitments);
        item.setMaterializationComplete(true);
        item.setPayloadHash(payloadHash);
        item.setIdempotencyKey(
                "gipresencechunk_" + stableIdentity.substring(0, 48));
        item.setStatus(GlobalIdentityPresenceOutboxItem.STATUS_PENDING);
        item.setAttemptCount(0);
        item.setCreatedAt(now);
        item.setUpdatedAt(now);
        return item;
    }

    private GlobalIdentityPresenceOutboxItem saveChunk(
            GlobalIdentityPresenceOutboxItem item) {
        return outboxRepository.save(item);
    }

    private void removeUnattemptedExtras(
            List<GlobalIdentityPresenceOutboxItem> existing,
            Set<String> retainedIds) {
        for (GlobalIdentityPresenceOutboxItem item : existing) {
            if (!retainedIds.contains(item.getId())) {
                if (value(item.getAttemptCount()) > 0
                        || GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED
                                .equals(item.getStatus())) {
                    throw new IllegalStateException(
                            "Attempted presence chunks cannot be rematerialized.");
                }
                outboxRepository.delete(item);
            }
        }
    }

    private static String deterministicHex(
            String domain,
            String... values) {
        String[] canonical = new String[values.length + 1];
        canonical[0] = domain;
        System.arraycopy(values, 0, canonical, 1, values.length);
        return RegistryProtocol.sha256(RegistryProtocol.canonical(canonical))
                .substring("sha256:".length());
    }

    private void deliverPending(
            RegisteredRuntime runtime,
            boolean forceDelivery) {
        List<GlobalIdentityPresenceOutboxItem> items = outboxRepository
                .findByDeploymentIdOrderByPeriodAscRevisionAscChunkIndexAsc(
                        runtime.state().deploymentId());
        Map<String, List<GlobalIdentityPresenceOutboxItem>> groups =
                new java.util.LinkedHashMap<>();
        for (GlobalIdentityPresenceOutboxItem item : items) {
            validateStored(runtime, item);
            groups.computeIfAbsent(
                            revisionKey(item.getPeriod(), item.getRevision()),
                            ignored -> new ArrayList<>())
                    .add(item);
        }
        int deliveries = 0;
        for (List<GlobalIdentityPresenceOutboxItem> group : groups.values()) {
            PresenceRevision revision = validateRevision(group);
            if (!revision.materializationComplete()
                    || !revision.structurallyComplete()
                    || revision.finalized()) {
                continue;
            }
            for (GlobalIdentityPresenceOutboxItem item : revision.items()) {
                if (GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED.equals(
                        item.getStatus())) {
                    continue;
                }
                if (!GlobalIdentityPresenceOutboxItem.STATUS_PENDING.equals(
                            item.getStatus())
                        || (!forceDelivery
                                && !retryDue(item, clock.instant()))) {
                    break;
                }
                try {
                    deliver(runtime, item);
                    deliveries++;
                } catch (RuntimeException exception) {
                    recordFailure(runtime, item, exception);
                    break;
                }
                if (deliveries >= MAX_DELIVERIES) {
                    return;
                }
            }
        }
    }

    private void deliver(
            RegisteredRuntime runtime,
            GlobalIdentityPresenceOutboxItem item) {
        validateStored(runtime, item);
        String timestamp = clock.instant().toString();
        String nonce = RegistryProtocol.randomToken("nonce_", secureRandom);
        byte[] signedRequest = RegistryProtocol.signedRequest(
                "POST",
                RegistryProtocol.GLOBAL_IDENTITY_PRESENCE_BATCH_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                item.getRegistryScope(),
                item.getDeploymentId(),
                timestamp,
                nonce,
                item.getIdempotencyKey(),
                item.getPayloadHash());
        rememberSignedRequestHash(
                item,
                RegistryProtocol.sha256(signedRequest));
        String signature = runtime.deploymentCrypto().signBase64(
                signedRequest);
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
                        item.getSubmissionId(),
                        item.getPeriod(),
                        item.getRevision(),
                        item.getSupersedesBatchId(),
                        item.getReportedQmauCount(),
                        item.getKeyVersion(),
                        item.getSuite(),
                        item.getChunkIndex(),
                        item.getChunkCount(),
                        item.getTotalCommitmentCount(),
                        item.getCommitmentSetHash(),
                        item.getNetworkIdentityCommitments(),
                        item.getPayloadHash(),
                        signature);
        GlobalIdentityPresenceBatchResponse response =
                new RegistryHttpClient(
                        runtime.properties(),
                        objectMapper).submitGlobalIdentityPresenceBatch(
                                request);
        verifyResponse(
                runtime,
                item,
                response);

        item.setAcceptedResponse(response);
        item.setAcceptedAt(response.acceptedAt());
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
                || !RegistryProtocol.PROTOCOL_VERSION.equals(
                        response.protocolVersion())
                || !item.getRegistryScope().equals(
                        response.registryScope())
                || !item.getDeploymentId().equals(
                        response.deploymentId())
                || !item.getSubmissionId().equals(
                        response.submissionId())
                || !item.getPeriod().equals(response.period())
                || !Objects.equals(item.getRevision(), response.revision())
                || !Objects.equals(
                        item.getChunkIndex(),
                        response.chunkIndex())
                || !Objects.equals(
                        item.getChunkCount(),
                        response.chunkCount())
                || response.receivedChunkCount() == null
                || response.receivedChunkCount()
                        < item.getChunkIndex() + 1
                || response.receivedChunkCount()
                        > item.getChunkCount()
                || !Objects.equals(
                        item.getTotalCommitmentCount(),
                        response.totalCommitmentCount())
                || !item.getCommitmentSetHash().equals(
                        response.commitmentSetHash())
                || !signedRequestHashes(item).contains(
                        response.requestHash())
                || !item.getPayloadHash().equals(response.payloadHash())
                || !runtime.registryKeyId().equals(
                        response.registryKeyId())
                || !runtime.registryPublicKeyBase64().equals(
                        response.registryPublicKey())
                || response.complete() == null
                || !Objects.equals(
                        Boolean.TRUE.equals(response.complete()),
                        response.receivedChunkCount()
                                .equals(response.chunkCount()))
                || response.duplicate() == null) {
            throw new IllegalStateException(
                    "Global identity presence response changed the signed batch.");
        }
        RegistryProtocol.requireUtcTimestamp(
                response.acceptedAt(),
                "accepted_at");
        String expectedReceiptHash = RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityPresenceChunkReceipt(
                        response));
        if (!expectedReceiptHash.equals(response.receiptHash())
                || !RegistryCrypto.verifyBase64(
                        runtime.registryPublicKey(),
                        RegistryProtocol.globalIdentityPresenceChunkReceipt(
                                response),
                        response.receiptSignature())) {
            throw new IllegalStateException(
                    "Global identity chunk receipt signature is invalid.");
        }
        if (!Boolean.TRUE.equals(response.complete())) {
            if (StringUtils.hasText(response.batchId())
                    || value(response.linkedCount()) != 0L
                    || value(response.unlinkedCount()) != 0L
                    || response.event() != null
                    || response.snapshot() != null) {
                throw new IllegalStateException(
                        "Partial global identity receipt exposed final state.");
            }
            return;
        }
        if (response.event() == null
                || response.snapshot() == null
                || !Objects.equals(
                        item.getTotalCommitmentCount(),
                        response.linkedCount())
                || !Objects.equals(
                        value(item.getReportedQmauCount())
                                - value(item.getTotalCommitmentCount()),
                        response.unlinkedCount())) {
            throw new IllegalStateException(
                    "Final global identity receipt has invalid totals.");
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
        boolean retryable = retryable(exception);
        String now = clock.instant().toString();
        item.setLastFailure(new Failure(
                failureCode(exception),
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
                || item.getSubmissionId() == null
                || !item.getSubmissionId()
                        .matches("gipsub_[0-9a-f]{32}")
                || item.getChunkIndex() == null
                || item.getChunkIndex() < 0
                || item.getChunkCount() == null
                || item.getChunkCount() <= 0
                || item.getChunkCount()
                        > SERVER_MAX_CHUNKS_PER_SUBMISSION
                || item.getChunkIndex() >= item.getChunkCount()
                || item.getTotalCommitmentCount() == null
                || item.getTotalCommitmentCount() < 0L
                || item.getTotalCommitmentCount()
                        > item.getReportedQmauCount()
                || !List.of(
                                GlobalIdentityPresenceOutboxItem.STATUS_PENDING,
                                GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED,
                                GlobalIdentityPresenceOutboxItem.STATUS_BLOCKED)
                        .contains(item.getStatus())
                || item.getNetworkIdentityCommitments().size()
                        > item.getTotalCommitmentCount()
                || (isMaterializationComplete(item)
                        && item.getNetworkIdentityCommitments().size()
                                > COMMITMENTS_PER_CHUNK)
                || item.getNetworkIdentityCommitments().size()
                        > SERVER_MAX_COMMITMENTS_PER_CHUNK
                || value(item.getAttemptCount()) < 0) {
            throw new IllegalStateException(
                    "Stored global identity presence item is invalid.");
        }
        RegistryProtocol.requirePeriod(item.getPeriod());
        RegistryProtocol.requireHash(
                item.getQmauCommitmentHash(),
                "qmau_commitment_hash");
        RegistryProtocol.requireHash(
                item.getCommitmentSetHash(),
                "commitment_set_hash");
        RegistryProtocol.requireHash(item.getPayloadHash(), "payload_hash");
        RegistryProtocol.requireToken(
                item.getIdempotencyKey(),
                "idempotency_key");
        Set<String> requestHashes = signedRequestHashes(item);
        int attemptCount = value(item.getAttemptCount());
        if ((attemptCount == 0
                    && (item.getLastAttempt() != null
                            || !requestHashes.isEmpty()))
                || (attemptCount > 0
                    && (item.getLastAttempt() == null
                            || requestHashes.isEmpty()))
                || requestHashes.size() > attemptCount) {
            throw new IllegalStateException(
                    "Stored global identity presence retry history is invalid.");
        }
        String expectedPayloadHash = RegistryProtocol.sha256(
                RegistryProtocol.globalIdentityPresenceChunkPayload(
                        item.getSubmissionId(),
                        item.getPeriod(),
                        item.getRevision(),
                        item.getSupersedesBatchId(),
                        item.getReportedQmauCount(),
                        item.getKeyVersion(),
                        item.getSuite(),
                        item.getChunkIndex(),
                        item.getChunkCount(),
                        item.getTotalCommitmentCount(),
                        item.getCommitmentSetHash(),
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
        qmauReportService.validateAcceptedForGlobalIdentity(runtime, qmau);
        if (!Objects.equals(qmau.getPeriod(), item.getPeriod())
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
        if (!isMaterializationComplete(item)) {
            Failure failure = item.getLastFailure();
            if (!GlobalIdentityPresenceOutboxItem.STATUS_BLOCKED.equals(
                        item.getStatus())
                    || value(item.getAttemptCount()) != 0
                    || item.getAcceptedResponse() != null
                    || item.getAcceptedAt() != null
                    || item.getNextRetryAt() != null
                    || failure == null
                    || !Boolean.FALSE.equals(failure.getRetryable())
                    || (!FAILURE_EVIDENCE_MISMATCH.equals(failure.getCode())
                            && !FAILURE_SUPERSEDED_BEFORE_PRESENCE.equals(
                                    failure.getCode())
                            && !FAILURE_CAPACITY_EXCEEDED.equals(
                                    failure.getCode()))) {
                throw new IllegalStateException(
                        "Blocked global identity materialization state is invalid.");
            }
            return;
        }
        if (GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED.equals(
                item.getStatus())) {
            SignedAttempt attempt = item.getLastAttempt();
            if (attempt == null || value(item.getAttemptCount()) <= 0) {
                throw new IllegalStateException(
                        "Accepted global identity chunk has no signed attempt.");
            }
            verifyResponse(
                    runtime,
                    item,
                    item.getAcceptedResponse());
            if (!Objects.equals(
                    item.getAcceptedAt(),
                    item.getAcceptedResponse().acceptedAt())) {
                throw new IllegalStateException(
                        "Stored global identity presence acceptance time changed.");
            }
        } else if (item.getAcceptedResponse() != null
                || item.getAcceptedAt() != null) {
            throw new IllegalStateException(
                    "Unaccepted global identity chunk contains an acceptance.");
        }
    }

    private PresenceRevision validateRevision(
            List<GlobalIdentityPresenceOutboxItem> source) {
        if (source == null || source.isEmpty()) {
            throw new IllegalStateException(
                    "Global identity presence revision is empty.");
        }
        List<GlobalIdentityPresenceOutboxItem> items = source.stream()
                .sorted(Comparator.comparingInt(item ->
                        value(item.getChunkIndex())))
                .toList();
        GlobalIdentityPresenceOutboxItem head = items.get(0);
        boolean structurallyComplete =
                items.size() == value(head.getChunkCount());
        boolean materializationComplete = true;
        boolean acceptedPrefix = true;
        boolean allAccepted = true;
        List<String> commitments = new ArrayList<>();
        for (int index = 0; index < items.size(); index++) {
            GlobalIdentityPresenceOutboxItem item = items.get(index);
            if (!Objects.equals(head.getRegistryScope(), item.getRegistryScope())
                    || !Objects.equals(
                            head.getDeploymentId(),
                            item.getDeploymentId())
                    || !Objects.equals(head.getPeriod(), item.getPeriod())
                    || !Objects.equals(head.getRevision(), item.getRevision())
                    || !Objects.equals(
                            head.getSupersedesBatchId(),
                            item.getSupersedesBatchId())
                    || !Objects.equals(
                            head.getReportedQmauCount(),
                            item.getReportedQmauCount())
                    || !Objects.equals(
                            head.getKeyVersion(),
                            item.getKeyVersion())
                    || !Objects.equals(head.getSuite(), item.getSuite())
                    || !Objects.equals(
                            head.getSubmissionId(),
                            item.getSubmissionId())
                    || !Objects.equals(
                            head.getChunkCount(),
                            item.getChunkCount())
                    || !Objects.equals(
                            head.getTotalCommitmentCount(),
                            item.getTotalCommitmentCount())
                    || !Objects.equals(
                            head.getCommitmentSetHash(),
                            item.getCommitmentSetHash())
                    || !Objects.equals(
                            head.getQmauReportId(),
                            item.getQmauReportId())
                    || !Objects.equals(
                            head.getQmauCommitmentHash(),
                            item.getQmauCommitmentHash())
                    || !Objects.equals(item.getChunkIndex(), index)) {
                structurallyComplete = false;
            }
            materializationComplete &=
                    isMaterializationComplete(item);
            boolean accepted =
                    GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED.equals(
                            item.getStatus());
            if (!accepted) {
                acceptedPrefix = false;
                allAccepted = false;
            } else if (!acceptedPrefix) {
                throw new IllegalStateException(
                        "Global identity chunks were accepted out of order.");
            }
            commitments.addAll(item.getNetworkIdentityCommitments());
        }
        if (structurallyComplete && materializationComplete) {
            if (commitments.size() != value(
                        head.getTotalCommitmentCount())
                    || !RegistryProtocol.globalIdentityPresenceSetHash(
                                commitments)
                            .equals(head.getCommitmentSetHash())) {
                throw new IllegalStateException(
                        "Global identity commitment manifest changed.");
            }
        }
        boolean finalized = structurallyComplete
                && materializationComplete
                && allAccepted
                && Boolean.TRUE.equals(items.get(items.size() - 1)
                        .getAcceptedResponse()
                        .complete());
        for (int index = 0; index < items.size(); index++) {
            GlobalIdentityPresenceBatchResponse response =
                    items.get(index).getAcceptedResponse();
            if (response != null
                    && Boolean.TRUE.equals(response.complete())
                    != (finalized && index == items.size() - 1)) {
                throw new IllegalStateException(
                        "Global identity completion receipt is misplaced.");
            }
        }
        return new PresenceRevision(
                head.getPeriod(),
                value(head.getRevision()),
                head.getSupersedesBatchId(),
                List.copyOf(items),
                structurallyComplete,
                materializationComplete,
                finalized);
    }

    static void rememberSignedRequestHash(
            GlobalIdentityPresenceOutboxItem item,
            String requestHash) {
        List<String> hashes = new ArrayList<>(signedRequestHashes(item));
        if (!hashes.contains(requestHash)) {
            if (hashes.size() >= MAX_SIGNED_REQUEST_HASHES) {
                throw new IllegalStateException(
                        "Global identity presence retry history is full.");
            }
            hashes.add(RegistryProtocol.requireHash(
                    requestHash,
                    "signed_request_hash"));
        }
        item.setSignedRequestHashes(hashes);
    }

    static int requiredChunkCount(long commitmentCount) {
        if (commitmentCount < 0L) {
            throw new IllegalArgumentException(
                    "Global identity presence commitment count cannot be negative.");
        }
        long chunkCount = commitmentCount == 0L
                ? 1L
                : 1L + (commitmentCount - 1L) / COMMITMENTS_PER_CHUNK;
        if (chunkCount > SERVER_MAX_CHUNKS_PER_SUBMISSION) {
            throw new PresenceCapacityExceededException(
                    "Global identity presence capacity exceeded: "
                            + commitmentCount
                            + " commitments require "
                            + chunkCount
                            + " chunks, but at most "
                            + MAX_COMMITMENTS_PER_SUBMISSION
                            + " commitments in "
                            + SERVER_MAX_CHUNKS_PER_SUBMISSION
                            + " chunks are supported per deployment, period,"
                            + " and revision.");
        }
        return (int) chunkCount;
    }

    static Set<String> signedRequestHashes(
            GlobalIdentityPresenceOutboxItem item) {
        List<String> persisted = item.getSignedRequestHashes();
        if (persisted.size() > MAX_SIGNED_REQUEST_HASHES) {
            throw new IllegalStateException(
                    "Global identity presence retry history is too large.");
        }
        Set<String> hashes = new HashSet<>();
        for (String requestHash : persisted) {
            if (!hashes.add(RegistryProtocol.requireHash(
                    requestHash,
                    "signed_request_hash"))) {
                throw new IllegalStateException(
                        "Global identity presence retry history contains duplicates.");
            }
        }
        SignedAttempt attempt = item.getLastAttempt();
        if (attempt != null) {
            RegistryProtocol.requireUtcTimestamp(
                    attempt.getTimestamp(),
                    "request_timestamp");
            RegistryProtocol.requireToken(
                    attempt.getNonce(),
                    "request_nonce");
            if (!StringUtils.hasText(attempt.getSignature())) {
                throw new IllegalStateException(
                        "Global identity presence signed attempt is incomplete.");
            }
            hashes.add(RegistryProtocol.sha256(
                    RegistryProtocol.signedRequest(
                            "POST",
                            RegistryProtocol
                                    .GLOBAL_IDENTITY_PRESENCE_BATCH_PATH,
                            RegistryProtocol.PROTOCOL_VERSION,
                            item.getRegistryScope(),
                            item.getDeploymentId(),
                            attempt.getTimestamp(),
                            attempt.getNonce(),
                            item.getIdempotencyKey(),
                            item.getPayloadHash())));
        }
        if (hashes.size() > MAX_SIGNED_REQUEST_HASHES) {
            throw new IllegalStateException(
                    "Global identity presence retry history is too large.");
        }
        return Set.copyOf(hashes);
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

    private static boolean retryable(RuntimeException exception) {
        if (exception instanceof RegistryHttpException http) {
            return http.getStatusCode() == 0
                    || http.getStatusCode() == 408
                    || http.getStatusCode() == 425
                    || http.getStatusCode() == 429
                    || http.getStatusCode() >= 500;
        }
        return exception instanceof DataAccessException;
    }

    private static String failureCode(RuntimeException exception) {
        if (exception instanceof RegistryHttpException http
                && http.getErrorCode() != null
                && !http.getErrorCode().isBlank()) {
            return http.getErrorCode();
        }
        if (exception instanceof DataAccessException) {
            return "GLOBAL_IDENTITY_PRESENCE_PERSISTENCE_RETRY";
        }
        if (exception instanceof IllegalStateException) {
            return "INVALID_GLOBAL_IDENTITY_PRESENCE_RECEIPT";
        }
        return "GLOBAL_IDENTITY_PRESENCE_REJECTED";
    }

    private static boolean isMaterializationComplete(
            GlobalIdentityPresenceOutboxItem item) {
        return !Boolean.FALSE.equals(item.getMaterializationComplete());
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

    private record PresenceRevision(
            String period,
            long revision,
            String previousBatchId,
            List<GlobalIdentityPresenceOutboxItem> items,
            boolean structurallyComplete,
            boolean materializationComplete,
            boolean finalized) {

        boolean skippableMaterialization() {
            return !materializationComplete
                    && items.stream().allMatch(item ->
                            value(item.getAttemptCount()) == 0)
                    && items.stream().noneMatch(item ->
                            item.getLastFailure() != null
                                    && FAILURE_SUPERSEDED_BEFORE_PRESENCE
                                            .equals(item.getLastFailure()
                                            .getCode()));
        }

        boolean started() {
            return items.stream().anyMatch(item ->
                    value(item.getAttemptCount()) > 0
                            || GlobalIdentityPresenceOutboxItem.STATUS_ACCEPTED
                                    .equals(item.getStatus()));
        }

        String batchId() {
            if (!finalized) {
                return null;
            }
            return items.get(items.size() - 1)
                    .getAcceptedResponse()
                    .batchId();
        }
    }

    private static final class PresenceCapacityExceededException
            extends IllegalStateException {

        private PresenceCapacityExceededException(String message) {
            super(message);
        }
    }
}
