package com.raxim.myscoutee.domain.assets.service;

import java.util.List;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.domain.assets.api.AssetMediaVisibility;
import com.raxim.myscoutee.domain.assets.dto.AssetMediaVisibilityDto;

@Service
public class AssetMediaVisibilityService implements AssetMediaVisibility {
    private final MongoTemplate mongo;
    public AssetMediaVisibilityService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public AssetMediaVisibilityDto asset(List<String> urls) {
        Query query = Query.query(Criteria.where("imageUrl").in(urls));
        query.fields().include("ownerUserId").include("visibility").include("status").include("moderationStatus");
        Document value = mongo.findOne(query, Document.class, "assets");
        return value == null ? null : new AssetMediaVisibilityDto(value.getString("ownerUserId"), value.getString("visibility"), value.getString("status"), value.getString("moderationStatus"));
    }
}
