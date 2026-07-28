package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;

public interface OperatorRegistrySettingsRepository
        extends MongoRepository<OperatorRegistrySettings, String> {
}
