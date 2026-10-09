package com.raxim.myscoutee.domain.affinity.service;
import com.raxim.myscoutee.domain.affinity.api.*;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
@org.springframework.stereotype.Service
public class EdgeDirectoryService implements EdgeDirectory {
    private final UserAffinityEdgesRepository records;
    public EdgeDirectoryService(UserAffinityEdgesRepository records) { this.records = records; }
    public java.util.List<? extends EdgeView> findAll() { return records.findAll(); }
    public java.util.List<? extends EdgeView> findRelevantByUserIds(java.util.List<String> ids) { return records.findRelevantByUserIds(ids); }
}
