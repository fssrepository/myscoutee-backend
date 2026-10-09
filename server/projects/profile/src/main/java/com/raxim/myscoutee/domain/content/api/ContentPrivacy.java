package com.raxim.myscoutee.domain.content.api;
public interface ContentPrivacy {
    void purgeIdeaPosts(String userId);
    void purgeFeedback(String userId);
    void purgeReports(String userId);
    void purgeFeedViews(String userId);
    void purgeShareTokens(String userId);
}
