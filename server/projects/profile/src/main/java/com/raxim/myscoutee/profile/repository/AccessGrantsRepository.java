package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AccessGrant;

public interface AccessGrantsRepository extends MongoRepository<AccessGrant, String> {
}
