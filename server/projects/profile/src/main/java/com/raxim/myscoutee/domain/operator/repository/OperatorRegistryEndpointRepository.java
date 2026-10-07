package com.raxim.myscoutee.domain.operator.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.operator.document.OperatorRegistryEndpoint;

public interface OperatorRegistryEndpointRepository
        extends MongoRepository<OperatorRegistryEndpoint, String> {
    List<OperatorRegistryEndpoint> findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc();
}
