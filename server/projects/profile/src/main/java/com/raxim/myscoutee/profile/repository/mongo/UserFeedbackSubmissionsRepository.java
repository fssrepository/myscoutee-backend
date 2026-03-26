package com.raxim.myscoutee.profile.repository.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.UserFeedbackSubmission;

public interface UserFeedbackSubmissionsRepository extends MongoRepository<UserFeedbackSubmission, String> {
    List<UserFeedbackSubmission> findByUserIdOrderByCreatedDateDesc(String userId);
}
