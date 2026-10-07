package com.raxim.myscoutee.domain.affinity.service;

import static org.assertj.core.api.Assertions.assertThat;
import java.util.List;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.affinity.document.UserRate;

@org.junit.jupiter.api.Tag("standard")
class CampaignRatingProjectionServiceTest {
    @Test void averagesContextsWithoutDoubleCountingReciprocalCaches() {
        var first = rate("a", "b", "one", 8d, 0d, "2026-10-01");
        var second = rate("a", "b", "two", 9d, 0d, "2026-10-02");
        var reciprocal = rate("b", "a", "one", 6d, 2d, "2026-10-03");
        var summary = CampaignRatingProjectionService.aggregate(List.of(first, second, reciprocal));
        assertThat(summary.getScoreGiven()).isEqualTo(8.5d);
        assertThat(summary.getScoreReceived()).isEqualTo(6d);
        assertThat(summary.getOwnerUserId()).isEqualTo("a");
        assertThat(summary.getCampaignId()).isNull();
        assertThat(summary.getRatingSnapshots()).isNullOrEmpty();
    }

    @Test void usesLatestOwnScoreAndPreservesFractionalPrecision() {
        var summary = CampaignRatingProjectionService.aggregate(List.of(
                rate("a", "b", "one", 8d, 0d, "2026-10-01"),
                rate("a", "b", "one", 9d, 0d, "2026-10-02"),
                rate("a", "b", "two", 8.25d, 0d, "2026-10-01")));
        assertThat(summary.getScoreGiven()).isEqualTo(8.625d);
        assertThat(summary.getScoreReceived()).isZero();
    }

    @Test void leavesOrdinaryRatingsOnTheirExistingPath() {
        assertThat(CampaignRatingProjectionService.aggregate(List.of(
                rate("a", "b", null, 8d, 7d, "2026-10-01")))).isNull();
        assertThat(CampaignRatingProjectionService.aggregate(List.of())).isNull();
    }

    private UserRate rate(String owner, String related, String campaign, double given, double received, String updated) {
        var rate = new UserRate();
        rate.setMode("single"); rate.setOwnerUserId(owner); rate.setRelatedUserId(related);
        rate.setCampaignId(campaign); rate.setScoreGiven(given); rate.setScoreReceived(received);
        rate.setUpdatedDate(updated); rate.setCreatedDate(updated);
        return rate;
    }
}
