package com.raxim.myscoutee.domain.payments.service;

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
import com.raxim.myscoutee.domain.payments.document.AffiliateLink;
import com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.AffiliateSummaryDto;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationParticipantSummaryDto;

@Service
public class AffiliateService implements com.raxim.myscoutee.domain.payments.api.Affiliates, com.raxim.myscoutee.domain.payments.api.AffiliateRegistrations {
    private final com.raxim.myscoutee.domain.accounts.api.ProfileIdentities profiles;

    private final MongoTemplate mongo;
    private AffiliateRevenueService revenue;

    @org.springframework.beans.factory.annotation.Autowired
    void setRevenue(AffiliateRevenueService revenue) {
        this.revenue = revenue;
    }

    public AffiliateService(MongoTemplate mongo,
            com.raxim.myscoutee.domain.accounts.api.ProfileIdentities profiles,
            com.raxim.myscoutee.domain.integrations.api.ParticipantStatistics participantStatistics) {
        this.profiles = profiles;
        this.participantStatistics = participantStatistics;
 this.mongo = mongo; }

    public String link(String owner) {
        var link = mongo.findAndModify(Query.query(Criteria.where("_id").is(owner)), new Update()
                .setOnInsert("code", UUID.randomUUID().toString())
                .setOnInsert("createdAtIso", Instant.now().toString()),
                FindAndModifyOptions.options().upsert(true).returnNew(true), AffiliateLink.class);
        if (link == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, "Affiliate link could not be stored.");
        }
        return "/entry?affiliate=" + link.code();
    }

    public AffiliateSummaryDto summary(String owner) {
        String url = link(owner);
        long registered = mongo.count(Query.query(Criteria.where("referrerUserId").is(owner)), AffiliateRegistration.class, "affiliateRegistrations");
        return new AffiliateSummaryDto(url, registered, revenue == null ? null : revenue.summary(owner));
    }

    private final com.raxim.myscoutee.domain.integrations.api.ParticipantStatistics participantStatistics;
    public IntegrationParticipantSummaryDto participantSummary(String owner) { return participantStatistics.participantSummary(owner); }

    public AffiliateRegistration resolveRegistration(String code, String userId) {
        if (code == null || !code.matches("[a-f0-9-]{36}")) return null;
        var link = mongo.findOne(Query.query(Criteria.where("code").is(code)), AffiliateLink.class);
        if (link == null || link.ownerUserId().equals(userId)) return null;
        if (!profiles.existsNotDeleted(link.ownerUserId())) return null;
        return new AffiliateRegistration(userId, link.ownerUserId(), link.code(), Instant.now().toString());
    }

    public void recordRegistration(AffiliateRegistration registration) {
        if (registration == null) return;
        // The attribution is saved with the profile first; retrying its save safely completes this audit write.
        mongo.upsert(Query.query(Criteria.where("_id").is(registration.userId())), new Update()
                .setOnInsert("referrerUserId", registration.referrerUserId())
                .setOnInsert("code", registration.code())
                .setOnInsert("registeredAtIso", registration.registeredAtIso()), AffiliateRegistration.class, "affiliateRegistrations");
    }
}
