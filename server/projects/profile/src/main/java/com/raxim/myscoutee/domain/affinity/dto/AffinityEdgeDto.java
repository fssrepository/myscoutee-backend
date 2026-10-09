package com.raxim.myscoutee.domain.affinity.dto;

import com.raxim.myscoutee.domain.affinity.api.EdgeView;

/** Detached directory view; private evidence remains in the affinity owner. */
public record AffinityEdgeDto(
        String id,
        String pairKey,
        String leftUserId,
        String rightUserId,
        Double affinityScore,
        Double edgeWeight,
        String updatedDate) implements EdgeView {
    public static AffinityEdgeDto from(EdgeView edge) {
        return new AffinityEdgeDto(edge.getId(), edge.getPairKey(), edge.getLeftUserId(), edge.getRightUserId(), edge.getAffinityScore(), edge.getEdgeWeight(), edge.getUpdatedDate());
    }
    @Override public String getId() { return id; }
    @Override public String getPairKey() { return pairKey; }
    @Override public String getLeftUserId() { return leftUserId; }
    @Override public String getRightUserId() { return rightUserId; }
    @Override public Double getAffinityScore() { return affinityScore; }
    @Override public Double getEdgeWeight() { return edgeWeight; }
    @Override public String getUpdatedDate() { return updatedDate; }
}
