package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.payments.api.PaymentProviderChangedException;

import static com.raxim.myscoutee.domain.payments.dto.PaymentDtos.*;

import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.payments.document.PaymentMethodRegistration;
import com.raxim.myscoutee.domain.payments.document.SavedPaymentMethod;
import com.raxim.myscoutee.domain.payments.repository.PaymentMethodRegistrationsRepository;
import com.raxim.myscoutee.domain.payments.repository.PaymentsRepository;
import com.raxim.myscoutee.domain.payments.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.domain.accounts.api.AccountPaymentReads;
import com.raxim.myscoutee.domain.accounts.dto.AccountPaymentSummaryDto;
import com.raxim.myscoutee.domain.payments.service.PaymentSimulatorRegistrationClient.GatewayRegistration;
import com.raxim.myscoutee.domain.payments.service.DeploymentPaymentProviderResolver;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

@Service
public class SavedPaymentMethodsService implements com.raxim.myscoutee.domain.payments.api.PaymentMethods {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.payments.service.PaymentEuroService euroService;
    private static final Logger LOG = LoggerFactory.getLogger(SavedPaymentMethodsService.class);
    public static final int MAX_ACTIVE_PAYMENT_METHODS = 6;
    private static final Duration DEFAULT_REGISTRATION_TTL = Duration.ofMinutes(10);
    private static final String ACTIVE = "active";
    private static final List<String> ARTWORK_KEYS = List.of(
            "midnight", "emerald", "coral", "graphite", "orbit", "aurora");

    private final SavedPaymentMethodsRepository paymentMethodsRepository;
    private final PaymentMethodRegistrationsRepository registrationsRepository;
    private final PaymentsRepository paymentsRepository;
    private final PaymentSimulatorRegistrationClient simulatorClient;
    private final DeploymentPaymentProviderResolver paymentProviderResolver;
    private final AccountPaymentReads usersRepository;

    @Value("${payment.registration.ttl:PT10M}")
    private Duration registrationTtl = DEFAULT_REGISTRATION_TTL;

    public SavedPaymentMethodsService(
            SavedPaymentMethodsRepository paymentMethodsRepository,
            PaymentMethodRegistrationsRepository registrationsRepository,
            PaymentsRepository paymentsRepository,
            PaymentSimulatorRegistrationClient simulatorClient,
            DeploymentPaymentProviderResolver paymentProviderResolver,
            AccountPaymentReads usersRepository) {
        this.paymentMethodsRepository = paymentMethodsRepository;
        this.registrationsRepository = registrationsRepository;
        this.paymentsRepository = paymentsRepository;
        this.simulatorClient = simulatorClient;
        this.paymentProviderResolver = paymentProviderResolver;
        this.usersRepository = usersRepository;
    }

    public synchronized SavedPaymentMethodsPageDto queryPage(String userId, Integer page, Integer size) {
        String ownerId = requiredId(userId, "Current user");
        reconcilePendingRegistrations(ownerId);
        PaymentSimulatorRegistrationClient.GatewayConfiguration gatewayConfiguration =
                currentDemoGatewayConfiguration();
        String currentProvider = currentDemoProvider(gatewayConfiguration);
        List<SavedPaymentMethod> all = orderedVisibleMethods(
                visibleMethods(ownerId),
                currentProvider);
        int pageSize = Math.min(MAX_ACTIVE_PAYMENT_METHODS, Math.max(1, size == null ? MAX_ACTIVE_PAYMENT_METHODS : size));
        int pageIndex = Math.max(0, page == null ? 0 : page);
        int from = Math.min(all.size(), pageIndex * pageSize);
        int to = Math.min(all.size(), from + pageSize);
        PaymentMethodRegistration pending = registrationsRepository
                .findByUserIdAndStatusOrderByCreatedAtIsoDesc(ownerId, "pending")
                .stream()
                .findFirst()
                .orElse(null);
        return new SavedPaymentMethodsPageDto(
                all.subList(from, to).stream().map(this::toDto).toList(),
                all.size(),
                to < all.size() ? Integer.toString(pageIndex + 1) : null,
                activeMethods(ownerId).size() < MAX_ACTIVE_PAYMENT_METHODS
                        && activeDemoProviderAllowsRegistration(gatewayConfiguration)
                        && pending == null,
                pending == null ? null : toRegistrationDto(pending, null),
                currentProvider);
    }

