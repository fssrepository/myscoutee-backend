package com.raxim.myscoutee.profile.repository.mongo;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.UserSessionAction;

public interface UserSessionActionsRepository extends MongoRepository<UserSessionAction, String> {
    List<UserSessionAction> findByUserIdOrderByCreatedDateDesc(String userId);
}
