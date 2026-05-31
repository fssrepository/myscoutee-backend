package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AppSettings;

public interface AppSettingsRepository extends MongoRepository<AppSettings, String> {
    Optional<AppSettings> findBySettingsKey(String settingsKey);
}
