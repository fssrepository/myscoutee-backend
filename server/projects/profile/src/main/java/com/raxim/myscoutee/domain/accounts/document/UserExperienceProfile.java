package com.raxim.myscoutee.domain.accounts.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "userExperienceProfiles")
@lombok.Getter @lombok.Setter
public class UserExperienceProfile implements com.raxim.myscoutee.domain.accounts.api.Experiences.Profile {
    @Id
    private String mongoId;

    @Indexed(name = "user_experience_profiles_user_id", unique = true)
    private String userId;

    private String updatedAtIso;
    private List<ExperienceItemRecord> entries = new ArrayList<>();

    @lombok.Getter @lombok.Setter
    public static class ExperienceItemRecord implements com.raxim.myscoutee.domain.accounts.api.Experiences.Entry {
        @Field("id")
        private String id;
        private String type;
        private String title;
        private String org;
        private String city;
        private String dateFrom;
        private String dateTo;
        private String description;

    }
}
