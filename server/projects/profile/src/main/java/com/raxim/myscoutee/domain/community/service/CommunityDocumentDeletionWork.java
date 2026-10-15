package com.raxim.myscoutee.domain.community.service;

import java.time.Instant;
import java.util.*;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.media.api.MediaDeletionQueue;
import com.raxim.myscoutee.domain.community.api.CommunityMediaVisibility;
import com.raxim.myscoutee.domain.campaigns.api.CampaignMediaVisibility;

/** Owner outbox: attachment removal and handoff intent share the same atomic save. */
@Service
public class CommunityDocumentDeletionWork {
    private static final String COLLECTION = "communityAnnouncements";
    private final MongoTemplate mongo;
    private final MediaDeletionQueue media;
    private final CommunityMediaVisibility announcements;
    private final CampaignMediaVisibility campaigns;
    public CommunityDocumentDeletionWork(MongoTemplate mongo, MediaDeletionQueue media,
            CommunityMediaVisibility announcements, CampaignMediaVisibility campaigns) {
        this.mongo = mongo; this.media = media; this.announcements = announcements; this.campaigns = campaigns;
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watch(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("community-document-deletion", Set.of(COLLECTION), Set.of("pendingDocumentDeletes"), this::drain);
    }
    public Instant drain() {
        var query = Query.query(Criteria.where("documentCleanupPending").is(true));
        query.fields().include("pendingDocumentDeletes");
        var rows = mongo.find(query.limit(3), Document.class, COLLECTION);
        var ids = rows.stream().map(row -> row.get("_id")).toList();
        var references = rows.stream().flatMap(row -> row.getList("pendingDocumentDeletes", String.class, List.of()).stream())
                .distinct().limit(32).toList();
        if (!references.isEmpty()) {
            var retained = new HashSet<>(announcements.referencedDocuments(references));
            retained.addAll(campaigns.referencedDocuments(references));
            var removed = references.stream().filter(url -> !retained.contains(url)).toList();
            if (!removed.isEmpty()) media.enqueue("myscoutee-community", removed);
            // A lost enqueue reply leaves the outbox intact; replay is idempotent.
            mongo.updateMulti(Query.query(Criteria.where("_id").in(ids)),
                    new Update().pullAll("pendingDocumentDeletes", references.toArray()), COLLECTION);
        }
        if (!ids.isEmpty()) mongo.updateMulti(Query.query(Criteria.where("_id").in(ids).and("pendingDocumentDeletes.0").exists(false)),
                new Update().unset("documentCleanupPending").unset("pendingDocumentDeletes"), COLLECTION);
        return mongo.exists(Query.query(Criteria.where("documentCleanupPending").is(true)), COLLECTION)
                ? Instant.now().plusSeconds(10) : null;
    }
}
