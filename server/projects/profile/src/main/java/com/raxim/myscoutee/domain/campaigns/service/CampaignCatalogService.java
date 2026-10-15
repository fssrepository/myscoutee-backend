package com.raxim.myscoutee.domain.campaigns.service;

import com.raxim.myscoutee.domain.affinity.api.RatingDirectory;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignOrganizerContactDto;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto;
import java.util.Objects;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.campaigns.api.CampaignCatalog;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignMediaVisibilityDto;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;

@Service
public class CampaignCatalogService implements CampaignCatalog, com.raxim.myscoutee.domain.campaigns.api.CampaignMediaVisibility {
    private final MongoTemplate mongo;
    private final RatingDirectory ratings;
    public CampaignCatalogService(MongoTemplate mongo, RatingDirectory ratings) {
        this.mongo = mongo;
        this.ratings = ratings;
    }
    @Override public CampaignOrganizerContactDto organizerContact(
            String id, String viewerId, String workspaceGroupId) {
        var campaign = find(id);
        if (campaign == null || !Objects.equals(workspaceGroupId, campaign.workspaceGroupId())
                || !"published".equals(campaign.status()) || viewerId.equals(campaign.ownerUserId())) return null;
        return new CampaignOrganizerContactDto(
                CampaignSummaryDto.from(campaign),
                ratings.hasPositiveCampaignRating(campaign.id(), viewerId, campaign.ownerUserId()));
    }
    @Override public Campaign find(String id) { return mongo.findById(id, Campaign.class); }
    @Override public Map<String, Campaign> findByIds(Collection<String> ids) {
        if (ids.isEmpty()) return Map.of();
        return mongo.find(Query.query(Criteria.where("_id").in(ids)), Campaign.class).stream().collect(Collectors.toMap(Campaign::id, c -> c));
    }
    @Override public boolean ownedExists(String ownerUserId, String id) {
        return mongo.exists(Query.query(Criteria.where("ownerUserId").is(ownerUserId).and("_id").is(id)), Campaign.class);
    }
    @Override public CampaignMediaVisibilityDto mediaReference(List<String> urls) {
        Query query = Query.query(new Criteria().orOperator(Criteria.where("imageUrls").in(urls), Criteria.where("attachments.url").in(urls)));
        query.fields().include("workspaceGroupId").include("status");
        Document record = mongo.findOne(query, Document.class, "campaigns");
        return record == null ? null : new CampaignMediaVisibilityDto(record.getString("workspaceGroupId"), record.getString("status"));
    }
    @Override public List<String> referencedDocuments(List<String> urls) {
        if (urls == null || urls.isEmpty() || urls.size() > 32) throw new IllegalArgumentException("Invalid document reference batch");
        Query query = Query.query(Criteria.where("attachments.url").in(urls));
        // Distinct uses the attachment index; project only matching URLs, including drafts/trash.
        return mongo.findDistinct(query, "attachments.url", "campaigns", String.class).stream()
                .filter(urls::contains).toList();
    }

}
