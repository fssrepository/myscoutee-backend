package com.raxim.myscoutee.profile.service.operator;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.RevenueReportOutboxItem;
import com.raxim.myscoutee.profile.data.document.RevenueReportOutboxItem.Failure;
import com.raxim.myscoutee.profile.data.document.RevenueReportOutboxItem.SignedAttempt;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRevenueDtos.OperatorRevenueSyncDto;
import com.raxim.myscoutee.profile.repository.RevenueReportOutboxRepository;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.RegisteredRuntime;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueRegistryRuntimeResolver.Resolution;
import com.raxim.myscoutee.registry.RegistryCrypto;
import com.raxim.myscoutee.registry.RegistryHttpClient;
import com.raxim.myscoutee.registry.RegistryHttpClient.RegistryHttpException;
import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.RevenueBatchRequest;
import com.raxim.myscoutee.registry.RegistryProtocol.RevenueBatchResponse;
import com.raxim.myscoutee.registry.RegistryProtocol.RevenueCurrencyRow;
import com.raxim.myscoutee.registry.RegistryProtocol.RevenueReceipt;

import tools.jackson.databind.ObjectMapper;

@Service
public class OperatorRevenueReportService {
    private static final Logger LOGGER =
            LoggerFactory.getLogger(OperatorRevenueReportService.class);
    private static final int MAX_CORRECTION_ROUNDS = 2;
    private static final Duration MAX_RETRY_DELAY = Duration.ofHours(24);

    private final OperatorRevenueRegistryRuntimeResolver runtimeResolver;
    private final OperatorRevenueService revenueService;
    private final RevenueReportOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final SecureRandom secureRandom;
    private final AtomicBoolean synchronizationRunning = new AtomicBoolean();

