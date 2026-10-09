package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.domain.events.api.EventMediaVisibility;
import com.raxim.myscoutee.domain.events.dto.EventMediaVisibilityDto;
import com.raxim.myscoutee.domain.events.dto.CommunityMediaMembershipDto;

@Service
public class EventMediaVisibilityService implements EventMediaVisibility {
    private final MongoTemplate mongo;
    public EventMediaVisibilityService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public EventMediaVisibilityDto event(List<String> urls) {
        Query query = Query.query(new Criteria().orOperator(Criteria.where("imageUrl").in(urls), Criteria.where("imageUrls").in(urls)));
        for (String field : List.of("creatorUserId", "organizerUserId", "admins", "moderationStatus", "visibility", "status", "published",
                "acceptedMemberUserIds", "invitedMemberUserIds", "pendingRequestMemberUserIds")) query.fields().include(field);
        Document value = mongo.findOne(query, Document.class, "events");
        return value == null ? null : new EventMediaVisibilityDto(value.getString("creatorUserId"), value.getString("organizerUserId"), value.getString("moderationStatus"),
                value.getString("visibility"), value.getString("status"), list(value, "admins"), list(value, "acceptedMemberUserIds"),
                list(value, "invitedMemberUserIds"), list(value, "pendingRequestMemberUserIds"));
    }
    @Override public CommunityMediaMembershipDto acceptedCommunityMember(String communityId, String accountId) {
        Query query = Query.query(Criteria.where("ownerType").is("community").and("ownerId").is(communityId)
                .and("userId").is(accountId).and("status").is("accepted")); query.fields().include("role");
        Document value = mongo.findOne(query, Document.class, "activityMembers");
        return value == null ? null : new CommunityMediaMembershipDto(value.getString("role"));
    }
    private List<?> list(Document value, String field) {
        return value.get(field) instanceof List<?> list ? java.util.Collections.unmodifiableList(new java.util.ArrayList<>(list)) : List.of();
    }
}
