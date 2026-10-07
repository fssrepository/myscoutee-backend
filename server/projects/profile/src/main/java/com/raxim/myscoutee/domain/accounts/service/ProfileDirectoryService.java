package com.raxim.myscoutee.domain.accounts.service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.accounts.api.ProfileDirectory;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

@Service
public class ProfileDirectoryService implements ProfileDirectory {
    private final UsersRepository users;
    public ProfileDirectoryService(UsersRepository users) { this.users = users; }
    @Override public List<Users> findByWorkspaceGroupIdAndAccountUserIdIn(String groupId, Collection<String> accounts) { return users.findByWorkspaceGroupIdAndAccountUserIdIn(groupId, accounts); }
    @Override public List<Users> findAll() { return users.findAll(); }
    @Override public Optional<Users> findByUserId(String userId) { return users.findByUserId(userId); }
    @Override public List<Users> findByEmailIn(Collection<String> emails) { return users.findByEmailIn(emails); }
    @Override public List<Users> findByUserIdIn(Collection<String> userIds) { return users.findByUserIdIn(userIds); }
    @Override public java.util.List<Users> findByProfileStatus(String status) { return users.findByProfileStatus(status); }
    @Override public List<Users> findByAccountUserId(String id) { return users.findByAccountUserId(id); }
}
