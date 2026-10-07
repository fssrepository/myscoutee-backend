package com.raxim.myscoutee.domain.accounts.api;
import java.util.*;
public interface Experiences {
    Optional<? extends Profile> findByUserId(String id);
    List<? extends Profile> findByUserIdIn(java.util.Collection<String> ids);
    interface Profile { String getUserId(); List<? extends Entry> getEntries(); }
    interface Entry { String getId(); String getType(); String getTitle(); String getOrg(); String getCity(); String getDateFrom(); String getDateTo(); String getDescription(); }
}