    public synchronized PaymentMethodRegistrationDto beginRegistration(
            String userId,
            PaymentMethodRegistrationRequestDto request) {
        if (!isDemoSimulatorMode()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Demo payment-card registration is unavailable outside a demo session.");
        }
        String ownerId = requiredId(userId, "Current user");
        reconcilePendingRegistrations(ownerId);
        if (!registrationsRepository.findByUserIdAndStatusOrderByCreatedAtIsoDesc(ownerId, "pending").isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A payment-card registration is already in progress.");
        }
        String provider = resolveActiveProvider(request == null ? null : request.provider());
        String replacesId = normalizeId(request == null ? null : request.replacesPaymentMethodId());
        if (StringUtils.hasText(replacesId)) {
            requireActive(ownerId, replacesId, null);
        } else if (activeMethods(ownerId).size() >= MAX_ACTIVE_PAYMENT_METHODS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user can save at most six payment cards.");
        }

        Instant now = Instant.now().truncatedTo(ChronoUnit.MILLIS);
        PaymentMethodRegistration registration = new PaymentMethodRegistration();
        registration.setId("pmreg_" + UUID.randomUUID());
        registration.setUserId(ownerId);
        registration.setProvider(provider);
        registration.setStatus("pending");
        registration.setReplacesPaymentMethodId(replacesId);
        registration.setCreatedAtIso(now.toString());
        registration.setUpdatedAtIso(now.toString());
        registration.setExpiresAtIso(now.plus(effectiveRegistrationTtl()).toString());
        registration = registrationsRepository.save(registration);

        try {
            GatewayRegistration gateway = simulatorClient.begin(
                    registration.getId(),
                    ownerId,
                    provider,
                    registration.getExpiresAtIso());
            registration.setGatewayRegistrationId(gateway.id());
            registration.setGatewayPaymentUrl(normalizeUrl(gateway.url()));
            registration.setStatus(normalizeRegistrationStatus(gateway.status()));
            registration.setUpdatedAtIso(Instant.now().toString());
            return toRegistrationDto(registrationsRepository.save(registration), null);
        } catch (RuntimeException failure) {
            registration.setStatus("failed");
            registration.setUpdatedAtIso(Instant.now().toString());
            registrationsRepository.save(registration);
            throw failure;
        }
    }

