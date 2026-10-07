package com.raxim.myscoutee.domain.platform.api;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface JobAudience {
    Map<String, List<String>> usersByGroup(Collection<String> userIds);
}
