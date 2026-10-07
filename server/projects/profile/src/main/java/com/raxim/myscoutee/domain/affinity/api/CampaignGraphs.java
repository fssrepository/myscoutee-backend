package com.raxim.myscoutee.domain.affinity.api;
import java.util.*;
public interface CampaignGraphs {
    Map<String, Snapshot> campaignGraphs(Collection<String> campaignIds);
    record Snapshot(List<String> userIds, List<? extends EdgeView> edges) {}
}
