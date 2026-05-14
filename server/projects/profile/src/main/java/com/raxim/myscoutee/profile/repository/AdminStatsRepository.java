package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AdminStatsSnapshot;

public interface AdminStatsRepository extends MongoRepository<AdminStatsSnapshot, String> {
    Optional<AdminStatsSnapshot> findByStatsKey(String statsKey);
}
