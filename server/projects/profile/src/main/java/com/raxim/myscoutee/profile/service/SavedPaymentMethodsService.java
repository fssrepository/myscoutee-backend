package com.raxim.myscoutee.profile.service;

import static com.raxim.myscoutee.profile.data.dto.payment.PaymentDtos.*;

import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.PaymentMethodRegistration;
import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.repository.PaymentMethodRegistrationsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.PaymentSimulatorRegistrationClient.GatewayRegistration;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentProviderResolver;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

@Service
public class SavedPaymentMethodsService {
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
    private final UsersRepository usersRepository;

    @Value("${payment.registration.ttl:PT10M}")
    private Duration registrationTtl = DEFAULT_REGISTRATION_TTL;

    public SavedPaymentMethodsService(
            SavedPaymentMethodsRepository paymentMethodsRepository,
            PaymentMethodRegistrationsRepository registrationsRepository,
            PaymentsRepository paymentsRepository,
            PaymentSimulatorRegistrationClient simulatorClient,
            DeploymentPaymentProviderResolver paymentProviderResolver,
            UsersRepository usersRepository) {
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
        List<SavedPaymentMethod> all = visibleMethods(ownerId);
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
                        && isDemoSimulatorMode()
                        && pending == null,
                pending == null ? null : toRegistrationDto(pending, null));
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
        if (!isDemoSimulatorMode()) {
            return normalizeProvider(paymentProviderResolver.resolveActiveProvider(requestedProvider));
        }
        PaymentSimulatorRegistrationClient.GatewayConfiguration configuration = simulatorClient.configuration();
        String configured = normalizeProvider(configuration.provider());
        if (!configuration.connected()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The selected demo payment provider is not connected.");
        }
        String requested = normalizeId(requestedProvider);
        if (StringUtils.hasText(requested) && !configured.equalsIgnoreCase(requested)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment provider is controlled by the development simulator; this stack uses " + configured + ".");
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
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment card belongs to a different payment provider.");
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
        return new PaymentHistoryPageDto(
                items,
                all.size(),
                to < all.size() ? Integer.toString(pageIndex + 1) : null,
                spendingTotals(ownerId),
                incomeTotals(ownerId));
    }

    public PaymentHistoryPageDto queryHistory(String userId, Integer page, Integer size) {
        return queryHistory(userId, "all", page, size);
    }

    public PaymentHistoryPageDto queryHistory(
            String userId,
            String direction,
            Integer page,
            Integer size) {
        String ownerId = requiredId(userId, "Current user");
        String normalizedDirection = normalizeHistoryDirection(direction);
        List<Payment> expenses = paymentsRepository.findByUserIdOrderByCreatedDateDesc(ownerId);
        List<Payment> income = paymentsRepository.findByRecipientUserIdOrderByCreatedDateDesc(ownerId).stream()
                .filter(payment -> !ownerId.equals(normalizeId(payment.getUserId())))
                .toList();
        List<Payment> all = switch (normalizedDirection) {
            case "expenses" -> expenses;
            case "income" -> income;
            default -> mergeHistory(expenses, income);
        };
        int pageSize = Math.min(50, Math.max(1, size == null ? 20 : size));
        int pageIndex = Math.max(0, page == null ? 0 : page);
        int from = Math.min(all.size(), pageIndex * pageSize);
        int to = Math.min(all.size(), from + pageSize);
        return new PaymentHistoryPageDto(
                all.subList(from, to).stream().map(payment -> toHistoryDto(payment, ownerId)).toList(),
                all.size(),
                to < all.size() ? Integer.toString(pageIndex + 1) : null,
                spendingTotals(ownerId),
                incomeTotals(ownerId));
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
            simulatorClient.revoke(method.getProvider(), method.getProviderPaymentMethodRef());
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

    private Duration effectiveRegistrationTtl() {
        return registrationTtl == null || registrationTtl.isZero() || registrationTtl.isNegative()
                ? DEFAULT_REGISTRATION_TTL
                : registrationTtl;
    }

    private boolean isDemoSimulatorMode() {
        return MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO
                && simulatorClient.isEnabled();
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

    private PaymentHistoryItemDto toHistoryDto(Payment payment, String viewerUserId) {
        String paymentMethodId = normalizeId(payment.getPaymentMethodId());
        String userId = normalizeId(payment.getUserId());
        SavedPaymentMethodDto paymentMethod = StringUtils.hasText(paymentMethodId) && StringUtils.hasText(userId)
                ? paymentMethodsRepository.findByIdAndUserId(paymentMethodId, userId).map(this::toDto).orElse(null)
                : null;
        return new PaymentHistoryItemDto(
                payment.getId(), payment.getSourceId(),
                normalizeId(payment.getUserId()).equals(normalizeId(viewerUserId)) ? "expense" : "income",
                payment.getPaymentMethodId(), payment.getProvider(), payment.getStatus(), payment.getLastGatewayError(),
                payment.getAmount(), payment.getCurrency(), payment.getBookingStatus(),
                payment.getAuditKind(), payment.getFulfillmentKind(), payment.getCheckoutSessionId(), payment.getCreatedDate(),
                paymentMethod);
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

    private Map<String, Double> spendingTotals(String userId) {
        Map<String, Double> stored = usersRepository.findByUserId(userId)
                .map(com.raxim.myscoutee.profile.data.document.Users::getPaymentSpentTotals)
                .orElse(Map.of());
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

    private Map<String, Double> incomeTotals(String userId) {
        Map<String, Double> stored = usersRepository.findByUserId(userId)
                .map(com.raxim.myscoutee.profile.data.document.Users::getPaymentIncomeTotals)
                .orElse(Map.of());
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
