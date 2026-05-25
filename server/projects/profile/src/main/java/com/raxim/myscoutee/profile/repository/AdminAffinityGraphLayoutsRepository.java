package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AdminAffinityGraphLayout;

public interface AdminAffinityGraphLayoutsRepository extends MongoRepository<AdminAffinityGraphLayout, String> {
    Optional<AdminAffinityGraphLayout> findByLayoutVersion(String layoutVersion);

    Optional<AdminAffinityGraphLayout> findFirstByOrderByGeneratedAtIsoDesc();
}
