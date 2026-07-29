package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.OperatorClaimSubmissionSnapshot;

public interface OperatorClaimSubmissionSnapshotRepository
        extends MongoRepository<OperatorClaimSubmissionSnapshot, String> {
}
