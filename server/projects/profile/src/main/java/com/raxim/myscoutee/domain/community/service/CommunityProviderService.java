package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.community.mapper.CommunityProviderMapper;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.community.dto.OperatorCommunityDtos.CommunityProviderDto;
import com.raxim.myscoutee.domain.community.repository.CommunityProviderRepository;

@Service
public class CommunityProviderService {
    private final CommunityProviderRepository repository;
    private final CommunityProviderMapper mapper;

    public CommunityProviderService(
            CommunityProviderRepository repository,
            CommunityProviderMapper mapper) {
        this.repository = Objects.requireNonNull(repository);
        this.mapper = Objects.requireNonNull(mapper);
    }

    public List<CommunityProviderDto> availableProviders() {
        return repository
                .findByEnabledTrueOrderBySortOrderAscNameAscIdAsc()
                .stream()
                .map(mapper::toDto)
                .toList();
    }
}
