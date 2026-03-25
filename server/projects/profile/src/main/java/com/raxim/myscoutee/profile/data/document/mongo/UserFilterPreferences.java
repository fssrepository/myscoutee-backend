package com.raxim.myscoutee.profile.data.document.mongo;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userFilterPreferences")
public class UserFilterPreferences {
    @Id
    private String id;
    private Map<String, UserFilterPreferencesRecord> byId = new LinkedHashMap<>();
    private List<String> ids = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, UserFilterPreferencesRecord> getById() {
        return byId;
    }

    public void setById(Map<String, UserFilterPreferencesRecord> byId) {
        this.byId = byId;
    }

    public List<String> getIds() {
        return ids;
    }

    public void setIds(List<String> ids) {
        this.ids = ids;
    }

    public record UserFilterPreferencesRecord(
            Integer ageMin,
            Integer ageMax,
            Integer heightMinCm,
            Integer heightMaxCm,
            List<String> interests,
            List<String> values,
            List<String> physiques,
            List<String> languages,
            List<String> genders,
            List<String> horoscopes,
            List<String> traitLabels,
            List<String> smoking,
            List<String> drinking,
            List<String> workout,
            List<String> pets,
            List<String> familyPlans,
            List<String> children,
            List<String> loveStyles,
            List<String> communicationStyles,
            List<String> sexualOrientations,
            List<String> religions) {
    }
}
