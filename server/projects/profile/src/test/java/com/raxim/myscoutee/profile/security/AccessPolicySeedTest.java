package com.raxim.myscoutee.profile.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Modifier;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
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
            AccessPolicyKeys.EVENT_CREATE,
            AccessPolicyKeys.EVENT_EDIT,
            AccessPolicyKeys.EVENT_PUBLISH,
            AccessPolicyKeys.EVENT_UNPUBLISH,
            AccessPolicyKeys.EVENT_DELETE,
            AccessPolicyKeys.EVENT_RESTORE,
            AccessPolicyKeys.EVENT_TAKEOVER,
            AccessPolicyKeys.EVENT_JOIN,
            AccessPolicyKeys.EVENT_STAGE_ACTION,
            AccessPolicyKeys.EVENT_MEMBER_VIEW,
            AccessPolicyKeys.EVENT_MEMBER_MANAGE,
            AccessPolicyKeys.EVENT_MEMBER_ACCEPT,
            AccessPolicyKeys.EVENT_MEMBER_REMOVE,
            AccessPolicyKeys.EVENT_MEMBER_DISQUALIFY,
            AccessPolicyKeys.EVENT_MEMBER_REINSTATE,
            AccessPolicyKeys.EVENT_MEMBER_INVITE,
            AccessPolicyKeys.RESOURCE_ASSIGN_SUBMIT,
            AccessPolicyKeys.RESOURCE_ASSIGN_SUBJECT,
            AccessPolicyKeys.RESOURCE_ASSIGN_MANAGE,
            AccessPolicyKeys.RESOURCE_ASSIGN_CLEANUP,
            AccessPolicyKeys.ASSET_CREATE,
            AccessPolicyKeys.ASSET_REPLACE,
            AccessPolicyKeys.ASSET_EDIT,
            AccessPolicyKeys.ASSET_DELETE,
            AccessPolicyKeys.ASSET_RESTORE,
            AccessPolicyKeys.ASSET_TAKEOVER,
            AccessPolicyKeys.ASSET_MANAGER_PROMOTE_TARGET,
            AccessPolicyKeys.ASSET_MANAGER_PROMOTE_ACTOR,
            AccessPolicyKeys.ASSET_SOURCE_REFRESH,
            AccessPolicyKeys.ASSET_BORROW_REQUEST,
            AccessPolicyKeys.ASSET_BORROW_APPROVE,
            AccessPolicyKeys.ASSET_BORROW_REJECT,
            AccessPolicyKeys.ASSET_BORROW_CANCEL,
            AccessPolicyKeys.EVENT_FEEDBACK_SUBMIT,
            AccessPolicyKeys.EVENT_FEEDBACK_NOTE,
            AccessPolicyKeys.EVENT_FEEDBACK_REMOVE,
            AccessPolicyKeys.EVENT_FEEDBACK_RESTORE,
            AccessPolicyKeys.EVENT_LEADERBOARD_ENTRY_SUBMIT,
            AccessPolicyKeys.CHAT_MESSAGE_CREATE,
            AccessPolicyKeys.CHAT_MESSAGE_EDIT,
            AccessPolicyKeys.CHAT_MESSAGE_DELETE,
            AccessPolicyKeys.CHAT_MESSAGE_PIN,
            AccessPolicyKeys.CHAT_REACTION_MANAGE,
            AccessPolicyKeys.CHAT_ATTACHMENT_ADD,
            AccessPolicyKeys.CHAT_SUPPORT_MANAGE,
            AccessPolicyKeys.USER_PROFILE_EDIT,
            AccessPolicyKeys.USER_PROFILE_DELETE,
            AccessPolicyKeys.USER_MEDIA_UPLOAD,
            AccessPolicyKeys.USER_MEDIA_IMPORT,
            AccessPolicyKeys.PRIVACY_CONSENT_SUBMIT);

    private final ObjectMapper objectMapper = JsonMapper.builder()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .build();
    private final AccessPolicyConditionRegistry conditionRegistry = AccessPolicyTestSupport.conditionRegistry();

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
                    assertThat(conditionRegistry.named(conditionName))
                            .as(database + " " + definition.getPolicyKey() + " " + conditionName)
                            .isNotNull();
                }
            }
        }
    }

    @Test
    void inactiveMongoSeedPoliciesAreExactlyTheUnwiredCatalogueRemainder() throws Exception {
        Set<String> expectedInactivePolicyKeys = new LinkedHashSet<>(policyKeysFromConstants());
        expectedInactivePolicyKeys.removeAll(ACTIVE_POLICY_KEYS);

        for (String database : SEED_DATABASES) {
            List<AccessPolicyDefinition> inactiveDefinitions = readDefinitions(
                    mongoSeedRoot().resolve(database).resolve("accessPolicyDefinitions.json"))
                    .stream()
                    .filter(definition -> "disabled".equals(definition.getStatus()))
                    .toList();

            assertThat(inactiveDefinitions)
                    .as(database)
                    .hasSize(expectedInactivePolicyKeys.size())
                    .extracting(AccessPolicyDefinition::getPolicyKey)
                    .containsExactlyInAnyOrderElementsOf(expectedInactivePolicyKeys);
        }
    }

    @Test
    void mongoSeedFilesAreIdenticalAcrossDatabases() throws Exception {
        Path seedRoot = mongoSeedRoot();
        String reference = Files.readString(seedRoot.resolve("demo_db").resolve("accessPolicyDefinitions.json"));

        assertThat(Files.readString(seedRoot.resolve("myscoutee_db").resolve("accessPolicyDefinitions.json")))
                .isEqualTo(reference);
        assertThat(Files.readString(seedRoot.resolve("e2e_db").resolve("accessPolicyDefinitions.json")))
                .isEqualTo(reference);
    }

    @Test
    void mongoSeedDocumentsUseStableIdsForExistingImporterUpserts() throws Exception {
        for (String database : SEED_DATABASES) {
            List<Map<String, Object>> documents = objectMapper.readValue(
                    Files.readString(mongoSeedRoot().resolve(database).resolve("accessPolicyDefinitions.json")),
                    new TypeReference<List<Map<String, Object>>>() {
                    });

            assertThat(documents)
                    .as(database)
                    .allSatisfy(document -> {
                        assertThat(document.get("_id")).isEqualTo(document.get("syncKey"));
                        assertThat((String) document.get("_id")).startsWith("access-policy-");
                    });
        }
    }

    @Test
    void policyCatalogueLivesInDatabaseSeedFoldersAndInitCreatesCollections() throws Exception {
        assertThat(Files.readString(mongoSeedRoot().resolve("db_init.js")))
                .contains("'accessPolicyDefinitions'")
                .contains("'accessGrants'")
                .contains("access_policy_definition_key")
                .contains("access_grant_subject_permission_resource");
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

}
