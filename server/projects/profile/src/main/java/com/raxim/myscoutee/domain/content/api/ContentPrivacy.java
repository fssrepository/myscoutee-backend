package com.raxim.myscoutee.domain.content.api;

import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import java.util.Map;
import java.util.function.Consumer;

public interface ContentPrivacy extends AccountPurgeActions {
    void purgeIdeaPosts(String userId);
    void purgeFeedback(String userId);
    void purgeReports(String userId);
    void purgeFeedViews(String userId);
    void purgeShareTokens(String userId);

    @Override
    default Map<Action, Consumer<Context>> accountPurgeActions() {
        return Map.ofEntries(
                Map.entry(Action.IDEA_POSTS, context -> purgeIdeaPosts(context.userId())),
                Map.entry(Action.CONTENT_FEEDBACK, context -> purgeFeedback(context.userId())),
                Map.entry(Action.CONTENT_REPORTS, context -> purgeReports(context.userId())),
                Map.entry(Action.CONTENT_FEED_VIEWS, context -> purgeFeedViews(context.userId())),
                Map.entry(Action.CONTENT_SHARE_TOKENS, context -> purgeShareTokens(context.userId())));
    }
}
