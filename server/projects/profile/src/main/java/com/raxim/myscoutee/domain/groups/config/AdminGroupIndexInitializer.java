package com.raxim.myscoutee.domain.groups.config;

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
                    List.of("emailCampaignRules", "ruleKey", "email_campaign_rule_key"))) {
                var records = factory.getMongoDatabase().getCollection(spec.get(0));
                records.createIndex(new Document("baseGroupId", 1).append(spec.get(1), 1),
                        new IndexOptions().name(spec.get(2) + "_group").unique(true));
                for (var index : records.listIndexes()) {
                    if (spec.get(2).equals(index.getString("name"))) { records.dropIndex(spec.get(2)); break; }
                }
            }


        }
    }
}
