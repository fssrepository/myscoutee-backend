package com.raxim.myscoutee.domain.administration.service;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.administration.api.AdministrativeStatistics;
import com.raxim.myscoutee.domain.administration.document.AdminStatsSnapshot;
@Service
public class AdministrativeStatisticsService implements AdministrativeStatistics {
    private final MongoTemplate mongo;
    public AdministrativeStatisticsService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public Summary global() {
        Query query = Query.query(Criteria.where("statsKey").is("global"));
        query.fields().include("generatedAtIso", "activeProfileGenders", "dailyActivity");
        var snapshot = mongo.findOne(query, AdminStatsSnapshot.class);
        return snapshot == null ? null : new Summary(snapshot.getGeneratedAtIso(), snapshot.getActiveProfileGenders(), snapshot.getDailyActivity());
    }
}
