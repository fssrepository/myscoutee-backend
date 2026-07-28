package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.OperatorRegistryEndpoint;

public interface OperatorRegistryEndpointRepository
        extends MongoRepository<OperatorRegistryEndpoint, String> {
    List<OperatorRegistryEndpoint> findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc();
}
