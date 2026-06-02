package com.raxim.myscoutee.profile.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.AccessPolicyDefinition;

public interface AccessPolicyDefinitionsRepository extends MongoRepository<AccessPolicyDefinition, String> {
}
