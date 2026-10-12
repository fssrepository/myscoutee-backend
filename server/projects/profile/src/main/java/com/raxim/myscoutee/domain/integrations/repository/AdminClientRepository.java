package com.raxim.myscoutee.domain.integrations.repository;

import org.bson.Document;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.data.domain.Sort;
import com.raxim.myscoutee.domain.administration.api.AdministrativeStatistics;

@Repository
public class AdminClientRepository {
    @org.springframework.beans.factory.annotation.Autowired private com.raxim.myscoutee.domain.chat.api.ChatDirectory chatDirectory;
    private final MongoTemplate mongo;
    private final AdministrativeStatistics statistics;
    public AdminClientRepository(MongoTemplate mongo, AdministrativeStatistics statistics) { this.mongo = mongo; this.statistics = statistics; }
    public AdministrativeStatistics.Summary stats() { return statistics.global(); }
    public String unreadVersion(String owner) {
        return chatDirectory.unreadVersion(owner);
    }
}
