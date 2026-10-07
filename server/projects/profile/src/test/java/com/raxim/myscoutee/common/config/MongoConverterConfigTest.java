package com.raxim.myscoutee.common.config;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import java.util.Properties;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.core.TypeInformation;
import org.springframework.data.mapping.Alias;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.NoOpDbRefResolver;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingPromoCodeDto;

class MongoConverterConfigTest {
    @Test

    @org.junit.jupiter.api.Tag("embedded")
    void preservesDottedKeysWhenAnotherPostProcessorCreatesTheConverterEarly() {
        try (var context = new AnnotationConfigApplicationContext(
                MongoConverterConfig.class, EarlyConverterConfiguration.class)) {
            var snapshot = new AdminStatsSnapshot();
            snapshot.setCounters(Map.of("profile.registered", 3L));
            var document = new Document();
            context.getBean(MappingMongoConverter.class).write(snapshot, document);
            assertThat(document.get("counters", Document.class))
                    .containsEntry("profile.registered", 3L);
        }
    }

    @Configuration(proxyBeanMethods = false)
    static class EarlyConverterConfiguration {
        @Bean
        static BeanPostProcessor eagerConverterConsumer(MappingMongoConverter converter) {
            return new BeanPostProcessor() {};
        }

        @Bean
        MappingMongoConverter earlyConverter() {
            MongoMappingContext mappingContext = new MongoMappingContext();
            mappingContext.afterPropertiesSet();
            return new MappingMongoConverter(NoOpDbRefResolver.INSTANCE, mappingContext);
        }
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
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

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void preservesEmbeddedPricingRuleIdsAsRegularIdFields() {
        MappingMongoConverter converter = mappingMongoConverter();
        PricingPromoCodeDto promoCode = new PricingPromoCodeDto(
                "promo-code-1",
                "EARLY",
                new PricingActionDto("decrease_percent", 10D));

        Document document = new Document();
        converter.write(promoCode, document);
        PricingPromoCodeDto restored = converter.read(PricingPromoCodeDto.class, document);

        assertThat(document)
                .containsEntry("id", "promo-code-1")
                .doesNotContainKey("_id");
        assertThat(restored.id()).isEqualTo("promo-code-1");
    }

    private MappingMongoConverter mappingMongoConverter() {
        MongoMappingContext mappingContext = new MongoMappingContext();
        mappingContext.afterPropertiesSet();
        MappingMongoConverter converter = new MappingMongoConverter(NoOpDbRefResolver.INSTANCE, mappingContext);
        converter.afterPropertiesSet();
        return converter;
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void readsAndWritesTheHistoricalRootDocumentTypeWithoutADataMigration() {
        var converter = domainConverter();
        var user = new Users();
        user.setUserId("domain-test-user");
        var document = new Document();
        converter.write(user, document);

        assertThat(document.getString("_class"))
                .isEqualTo("com.raxim.myscoutee.profile.data.document.Users");
        assertThat(converter.read(Object.class, document)).isInstanceOfSatisfying(Users.class,
                restored -> assertThat(restored.getUserId()).isEqualTo("domain-test-user"));
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void restoresLegacyNestedRecordTypesInPolymorphicEmbeddedValues() {
        var converter = domainConverter();
        var promo = new PricingPromoCodeDto("promo", "EARLY", new PricingActionDto("decrease_percent", 10D));
        var document = new Document();
        converter.write(new Payload(promo), document);

        assertThat(document.get("value", Document.class).getString("_class"))
                .isEqualTo("com.raxim.myscoutee.profile.data.dto.shared.SharedDtos$PricingPromoCodeDto");
        assertThat(converter.read(Payload.class, document).value()).isEqualTo(promo);
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void everyStoredAliasResolvesToItsCurrentTypeAndWritesTheOriginalIdentity() throws Exception {
        var aliases = new Properties();
        try (var input = new ClassPathResource("mongo-domain-types.properties").getInputStream()) {
            aliases.load(input);
        }
        var mapper = new MongoConverterConfig.DomainTypeInformationMapper();
        for (var stored : aliases.stringPropertyNames()) {
            var current = Class.forName(aliases.getProperty(stored), false, getClass().getClassLoader());
            assertThat(mapper.resolveTypeFrom(Alias.of(stored)).getType()).isEqualTo(current);
            assertThat(mapper.createAliasFor(TypeInformation.of(current))).isEqualTo(Alias.of(stored));
        }
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void newUnmappedTypesKeepTheirExplicitSpringTypeAlias() {
        var converter = domainConverter();
        var document = new Document();
        converter.write(new FutureSnapshot("value"), document);
        assertThat(document.getString("_class")).isEqualTo("future-snapshot");
        assertThat(converter.read(Object.class, document)).isEqualTo(new FutureSnapshot("value"));
    }

    private MappingMongoConverter domainConverter() {
        var converter = mappingMongoConverter();
        MongoConverterConfig.preserveDottedMongoMapKeys()
                .postProcessBeforeInitialization(converter, "mappingMongoConverter");
        return converter;
    }

    record Payload(Object value) {}

    @org.springframework.data.annotation.TypeAlias("future-snapshot")
    record FutureSnapshot(String value) {}
}
