package com.raxim.myscoutee.domain.administration.api;

public interface AdministrativeQueues {
    Counts counters(boolean refreshSnapshot);
    record Counts(int jobs, int metrics) {}
}
