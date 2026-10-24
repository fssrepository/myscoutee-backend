package com.raxim.myscoutee.domain.affinity.document;

import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userRates")
@CompoundIndexes({
        @CompoundIndex(name = "user_rate_owner_mode_updated_v2", def = "{'ownerUserId': 1, 'mode': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "user_rate_primary_lookup_v2", def = "{'relatedUserId': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "user_rate_secondary_lookup_v2", def = "{'secondaryRelatedUserId': 1, 'updatedDate': -1}", sparse = true),
        @CompoundIndex(name = "user_rate_owner_primary_mode_v2", def = "{'ownerUserId': 1, 'relatedUserId': 1, 'secondaryRelatedUserId': 1, 'mode': 1}"),
        @CompoundIndex(name = "user_rate_owner_mode_target_campaign_unique_v2", def = "{'ownerUserId': 1, 'mode': 1, 'relatedUserId': 1, 'secondaryRelatedUserId': 1, 'campaignId': 1}", unique = true),
        @CompoundIndex(name = "user_rate_qmau_window", def = "{'scoreGiven': 1, 'updatedDate': 1, 'createdDate': 1, 'ownerUserId': 1}")
})
@lombok.Getter @lombok.Setter
public class UserRate implements com.raxim.myscoutee.domain.affinity.api.RatingView {
    private String campaignId;
    @Id
    private String id;
    @Indexed(name = "user_rate_sync_key", unique = true, sparse = true)
    private String syncKey;
    private String mode;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;
    private String ownerUserId;
    private String relatedUserId;
    private String secondaryRelatedUserId;
    // Supplemental snapshots keyed by actor; shared Met records may change owner orientation.
    private Map<String, RatingSnapshot> ratingSnapshots;
    private Double scoreGiven;
    private Double scoreReceived;
    private Double affinityScore;
    private Double evidenceConfidence;
    private Boolean mutuallyRated;
    private String socialContext;
    private String bridgeUserId;
    private Integer bridgeCount;
    private Boolean met;
    private String metEventId;
    private String eventName;
    private Integer distanceMetersExact;
    private LocationSnapshot ownerLocation;

    public void setScoreGiven(Number scoreGiven) { this.scoreGiven = scoreGiven == null ? null : scoreGiven.doubleValue(); }
    public void setScoreReceived(Number scoreReceived) { this.scoreReceived = scoreReceived == null ? null : scoreReceived.doubleValue(); }

    public record RatingSnapshot(Integer version, String profileType, Map<String, Double> criteria, Double average) {}

    public record LocationSnapshot(
            Double latitude,
            Double longitude) {
    }
}
