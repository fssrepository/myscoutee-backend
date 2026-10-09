package com.raxim.myscoutee.domain.help.config;

import java.util.List;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.stereotype.Component;
import com.mongodb.client.model.IndexOptions;
import jakarta.annotation.PostConstruct;

@Component
public class HelpCenterIndexInitializer {
    private final List<MongoDatabaseFactory> databases;

    public HelpCenterIndexInitializer(@Qualifier("realMongoDatabaseFactory") MongoDatabaseFactory real,
            @Qualifier("demoMongoDatabaseFactory") MongoDatabaseFactory demo) {
        databases = List.of(real, demo);
    }

    @PostConstruct
    public void initialize() {
        for (var factory : databases) {
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
        }
    }
}
