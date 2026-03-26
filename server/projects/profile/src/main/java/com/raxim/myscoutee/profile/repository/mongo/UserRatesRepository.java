package com.raxim.myscoutee.profile.repository.mongo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.UserRate;

public interface UserRatesRepository extends MongoRepository<UserRate, String> {
    Optional<UserRate> findBySyncKey(String syncKey);

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
