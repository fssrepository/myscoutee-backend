package com.raxim.myscoutee.domain.affinity.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.affinity.document.AdminAffinityGraphLayout;

public interface AdminAffinityGraphLayoutsRepository extends MongoRepository<AdminAffinityGraphLayout, String> {
    Optional<AdminAffinityGraphLayout> findByLayoutVersion(String layoutVersion);

    Optional<AdminAffinityGraphLayout> findFirstByScopeKeyOrderByGeneratedAtIsoDesc(String scopeKey);

    Optional<AdminAffinityGraphLayout> findFirstByOrderByGeneratedAtIsoDesc();
}
