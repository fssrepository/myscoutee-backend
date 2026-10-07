package com.raxim.myscoutee.domain.groups.service;

import java.util.List;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.domain.groups.api.GroupMediaVisibility;

@Service
public class GroupMediaVisibilityService implements GroupMediaVisibility {
    private final MongoTemplate mongo;
    public GroupMediaVisibilityService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public Group group(String id) {
        Query query = Query.query(Criteria.where("_id").is(id)); query.fields().include("lifecycleStatus");
        Document value = mongo.findOne(query, Document.class, "communityGroups");
        return value == null ? null : new Group(value.getString("lifecycleStatus"));
    }
}
