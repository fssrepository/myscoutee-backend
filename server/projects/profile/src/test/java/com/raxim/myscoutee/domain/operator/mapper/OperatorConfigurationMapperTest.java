package com.raxim.myscoutee.domain.operator.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.platform.document.DeploymentConfiguration;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.FirebaseUpdateDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentUpdateDto;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
class OperatorConfigurationMapperTest {
    private final ObjectMapper objectMapper = new JsonConfig().objectMapper();

    @Test
    void configurationUsesOneVersionedDeploymentSingletonCollection() throws Exception {
        Document document = DeploymentConfiguration.class.getAnnotation(Document.class);
        Field version = DeploymentConfiguration.class.getDeclaredField("version");

        assertThat(document.collection()).isEqualTo("deploymentConfigurations");
        assertThat(version.getAnnotation(Version.class)).isNotNull();
        assertThat(new DeploymentConfiguration().getId()).isNull();
    }

    @Test
    void configurationDefaultsLiveOnlyInVersionedMongoSeeds() throws Exception {
        DeploymentConfiguration empty = new DeploymentConfiguration();
        assertThat(empty.getSchemaVersion()).isNull();
        assertThat(empty.getBranding()).isNull();
        assertThat(empty.getSocialLinks()).isNull();
        assertThat(empty.getPrivacyContact()).isNull();
        assertThat(empty.getIntegration()).isNull();
        assertThat(empty.getPayment()).isNull();
        assertThat(empty.getFirebase()).isNull();

        Path seedRoot = locateSeedRoot();
        for (String database : List.of("myscoutee_db", "demo_db", "e2e_db")) {
            String seedJson = Files.readString(
                    seedRoot.resolve(database)
                            .resolve("deploymentConfigurations.json"));
            JsonNode seed = objectMapper.readTree(seedJson);
            assertThat(seed.size()).isEqualTo(1);
            JsonNode singleton = seed.get(0);
            assertThat(singleton.path("_id").asText())
                    .isEqualTo(DeploymentConfiguration.SINGLETON_ID);
            assertThat(singleton.path("schemaVersion").asInt())
                    .isEqualTo(DeploymentConfiguration.SCHEMA_VERSION);
            assertThat(singleton.path("version").asLong()).isZero();
            assertThat(singleton.path("branding").has("themePreset")).isFalse();
            assertThat(singleton.path("branding")
                            .has("logoCharacterIndex"))
                    .isTrue();
            assertThat(singleton.path("branding")
                            .get("logoCharacterIndex")
                            .asInt())
                    .isZero();
            assertThat(singleton.path("socialLinks").isArray()).isTrue();
            JsonNode privacyContact = singleton.path("privacyContact");
            assertThat(privacyContact.propertyNames())
                    .containsExactlyInAnyOrder(
                            "dataControllerName",
                            "privacyContactEmail");
            if ("myscoutee_db".equals(database)) {
                assertThat(privacyContact.path("dataControllerName").asText())
                        .isEmpty();
                assertThat(privacyContact.path("privacyContactEmail").asText())
                        .isEmpty();
            } else {
                assertThat(privacyContact.path("dataControllerName").asText())
                        .isNotBlank();
                assertThat(privacyContact.path("privacyContactEmail").asText())
                        .endsWith(".myscoutee.test");
            }
        }
    }

