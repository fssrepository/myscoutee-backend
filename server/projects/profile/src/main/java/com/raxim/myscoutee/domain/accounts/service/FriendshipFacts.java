package com.raxim.myscoutee.domain.accounts.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.accounts.repository.UserFriendshipsRepository;

/** One indexed adjacency read per viewer/request; no process-wide authorization cache. */
@Component
public class FriendshipFacts implements com.raxim.myscoutee.domain.accounts.api.Friendships {
    private final UserFriendshipsRepository friendships;

    public FriendshipFacts(UserFriendshipsRepository friendships) {
        this.friendships = friendships;
    }

    public boolean areFriends(String first, String second) {
        if (first == null || second == null || first.isBlank() || second.isBlank() || first.equals(second)) return false;
        if (RequestContextHolder.getRequestAttributes() != null) return friendIds(second).contains(first);
        return pairExists(first, second);
    }

    public boolean pairExists(String first, String second) {
        if (first == null || second == null || first.isBlank() || second.isBlank() || first.equals(second)) return false;
        String left = first.compareTo(second) < 0 ? first : second;
        String right = first.compareTo(second) < 0 ? second : first;
        return friendships.existsById(left.length() + ":" + left + right);
    }

    @SuppressWarnings("unchecked")
    public Set<String> friendIds(String viewer) {
        if (viewer == null || viewer.isBlank()) return Set.of();
        RequestAttributes request = RequestContextHolder.getRequestAttributes();
        String key = getClass().getName() + ":" + MongoSessionModeContext.currentMode() + ":" + viewer;
        if (request != null && request.getAttribute(key, RequestAttributes.SCOPE_REQUEST) instanceof Set<?> cached) {
            return (Set<String>) cached;
        }
        Set<String> ids = new LinkedHashSet<>();
        for (var pair : friendships.findRelevantByUserIds(List.of(viewer))) {
            if (viewer.equals(pair.leftUserId())) ids.add(pair.rightUserId());
            else if (viewer.equals(pair.rightUserId())) ids.add(pair.leftUserId());
        }
        ids.remove(null);
        ids.remove(viewer);
        Set<String> result = Set.copyOf(ids);
        if (request != null) request.setAttribute(key, result, RequestAttributes.SCOPE_REQUEST);
        return result;
    }
}
