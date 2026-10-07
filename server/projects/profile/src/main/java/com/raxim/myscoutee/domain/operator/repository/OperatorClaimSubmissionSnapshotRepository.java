package com.raxim.myscoutee.domain.operator.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.operator.document.OperatorClaimSubmissionSnapshot;

public interface OperatorClaimSubmissionSnapshotRepository
        extends MongoRepository<OperatorClaimSubmissionSnapshot, String> {
}
