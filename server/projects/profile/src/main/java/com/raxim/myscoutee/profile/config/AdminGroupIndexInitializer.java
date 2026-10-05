package com.raxim.myscoutee.profile.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class AdminGroupIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public AdminGroupIndexInitializer(@Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        databases = List.of(real, demo);
    }

    @PostConstruct
    public void initialize() {
        for (var factory : databases) {
            for (var spec : List.of(
                    List.of("emailTemplates", "templateKey", "email_template_key"),
                    List.of("notificationTemplates", "templateKey", "notification_template_key"),
                    List.of("emailCampaignRules", "ruleKey", "email_campaign_rule_key"))) {
                var records = factory.getMongoDatabase().getCollection(spec.get(0));
                records.createIndex(new Document("baseGroupId", 1).append(spec.get(1), 1),
                        new IndexOptions().name(spec.get(2) + "_group").unique(true));
                for (var index : records.listIndexes()) {
                    if (spec.get(2).equals(index.getString("name"))) { records.dropIndex(spec.get(2)); break; }
                }
            }
            var revisions = factory.getMongoDatabase().getCollection("helpCenterRevisions");
            revisions.createIndex(new Document("baseGroupId", 1).append("documentType", 1).append("lang", 1)
                    .append("contextKey", 1).append("version", -1),
                    new IndexOptions().name("help_revision_group_document_lang_context_version").unique(true));
            for (var index : revisions.listIndexes()) {
                if ("help_revision_document_lang_context_version".equals(index.getString("name"))) {
                    revisions.dropIndex(index.getString("name"));
                    break;
                }
            }
            var collection = factory.getMongoDatabase().getCollection("notificationRuleConfigs");
            collection.createIndex(new Document("baseGroupId", 1).append("ruleKey", 1),
                    new IndexOptions().name("notification_rule_group_key").unique(true));
            for (var index : collection.listIndexes()) {
                if ("notification_rule_config_rule_key".equals(index.getString("name"))) {
                    collection.dropIndex("notification_rule_config_rule_key");
                    break;
                }
            }
        }
    }
}
