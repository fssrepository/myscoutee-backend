package com.raxim.myscoutee.domain.affinity.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userAffinityEdges")
@CompoundIndexes({
        @CompoundIndex(name = "user_affinity_edge_left_right", def = "{'leftUserId': 1, 'rightUserId': 1}", unique = true),
        @CompoundIndex(name = "user_affinity_edge_left_weight", def = "{'leftUserId': 1, 'edgeWeight': -1}"),
        @CompoundIndex(name = "user_affinity_edge_right_weight", def = "{'rightUserId': 1, 'edgeWeight': -1}")
})
public class UserAffinityEdge implements com.raxim.myscoutee.domain.affinity.api.EdgeView {
    @Id
    private String id;
    @Indexed(name = "user_affinity_edge_pair_key", unique = true)
    private String pairKey;
    private String leftUserId;
    private String rightUserId;
    private Double affinityScore;
    private Double edgeWeight;
    private EvidenceSummary evidence;
    private String updatedDate;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPairKey() {
        return pairKey;
    }

    public void setPairKey(String pairKey) {
        this.pairKey = pairKey;
    }

    public String getLeftUserId() {
        return leftUserId;
    }

    public void setLeftUserId(String leftUserId) {
        this.leftUserId = leftUserId;
    }

    public String getRightUserId() {
        return rightUserId;
    }

    public void setRightUserId(String rightUserId) {
        this.rightUserId = rightUserId;
    }

    public Double getAffinityScore() {
        return affinityScore;
    }

    public void setAffinityScore(Double affinityScore) {
        this.affinityScore = affinityScore;
    }

    public Double getEdgeWeight() {
        return edgeWeight;
    }

    public void setEdgeWeight(Double edgeWeight) {
        this.edgeWeight = edgeWeight;
    }

    public EvidenceSummary getEvidence() {
        return evidence;
    }

    public void setEvidence(EvidenceSummary evidence) {
        this.evidence = evidence;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public static class EvidenceSummary {
        private Integer mutualSingleCount;
        private Integer singleOneSidedCount;
        private Integer pairOutsideNetworkCount;
        private Integer pairInsideNetworkCount;
        private Integer metCount;
        private Double strongestAffinityScore;
        private Double totalMultiplier;

        public Integer getMutualSingleCount() {
            return mutualSingleCount;
        }

        public void setMutualSingleCount(Integer mutualSingleCount) {
            this.mutualSingleCount = mutualSingleCount;
        }

        public Integer getSingleOneSidedCount() {
            return singleOneSidedCount;
        }

        public void setSingleOneSidedCount(Integer singleOneSidedCount) {
            this.singleOneSidedCount = singleOneSidedCount;
        }

        public Integer getPairOutsideNetworkCount() {
            return pairOutsideNetworkCount;
        }

        public void setPairOutsideNetworkCount(Integer pairOutsideNetworkCount) {
            this.pairOutsideNetworkCount = pairOutsideNetworkCount;
        }

        public Integer getPairInsideNetworkCount() {
            return pairInsideNetworkCount;
        }

        public void setPairInsideNetworkCount(Integer pairInsideNetworkCount) {
            this.pairInsideNetworkCount = pairInsideNetworkCount;
        }

        public Integer getMetCount() {
            return metCount;
        }

        public void setMetCount(Integer metCount) {
            this.metCount = metCount;
        }

        public Double getStrongestAffinityScore() {
            return strongestAffinityScore;
        }

        public void setStrongestAffinityScore(Double strongestAffinityScore) {
            this.strongestAffinityScore = strongestAffinityScore;
        }

        public Double getTotalMultiplier() {
            return totalMultiplier;
        }

        public void setTotalMultiplier(Double totalMultiplier) {
            this.totalMultiplier = totalMultiplier;
        }
    }
}
