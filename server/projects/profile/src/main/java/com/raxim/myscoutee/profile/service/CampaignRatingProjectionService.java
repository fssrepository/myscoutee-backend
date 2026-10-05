package com.raxim.myscoutee.profile.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.profile.data.document.CampaignRatingSummary;
import com.raxim.myscoutee.profile.data.document.UserRate;

@Service
public class CampaignRatingProjectionService {
    private final MongoTemplate mongo;
    private final AffinityCalculationService affinity;

    public CampaignRatingProjectionService(MongoTemplate mongo, AffinityCalculationService affinity) {
        this.mongo = mongo;
        this.affinity = affinity;
    }

    @jakarta.annotation.PostConstruct
    void ensureIndexes() {
        var indexes = mongo.indexOps(CampaignRatingSummary.class);
        indexes.createIndex(new org.springframework.data.mongodb.core.index.Index()
                .on("leftUserId", org.springframework.data.domain.Sort.Direction.ASC));
        indexes.createIndex(new org.springframework.data.mongodb.core.index.Index()
                .on("rightUserId", org.springframework.data.domain.Sort.Direction.ASC));
    }

    public List<CampaignRatingSummary> forUser(String userId) {
        return mongo.find(Query.query(new Criteria().orOperator(
                Criteria.where("leftUserId").is(userId), Criteria.where("rightUserId").is(userId))), CampaignRatingSummary.class);
    }

    public List<UserRate> staleEvidence() {
        // Imports can replace raw evidence without going through the writer. Reconcile
        // both live and previously projected pairs at startup, including removed pairs.
        List<UserRate> evidence = new ArrayList<>(mongo.findAll(CampaignRatingSummary.class).stream()
                .map(CampaignRatingSummary::rate).toList());
        Query query = Query.query(Criteria.where("campaignId").exists(true).nin(null, ""));
        query.fields().include("mode").include("ownerUserId").include("relatedUserId");
        evidence.addAll(mongo.find(query, UserRate.class));
        return evidence;
    }

    /** Called by the existing synchronous affinity writer and its durable recompute worker. */
    public Map<String, UserRate> write(Map<String, List<UserRate>> evidenceByPair) {
        Map<String, UserRate> summaries = new LinkedHashMap<>();
        evidenceByPair.forEach((key, rows) -> {
            UserRate summary = aggregate(rows);
            if (summary != null) summaries.put(key, summary);
        });
        affinity.applyAggregatedAffinity(new ArrayList<>(summaries.values()));
        evidenceByPair.forEach((key, rows) -> {
            UserRate summary = summaries.get(key);
            if (summary == null) mongo.remove(Query.query(Criteria.where("_id").is(key)), CampaignRatingSummary.class);
            else mongo.save(new CampaignRatingSummary(key, summary.getOwnerUserId(), summary.getRelatedUserId(), summary, 1));
        });
        return summaries;
    }

    /** Latest authoritative score per direction/context, then equal-weight arithmetic mean. */
    static UserRate aggregate(List<UserRate> evidence) {
        List<UserRate> rows = evidence.stream().filter(r -> "single".equals(r.getMode()))
                .sorted(Comparator.comparing((UserRate r) -> text(r.getUpdatedDate())).reversed()).toList();
        if (rows.stream().noneMatch(r -> !text(r.getCampaignId()).isEmpty())) return null;
        UserRate latest = rows.getFirst();
        String left = latest.getOwnerUserId().compareTo(latest.getRelatedUserId()) <= 0 ? latest.getOwnerUserId() : latest.getRelatedUserId();
        String right = left.equals(latest.getOwnerUserId()) ? latest.getRelatedUserId() : latest.getOwnerUserId();
        Map<String, Double> given = scores(rows, left), received = scores(rows, right);
        UserRate summary = new UserRate();
        summary.setId("campaign-average:" + left + ":" + right);
        summary.setMode("single"); summary.setOwnerUserId(left); summary.setRelatedUserId(right);
        summary.setScoreGiven(average(given)); summary.setScoreReceived(average(received));
        summary.setMet(rows.stream().anyMatch(r -> Boolean.TRUE.equals(r.getMet())));
        summary.setCreatedDate(latest.getCreatedDate()); summary.setUpdatedDate(latest.getUpdatedDate());
        summary.setEventName(latest.getEventName()); summary.setMetEventId(latest.getMetEventId());
        summary.setDistanceMetersExact(latest.getDistanceMetersExact());
        summary.setSocialContext(latest.getSocialContext()); summary.setBridgeUserId(latest.getBridgeUserId());
        summary.setBridgeCount(latest.getBridgeCount());
        return summary;
    }

    private static Map<String, Double> scores(List<UserRate> rows, String actor) {
        Map<String, Double> values = new LinkedHashMap<>();
        // The actor's record wins over a reciprocal score cached in somebody else's record.
        for (UserRate row : rows) if (actor.equals(row.getOwnerUserId()) && positive(row.getScoreGiven()))
            values.putIfAbsent(text(row.getCampaignId()), row.getScoreGiven());
        for (UserRate row : rows) if (!actor.equals(row.getOwnerUserId()) && positive(row.getScoreReceived()))
            values.putIfAbsent(text(row.getCampaignId()), row.getScoreReceived());
        return values;
    }
    private static double average(Map<String, Double> scores) {
        return scores.values().stream().mapToDouble(Double::doubleValue).average().orElse(0);
    }
    private static boolean positive(Double value) { return value != null && Double.isFinite(value) && value > 0; }
    private static String text(String value) { return value == null ? "" : value; }
}
