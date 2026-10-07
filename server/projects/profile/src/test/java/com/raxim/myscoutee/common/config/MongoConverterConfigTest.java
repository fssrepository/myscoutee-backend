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
import com.raxim.myscoutee.domain.email.service.OperatorEmailConfigurationService;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingActionDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingPromoCodeDto;

class MongoConverterConfigTest {
    @Test
    @org.junit.jupiter.api.Tag("standard")
    void affiliateAttributionReloadsAsRootAndEmbeddedValueWithoutATypeDiscriminator() {
        var converter = domainConverter();
        var value = new com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration("member", "owner", "code", "now");
        var document = new Document(); converter.write(value, document);
        assertThat(document.getString("_class")).isEqualTo("com.raxim.myscoutee.profile.data.document.AffiliateRegistration");
        assertThat(converter.read(Object.class, document)).isEqualTo(value);
        var user = new Users(); user.setUserId("member"); user.setAffiliateRegistration(value);
        var profile = new Document(); converter.write(user, profile);
        profile.get("affiliateRegistration", Document.class).remove("_class");
        assertThat(converter.read(Users.class, profile).getAffiliateRegistration()).isEqualTo(value);
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void assetValuesRetainTheirHistoricalStoredIdentities() {
        var converter = domainConverter();
        var booking = new com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestBookingRecord(
                "event", "Event", "stage", "Stage", "slot", "Slot", "Window", "start", "end", 2,
                30d, "EUR", java.util.List.of("policy"), "payment", true);
        var request = new com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord(
                "request", "user", "Name", "NM", "man", "accepted", "note", "borrow", "now", booking);
        var policy = new com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetPolicyRecord("policy", "Policy", "Description", true);
        for (Object value : java.util.List.of(booking, request, policy)) {
            var document = new Document(); converter.write(new Payload(value), document);
            assertThat(document.get("value", Document.class).getString("_class"))
                    .isEqualTo("com.raxim.myscoutee.profile.data.document.Asset$" + value.getClass().getSimpleName());
            assertThat(converter.read(Payload.class, document).value()).isEqualTo(value);
        }
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void feedCounterValueRetainsHistoricalIdentityAndCounts() {
        var converter = domainConverter();
        var value = new com.raxim.myscoutee.domain.accounts.dto.FeedCountersRecord(7, java.util.Map.of("accepted", 3L));
        var document = new Document(); converter.write(new Payload(value), document);
        assertThat(document.get("value", Document.class).getString("_class"))
            .isEqualTo("com.raxim.myscoutee.profile.data.document.Users$FeedCountersRecord");
        assertThat(converter.read(Payload.class, document).value()).isEqualTo(value);
    }

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
    void preservesHistoricalTypeIdentityForDocumentsNestedInServices() {
        var converter = domainConverter();
        var configuration = new OperatorEmailConfigurationService.Configuration(
                "global", 3, false, "", "sender@example.test", "Sender", null, "2026-10-07T00:00:00Z");
        var document = new Document();
        converter.write(configuration, document);

        assertThat(document.getString("_class")).isEqualTo(
                "com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService$Configuration");
        assertThat(converter.read(Object.class, document)).isEqualTo(configuration);
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

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void immutableCaseValuesRetainHistoricalNestedIdentities() {
        var converter = domainConverter();
        var values = java.util.List.of(
                new com.raxim.myscoutee.domain.community.dto.CaseDetails.Support("provider", "service", "accepted"),
                new com.raxim.myscoutee.domain.community.dto.CaseDetails.Recommendation("member", "provider", "service"),
                new com.raxim.myscoutee.domain.community.dto.CaseDetails.BoardTask("task", "Title", "", "open", java.util.List.of("member"), java.util.List.of(), null, null, java.util.List.of()),
                new com.raxim.myscoutee.domain.community.dto.CaseDetails.Offer("offer", "provider", "service", 25, "EUR", "", "accepted", "now", null, null, java.util.List.of(), java.util.List.of()));
        for (var value : values) {
            var document = new Document(); converter.write(new Payload(value), document);
            assertThat(document.get("value", Document.class).getString("_class"))
                    .isEqualTo("com.raxim.myscoutee.profile.data.document.ServiceCase$" + value.getClass().getSimpleName());
            assertThat(converter.read(Payload.class, document).value()).isEqualTo(value);
        }
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void groupPolicyRetainsHistoricalNestedIdentityAndFieldValues() {
        var converter = domainConverter();
        var policy = new com.raxim.myscoutee.domain.groups.dto.GroupPolicy(true, true, java.util.List.of("profile.name"));
        var document = new Document();
        converter.write(new Payload(policy), document);
        assertThat(document.get("value", Document.class).getString("_class"))
                .isEqualTo("com.raxim.myscoutee.profile.data.document.CommunityGroup$Policy");
        assertThat(converter.read(Payload.class, document).value()).isEqualTo(policy);
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void encryptedEnvelopeRetainsHistoricalNestedIdentityAndFieldValues() {
        var converter = domainConverter();
        var envelope = new com.raxim.myscoutee.domain.platform.dto.EncryptedSecret();
        envelope.setAlgorithm("A256GCM"); envelope.setKeyId("key");
        envelope.setNonce("nonce"); envelope.setCiphertext("ciphertext");
        var document = new Document();
        converter.write(new Payload(envelope), document);
        assertThat(document.get("value", Document.class).getString("_class"))
                .isEqualTo("com.raxim.myscoutee.profile.data.document.DeploymentConfiguration$EncryptedSecret");
        var restored = (com.raxim.myscoutee.domain.platform.dto.EncryptedSecret) converter.read(Payload.class, document).value();
        assertThat(restored).usingRecursiveComparison().isEqualTo(envelope);
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void attachmentContractRetainsStoredTypeIdentity() {
        var converter = domainConverter();
        var attachment = new com.raxim.myscoutee.domain.media.dto.DocumentAttachment(
                "report.pdf", "/api/media/private?key=private/documents/u/e/report.pdf", "application/pdf", 42);
        var document = new Document();
        converter.write(new Payload(attachment), document);
        assertThat(document.get("value", Document.class).getString("_class"))
                .isEqualTo("com.raxim.myscoutee.profile.data.document.DocumentAttachment");
        assertThat(converter.read(Payload.class, document).value()).isEqualTo(attachment);
    }

    @Test
    @org.junit.jupiter.api.Tag("standard")
    void campaignRatingProjectionRetainsItsNestedEvidenceIdentity() {
        var converter = domainConverter();
        var rate = new com.raxim.myscoutee.domain.affinity.document.UserRate();
        rate.setOwnerUserId("left"); rate.setRelatedUserId("right"); rate.setScoreGiven(6);
        var summary = new com.raxim.myscoutee.domain.affinity.document.CampaignRatingSummary("pair", "left", "right", rate, 1);
        var document = new Document();
        converter.write(summary, document);
        assertThat(document.getString("_class")).isEqualTo("com.raxim.myscoutee.profile.data.document.CampaignRatingSummary");
        var restored = (com.raxim.myscoutee.domain.affinity.document.CampaignRatingSummary) converter.read(Object.class, document);
        assertThat(restored.rate().getScoreGiven()).isEqualTo(6d);
        assertThat(restored.rate().getOwnerUserId()).isEqualTo("left");
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
