package com.raxim.myscoutee.domain.groups.dto;

import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.PolicyItemDto;

public record GroupPolicy(boolean workspace, boolean enabled, List<String> requiredFields,
        Boolean policiesEnabled, List<PolicyItemDto> policies) {
    public GroupPolicy(boolean workspace, boolean enabled, List<String> requiredFields) {
        this(workspace, enabled, requiredFields, false, List.of());
    }
}
