package com.raxim.myscoutee.domain.assets.api;

import com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto;

public interface AssetJobScopes {
    AssetJobScopeDto findJobScope(String id);
}
