package com.raxim.myscoutee.domain.affinity.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.domain.affinity.document.UserRate;

public interface UserRatesRepository extends MongoRepository<UserRate, String> {
    @Query("{'campaignId': ?1, '$or': [{'ownerUserId': ?0}, {'relatedUserId': ?0}, {'secondaryRelatedUserId': ?0}]}")
    List<UserRate> findRelevantInCampaign(String userId, String campaignId);
    List<UserRate> findByCampaignIdIn(Collection<String> campaignIds);

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

    @Query(
            value = "{ 'ownerUserId': ?0, '$or': [ { 'met': true }, { 'scoreGiven': { '$gt': 0 } } ] }",
            fields = "{ 'ownerUserId': 1, 'mode': 1, 'relatedUserId': 1, 'secondaryRelatedUserId': 1,"
                    + " 'scoreGiven': 1, 'met': 1 }")
    List<UserRate> findHomeGameExclusionProjections(String ownerUserId);

    @Query(
            value = "{ 'ownerUserId': { '$in': ?0 } }",
            fields = "{ 'ownerUserId': 1, 'mode': 1, 'relatedUserId': 1, 'secondaryRelatedUserId': 1,"
                    + " 'scoreGiven': 1, 'met': 1, 'createdDate': 1, 'updatedDate': 1 }")
    List<UserRate> findHomeGameRateProjectionsByOwnerUserIdIn(Collection<String> ownerUserIds);
}
