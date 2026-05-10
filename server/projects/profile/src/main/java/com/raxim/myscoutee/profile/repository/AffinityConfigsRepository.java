package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;

public interface AffinityConfigsRepository extends MongoRepository<AffinityConfig, String> {
    Optional<AffinityConfig> findFirstByActiveTrueOrderByVersionDesc();
}
