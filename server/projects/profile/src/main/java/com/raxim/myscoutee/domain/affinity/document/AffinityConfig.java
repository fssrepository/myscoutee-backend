package com.raxim.myscoutee.domain.affinity.document;

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
    private AbsoluteAffinityMultipliers absolute = new AbsoluteAffinityMultipliers();
    private BoostMultipliers boost = new BoostMultipliers();
    private NotificationParameters notifications = new NotificationParameters();
    private JobParameters jobs = new JobParameters();
    private String changedDate;
    private String changedUser;
    private String changedSection;
    private String changeSummary;

    public static AffinityConfig defaults() {
        AffinityConfig config = new AffinityConfig();
        config.setKey("default");
        config.setActive(true);
        config.setVersion(1);
        config.setChangedSection("seed");
        config.setChangeSummary("Initial platform parameter defaults.");

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
                new FieldRule("profile", "languages", null, 2d, "intersection"),
                new FieldRule("profile", "physique", null, 3d, "exact"),
                new FieldRule("profile", "profileDetails", "profile.details.interest", 2d, "intersection"),
                new FieldRule("profile", "profileDetails", "profile.details.values", 3d, "intersection"),
                new FieldRule("profile", "profileDetails", "profile.details.workout", 2d, "exact"),
                new FieldRule("experience", "experience", "profile.experience.workplace", 4d, "intersection"),
                new FieldRule("experience", "experience", "profile.experience.profession", 3d, "intersection"),
                new FieldRule("experience", "experience", "profile.experience.school", 4d, "intersection"),
                new FieldRule("experience", "experience", "profile.experience.education", 2d, "intersection")));
        config.setImpressionRules(List.of(
                new FieldRule("traits", "member.personalityTraits", null, 4d, "trait-vector"),
                new FieldRule("traits", "member.vibeBadges", null, 2d, "intersection"),
                new FieldRule("traits", "member.categoryBadges", null, 2d, "intersection")));

        AbsoluteAffinityMultipliers absolute = new AbsoluteAffinityMultipliers();
        AbsoluteUserAffinityMultipliers user = new AbsoluteUserAffinityMultipliers();
        user.setProfileTokens(new MultiplierRule(97d));
        user.setProfileDetailTokens(new MultiplierRule(97d));
        user.setExperienceTokens(new MultiplierRule(97d));
        user.setImpressionTokens(new MultiplierRule(97d));
        user.setAge(new MultiplierRule(17d));
        user.setHeight(new MultiplierRule(11d));
        user.setCompletion(new MultiplierRule(13d));
        user.setImpressionAverageRating(new MultiplierRule(29d));
        user.setImpressionPeopleMet(new MultiplierRule(43d));
        user.setImpressionTotalEvents(new MultiplierRule(37d));
        user.setImpressionRepeatCount(new MultiplierRule(53d));
        user.setImpressionNoShowPenalty(new MultiplierRule(71d));
        user.setImpressionTraitPercent(new MultiplierRule(7d));
        user.setImpressionTraitEvidenceCount(new MultiplierRule(23d));
        absolute.setUser(user);

        AbsoluteEventAffinityMultipliers event = new AbsoluteEventAffinityMultipliers();
        event.setContentTokens(new MultiplierRule(89d));
        event.setParticipantAffinity(new MultiplierRule(1d));
        absolute.setEvent(event);

        AbsoluteAssetAffinityMultipliers asset = new AbsoluteAssetAffinityMultipliers();
        asset.setContentTokens(new MultiplierRule(83d));
        asset.setOwnerAffinity(new MultiplierRule(1d));
        absolute.setAsset(asset);
        config.setAbsolute(absolute);

        BoostMultipliers boost = new BoostMultipliers();
        EventBoostMultipliers eventBoost = new EventBoostMultipliers();
        eventBoost.setRating(new MultiplierRule(29d));
        eventBoost.setAcceptedMembers(new MultiplierRule(19d));
        eventBoost.setPendingMembers(new MultiplierRule(11d));
        eventBoost.setCapacityAvailable(new MultiplierRule(7d));
        eventBoost.setFreshness(new MultiplierRule(5d));
        eventBoost.setHostConfidence(new MultiplierRule(0.25d));
        boost.setEvent(eventBoost);
        AssetBoostMultipliers assetBoost = new AssetBoostMultipliers();
        assetBoost.setCapacityAvailable(new MultiplierRule(7d));
        assetBoost.setQuantity(new MultiplierRule(11d));
        assetBoost.setRequestCount(new MultiplierRule(13d));
        assetBoost.setFreshness(new MultiplierRule(3d));
        assetBoost.setOwnerConfidence(new MultiplierRule(0.25d));
        boost.setAsset(assetBoost);
        config.setBoost(boost);
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

    public AbsoluteAffinityMultipliers getAbsolute() {
        return absolute == null ? new AbsoluteAffinityMultipliers() : absolute;
    }

    public void setAbsolute(AbsoluteAffinityMultipliers absolute) {
        this.absolute = absolute;
    }

    public BoostMultipliers getBoost() {
        return boost == null ? new BoostMultipliers() : boost;
    }

    public void setBoost(BoostMultipliers boost) {
        this.boost = boost;
    }

    public NotificationParameters getNotifications() {
        return notifications == null ? new NotificationParameters() : notifications;
    }

    public void setNotifications(NotificationParameters notifications) {
        this.notifications = notifications;
    }

    public JobParameters getJobs() {
        return jobs == null ? new JobParameters() : jobs;
    }

    public void setJobs(JobParameters jobs) {
        this.jobs = jobs;
    }

    public String getChangedDate() {
        return changedDate;
    }

    public void setChangedDate(String changedDate) {
        this.changedDate = changedDate;
    }

    public String getChangedUser() {
        return changedUser;
    }

    public void setChangedUser(String changedUser) {
        this.changedUser = changedUser;
    }

    public String getChangedSection() {
        return changedSection;
    }

    public void setChangedSection(String changedSection) {
        this.changedSection = changedSection;
    }

    public String getChangeSummary() {
        return changeSummary;
    }

    public void setChangeSummary(String changeSummary) {
        this.changeSummary = changeSummary;
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

    public static class AbsoluteAffinityMultipliers {
        private AbsoluteUserAffinityMultipliers user = new AbsoluteUserAffinityMultipliers();
        private AbsoluteEventAffinityMultipliers event = new AbsoluteEventAffinityMultipliers();
        private AbsoluteAssetAffinityMultipliers asset = new AbsoluteAssetAffinityMultipliers();

        public AbsoluteUserAffinityMultipliers getUser() {
            return user == null ? new AbsoluteUserAffinityMultipliers() : user;
        }

        public void setUser(AbsoluteUserAffinityMultipliers user) {
            this.user = user;
        }

        public AbsoluteEventAffinityMultipliers getEvent() {
            return event == null ? new AbsoluteEventAffinityMultipliers() : event;
        }

        public void setEvent(AbsoluteEventAffinityMultipliers event) {
            this.event = event;
        }

        public AbsoluteAssetAffinityMultipliers getAsset() {
            return asset == null ? new AbsoluteAssetAffinityMultipliers() : asset;
        }

        public void setAsset(AbsoluteAssetAffinityMultipliers asset) {
            this.asset = asset;
        }
    }

    public static class AbsoluteUserAffinityMultipliers {
        private MultiplierRule profileTokens = new MultiplierRule();
        private MultiplierRule profileDetailTokens = new MultiplierRule();
        private MultiplierRule experienceTokens = new MultiplierRule();
        private MultiplierRule impressionTokens = new MultiplierRule();
        private MultiplierRule age = new MultiplierRule();
        private MultiplierRule height = new MultiplierRule();
        private MultiplierRule completion = new MultiplierRule();
        private MultiplierRule impressionAverageRating = new MultiplierRule();
        private MultiplierRule impressionPeopleMet = new MultiplierRule();
        private MultiplierRule impressionTotalEvents = new MultiplierRule();
        private MultiplierRule impressionRepeatCount = new MultiplierRule();
        private MultiplierRule impressionNoShowPenalty = new MultiplierRule();
        private MultiplierRule impressionTraitPercent = new MultiplierRule();
        private MultiplierRule impressionTraitEvidenceCount = new MultiplierRule();

        public MultiplierRule getProfileTokens() {
            return profileTokens == null ? new MultiplierRule() : profileTokens;
        }

        public void setProfileTokens(MultiplierRule profileTokens) {
            this.profileTokens = profileTokens;
        }

        public MultiplierRule getProfileDetailTokens() {
            return profileDetailTokens == null ? new MultiplierRule() : profileDetailTokens;
        }

        public void setProfileDetailTokens(MultiplierRule profileDetailTokens) {
            this.profileDetailTokens = profileDetailTokens;
        }

        public MultiplierRule getExperienceTokens() {
            return experienceTokens == null ? new MultiplierRule() : experienceTokens;
        }

        public void setExperienceTokens(MultiplierRule experienceTokens) {
            this.experienceTokens = experienceTokens;
        }

        public MultiplierRule getImpressionTokens() {
            return impressionTokens == null ? new MultiplierRule() : impressionTokens;
        }

        public void setImpressionTokens(MultiplierRule impressionTokens) {
            this.impressionTokens = impressionTokens;
        }

        public MultiplierRule getAge() {
            return age == null ? new MultiplierRule() : age;
        }

        public void setAge(MultiplierRule age) {
            this.age = age;
        }

        public MultiplierRule getHeight() {
            return height == null ? new MultiplierRule() : height;
        }

        public void setHeight(MultiplierRule height) {
            this.height = height;
        }

        public MultiplierRule getCompletion() {
            return completion == null ? new MultiplierRule() : completion;
        }

        public void setCompletion(MultiplierRule completion) {
            this.completion = completion;
        }

        public MultiplierRule getImpressionAverageRating() {
            return impressionAverageRating == null ? new MultiplierRule() : impressionAverageRating;
        }

        public void setImpressionAverageRating(MultiplierRule impressionAverageRating) {
            this.impressionAverageRating = impressionAverageRating;
        }

        public MultiplierRule getImpressionPeopleMet() {
            return impressionPeopleMet == null ? new MultiplierRule() : impressionPeopleMet;
        }

        public void setImpressionPeopleMet(MultiplierRule impressionPeopleMet) {
            this.impressionPeopleMet = impressionPeopleMet;
        }

        public MultiplierRule getImpressionTotalEvents() {
            return impressionTotalEvents == null ? new MultiplierRule() : impressionTotalEvents;
        }

        public void setImpressionTotalEvents(MultiplierRule impressionTotalEvents) {
            this.impressionTotalEvents = impressionTotalEvents;
        }

        public MultiplierRule getImpressionRepeatCount() {
            return impressionRepeatCount == null ? new MultiplierRule() : impressionRepeatCount;
        }

        public void setImpressionRepeatCount(MultiplierRule impressionRepeatCount) {
            this.impressionRepeatCount = impressionRepeatCount;
        }

        public MultiplierRule getImpressionNoShowPenalty() {
            return impressionNoShowPenalty == null ? new MultiplierRule() : impressionNoShowPenalty;
        }

        public void setImpressionNoShowPenalty(MultiplierRule impressionNoShowPenalty) {
            this.impressionNoShowPenalty = impressionNoShowPenalty;
        }

        public MultiplierRule getImpressionTraitPercent() {
            return impressionTraitPercent == null ? new MultiplierRule() : impressionTraitPercent;
        }

        public void setImpressionTraitPercent(MultiplierRule impressionTraitPercent) {
            this.impressionTraitPercent = impressionTraitPercent;
        }

        public MultiplierRule getImpressionTraitEvidenceCount() {
            return impressionTraitEvidenceCount == null ? new MultiplierRule() : impressionTraitEvidenceCount;
        }

        public void setImpressionTraitEvidenceCount(MultiplierRule impressionTraitEvidenceCount) {
            this.impressionTraitEvidenceCount = impressionTraitEvidenceCount;
        }
    }

    public static class AbsoluteEventAffinityMultipliers {
        private MultiplierRule contentTokens = new MultiplierRule();
        private MultiplierRule participantAffinity = new MultiplierRule();

        public MultiplierRule getContentTokens() {
            return contentTokens == null ? new MultiplierRule() : contentTokens;
        }

        public void setContentTokens(MultiplierRule contentTokens) {
            this.contentTokens = contentTokens;
        }

        public MultiplierRule getParticipantAffinity() {
            return participantAffinity == null ? new MultiplierRule() : participantAffinity;
        }

        public void setParticipantAffinity(MultiplierRule participantAffinity) {
            this.participantAffinity = participantAffinity;
        }

    }

    public static class AbsoluteAssetAffinityMultipliers {
        private MultiplierRule contentTokens = new MultiplierRule();
        private MultiplierRule ownerAffinity = new MultiplierRule();

        public MultiplierRule getContentTokens() {
            return contentTokens == null ? new MultiplierRule() : contentTokens;
        }

        public void setContentTokens(MultiplierRule contentTokens) {
            this.contentTokens = contentTokens;
        }

        public MultiplierRule getOwnerAffinity() {
            return ownerAffinity == null ? new MultiplierRule() : ownerAffinity;
        }

        public void setOwnerAffinity(MultiplierRule ownerAffinity) {
            this.ownerAffinity = ownerAffinity;
        }

    }

    public static class BoostMultipliers {
        private EventBoostMultipliers event = new EventBoostMultipliers();
        private AssetBoostMultipliers asset = new AssetBoostMultipliers();

        public EventBoostMultipliers getEvent() {
            return event == null ? new EventBoostMultipliers() : event;
        }

        public void setEvent(EventBoostMultipliers event) {
            this.event = event;
        }

        public AssetBoostMultipliers getAsset() {
            return asset == null ? new AssetBoostMultipliers() : asset;
        }

        public void setAsset(AssetBoostMultipliers asset) {
            this.asset = asset;
        }
    }

    public static class EventBoostMultipliers {
        private MultiplierRule rating = new MultiplierRule();
        private MultiplierRule acceptedMembers = new MultiplierRule();
        private MultiplierRule pendingMembers = new MultiplierRule();
        private MultiplierRule capacityAvailable = new MultiplierRule();
        private MultiplierRule freshness = new MultiplierRule();
        private MultiplierRule hostConfidence = new MultiplierRule();

        public MultiplierRule getRating() {
            return rating == null ? new MultiplierRule() : rating;
        }

        public void setRating(MultiplierRule rating) {
            this.rating = rating;
        }

        public MultiplierRule getAcceptedMembers() {
            return acceptedMembers == null ? new MultiplierRule() : acceptedMembers;
        }

        public void setAcceptedMembers(MultiplierRule acceptedMembers) {
            this.acceptedMembers = acceptedMembers;
        }

        public MultiplierRule getPendingMembers() {
            return pendingMembers == null ? new MultiplierRule() : pendingMembers;
        }

        public void setPendingMembers(MultiplierRule pendingMembers) {
            this.pendingMembers = pendingMembers;
        }

        public MultiplierRule getCapacityAvailable() {
            return capacityAvailable == null ? new MultiplierRule() : capacityAvailable;
        }

        public void setCapacityAvailable(MultiplierRule capacityAvailable) {
            this.capacityAvailable = capacityAvailable;
        }

        public MultiplierRule getFreshness() {
            return freshness == null ? new MultiplierRule() : freshness;
        }

        public void setFreshness(MultiplierRule freshness) {
            this.freshness = freshness;
        }

        public MultiplierRule getHostConfidence() {
            return hostConfidence == null ? new MultiplierRule() : hostConfidence;
        }

        public void setHostConfidence(MultiplierRule hostConfidence) {
            this.hostConfidence = hostConfidence;
        }
    }

    public static class AssetBoostMultipliers {
        private MultiplierRule capacityAvailable = new MultiplierRule();
        private MultiplierRule quantity = new MultiplierRule();
        private MultiplierRule requestCount = new MultiplierRule();
        private MultiplierRule freshness = new MultiplierRule();
        private MultiplierRule ownerConfidence = new MultiplierRule();

        public MultiplierRule getCapacityAvailable() {
            return capacityAvailable == null ? new MultiplierRule() : capacityAvailable;
        }

        public void setCapacityAvailable(MultiplierRule capacityAvailable) {
            this.capacityAvailable = capacityAvailable;
        }

        public MultiplierRule getQuantity() {
            return quantity == null ? new MultiplierRule() : quantity;
        }

        public void setQuantity(MultiplierRule quantity) {
            this.quantity = quantity;
        }

        public MultiplierRule getRequestCount() {
            return requestCount == null ? new MultiplierRule() : requestCount;
        }

        public void setRequestCount(MultiplierRule requestCount) {
            this.requestCount = requestCount;
        }

        public MultiplierRule getFreshness() {
            return freshness == null ? new MultiplierRule() : freshness;
        }

        public void setFreshness(MultiplierRule freshness) {
            this.freshness = freshness;
        }

        public MultiplierRule getOwnerConfidence() {
            return ownerConfidence == null ? new MultiplierRule() : ownerConfidence;
        }

        public void setOwnerConfidence(MultiplierRule ownerConfidence) {
            this.ownerConfidence = ownerConfidence;
        }
    }

    public static class NotificationParameters {
        private Integer firebaseWindowStartHour = 8;
        private Integer firebaseWindowEndHour = 22;
        private Integer maxWorkers = 4;
        private Integer maxRetries = 5;
        private Integer initialBackoffSeconds = 30;
        private Integer collapseWindowSeconds = 300;
        private Integer multicastThreshold = 3;
        private Integer topicThreshold = 250;

        public Integer getFirebaseWindowStartHour() {
            return firebaseWindowStartHour;
        }

        public void setFirebaseWindowStartHour(Integer firebaseWindowStartHour) {
            this.firebaseWindowStartHour = firebaseWindowStartHour;
        }

        public Integer getFirebaseWindowEndHour() {
            return firebaseWindowEndHour;
        }

        public void setFirebaseWindowEndHour(Integer firebaseWindowEndHour) {
            this.firebaseWindowEndHour = firebaseWindowEndHour;
        }

        public Integer getMaxWorkers() {
            return maxWorkers;
        }

        public void setMaxWorkers(Integer maxWorkers) {
            this.maxWorkers = maxWorkers;
        }

        public Integer getMaxRetries() {
            return maxRetries;
        }

        public void setMaxRetries(Integer maxRetries) {
            this.maxRetries = maxRetries;
        }

        public Integer getInitialBackoffSeconds() {
            return initialBackoffSeconds;
        }

        public void setInitialBackoffSeconds(Integer initialBackoffSeconds) {
            this.initialBackoffSeconds = initialBackoffSeconds;
        }

        public Integer getCollapseWindowSeconds() {
            return collapseWindowSeconds;
        }

        public void setCollapseWindowSeconds(Integer collapseWindowSeconds) {
            this.collapseWindowSeconds = collapseWindowSeconds;
        }

        public Integer getMulticastThreshold() {
            return multicastThreshold;
        }

        public void setMulticastThreshold(Integer multicastThreshold) {
            this.multicastThreshold = multicastThreshold;
        }

        public Integer getTopicThreshold() {
            return topicThreshold;
        }

        public void setTopicThreshold(Integer topicThreshold) {
            this.topicThreshold = topicThreshold;
        }
    }

    public static class JobParameters {
        private Integer userChangedDebounceSeconds = 300;
        private Integer eventChangedDebounceSeconds = 180;
        private Integer eventMembersChangedDebounceSeconds = 300;
        private Integer assetChangedDebounceSeconds = 180;
        private Integer assetRequestsChangedDebounceSeconds = 180;
        private Integer configChangedDebounceSeconds = 900;
        private Integer workerPollDelayMs = 60000;
        private Integer batchSize = 50;
        private Integer leaseDurationSeconds = 600;
        private Integer eventSchedulerPollDelayMs = 1800000;
        private Integer autoInviterCadenceMs = 7200000;
        private Integer notificationOutboxPollDelayMs = 60000;
        private Integer accountPurgeWindowDays = 30;

        public Integer getUserChangedDebounceSeconds() {
            return userChangedDebounceSeconds;
        }

        public void setUserChangedDebounceSeconds(Integer userChangedDebounceSeconds) {
            this.userChangedDebounceSeconds = userChangedDebounceSeconds;
        }

        public Integer getEventChangedDebounceSeconds() {
            return eventChangedDebounceSeconds;
        }

        public void setEventChangedDebounceSeconds(Integer eventChangedDebounceSeconds) {
            this.eventChangedDebounceSeconds = eventChangedDebounceSeconds;
        }

        public Integer getEventMembersChangedDebounceSeconds() {
            return eventMembersChangedDebounceSeconds;
        }

        public void setEventMembersChangedDebounceSeconds(Integer eventMembersChangedDebounceSeconds) {
            this.eventMembersChangedDebounceSeconds = eventMembersChangedDebounceSeconds;
        }

        public Integer getAssetChangedDebounceSeconds() {
            return assetChangedDebounceSeconds;
        }

        public void setAssetChangedDebounceSeconds(Integer assetChangedDebounceSeconds) {
            this.assetChangedDebounceSeconds = assetChangedDebounceSeconds;
        }

        public Integer getAssetRequestsChangedDebounceSeconds() {
            return assetRequestsChangedDebounceSeconds;
        }

        public void setAssetRequestsChangedDebounceSeconds(Integer assetRequestsChangedDebounceSeconds) {
            this.assetRequestsChangedDebounceSeconds = assetRequestsChangedDebounceSeconds;
        }

        public Integer getConfigChangedDebounceSeconds() {
            return configChangedDebounceSeconds;
        }

        public void setConfigChangedDebounceSeconds(Integer configChangedDebounceSeconds) {
            this.configChangedDebounceSeconds = configChangedDebounceSeconds;
        }

        public Integer getWorkerPollDelayMs() {
            return workerPollDelayMs;
        }

        public void setWorkerPollDelayMs(Integer workerPollDelayMs) {
            this.workerPollDelayMs = workerPollDelayMs;
        }

        public Integer getBatchSize() {
            return batchSize;
        }

        public void setBatchSize(Integer batchSize) {
            this.batchSize = batchSize;
        }

        public Integer getLeaseDurationSeconds() {
            return leaseDurationSeconds;
        }

        public void setLeaseDurationSeconds(Integer leaseDurationSeconds) {
            this.leaseDurationSeconds = leaseDurationSeconds;
        }

        public Integer getEventSchedulerPollDelayMs() {
            return eventSchedulerPollDelayMs;
        }

        public void setEventSchedulerPollDelayMs(Integer eventSchedulerPollDelayMs) {
            this.eventSchedulerPollDelayMs = eventSchedulerPollDelayMs;
        }

        public Integer getAutoInviterCadenceMs() {
            return autoInviterCadenceMs;
        }

        public void setAutoInviterCadenceMs(Integer autoInviterCadenceMs) {
            this.autoInviterCadenceMs = autoInviterCadenceMs;
        }

        public Integer getNotificationOutboxPollDelayMs() {
            return notificationOutboxPollDelayMs;
        }

        public void setNotificationOutboxPollDelayMs(Integer notificationOutboxPollDelayMs) {
            this.notificationOutboxPollDelayMs = notificationOutboxPollDelayMs;
        }

        public Integer getAccountPurgeWindowDays() {
            return accountPurgeWindowDays;
        }

        public void setAccountPurgeWindowDays(Integer accountPurgeWindowDays) {
            this.accountPurgeWindowDays = accountPurgeWindowDays;
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
        private String group;
        private String field;
        private String labelKey;
        private String strategy;

        public FieldRule() {
        }

        public FieldRule(String field, Double multiplier, String strategy) {
            super(multiplier);
            this.field = field;
            this.strategy = strategy;
        }

        public FieldRule(String field, String labelKey, Double multiplier, String strategy) {
            super(multiplier);
            this.field = field;
            this.labelKey = labelKey;
            this.strategy = strategy;
        }

        public FieldRule(String group, String field, String labelKey, Double multiplier, String strategy) {
            super(multiplier);
            this.group = group;
            this.field = field;
            this.labelKey = labelKey;
            this.strategy = strategy;
        }

        public String getGroup() {
            return group;
        }

        public void setGroup(String group) {
            this.group = group;
        }

        public String getField() {
            return field;
        }

        public void setField(String field) {
            this.field = field;
        }

        public String getLabelKey() {
            return labelKey;
        }

        public void setLabelKey(String labelKey) {
            this.labelKey = labelKey;
        }

        public String getStrategy() {
            return strategy;
        }

        public void setStrategy(String strategy) {
            this.strategy = strategy;
        }
    }
}
