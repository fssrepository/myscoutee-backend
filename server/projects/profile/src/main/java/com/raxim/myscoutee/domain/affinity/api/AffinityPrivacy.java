package com.raxim.myscoutee.domain.affinity.api;
public interface AffinityPrivacy {
    void purgeRatings(String userId);
    void purgeEdges(String userId);
    void purgeTasks(String userId);
    void anonymizeAuthors(String userId);
}
