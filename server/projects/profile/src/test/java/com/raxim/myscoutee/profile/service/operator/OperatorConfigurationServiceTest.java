package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.OperatorConfigurationProperties;
import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.BrandingUpdateDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestKind;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentThemePreset;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebaseUpdateDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationUpdateDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentUpdateDto;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

import tools.jackson.databind.ObjectMapper;

class OperatorConfigurationServiceTest {
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-07-28T12:34:56Z"),
            ZoneOffset.UTC);

    @TempDir
    Path tempDir;

    @AfterEach
    void clearMongoMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void persistsReloadsMasksAndNeverStoresSecretPlaintext() throws Exception {
        Fixture fixture = fixtureWithKey();
        OperatorConfigurationService service = fixture.service();
        OperatorConfigurationUpdateDto request = updateRequest(
                "My Community",
                "/media/public?key=images%2Foperator-1%2Fbranding%2Fmedium",
                "stripe",
                "sk_live_super-secret-1234",
                "{\"private_key\":\"auth-secret-material\"}",
                "messaging-secret-material");

        var saved = service.update(request);
        DeploymentConfiguration document = fixture.persisted().get();
        String persistedJson = new ObjectMapper().writeValueAsString(document);

        assertThat(saved.branding().productName()).isEqualTo("My Community");
        assertThat(saved.branding().themePreset()).isEqualTo(DeploymentThemePreset.OCEAN);
        assertThat(saved.branding().revision()).isEqualTo(1L);
        assertThat(saved.payment().providerId()).isEqualTo("stripe");
        assertThat(saved.payment().credentialConfigured()).isTrue();
        assertThat(saved.payment().credentialMask()).isEqualTo("••••1234");
        assertThat(saved.firebase().authenticationCredentialConfigured()).isTrue();
        assertThat(saved.firebase().messagingCredentialConfigured()).isTrue();
        assertThat(saved.updatedAt()).isEqualTo("2026-07-28T12:34:56Z");
        assertThat(document.getVersion()).isEqualTo(1L);
        assertThat(persistedJson)
                .doesNotContain("sk_live_super-secret-1234")
                .doesNotContain("auth-secret-material")
                .doesNotContain("messaging-secret-material");
        assertThat(fixture.crypto().decrypt(
                DeploymentPaymentCredentialResolver.credentialPurpose("stripe"),
                document.getPayment().getCredentialEnvelope()))
                .isEqualTo("sk_live_super-secret-1234");

        OperatorConfigurationService reloaded = fixture.newService();
        var status = reloaded.configuration();
        assertThat(status.branding()).isEqualTo(saved.branding());
        assertThat(status.payment().credentialMask()).isEqualTo("••••1234");
        assertThat(status.firebase().authenticationCredentialConfigured()).isTrue();
        assertThat(status.firebase().messagingCredentialConfigured()).isTrue();

        var savedAgain = reloaded.update(updateRequest(
                "My Community",
                "/media/public?key=images%2Foperator-1%2Fbranding%2Fmedium",
                "stripe",
                "",
                "",
                ""));
        assertThat(savedAgain.branding().revision()).isEqualTo(2L);
        assertThat(savedAgain.payment().credentialConfigured()).isTrue();
        assertThat(savedAgain.payment().credentialMask()).isEqualTo("••••1234");
        assertThat(savedAgain.firebase().authenticationCredentialConfigured()).isTrue();
        assertThat(savedAgain.firebase().messagingCredentialConfigured()).isTrue();
    }

    @Test
    void validatesBrandingLengthsManagedLogoReferencesAndProviderCatalog() throws Exception {
        Fixture fixture = fixtureWithKey();

        assertBadRequest(
                () -> fixture.service().update(updateRequest(
                        "x".repeat(81),
                        "/media/public?key=images%2Flogo",
                        "stripe",
                        "",
                        "",
                        "")),
                "Product name");
        assertBadRequest(
                () -> fixture.service().update(updateRequest(
                        "Product",
                        "data:image/png;base64,c2VjcmV0",
                        "stripe",
                        "",
                        "",
                        "")),
                "Logo URL");
        assertBadRequest(
                () -> fixture.service().update(updateRequest(
                        "Product",
                        "https://evil.example/media/public?key=images%2Flogo",
                        "stripe",
                        "",
                        "",
                        "")),
                "Logo URL");
        assertBadRequest(
                () -> fixture.service().update(updateRequest(
                        "Product",
                        "/media/public?key=images%2Flogo",
                        "paypal",
                        "",
                        "",
                        "")),
                "not available");
        OperatorConfigurationUpdateDto missingTheme =
                new OperatorConfigurationUpdateDto(
                        new BrandingUpdateDto(
                                "Product",
                                "Home",
                                "/media/public?key=images%2Flogo",
                                null),
                        null,
                        null);
        assertBadRequest(
                () -> fixture.service().update(missingTheme),
                "Theme preset");
    }

    @Test
    void firebaseTestsNeverFakeSuccessWhileRuntimeMigrationIsDeferred() throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.service().update(updateRequest(
                "Product",
                "/media/public?key=images%2Flogo",
                "stripe",
                "payment-secret",
                "authentication-secret",
                "messaging-secret"));

        var authentication = fixture.service().test(new ConfigurationTestRequestDto(
                ConfigurationTestKind.FIREBASE_AUTHENTICATION));
        var messaging = fixture.service().test(new ConfigurationTestRequestDto(
                ConfigurationTestKind.FIREBASE_MESSAGING));

        assertThat(authentication.success()).isFalse();
        assertThat(authentication.message())
                .contains("FIREBASE_SERVICE_ACCOUNT_PATH")
                .contains("deferred Firebase migration");
        assertThat(messaging.success()).isFalse();
        assertThat(messaging.message())
                .contains("not wired to FirebaseApp/FirebaseMessaging")
                .contains("no registered destination token")
                .contains("deferred");
        assertThat(authentication.testedAt()).isEqualTo("2026-07-28T12:34:56Z");
        assertThat(messaging.testedAt()).isEqualTo("2026-07-28T12:34:56Z");
    }

    @Test
    void missingMasterKeyMakesOperatorCapabilityHonestlyUnavailable() {
        AtomicReference<DeploymentConfiguration> persisted =
                new AtomicReference<>(seededConfiguration());
        DeploymentConfigurationRepository repository = statefulRepository(persisted);
        PaymentProviderService providerService = providerService();
        OperatorConfigurationProperties properties = new OperatorConfigurationProperties();
        properties.setMasterKeyPath(tempDir.resolve("missing-key"));
        DeploymentConfigurationCrypto crypto =
                new DeploymentConfigurationCrypto(properties);
        OperatorConfigurationService service = new OperatorConfigurationService(
                repository,
                providerService,
                new OperatorConfigurationMapper(),
                crypto,
                FIXED_CLOCK);

        var result = service.configuration();

        assertThat(result.capability()).isEqualTo("BACKEND_UNAVAILABLE");
        assertThat(result.unavailableReason())
                .contains("Operator configuration master key is not readable");
        assertThat(result.payment().availableProviders())
                .extracting(provider -> provider.id())
                .containsExactly("stripe", "barion");
    }

    @Test
    void missingMongoSeedIsUnavailableAndNeverRepairedFromJava() throws Exception {
        AtomicReference<DeploymentConfiguration> persisted = new AtomicReference<>();
        DeploymentConfigurationRepository repository = statefulRepository(persisted);
        Path keyPath = tempDir.resolve("deployment-master-key");
        Files.writeString(
                keyPath,
                "000102030405060708090a0b0c0d0e0f"
                        + "101112131415161718191a1b1c1d1e1f\n");
        OperatorConfigurationProperties properties = new OperatorConfigurationProperties();
        properties.setMasterKeyPath(keyPath);
        OperatorConfigurationService service = new OperatorConfigurationService(
                repository,
                providerService(),
                new OperatorConfigurationMapper(),
                new DeploymentConfigurationCrypto(properties),
                FIXED_CLOCK);

        assertThatThrownBy(service::configuration)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
                            assertThat(exception.getReason())
                                    .isEqualTo("Deployment configuration seed is missing.");
                        });
        assertThat(persisted.get()).isNull();
        verify(repository, never()).save(any(DeploymentConfiguration.class));
    }

    private Fixture fixtureWithKey() throws Exception {
        Path keyPath = tempDir.resolve("deployment-master-key");
        Files.writeString(
                keyPath,
                "000102030405060708090a0b0c0d0e0f"
                        + "101112131415161718191a1b1c1d1e1f\n");
        OperatorConfigurationProperties properties = new OperatorConfigurationProperties();
        properties.setMasterKeyPath(keyPath);
        DeploymentConfigurationCrypto crypto =
                new DeploymentConfigurationCrypto(properties);
        AtomicReference<DeploymentConfiguration> persisted =
                new AtomicReference<>(seededConfiguration());
        DeploymentConfigurationRepository repository = statefulRepository(persisted);
        PaymentProviderService providerService = providerService();
        return new Fixture(
                repository,
                providerService,
                crypto,
                persisted,
                new OperatorConfigurationService(
                        repository,
                        providerService,
                        new OperatorConfigurationMapper(),
                        crypto,
                        FIXED_CLOCK));
    }

    private DeploymentConfigurationRepository statefulRepository(
            AtomicReference<DeploymentConfiguration> persisted) {
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenAnswer(invocation -> Optional.ofNullable(persisted.get()));
        when(repository.save(any(DeploymentConfiguration.class)))
                .thenAnswer(invocation -> {
                    DeploymentConfiguration value = invocation.getArgument(0);
                    value.setVersion(value.getVersion() + 1L);
                    persisted.set(value);
                    return value;
                });
        return repository;
    }

    private PaymentProviderService providerService() {
        PaymentProviderService service = mock(PaymentProviderService.class);
        List<PaymentProviderDto> providers = List.of(
                new PaymentProviderDto(
                        "stripe",
                        "Stripe",
                        "assets/payment-providers/stripe.svg",
                        "Stripe",
                        "violet"),
                new PaymentProviderDto(
                        "barion",
                        "Barion",
                        "assets/payment-providers/barion.svg",
                        "Barion",
                        "blue"));
        when(service.availableProviders()).thenReturn(providers);
        when(service.requireAvailable(eq("stripe"), anyList())).thenReturn("stripe");
        when(service.requireAvailable(eq("barion"), anyList())).thenReturn("barion");
        when(service.requireAvailable(isNull(), anyList())).thenReturn(null);
        when(service.requireAvailable(eq("paypal"), anyList()))
                .thenThrow(new IllegalArgumentException(
                        "Payment provider 'paypal' is not available."));
        return service;
    }

    private OperatorConfigurationUpdateDto updateRequest(
            String productName,
            String logoUrl,
            String providerId,
            String paymentCredential,
            String authenticationCredential,
            String messagingCredential) {
        return new OperatorConfigurationUpdateDto(
                new BrandingUpdateDto(
                        productName,
                        "Your community comes first",
                        logoUrl,
                        DeploymentThemePreset.OCEAN),
                new PaymentUpdateDto(providerId, paymentCredential),
                new FirebaseUpdateDto(
                        "community-project",
                        authenticationCredential,
                        messagingCredential));
    }

    private DeploymentConfiguration seededConfiguration() {
        DeploymentConfiguration configuration = new DeploymentConfiguration();
        configuration.setId(DeploymentConfiguration.SINGLETON_ID);
        configuration.setVersion(0L);
        configuration.setSchemaVersion(DeploymentConfiguration.SCHEMA_VERSION);
        DeploymentConfiguration.Branding branding =
                new DeploymentConfiguration.Branding();
        branding.setProductName("MyScoutee");
        branding.setHomeLabel("Your preferences come first");
        branding.setLogoUrl("assets/logo/heart.webp");
        branding.setThemePreset(DeploymentThemePreset.AURORA.name());
        branding.setRevision(0L);
        configuration.setBranding(branding);
        configuration.setPayment(new DeploymentConfiguration.Payment());
        DeploymentConfiguration.Firebase firebase =
                new DeploymentConfiguration.Firebase();
        firebase.setProjectId("");
        configuration.setFirebase(firebase);
        return configuration;
    }

    private void assertBadRequest(
            org.assertj.core.api.ThrowableAssert.ThrowingCallable callable,
            String message) {
        assertThatThrownBy(callable)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.BAD_REQUEST);
                            assertThat(exception.getReason()).contains(message);
                        });
    }

    private record Fixture(
            DeploymentConfigurationRepository repository,
            PaymentProviderService paymentProviderService,
            DeploymentConfigurationCrypto crypto,
            AtomicReference<DeploymentConfiguration> persisted,
            OperatorConfigurationService service) {
        OperatorConfigurationService newService() {
            return new OperatorConfigurationService(
                    repository,
                    paymentProviderService,
                    new OperatorConfigurationMapper(),
                    crypto,
                    FIXED_CLOCK);
        }
    }
}
