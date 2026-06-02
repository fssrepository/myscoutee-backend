package com.raxim.myscoutee.e2e;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.bson.Document;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;

import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

final class E2eAccessPolicySeedSupport {
    private static final ObjectMapper OBJECT_MAPPER = JsonMapper.builder().build();

    private E2eAccessPolicySeedSupport() {
    }

    static void seedAccessPolicies(String mongoBaseUri, String databaseName) {
        try {
            List<Map<String, Object>> policies = OBJECT_MAPPER.readValue(
                    Files.readString(mongoSeedRoot().resolve("e2e_db").resolve("accessPolicyDefinitions.json")),
                    new TypeReference<List<Map<String, Object>>>() {
                    });
            try (MongoClient client = MongoClients.create(mongoBaseUri)) {
                for (Map<String, Object> policy : policies) {
                    client.getDatabase(databaseName)
                            .getCollection("accessPolicyDefinitions")
                            .replaceOne(
                                    Filters.eq("_id", policy.get("_id")),
                                    new Document(policy),
                                    new ReplaceOptions().upsert(true));
                }
            }
        } catch (Exception exception) {
            throw new IllegalStateException("Could not seed embedded e2e access policies.", exception);
        }
    }

    private static Path mongoSeedRoot() {
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
