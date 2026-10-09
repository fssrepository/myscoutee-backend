package com.raxim.myscoutee.domain.accounts.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "navigatorContacts")
public class NavigatorContactsProfile {
    @Id
    private String mongoId;

    @Indexed(name = "navigator_contacts_user_id", unique = true)
    private String userId;

    private String updatedAtIso;
    private List<NavigatorContactRecord> contacts = new ArrayList<>();
    private java.util.Map<String, Long> contactPermissionVersions = new java.util.LinkedHashMap<>();

    public java.util.Map<String, Long> getContactPermissionVersions() { return contactPermissionVersions; }
    public void setContactPermissionVersions(java.util.Map<String, Long> value) {
        contactPermissionVersions = value == null ? new java.util.LinkedHashMap<>() : new java.util.LinkedHashMap<>(value);
    }

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

    public List<NavigatorContactRecord> getContacts() {
        return contacts;
    }

    public void setContacts(List<NavigatorContactRecord> contacts) {
        this.contacts = contacts == null ? new ArrayList<>() : contacts;
    }

    public static class NavigatorContactRecord {
        @Field("id")
        private String id;
        private String userId;
        private String name;
        private String initials;
        private String gender;
        private String city;
        private String avatarUrl;
        private String headline;
        private String createdAtIso;
        private String updatedAtIso;
        private List<NavigatorContactMethodRecord> methods = new ArrayList<>();

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getInitials() {
            return initials;
        }

        public void setInitials(String initials) {
            this.initials = initials;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }

        public String getHeadline() {
            return headline;
        }

        public void setHeadline(String headline) {
            this.headline = headline;
        }

        public String getCreatedAtIso() {
            return createdAtIso;
        }

        public void setCreatedAtIso(String createdAtIso) {
            this.createdAtIso = createdAtIso;
        }

        public String getUpdatedAtIso() {
            return updatedAtIso;
        }

        public void setUpdatedAtIso(String updatedAtIso) {
            this.updatedAtIso = updatedAtIso;
        }

        public List<NavigatorContactMethodRecord> getMethods() {
            return methods;
        }

        public void setMethods(List<NavigatorContactMethodRecord> methods) {
            this.methods = methods == null ? new ArrayList<>() : methods;
        }
    }

    public static class NavigatorContactMethodRecord {
        @Field("id")
        private String id;
        private String type;
        private String value;

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

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    }
}
