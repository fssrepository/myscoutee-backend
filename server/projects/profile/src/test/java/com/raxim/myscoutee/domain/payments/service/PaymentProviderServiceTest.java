package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.payments.mapper.PaymentProviderMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.payments.document.PaymentProvider;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.domain.payments.repository.PaymentProviderRepository;
import com.raxim.myscoutee.domain.payments.service.BarionPaymentProcessor;
import com.raxim.myscoutee.domain.payments.service.PaymentProcessor;
import com.raxim.myscoutee.domain.payments.service.StripePaymentProcessor;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
class PaymentProviderServiceTest {
    @Test
    void catalogQueriesMongoAndMapsOnlyImplementedProductionProviders() {
        PaymentProviderRepository repository = mock(PaymentProviderRepository.class);
        when(repository.findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc())
                .thenReturn(List.of(
                        provider(
                                "stripe",
                                "Stripe",
                                "assets/payment-providers/stripe.svg",
                                "Stripe",
                                "violet",
                                10),
                        provider(
                                "barion",
                                "Barion",
                                "assets/payment-providers/barion.svg",
                                "Barion",
                                "blue",
                                20)));
        List<PaymentProcessor> implementations = paymentImplementations();
        PaymentProviderService service = new PaymentProviderService(
                repository,
                new PaymentProviderMapper(),
                implementations);

        assertThat(service.availableProviders())
                .containsExactly(
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
    }

    @Test
    void mapperRejectsMalformedSuppliedIdentityMetadata() {
        PaymentProvider provider = provider(
                " CUSTOM ",
                " Custom ",
                "javascript:alert(1)",
                " ",
                "danger",
                30);

        assertThatThrownBy(() -> new PaymentProviderMapper().toDto(provider))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("invalid logoUrl");
    }

    @Test
    void mapperRejectsAnUnsupportedSuppliedPalette() {
        PaymentProvider provider = provider(
                "custom",
                "Custom",
                null,
                null,
                "danger",
                30);

        assertThatThrownBy(() -> new PaymentProviderMapper().toDto(provider))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("invalid palette");
    }

    @Test
    void mapperLeavesAbsentOptionalIdentityMetadataEmptyForUiFallback() {
        var result = new PaymentProviderMapper().toDto(
                provider(" CUSTOM ", " Custom ", 30));

        assertThat(result.id()).isEqualTo("custom");
        assertThat(result.label()).isEqualTo("Custom");
        assertThat(result.logoUrl()).isNull();
        assertThat(result.logoAlt()).isNull();
        assertThat(result.palette()).isNull();
    }

    @Test
    void catalogRejectsASeedWithNoProductionProcessorInsteadOfRepairingIt() {
        PaymentProviderRepository repository = mock(PaymentProviderRepository.class);
        when(repository.findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc())
                .thenReturn(List.of(provider("paypal", "PayPal", 10)));
        PaymentProviderService service = new PaymentProviderService(
                repository,
                new PaymentProviderMapper(),
                paymentImplementations());

        assertThatThrownBy(service::availableProviders)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("no registered PaymentProcessor");
    }

    @Test
    void catalogRejectsAMissingProductionSeedInsteadOfReturningAnEmptyList() {
        PaymentProviderRepository repository = mock(PaymentProviderRepository.class);
        when(repository.findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc())
                .thenReturn(List.of());
        PaymentProviderService service = new PaymentProviderService(
                repository,
                new PaymentProviderMapper(),
                paymentImplementations());

        assertThatThrownBy(service::availableProviders)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("missing from")
                .hasMessageContaining("stripe")
                .hasMessageContaining("barion");
    }

    @Test
    void realDemoAndE2eSeedsExactlyMatchImplementedProviderIds() throws Exception {
        Set<String> implementedIds = paymentImplementations().stream()
                .map(PaymentProcessor::getType)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        Path seedRoot = locateSeedRoot();
        ObjectMapper objectMapper = new ObjectMapper();

        for (String database : List.of("myscoutee_db", "demo_db", "e2e_db")) {
            JsonNode seed = objectMapper.readTree(
                    Files.readString(
                            seedRoot.resolve(database).resolve("paymentProviders.json")));
            Set<String> seededIds = new LinkedHashSet<>();
            seed.forEach(record -> {
                assertThat(record.path("enabled").asBoolean()).isTrue();
                assertThat(record.path("label").asText()).isNotBlank();
                assertThat(record.path("logoUrl").asText())
                        .startsWith("assets/payment-providers/")
                        .endsWith(".svg");
                assertThat(record.path("logoAlt").asText())
                        .isEqualTo(record.path("label").asText());
                assertThat(record.path("palette").asText())
                        .isIn("violet", "blue");
                seededIds.add(record.path("_id").asText());
            });
            assertThat(seededIds)
                    .as(database + " payment provider ids")
                    .containsExactlyElementsOf(implementedIds);
        }
    }

    @Test
    void providerCatalogUsesAProductionMongoCollection() {
        Document document = PaymentProvider.class.getAnnotation(Document.class);

        assertThat(document.collection()).isEqualTo("paymentProviders");
    }

    private List<PaymentProcessor> paymentImplementations() {
        DeploymentPaymentCredentialResolver resolver =
                mock(DeploymentPaymentCredentialResolver.class);
        DeploymentPaymentRoutingResolver routingResolver =
                mock(DeploymentPaymentRoutingResolver.class);
        return List.of(
                new StripePaymentProcessor(resolver, routingResolver, ""),
                new BarionPaymentProcessor(resolver, routingResolver, ""));
    }

    private PaymentProvider provider(String id, String label, int sortOrder) {
        return provider(id, label, null, null, null, sortOrder);
    }

    private PaymentProvider provider(
            String id,
            String label,
            String logoUrl,
            String logoAlt,
            String palette,
            int sortOrder) {
        PaymentProvider provider = new PaymentProvider();
        provider.setId(id);
        provider.setLabel(label);
        provider.setLogoUrl(logoUrl);
        provider.setLogoAlt(logoAlt);
        provider.setPalette(palette);
        provider.setEnabled(true);
        provider.setSortOrder(sortOrder);
        return provider;
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
