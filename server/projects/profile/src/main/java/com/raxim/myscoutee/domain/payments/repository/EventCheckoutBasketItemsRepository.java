package com.raxim.myscoutee.domain.payments.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.domain.payments.document.EventCheckoutBasketItem;

public interface EventCheckoutBasketItemsRepository extends MongoRepository<EventCheckoutBasketItem, String> {
    @Query(value = "{ 'userId': ?0, 'sourceId': ?1, 'status': { $in: ?2 }, $or: [ { 'resultState': { $exists: false } }, { 'resultState': { $in: ?3 } } ] }", sort = "{ 'selectedDateKey': 1, 'createdAtIso': 1, 'itemId': 1 }")
    List<EventCheckoutBasketItem> findByUserIdAndSourceIdAndStatusInAndVisibleResultState(
            String userId,
            String sourceId,
            Collection<String> statuses,
            Collection<String> resultStates);

    @Query(
            value = "{ 'userId': ?0, 'sourceId': { $in: ?1 }, 'status': { $in: ?2 }, $or: [ { 'resultState': { $exists: false } }, { 'resultState': { $in: ?3 } } ] }",
            fields = "{ '_id': 0, 'sourceId': 1, 'resultState': 1, 'status': 1 }")
    List<EventCheckoutBasketItem> findByUserIdAndSourceIdInAndStatusInAndVisibleResultState(
            String userId,
            Collection<String> sourceIds,
            Collection<String> statuses,
            Collection<String> resultStates);

    @Query(value = "{ 'sourceId': ?0, 'status': { $in: ?1 }, $or: [ { 'resultState': { $exists: false } }, { 'resultState': { $in: ?2 } } ] }", sort = "{ 'selectedDateKey': 1, 'createdAtIso': 1, 'itemId': 1 }")
    List<EventCheckoutBasketItem> findBySourceIdAndStatusInAndVisibleResultState(
            String sourceId,
            Collection<String> statuses,
            Collection<String> resultStates);
}
