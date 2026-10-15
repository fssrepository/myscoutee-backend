package com.raxim.myscoutee.domain.campaigns.service;

import com.raxim.myscoutee.domain.affinity.api.RatingDirectory;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import java.util.List;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@Tag("standard")
class CampaignCatalogServiceTest {
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final RatingDirectory ratings = mock(RatingDirectory.class);
    private final CampaignCatalogService service = new CampaignCatalogService(mongo, ratings);

    @Test void unavailableCampaignsDoNotReadRatings() {
        assertThat(service.organizerContact("missing", "viewer", "work")).isNull();
        when(mongo.findById("campaign", Campaign.class)).thenReturn(campaign("draft"));
        assertThat(service.organizerContact("campaign", "viewer", "work")).isNull();
        when(mongo.findById("campaign", Campaign.class)).thenReturn(campaign("published"));
        assertThat(service.organizerContact("campaign", "viewer", "other")).isNull();
        assertThat(service.organizerContact("campaign", "organizer", "work")).isNull();
        verifyNoInteractions(ratings);
    }

    @Test void publishedCampaignUsesItsStoredOrganizerAndOneRatingRead() {
        when(mongo.findById("campaign", Campaign.class)).thenReturn(campaign("published"));
        when(ratings.hasPositiveCampaignRating("campaign", "viewer", "organizer")).thenReturn(true);
        var contact = service.organizerContact("campaign", "viewer", "work");
        assertThat(contact.positivelyRated()).isTrue();
        assertThat(contact.campaign().title()).isEqualTo("Idea");
        assertThat(contact.campaign().ownerUserId()).isEqualTo("organizer");
        verify(mongo).findById("campaign", Campaign.class);
        verify(ratings).hasPositiveCampaignRating("campaign", "viewer", "organizer");
        verifyNoMoreInteractions(mongo, ratings);
    }

    @Test void missingRatingRemainsDistinctFromUnavailableCampaign() {
        when(mongo.findById("campaign", Campaign.class)).thenReturn(campaign("published"));
        assertThat(service.organizerContact("campaign", "viewer", "work").positivelyRated()).isFalse();
    }

    @Test void ratingFailurePropagatesInsteadOfGrantingOrDenyingAccess() {
        when(mongo.findById("campaign", Campaign.class)).thenReturn(campaign("published"));
        when(ratings.hasPositiveCampaignRating("campaign", "viewer", "organizer"))
                .thenThrow(new IllegalStateException("unavailable"));
        assertThatThrownBy(() -> service.organizerContact("campaign", "viewer", "work"))
                .isInstanceOf(IllegalStateException.class);
    }



    private Campaign campaign(String status) {
        return new Campaign("campaign", "work", "organizer", "Idea", "Description",
                "business", "technology", List.of(), List.of(), status, "now", "now", 1L);
    }
}
