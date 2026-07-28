package com.raxim.myscoutee.profile.service.operator;

import java.net.URI;
import java.time.Clock;
import java.time.Instant;
import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.BrandingUpdateDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestKind;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestResultDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentBrandingDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentThemePreset;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebaseUpdateDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationUpdateDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentUpdateDto;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

@Service
public class OperatorConfigurationService {
    static final String FIREBASE_AUTHENTICATION_PURPOSE =
            "firebase-authentication-credential";
    static final String FIREBASE_MESSAGING_PURPOSE =
            "firebase-messaging-credential";

    private static final String DEFAULT_LOGO_WEBP = "assets/logo/heart.webp";
    private static final String DEFAULT_LOGO_PNG = "assets/logo/heart.png";
    private static final int PRODUCT_NAME_MAX = 80;
    private static final int HOME_LABEL_MAX = 120;
    private static final int LOGO_URL_MAX = 2048;
    private static final int PROVIDER_ID_MAX = 64;
    private static final int PAYMENT_CREDENTIAL_MAX = 16384;
    private static final int FIREBASE_PROJECT_ID_MAX = 160;
    private static final int FIREBASE_CREDENTIAL_MAX = 65536;

    private final DeploymentConfigurationRepository repository;
    private final PaymentProviderService paymentProviderService;
    private final OperatorConfigurationMapper mapper;
    private final DeploymentConfigurationCrypto crypto;
    private final Clock clock;
    private final EnumMap<MongoSessionMode, Object> modeLocks =
            new EnumMap<>(MongoSessionMode.class);

    @Autowired
    public OperatorConfigurationService(
            DeploymentConfigurationRepository repository,
            PaymentProviderService paymentProviderService,
            OperatorConfigurationMapper mapper,
            DeploymentConfigurationCrypto crypto) {
        this(
                repository,
                paymentProviderService,
                mapper,
                crypto,
                Clock.systemUTC());
    }

    OperatorConfigurationService(
            DeploymentConfigurationRepository repository,
            PaymentProviderService paymentProviderService,
            OperatorConfigurationMapper mapper,
            DeploymentConfigurationCrypto crypto,
            Clock clock) {
        this.repository = Objects.requireNonNull(repository);
        this.paymentProviderService = Objects.requireNonNull(paymentProviderService);
        this.mapper = Objects.requireNonNull(mapper);
        this.crypto = Objects.requireNonNull(crypto);
        this.clock = Objects.requireNonNull(clock);
        for (MongoSessionMode mode : MongoSessionMode.values()) {
            modeLocks.put(mode, new Object());
        }
    }

