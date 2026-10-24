package com.raxim.myscoutee.common.mongo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.NoOpDbRefResolver;
import org.springframework.data.mongodb.core.index.MongoPersistentEntityIndexResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

/** Frozen pre-refactor field/index contracts, including inherited Mongo mapping and reload. */
@org.junit.jupiter.api.Tag("standard")
class SharedMetadataCompatibilityTest {
    record Contract(String className, Map<String, String> properties, List<String> indexes) {}

    @Test
    void inheritedMetadataRetainsFlatFieldsIndexesAndRoundTrip() throws Exception {
        Contract[] contracts;
        try (var input = getClass().getResourceAsStream("/persistence/shared-metadata-before.json")) {
            contracts = new tools.jackson.databind.ObjectMapper().readValue(input, Contract[].class);
        }
        var context = new MongoMappingContext();
        context.afterPropertiesSet();
        var converter = new MappingMongoConverter(NoOpDbRefResolver.INSTANCE, context);
        converter.afterPropertiesSet();
        var indexes = new MongoPersistentEntityIndexResolver(context);
        for (var contract : contracts) {
            Class<?> type = Class.forName(contract.className());
            var entity = context.getRequiredPersistentEntity(type);
            var actual = new TreeMap<String, String>();
            entity.forEach(property -> actual.put(property.getName(), property.getType().getSimpleName()));
            assertThat(actual).as(contract.className()).isEqualTo(contract.properties());
            var actualIndexes = new ArrayList<String>();
            indexes.resolveIndexFor(type).forEach(index -> actualIndexes.add(index.getIndexOptions().getString("name")));
            assertThat(actualIndexes).as(contract.className()).containsExactlyInAnyOrderElementsOf(contract.indexes());

            Object value = type.getConstructor().newInstance();
            var accessor = entity.getPropertyAccessor(value);
            for (var property : entity) {
                Object sample = switch (property.getType().getSimpleName()) {
                    case "String" -> "sample-" + property.getName();
                    case "Long" -> 7L;
                    case "Integer" -> property.getName().equals("schemaVersion") ? null : 3;
                    case "Boolean" -> Boolean.TRUE;
                    default -> null;
                };
                if (sample != null) accessor.setProperty(property, sample);
            }
            var stored = new Document();
            converter.write(value, stored);
            assertThat(stored.getString("_id")).isEqualTo("sample-id");
            assertThat(stored.getString("baseGroupId")).isEqualTo(
                    contract.properties().containsKey("baseGroupId") ? "sample-baseGroupId" : null);
            if (contract.properties().containsKey("schemaVersion")) {
                assertThat(stored.getInteger("schemaVersion")).isEqualTo(type.getSimpleName().startsWith("Global") ? 2 : 1);
                assertThat(stored.getLong("version")).isEqualTo(7L);
            }
            assertThat(stored).doesNotContainKeys("metadata", "identity");
            Object loaded = converter.read(type, stored);
            var rewritten = new Document();
            converter.write(loaded, rewritten);
            assertThat(rewritten).as(contract.className()).isEqualTo(stored);
        }
    }
}
