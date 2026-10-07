package com.raxim.myscoutee.domain.accounts.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.accounts.document.UserSessionState;

public interface UserSessionStatesRepository extends MongoRepository<UserSessionState, String> {
}
