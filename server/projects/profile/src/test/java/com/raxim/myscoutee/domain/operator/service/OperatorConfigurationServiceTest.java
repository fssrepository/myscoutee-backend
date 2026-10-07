package com.raxim.myscoutee.domain.operator.service;

import com.raxim.myscoutee.domain.operator.mapper.OperatorConfigurationMapper;
import com.raxim.myscoutee.domain.payments.service.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.domain.payments.service.PaymentProviderService;
import com.raxim.myscoutee.domain.platform.service.DeploymentConfigurationCrypto;
import com.raxim.myscoutee.domain.platform.service.OperatorFirebaseCapabilityClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doThrow;
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
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.domain.operator.config.OperatorConfigurationProperties;
import com.raxim.myscoutee.domain.platform.document.DeploymentConfiguration;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.BrandingUpdateDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.ConfigurationTestKind;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.ConfigurationTestRequestDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.DeploymentSocialLinkDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.FirebaseUpdateDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.OperatorConfigurationUpdateDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentUpdateDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PrivacyContactUpdateDto;
import com.raxim.myscoutee.domain.platform.repository.DeploymentConfigurationRepository;
import com.raxim.myscoutee.domain.platform.service.AppSettingsService;
import com.raxim.myscoutee.domain.platform.service.OperatorFirebaseCapabilityClient.FirebaseWebConfiguration;