    public DeploymentBrandingDto branding() {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            return mapper.toBranding(loadPersisted());
        }
    }

    public OperatorConfigurationDto configuration() {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            DeploymentConfiguration configuration = loadPersisted();
            List<PaymentProviderDto> providers;
            String unavailableReason = crypto.unavailableReason(configuration);
            try {
                providers = paymentProviderService.availableProviders();
            } catch (RuntimeException exception) {
                providers = List.of();
                unavailableReason = appendReason(
                        unavailableReason,
                        "Payment provider catalog is unavailable: "
                                + safeMessage(exception));
            }
            return mapper.toOperatorConfiguration(
                    configuration,
                    providers,
                    unavailableReason);
        }
    }

    public OperatorConfigurationDto update(OperatorConfigurationUpdateDto request) {
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            if (request == null || request.branding() == null) {
                throw badRequest("Branding configuration is required.");
            }
            DeploymentConfiguration configuration = loadPersisted();
            String cryptoGap = crypto.unavailableReason(configuration);
            if (StringUtils.hasText(cryptoGap)) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        cryptoGap);
            }
            List<PaymentProviderDto> providers;
            try {
                providers = paymentProviderService.availableProviders();
            } catch (RuntimeException exception) {
                throw new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "Payment provider catalog is unavailable: "
                                + safeMessage(exception),
                        exception);
            }
            applyBranding(configuration, request.branding());
            applyPayment(configuration, request.payment(), providers);
            applyFirebase(configuration, request.firebase());
            configuration.setSchemaVersion(DeploymentConfiguration.SCHEMA_VERSION);
            configuration.setUpdatedAt(clock.instant().toString());
            DeploymentConfiguration saved = saveUpdate(configuration);
            return mapper.toOperatorConfiguration(saved, providers, null);
        }
    }

    public ConfigurationTestResultDto test(ConfigurationTestRequestDto request) {
        if (request == null || request.kind() == null) {
            throw badRequest("Configuration test kind is required.");
        }
        MongoSessionMode mode = MongoSessionModeContext.currentMode();
        synchronized (modeLocks.get(mode)) {
            DeploymentConfiguration configuration = loadPersisted();
            DeploymentConfiguration.Firebase firebase = configuration.getFirebase();
            Instant testedAt = clock.instant();
            return switch (request.kind()) {
                case FIREBASE_AUTHENTICATION -> firebaseTestResult(
                        ConfigurationTestKind.FIREBASE_AUTHENTICATION,
                        StringUtils.hasText(firebase.getProjectId())
                                && firebase.getAuthenticationCredentialEnvelope() != null,
                        "Firebase authentication test unavailable: projectId and "
                                + "authentication credential must be configured.",
                        "Firebase authentication test unavailable: operator-managed "
                                + "credentials are encrypted and persisted, but the "
                                + "authentication runtime still initializes once from "
                                + "FIREBASE_SERVICE_ACCOUNT_PATH. Rewiring that runtime "
                                + "is the deferred Firebase migration.",
                        testedAt);
                case FIREBASE_MESSAGING -> firebaseTestResult(
                        ConfigurationTestKind.FIREBASE_MESSAGING,
                        StringUtils.hasText(firebase.getProjectId())
                                && firebase.getMessagingCredentialEnvelope() != null,
                        "Firebase messaging test unavailable: projectId and messaging "
                                + "credential must be configured.",
                        "Firebase messaging test unavailable: operator-managed credentials "
                                + "are not wired to FirebaseApp/FirebaseMessaging, and this "
                                + "request has no registered destination token. That runtime "
                                + "migration is deferred.",
                        testedAt);
            };
        }
    }

    private ConfigurationTestResultDto firebaseTestResult(
            ConfigurationTestKind kind,
            boolean configured,
            String missingMessage,
            String migrationGapMessage,
            Instant testedAt) {
        return new ConfigurationTestResultDto(
                kind,
                false,
                configured ? migrationGapMessage : missingMessage,
                testedAt.toString());
    }

    private DeploymentConfiguration loadPersisted() {
        return repository.findById(DeploymentConfiguration.SINGLETON_ID)
                .map(this::requireCompleteSeed)
                .orElseThrow(() -> unavailable(
                        "Deployment configuration seed is missing."));
    }

    private DeploymentConfiguration requireCompleteSeed(
            DeploymentConfiguration configuration) {
        if (!DeploymentConfiguration.SINGLETON_ID.equals(configuration.getId())
                || configuration.getVersion() == null
                || configuration.getSchemaVersion() == null
                || configuration.getSchemaVersion()
                        != DeploymentConfiguration.SCHEMA_VERSION
                || configuration.getBranding() == null
                || configuration.getPayment() == null
                || configuration.getFirebase() == null) {
            throw unavailable(
                    "Deployment configuration seed is incomplete or unsupported.");
        }
        DeploymentConfiguration.Branding branding = configuration.getBranding();
        if (!StringUtils.hasText(branding.getProductName())
                || !StringUtils.hasText(branding.getHomeLabel())
                || branding.getLogoUrl() == null
                || !StringUtils.hasText(branding.getThemePreset())
                || branding.getRevision() == null
                || branding.getRevision() < 0L) {
            throw unavailable(
                    "Deployment branding seed is incomplete.");
        }
        if (!validLogoCharacterIndex(
                branding.getProductName().trim(),
                branding.getLogoCharacterIndex())) {
            throw unavailable(
                    "Deployment branding seed has an invalid logo character index.");
        }
        try {
            DeploymentThemePreset.valueOf(branding.getThemePreset());
        } catch (IllegalArgumentException exception) {
            throw unavailable(
                    "Deployment branding seed has an unsupported theme.",
                    exception);
        }
        if (configuration.getFirebase().getProjectId() == null) {
            throw unavailable(
                    "Deployment Firebase seed is incomplete.");
        }
        DeploymentConfiguration.Payment payment = configuration.getPayment();
        if (payment.getCredentialEnvelope() != null
                && (!StringUtils.hasText(payment.getProviderId())
                        || !StringUtils.hasText(payment.getCredentialMask()))) {
            throw unavailable(
                    "Deployment payment configuration is incomplete.");
        }
        return configuration;
    }

    private DeploymentConfiguration saveUpdate(
            DeploymentConfiguration configuration) {
        try {
            return repository.save(configuration);
        } catch (OptimisticLockingFailureException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Deployment configuration changed concurrently; reload it and retry.",
                    exception);
        }
    }

    private void applyBranding(
            DeploymentConfiguration configuration,
            BrandingUpdateDto request) {
        String productName = requiredTrimmed(
                request.productName(),
                "Product name",
                PRODUCT_NAME_MAX);
        Integer logoCharacterIndex = request.logoCharacterIndex();
        if (!validLogoCharacterIndex(productName, logoCharacterIndex)) {
            throw badRequest(
                    "Logo character index must identify a Unicode character "
                            + "in the product name.");
        }
        String homeLabel = requiredTrimmed(
                request.homeLabel(),
                "Home label",
                HOME_LABEL_MAX);
        String logoUrl = validateLogoUrl(request.logoUrl());
        if (request.themePreset() == null) {
            throw badRequest("Theme preset is required.");
        }

        DeploymentConfiguration.Branding branding = configuration.getBranding();
        branding.setProductName(productName);
        branding.setLogoCharacterIndex(logoCharacterIndex);
        branding.setHomeLabel(homeLabel);
        branding.setLogoUrl(logoUrl);
        branding.setThemePreset(request.themePreset().name());
        long currentRevision = branding.getRevision();
        if (currentRevision == Long.MAX_VALUE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Branding revision cannot be advanced.");
        }
        branding.setRevision(currentRevision + 1L);
    }

    private boolean validLogoCharacterIndex(
            String productName,
            Integer logoCharacterIndex) {
        if (logoCharacterIndex == null) {
            return true;
        }
        int characterCount = productName.codePointCount(
                0,
                productName.length());
        return logoCharacterIndex >= 0
                && logoCharacterIndex < characterCount;
    }

    private void applyPayment(
            DeploymentConfiguration configuration,
            PaymentUpdateDto request,
            List<PaymentProviderDto> providers) {
        if (request == null) {
            return;
        }
        if (request.providerId() != null
                && request.providerId().trim().length() > PROVIDER_ID_MAX) {
            throw badRequest("Payment provider id is too long.");
        }
        DeploymentConfiguration.Payment payment = configuration.getPayment();
        String previousProvider = normalizeProvider(payment.getProviderId());
        String provider;
        try {
            provider = paymentProviderService.requireAvailable(
                    request.providerId(),
                    providers);
        } catch (IllegalArgumentException exception) {
            throw badRequest(exception.getMessage());
        }

        String credential = optionalSecret(
                request.credential(),
                "Payment credential",
                PAYMENT_CREDENTIAL_MAX);
        if (StringUtils.hasText(credential) && !StringUtils.hasText(provider)) {
            throw badRequest(
                    "A payment provider must be selected before its credential is saved.");
        }

        boolean providerChanged = !Objects.equals(previousProvider, provider);
        payment.setProviderId(provider);
        if (!StringUtils.hasText(provider)) {
            payment.setCredentialEnvelope(null);
            payment.setCredentialMask(null);
        } else if (StringUtils.hasText(credential)) {
            payment.setCredentialEnvelope(crypto.encrypt(
                    DeploymentPaymentCredentialResolver.credentialPurpose(provider),
                    credential));
            payment.setCredentialMask(maskCredential(credential));
        } else if (providerChanged) {
            payment.setCredentialEnvelope(null);
            payment.setCredentialMask(null);
        }
    }

    private void applyFirebase(
            DeploymentConfiguration configuration,
            FirebaseUpdateDto request) {
        if (request == null) {
            return;
        }
        DeploymentConfiguration.Firebase firebase = configuration.getFirebase();
        if (request.projectId() != null) {
            firebase.setProjectId(optionalTrimmed(
                    request.projectId(),
                    "Firebase project id",
                    FIREBASE_PROJECT_ID_MAX));
        }
        String authenticationCredential = optionalSecret(
                request.authenticationCredential(),
                "Firebase authentication credential",
                FIREBASE_CREDENTIAL_MAX);
        String messagingCredential = optionalSecret(
                request.messagingCredential(),
                "Firebase messaging credential",
                FIREBASE_CREDENTIAL_MAX);
        if (StringUtils.hasText(authenticationCredential)) {
            firebase.setAuthenticationCredentialEnvelope(crypto.encrypt(
                    FIREBASE_AUTHENTICATION_PURPOSE,
                    authenticationCredential));
        }
        if (StringUtils.hasText(messagingCredential)) {
            firebase.setMessagingCredentialEnvelope(crypto.encrypt(
                    FIREBASE_MESSAGING_PURPOSE,
                    messagingCredential));
        }
    }

    private String validateLogoUrl(String value) {
        String logoUrl = optionalTrimmed(value, "Logo URL", LOGO_URL_MAX);
        if (!StringUtils.hasText(logoUrl)
                || DEFAULT_LOGO_WEBP.equals(logoUrl)
                || DEFAULT_LOGO_PNG.equals(logoUrl)) {
            return logoUrl;
        }
        try {
            URI uri = URI.create(logoUrl);
            boolean managedPath = "/media/public".equals(uri.getPath());
            boolean supportedLocation = !uri.isAbsolute()
                    && logoUrl.startsWith("/media/public?");
            if (!managedPath
                    || !supportedLocation
                    || uri.getFragment() != null
                    || !hasMediaKey(uri.getRawQuery())) {
                throw badRequest(
                        "Logo URL must be a persisted /media/public?key= reference "
                                + "returned by the media upload flow.");
            }
            return logoUrl;
        } catch (IllegalArgumentException exception) {
            throw badRequest(
                    "Logo URL must be a valid persisted media reference.");
        }
    }

    private boolean hasMediaKey(String rawQuery) {
        if (!StringUtils.hasText(rawQuery)) {
            return false;
        }
        for (String parameter : rawQuery.split("&")) {
            int separator = parameter.indexOf('=');
            if (separator > 0
                    && "key".equals(parameter.substring(0, separator))
                    && separator < parameter.length() - 1) {
                return true;
            }
        }
        return false;
    }

    private String requiredTrimmed(String value, String fieldName, int maxLength) {
        String normalized = optionalTrimmed(value, fieldName, maxLength);
        if (!StringUtils.hasText(normalized)) {
            throw badRequest(fieldName + " is required.");
        }
        return normalized;
    }

    private String optionalTrimmed(String value, String fieldName, int maxLength) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.length() > maxLength) {
            throw badRequest(fieldName + " must not exceed " + maxLength + " characters.");
        }
        return normalized;
    }

    private String optionalSecret(String value, String fieldName, int maxLength) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.length() > maxLength) {
            throw badRequest(fieldName + " is too large.");
        }
        return normalized;
    }

    private String normalizeProvider(String value) {
        return StringUtils.hasText(value)
                ? value.trim().toLowerCase(Locale.ROOT)
                : null;
    }

    private String maskCredential(String credential) {
        String normalized = credential == null ? "" : credential.trim();
        if (normalized.length() <= 4) {
            return "••••";
        }
        return "••••" + normalized.substring(normalized.length() - 4);
    }

    private String appendReason(String first, String second) {
        if (!StringUtils.hasText(first)) {
            return second;
        }
        return first.trim() + " " + second;
    }

    private String safeMessage(RuntimeException exception) {
        return StringUtils.hasText(exception.getMessage())
                ? exception.getMessage().trim()
                : exception.getClass().getSimpleName();
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                message);
    }

    private ResponseStatusException unavailable(
            String message,
            RuntimeException cause) {
        return new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                message,
                cause);
    }
}
