package com.raxim.myscoutee.domain.content.service;

import java.util.List;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.domain.content.api.ContentMediaVisibility;
import com.raxim.myscoutee.domain.content.dto.FeedPostMediaVisibilityDto;

@Service
public class ContentMediaVisibilityService implements ContentMediaVisibility {
    private final MongoTemplate mongo;
    public ContentMediaVisibilityService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public FeedPostMediaVisibilityDto feedPost(List<String> urls) {
        Query query = Query.query(Criteria.where("imageUrls").in(urls).and("deleted").ne(true)); query.fields().include("moderationStatus");
        Document value = mongo.findOne(query, Document.class, "photoFeedPosts");
        return value == null ? null : new FeedPostMediaVisibilityDto(value.getString("moderationStatus"));
    }
}
