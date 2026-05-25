package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AdminAffinityGraphForest;

public interface AdminAffinityGraphForestsRepository extends MongoRepository<AdminAffinityGraphForest, String> {
    List<AdminAffinityGraphForest> findByLayoutVersionOrderByMemberCountDesc(String layoutVersion);
}
