package com.raxim.myscoutee.domain.affinity.api;

public interface RecomputeQueue {
    long count(String baseGroupId, String status);
}
