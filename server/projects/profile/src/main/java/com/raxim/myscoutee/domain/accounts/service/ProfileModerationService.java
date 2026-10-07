package com.raxim.myscoutee.domain.accounts.service;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import org.springframework.util.StringUtils;
@org.springframework.stereotype.Service
public class ProfileModerationService implements ProfileModeration {
    private final UsersRepository users;
    public ProfileModerationService(UsersRepository users) { this.users = users; }
    public boolean block(WorkspaceProfile profile) {
        Users user = (Users) profile;
        if ("blocked".equals(normalize(user.getProfileStatus()))) return false;
        user.setPreviousProfileStatus(StringUtils.hasText(user.getProfileStatus()) ? user.getProfileStatus() : "public");
        user.setProfileStatus("blocked"); users.save(user); return true;
    }
    public void unblock(WorkspaceProfile profile) {
        Users user = (Users) profile;
        String previous = normalize(user.getPreviousProfileStatus());
        user.setProfileStatus(StringUtils.hasText(previous) && !"blocked".equals(previous) ? previous : "public");
        user.setPreviousProfileStatus(null); users.save(user);
    }
    private String normalize(String value) { return value == null ? "" : value.trim(); }
}
