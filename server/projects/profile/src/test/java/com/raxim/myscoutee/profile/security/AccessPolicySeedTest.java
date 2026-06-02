package com.raxim.myscoutee.profile.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Modifier;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.DeserializationFeature;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

class AccessPolicySeedTest {
    private static final List<String> SEED_DATABASES = List.of("demo_db", "myscoutee_db", "e2e_db");
    private static final Set<String> ACTIVE_POLICY_KEYS = Set.of(
            AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
            AccessPolicyKeys.RESOURCE_ASSIGN_SUBJECT,
            AccessPolicyKeys.ASSET_MANAGER_PROMOTE_TARGET);

    private final ObjectMapper objectMapper = JsonMapper.builder()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .build();

    @Test
    void mongoSeedsDefineTheCompletePolicyCatalogueForEveryDatabase() throws Exception {
        Set<String> expectedPolicyKeys = policyKeysFromConstants();
        Path seedRoot = mongoSeedRoot();

        for (String database : SEED_DATABASES) {
            Path seedFile = seedRoot.resolve(database).resolve("accessPolicyDefinitions.json");
            List<AccessPolicyDefinition> definitions = readDefinitions(seedFile);
            List<String> policyKeys = definitions.stream()
                    .map(AccessPolicyDefinition::getPolicyKey)
                    .toList();
            List<String> syncKeys = definitions.stream()
                    .map(AccessPolicyDefinition::getSyncKey)
                    .toList();

            assertThat(definitions).as(database).hasSize(expectedPolicyKeys.size());
            assertThat(policyKeys).as(database).containsExactlyInAnyOrderElementsOf(expectedPolicyKeys);
            assertThat(policyKeys).as(database).doesNotHaveDuplicates();
            assertThat(syncKeys).as(database).doesNotHaveDuplicates();
            assertThat(definitions)
                    .as(database)
                    .allSatisfy(definition -> {
                        assertThat(definition.getSyncKey()).isNotBlank();
                        assertThat(definition.getPolicyKey()).isNotBlank();
                        assertThat(definition.getPermission()).isNotBlank();
                        assertThat(definition.getResourceType()).isNotBlank();
                        assertThat(definition.getStatus()).isIn("active", "disabled");
                    });
        }
    }

    @Test
    void activeMongoSeedPoliciesUseKnownConditionsOnly() throws Exception {
        for (String database : SEED_DATABASES) {
            List<AccessPolicyDefinition> activeDefinitions = readDefinitions(
                    mongoSeedRoot().resolve(database).resolve("accessPolicyDefinitions.json"))
                    .stream()
                    .filter(definition -> "active".equals(definition.getStatus()))
                    .toList();

            assertThat(activeDefinitions)
                    .as(database)
                    .extracting(AccessPolicyDefinition::getPolicyKey)
                    .containsExactlyInAnyOrderElementsOf(ACTIVE_POLICY_KEYS);

            for (AccessPolicyDefinition definition : activeDefinitions) {
                for (String conditionName : conditionNames(definition)) {
                    assertThat(AccessPolicyConditions.named(conditionName))
                            .as(database + " " + definition.getPolicyKey() + " " + conditionName)
                            .isNotNull();
                }
            }
        }
    }

    @Test
    void policyCatalogueLivesInDatabaseSeedFoldersAndInitCreatesCollections() throws Exception {
        assertThat(Files.readString(mongoSeedRoot().resolve("db_init.js")))
                .contains("'accessPolicyDefinitions'")
                .contains("'accessGrants'")
                .contains("access_policy_definition_key")
                .contains("access_grant_subject_permission_resource");
        assertThat(applicationResourceSeedFile()).doesNotExist();
    }

    private List<AccessPolicyDefinition> readDefinitions(Path seedFile) throws Exception {
        assertThat(seedFile).exists();
        return objectMapper.readValue(
                Files.readString(seedFile),
                new TypeReference<List<AccessPolicyDefinition>>() {
                });
    }

    private List<String> conditionNames(AccessPolicyDefinition definition) {
        return Stream.concat(
                        safeStream(definition.getRequired()),
                        safeStream(definition.getAnyOf()))
                .toList();
    }

    private Stream<String> safeStream(List<String> values) {
        return values == null ? Stream.empty() : values.stream();
    }

    private Set<String> policyKeysFromConstants() {
        return Arrays.stream(AccessPolicyKeys.class.getDeclaredFields())
                .filter(field -> Modifier.isStatic(field.getModifiers()))
                .filter(field -> String.class.equals(field.getType()))
                .map(field -> {
                    try {
                        return (String) field.get(null);
                    } catch (IllegalAccessException exception) {
                        throw new IllegalStateException(exception);
                    }
                })
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private Path mongoSeedRoot() {
        Path current = Path.of(System.getProperty("user.dir")).toAbsolutePath();
        while (current != null) {
            Path repoRelative = current.resolve("server/docker/conf/mongodb");
            if (Files.isDirectory(repoRelative)) {
                return repoRelative;
            }
            Path serverRelative = current.resolve("docker/conf/mongodb");
            if (Files.isDirectory(serverRelative)) {
                return serverRelative;
            }
            current = current.getParent();
        }
        throw new IllegalStateException("Could not locate server/docker/conf/mongodb");
    }

    private Path applicationResourceSeedFile() {
        Path current = Path.of(System.getProperty("user.dir")).toAbsolutePath();
        while (current != null) {
            Path repoRelative = current.resolve("server/projects/profile/src/main/resources/mongo-seed/profile/accessPolicyDefinitions.json");
            if (Files.isDirectory(repoRelative.getParent())) {
                return repoRelative;
            }
            Path serverRelative = current.resolve("projects/profile/src/main/resources/mongo-seed/profile/accessPolicyDefinitions.json");
            if (Files.isDirectory(serverRelative.getParent())) {
                return serverRelative;
            }
            current = current.getParent();
        }
        throw new IllegalStateException("Could not locate profile resources");
    }
}
