package com.raxim.myscoutee.profile.data.document.mongo;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userRates")
public class UserRates {
    @Id
    private String id;
    private Map<String, UserRateRecord> byId = new LinkedHashMap<>();
    private List<String> ids = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, UserRateRecord> getById() {
        return byId;
    }

    public void setById(Map<String, UserRateRecord> byId) {
        this.byId = byId;
    }

    public List<String> getIds() {
        return ids;
    }

    public void setIds(List<String> ids) {
        this.ids = ids;
    }

    public record UserRateRecord(
            String id,
            String fromUserId,
            String toUserId,
            Integer rate,
            String mode,
            String source,
            String createdAtIso,
            String updatedAtIso,
            String ownerUserId,
            String displayId,
            String displayDirection,
            Integer scoreGiven,
            Integer scoreReceived,
            String eventName,
            String happenedAtIso,
            Double distanceKm,
            Integer distanceMetersExact) {
    }
}
