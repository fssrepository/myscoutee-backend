package com.raxim.myscoutee.domain.help.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.help.document.HelpCenterAuditEntry;

public interface HelpCenterAuditRepository extends MongoRepository<HelpCenterAuditEntry, String> {
    List<HelpCenterAuditEntry> findAllByOrderByCreatedDateDesc();
    List<HelpCenterAuditEntry> findByBaseGroupIdOrderByCreatedDateDesc(String baseGroupId);
}
