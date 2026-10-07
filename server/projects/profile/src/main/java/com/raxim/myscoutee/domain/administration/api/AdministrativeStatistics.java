package com.raxim.myscoutee.domain.administration.api;

public interface AdministrativeStatistics {
    Summary global();
    record Summary(String generatedAtIso, java.util.Map<String, Long> activeProfileGenders,
                   java.util.Map<String, java.util.Map<String, Long>> dailyActivity) {}
}
