package com.raxim.myscoutee.domain.community.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.community.document.CommunityProvider;

public interface CommunityProviderRepository
        extends MongoRepository<CommunityProvider, String> {
    List<CommunityProvider> findByEnabledTrueOrderBySortOrderAscNameAscIdAsc();
}
