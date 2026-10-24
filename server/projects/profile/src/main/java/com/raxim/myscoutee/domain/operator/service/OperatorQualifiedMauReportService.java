package com.raxim.myscoutee.domain.operator.service;
import com.raxim.myscoutee.common.security.crypto.CanonicalValues;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicBoolean;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.operator.document.QualifiedMauReportOutboxItem;
import com.raxim.myscoutee.domain.operator.document.QualifiedMauReportOutboxItem.Failure;
import com.raxim.myscoutee.domain.operator.document.QualifiedMauReportOutboxItem.SignedAttempt;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.OperatorMeasurementReportDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.OperatorMeasurementReportPageDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.OperatorMeasurementSyncDto;
import com.raxim.myscoutee.domain.operator.repository.MongoQualifiedMauEvidenceRepository;
import com.raxim.myscoutee.domain.operator.repository.QualifiedMauReportOutboxRepository;
import com.raxim.myscoutee.domain.operator.service.OperatorQualifiedMauCalculator.QualifiedMauSnapshot;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import com.raxim.myscoutee.domain.operator.service.OperatorRevenueRegistryRuntimeResolver.Resolution;
import com.raxim.myscoutee.domain.registry.api.RegistryHttpException;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchRequest;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.BatchResponse;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.MauReceipt;

import tools.jackson.databind.ObjectMapper;

/**
 * Materializes six immutable completed monthly QMAU snapshots, then delivers
 * them through a durable signed outbox with idempotent retries.
 */
@Service
public class OperatorQualifiedMauReportService implements com.raxim.myscoutee.domain.operator.api.MeasurementReports {
    private static final Logger LOGGER =
            LoggerFactory.getLogger(OperatorQualifiedMauReportService.class);
    private static final int COMPLETED_PERIOD_COUNT = 6;
    private static final int MAX_CORRECTION_ROUNDS = 2;
    private static final int MAX_DELIVERIES_PER_ROUND = 16;
    private static final Duration MAX_RETRY_DELAY = Duration.ofHours(24);

    private final OperatorRevenueRegistryRuntimeResolver runtimeResolver;
    private final OperatorQualifiedMauCalculator calculator;
    private final QualifiedMauReportOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final SecureRandom secureRandom;
    private final AtomicBoolean synchronizationRunning = new AtomicBoolean();

