package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.profile.data.document.AffiliateLink;
import com.raxim.myscoutee.profile.data.document.AffiliateRegistration;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.AffiliateSummaryDto;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationParticipantSummaryDto;

@Service
public class AffiliateService {
    private final MongoTemplate mongo;
    @org.springframework.beans.factory.annotation.Autowired
    private AffiliateRevenueService revenue;

    public AffiliateService(MongoTemplate mongo) { this.mongo = mongo; }

    public String link(String owner) {
        var link = mongo.findAndModify(Query.query(Criteria.where("_id").is(owner)), new Update()
                .setOnInsert("code", UUID.randomUUID().toString())
                .setOnInsert("createdAtIso", Instant.now().toString()),
                FindAndModifyOptions.options().upsert(true).returnNew(true), AffiliateLink.class);
        return "/entry?affiliate=" + link.code();
    }

    public AffiliateSummaryDto summary(String owner) {
        String url = link(owner);
        long registered = mongo.count(Query.query(Criteria.where("referrerUserId").is(owner)), AffiliateRegistration.class);
        return new AffiliateSummaryDto(url, registered, revenue == null ? null : revenue.summary(owner));
    }

    public IntegrationParticipantSummaryDto participantSummary(String owner) {
        // One external participant can be invited to several events. Count the person once.
        var row = mongo.getCollection("integrationParticipantInvites").aggregate(List.of(
                new Document("$match", new Document("ownerUserId", owner).append("reusable", new Document("$ne", true))),
                new Document("$group", new Document("_id", "$participantId").append("registered",
                        new Document("$max", new Document("$cond", List.of(
                                new Document("$ne", List.of(new Document("$ifNull", List.of("$claimedUserId", "")), "")), 1, 0))))),
                new Document("$group", new Document("_id", null).append("imported", new Document("$sum", 1))
                        .append("registered", new Document("$sum", "$registered")))
        )).first();
        return row == null ? new IntegrationParticipantSummaryDto(0, 0)
                : new IntegrationParticipantSummaryDto(((Number) row.get("registered")).longValue(),
                        ((Number) row.get("imported")).longValue());
    }

    public AffiliateRegistration resolveRegistration(String code, String userId) {
        if (code == null || !code.matches("[a-f0-9-]{36}")) return null;
        var link = mongo.findOne(Query.query(Criteria.where("code").is(code)), AffiliateLink.class);
        if (link == null || link.ownerUserId().equals(userId)) return null;
        if (!mongo.exists(Query.query(Criteria.where("userId").is(link.ownerUserId())
                .and("deletedAtIso").in(null, "")), Users.class)) return null;
        return new AffiliateRegistration(userId, link.ownerUserId(), link.code(), Instant.now().toString());
    }

    public void recordRegistration(AffiliateRegistration registration) {
        if (registration == null) return;
        // The attribution is saved with the profile first; retrying its save safely completes this audit write.
        mongo.upsert(Query.query(Criteria.where("_id").is(registration.userId())), new Update()
                .setOnInsert("referrerUserId", registration.referrerUserId())
                .setOnInsert("code", registration.code())
                .setOnInsert("registeredAtIso", registration.registeredAtIso()), AffiliateRegistration.class);
    }
}
