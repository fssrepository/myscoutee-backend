package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.UserReportSubmission;

public interface UserReportSubmissionsRepository extends MongoRepository<UserReportSubmission, String> {
    List<UserReportSubmission> findByUserIdOrderByCreatedDateDesc(String userId);
}
