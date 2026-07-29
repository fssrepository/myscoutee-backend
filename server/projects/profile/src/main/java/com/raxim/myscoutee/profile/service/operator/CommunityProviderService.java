package com.raxim.myscoutee.profile.service.operator;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorCommunityDtos.CommunityProviderDto;
import com.raxim.myscoutee.profile.repository.CommunityProviderRepository;

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
