package com.raxim.myscoutee.domain.accounts.api;

import java.util.Map;
public interface ProfileStatistics {
    Counts counts(String statsKey);
    record Counts(Map<String, Long> statusCounts, Map<String, Long> visibilityCounts,
                  Map<String, String> activeProfileUsers, Map<String, Long> activeGenders) {}
}
