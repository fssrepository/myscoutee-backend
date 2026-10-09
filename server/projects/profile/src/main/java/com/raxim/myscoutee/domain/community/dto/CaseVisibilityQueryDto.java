package com.raxim.myscoutee.domain.community.dto;

import java.util.List;

/** Inputs of the existing case menu-count query, when transported between assemblies. */
public record CaseVisibilityQueryDto(String baseGroupId, String accountId, List<String> managedGroupIds) {}