    @Autowired
    public OperatorQualifiedMauReportService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            OperatorQualifiedMauCalculator calculator,
            QualifiedMauReportOutboxRepository outboxRepository,
            ObjectMapper objectMapper) {
        this(
                runtimeResolver,
                calculator,
                outboxRepository,
                objectMapper,
                Clock.systemUTC(),
                new SecureRandom());
    }

    OperatorQualifiedMauReportService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            OperatorQualifiedMauCalculator calculator,
            QualifiedMauReportOutboxRepository outboxRepository,
            ObjectMapper objectMapper,
            Clock clock,
            SecureRandom secureRandom) {
        this.runtimeResolver = Objects.requireNonNull(runtimeResolver);
        this.calculator = Objects.requireNonNull(calculator);
        this.outboxRepository = Objects.requireNonNull(outboxRepository);
        this.objectMapper = Objects.requireNonNull(objectMapper);
        this.clock = Objects.requireNonNull(clock);
        this.secureRandom = Objects.requireNonNull(secureRandom);
    }

    /**
     * Explicit operator recovery hook. It never selects a registry or creates
     * a node identity.
     */
    public OperatorMeasurementSyncDto synchronizeNow() {
        return synchronize(
                MongoSessionModeContext.currentMode(),
                true);
    }

    public OperatorMeasurementReportPageDto reports(
            String status,
            int page,
            int size) {
        RegisteredRuntime runtime = requireOperatorRuntime(
                MongoSessionModeContext.currentMode());
        int normalizedPage = requirePage(page);
        int normalizedSize = requirePageSize(size);
        String normalizedStatus = requireReportStatus(status);
        PageRequest request = PageRequest.of(
                normalizedPage,
                normalizedSize,
                Sort.by(
                        Sort.Order.desc("period"),
                        Sort.Order.desc("revision"),
                        Sort.Order.desc("_id")));
        var result = normalizedStatus == null
                ? outboxRepository.findByDeploymentId(
                        runtime.state().deploymentId(),
                        request)
                : outboxRepository.findByDeploymentIdAndStatus(
                        runtime.state().deploymentId(),
                        normalizedStatus,
                        request);
        return new OperatorMeasurementReportPageDto(
                result.getContent().stream().map(this::toReportDto).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages());
    }

    /**
     * Moves one blocked immutable snapshot back to the normal retry queue.
     * This request deliberately performs no registry network I/O.
     */
    public OperatorMeasurementReportDto requeue(String reportId) {
        RegisteredRuntime runtime = requireOperatorRuntime(
                MongoSessionModeContext.currentMode());
        String normalizedId = safeText(reportId);
        if (!normalizedId.matches("[0-9a-f]{24}")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Measurement report id is invalid.");
        }
        QualifiedMauReportOutboxItem item = outboxRepository
                .findByIdAndDeploymentId(
                        normalizedId,
                        runtime.state().deploymentId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Measurement report was not found."));
        if (!QualifiedMauReportOutboxItem.STATUS_BLOCKED.equals(
                item.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only a blocked measurement report can be requeued.");
        }
        try {
            validateStoredItem(runtime, item);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "The blocked measurement report failed its integrity check.",
                    exception);
        }
        item.setStatus(QualifiedMauReportOutboxItem.STATUS_PENDING);
        item.setNextRetryAt(null);
        item.setUpdatedAt(clock.instant().toString());
        return OperatorReportDelivery.save(() -> toReportDto(outboxRepository.save(item)),
                "Measurement report changed concurrently; reload it and retry.");
    }

    @Scheduled(
            fixedDelayString =
                    "${operator.measurement.reporter-delay-ms:3600000}",
            initialDelayString =
                    "${operator.measurement.reporter-initial-delay-ms:90000}")
    public void synchronizeScheduled() {
        OperatorReportDelivery.synchronizeScheduled(() -> synchronize(MongoSessionMode.REAL, false),
                OperatorMeasurementSyncDto::state, OperatorMeasurementSyncDto::code, LOGGER, "QMAU");
    }

    private OperatorMeasurementSyncDto synchronize(
            MongoSessionMode requestedMode,
            boolean forceDelivery) {
        MongoSessionMode mode = requestedMode == null
                ? MongoSessionMode.REAL
                : requestedMode;
        Instant startedAt = clock.instant();
        if (!synchronizationRunning.compareAndSet(false, true)) {
            return status(
                    "BUSY",
                    "SYNCHRONIZATION_RUNNING",
                    "Measurement synchronization is already running.",
                    0,
                    0,
                    0,
                    0L,
                    0L,
                    startedAt);
        }
        try {
            /*
             * This gate stays first: an unregistered/disabled deployment does
             * not read activity, touch the outbox, load keys, or call HTTP.
             */
            Resolution resolution = runtimeResolver.resolveMau(mode);
            if (!resolution.isReady()) {
                return status(
                        resolution.state(),
                        resolution.code(),
                        resolution.message(),
                        0,
                        0,
                        0,
                        0L,
                        0L,
                        clock.instant());
            }

            RegisteredRuntime runtime = resolution.runtime();
            int materialized = 0;
            int submitted = 0;
            int accepted = 0;
            boolean deliveryFailed = false;
            for (int round = 0; round < MAX_CORRECTION_ROUNDS; round++) {
                materialized += materialize(runtime, clock.instant());
                DeliveryResult delivery = deliverPending(
                        runtime,
                        forceDelivery);
                submitted += delivery.submitted();
                accepted += delivery.accepted();
                deliveryFailed |= delivery.failed();
                if (delivery.accepted() == 0) {
                    break;
                }
            }

            long pending = outboxRepository.countByDeploymentIdAndStatus(
                    runtime.state().deploymentId(),
                    QualifiedMauReportOutboxItem.STATUS_PENDING);
            long blocked = outboxRepository.countByDeploymentIdAndStatus(
                    runtime.state().deploymentId(),
                    QualifiedMauReportOutboxItem.STATUS_BLOCKED);
            if (blocked > 0) {
                return status(
                        "BLOCKED",
                        "MEASUREMENT_REPORT_BLOCKED",
                        "A completed-period measurement requires operator review.",
                        materialized,
                        submitted,
                        accepted,
                        pending,
                        blocked,
                        clock.instant());
            }
            if (deliveryFailed) {
                return status(
                        "ERROR",
                        "MEASUREMENT_DELIVERY_RETRY_SCHEDULED",
                        "The registry could not be reached; durable retry is scheduled.",
                        materialized,
                        submitted,
                        accepted,
                        pending,
                        blocked,
                        clock.instant());
            }
            return status(
                    "READY",
                    "SYNCHRONIZED",
                    "Completed-period measurements are synchronized.",
                    materialized,
                    submitted,
                    accepted,
                    pending,
                    blocked,
                    clock.instant());
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "QMAU synchronization failed before completion.",
                    exception);
            return status(
                    "ERROR",
                    "MEASUREMENT_SYNCHRONIZATION_FAILED",
                    "operator.measurements.error.synchronize",
                    0,
                    0,
                    0,
                    0L,
                    0L,
                    clock.instant());
        } finally {
            synchronizationRunning.set(false);
        }
    }

    private int materialize(RegisteredRuntime runtime, Instant now) {
        List<QualifiedMauReportOutboxItem> existing = outboxRepository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId());
        Map<String, List<QualifiedMauReportOutboxItem>> byPeriod =
                new LinkedHashMap<>();
        for (QualifiedMauReportOutboxItem item : existing) {
            validateStoredItem(runtime, item);
            byPeriod.computeIfAbsent(item.getPeriod(), ignored ->
                    new ArrayList<>()).add(item);
        }

        YearMonth latestCompleted = YearMonth.from(
                now.atZone(ZoneOffset.UTC)).minusMonths(1);
        int inserted = 0;
        for (int offset = COMPLETED_PERIOD_COUNT - 1; offset >= 0; offset--) {
            YearMonth period = latestCompleted.minusMonths(offset);
            QualifiedMauSnapshot snapshot = calculator.calculate(period);
            List<QualifiedMauReportOutboxItem> periodItems =
                    byPeriod.getOrDefault(period.toString(), List.of());
            QualifiedMauReportOutboxItem latest = periodItems.stream()
                    .max(Comparator.comparingLong(
                            item -> value(item.getRevision())))
                    .orElse(null);
            if (sameSnapshot(latest, snapshot)) {
                continue;
            }
            if (latest != null
                    && !QualifiedMauReportOutboxItem.STATUS_ACCEPTED.equals(
                            latest.getStatus())) {
                /*
                 * A later immutable correction cannot name its superseded
                 * batch until the current revision has a verified receipt.
                 */
                continue;
            }
            QualifiedMauReportOutboxItem created = newItem(
                    runtime,
                    snapshot,
                    latest,
                    now);
            try {
                created = outboxRepository.save(created);
                byPeriod.computeIfAbsent(period.toString(), ignored ->
                        new ArrayList<>()).add(created);
                inserted++;
            } catch (DataIntegrityViolationException exception) {
                /*
                 * Another scheduler/request won the unique period/revision
                 * insert. The immutable row will be picked up next round.
                 */
                LOGGER.debug(
                        "QMAU snapshot already materialized for {} revision {}.",
                        created.getPeriod(),
                        created.getRevision());
            }
        }
        return inserted;
    }

    private QualifiedMauReportOutboxItem newItem(
            RegisteredRuntime runtime,
            QualifiedMauSnapshot snapshot,
            QualifiedMauReportOutboxItem previous,
            Instant now) {
        long revision = previous == null
                ? 1L
                : value(previous.getRevision()) + 1L;
        String supersedes = previous == null
                ? null
                : previous.getAcceptedResponse().batchId();
        String payloadHash = CanonicalValues.sha256(
                RegistryProtocol.qmauBatchPayload(
                        RegistryProtocol.QMAU_KIND,
                        snapshot.period(),
                        RegistryProtocol.QMAU_RULESET_VERSION,
                        snapshot.qualifiedMauCount(),
                        snapshot.evidenceCommitmentHash(),
                        revision,
                        supersedes));

        QualifiedMauReportOutboxItem item =
                new QualifiedMauReportOutboxItem();
        item.setId(new ObjectId().toHexString());
        item.setSchemaVersion(QualifiedMauReportOutboxItem.SCHEMA_VERSION);
        item.setRegistryScope(runtime.state().registryScope());
        item.setDeploymentId(runtime.state().deploymentId());
        item.setPeriod(snapshot.period());
        item.setWindowStart(snapshot.windowStart());
        item.setWindowEnd(snapshot.windowEnd());
        item.setRevision(revision);
        item.setSupersedesBatchId(supersedes);
        item.setKind(RegistryProtocol.QMAU_KIND);
        item.setRulesetVersion(RegistryProtocol.QMAU_RULESET_VERSION);
        item.setQualifiedMauCount(snapshot.qualifiedMauCount());
        item.setActionCount(snapshot.actionCount());
        item.setActionCounts(snapshot.actionCounts());
        item.setCommitmentHash(snapshot.evidenceCommitmentHash());
        item.setPayloadHash(payloadHash);
        item.setIdempotencyKey(RegistryProtocol.randomToken(
                "qmau_",
                secureRandom));
        item.setStatus(QualifiedMauReportOutboxItem.STATUS_PENDING);
        item.setAttemptCount(0);
        item.setCreatedAt(now.toString());
        item.setUpdatedAt(now.toString());
        validateStoredItem(runtime, item);
        return item;
    }

    private DeliveryResult deliverPending(
            RegisteredRuntime runtime,
            boolean forceDelivery) {
        List<QualifiedMauReportOutboxItem> candidates = outboxRepository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId())
                .stream()
                .filter(Objects::nonNull)
                .filter(item -> QualifiedMauReportOutboxItem.STATUS_PENDING
                        .equals(item.getStatus()))
                .filter(item -> forceDelivery
                        || retryDue(item, clock.instant()))
                .limit(MAX_DELIVERIES_PER_ROUND)
                .toList();
        int submitted = 0;
        int accepted = 0;
        boolean failed = false;
        for (QualifiedMauReportOutboxItem item : candidates) {
            submitted++;
            try {
                deliver(runtime, item);
                accepted++;
            } catch (RuntimeException exception) {
                failed = true;
                recordFailure(runtime, item, exception);
            }
        }
        return new DeliveryResult(submitted, accepted, failed);
    }

    private void deliver(
            RegisteredRuntime runtime,
            QualifiedMauReportOutboxItem item) {
        validateStoredItem(runtime, item);
        Instant attemptAt = clock.instant();
        String timestamp = attemptAt.toString();
        String nonce = RegistryProtocol.randomToken(
                "nonce_",
                secureRandom);
        String signature = runtime.deploymentCrypto().signBase64(
                RegistryProtocol.signedRequest(
                        "POST",
                        RegistryProtocol.MAU_BATCH_PATH,
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
                item.getPayloadHash(),
                signature));
        item.setUpdatedAt(attemptAt.toString());
        item = outboxRepository.save(item);

        BatchRequest request = new BatchRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                item.getRegistryScope(),
                item.getDeploymentId(),
                timestamp,
                nonce,
                item.getIdempotencyKey(),
                item.getKind(),
                item.getPeriod(),
                item.getRulesetVersion(),
                item.getQualifiedMauCount(),
                item.getCommitmentHash(),
                item.getRevision(),
                item.getSupersedesBatchId(),
                item.getPayloadHash(),
                signature);
        BatchResponse response = runtimeResolver.transport(runtime).submitMauBatch(request);
        verifyResponse(runtime, item, response);

        item.setAcceptedResponse(response);
        item.setAcceptedAt(response.receipt().acceptedAt());
        item.setStatus(QualifiedMauReportOutboxItem.STATUS_ACCEPTED);
        item.setNextRetryAt(null);
        item.setLastFailure(null);
        item.setUpdatedAt(clock.instant().toString());
        outboxRepository.save(item);
    }

    private void verifyResponse(
            RegisteredRuntime runtime,
            QualifiedMauReportOutboxItem item,
            BatchResponse response) {
        if (response == null || response.receipt() == null
                || !RegistryProtocol.PROTOCOL_VERSION.equals(
                        response.protocolVersion())
                || !item.getRegistryScope().equals(
                        response.registryScope())
                || !item.getDeploymentId().equals(
                        response.deploymentId())
                || !item.getIdempotencyKey().equals(
                        response.idempotencyKey())
                || response.duplicate() == null) {
            throw new IllegalStateException(
                    "Registry QMAU response does not match the signed request.");
        }
        RegistryProtocol.requireBatchId(response.batchId());
        MauReceipt receipt = response.receipt();
        if (!item.getRegistryScope().equals(receipt.registryScope())
                || !item.getKind().equals(receipt.kind())
                || !item.getPeriod().equals(receipt.period())
                || !item.getRulesetVersion().equals(
                        receipt.rulesetVersion())
                || !Objects.equals(
                        item.getQualifiedMauCount(),
                        receipt.qualifiedMauCount())
                || !item.getCommitmentHash().equals(
                        receipt.commitmentHash())
                || !Objects.equals(item.getRevision(), receipt.revision())
                || !Objects.equals(
                        empty(item.getSupersedesBatchId()),
                        empty(receipt.supersedesBatchId()))
                || receipt.ledgerIndex() == null
                || receipt.ledgerIndex() <= 0L
                || !runtime.registryKeyId().equals(
                        receipt.registryKeyId())
                || !runtime.registryPublicKeyBase64().equals(
                        receipt.registryPublicKey())) {
            throw new IllegalStateException(
                    "Registry QMAU receipt changed the immutable snapshot.");
        }
        CanonicalValues.requireHash(receipt.batchHash(), "batch_hash");
        CanonicalValues.requireHash(receipt.entryHash(), "entry_hash");
        CanonicalValues.requireHash(
                receipt.previousEntryHash(),
                "previous_entry_hash");
        CanonicalValues.requireHash(
                receipt.commitmentHash(),
                "commitment_hash");
        RegistryProtocol.requirePeriod(receipt.period());
        Instant acceptedAt = CanonicalValues.requireUtcTimestamp(
                receipt.acceptedAt(),
                "accepted_at");
        RegistryProtocol.requireCheckpointDate(receipt.checkpointDate());
        String expectedEntryHash = CanonicalValues.sha256(
                RegistryProtocol.ledgerEntry(
                        RegistryProtocol.PROTOCOL_VERSION,
                        item.getRegistryScope(),
                        receipt.ledgerIndex(),
                        RegistryProtocol.QMAU_ENTRY_TYPE,
                        item.getDeploymentId(),
                        response.batchId(),
                        item.getKind(),
                        item.getPeriod(),
                        item.getRulesetVersion(),
                        item.getQualifiedMauCount(),
                        item.getPayloadHash(),
                        receipt.previousEntryHash(),
                        receipt.acceptedAt()));
        if (!RegistryProtocol.hashEquals(
                    item.getPayloadHash(),
                    receipt.batchHash())
                || !RegistryProtocol.hashEquals(
                        expectedEntryHash,
                        receipt.entryHash())
                || !RegistryProtocol.checkpointDateAt(acceptedAt).equals(
                        receipt.checkpointDate())
                || !com.raxim.myscoutee.common.security.crypto.Ed25519Signatures.verifyBase64(
                        runtime.registryPublicKey(),
                        RegistryProtocol.qmauReceipt(response),
                        receipt.signature())) {
            throw new IllegalStateException(
                    "Registry QMAU receipt signature or ledger entry is invalid.");
        }
    }

    private void recordFailure(
            RegisteredRuntime runtime,
            QualifiedMauReportOutboxItem item,
            RuntimeException exception) {
        if (item == null) {
            throw exception;
        }
        QualifiedMauReportOutboxItem stored = outboxRepository
                .findByIdAndDeploymentId(
                        item.getId(),
                        runtime.state().deploymentId())
                .orElse(item);
        boolean retryable = retryable(exception);
        String now = clock.instant().toString();
        stored.setLastFailure(new Failure(
                failureCode(exception),
                safeMessage(exception),
                now,
                retryable));
        stored.setUpdatedAt(now);
        if (retryable) {
            stored.setStatus(QualifiedMauReportOutboxItem.STATUS_PENDING);
            stored.setNextRetryAt(clock.instant()
                    .plus(retryDelay(
                            runtime,
                            value(stored.getAttemptCount())))
                    .toString());
        } else {
            stored.setStatus(QualifiedMauReportOutboxItem.STATUS_BLOCKED);
            stored.setNextRetryAt(null);
        }
        outboxRepository.save(stored);
    }

    private void validateStoredItem(
            RegisteredRuntime runtime,
            QualifiedMauReportOutboxItem item) {
        if (item == null
                || !Objects.equals(
                        item.getSchemaVersion(),
                        QualifiedMauReportOutboxItem.SCHEMA_VERSION)
                || !runtime.state().registryScope().equals(
                        item.getRegistryScope())
                || !runtime.state().deploymentId().equals(
                        item.getDeploymentId())
                || !RegistryProtocol.QMAU_KIND.equals(item.getKind())
                || !RegistryProtocol.QMAU_RULESET_VERSION.equals(
                        item.getRulesetVersion())
                || item.getQualifiedMauCount() == null
                || item.getQualifiedMauCount() < 0L
                || item.getActionCount() == null
                || item.getActionCount() < 0L
                || item.getRevision() == null
                || item.getRevision() <= 0L
                || !StringUtils.hasText(item.getIdempotencyKey())
                || !List.of(
                        QualifiedMauReportOutboxItem.STATUS_PENDING,
                        QualifiedMauReportOutboxItem.STATUS_ACCEPTED,
                        QualifiedMauReportOutboxItem.STATUS_BLOCKED)
                        .contains(item.getStatus())) {
            throw new IllegalStateException(
                    "Stored QMAU report metadata is invalid.");
        }
        validateActionCounts(item);
        RegistryProtocol.requirePeriod(item.getPeriod());
        CanonicalValues.requireUtcTimestamp(
                item.getWindowStart(),
                "window_start");
        CanonicalValues.requireUtcTimestamp(
                item.getWindowEnd(),
                "window_end");
        CanonicalValues.requireHash(
                item.getCommitmentHash(),
                "commitment_hash");
        CanonicalValues.requireHash(item.getPayloadHash(), "payload_hash");
        if (item.getRevision() == 1L) {
            if (StringUtils.hasText(item.getSupersedesBatchId())) {
                throw new IllegalStateException(
                        "Initial QMAU revision must not supersede a batch.");
            }
        } else {
            RegistryProtocol.requireBatchId(item.getSupersedesBatchId());
        }
        String expectedPayloadHash = CanonicalValues.sha256(
                RegistryProtocol.qmauBatchPayload(
                        item.getKind(),
                        item.getPeriod(),
                        item.getRulesetVersion(),
                        item.getQualifiedMauCount(),
                        item.getCommitmentHash(),
                        item.getRevision(),
                        item.getSupersedesBatchId()));
        if (!RegistryProtocol.hashEquals(
                    expectedPayloadHash,
                    item.getPayloadHash())) {
            throw new IllegalStateException(
                    "Stored QMAU payload hash is invalid.");
        }
        if (QualifiedMauReportOutboxItem.STATUS_ACCEPTED.equals(
                    item.getStatus())) {
            if (item.getAcceptedResponse() == null
                    || item.getAcceptedResponse().receipt() == null) {
                throw new IllegalStateException(
                        "Accepted QMAU report is missing its receipt.");
            }
            verifyResponse(runtime, item, item.getAcceptedResponse());
        }
    }

    void validateAcceptedForGlobalIdentity(
            RegisteredRuntime runtime,
            QualifiedMauReportOutboxItem item) {
        validateStoredItem(runtime, item);
        if (!QualifiedMauReportOutboxItem.STATUS_ACCEPTED.equals(
                item.getStatus())) {
            throw new IllegalStateException(
                    "Global identity presence requires an accepted QMAU revision.");
        }
    }

    private RegisteredRuntime requireOperatorRuntime(
            MongoSessionMode requestedMode) {
        MongoSessionMode mode = requestedMode == null
                ? MongoSessionMode.REAL
                : requestedMode;
        Resolution resolution = runtimeResolver.resolveMau(mode);
        if (!resolution.isReady()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    safeText(resolution.message()));
        }
        return resolution.runtime();
    }

    private boolean sameSnapshot(
            QualifiedMauReportOutboxItem item,
            QualifiedMauSnapshot snapshot) {
        return item != null
                && Objects.equals(
                        item.getQualifiedMauCount(),
                        snapshot.qualifiedMauCount())
                && Objects.equals(
                        item.getActionCount(),
                        snapshot.actionCount())
                && Objects.equals(
                        item.getCommitmentHash(),
                        snapshot.evidenceCommitmentHash())
                && Objects.equals(
                        item.getWindowStart(),
                        snapshot.windowStart())
                && Objects.equals(
                        item.getWindowEnd(),
                        snapshot.windowEnd());
    }

    private OperatorMeasurementReportDto toReportDto(
            QualifiedMauReportOutboxItem item) {
        Failure failure = item.getLastFailure();
        BatchResponse accepted = item.getAcceptedResponse();
        return new OperatorMeasurementReportDto(
                item.getId(),
                item.getPeriod(),
                item.getWindowStart(),
                item.getWindowEnd(),
                value(item.getRevision()),
                item.getRulesetVersion(),
                value(item.getQualifiedMauCount()),
                value(item.getActionCount()),
                item.getStatus(),
                value(item.getAttemptCount()),
                item.getNextRetryAt(),
                failure == null ? null : failure.getCode(),
                failure == null ? null : failure.getMessage(),
                accepted == null ? null : accepted.batchId(),
                item.getAcceptedAt(),
                item.getCreatedAt(),
                item.getUpdatedAt());
    }

    private OperatorMeasurementSyncDto status(
            String state,
            String code,
            String message,
            int materialized,
            int submitted,
            int accepted,
            long pending,
            long blocked,
            Instant at) {
        return new OperatorMeasurementSyncDto(
                state,
                code,
                message,
                materialized,
                submitted,
                accepted,
                pending,
                blocked,
                at.toString());
    }

    private Duration retryDelay(RegisteredRuntime runtime, int attempts) {
        Duration base = runtime.properties().getRetryDelay();
        if (base == null || base.isZero() || base.isNegative()) {
            base = Duration.ofMinutes(1);
        }
        long multiplier = 1L << Math.min(Math.max(attempts - 1, 0), 10);
        try {
            Duration calculated = base.multipliedBy(multiplier);
            return calculated.compareTo(MAX_RETRY_DELAY) > 0
                    ? MAX_RETRY_DELAY
                    : calculated;
        } catch (ArithmeticException exception) {
            return MAX_RETRY_DELAY;
        }
    }

    private boolean retryDue(
            QualifiedMauReportOutboxItem item,
            Instant now) {
        return OperatorReportDelivery.retryDue(item.getNextRetryAt(), now);
    }

    private static boolean retryable(RuntimeException exception) {
        return OperatorReportDelivery.retryable(exception);
    }

    private static String failureCode(RuntimeException exception) {
        return OperatorReportDelivery.failureCode(exception, "MEASUREMENT_PERSISTENCE_RETRY", "INVALID_QMAU_RECEIPT", "MEASUREMENT_REJECTED");
    }

    private static void validateActionCounts(
            QualifiedMauReportOutboxItem item) {
        Map<String, Long> actionCounts = item.getActionCounts();
        if (actionCounts == null) {
            throw new IllegalStateException(
                    "Stored QMAU action diagnostics are missing.");
        }
        var supported = java.util.Set.of(
                MongoQualifiedMauEvidenceRepository.ACTION_RATE,
                MongoQualifiedMauEvidenceRepository.ACTION_JOIN,
                MongoQualifiedMauEvidenceRepository.ACTION_MESSAGE,
                MongoQualifiedMauEvidenceRepository.ACTION_HOST,
                MongoQualifiedMauEvidenceRepository.ACTION_BOOK,
                MongoQualifiedMauEvidenceRepository
                        .ACTION_VERIFIED_ATTENDANCE);
        long total = 0L;
        try {
            for (Map.Entry<String, Long> entry :
                    actionCounts.entrySet()) {
                if (!supported.contains(entry.getKey())
                        || entry.getValue() == null
                        || entry.getValue() <= 0L) {
                    throw new IllegalStateException(
                            "Stored QMAU action diagnostics are invalid.");
                }
                total = Math.addExact(total, entry.getValue());
            }
        } catch (ArithmeticException exception) {
            throw new IllegalStateException(
                    "Stored QMAU action diagnostics overflow.",
                    exception);
        }
        if (total != value(item.getActionCount())) {
            throw new IllegalStateException(
                    "Stored QMAU action diagnostics do not match the action total.");
        }
    }

    private static int requirePage(int page) {
        if (page < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Measurement report page must not be negative.");
        }
        return page;
    }

    private static int requirePageSize(int size) {
        if (size < 1 || size > 100) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Measurement report page size must be between 1 and 100.");
        }
        return size;
    }

    private static String requireReportStatus(String status) {
        String normalized = safeText(status).toUpperCase(
                java.util.Locale.ROOT);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        if (!List.of(
                QualifiedMauReportOutboxItem.STATUS_PENDING,
                QualifiedMauReportOutboxItem.STATUS_ACCEPTED,
                QualifiedMauReportOutboxItem.STATUS_BLOCKED)
                .contains(normalized)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Measurement report status is invalid.");
        }
        return normalized;
    }

    private static String safeMessage(RuntimeException exception) {
        String value = exception == null ? "" : exception.getMessage();
        return StringUtils.hasText(value)
                ? value.trim()
                : "Measurement synchronization failed.";
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private static String empty(String value) {
        return value == null ? "" : value;
    }

    private static int value(Integer value) {
        return value == null ? 0 : value;
    }

    private static long value(Long value) {
        return value == null ? 0L : value;
    }

    private record DeliveryResult(
            int submitted,
            int accepted,
            boolean failed) {
    }
}
