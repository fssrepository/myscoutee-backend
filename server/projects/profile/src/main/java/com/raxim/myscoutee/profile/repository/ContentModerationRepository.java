package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Map;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;
import com.raxim.myscoutee.profile.data.dto.admin.ContentModerationDtos.*;

@Repository
public class ContentModerationRepository {
    private final MongoTemplate mongo;
    public ContentModerationRepository(MongoTemplate mongo) { this.mongo = mongo; }
    public State state() {
        var state = mongo.findById("global", State.class);
        return state == null ? new State("global", 0, Settings.defaults(), Map.of(), List.of()) : state;
    }
    public Item item(String id) { return mongo.findById(id, Item.class); }
    public void saveItem(Item item) {
        var query = Query.query(Criteria.where("_id").is(item.id()).andOperator(new Criteria().orOperator(
                Criteria.where("version").lte(item.version()), Criteria.where("version").exists(false))));
        var document = new org.bson.Document(); mongo.getConverter().write(item, document);
        var update = new Update(); document.forEach((key, value) -> { if (!key.equals("_id")) update.set(key, value); });
        try { mongo.upsert(query, update, Item.class); } catch (DuplicateKeyException ignored) { /* A newer committed decision won. */ }
    }
    public boolean compareAndSet(State previous, Settings settings, Map<String, Map<String, Long>> counts, List<Mutation> pending) {
        try {
            return mongo.findAndModify(Query.query(Criteria.where("_id").is("global").and("revision").is(previous.revision())),
                    new Update().inc("revision", 1).set("settings", settings).set("counts", counts).set("pending", pending),
                    FindAndModifyOptions.options().upsert(previous.revision() == 0).returnNew(true), State.class) != null;
        } catch (DuplicateKeyException ex) { return false; }
    }
    public List<Item> page(String category, String status, String cursor, int limit) {
        var criteria = Criteria.where("status").is(status).and("deleted").ne(true);
        if (!"all".equals(category)) criteria.and("category").is(category);
        if (cursor != null && !cursor.isBlank()) criteria.and("_id").gt(cursor);
        return mongo.find(Query.query(criteria).with(Sort.by("_id")).limit(limit), Item.class);
    }
    public List<Item> due(Settings settings, String before, int limit) {
        return mongo.find(Query.query(Criteria.where("status").is("under-review").and("category").in(settings.categories())
                .and("submittedAtIso").lte(before).and("deleted").ne(true)).with(Sort.by("submittedAtIso")).limit(limit), Item.class);
    }
    public List<Item> withheld(int limit) {
        return mongo.find(Query.query(Criteria.where("status").in("under-review", "rejected", "blocked").and("deleted").ne(true))
                .with(Sort.by("_id")).limit(limit), Item.class);
    }
}
