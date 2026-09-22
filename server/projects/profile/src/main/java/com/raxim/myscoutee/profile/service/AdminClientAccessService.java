package com.raxim.myscoutee.profile.service;

import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.data.document.Users;

@Service
public class AdminClientAccessService {
    private final UsersRepository users;
    private final AdminMenuCounterService admins;
    public AdminClientAccessService(UsersRepository users, AdminMenuCounterService admins) { this.users = users; this.admins = admins; }
    public Users requireAdmin(String id) {
        Users user = users.findByUserId(id).orElse(null);
        if (!admins.isAdminUser(user) || user == null || user.getDeletedAtIso() != null
                || java.util.Set.of("blocked", "deleted", "inactive").contains(String.valueOf(user.getProfileStatus()).toLowerCase())
                || java.util.Set.of("B", "D", "I").contains(String.valueOf(user.getStatus())))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "An active administrator is required.");
        return user;
    }
}
