package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.PrivacyConsent;

public interface PrivacyConsentsRepository extends MongoRepository<PrivacyConsent, String> {
    Optional<PrivacyConsent> findByUserIdAndRevisionId(String userId, String revisionId);
}
