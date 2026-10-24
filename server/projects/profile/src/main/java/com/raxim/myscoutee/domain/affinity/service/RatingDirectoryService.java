package com.raxim.myscoutee.domain.affinity.service;
import com.raxim.myscoutee.domain.affinity.api.*;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
@org.springframework.stereotype.Service
public class RatingDirectoryService implements RatingDirectory {
    private final UserRatesRepository records;
    public RatingDirectoryService(UserRatesRepository records,
            org.springframework.data.mongodb.core.MongoTemplate mongo) {
        this.mongo = mongo;
 this.records = records; }
    public java.util.List<? extends RatingView> findRelevantByUserIds(java.util.List<String> ids) { return records.findRelevantByUserIds(ids); }
    public java.util.List<? extends RatingView> findAll() { return records.findAll(); }
    public java.util.List<? extends RatingView> findHomeGameExclusionProjections(String id) { return records.findHomeGameExclusionProjections(id); }
    private final org.springframework.data.mongodb.core.MongoTemplate mongo;
    public boolean hasPositiveCampaignRating(String campaignId, String viewerId, String organizerId) {
        return mongo.exists(org.springframework.data.mongodb.core.query.Query.query(
            org.springframework.data.mongodb.core.query.Criteria.where("campaignId").is(campaignId)
                .and("ownerUserId").is(viewerId).and("relatedUserId").is(organizerId).and("scoreGiven").gt(0)),
            com.raxim.myscoutee.domain.affinity.document.UserRate.class);
    }
}
