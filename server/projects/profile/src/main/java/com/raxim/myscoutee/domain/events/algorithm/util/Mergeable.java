package com.raxim.myscoutee.domain.events.algorithm.util;

public interface Mergeable<T> {
    boolean canMerge(T other);

    void merge(T node);
}