    @Test
    void publicConfigurationJsonContainsOnlyPublicFieldsAndMessagingCapability()
            throws Exception {
        DeploymentConfiguration configuration = seededConfiguration();
        configuration.getBranding().setLogoUrl(
                "/media/public?key=images%2Foperator%2Flogo%2Fmedium");
        DeploymentConfiguration.SocialLink socialLink =
                new DeploymentConfiguration.SocialLink();
        socialLink.setProvider("discord");
        socialLink.setLabel("Discord");
        socialLink.setUrl("https://discord.example.test/community");
        socialLink.setIcon("discord");
        socialLink.setHandle("@community");
        configuration.setSocialLinks(List.of(socialLink));
        OperatorConfigurationMapper mapper = new OperatorConfigurationMapper();

        var json = objectMapper.readTree(
                objectMapper.writeValueAsString(
                        mapper.toPublicConfiguration(configuration)));

        assertThat(json.propertyNames())
                .containsExactlyInAnyOrder(
                        "productName",
                        "logoCharacterIndex",
                        "homeLabel",
                        "logoUrl",
                        "revision",
                        "paymentProviderId",
                        "firebaseMessagingConfigured",
                        "socialLinks",
                        "privacyContact");
        assertThat(json.path("paymentProviderId").isNull()).isTrue();
        assertThat(json.path("socialLinks").get(0).propertyNames())
                .containsExactlyInAnyOrder(
                        "provider",
                        "label",
                        "url",
                        "icon",
                        "handle");
        assertThat(json.path("privacyContact").propertyNames())
                .containsExactlyInAnyOrder(
                        "configured",
                        "dataControllerName",
                        "privacyContactEmail");
        assertThat(json.path("privacyContact").path("configured").asBoolean())
                .isTrue();
        assertThat(json.path("privacyContact")
                        .path("dataControllerName")
                        .asText())
                .isEqualTo("MyScoutee Test Controller");
        assertThat(json.path("privacyContact")
                        .path("privacyContactEmail")
                        .asText())
                .isEqualTo("privacy@example.test");
        assertThat(json.path("logoCharacterIndex").asInt()).isZero();
        assertThat(json.toString())
                .doesNotContain("adminEmails")
                .doesNotContain("credential")
                .doesNotContain("\"firebase\"")
                .doesNotContain("\"payment\":");
    }

    @Test
    void notificationCapabilityTracksMessagingCredentialInsteadOfVapid() throws Exception {
        DeploymentConfiguration configuration = seededConfiguration();
        OperatorConfigurationMapper mapper = new OperatorConfigurationMapper();
        configuration.getFirebase().setPublicClient(new DeploymentConfiguration.FirebasePublicClient());
        configuration.getFirebase().getPublicClient().setVapidKey("public-vapid");
        configuration.getFirebase().setMessagingCredentialEnvelope(null);
        assertThat(mapper.toPublicConfiguration(configuration).firebaseMessagingConfigured()).isFalse();

        DeploymentConfiguration.EncryptedSecret credential = new DeploymentConfiguration.EncryptedSecret();
        credential.setCiphertext("private-messaging-credential");
        configuration.getFirebase().setMessagingCredentialEnvelope(credential);
        configuration.getFirebase().getPublicClient().setVapidKey(null);
        var dto = mapper.toPublicConfiguration(configuration);
        assertThat(dto.firebaseMessagingConfigured()).isTrue();
        assertThat(objectMapper.writeValueAsString(dto))
                .doesNotContain("private-messaging-credential", "ciphertext", "vapidKey");
    }

    @Test
    void operatorMappingReportsOnlySecretPresenceAndSafeMask() throws Exception {
        DeploymentConfiguration configuration = seededConfiguration();
        DeploymentConfiguration.EncryptedSecret encrypted =
                new DeploymentConfiguration.EncryptedSecret();
        encrypted.setAlgorithm("AES-256-GCM");
        encrypted.setKeyId("sha256:key");
        encrypted.setNonce("nonce");
        encrypted.setCiphertext("ciphertext");
        configuration.getPayment().setProviderId("stripe");
        configuration.getPayment().setPublicBaseUrl(
                "https://community.example.test");
        configuration.getPayment().setCredentialEnvelope(encrypted);
        configuration.getPayment().setCredentialMask("••••1234");
        configuration.getFirebase().setAuthenticationCredentialEnvelope(encrypted);
        configuration.getFirebase().setMessagingCredentialEnvelope(encrypted);

        var dto = new OperatorConfigurationMapper().toOperatorConfiguration(
                configuration,
                List.of(new PaymentProviderDto(
                        "stripe",
                        "Stripe",
                        "assets/payment-providers/stripe.svg",
                        "Stripe",
                        "violet")),
                List.of("admin@example.test"),
                null);
        String json = objectMapper.writeValueAsString(dto);

        assertThat(dto.payment().credentialConfigured()).isTrue();
        assertThat(dto.payment().publicBaseUrl())
                .isEqualTo("https://community.example.test");
        assertThat(dto.payment().credentialMask()).isEqualTo("••••1234");
        assertThat(dto.firebase().authenticationCredentialConfigured()).isTrue();
        assertThat(dto.firebase().messagingCredentialConfigured()).isTrue();
        assertThat(dto.privacyContact().configured()).isTrue();
        assertThat(dto.privacyContact().dataControllerName())
                .isEqualTo("MyScoutee Test Controller");
        assertThat(dto.privacyContact().privacyContactEmail())
                .isEqualTo("privacy@example.test");
        assertThat(json)
                .doesNotContain("ciphertext")
                .doesNotContain("nonce")
                .doesNotContain("keyId")
                .doesNotContain("\"authenticationCredential\":")
                .doesNotContain("\"messagingCredential\":");
        var providerJson = objectMapper.readTree(json)
                .path("payment")
                .path("availableProviders")
                .get(0);
        assertThat(providerJson.propertyNames()).containsExactlyInAnyOrder(
                "id",
                "label",
                "logoUrl",
                "logoAlt",
                "palette");
    }

