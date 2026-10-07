package com.raxim.myscoutee.domain.accounts.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.accounts.document.UserFilterPreferences;

public interface UserFilterPreferencesRepository extends MongoRepository<UserFilterPreferences, String> {
    Optional<UserFilterPreferences> findByUserId(String userId);
}
