package com.raxim.myscoutee.domain.groups.api;

import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public interface CommunityAuthority {
    String actor(String requestedId);
    void requireBaseMember(String accountId);
    GroupView group(String groupId);
    CommunityMember member(String groupId, String accountId);
    boolean admin(String groupId, String accountId);
    GroupView requireMember(String groupId, String accountId);
    GroupView requireAdmin(String groupId, String accountId);
    List<CommunityMember> roster(String groupId);
    Set<String> managedGroups(String accountId);
    List<String> audience(List<CommunityMember> roster, boolean all, List<String> selected);
    static ResponseStatusException error(HttpStatus status) { return new ResponseStatusException(status); }
}
