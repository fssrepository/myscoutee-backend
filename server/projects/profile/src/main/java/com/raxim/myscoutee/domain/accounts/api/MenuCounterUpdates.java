package com.raxim.myscoutee.domain.accounts.api;

import java.util.Map;
import com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto;

/** Installed domains supply deltas; accounts owns the atomic counter write.
 * The returned owner snapshot also supplies the mutation response's display data. */
public interface MenuCounterUpdates {
    record Change(String userId, String workspaceGroupId, String sourceKey, long revision,
            Map<String, Integer> deltas) {
        public boolean valid() {
            return userId != null && !userId.isBlank() && userId.length() <= 512
                    && (workspaceGroupId == null || workspaceGroupId.length() <= 512)
                    && sourceKey != null && sourceKey.matches("[a-zA-Z0-9_-]{1,100}") && revision > 0
                    && deltas != null && !deltas.isEmpty() && deltas.size() <= 64
                    && deltas.entrySet().stream().allMatch(e -> e.getKey() != null
                        && e.getKey().matches("[a-zA-Z][a-zA-Z0-9_]{0,63}") && e.getValue() != null
                        && Math.abs((long) e.getValue()) <= 1_000_000);
        }
    }
    record Snapshot(DiscoveryProfileDto profile, Map<String, Integer> counters) {}
    Snapshot apply(Change change);
    default java.util.List<Snapshot> applyAll(java.util.List<Change> changes) {
        if (changes == null || changes.size() > 100 || changes.stream().anyMatch(c -> c == null || !c.valid()))
            throw new IllegalArgumentException("Invalid menu counter batch");
        return changes.stream().map(this::apply).toList();
    }
}
