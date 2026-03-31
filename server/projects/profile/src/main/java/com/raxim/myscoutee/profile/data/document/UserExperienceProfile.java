package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userExperienceProfiles")
public class UserExperienceProfile {
    @Id
    private String mongoId;

    @Indexed(name = "user_experience_profiles_user_id", unique = true)
    private String userId;

    private String updatedAtIso;
    private List<ExperienceItemRecord> entries = new ArrayList<>();

    public String getMongoId() {
        return mongoId;
    }

    public void setMongoId(String mongoId) {
        this.mongoId = mongoId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUpdatedAtIso() {
        return updatedAtIso;
    }

    public void setUpdatedAtIso(String updatedAtIso) {
        this.updatedAtIso = updatedAtIso;
    }

    public List<ExperienceItemRecord> getEntries() {
        return entries;
    }

    public void setEntries(List<ExperienceItemRecord> entries) {
        this.entries = entries;
    }

    public static class ExperienceItemRecord {
        private String id;
        private String type;
        private String title;
        private String org;
        private String city;
        private String dateFrom;
        private String dateTo;
        private String description;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getOrg() {
            return org;
        }

        public void setOrg(String org) {
            this.org = org;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getDateFrom() {
            return dateFrom;
        }

        public void setDateFrom(String dateFrom) {
            this.dateFrom = dateFrom;
        }

        public String getDateTo() {
            return dateTo;
        }

        public void setDateTo(String dateTo) {
            this.dateTo = dateTo;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}
