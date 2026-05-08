package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "affinityConfigs")
@CompoundIndexes({
        @CompoundIndex(name = "affinity_config_active_version", def = "{'active': 1, 'version': -1}"),
        @CompoundIndex(name = "affinity_config_key_version", def = "{'key': 1, 'version': -1}", unique = true)
})
public class AffinityConfig {
    @Id
    private String id;
    private String key;
    private Boolean active;
    private Integer version;
    private RatingMultipliers rating = new RatingMultipliers();
    private EvidenceMultipliers evidence = new EvidenceMultipliers();
    private DistanceRule distance = new DistanceRule();
    private MultiplierRule ownerContext = new MultiplierRule();
    private List<FieldRule> profileRules = new ArrayList<>();
    private List<FieldRule> impressionRules = new ArrayList<>();

    public static AffinityConfig defaults() {
        AffinityConfig config = new AffinityConfig();
        config.setKey("default");
        config.setActive(true);
        config.setVersion(1);

        RatingMultipliers rating = new RatingMultipliers();
        rating.setSingleMutual(new MultiplierRule(10d));
        rating.setSingleOneSided(new MultiplierRule(2d));
        rating.setPairOutsideNetwork(new MultiplierRule(2d));
        rating.setPairInsideNetwork(new MultiplierRule(5d));
        config.setRating(rating);

        EvidenceMultipliers evidence = new EvidenceMultipliers();
        evidence.setMutualSingle(new MultiplierRule(1d));
        evidence.setSingleOneSided(new MultiplierRule(0d));
        evidence.setPairOutsideNetwork(new MultiplierRule(0.3d));
        evidence.setPairInsideNetwork(new MultiplierRule(0.7d));
        evidence.setMet(new MultiplierRule(0.5d));
        config.setEvidence(evidence);

        DistanceRule distance = new DistanceRule();
        distance.setMultiplier(5d);
        distance.setMaxMeters(50_000);
        distance.setStrategy("linear");
        config.setDistance(distance);

        config.setOwnerContext(new MultiplierRule(3d));
        config.setProfileRules(List.of(
                new FieldRule("languages", 2d, "intersection"),
                new FieldRule("physique", 3d, "exact"),
                new FieldRule("profileDetails.values", 3d, "intersection")));
        config.setImpressionRules(List.of(
                new FieldRule("member.personalityTraits", 4d, "trait-vector"),
                new FieldRule("member.vibeBadges", 2d, "intersection"),
                new FieldRule("member.categoryBadges", 2d, "intersection")));
        return config;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public RatingMultipliers getRating() {
        return rating == null ? new RatingMultipliers() : rating;
    }

    public void setRating(RatingMultipliers rating) {
        this.rating = rating;
    }

    public EvidenceMultipliers getEvidence() {
        return evidence == null ? new EvidenceMultipliers() : evidence;
    }

    public void setEvidence(EvidenceMultipliers evidence) {
        this.evidence = evidence;
    }

    public DistanceRule getDistance() {
        return distance == null ? new DistanceRule() : distance;
    }

    public void setDistance(DistanceRule distance) {
        this.distance = distance;
    }

    public MultiplierRule getOwnerContext() {
        return ownerContext == null ? new MultiplierRule() : ownerContext;
    }

    public void setOwnerContext(MultiplierRule ownerContext) {
        this.ownerContext = ownerContext;
    }

    public List<FieldRule> getProfileRules() {
        return profileRules == null ? List.of() : profileRules;
    }

    public void setProfileRules(List<FieldRule> profileRules) {
        this.profileRules = profileRules == null ? new ArrayList<>() : new ArrayList<>(profileRules);
    }

    public List<FieldRule> getImpressionRules() {
        return impressionRules == null ? List.of() : impressionRules;
    }

    public void setImpressionRules(List<FieldRule> impressionRules) {
        this.impressionRules = impressionRules == null ? new ArrayList<>() : new ArrayList<>(impressionRules);
    }

    public static class RatingMultipliers {
        private MultiplierRule singleMutual = new MultiplierRule();
        private MultiplierRule singleOneSided = new MultiplierRule();
        private MultiplierRule pairOutsideNetwork = new MultiplierRule();
        private MultiplierRule pairInsideNetwork = new MultiplierRule();

        public MultiplierRule getSingleMutual() {
            return singleMutual == null ? new MultiplierRule() : singleMutual;
        }

        public void setSingleMutual(MultiplierRule singleMutual) {
            this.singleMutual = singleMutual;
        }

        public MultiplierRule getSingleOneSided() {
            return singleOneSided == null ? new MultiplierRule() : singleOneSided;
        }

        public void setSingleOneSided(MultiplierRule singleOneSided) {
            this.singleOneSided = singleOneSided;
        }

        public MultiplierRule getPairOutsideNetwork() {
            return pairOutsideNetwork == null ? new MultiplierRule() : pairOutsideNetwork;
        }

        public void setPairOutsideNetwork(MultiplierRule pairOutsideNetwork) {
            this.pairOutsideNetwork = pairOutsideNetwork;
        }

        public MultiplierRule getPairInsideNetwork() {
            return pairInsideNetwork == null ? new MultiplierRule() : pairInsideNetwork;
        }

        public void setPairInsideNetwork(MultiplierRule pairInsideNetwork) {
            this.pairInsideNetwork = pairInsideNetwork;
        }
    }

    public static class EvidenceMultipliers {
        private MultiplierRule mutualSingle = new MultiplierRule();
        private MultiplierRule singleOneSided = new MultiplierRule();
        private MultiplierRule pairOutsideNetwork = new MultiplierRule();
        private MultiplierRule pairInsideNetwork = new MultiplierRule();
        private MultiplierRule met = new MultiplierRule();

        public MultiplierRule getMutualSingle() {
            return mutualSingle == null ? new MultiplierRule() : mutualSingle;
        }

        public void setMutualSingle(MultiplierRule mutualSingle) {
            this.mutualSingle = mutualSingle;
        }

        public MultiplierRule getSingleOneSided() {
            return singleOneSided == null ? new MultiplierRule() : singleOneSided;
        }

        public void setSingleOneSided(MultiplierRule singleOneSided) {
            this.singleOneSided = singleOneSided;
        }

        public MultiplierRule getPairOutsideNetwork() {
            return pairOutsideNetwork == null ? new MultiplierRule() : pairOutsideNetwork;
        }

        public void setPairOutsideNetwork(MultiplierRule pairOutsideNetwork) {
            this.pairOutsideNetwork = pairOutsideNetwork;
        }

        public MultiplierRule getPairInsideNetwork() {
            return pairInsideNetwork == null ? new MultiplierRule() : pairInsideNetwork;
        }

        public void setPairInsideNetwork(MultiplierRule pairInsideNetwork) {
            this.pairInsideNetwork = pairInsideNetwork;
        }

        public MultiplierRule getMet() {
            return met == null ? new MultiplierRule() : met;
        }

        public void setMet(MultiplierRule met) {
            this.met = met;
        }
    }

    public static class MultiplierRule {
        private Double multiplier;

        public MultiplierRule() {
        }

        public MultiplierRule(Double multiplier) {
            this.multiplier = multiplier;
        }

        public Double getMultiplier() {
            return multiplier;
        }

        public void setMultiplier(Double multiplier) {
            this.multiplier = multiplier;
        }
    }

    public static class DistanceRule extends MultiplierRule {
        private Integer maxMeters;
        private String strategy;

        public Integer getMaxMeters() {
            return maxMeters;
        }

        public void setMaxMeters(Integer maxMeters) {
            this.maxMeters = maxMeters;
        }

        public String getStrategy() {
            return strategy;
        }

        public void setStrategy(String strategy) {
            this.strategy = strategy;
        }
    }

    public static class FieldRule extends MultiplierRule {
        private String field;
        private String strategy;

        public FieldRule() {
        }

        public FieldRule(String field, Double multiplier, String strategy) {
            super(multiplier);
            this.field = field;
            this.strategy = strategy;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getStrategy() {
            return strategy;
        }

        public void setStrategy(String strategy) {
            this.strategy = strategy;
        }
    }
}
