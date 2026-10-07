package com.raxim.myscoutee.domain.platform.api;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface JobAudience {
    String forUser(String userId);
    String forTarget(String type, String id);
    boolean matchesWorkspace(String workspaceId);
    Map<String, List<String>> usersByGroup(Collection<String> userIds);
}
