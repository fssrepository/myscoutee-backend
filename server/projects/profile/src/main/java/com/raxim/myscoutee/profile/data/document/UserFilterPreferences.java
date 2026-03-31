package com.raxim.myscoutee.profile.data.document;

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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSyncKey() { return syncKey; }
    public void setSyncKey(String syncKey) { this.syncKey = syncKey; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Integer getAgeMin() { return ageMin; }
    public void setAgeMin(Integer ageMin) { this.ageMin = ageMin; }
    public Integer getAgeMax() { return ageMax; }
    public void setAgeMax(Integer ageMax) { this.ageMax = ageMax; }
    public Integer getHeightMinCm() { return heightMinCm; }
    public void setHeightMinCm(Integer heightMinCm) { this.heightMinCm = heightMinCm; }
    public Integer getHeightMaxCm() { return heightMaxCm; }
    public void setHeightMaxCm(Integer heightMaxCm) { this.heightMaxCm = heightMaxCm; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public List<String> getValues() { return values; }
    public void setValues(List<String> values) { this.values = values; }
    public List<String> getPhysiques() { return physiques; }
    public void setPhysiques(List<String> physiques) { this.physiques = physiques; }
    public List<String> getLanguages() { return languages; }
    public void setLanguages(List<String> languages) { this.languages = languages; }
    public List<String> getGenders() { return genders; }
    public void setGenders(List<String> genders) { this.genders = genders; }
    public List<String> getHoroscopes() { return horoscopes; }
    public void setHoroscopes(List<String> horoscopes) { this.horoscopes = horoscopes; }
    public List<String> getTraitLabels() { return traitLabels; }
    public void setTraitLabels(List<String> traitLabels) { this.traitLabels = traitLabels; }
    public List<String> getSmoking() { return smoking; }
    public void setSmoking(List<String> smoking) { this.smoking = smoking; }
    public List<String> getDrinking() { return drinking; }
    public void setDrinking(List<String> drinking) { this.drinking = drinking; }
    public List<String> getWorkout() { return workout; }
    public void setWorkout(List<String> workout) { this.workout = workout; }
    public List<String> getPets() { return pets; }
    public void setPets(List<String> pets) { this.pets = pets; }
    public List<String> getFamilyPlans() { return familyPlans; }
    public void setFamilyPlans(List<String> familyPlans) { this.familyPlans = familyPlans; }
    public List<String> getChildren() { return children; }
    public void setChildren(List<String> children) { this.children = children; }
    public List<String> getLoveStyles() { return loveStyles; }
    public void setLoveStyles(List<String> loveStyles) { this.loveStyles = loveStyles; }
    public List<String> getCommunicationStyles() { return communicationStyles; }
    public void setCommunicationStyles(List<String> communicationStyles) { this.communicationStyles = communicationStyles; }
    public List<String> getSexualOrientations() { return sexualOrientations; }
    public void setSexualOrientations(List<String> sexualOrientations) { this.sexualOrientations = sexualOrientations; }
    public List<String> getReligions() { return religions; }
    public void setReligions(List<String> religions) { this.religions = religions; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
}
