package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.UserSessionAction;

public interface UserSessionActionsRepository extends MongoRepository<UserSessionAction, String> {
    List<UserSessionAction> findByUserIdOrderByCreatedDateDesc(String userId);
}
