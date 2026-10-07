package com.raxim.myscoutee.domain.operator.service;

import com.raxim.myscoutee.domain.operator.mapper.OperatorRegistryEndpointMapper;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.domain.operator.document.OperatorRegistrySettings;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.RegistryOptionDto;
import com.raxim.myscoutee.domain.operator.repository.OperatorRegistryEndpointRepository;

@Service
public class OperatorRegistryEndpointService {
    private final OperatorRegistryEndpointRepository repository;
    private final OperatorRegistryEndpointMapper mapper;

    public OperatorRegistryEndpointService(
            OperatorRegistryEndpointRepository repository,
            OperatorRegistryEndpointMapper mapper) {
        this.repository = Objects.requireNonNull(repository);
        this.mapper = Objects.requireNonNull(mapper);
    }

    public List<RegistryOptionDto> options(
            OperatorRegistrySettings.RegistrySelection selection) {
        return repository.findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc().stream()
                .map(endpoint -> mapper.toOption(endpoint, selection))
                .toList();
    }
}
