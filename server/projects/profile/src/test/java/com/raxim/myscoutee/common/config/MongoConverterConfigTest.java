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
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingPromoCodeDto;

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

    @Test
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
}
