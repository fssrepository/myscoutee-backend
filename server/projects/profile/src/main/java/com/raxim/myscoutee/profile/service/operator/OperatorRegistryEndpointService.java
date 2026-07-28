package com.raxim.myscoutee.profile.service.operator;

import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryOptionDto;
import com.raxim.myscoutee.profile.repository.OperatorRegistryEndpointRepository;

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
