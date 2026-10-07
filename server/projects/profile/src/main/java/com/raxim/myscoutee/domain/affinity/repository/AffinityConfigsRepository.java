package com.raxim.myscoutee.domain.affinity.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.affinity.document.AffinityConfig;

public interface AffinityConfigsRepository extends MongoRepository<AffinityConfig, String> {
    Optional<AffinityConfig> findFirstByKeyAndActiveTrueOrderByVersionDesc(String key);
    Optional<AffinityConfig> findFirstByKeyOrderByVersionDesc(String key);
    List<AffinityConfig> findByActiveTrue();
    List<AffinityConfig> findByKeyOrderByVersionDesc(String key);
    Optional<AffinityConfig> findByKeyAndVersion(String key, Integer version);
}
