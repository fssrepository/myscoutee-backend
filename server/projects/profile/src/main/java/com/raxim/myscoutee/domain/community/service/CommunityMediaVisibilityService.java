package com.raxim.myscoutee.domain.community.service;

import java.util.List;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.domain.community.api.CommunityMediaVisibility;
import com.raxim.myscoutee.domain.community.dto.AnnouncementMediaVisibilityDto;
import com.raxim.myscoutee.domain.community.dto.OfferingMediaVisibilityDto;

@Service
public class CommunityMediaVisibilityService implements CommunityMediaVisibility {
    private final MongoTemplate mongo;
    public CommunityMediaVisibilityService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public AnnouncementMediaVisibilityDto announcement(List<String> urls) {
        Query query = Query.query(Criteria.where("attachments.url").in(urls)); query.fields().include("communityId").include("status");
        Document value = mongo.findOne(query, Document.class, "communityAnnouncements");
        return value == null ? null : new AnnouncementMediaVisibilityDto(value.getString("communityId"), value.getString("status"));
    }
    @Override public OfferingMediaVisibilityDto offering(List<String> urls) {
        Query query = Query.query(Criteria.where("imageUrls").in(urls)); query.fields().include("baseGroupId").include("status");
        Document value = mongo.findOne(query, Document.class, "serviceOfferings");
        return value == null ? null : new OfferingMediaVisibilityDto(value.getString("baseGroupId"), value.getString("status"));
    }
}
