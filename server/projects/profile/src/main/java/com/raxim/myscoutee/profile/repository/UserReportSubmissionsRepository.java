package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.UserReportSubmission;

public interface UserReportSubmissionsRepository extends MongoRepository<UserReportSubmission, String> {
    Optional<UserReportSubmission> findBySyncKey(String syncKey);

    List<UserReportSubmission> findByUserIdOrderByCreatedDateDesc(String userId);

    List<UserReportSubmission> findAllByOrderByCreatedDateDesc();

    List<UserReportSubmission> findByTargetUserIdOrderByCreatedDateDesc(String targetUserId);
}
