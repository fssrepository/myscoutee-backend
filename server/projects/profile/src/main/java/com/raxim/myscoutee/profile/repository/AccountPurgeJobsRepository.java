package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AccountPurgeJob;

public interface AccountPurgeJobsRepository extends MongoRepository<AccountPurgeJob, String> {
    Optional<AccountPurgeJob> findByUserId(String userId);

    List<AccountPurgeJob> findByStatusIn(Collection<String> statuses);
}
