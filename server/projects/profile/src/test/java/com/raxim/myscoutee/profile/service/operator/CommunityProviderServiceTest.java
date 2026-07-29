package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.data.document.CommunityProvider;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorCommunityDtos.CommunityProviderDto;
import com.raxim.myscoutee.profile.repository.CommunityProviderRepository;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

class CommunityProviderServiceTest {
    @Test
    void catalogQueriesMongoAndMapsEnabledProviders() {
        CommunityProviderRepository repository =
                mock(CommunityProviderRepository.class);
        when(repository.findByEnabledTrueOrderBySortOrderAscNameAscIdAsc())
                .thenReturn(List.of(
                        provider(
                                "discord",
                                "Discord",
                                "operator.community.provider.discord.purpose",
                                "https://discord.com/",
                                false,
                                true,
                                10)));
        CommunityProviderService service = new CommunityProviderService(
                repository,
                new CommunityProviderMapper());

        assertThat(service.availableProviders()).containsExactly(
                new CommunityProviderDto(
                        "discord",
                        "Discord",
                        "operator.community.provider.discord.purpose",
                        "https://discord.com/",
                        false,
                        true));
    }

    @Test
    void mapperRejectsAnUnsafeProviderUrl() {
        CommunityProvider provider = provider(
                "unsafe",
                "Unsafe",
                "operator.community.provider.unsafe.purpose",
                "javascript:alert(1)",
                false,
                true,
                10);

        assertThatThrownBy(() -> new CommunityProviderMapper().toDto(provider))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("invalid url");
    }

    @Test
    void demoSeedProvidesCommunityLinksWhileProductionMayRemainEmpty()
            throws Exception {
        Path seedRoot = locateSeedRoot();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode seed = objectMapper.readTree(Files.readString(
                seedRoot.resolve("demo_db").resolve("communityProviders.json")));

        assertThat(seed.size()).isEqualTo(2);
        assertThat(seed.get(0).path("_id").asText()).isEqualTo("discord");
        assertThat(seed.get(1).path("_id").asText()).isEqualTo("discourse");
        seed.forEach(record -> {
            assertThat(record.path("enabled").asBoolean()).isTrue();
            assertThat(record.path("available").asBoolean()).isTrue();
            assertThat(record.path("url").asText()).startsWith("https://");
        });
        assertThat(seedRoot.resolve("myscoutee_db")
                .resolve("communityProviders.json")).doesNotExist();
    }

    @Test
    void providerCatalogUsesTheDeploymentMongoCollection() {
        Document document = CommunityProvider.class.getAnnotation(Document.class);

        assertThat(document.collection()).isEqualTo("communityProviders");
    }

    private CommunityProvider provider(
            String id,
            String name,
            String purpose,
            String url,
            boolean configured,
            boolean available,
            int sortOrder) {
        CommunityProvider provider = new CommunityProvider();
        provider.setId(id);
        provider.setName(name);
        provider.setPurpose(purpose);
        provider.setUrl(url);
        provider.setConfigured(configured);
        provider.setAvailable(available);
        provider.setEnabled(true);
        provider.setSortOrder(sortOrder);
        return provider;
    }

    private Path locateSeedRoot() {
        Path current = Path.of("").toAbsolutePath().normalize();
        for (Path candidate = current; candidate != null;
                candidate = candidate.getParent()) {
            Path fromRepository =
                    candidate.resolve("server/docker/conf/mongodb");
            if (Files.isDirectory(fromRepository)) {
                return fromRepository;
            }
            Path fromServer = candidate.resolve("docker/conf/mongodb");
            if (Files.isDirectory(fromServer)) {
                return fromServer;
            }
        }
        throw new IllegalStateException(
                "Mongo seed root could not be located.");
    }
}
