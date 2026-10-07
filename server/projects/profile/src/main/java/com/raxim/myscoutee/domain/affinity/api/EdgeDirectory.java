package com.raxim.myscoutee.domain.affinity.api;
public interface EdgeDirectory {
    java.util.List<? extends EdgeView> findAll();
    java.util.List<? extends EdgeView> findRelevantByUserIds(java.util.List<String> ids);
}
