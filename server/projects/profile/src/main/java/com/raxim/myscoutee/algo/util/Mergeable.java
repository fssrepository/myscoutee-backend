package com.raxim.myscoutee.algo.util;

public interface Mergeable<T> {
    boolean canMerge(T other);

    void merge(T node);
}
