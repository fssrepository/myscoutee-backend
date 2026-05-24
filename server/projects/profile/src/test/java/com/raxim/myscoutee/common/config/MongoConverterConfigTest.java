package com.raxim.myscoutee.common.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.NoOpDbRefResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import com.raxim.myscoutee.profile.data.document.AdminStatsSnapshot;

class MongoConverterConfigTest {
    @Test
    void preservesDottedMapKeysWhenWritingDocuments() {
        MappingMongoConverter converter = mappingMongoConverter();
        BeanPostProcessor postProcessor = MongoConverterConfig.preserveDottedMongoMapKeys();
        postProcessor.postProcessBeforeInitialization(converter, "mappingMongoConverter");

        AdminStatsSnapshot snapshot = new AdminStatsSnapshot();
        snapshot.setCounters(Map.of("profile.registered", 3L));

        Document document = new Document();
        converter.write(snapshot, document);

        assertThat(document.get("counters", Document.class))
                .containsEntry("profile.registered", 3L);
    }

    private MappingMongoConverter mappingMongoConverter() {
        MongoMappingContext mappingContext = new MongoMappingContext();
        mappingContext.afterPropertiesSet();
        MappingMongoConverter converter = new MappingMongoConverter(NoOpDbRefResolver.INSTANCE, mappingContext);
        converter.afterPropertiesSet();
        return converter;
    }
}
