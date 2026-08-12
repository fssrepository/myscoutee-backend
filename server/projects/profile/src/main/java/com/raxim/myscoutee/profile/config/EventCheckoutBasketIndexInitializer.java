package com.raxim.myscoutee.profile.config;

import java.util.List;

import org.bson.Document;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.PartialIndexFilter;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.data.document.EventCheckoutBasketItem;

import jakarta.annotation.PostConstruct;

@Component
public class EventCheckoutBasketIndexInitializer {
    private static final String LEGACY_ITEM_INDEX = "checkout_basket_user_source_item";
    private static final String ACTIVE_ITEM_INDEX = "checkout_basket_active_user_source_item";
    private static final List<String> ACTIVE_STATUSES =
            List.of("draft", "confirmed", "waiting", "approval-pending", "approved", "pay");
    private static final List<String> ACTIVE_RESULT_STATES = List.of("pending", "active", "failed");

    private final MongoTemplate mongoTemplate;

    public EventCheckoutBasketIndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @PostConstruct
    public void ensureIndexes() {
        normalizeReservationActive();
        mongoTemplate.indexOps(EventCheckoutBasketItem.class).createIndex(
                new Index()
                        .on("userId", Direction.ASC)
                        .on("sourceId", Direction.ASC)
                        .on("itemId", Direction.ASC)
                        .unique()
                        .partial(PartialIndexFilter.of(Criteria.where("reservationActive").is(true)))
                        .named(ACTIVE_ITEM_INDEX));
        dropIndexIfPresent(LEGACY_ITEM_INDEX);
        dropIndexIfPresent("checkout_basket_attempt_key");
        dropIndexIfPresent("checkout_basket_active_key");
    }

    private void normalizeReservationActive() {
        Document activeResultState = new Document("$or", List.of(
                new Document("$eq", List.of(new Document("$type", "$resultState"), "missing")),
                new Document("$in", List.of("$resultState", ACTIVE_RESULT_STATES))));
        Document activeReservation = new Document("$and", List.of(
                new Document("$in", List.of("$status", ACTIVE_STATUSES)),
                activeResultState));
        mongoTemplate.getCollection(mongoTemplate.getCollectionName(EventCheckoutBasketItem.class)).updateMany(
                new Document(),
                List.of(new Document("$set", new Document("reservationActive", activeReservation))));
    }

    private void dropIndexIfPresent(String indexName) {
        if (mongoTemplate.indexOps(EventCheckoutBasketItem.class).getIndexInfo().stream()
                .anyMatch(index -> indexName.equals(index.getName()))) {
            mongoTemplate.indexOps(EventCheckoutBasketItem.class).dropIndex(indexName);
        }
    }
}
