package com.raxim.myscoutee.domain.operator.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.operator.document.OperatorRegistrySettings;

public interface OperatorRegistrySettingsRepository
        extends MongoRepository<OperatorRegistrySettings, String> {
}
