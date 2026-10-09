package com.raxim.myscoutee.domain.events.api;

import com.raxim.myscoutee.domain.events.dto.EventJobScopeDto;

public interface EventJobScopes {
    EventJobScopeDto findJobScope(String id);
}
