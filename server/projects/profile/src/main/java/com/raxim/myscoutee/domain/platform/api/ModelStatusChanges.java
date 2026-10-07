package com.raxim.myscoutee.domain.platform.api;
import java.util.List;
public interface ModelStatusChanges {
    Outcome applyForUser(String userId);
    interface Outcome { List<String> eventSourceIds(); List<String> assetIds(); boolean hasConflicts(); }
}
