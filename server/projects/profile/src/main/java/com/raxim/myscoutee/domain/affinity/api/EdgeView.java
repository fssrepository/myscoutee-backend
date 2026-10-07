package com.raxim.myscoutee.domain.affinity.api;
public interface EdgeView {
    String getId();
    String getPairKey();
    String getLeftUserId();
    String getRightUserId();
    Double getAffinityScore();
    Double getEdgeWeight();
    String getUpdatedDate();
}
