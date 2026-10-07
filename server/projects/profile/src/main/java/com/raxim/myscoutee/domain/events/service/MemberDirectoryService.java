package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;

@Service
public class MemberDirectoryService implements MemberDirectory {
    private final ActivityMembersRepository members;
    public MemberDirectoryService(ActivityMembersRepository members) { this.members = members; }
    @Override public Optional<ActivityMember> findByOwnerTypeAndOwnerIdAndUserId(String type, String id, String user) { return members.findByOwnerTypeAndOwnerIdAndUserId(type, id, user); }
    @Override public List<ActivityMember> findByOwnerTypeAndOwnerId(String type, String id) { return members.findByOwnerTypeAndOwnerId(type, id); }
}
