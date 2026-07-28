package com.raxim.myscoutee.profile.service.operator;

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

import com.raxim.myscoutee.profile.data.document.PaymentProvider;
import com.raxim.myscoutee.profile.repository.PaymentProviderRepository;
import com.raxim.myscoutee.profile.service.BarionPaymentProcessor;
import com.raxim.myscoutee.profile.service.PaymentProcessor;
import com.raxim.myscoutee.profile.service.StripePaymentProcessor;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

class PaymentProviderServiceTest {
    @Test
    void catalogQueriesMongoAndMapsOnlyImplementedProductionProviders() {
        PaymentProviderRepository repository = mock(PaymentProviderRepository.class);
        when(repository.findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc())
                .thenReturn(List.of(
                        provider("stripe", "Stripe", 10),
                        provider("barion", "Barion", 20)));
        List<PaymentProcessor> implementations = paymentImplementations();
        PaymentProviderService service = new PaymentProviderService(
                repository,
                new PaymentProviderMapper(),
                implementations);

        assertThat(service.availableProviders())
                .extracting(provider -> provider.id())
                .containsExactly("stripe", "barion");
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
        return List.of(
                new StripePaymentProcessor(resolver, ""),
                new BarionPaymentProcessor(resolver, ""));
    }

    private PaymentProvider provider(String id, String label, int sortOrder) {
        PaymentProvider provider = new PaymentProvider();
        provider.setId(id);
        provider.setLabel(label);
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
