package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.CountryPartition;

public interface CountryPartitionsRepository extends MongoRepository<CountryPartition, String> {
    Optional<CountryPartition> findByPartitionKey(String partitionKey);
}
