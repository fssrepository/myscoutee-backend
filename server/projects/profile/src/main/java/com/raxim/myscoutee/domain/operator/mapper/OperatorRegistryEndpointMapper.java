package com.raxim.myscoutee.domain.operator.mapper;

import java.util.Objects;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.operator.document.OperatorRegistryEndpoint;
import com.raxim.myscoutee.domain.operator.document.OperatorRegistrySettings;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.RegistryOptionDto;

@Component
public class OperatorRegistryEndpointMapper {
    public RegistryOptionDto toOption(
            OperatorRegistryEndpoint endpoint,
            OperatorRegistrySettings.RegistrySelection selection) {
        boolean selected = selection != null
                && Objects.equals(endpoint.getBaseUrl(), selection.getBaseUrl())
                && Objects.equals(endpoint.getRegistryScope(), selection.getRegistryScope());
        return new RegistryOptionDto(
                endpoint.getId(),
                endpoint.getLabel(),
                endpoint.getBaseUrl(),
                endpoint.getRegistryScope(),
                selected);
    }
}
