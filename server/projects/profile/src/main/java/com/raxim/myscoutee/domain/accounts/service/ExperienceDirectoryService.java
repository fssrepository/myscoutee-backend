package com.raxim.myscoutee.domain.accounts.service;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.accounts.api.Experiences;
import com.raxim.myscoutee.domain.accounts.document.UserExperienceProfile;
import com.raxim.myscoutee.domain.accounts.repository.UserExperienceProfilesRepository;
@Service
public class ExperienceDirectoryService implements Experiences {
    private final UserExperienceProfilesRepository profiles;
    public ExperienceDirectoryService(UserExperienceProfilesRepository profiles) { this.profiles = profiles; }
    @Override public Optional<UserExperienceProfile> findByUserId(String id) { return profiles.findByUserId(id); }
    @Override public List<UserExperienceProfile> findByUserIdIn(java.util.Collection<String> ids) { return profiles.findByUserIdIn(ids); }
}