import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
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
        assertThat(saved.branding().revision()).isEqualTo(1L);
        assertThat(saved.adminEmails())
                .containsExactly("operator.admin@example.test");
        assertThat(saved.privacyContact().configured()).isTrue();
        assertThat(saved.privacyContact().dataControllerName())
                .isEqualTo("My Community Cooperative");
        assertThat(saved.privacyContact().privacyContactEmail())
                .isEqualTo("privacy@community.example");
        assertThat(saved.socialLinks())
                .containsExactly(new DeploymentSocialLinkDto(
                        "discord",
                        "Discord",
                        "https://discord.example.test/community",
                        "discord",
                        "@community"));
        assertThat(saved.payment().providerId()).isEqualTo("stripe");
        assertThat(saved.payment().publicBaseUrl())
                .isEqualTo("https://community.example.test");
        assertThat(saved.payment().credentialConfigured()).isTrue();
        assertThat(saved.payment().credentialMask()).isEqualTo("••••1234");
        assertThat(saved.firebase().authenticationCredentialConfigured()).isTrue();
        assertThat(saved.firebase().messagingCredentialConfigured()).isTrue();
        assertThat(saved.updatedAt()).isEqualTo("2026-07-28T12:34:56Z");
        assertThat(document.getVersion()).isEqualTo(1L);
        assertThat(document.getSocialLinks())
                .extracting(DeploymentConfiguration.SocialLink::getProvider)
                .containsExactly("discord");
        assertThat(document.getPrivacyContact().getDataControllerName())
                .isEqualTo("My Community Cooperative");
        assertThat(document.getPrivacyContact().getPrivacyContactEmail())
                .isEqualTo("privacy@community.example");
        assertThat(persistedJson)
                .doesNotContain("sk_live_super-secret-1234")
                .doesNotContain("auth-secret-material")
                .doesNotContain("messaging-secret-material");
        assertThat(fixture.crypto().decrypt(
                com.raxim.myscoutee.domain.payments.api.PaymentCredentialPurpose.credentialPurpose("stripe"),
                document.getPayment().getCredentialEnvelope()))
                .isEqualTo("sk_live_super-secret-1234");

        OperatorConfigurationService reloaded = fixture.newService();
        var status = reloaded.configuration();
        assertThat(status.branding()).isEqualTo(saved.branding());
        assertThat(status.privacyContact()).isEqualTo(saved.privacyContact());
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
        assertThat(savedAgain.branding().homeLabel())
                .as("localized landing copy is not an operator branding field")
                .isEqualTo("Your preferences come first");
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
                        "Community\nHub",
                        "/media/public?key=images%2Flogo",
                        "stripe",
                        "",
                        "",
                        "")),
                "invalid character");
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

    }

    @Test
    void refusesToOrphanAnExistingPaymentCredentialFromItsPublicRouting()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        OperatorConfigurationUpdateDto initial = updateRequest(
                "Product",
                "/media/public?key=images%2Flogo",
                "stripe",
                "payment-secret",
                "",
                "");
        fixture.service().update(initial);

        OperatorConfigurationUpdateDto clearing =
                new OperatorConfigurationUpdateDto(
                        initial.adminEmails(),
                        initial.privacyContact(),
                        initial.socialLinks(),
                        initial.branding(),
                        new PaymentUpdateDto("stripe", "", null, ""),
                        initial.firebase());

        assertBadRequest(
                () -> fixture.service().update(clearing),
                "public deployment URL");
    }

    @Test
    void validatesAndNormalizesAdminEmailsAndSocialLinks() throws Exception {
        Fixture fixture = fixtureWithKey();
        OperatorConfigurationUpdateDto normalized =
                new OperatorConfigurationUpdateDto(
                        List.of(
                                " Admin@One.Example ",
                                "admin@one.example"),
                        List.of(
                                new DeploymentSocialLinkDto(
                                        " Discord ",
                                        " Community chat ",
                                        "https://discord.example.test/community",
                                        " discord ",
                                        " @community "),
                                new DeploymentSocialLinkDto(
                                        "discord",
                                        "Community chat",
                                        "https://discord.example.test/community",
                                        "discord",
                                        "@community")),
                        new BrandingUpdateDto(
                                "Product",
                                null,
                                "/media/public?key=images%2Flogo"),
                        null,
                        null);

        var saved = fixture.service().update(normalized);

        assertThat(saved.adminEmails())
                .containsExactly("admin@one.example");
        assertThat(saved.socialLinks())
                .containsExactly(new DeploymentSocialLinkDto(
                        "discord",
                        "Community chat",
                        "https://discord.example.test/community",
                        "discord",
                        "@community"));

        assertBadRequest(
                () -> fixture.service().update(new OperatorConfigurationUpdateDto(
                        List.of("not-an-email"),
                        List.of(),
                        normalized.branding(),
                        null,
                        null)),
                "admin email");
        assertBadRequest(
                () -> fixture.service().update(new OperatorConfigurationUpdateDto(
                        java.util.stream.IntStream.range(0, 33)
                                .mapToObj(index -> "admin-" + index
                                        + "@example.test")
                                .toList(),
                        List.of(),
                        normalized.branding(),
                        null,
                        null)),
                "No more than 32");
        assertBadRequest(
                () -> fixture.service().update(new OperatorConfigurationUpdateDto(
                        List.of(),
                        List.of(new DeploymentSocialLinkDto(
                                "Discord!",
                                "Discord",
                                "https://discord.example.test",
                                null,
                                null)),
                        normalized.branding(),
                        null,
                        null)),
                "lowercase identifier");
        assertBadRequest(
                () -> fixture.service().update(new OperatorConfigurationUpdateDto(
                        List.of(),
                        List.of(new DeploymentSocialLinkDto(
                                "discord",
                                "Discord",
                                "http://discord.example.test",
                                null,
                                null)),
                        normalized.branding(),
                        null,
                        null)),
                "HTTPS");
        assertBadRequest(
                () -> fixture.service().update(new OperatorConfigurationUpdateDto(
                        List.of(),
                        List.of(new DeploymentSocialLinkDto(
                                "discord",
                                "Discord",
                                "https://user:password@discord.example.test",
                                null,
                                null)),
                        normalized.branding(),
                        null,
                        null)),
                "without credentials");
        assertBadRequest(
                () -> fixture.service().update(new OperatorConfigurationUpdateDto(
                        List.of(),
                        List.of(
                                new DeploymentSocialLinkDto(
                                        "discord",
                                        "Discord",
                                        "https://discord.example.test/one",
                                        null,
                                        null),
                                new DeploymentSocialLinkDto(
                                        "discord",
                                        "Another Discord",
                                        "https://discord.example.test/two",
                                        null,
                                        null)),
                        normalized.branding(),
                        null,
                        null)),
                "duplicate provider");
        assertBadRequest(
                () -> fixture.service().update(new OperatorConfigurationUpdateDto(
                        List.of(),
                        java.util.stream.IntStream.range(0, 13)
                                .mapToObj(index -> new DeploymentSocialLinkDto(
                                        "provider-" + index,
                                        "Provider " + index,
                                        "https://social" + index + ".example.test",
                                        null,
                                        null))
                                .toList(),
                        normalized.branding(),
                        null,
                        null)),
                "No more than 12");
    }

    @Test
    void privacyContactNormalizesPreservesClearsAndRejectsPartialValues()
            throws Exception {
        Fixture fixture = fixtureWithKey();

        var configured = fixture.service().update(privacyRequest(
                new PrivacyContactUpdateDto(
                        " Community Cooperative ",
                        " Privacy@Community.Example ")));

        assertThat(configured.privacyContact().configured()).isTrue();
        assertThat(configured.privacyContact().dataControllerName())
                .isEqualTo("Community Cooperative");
        assertThat(configured.privacyContact().privacyContactEmail())
                .isEqualTo("privacy@community.example");
        assertThat(fixture.persisted()
                        .get()
                        .getPrivacyContact()
                        .getPrivacyContactEmail())
                .isEqualTo("privacy@community.example");

        var preserved = fixture.service().update(privacyRequest(null));
        assertThat(preserved.privacyContact()).isEqualTo(configured.privacyContact());

        assertBadRequest(
                () -> fixture.service().update(privacyRequest(
                        new PrivacyContactUpdateDto(
                                "Community Cooperative",
                                ""))),
                "both be configured or both be blank");
        assertBadRequest(
                () -> fixture.service().update(privacyRequest(
                        new PrivacyContactUpdateDto(
                                "",
                                "privacy@community.example"))),
                "both be configured or both be blank");
        assertBadRequest(
                () -> fixture.service().update(privacyRequest(
                        new PrivacyContactUpdateDto(
                                "Community Cooperative",
                                "not-an-email"))),
                "Privacy contact email");
        assertBadRequest(
                () -> fixture.service().update(privacyRequest(
                        new PrivacyContactUpdateDto(
                                "Community\nCooperative",
                                "privacy@community.example"))),
                "invalid character");

        var cleared = fixture.service().update(privacyRequest(
                new PrivacyContactUpdateDto(" ", " ")));
        assertThat(cleared.privacyContact().configured()).isFalse();
        assertThat(cleared.privacyContact().dataControllerName()).isEmpty();
        assertThat(cleared.privacyContact().privacyContactEmail()).isEmpty();
        assertThat(fixture.persisted()
                        .get()
                        .getPrivacyContact()
                        .getDataControllerName())
                .isEmpty();
        assertThat(fixture.persisted()
                        .get()
                        .getPrivacyContact()
                        .getPrivacyContactEmail())
                .isEmpty();
    }

    @Test
    void supportsNoWordmarkLogoAndUsesUnicodeCodePoints()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        OperatorConfigurationUpdateDto selectedCharacter =
                brandingOnlyRequest("A🌟B", 1);

        var selected = fixture.service().update(selectedCharacter);

        assertThat(selected.branding().logoCharacterIndex()).isEqualTo(1);
        assertThat(fixture.persisted()
                        .get()
                        .getBranding()
                        .getLogoCharacterIndex())
                .isEqualTo(1);

        var noWordmarkLogo = fixture.service().update(
                brandingOnlyRequest("A🌟B", -1));
        assertThat(noWordmarkLogo.branding().logoCharacterIndex()).isEqualTo(-1);
        assertThat(fixture.persisted()
                        .get()
                        .getBranding()
                        .getLogoCharacterIndex())
                .isEqualTo(-1);

        var fullName = fixture.service().update(
                brandingOnlyRequest("A🌟B", null));
        assertThat(fullName.branding().logoCharacterIndex()).isZero();
        assertThat(fixture.persisted()
                        .get()
                        .getBranding()
                        .getLogoCharacterIndex())
                .isZero();

        assertBadRequest(
                () -> fixture.service().update(
                        brandingOnlyRequest("A🌟B", -2)),
                "Logo character index");
        assertBadRequest(
                () -> fixture.service().update(
                        brandingOnlyRequest("A🌟B", 3)),
                "Logo character index");
        assertThat(fixture.persisted()
                        .get()
                        .getBranding()
                        .getLogoCharacterIndex())
                .as("invalid indices are rejected rather than clamped")
                .isZero();
    }

    @Test
    void clearsPersistedLogoUrl() throws Exception {
        Fixture fixture = fixtureWithKey();
        OperatorConfigurationUpdateDto request =
                new OperatorConfigurationUpdateDto(
                        List.of(),
                        List.of(),
                        new BrandingUpdateDto(
                                "Product",
                                -1,
                                ""),
                        null,
                        null);

        var cleared = fixture.service().update(request);

        assertThat(cleared.branding().logoUrl()).isEmpty();
        assertThat(cleared.branding().logoCharacterIndex()).isEqualTo(-1);
        assertThat(fixture.persisted().get().getBranding().getLogoUrl())
                .isEmpty();
    }

    @Test
    void invalidPersistedLogoCharacterIndexIsUnavailableAndNeverRepaired()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.persisted()
                .get()
                .getBranding()
                .setLogoCharacterIndex(9);

        assertThatThrownBy(fixture.service()::configuration)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(
                                            HttpStatus.SERVICE_UNAVAILABLE);
                            assertThat(exception.getReason())
                                    .contains(
                                            "invalid logo character index");
                        });
        assertThat(fixture.persisted()
                        .get()
                        .getBranding()
                        .getLogoCharacterIndex())
                .isEqualTo(9);
        verify(fixture.repository(), never())
                .save(any(DeploymentConfiguration.class));
    }

    @Test
    void partialPersistedPrivacyContactIsUnavailableAndNeverRepaired()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.persisted()
                .get()
                .getPrivacyContact()
                .setDataControllerName("Community Cooperative");

        assertThatThrownBy(fixture.service()::configuration)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
                            assertThat(exception.getReason())
                                    .contains("privacy-contact seed is invalid");
                        });
        assertThat(fixture.persisted()
                        .get()
                        .getPrivacyContact()
                        .getDataControllerName())
                .isEqualTo("Community Cooperative");
        assertThat(fixture.persisted()
                        .get()
                        .getPrivacyContact()
                        .getPrivacyContactEmail())
                .isEmpty();
        verify(fixture.repository(), never())
                .save(any(DeploymentConfiguration.class));
    }

    @Test
    void firebaseTestsUseDecryptedOperatorCredentialsThroughIsolatedClient()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.service().update(updateRequest(
                "Product",
                "/media/public?key=images%2Flogo",
                "stripe",
                "payment-secret",
                "{\"type\":\"service_account\",\"private_key\":\"authentication-secret\"}",
                "{\"type\":\"service_account\",\"private_key\":\"messaging-secret\"}"));

        var authentication = fixture.service().test(new ConfigurationTestRequestDto(
                ConfigurationTestKind.FIREBASE_AUTHENTICATION));
        var messaging = fixture.service().test(
                messagingTestRequest(fixture, "destination-token"));

        assertThat(authentication.success()).isTrue();
        assertThat(authentication.message())
                .contains("browser configuration tests succeeded");
        assertThat(messaging.success()).isTrue();
        assertThat(messaging.message())
                .contains("browser messaging readiness test succeeded");
        assertThat(authentication.testedAt()).isEqualTo("2026-07-28T12:34:56Z");
        assertThat(messaging.testedAt()).isEqualTo("2026-07-28T12:34:56Z");
        assertThat(authentication.firebase()
                        .authenticationTestedAt())
                .isEqualTo("2026-07-28T12:34:56Z");
        assertThat(messaging.firebase()
                        .messagingTestedAt())
                .isEqualTo("2026-07-28T12:34:56Z");
        verify(fixture.firebaseCapabilityClient()).testAuthentication(
                "community-project",
                "{\"type\":\"service_account\",\"private_key\":\"authentication-secret\"}",
                firebaseWebConfiguration());
        verify(fixture.firebaseCapabilityClient()).sendTestMessage(
                "community-project",
                "{\"type\":\"service_account\",\"private_key\":\"messaging-secret\"}",
                firebaseWebConfiguration(),
                "browser-generated-token",
                "destination-token",
                "Product");
    }

    @Test
    void publicFirebaseConfigurationIsAbsentForDemoAndInactiveDeployment()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.persisted().get().getFirebase().setActive(false);
        assertThat(fixture.service().publicFirebaseConfiguration()).isNull();

        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        assertThat(fixture.service().publicFirebaseConfiguration()).isNull();
    }

    @Test
    void firebaseActivationAllowsNoStorageBucketAndPublishesOnlyClientData()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.service().update(updateRequest(
                "Product",
                "/media/public?key=images%2Flogo",
                "stripe",
                "payment-secret",
                "{\"type\":\"service_account\",\"private_key\":\"authentication-secret\"}",
                "{\"type\":\"service_account\",\"private_key\":\"messaging-secret\"}"));

        assertThatThrownBy(fixture.service()::activateFirebase)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode())
                                .isEqualTo(HttpStatus.CONFLICT));

        fixture.service().test(new ConfigurationTestRequestDto(
                ConfigurationTestKind.FIREBASE_AUTHENTICATION));
        fixture.service().test(
                messagingTestRequest(fixture, "destination-token"));

        var activated = fixture.service().activateFirebase();
        var publicConfiguration =
                fixture.service().publicFirebaseConfiguration();

        assertThat(activated.firebase().active()).isTrue();
        assertThat(activated.firebase().readyToActivate()).isTrue();
        assertThat(activated.firebase().activatedAt())
                .isEqualTo("2026-07-28T12:34:56Z");
        assertThat(publicConfiguration.projectId())
                .isEqualTo("community-project");
        assertThat(publicConfiguration.apiKey())
                .isEqualTo("browser-api-key");
        assertThat(publicConfiguration.storageBucket()).isEmpty();
        assertThat(publicConfiguration.vapidKey())
                .isEqualTo("public-vapid-key");
        assertThat(publicConfiguration.toString())
                .doesNotContain("private_key")
                .doesNotContain("authentication-secret")
                .doesNotContain("messaging-secret");

        doThrow(new IllegalStateException("upstream failure"))
                .when(fixture.firebaseCapabilityClient())
                .testAuthentication(any(), any(), any());
        var failed = fixture.service().test(
                new ConfigurationTestRequestDto(
                        ConfigurationTestKind.FIREBASE_AUTHENTICATION));

        assertThat(failed.success()).isFalse();
        assertThat(failed.firebase().active()).isFalse();
        assertThat(failed.firebase().activatedAt()).isNull();
        assertThat(fixture.service().publicFirebaseConfiguration()).isNull();
    }

    @Test
    void staleBrowserMessagingProofFailsClosedAndClearsCurrentReadiness()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.service().update(updateRequest(
                "Product",
                "/media/public?key=images%2Flogo",
                "stripe",
                "payment-secret",
                "authentication-secret",
                "messaging-secret"));
        fixture.service().test(new ConfigurationTestRequestDto(
                ConfigurationTestKind.FIREBASE_AUTHENTICATION));
        fixture.service().test(
                messagingTestRequest(fixture, null));
        fixture.service().activateFirebase();
        var publicConfiguration = fixture.service()
                .configuration()
                .firebase()
                .publicConfiguration();

        var stale = fixture.service().test(
                new ConfigurationTestRequestDto(
                        ConfigurationTestKind.FIREBASE_MESSAGING,
                        null,
                        "browser-generated-token",
                        publicConfiguration.revision() - 1L,
                        publicConfiguration.appId()));

        assertThat(stale.success()).isFalse();
        assertThat(stale.message())
                .contains("current saved configuration is required");
        assertThat(stale.firebase().active()).isFalse();
        assertThat(stale.firebase().readyToActivate()).isFalse();
        assertThat(stale.firebase().messagingTestedAt()).isNull();
    }

    @Test
    void firebaseTestFailuresAreSafeAndMessagingRequiresCurrentBrowserProof()
            throws Exception {
        Fixture fixture = fixtureWithKey();
        fixture.service().update(updateRequest(
                "Product",
                "/media/public?key=images%2Flogo",
                "stripe",
                "payment-secret",
                "authentication-super-secret",
                "messaging-super-secret"));
        doThrow(new IllegalStateException(
                "upstream leaked authentication-super-secret"))
                .when(fixture.firebaseCapabilityClient())
                .testAuthentication(any(), any(), any());

        var authentication = fixture.service().test(
                new ConfigurationTestRequestDto(
                        ConfigurationTestKind.FIREBASE_AUTHENTICATION));
        var missingBrowserProof = fixture.service().test(
                new ConfigurationTestRequestDto(
                        ConfigurationTestKind.FIREBASE_MESSAGING));

        assertThat(authentication.success()).isFalse();
        assertThat(authentication.message())
                .isEqualTo(
                        "Firebase authentication test failed. Check the configured "
                                + "web app, browser API key, project, and "
                                + "service-account permissions.")
                .doesNotContain("super-secret");
        assertThat(authentication.firebase()).isNotNull();
        assertThat(authentication.firebase().active()).isFalse();
        assertThat(missingBrowserProof.success()).isFalse();
        assertThat(missingBrowserProof.message())
                .contains("current saved configuration is required");
        verify(fixture.firebaseCapabilityClient(), never())
                .sendTestMessage(
                        any(),
                        any(),
                        any(),
                        any(),
                        any(),
                        any());
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
        AppSettingsService appSettingsService = appSettingsService();
        OperatorConfigurationService service = new OperatorConfigurationService(
                repository,
                appSettingsService,
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
        AppSettingsService appSettingsService = appSettingsService();
        OperatorConfigurationService service = new OperatorConfigurationService(
                repository,
                appSettingsService,
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
        AppSettingsService appSettingsService = appSettingsService();
        OperatorFirebaseCapabilityClient firebaseCapabilityClient =
                mock(OperatorFirebaseCapabilityClient.class);
        return new Fixture(
                repository,
                appSettingsService,
                providerService,
                crypto,
                firebaseCapabilityClient,
                persisted,
                new OperatorConfigurationService(
                        repository,
                        appSettingsService,
                        providerService,
                        new OperatorConfigurationMapper(),
                        crypto,
                        FIXED_CLOCK,
                        firebaseCapabilityClient));
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

    private AppSettingsService appSettingsService() {
        AppSettingsService service = mock(AppSettingsService.class);
        when(service.adminEmails()).thenReturn(List.of());
        when(service.updateAdminEmails(anyList()))
                .thenAnswer(invocation -> List.copyOf(
                        invocation.getArgument(0)));
        return service;
    }

    private List<DeploymentSocialLinkDto> socialLinks() {
        return List.of(new DeploymentSocialLinkDto(
                "discord",
                "Discord",
                "https://discord.example.test/community",
                "discord",
                "@community"));
    }

    private OperatorConfigurationUpdateDto updateRequest(
            String productName,
            String logoUrl,
            String providerId,
            String paymentCredential,
            String authenticationCredential,
            String messagingCredential) {
        return new OperatorConfigurationUpdateDto(
                List.of("Operator.Admin@Example.Test"),
                new PrivacyContactUpdateDto(
                        " My Community Cooperative ",
                        " Privacy@Community.Example "),
                socialLinks(),
                new BrandingUpdateDto(
                        productName,
                        null,
                        logoUrl),
                new PaymentUpdateDto(
                        providerId,
                        "https://community.example.test/",
                        "barion".equals(providerId)
                                ? "merchant@example.test"
                                : null,
                        paymentCredential),
                new FirebaseUpdateDto(
                        "community-project",
                        "browser-api-key",
                        "community-project.firebaseapp.com",
                        "",
                        "123456789",
                        "1:123456789:web:community",
                        "G-COMMUNITY",
                        "public-vapid-key",
                        authenticationCredential,
                        messagingCredential));
    }

    private OperatorConfigurationUpdateDto brandingOnlyRequest(
            String productName,
            Integer logoCharacterIndex) {
        return new OperatorConfigurationUpdateDto(
                List.of(),
                List.of(),
                new BrandingUpdateDto(
                        productName,
                        logoCharacterIndex,
                        "/media/public?key=images%2Foperator%2Fbranding"),
                null,
                null);
    }

    private OperatorConfigurationUpdateDto privacyRequest(
            PrivacyContactUpdateDto privacyContact) {
        return new OperatorConfigurationUpdateDto(
                List.of(),
                privacyContact,
                List.of(),
                new BrandingUpdateDto(
                        "Product",
                        null,
                        "/media/public?key=images%2Foperator%2Fbranding"),
                null,
                null);
    }

    private FirebaseWebConfiguration firebaseWebConfiguration() {
        return new FirebaseWebConfiguration(
                "browser-api-key",
                "community-project.firebaseapp.com",
                "",
                "123456789",
                "1:123456789:web:community",
                "G-COMMUNITY",
                "public-vapid-key");
    }

    private ConfigurationTestRequestDto messagingTestRequest(
            Fixture fixture,
            String optionalDestinationToken) {
        var publicConfiguration = fixture.service()
                .configuration()
                .firebase()
                .publicConfiguration();
        return new ConfigurationTestRequestDto(
                ConfigurationTestKind.FIREBASE_MESSAGING,
                optionalDestinationToken,
                "browser-generated-token",
                publicConfiguration.revision(),
                publicConfiguration.appId());
    }

    private DeploymentConfiguration seededConfiguration() {
        DeploymentConfiguration configuration = new DeploymentConfiguration();
        configuration.setId(DeploymentConfiguration.SINGLETON_ID);
        configuration.setVersion(0L);
        configuration.setSchemaVersion(DeploymentConfiguration.SCHEMA_VERSION);
        DeploymentConfiguration.Branding branding =
                new DeploymentConfiguration.Branding();
        branding.setProductName("MyScoutee");
        branding.setLogoCharacterIndex(null);
        branding.setHomeLabel("Your preferences come first");
        branding.setLogoUrl("assets/logo/heart.webp");

        branding.setRevision(0L);
        configuration.setBranding(branding);
        configuration.setSocialLinks(List.of());
        DeploymentConfiguration.PrivacyContact privacyContact =
                new DeploymentConfiguration.PrivacyContact();
        privacyContact.setDataControllerName("");
        privacyContact.setPrivacyContactEmail("");
        configuration.setPrivacyContact(privacyContact);
        configuration.setIntegration(new DeploymentConfiguration.Integration());
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
            AppSettingsService appSettingsService,
            PaymentProviderService paymentProviderService,
            DeploymentConfigurationCrypto crypto,
            OperatorFirebaseCapabilityClient firebaseCapabilityClient,
            AtomicReference<DeploymentConfiguration> persisted,
            OperatorConfigurationService service) {
        OperatorConfigurationService newService() {
            return new OperatorConfigurationService(
                    repository,
                    appSettingsService,
                    paymentProviderService,
                    new OperatorConfigurationMapper(),
                    crypto,
                    FIXED_CLOCK,
                    firebaseCapabilityClient);
        }
    }
}