    @Autowired
    public OperatorRevenueReportService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            OperatorRevenueService revenueService,
            RevenueReportOutboxRepository outboxRepository,
            ObjectMapper objectMapper) {
        this(
                runtimeResolver,
                revenueService,
                outboxRepository,
                objectMapper,
                Clock.systemUTC(),
                new SecureRandom());
    }

    OperatorRevenueReportService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            OperatorRevenueService revenueService,
            RevenueReportOutboxRepository outboxRepository,
            ObjectMapper objectMapper,
            Clock clock,
            SecureRandom secureRandom) {
        this.runtimeResolver = Objects.requireNonNull(runtimeResolver);
        this.revenueService = Objects.requireNonNull(revenueService);
        this.outboxRepository = Objects.requireNonNull(outboxRepository);
        this.objectMapper = Objects.requireNonNull(objectMapper);
        this.clock = Objects.requireNonNull(clock);
        this.secureRandom = Objects.requireNonNull(secureRandom);
    }

    /**
     * Explicit operator recovery hook. It reuses the durable outbox and never
     * initializes identity or selects/registers a registry.
     */
    public OperatorRevenueSyncDto synchronizeNow() {
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.REAL) {
            return status(
                    "DORMANT",
                    "EXPLORE_MODE",
                    "Explore mode never sends deployment revenue.",
                    0,
                    0,
                    0,
                    0L,
                    0L,
                    clock.instant());
        }
        return synchronize(true);
    }

    @Scheduled(
            fixedDelayString =
                    "${operator.revenue.reporter-delay-ms:3600000}",
            initialDelayString =
                    "${operator.revenue.reporter-initial-delay-ms:60000}")
    public void synchronizeScheduled() {
        MongoSessionMode previous = MongoSessionModeContext.currentMode();
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        try {
            OperatorRevenueSyncDto result = synchronize(false);
            if ("BLOCKED".equals(result.state())
                    || "ERROR".equals(result.state())) {
                LOGGER.warn(
                        "Scheduled revenue reporting is {} ({}).",
                        result.state(),
                        safeText(result.code()));
            }
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Scheduled revenue reporting failed; its durable outbox will be retried.",
                    exception);
        } finally {
            MongoSessionModeContext.set(previous);
        }
    }

    private OperatorRevenueSyncDto synchronize(boolean forceDelivery) {
        Instant startedAt = clock.instant();
        if (!synchronizationRunning.compareAndSet(false, true)) {
            return status(
                    "BUSY",
                    "SYNCHRONIZATION_RUNNING",
                    "Revenue synchronization is already running.",
                    0,
                    0,
                    0,
                    0L,
                    0L,
                    startedAt);
        }
        try {
            /*
             * This resolution must remain first. A dormant deployment does not
             * read payments/outbox, write Mongo, load keys/state, or call HTTP.
             */
            Resolution resolution = runtimeResolver.resolveReal();
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
            for (int round = 0; round < MAX_CORRECTION_ROUNDS; round++) {
                int newRows = materialize(runtime, clock.instant());
                materialized += newRows;
                DeliveryResult delivery = deliverPending(
                        runtime,
                        forceDelivery,
                        clock.instant());
                submitted += delivery.submitted();
                accepted += delivery.accepted();
                if (delivery.accepted() == 0) {
                    break;
                }
            }

            long pending = outboxRepository.countByDeploymentIdAndStatus(
                    runtime.state().deploymentId(),
                    RevenueReportOutboxItem.STATUS_PENDING);
            long blocked = outboxRepository.countByDeploymentIdAndStatus(
                    runtime.state().deploymentId(),
                    RevenueReportOutboxItem.STATUS_BLOCKED);
            String state = blocked > 0L
                    ? "BLOCKED"
                    : pending > 0L ? "PENDING" : "SYNCHRONIZED";
            String code = blocked > 0L
                    ? "REVENUE_OUTBOX_BLOCKED"
                    : pending > 0L ? "REVENUE_DELIVERY_PENDING" : null;
            String message = blocked > 0L
                    ? "A revenue report requires operator review."
                    : pending > 0L
                            ? "Revenue reports are stored and will be retried."
                            : "Revenue reports are synchronized.";
            return status(
                    state,
                    code,
                    message,
                    materialized,
                    submitted,
                    accepted,
                    pending,
                    blocked,
                    clock.instant());
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Revenue synchronization failed before completion.",
                    exception);
            return status(
                    "ERROR",
                    "REVENUE_SYNCHRONIZATION_FAILED",
                    "Revenue synchronization failed; durable reports remain available for retry.",
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
        String deploymentId = runtime.state().deploymentId();
        List<RevenueReportOutboxItem> existing =
                outboxRepository.findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        deploymentId);
        Map<LocalDate, RevenueReportOutboxItem> latestByPeriod =
                latestByPeriod(existing);
        LocalDate currentDay = now.atZone(ZoneOffset.UTC).toLocalDate();
        Set<LocalDate> reportPeriods =
                new LinkedHashSet<>(latestByPeriod.keySet());
        reportPeriods.add(currentDay.minusDays(1L));

        int materialized = 0;
        for (OperatorRevenueService.DailyRevenueSnapshot daily
                : revenueService.dailyRevenueHistory(reportPeriods)) {
            if (!daily.period().isBefore(currentDay)) {
                continue;
            }
            List<RevenueCurrencyRow> currencies = protocolRows(daily);
            String aggregateHash = aggregateHash(daily.period(), currencies);
            RevenueReportOutboxItem latest =
                    latestByPeriod.get(daily.period());
            if (latest != null
                    && aggregateHash.equals(latest.getAggregateHash())) {
                continue;
            }
            if (latest != null
                    && !RevenueReportOutboxItem.STATUS_ACCEPTED.equals(
                            latest.getStatus())) {
                /*
                 * Never rewrite an in-flight revision. Once it is accepted,
                 * the next round creates a signed superseding correction.
                 */
                continue;
            }
            RevenueReportOutboxItem next = newOutboxItem(
                    runtime,
                    daily.period(),
                    currencies,
                    aggregateHash,
                    latest,
                    now);
            try {
                RevenueReportOutboxItem saved =
                        outboxRepository.save(next);
                latestByPeriod.put(daily.period(), saved);
                materialized++;
            } catch (DataIntegrityViolationException exception) {
                // Another process materialized the same logical revision.
                LOGGER.debug(
                        "Revenue report {} revision {} already exists.",
                        daily.period(),
                        next.getRevision());
            }
        }
        return materialized;
    }

    private DeliveryResult deliverPending(
            RegisteredRuntime runtime,
            boolean forceDelivery,
            Instant now) {
        RegistryHttpClient httpClient =
                new RegistryHttpClient(runtime.properties(), objectMapper);
        List<RevenueReportOutboxItem> pending = outboxRepository
                .findByDeploymentIdOrderByPeriodAscRevisionAsc(
                        runtime.state().deploymentId())
                .stream()
                .filter(item -> RevenueReportOutboxItem.STATUS_PENDING.equals(
                        item.getStatus()))
                .filter(item -> forceDelivery || isDue(item, now))
                .sorted(Comparator
                        .comparing(RevenueReportOutboxItem::getPeriod)
                        .thenComparingLong(item -> valueOrZero(
                                item.getRevision())))
                .toList();
        int submitted = 0;
        int accepted = 0;
        for (RevenueReportOutboxItem item : pending) {
            RevenueBatchRequest request;
            try {
                request = persistFreshAttempt(runtime, item, now);
            } catch (DataAccessException exception) {
                markDeliveryFailure(
                        item,
                        "REVENUE_ATTEMPT_NOT_PERSISTED",
                        safeMessage(exception),
                        true,
                        runtime.properties().getRetryDelay(),
                        clock.instant());
                continue;
            } catch (RuntimeException exception) {
                markDeliveryFailure(
                        item,
                        "INVALID_REVENUE_OUTBOX_ITEM",
                        safeMessage(exception),
                        false,
                        runtime.properties().getRetryDelay(),
                        clock.instant());
                continue;
            }
            submitted++;
            RevenueBatchResponse response;
            try {
                response = httpClient.submitRevenueBatch(request);
                verifyResponse(runtime, item, response);
            } catch (RegistryHttpException exception) {
                markDeliveryFailure(
                        item,
                        exception.getErrorCode(),
                        safeMessage(exception),
                        retryable(exception),
                        runtime.properties().getRetryDelay(),
                        clock.instant());
                continue;
            } catch (RuntimeException exception) {
                markDeliveryFailure(
                        item,
                        "INVALID_REVENUE_RECEIPT",
                        safeMessage(exception),
                        false,
                        runtime.properties().getRetryDelay(),
                        clock.instant());
                continue;
            }
            try {
                markAccepted(item, response, clock.instant());
                accepted++;
            } catch (DataAccessException exception) {
                /*
                 * Treat this as a lost response. The next attempt uses the
                 * same logical idempotency key and receives duplicate=true.
                 */
                markDeliveryFailure(
                        item,
                        "REVENUE_ACCEPTANCE_NOT_PERSISTED",
                        safeMessage(exception),
                        true,
                        runtime.properties().getRetryDelay(),
                        clock.instant());
            }
        }
        return new DeliveryResult(submitted, accepted);
    }

    private RevenueBatchRequest persistFreshAttempt(
            RegisteredRuntime runtime,
            RevenueReportOutboxItem item,
            Instant now) {
        List<RevenueCurrencyRow> currencies =
                validateStoredItem(runtime, item);
        String timestamp = now.toString();
        String nonce = RegistryProtocol.randomToken(
                "nonce_",
                secureRandom);
        String signature = runtime.deploymentCrypto().signBase64(
                RegistryProtocol.signedRequest(
                        "POST",
                        RegistryProtocol.REVENUE_BATCH_PATH,
                        RegistryProtocol.PROTOCOL_VERSION,
                        item.getRegistryScope(),
                        item.getDeploymentId(),
                        timestamp,
                        nonce,
                        item.getIdempotencyKey(),
                        item.getPayloadHash()));

        SignedAttempt attempt = new SignedAttempt();
        attempt.setTimestamp(timestamp);
        attempt.setNonce(nonce);
        attempt.setSignature(signature);
        attempt.setPersistedAt(now.toString());
        item.setLastAttempt(attempt);
        item.setAttemptCount(
                Math.addExact(valueOrZero(item.getAttemptCount()), 1));
        item.setLastFailure(null);
        item.setUpdatedAt(now.toString());
        item.setNextRetryAt(null);
        outboxRepository.save(item);

        return new RevenueBatchRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                item.getRegistryScope(),
                item.getDeploymentId(),
                timestamp,
                nonce,
                item.getIdempotencyKey(),
                item.getKind(),
                item.getPeriod(),
                item.getRevision(),
                empty(item.getSupersedesBatchId()),
                item.getRulesetVersion(),
                item.getCommissionRateBasisPoints(),
                currencies,
                item.getPayloadHash(),
                signature);
    }

    private List<RevenueCurrencyRow> validateStoredItem(
            RegisteredRuntime runtime,
            RevenueReportOutboxItem item) {
        if (item == null
                || !Objects.equals(
                        item.getSchemaVersion(),
                        RevenueReportOutboxItem.SCHEMA_VERSION)
                || !runtime.state().registryScope().equals(
                        item.getRegistryScope())
                || !runtime.state().deploymentId().equals(
                        item.getDeploymentId())
                || !RegistryProtocol.REVENUE_KIND.equals(item.getKind())
                || !RegistryProtocol.REVENUE_RULESET_VERSION.equals(
                        item.getRulesetVersion())
                || !Objects.equals(
                        item.getCommissionRateBasisPoints(),
                        RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS)
                || item.getRevision() == null
                || item.getRevision() <= 0L) {
            throw new IllegalStateException(
                    "Stored revenue report metadata is invalid.");
        }
        RegistryProtocol.requireRevenuePeriod(item.getPeriod());
        RegistryProtocol.requireToken(
                item.getIdempotencyKey(),
                "revenue idempotency_key");
        if (item.getRevision() == 1L) {
            if (StringUtils.hasText(item.getSupersedesBatchId())) {
                throw new IllegalStateException(
                        "Initial revenue report must not supersede a batch.");
            }
        } else {
            RegistryProtocol.requireRevenueBatchId(
                    item.getSupersedesBatchId());
        }
        if (item.getCurrencies() == null) {
            throw new IllegalStateException(
                    "Stored revenue currencies must be an explicit array.");
        }
        List<RevenueCurrencyRow> currencies =
                List.copyOf(item.getCurrencies());
        validateRevenueRows(currencies);
        String payloadHash = RegistryProtocol.sha256(
                RegistryProtocol.revenueBatchPayload(
                        item.getKind(),
                        item.getPeriod(),
                        item.getRevision(),
                        empty(item.getSupersedesBatchId()),
                        item.getRulesetVersion(),
                        item.getCommissionRateBasisPoints(),
                        currencies));
        String aggregateHash = aggregateHash(
                LocalDate.parse(item.getPeriod()),
                currencies);
        if (!RegistryProtocol.hashEquals(
                    payloadHash,
                    item.getPayloadHash())
                || !RegistryProtocol.hashEquals(
                        aggregateHash,
                        item.getAggregateHash())) {
            throw new IllegalStateException(
                    "Stored revenue report payload hash is invalid.");
        }
        return currencies;
    }

    private void validateRevenueRows(List<RevenueCurrencyRow> currencies) {
        if (currencies.size()
                > RegistryProtocol.REVENUE_MAX_CURRENCY_ROWS) {
            throw new IllegalStateException(
                    "Stored revenue report has too many currency rows.");
        }
        for (RevenueCurrencyRow row : currencies) {
            if (row == null
                    || row.capturedMinor() == null
                    || row.refundedMinor() == null
                    || row.netMinor() == null
                    || row.commissionBasisMinor() == null
                    || row.estimatedCommissionMinor() == null
                    || row.paymentCount() == null) {
                throw new IllegalStateException(
                        "Stored revenue currency row is incomplete.");
            }
            RegistryProtocol.requireRevenueCurrencyFractionDigits(
                    row.currencyCode(),
                    row.fractionDigits());
            long net = Math.subtractExact(
                    row.capturedMinor(),
                    row.refundedMinor());
            if (row.capturedMinor() < 0L
                    || row.capturedMinor()
                            > RegistryProtocol.REVENUE_MAX_MINOR
                    || row.refundedMinor() < 0L
                    || row.refundedMinor()
                            > RegistryProtocol.REVENUE_MAX_MINOR
                    || row.refundedMinor() > row.capturedMinor()
                    || net != row.netMinor()
                    || net != row.commissionBasisMinor()
                    || OperatorRevenueService.commissionMinor(net)
                            != row.estimatedCommissionMinor()
                    || row.paymentCount() < 0L
                    || row.paymentCount()
                            > RegistryProtocol
                                    .REVENUE_MAX_PAYMENT_COUNT) {
                throw new IllegalStateException(
                        "Stored revenue currency row violates the accounting ruleset.");
            }
        }
    }

    private void verifyResponse(
            RegisteredRuntime runtime,
            RevenueReportOutboxItem item,
            RevenueBatchResponse response) {
        if (response == null || response.receipt() == null) {
            throw new IllegalStateException(
                    "Registry revenue receipt is missing.");
        }
        RegistryProtocol.requireRevenueBatchId(response.batchId());
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                    response.protocolVersion())
                || !item.getRegistryScope().equals(response.registryScope())
                || !item.getDeploymentId().equals(response.deploymentId())
                || !item.getIdempotencyKey().equals(
                        response.idempotencyKey())
                || response.duplicate() == null) {
            throw new IllegalStateException(
                    "Registry revenue response does not match the submitted report.");
        }
        RevenueReceipt receipt = response.receipt();
        if (!response.registryScope().equals(receipt.registryScope())
                || receipt.ledgerIndex() == null
                || receipt.ledgerIndex() <= 0L
                || !item.getKind().equals(receipt.kind())
                || !item.getPeriod().equals(receipt.period())
                || !item.getRevision().equals(receipt.revision())
                || !empty(item.getSupersedesBatchId()).equals(
                        empty(receipt.supersedesBatchId()))
                || !item.getRulesetVersion().equals(
                        receipt.rulesetVersion())
                || !item.getCommissionRateBasisPoints().equals(
                        receipt.commissionRateBasisPoints())
                || !Objects.equals(
                        item.getCurrencies().size(),
                        receipt.currencyCount())
                || !runtime.registryKeyId().equals(
                        receipt.registryKeyId())
                || !runtime.registryPublicKeyBase64().equals(
                        receipt.registryPublicKey())) {
            throw new IllegalStateException(
                    "Registry revenue receipt fields do not match the submitted report.");
        }
        RegistryProtocol.requireHash(receipt.entryHash(), "entry_hash");
        RegistryProtocol.requireHash(
                receipt.previousEntryHash(),
                "previous_entry_hash");
        RegistryProtocol.requireHash(receipt.batchHash(), "batch_hash");
        if (!RegistryProtocol.hashEquals(
                    item.getPayloadHash(),
                    receipt.batchHash())) {
            throw new IllegalStateException(
                    "Registry revenue receipt batch hash does not match the submitted payload.");
        }
        Instant acceptedAt = RegistryProtocol.requireUtcTimestamp(
                receipt.acceptedAt(),
                "accepted_at");
        RegistryProtocol.requireCheckpointDate(receipt.checkpointDate());
        if (!RegistryProtocol.checkpointDateAt(acceptedAt).equals(
                    receipt.checkpointDate())
                || !RegistryCrypto.verifyBase64(
                        runtime.registryPublicKey(),
                        RegistryProtocol.revenueReceipt(response),
                        receipt.signature())) {
            throw new IllegalStateException(
                    "Registry revenue receipt signature or checkpoint is invalid.");
        }
    }

    private void markAccepted(
            RevenueReportOutboxItem item,
            RevenueBatchResponse response,
            Instant now) {
        item.setStatus(RevenueReportOutboxItem.STATUS_ACCEPTED);
        item.setAcceptedResponse(response);
        item.setAcceptedAt(response.receipt().acceptedAt());
        item.setNextRetryAt(null);
        item.setLastFailure(null);
        item.setUpdatedAt(now.toString());
        outboxRepository.save(item);
    }

    private void markDeliveryFailure(
            RevenueReportOutboxItem item,
            String code,
            String message,
            boolean retryable,
            Duration retryBase,
            Instant now) {
        Failure failure = new Failure();
        failure.setCode(safeCode(code));
        failure.setMessage(safeFailureMessage(message));
        failure.setAt(now.toString());
        failure.setRetryable(retryable);
        item.setLastFailure(failure);
        item.setStatus(retryable
                ? RevenueReportOutboxItem.STATUS_PENDING
                : RevenueReportOutboxItem.STATUS_BLOCKED);
        if (retryable) {
            item.setAcceptedResponse(null);
            item.setAcceptedAt(null);
        }
        item.setNextRetryAt(retryable
                ? now.plus(retryDelay(item, retryBase)).toString()
                : null);
        item.setUpdatedAt(now.toString());
        try {
            outboxRepository.save(item);
        } catch (RuntimeException persistenceFailure) {
            /*
             * The signed attempt was already persisted before HTTP. If this
             * update fails, the next run safely resubmits the same logical
             * idempotency key with a fresh timestamp and nonce.
             */
            LOGGER.warn(
                    "Unable to persist revenue delivery outcome for outbox item {}.",
                    item.getId(),
                    persistenceFailure);
        }
    }

    private RevenueReportOutboxItem newOutboxItem(
            RegisteredRuntime runtime,
            LocalDate period,
            List<RevenueCurrencyRow> currencies,
            String aggregateHash,
            RevenueReportOutboxItem latest,
            Instant now) {
        long revision = latest == null
                ? 1L
                : Math.addExact(latest.getRevision(), 1L);
        String supersedesBatchId = latest == null
                ? ""
                : RegistryProtocol.requireRevenueBatchId(
                        latest.getAcceptedResponse().batchId());
        String periodText = period.toString();
        String payloadHash = RegistryProtocol.sha256(
                RegistryProtocol.revenueBatchPayload(
                        RegistryProtocol.REVENUE_KIND,
                        periodText,
                        revision,
                        supersedesBatchId,
                        RegistryProtocol.REVENUE_RULESET_VERSION,
                        RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS,
                        currencies));

        RevenueReportOutboxItem item = new RevenueReportOutboxItem();
        item.setRegistryScope(runtime.state().registryScope());
        item.setDeploymentId(runtime.state().deploymentId());
        item.setPeriod(periodText);
        item.setRevision(revision);
        item.setSupersedesBatchId(supersedesBatchId);
        item.setKind(RegistryProtocol.REVENUE_KIND);
        item.setRulesetVersion(
                RegistryProtocol.REVENUE_RULESET_VERSION);
        item.setCommissionRateBasisPoints(
                RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS);
        item.setCurrencies(currencies);
        item.setAggregateHash(aggregateHash);
        item.setPayloadHash(payloadHash);
        item.setIdempotencyKey(idempotencyKey(
                runtime.state().deploymentId(),
                periodText,
                revision));
        item.setStatus(RevenueReportOutboxItem.STATUS_PENDING);
        item.setAttemptCount(0);
        item.setCreatedAt(now.toString());
        item.setUpdatedAt(now.toString());
        return item;
    }

    private Map<LocalDate, RevenueReportOutboxItem> latestByPeriod(
            List<RevenueReportOutboxItem> items) {
        Map<LocalDate, RevenueReportOutboxItem> latest =
                new LinkedHashMap<>();
        for (RevenueReportOutboxItem item : items == null
                ? List.<RevenueReportOutboxItem>of()
                : items) {
            try {
                LocalDate period = LocalDate.parse(
                        RegistryProtocol.requireRevenuePeriod(
                                item.getPeriod()));
                RevenueReportOutboxItem previous = latest.get(period);
                if (previous == null
                        || valueOrZero(item.getRevision())
                                > valueOrZero(previous.getRevision())) {
                    latest.put(period, item);
                }
            } catch (RuntimeException exception) {
                LOGGER.warn(
                        "Ignoring malformed revenue outbox period metadata for item {}.",
                        item == null ? null : item.getId());
            }
        }
        return latest;
    }

    private List<RevenueCurrencyRow> protocolRows(
            OperatorRevenueService.DailyRevenueSnapshot daily) {
        List<RevenueCurrencyRow> rows = new ArrayList<>();
        for (OperatorRevenueService.DailyCurrencyRevenue currency
                : daily.currencies()) {
            rows.add(new RevenueCurrencyRow(
                    currency.currencyCode(),
                    currency.fractionDigits(),
                    currency.capturedMinor(),
                    currency.refundedMinor(),
                    currency.netMinor(),
                    currency.commissionBasisMinor(),
                    currency.estimatedCommissionMinor(),
                    currency.paymentCount()));
        }
        rows.sort(Comparator.comparing(RevenueCurrencyRow::currencyCode));
        validateRevenueRows(rows);
        return List.copyOf(rows);
    }

    private String aggregateHash(
            LocalDate period,
            List<RevenueCurrencyRow> currencies) {
        return RegistryProtocol.sha256(
                RegistryProtocol.revenueBatchPayload(
                        RegistryProtocol.REVENUE_KIND,
                        period.toString(),
                        1L,
                        "",
                        RegistryProtocol.REVENUE_RULESET_VERSION,
                        RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS,
                        currencies));
    }

    private String idempotencyKey(
            String deploymentId,
            String period,
            long revision) {
        String hash = RegistryProtocol.sha256(
                RegistryProtocol.canonical(
                        "myscoutee-revenue-idempotency-v1",
                        deploymentId,
                        period,
                        Long.toString(revision)));
        return "revenue_" + hash.substring("sha256:".length());
    }

    private boolean isDue(
            RevenueReportOutboxItem item,
            Instant now) {
        if (!StringUtils.hasText(item.getNextRetryAt())) {
            return true;
        }
        try {
            return !Instant.parse(item.getNextRetryAt()).isAfter(now);
        } catch (RuntimeException exception) {
            return true;
        }
    }

    private boolean retryable(RegistryHttpException exception) {
        int status = exception == null ? 0 : exception.getStatusCode();
        return status == 0 || status == 408 || status == 425
                || status == 429 || status >= 500;
    }

    private Duration retryDelay(
            RevenueReportOutboxItem item,
            Duration configuredBase) {
        Duration base = configuredBase == null
                        || configuredBase.isZero()
                        || configuredBase.isNegative()
                ? Duration.ofMinutes(1)
                : configuredBase;
        int exponent = Math.min(
                Math.max(0, valueOrZero(item.getAttemptCount()) - 1),
                10);
        Duration candidate;
        try {
            candidate = base.multipliedBy(1L << exponent);
        } catch (ArithmeticException exception) {
            candidate = MAX_RETRY_DELAY;
        }
        return candidate.compareTo(MAX_RETRY_DELAY) > 0
                ? MAX_RETRY_DELAY
                : candidate;
    }

    private OperatorRevenueSyncDto status(
            String state,
            String code,
            String message,
            int materialized,
            int submitted,
            int accepted,
            long pending,
            long blocked,
            Instant at) {
        return new OperatorRevenueSyncDto(
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

    private static int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }

    private static long valueOrZero(Long value) {
        return value == null ? 0L : value;
    }

    private static String empty(String value) {
        return value == null ? "" : value;
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private static String safeCode(String value) {
        String code = safeText(value);
        return StringUtils.hasText(code)
                ? code
                : "REGISTRY_DELIVERY_FAILED";
    }

    private static String safeMessage(RuntimeException exception) {
        String message = exception == null
                ? ""
                : safeText(exception.getMessage());
        return StringUtils.hasText(message)
                ? message
                : "Registry revenue delivery failed.";
    }

    private static String safeFailureMessage(String value) {
        String message = safeText(value);
        if (!StringUtils.hasText(message)) {
            return "Registry revenue delivery failed.";
        }
        return message.length() <= 512
                ? message
                : message.substring(0, 512);
    }

    private record DeliveryResult(int submitted, int accepted) {
    }
}
