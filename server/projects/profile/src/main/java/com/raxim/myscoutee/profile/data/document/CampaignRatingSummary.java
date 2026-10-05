package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/** Read projection of campaign ratings. Kept separately from affinity edges:
 * a one-sided rating must remain readable even when it has no matching weight. */
@Document(collection = "campaignRatingSummaries")
public record CampaignRatingSummary(@Id String id, @Indexed String leftUserId,
        @Indexed String rightUserId, UserRate rate, int version) { }
