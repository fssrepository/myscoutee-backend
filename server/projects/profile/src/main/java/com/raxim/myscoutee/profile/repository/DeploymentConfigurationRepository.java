package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;

public interface DeploymentConfigurationRepository
        extends MongoRepository<DeploymentConfiguration, String> {
}
