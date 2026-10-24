package com.raxim.myscoutee.domain.accounts.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userFilterPreferences")
@CompoundIndexes({
        @CompoundIndex(name = "user_filter_preferences_user", def = "{'userId': 1}", unique = true)
})
@lombok.Getter @lombok.Setter
public class UserFilterPreferences {
    @Id
    private String id;

    @Indexed(name = "user_filter_preferences_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String userId;
    private Integer ageMin;
    private Integer ageMax;
    private Integer heightMinCm;
    private Integer heightMaxCm;
    private List<String> interests = new ArrayList<>();
    private List<String> values = new ArrayList<>();
    private List<String> physiques = new ArrayList<>();
    private List<String> languages = new ArrayList<>();
    private List<String> genders = new ArrayList<>();
    private List<String> horoscopes = new ArrayList<>();
    private List<String> traitLabels = new ArrayList<>();
    private List<String> smoking = new ArrayList<>();
    private List<String> drinking = new ArrayList<>();
    private List<String> workout = new ArrayList<>();
    private List<String> pets = new ArrayList<>();
    private List<String> familyPlans = new ArrayList<>();
    private List<String> children = new ArrayList<>();
    private List<String> loveStyles = new ArrayList<>();
    private List<String> communicationStyles = new ArrayList<>();
    private List<String> sexualOrientations = new ArrayList<>();
    private List<String> religions = new ArrayList<>();
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

}
