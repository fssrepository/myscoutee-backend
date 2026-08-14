package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.UserLoginAudit;

public interface UserLoginAuditsRepository extends MongoRepository<UserLoginAudit, String> {
    Optional<UserLoginAudit> findFirstByAttemptId(String attemptId);

    List<UserLoginAudit> findByUserIdOrderByAttemptedAtIsoAsc(String userId);
}
