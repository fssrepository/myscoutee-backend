package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.HelpCenterAuditEntry;

public interface HelpCenterAuditRepository extends MongoRepository<HelpCenterAuditEntry, String> {
    List<HelpCenterAuditEntry> findAllByOrderByCreatedDateDesc();
}
