package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.UserSessionState;

public interface UserSessionStatesRepository extends MongoRepository<UserSessionState, String> {
}
