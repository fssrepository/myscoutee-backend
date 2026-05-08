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

    @Query("{'$or': ["
            + " {'mode': 'single', 'ownerUserId': ?0, 'relatedUserId': ?1},"
            + " {'mode': 'single', 'ownerUserId': ?1, 'relatedUserId': ?0},"
            + " {'mode': 'pair', 'relatedUserId': ?0, 'secondaryRelatedUserId': ?1},"
            + " {'mode': 'pair', 'relatedUserId': ?1, 'secondaryRelatedUserId': ?0}"
            + " ]}")
    List<UserRate> findEvidenceForPair(String firstUserId, String secondUserId);

    List<UserRate> findByOwnerUserId(String ownerUserId);

    List<UserRate> findByOwnerUserIdAndMode(String ownerUserId, String mode);
}
