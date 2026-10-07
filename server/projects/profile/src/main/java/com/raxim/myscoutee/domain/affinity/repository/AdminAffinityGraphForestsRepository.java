package com.raxim.myscoutee.domain.affinity.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.affinity.document.AdminAffinityGraphForest;

public interface AdminAffinityGraphForestsRepository extends MongoRepository<AdminAffinityGraphForest, String> {
    List<AdminAffinityGraphForest> findByLayoutVersionOrderByMemberCountDesc(String layoutVersion);

    List<AdminAffinityGraphForest> findByLayoutVersionOrderByMemberCountDesc(String layoutVersion, Pageable pageable);

    long countByLayoutVersion(String layoutVersion);
}
