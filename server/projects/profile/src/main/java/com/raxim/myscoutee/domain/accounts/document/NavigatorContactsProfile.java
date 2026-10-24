package com.raxim.myscoutee.domain.accounts.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "navigatorContacts")
@lombok.Getter @lombok.Setter
public class NavigatorContactsProfile {
    @Id
    private String mongoId;

    @Indexed(name = "navigator_contacts_user_id", unique = true)
    private String userId;

    private String updatedAtIso;
    private List<NavigatorContactRecord> contacts = new ArrayList<>();
    private java.util.Map<String, Long> contactPermissionVersions = new java.util.LinkedHashMap<>();

    public void setContactPermissionVersions(java.util.Map<String, Long> value) {
        contactPermissionVersions = value == null ? new java.util.LinkedHashMap<>() : new java.util.LinkedHashMap<>(value);
    }

    public void setContacts(List<NavigatorContactRecord> contacts) {
        this.contacts = contacts == null ? new ArrayList<>() : contacts;
    }

    @lombok.Getter @lombok.Setter
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

        public void setMethods(List<NavigatorContactMethodRecord> methods) {
            this.methods = methods == null ? new ArrayList<>() : methods;
        }
    }

    @lombok.Getter @lombok.Setter
    public static class NavigatorContactMethodRecord {
        @Field("id")
        private String id;
        private String type;
        private String value;

    }
}