    @Test
    void operatorJsonKeepsTheExactNullableStatusFields() throws Exception {
        var dto = new OperatorConfigurationMapper().toOperatorConfiguration(
                seededConfiguration(),
                List.of(),
                List.of(),
                null);
        var json = objectMapper.readTree(objectMapper.writeValueAsString(dto));

        assertThat(json.propertyNames()).containsExactlyInAnyOrder(
                "capability",
                "unavailableReason",
                "adminEmails",
                "privacyContact",
                "socialLinks",
                "branding",
                "integration",
                "payment",
                "firebase",
                "updatedAt");
        assertThat(json.get("unavailableReason").isNull()).isTrue();
        assertThat(json.get("updatedAt").isNull()).isTrue();
        assertThat(json.get("privacyContact").propertyNames())
                .containsExactlyInAnyOrder(
                        "configured",
                        "dataControllerName",
                        "privacyContactEmail");
        assertThat(json.get("payment").propertyNames()).containsExactlyInAnyOrder(
                "availableProviders",
                "providerId",
                "publicBaseUrl",
                "merchantAccount",
                "credentialConfigured",
                "credentialMask",
                "exchangeRateUrl");
        assertThat(json.get("payment").get("providerId").isNull()).isTrue();
        assertThat(json.get("payment").get("publicBaseUrl").isNull()).isTrue();
        assertThat(json.get("payment").get("merchantAccount").isNull()).isTrue();
        assertThat(json.get("payment").get("credentialMask").isNull()).isTrue();
    }

    @Test
    void requestSecretFieldsAreWriteOnlyEvenIfRequestObjectsAreSerialized() throws Exception {
        PaymentUpdateDto payment = new PaymentUpdateDto("stripe", "payment-secret");
        FirebaseUpdateDto firebase =
                new FirebaseUpdateDto("project", "auth-secret", "message-secret");

        assertThat(objectMapper.writeValueAsString(payment))
                .doesNotContain("payment-secret")
                .doesNotContain("credential");
        assertThat(objectMapper.writeValueAsString(firebase))
                .doesNotContain("auth-secret")
                .doesNotContain("message-secret")
                .doesNotContain("authenticationCredential")
                .doesNotContain("messagingCredential");
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
        privacyContact.setDataControllerName("MyScoutee Test Controller");
        privacyContact.setPrivacyContactEmail("privacy@example.test");
        configuration.setPrivacyContact(privacyContact);
        configuration.setIntegration(new DeploymentConfiguration.Integration());
        configuration.setPayment(new DeploymentConfiguration.Payment());
        DeploymentConfiguration.Firebase firebase =
                new DeploymentConfiguration.Firebase();
        firebase.setProjectId("");
        configuration.setFirebase(firebase);
        return configuration;
    }

    private Path locateSeedRoot() {
        Path current = Path.of("").toAbsolutePath().normalize();
        for (Path candidate = current; candidate != null; candidate = candidate.getParent()) {
            Path fromRepository = candidate.resolve("server/docker/conf/mongodb");
            if (Files.isDirectory(fromRepository)) {
                return fromRepository;
            }
            Path fromServer = candidate.resolve("docker/conf/mongodb");
            if (Files.isDirectory(fromServer)) {
                return fromServer;
            }
        }
        throw new IllegalStateException("Mongo seed root could not be located.");
    }
}
