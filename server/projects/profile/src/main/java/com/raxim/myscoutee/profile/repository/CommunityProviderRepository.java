package com.raxim.myscoutee.profile.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.CommunityProvider;

public interface CommunityProviderRepository
        extends MongoRepository<CommunityProvider, String> {
    List<CommunityProvider> findByEnabledTrueOrderBySortOrderAscNameAscIdAsc();
}
