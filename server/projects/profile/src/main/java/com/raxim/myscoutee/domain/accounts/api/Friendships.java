package com.raxim.myscoutee.domain.accounts.api;

import java.util.Set;

public interface Friendships {
    boolean areFriends(String first, String second);
    boolean pairExists(String first, String second);
    Set<String> friendIds(String viewer);
}
