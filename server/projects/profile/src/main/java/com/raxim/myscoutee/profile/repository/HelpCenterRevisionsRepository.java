package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.HelpCenterRevision;

public interface HelpCenterRevisionsRepository extends MongoRepository<HelpCenterRevision, String> {
    Optional<HelpCenterRevision> findFirstByActiveTrueOrderByVersionDesc();

    List<HelpCenterRevision> findAllByOrderByVersionDesc();

    Optional<HelpCenterRevision> findFirstByOrderByVersionDesc();
}
