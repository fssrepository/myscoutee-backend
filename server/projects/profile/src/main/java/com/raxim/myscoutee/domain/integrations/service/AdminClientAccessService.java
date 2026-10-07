package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.administration.api.AdministratorClassification;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.document.Users;

@Service
public class AdminClientAccessService {
    private final UsersRepository users;
    private final AdministratorClassification admins;
    public AdminClientAccessService(UsersRepository users, AdministratorClassification admins) { this.users = users; this.admins = admins; }
    public Users requireAdmin(String id) {
        Users user = users.findByUserId(id).orElse(null);
        if (!admins.isAdminUser(user) || user == null || org.springframework.util.StringUtils.hasText(user.getDeletedAtIso())
                || java.util.Set.of("blocked", "deleted", "inactive").contains(String.valueOf(user.getProfileStatus()).toLowerCase())
                || java.util.Set.of("B", "D", "I").contains(String.valueOf(user.getStatus())))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "An active administrator is required.");
        return user;
    }
}
