package com.raxim.myscoutee.profile.repository.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.UserReportSubmission;

public interface UserReportSubmissionsRepository extends MongoRepository<UserReportSubmission, String> {
    List<UserReportSubmission> findByUserIdOrderByCreatedDateDesc(String userId);
}
