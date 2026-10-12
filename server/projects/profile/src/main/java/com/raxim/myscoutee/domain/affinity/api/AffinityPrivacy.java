package com.raxim.myscoutee.domain.affinity.api;

import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import java.util.Map;
import java.util.function.Consumer;

public interface AffinityPrivacy extends AccountPurgeActions {
    void purgeRatings(String userId);
    void purgeEdges(String userId);
    void purgeTasks(String userId);
    void anonymizeAuthors(String userId);

    @Override
    default Map<Action, Consumer<Context>> accountPurgeActions() {
        return Map.ofEntries(
                Map.entry(Action.RATINGS, context -> purgeRatings(context.userId())),
                Map.entry(Action.EDGES, context -> purgeEdges(context.userId())),
                Map.entry(Action.AFFINITY_TASKS, context -> purgeTasks(context.userId())),
                Map.entry(Action.AFFINITY_AUTHORS, context -> anonymizeAuthors(context.userId())));
    }
}
