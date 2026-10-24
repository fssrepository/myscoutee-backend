package com.raxim.myscoutee.domain.campaigns.service;

import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.campaigns.repository.CampaignsRepository;

/** Campaign state and its counter intent are saved together, as in FeedbackCounterWork.
 * The account owner applies each source revision once; recovery reuses that same command. */
@Service
public class CampaignCounterWork {
    public record Saved(Campaign campaign, MenuCounterUpdates.Snapshot owner) {}
    private final CampaignsRepository campaigns;
    private final MenuCounterUpdates counters;
    private final MongoTemplate mongo;
    public CampaignCounterWork(CampaignsRepository campaigns, MenuCounterUpdates counters, MongoTemplate mongo) {
        this.campaigns = campaigns; this.counters = counters; this.mongo = mongo;
    }
    public Saved save(Campaign next, Campaign previous) {
        if (previous != null && previous.counterChange() != null) finish(previous);
        long revision = previous == null || previous.counterRevision() == null ? 0 : previous.counterRevision();
        Map<String, Integer> deltas = new LinkedHashMap<>();
        if (revision > 0) deltas.put(key(previous.status()), -1);
        deltas.merge(key(next.status()), 1, Integer::sum);
        // Stable persisted receipt/counter identity; never a password, signature or integrity proof.
        @SuppressWarnings("java:S4790")
        String sourceKey = "campaign-" + org.springframework.util.DigestUtils.md5DigestAsHex(
                next.id().getBytes(java.nio.charset.StandardCharsets.UTF_8));
        var change = new MenuCounterUpdates.Change(next.ownerUserId(), next.workspaceGroupId(), sourceKey, revision + 1, Map.copyOf(deltas));
        Campaign saved = campaigns.save(new Campaign(next.id(), next.workspaceGroupId(), next.ownerUserId(), next.title(),
                next.description(), next.kind(), next.category(), next.imageUrls(), next.attachments(), next.status(),
                next.createdAtIso(), next.updatedAtIso(), next.version(), revision + 1, change));
        return new Saved(saved, finish(saved));
    }
    public MenuCounterUpdates.Snapshot finish(Campaign saved) {
        var result = counters.apply(saved.counterChange());
        // Acknowledgement changes no editable data. Explicitly retain @Version so
        // the returned save version remains usable by the next editor action.
        mongo.updateFirst(Query.query(Criteria.where("_id").is(saved.id()).and("counterChange.revision").is(saved.counterRevision())),
                new Update().unset("counterChange").inc("version", 0L), Campaign.class);
        return result;
    }
    static String key(String status) {
        return switch (status) {
            case "published" -> "campaignsPublished";
            case "draft" -> "campaignsDrafts";
            case "trash" -> "campaignsTrash";
            default -> throw new IllegalArgumentException("Invalid campaign status");
        };
    }
    static Map<String, Integer> buckets(Map<String, Integer> values) {
        return Map.of("published", values.getOrDefault(key("published"), 0),
                "draft", values.getOrDefault(key("draft"), 0), "trash", values.getOrDefault(key("trash"), 0));
    }
    @org.springframework.beans.factory.annotation.Autowired
    void watchPendingWork(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes) {
        changes.watch("CampaignCounterWork", Set.of("campaigns"), Set.of("counterChange", "counterRevision"), () -> {
            Query pending = Query.query(new Criteria().orOperator(Criteria.where("counterChange").ne(null),
                    Criteria.where("counterRevision").exists(false), Criteria.where("counterRevision").is(0)));
            // Existing rows enter the same write path once; no list/poll query rebuilds counters.
            for (var campaign : mongo.find(pending.limit(20), Campaign.class)) {
                try {
                    if (campaign.counterChange() != null) finish(campaign);
                    else save(campaign, campaign);
                } catch (RuntimeException failure) {
                    org.slf4j.LoggerFactory.getLogger(CampaignCounterWork.class).warn(
                            "Campaign counter work remains pending ({})", failure.getClass().getSimpleName());
                }
            }
            return mongo.exists(pending, Campaign.class) ? java.time.Instant.now().plusSeconds(10) : null;
        });
    }
}
