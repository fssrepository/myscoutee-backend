package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.EventCheckoutBasketItem;

public interface EventCheckoutBasketItemsRepository extends MongoRepository<EventCheckoutBasketItem, String> {
    @Query(value = "{ 'userId': ?0, 'sourceId': ?1, 'status': { $in: ?2 } }", sort = "{ 'selectedDateKey': 1, 'createdAtIso': 1, 'itemId': 1 }")
    List<EventCheckoutBasketItem> findByUserIdAndSourceIdAndStatusIn(
            String userId,
            String sourceId,
            Collection<String> statuses);
}