    public synchronized PaymentMethodRegistrationDto refreshRegistration(String userId, String registrationId) {
        String ownerId = requiredId(userId, "Current user");
        PaymentMethodRegistration registration = registrationsRepository
                .findByIdAndUserId(requiredId(registrationId, "Registration"), ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment-card registration was not found."));
        return refreshRegistration(registration);
    }

    public synchronized void receiveSimulatorCallback(String registrationId, String reportedStatus) {
        PaymentMethodRegistration registration = registrationsRepository
                .findById(requiredId(registrationId, "Registration"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment-card registration was not found."));
        String status = normalizeRegistrationStatus(reportedStatus);
        if (!Set.of("completed", "failed", "cancelled", "expired").contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment-card registration callback is not terminal.");
        }
        refreshRegistration(registration);
    }

    public String resolveActiveProvider(String requestedProvider) {
        return resolveActiveProvider(requestedProvider, true);
    }

    public String resolvePaymentProvider(String requestedProvider) {
        return resolveActiveProvider(requestedProvider, false);
    }

    private String resolveActiveProvider(String requestedProvider, boolean registration) {
        if (!isDemoSimulatorMode()) {
            return normalizeProvider(paymentProviderResolver.resolveActiveProvider(requestedProvider));
        }
        PaymentSimulatorRegistrationClient.GatewayConfiguration configuration = simulatorClient.configuration();
        String configuredValue = safeText(configuration.provider()).toLowerCase(Locale.ROOT);
        if ("none".equals(configuredValue)) {
            if (!registration) {
                throw new PaymentProviderChangedException(
                        HttpStatus.BAD_REQUEST,
                        null);
            }
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Card registration is unavailable while the demo payment simulator is Cash only.");
        }
        String configured = normalizeProvider(configuredValue);
        if (!configuration.connected()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The selected demo payment provider is not connected.");
        }
        String requested = normalizeId(requestedProvider);
        if (StringUtils.hasText(requested) && !configured.equalsIgnoreCase(requested)) {
            throw new PaymentProviderChangedException(
                    HttpStatus.BAD_REQUEST,
                    configured);
        }
        return configured;
    }

    private PaymentMethodRegistrationDto refreshRegistration(PaymentMethodRegistration registration) {
        if (StringUtils.hasText(registration.getCompletedPaymentMethodId())) {
            SavedPaymentMethod method = paymentMethodsRepository.findById(registration.getCompletedPaymentMethodId()).orElse(null);
            return toRegistrationDto(registration, method);
        }
        if (Set.of("failed", "cancelled", "expired").contains(registration.getStatus())) {
            return toRegistrationDto(registration, null);
        }
        boolean deadlineReached = !Instant.parse(registration.getExpiresAtIso()).isAfter(Instant.now());
        GatewayRegistration gateway;
        try {
            // The provider owns the registration session. Let it perform and
            // persist the timeout transition instead of ending only the local
            // projection while the provider record remains pending.
            gateway = simulatorClient.retrieve(registration.getGatewayRegistrationId());
        } catch (RuntimeException unavailableProvider) {
            if (!deadlineReached) {
                throw unavailableProvider;
            }
            registration.setStatus("expired");
            registration.setGatewayPaymentUrl(null);
            registration.setUpdatedAtIso(Instant.now().toString());
            return toRegistrationDto(registrationsRepository.save(registration), null);
        }
        String status = normalizeRegistrationStatus(gateway.status());
        registration.setStatus(status);
        registration.setUpdatedAtIso(Instant.now().toString());
        if (!"completed".equals(status)) {
            if (Set.of("failed", "cancelled", "expired").contains(status)) {
                registration.setGatewayPaymentUrl(null);
            }
            return toRegistrationDto(registrationsRepository.save(registration), null);
        }

        SavedPaymentMethod saved = completeRegistration(registration, gateway);
        registration.setCompletedPaymentMethodId(saved.getId());
        registration.setGatewayPaymentUrl(null);
        registration.setUpdatedAtIso(Instant.now().toString());
        registrationsRepository.save(registration);
        return toRegistrationDto(registration, saved);
    }

    private void reconcilePendingRegistrations(String userId) {
        if (!isDemoSimulatorMode()) {
            return;
        }
        for (PaymentMethodRegistration registration : registrationsRepository
                .findByUserIdAndStatusOrderByCreatedAtIsoDesc(userId, "pending")) {
            try {
                refreshRegistration(registration);
            } catch (RuntimeException ignored) {
                // The list remains available while the external provider is
                // temporarily unreachable; the explicit status poll retries.
            }
        }
    }

    public SavedPaymentMethod requireActive(
            String userId,
            String paymentMethodId,
            String expectedProvider) {
        SavedPaymentMethod method = paymentMethodsRepository
                .findByIdAndUserId(requiredId(paymentMethodId, "Payment method"), requiredId(userId, "Current user"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment card was not found."));
        if (!ACTIVE.equals(method.getStatus()) || isExpired(method)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment card is no longer available.");
        }
        String provider = normalizeId(expectedProvider);
        if (StringUtils.hasText(provider) && !provider.equalsIgnoreCase(method.getProvider())) {
            throw new PaymentProviderChangedException(
                    HttpStatus.CONFLICT,
                    provider);
        }
        return method;
    }

    public PaymentHistoryPageDto queryPaymentMethodHistory(
            String userId,
            String paymentMethodId,
            Integer page,
            Integer size) {
        String ownerId = requiredId(userId, "Current user");
        String methodId = requiredId(paymentMethodId, "Payment method");
        paymentMethodsRepository.findByIdAndUserId(methodId, ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment card was not found."));
        List<Payment> all = paymentsRepository.findByUserIdAndPaymentMethodIdOrderByCreatedDateDesc(ownerId, methodId);
        int pageSize = Math.min(50, Math.max(1, size == null ? 20 : size));
        int pageIndex = Math.max(0, page == null ? 0 : page);
        int from = Math.min(all.size(), pageIndex * pageSize);
        int to = Math.min(all.size(), from + pageSize);
        List<PaymentHistoryItemDto> items = all.subList(from, to).stream().map(this::toHistoryDto).toList();
        var accountSummary = usersRepository.paymentSummary(ownerId).orElse(null);
        return new PaymentHistoryPageDto(
                items,
                all.size(),
                to < all.size() ? Integer.toString(pageIndex + 1) : null,
                spendingTotals(accountSummary),
                incomeTotals(accountSummary),
                pendingRefundCount(accountSummary), euroService == null ? null : euroService.summary(ownerId, false));
    }

    public PaymentHistoryPageDto queryHistory(String userId, Integer page, Integer size) {
        return queryHistory(userId, "all", page, size);
    }

    public PaymentHistoryPageDto queryHistory(
            String userId,
            String direction,
            Integer page,
            Integer size) {
        return queryHistory(userId,direction,page,size,null);
    }
    public PaymentHistoryPageDto queryHistory(String userId,String direction,Integer page,Integer size,String counterpartyUserId) {
        String ownerId = requiredId(userId, "Current user");
        String counterpartyId = normalizeId(counterpartyUserId);
        String normalizedDirection = normalizeHistoryDirection(direction);
        List<Payment> expenses = paymentsRepository.findByUserIdOrderByCreatedDateDesc(ownerId);
        List<Payment> income = paymentsRepository.findByRecipientUserIdOrderByCreatedDateDesc(ownerId).stream()
                .filter(payment -> !ownerId.equals(normalizeId(payment.getUserId())))
                .toList();
        List<Payment> merged = mergeHistory(expenses, income).stream().filter(p -> !StringUtils.hasText(counterpartyId) || counterpartyId.equals(ownerId.equals(p.getUserId()) ? p.getRecipientUserId() : p.getUserId())).toList();
        List<Payment> all = "all".equals(normalizedDirection)
                ? merged
                : merged.stream()
                        .filter(payment -> paymentHistoryDirection(payment, ownerId).equals(
                                "income".equals(normalizedDirection) ? "income" : "expense"))
                        .toList();
        int pageSize = Math.min(50, Math.max(1, size == null ? 20 : size));
        int pageIndex = Math.max(0, page == null ? 0 : page);
        int from = Math.min(all.size(), pageIndex * pageSize);
        int to = Math.min(all.size(), from + pageSize);
        var accountSummary = usersRepository.paymentSummary(ownerId).orElse(null);
        return new PaymentHistoryPageDto(
                all.subList(from, to).stream().map(payment -> toHistoryDto(payment, ownerId)).toList(),
                all.size(),
                to < all.size() ? Integer.toString(pageIndex + 1) : null,
                spendingTotals(accountSummary),
                incomeTotals(accountSummary),
                pendingRefundCount(accountSummary), euroService == null ? null : euroService.summary(ownerId, false));
    }

    public synchronized void delete(String userId, String paymentMethodId) {
        String ownerId = requiredId(userId, "Current user");
        SavedPaymentMethod method = paymentMethodsRepository
                .findByIdAndUserId(requiredId(paymentMethodId, "Payment method"), ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment card was not found."));
        if (!ACTIVE.equals(method.getStatus()) && !"expired".equals(method.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment card is no longer active.");
        }
        if (isDemoSimulatorMode()) {
            try {
                simulatorClient.revoke(method.getProvider(), method.getProviderPaymentMethodRef());
            } catch (RuntimeException exception) {
                LOG.warn(
                        "Provider cleanup failed for saved payment method {}; continuing with local deletion ({})",
                        method.getId(),
                        exception.getClass().getSimpleName());
            }
        }
        if (paymentMethodsRepository.markDeleted(method.getId(), ownerId, Instant.now().toString()) != 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment card is no longer active.");
        }
    }

    private SavedPaymentMethod completeRegistration(
            PaymentMethodRegistration registration,
            GatewayRegistration gateway) {
        SavedPaymentMethod existing = paymentMethodsRepository.findByRegistrationId(registration.getId()).orElse(null);
        if (existing != null) {
            return existing;
        }
        String providerRef = requiredId(gateway.providerToken(), "Provider payment method reference");
        int expiryMonth = normalizeMonth(gateway.expiryMonth());
        int expiryYear = normalizeYear(gateway.expiryYear());
        SavedPaymentMethod replaced = StringUtils.hasText(registration.getReplacesPaymentMethodId())
                ? requireActive(registration.getUserId(), registration.getReplacesPaymentMethodId(), null)
                : null;
        if (replaced == null && activeMethods(registration.getUserId()).size() >= MAX_ACTIVE_PAYMENT_METHODS) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A user can save at most six payment cards.");
        }

        String now = Instant.now().toString();
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId("pm_" + UUID.randomUUID());
        method.setUserId(registration.getUserId());
        method.setProvider(registration.getProvider());
        method.setProviderPaymentMethodRef(providerRef);
        method.setRegistrationId(registration.getId());
        method.setBrand(normalizeBrand(gateway.brand()));
        method.setLast4(normalizeLast4(gateway.last4()));
        method.setExpiryMonth(expiryMonth);
        method.setExpiryYear(expiryYear);
        method.setExpiryKey(expiryYear * 100 + expiryMonth);
        method.setCardholderName(normalizeCardholderName(gateway.cardholderName()));
        method.setArtworkKey(replaced == null ? nextArtworkKey(registration.getUserId()) : replaced.getArtworkKey());
        method.setStatus(ACTIVE);
        method.setReplacesPaymentMethodId(replaced == null ? null : replaced.getId());
        method.setCreatedAtIso(now);
        method.setUpdatedAtIso(now);
        try {
            method = paymentMethodsRepository.save(method);
        } catch (DuplicateKeyException duplicate) {
            return paymentMethodsRepository.findByRegistrationId(registration.getId()).orElseThrow(() -> duplicate);
        }
        if (replaced != null) {
            if (paymentMethodsRepository.markReplaced(
                    replaced.getId(), registration.getUserId(), method.getId(), now) != 1) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment card is no longer active.");
            }
        }
        return method;
    }

    private String nextArtworkKey(String userId) {
        Set<String> used = activeMethods(userId).stream().map(SavedPaymentMethod::getArtworkKey).collect(java.util.stream.Collectors.toSet());
        return ARTWORK_KEYS.stream().filter(key -> !used.contains(key)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "No unused payment-card artwork is available."));
    }

    private List<SavedPaymentMethod> activeMethods(String userId) {
        return paymentMethodsRepository.findByUserIdAndStatusOrderByCreatedAtIsoDesc(userId, ACTIVE);
    }

    private List<SavedPaymentMethod> visibleMethods(String userId) {
        return paymentMethodsRepository.findByUserIdAndStatusInOrderByCreatedAtIsoDesc(
                userId,
                List.of(ACTIVE, "expired"));
    }

    private List<SavedPaymentMethod> orderedVisibleMethods(
            List<SavedPaymentMethod> methods,
            String currentProvider) {
        return methods.stream()
                .sorted(Comparator
                        .comparingInt((SavedPaymentMethod method) -> paymentMethodDisplayRank(
                                method,
                                currentProvider))
                        .thenComparing(
                                method -> safeText(method.getCreatedAtIso()),
                                Comparator.reverseOrder())
                        .thenComparing(method -> safeText(method.getId())))
                .toList();
    }

    private int paymentMethodDisplayRank(
            SavedPaymentMethod method,
            String currentProvider) {
        if (method == null
                || "expired".equals(safeText(method.getStatus()).toLowerCase(Locale.ROOT))
                || isExpired(method)) {
            return 2;
        }
        String provider = safeText(method.getProvider()).toLowerCase(Locale.ROOT);
        return StringUtils.hasText(currentProvider)
                && !currentProvider.equals(provider)
                        ? 1
                        : 0;
    }

    private Duration effectiveRegistrationTtl() {
        return registrationTtl == null || registrationTtl.isZero() || registrationTtl.isNegative()
                ? DEFAULT_REGISTRATION_TTL
                : registrationTtl;
    }

    private boolean isDemoSimulatorMode() {
        return MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO
                && simulatorClient.isEnabled();
    }

    private PaymentSimulatorRegistrationClient.GatewayConfiguration currentDemoGatewayConfiguration() {
        if (!isDemoSimulatorMode()) {
            return null;
        }
        try {
            return simulatorClient.configuration();
        } catch (RuntimeException ignored) {
            return null;
        }
    }

    private boolean activeDemoProviderAllowsRegistration(
            PaymentSimulatorRegistrationClient.GatewayConfiguration configuration) {
        String provider = currentDemoProvider(configuration);
        return configuration != null
                && configuration.connected()
                && Set.of("stripe", "barion").contains(provider);
    }
    public boolean cardsAvailable() {
        if (isDemoSimulatorMode()) return activeDemoProviderAllowsRegistration(currentDemoGatewayConfiguration());
        try { return StringUtils.hasText(normalizeProvider(paymentProviderResolver.resolveActiveProvider(null))); }
        catch (ResponseStatusException unavailable) { return false; }
    }

    private String currentDemoProvider(
            PaymentSimulatorRegistrationClient.GatewayConfiguration configuration) {
        if (configuration == null) {
            return null;
        }
        String provider = safeText(configuration.provider()).toLowerCase(Locale.ROOT);
        return Set.of("none", "stripe", "barion").contains(provider) ? provider : null;
    }

    private boolean isExpired(SavedPaymentMethod method) {
        Integer key = method == null ? null : method.getExpiryKey();
        YearMonth now = YearMonth.now(ZoneOffset.UTC);
        return key == null || key < now.getYear() * 100 + now.getMonthValue();
    }

    private SavedPaymentMethodDto toDto(SavedPaymentMethod method) {
        String artworkKey = normalizeId(method.getArtworkKey());
        return new SavedPaymentMethodDto(
                method.getId(), method.getProvider(), method.getBrand(), method.getLast4(),
                method.getExpiryMonth(), method.getExpiryYear(), method.getCardholderName(),
                artworkKey,
                "/media/public?key=payment-cards/card-" + artworkKey + ".webp",
                method.getStatus(), method.getCreatedAtIso(), method.getUpdatedAtIso());
    }

    private PaymentMethodRegistrationDto toRegistrationDto(
            PaymentMethodRegistration registration,
            SavedPaymentMethod method) {
        return new PaymentMethodRegistrationDto(
                registration.getId(), registration.getProvider(), registration.getStatus(),
                "pending".equals(registration.getStatus()) ? normalizeUrl(registration.getGatewayPaymentUrl()) : null,
                registration.getExpiresAtIso(), registration.getReplacesPaymentMethodId(),
                method == null ? null : toDto(method));
    }

    private PaymentHistoryItemDto toHistoryDto(Payment payment) {
        return toHistoryDto(payment, normalizeId(payment.getUserId()));
    }

    public PaymentHistoryItemDto toHistoryDto(Payment payment, String viewerUserId) {
        String paymentMethodId = normalizeId(payment.getPaymentMethodId());
        String userId = normalizeId(payment.getUserId());
        String viewerId = normalizeId(viewerUserId);
        String direction = paymentHistoryDirection(payment, viewerId);
        String fulfillmentKind = normalizeId(payment.getFulfillmentKind());
        boolean cashReceipt = "cash-receipt".equals(fulfillmentKind);
        String serviceContext = cashReceipt ? null : PaymentService.FULFILLMENT_KIND_CLIENT.equals(fulfillmentKind) ? "asset" : "event";
        boolean refundAudit = "refund".equals(normalizeId(payment.getAuditKind()));
        String requestStatus = normalizeId(payment.getRefundRequestStatus());
        if (!StringUtils.hasText(requestStatus)) requestStatus = "none";
        Payment linkedRefund = !refundAudit && StringUtils.hasText(payment.getId())
                ? paymentsRepository.findById("refund:" + payment.getId()).orElse(null)
                : null;
        boolean refundAlreadyRecorded = linkedRefund != null
                && "refund".equals(normalizeId(linkedRefund.getAuditKind()));
        boolean refundableStatus = Set.of("authorized", "captured", "approved", "partially_refunded")
                .contains(safeText(payment.getStatus()).toLowerCase(Locale.ROOT));
        boolean paymentAudit = !StringUtils.hasText(payment.getAuditKind()) || "payment".equals(payment.getAuditKind());
        Double originalPaidAmount = refundAudit && StringUtils.hasText(payment.getSupersedesPaymentId())
                ? paymentsRepository.findById(payment.getSupersedesPaymentId())
                        .map(Payment::getAmount)
                        .orElse(payment.getAmount())
                : null;
        PaymentRefundCalculator.Preview refund = refundAudit
                ? "pending".equals(requestStatus)
                        ? PaymentRefundCalculator.storedOrCurrentPreview(
                                payment,
                                Instant.now().toString(),
                                originalPaidAmount)
                        : null
                : PaymentRefundCalculator.storedOrCurrentPreview(payment, Instant.now().toString());
        SavedPaymentMethodDto paymentMethod = StringUtils.hasText(paymentMethodId) && StringUtils.hasText(userId)
                ? paymentMethodsRepository.findByIdAndUserId(paymentMethodId, userId).map(this::toDto).orElse(null)
                : null;
        return new PaymentHistoryItemDto(
                payment.getId(), payment.getSourceId(),
                direction,
                payment.getPaymentMethodId(), payment.getProvider(), payment.getStatus(), payment.getLastGatewayError(),
                payment.getAmount(), payment.getCurrency(), payment.getBookingStatus(),
                payment.getAuditKind(), payment.getFulfillmentKind(), payment.getCheckoutSessionId(), payment.getCreatedDate(),
                payment.getRecipientUserId(), serviceContext,
                cashReceipt ? null : PaymentService.FULFILLMENT_KIND_CLIENT.equals(fulfillmentKind)
                        ? payment.getContextEventId()
                        : payment.getSourceId(),
                payment.getContextSubEventId(),
                PaymentService.FULFILLMENT_KIND_CLIENT.equals(fulfillmentKind) ? payment.getSourceId() : null,
                requestStatus, payment.getRefundRequestedAtIso(),
                "expense".equals(direction) && paymentAudit && refundableStatus && !refundAlreadyRecorded
                        && "none".equals(requestStatus)
                        && payment.getRefundRequestedTargetAmount() == null && refund != null && refund.refundableAmount() > 0,
                "expense".equals(direction) && refundAudit && "pending".equals(requestStatus),
                refund == null ? null : new PaymentRefundPreviewDto(
                        refund.paidAmount(), refund.refundableAmount(), refund.retainedAmount(), refund.currency(),
                        refund.status(), refund.ruleId(), refund.ruleOffsetUnit(), refund.ruleOffsetValue(),
                        refund.refundKind(), refund.refundValue(), refund.ruleDescription()),
                paymentMethod, payment.getReceiptNote(),
                viewerId.equals(userId) ? payment.getReceiptRecipientName() : payment.getReceiptPayerName(),
                viewerId.equals(userId) ? payment.getRecipientUserId() : userId);
    }

    private String paymentHistoryDirection(Payment payment, String viewerUserId) {
        boolean payer = normalizeId(payment == null ? null : payment.getUserId()).equals(normalizeId(viewerUserId));
        boolean refund = "refund".equals(normalizeId(payment == null ? null : payment.getAuditKind()));
        if (refund) return payer ? "income" : "expense";
        return payer ? "expense" : "income";
    }

    public PaymentHistoryMutationDto mutationDto(Payment payment, String viewerUserId) {
        String ownerId = requiredId(viewerUserId, "Current user");
        PaymentHistoryItemDto item = toHistoryDto(payment, ownerId);
        List<PaymentHistoryItemDto> changed = new ArrayList<>();
        changed.add(item);
        if ("refund".equals(payment.getAuditKind()) && StringUtils.hasText(payment.getSupersedesPaymentId())) {
            paymentsRepository.findById(payment.getSupersedesPaymentId())
                    .filter(original -> ownerId.equals(normalizeId(original.getUserId()))
                            || ownerId.equals(normalizeId(original.getRecipientUserId())))
                    .ifPresent(original -> changed.add(toHistoryDto(original, ownerId)));
        }
        var accountSummary = usersRepository.paymentSummary(ownerId).orElse(null);
        return new PaymentHistoryMutationDto(
                item, spendingTotals(accountSummary), incomeTotals(accountSummary), pendingRefundCount(accountSummary),
                euroService == null ? null : euroService.summary(ownerId, false), changed);
    }

    public int pendingRefundCount(String userId) {
        return pendingRefundCount(usersRepository.paymentSummary(normalizeId(userId)).orElse(null));
    }

    private int pendingRefundCount(AccountPaymentSummaryDto summary) {
        return summary == null || summary.pendingRefunds() == null ? 0 : Math.max(0, summary.pendingRefunds());
    }

    private List<Payment> mergeHistory(List<Payment> expenses, List<Payment> income) {
        Map<String, Payment> byId = new LinkedHashMap<>();
        java.util.stream.Stream.concat(expenses.stream(), income.stream())
                .filter(Objects::nonNull)
                .forEach(payment -> byId.putIfAbsent(
                        StringUtils.hasText(payment.getId()) ? payment.getId() : Integer.toHexString(System.identityHashCode(payment)),
                        payment));
        return byId.values().stream()
                .sorted(Comparator.comparing(
                        payment -> safeText(payment.getCreatedDate()),
                        Comparator.reverseOrder()))
                .toList();
    }

    private Map<String, Double> normalizedTotals(Map<String, Double> source) {
        Map<String, Double> normalized = new LinkedHashMap<>();
        (source == null ? Map.<String, Double>of() : source).entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> normalized.put(
                        entry.getKey(),
                        Math.round(Math.max(0D, entry.getValue() == null ? 0D : entry.getValue()) * 100D) / 100D));
        return Map.copyOf(normalized);
    }

    private String normalizeHistoryDirection(String value) {
        String direction = safeText(value).toLowerCase(Locale.ROOT);
        if (!Set.of("all", "expenses", "income").contains(direction)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment history direction must be all, expenses, or income.");
        }
        return direction;
    }

    private Map<String, Double> spendingTotals(AccountPaymentSummaryDto summary) {
        Map<String, Double> stored = summary == null || summary.spent() == null ? Map.of() : summary.spent();
        Map<String, Double> normalized = new LinkedHashMap<>();
        stored.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {
                    String currency = safeText(entry.getKey()).toUpperCase(Locale.ROOT);
                    double amount = entry.getValue() == null ? 0D : Math.max(0D, entry.getValue());
                    if (currency.matches("[A-Z]{3}") && amount > 0D) {
                        normalized.put(currency, Math.round(amount * 100D) / 100D);
                    }
                });
        return Map.copyOf(normalized);
    }

    private Map<String, Double> incomeTotals(AccountPaymentSummaryDto summary) {
        Map<String, Double> stored = summary == null || summary.income() == null ? Map.of() : summary.income();
        return normalizedTotals(stored);
    }

    private String normalizeProvider(String value) {
        String provider = safeText(value).toLowerCase(Locale.ROOT);
        if (!Set.of("stripe", "barion").contains(provider)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment provider must be stripe or barion.");
        }
        return provider;
    }

    private String normalizeRegistrationStatus(String value) {
        String status = safeText(value).toLowerCase(Locale.ROOT);
        return Set.of("pending", "completed", "failed", "cancelled", "expired").contains(status) ? status : "failed";
    }

    private String normalizeBrand(String value) {
        String brand = safeText(value);
        return StringUtils.hasText(brand) ? brand : "Card";
    }

    private String normalizeLast4(String value) {
        String digits = safeText(value).replaceAll("[^0-9]", "");
        if (digits.length() != 4) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider returned invalid masked card data.");
        }
        return digits;
    }

    private int normalizeMonth(Integer value) {
        int month = value == null ? 0 : value;
        if (month < 1 || month > 12) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider returned an invalid expiry month.");
        }
        return month;
    }

    private int normalizeYear(Integer value) {
        int year = value == null ? 0 : value;
        if (year < 2000 || year > 2200) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider returned an invalid expiry year.");
        }
        return year;
    }

    private String normalizeCardholderName(String value) {
        String name = safeText(value).replaceAll("[\\r\\n\\t]", " ").replaceAll("\\s+", " ");
        return name.length() <= 64 ? name : name.substring(0, 64);
    }

    private String requiredId(String value, String label) {
        String normalized = normalizeId(value);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + " is required.");
        }
        return normalized;
    }

    private String normalizeId(String value) { return StringUtils.hasText(safeText(value)) ? safeText(value) : null; }
    private String normalizeUrl(String value) { return StringUtils.hasText(safeText(value)) ? safeText(value) : null; }
    private String safeText(String value) { return value == null ? "" : value.trim(); }
}
