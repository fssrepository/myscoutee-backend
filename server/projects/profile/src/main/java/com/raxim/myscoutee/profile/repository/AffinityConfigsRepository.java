package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;

public interface AffinityConfigsRepository extends MongoRepository<AffinityConfig, String> {
    Optional<AffinityConfig> findFirstByKeyAndActiveTrueOrderByVersionDesc(String key);
    Optional<AffinityConfig> findFirstByKeyOrderByVersionDesc(String key);
    List<AffinityConfig> findByActiveTrue();
    List<AffinityConfig> findByKeyOrderByVersionDesc(String key);
    Optional<AffinityConfig> findByKeyAndVersion(String key, Integer version);
}
