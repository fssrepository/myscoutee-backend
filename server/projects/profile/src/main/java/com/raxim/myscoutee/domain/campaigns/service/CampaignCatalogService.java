package com.raxim.myscoutee.domain.campaigns.service;

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
    public CampaignCatalogService(MongoTemplate mongo) { this.mongo = mongo; }
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
}
