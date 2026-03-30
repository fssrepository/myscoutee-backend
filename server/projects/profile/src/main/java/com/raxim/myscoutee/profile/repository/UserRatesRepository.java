package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.UserRate;

public interface UserRatesRepository extends MongoRepository<UserRate, String> {
    Optional<UserRate> findBySyncKey(String syncKey);

    List<UserRate> findBySource(String source);

    @Query("{'source': ?0, '$or': [ {'ownerUserId': {'$in': ?1}}, {'relatedUserId': {'$in': ?1}}, {'secondaryRelatedUserId': {'$in': ?1}} ]}")
    List<UserRate> findRelevantBySourceAndUserIds(String source, List<String> userIds);

    List<UserRate> findByOwnerUserId(String ownerUserId);

    List<UserRate> findByOwnerUserIdAndSource(String ownerUserId, String source);

    List<UserRate> findByOwnerUserIdAndSourceAndMode(
            String ownerUserId,
            String source,
            String mode);

    List<UserRate> findBySourceAndFromUserId(String source, String fromUserId);

    List<UserRate> findBySourceAndToUserId(String source, String toUserId);

    List<UserRate> findBySourceAndModeAndOwnerUserId(String source, String mode, String ownerUserId);
}
