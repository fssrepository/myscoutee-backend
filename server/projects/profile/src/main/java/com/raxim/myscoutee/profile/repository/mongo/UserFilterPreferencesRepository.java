package com.raxim.myscoutee.profile.repository.mongo;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.UserFilterPreferences;

public interface UserFilterPreferencesRepository extends MongoRepository<UserFilterPreferences, String> {
    Optional<UserFilterPreferences> findByUserId(String userId);
}
