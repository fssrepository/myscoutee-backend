package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.UserRate;

public interface UserRatesRepository extends MongoRepository<UserRate, String> {
    Optional<UserRate> findBySyncKey(String syncKey);

    @Query("{'$or': [ {'ownerUserId': {'$in': ?0}}, {'relatedUserId': {'$in': ?0}}, {'secondaryRelatedUserId': {'$in': ?0}} ]}")
    List<UserRate> findRelevantByUserIds(List<String> userIds);

    List<UserRate> findByOwnerUserId(String ownerUserId);

    List<UserRate> findByOwnerUserIdAndMode(String ownerUserId, String mode);
}
