package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;

import tools.jackson.databind.ObjectMapper;

@Service
public class PlatformParametersSeedService implements ApplicationRunner {
    private static final String CONFIG_KEY = "default";

    private final AffinityConfigsRepository affinityConfigsRepository;
    private final ObjectMapper objectMapper;

    public PlatformParametersSeedService(
            AffinityConfigsRepository affinityConfigsRepository,
            ObjectMapper objectMapper) {
        this.affinityConfigsRepository = affinityConfigsRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void run(ApplicationArguments args) {
        withMongoMode(MongoSessionMode.REAL, this::seedProductionDefaults);
        withMongoMode(MongoSessionMode.DEMO, this::seedDemoHistory);
    }

    private void seedProductionDefaults() {
        if (affinityConfigsRepository.findFirstByKeyOrderByVersionDesc(CONFIG_KEY).isPresent()) {
            return;
        }
        affinityConfigsRepository.save(productionDefaultConfig());
    }

    private void seedDemoHistory() {
        List<AffinityConfig> existing = affinityConfigsRepository.findByKeyOrderByVersionDesc(CONFIG_KEY);
        if (existing.stream().anyMatch(config -> safeVersion(config) > 1)) {
            return;
        }

        Map<Integer, AffinityConfig> existingByVersion = existing.stream()
                .collect(Collectors.toMap(this::safeVersion, config -> config, (left, right) -> left));
        for (AffinityConfig seeded : demoHistoryConfigs()) {
            AffinityConfig existingVersion = existingByVersion.get(safeVersion(seeded));
            if (existingVersion != null && StringUtils.hasText(existingVersion.getId())) {
                seeded.setId(existingVersion.getId());
            }
            affinityConfigsRepository.save(seeded);
        }
    }

    private AffinityConfig productionDefaultConfig() {
        AffinityConfig config = AffinityConfig.defaults();
        config.setId(null);
        config.setKey(CONFIG_KEY);
        config.setActive(true);
        config.setVersion(1);
        config.setChangedDate("2026-05-01T09:00:00.000Z");
        config.setChangedUser("system");
        config.setChangedSection("seed");
        config.setChangeSummary("Initial platform parameter defaults.");
        return config;
    }

    private List<AffinityConfig> demoHistoryConfigs() {
        List<AffinityConfig> versions = new ArrayList<>();
        AffinityConfig current = demoInitialConfig();
        versions.add(metadata(
                current,
                1,
                false,
                "seed",
                "system",
                "2026-05-01T09:00:00.000Z",
                "Initial parameter seed."));

        current = cloneConfig(current);
        applyProfileDefaults(current);
        versions.add(metadata(
                current,
                2,
                false,
                "profile",
                "admin-demo-noel",
                "2026-05-04T10:10:00.000Z",
                "Balanced profile, workplace, school, and trait inputs."));

        current = cloneConfig(current);
        applyMatchingDefaults(current);
        versions.add(metadata(
                current,
                3,
                false,
                "matching",
                "admin-demo-ava",
                "2026-05-07T12:30:00.000Z",
                "Raised inside-network confidence after graph review."));

        current = cloneConfig(current);
        applyEventDefaults(current);
        versions.add(metadata(
                current,
                4,
                false,
                "events",
                "admin-demo-ava",
                "2026-05-08T15:45:00.000Z",
                "Adjusted host confidence and open-capacity boost."));

        current = cloneConfig(current);
        applyAssetDefaults(current);
        versions.add(metadata(
                current,
                5,
                true,
                "assets",
                "admin-demo-noel",
                "2026-05-09T08:15:00.000Z",
                "Added owner confidence and request pressure to asset ranking."));
        return versions;
    }

    private AffinityConfig demoInitialConfig() {
        AffinityConfig config = AffinityConfig.defaults();
        config.setId(null);
        config.setKey(CONFIG_KEY);
        config.getRating().getSingleMutual().setMultiplier(8d);
        config.getRating().getPairInsideNetwork().setMultiplier(4d);
        config.getEvidence().getPairInsideNetwork().setMultiplier(0.5d);
        config.getEvidence().getMet().setMultiplier(0.3d);
        config.getOwnerContext().setMultiplier(2d);

        setRuleMultiplier(config.getProfileRules(), 0, 1d);
        setRuleMultiplier(config.getProfileRules(), 1, 2d);
        setRuleMultiplier(config.getProfileRules(), 3, 2d);
        setRuleMultiplier(config.getProfileRules(), 5, 2d);
        setRuleMultiplier(config.getProfileRules(), 7, 2d);
        setRuleMultiplier(config.getImpressionRules(), 0, 2d);

        AffinityConfig.AbsoluteUserAffinityMultipliers user = config.getAbsolute().getUser();
        user.getProfileTokens().setMultiplier(80d);
        user.getProfileDetailTokens().setMultiplier(72d);
        user.getExperienceTokens().setMultiplier(72d);
        user.getImpressionTokens().setMultiplier(60d);
        user.getCompletion().setMultiplier(9d);
        user.getImpressionAverageRating().setMultiplier(20d);

        AffinityConfig.AbsoluteEventAffinityMultipliers event = config.getAbsolute().getEvent();
        event.getContentTokens().setMultiplier(72d);
        AffinityConfig.EventBoostMultipliers eventBoost = config.getBoost().getEvent();
        eventBoost.getRating().setMultiplier(20d);
        eventBoost.getAcceptedMembers().setMultiplier(12d);
        eventBoost.getPendingMembers().setMultiplier(7d);
        eventBoost.getCapacityAvailable().setMultiplier(4d);
        eventBoost.getFreshness().setMultiplier(2d);
        eventBoost.getHostConfidence().setMultiplier(0.15d);

        AffinityConfig.AbsoluteAssetAffinityMultipliers asset = config.getAbsolute().getAsset();
        asset.getContentTokens().setMultiplier(72d);
        AffinityConfig.AssetBoostMultipliers assetBoost = config.getBoost().getAsset();
        assetBoost.getQuantity().setMultiplier(8d);
        assetBoost.getRequestCount().setMultiplier(8d);
        assetBoost.getFreshness().setMultiplier(2d);
        assetBoost.getOwnerConfidence().setMultiplier(0.15d);
        return config;
    }

    private void applyMatchingDefaults(AffinityConfig config) {
        AffinityConfig defaults = AffinityConfig.defaults();
        config.setRating(cloneValue(defaults.getRating(), AffinityConfig.RatingMultipliers.class));
        config.setEvidence(cloneValue(defaults.getEvidence(), AffinityConfig.EvidenceMultipliers.class));
        config.setOwnerContext(cloneValue(defaults.getOwnerContext(), AffinityConfig.MultiplierRule.class));
    }

    private void applyProfileDefaults(AffinityConfig config) {
        AffinityConfig defaults = AffinityConfig.defaults();
        config.setProfileRules(cloneList(defaults.getProfileRules(), AffinityConfig.FieldRule.class));
        config.setImpressionRules(cloneList(defaults.getImpressionRules(), AffinityConfig.FieldRule.class));
        config.getAbsolute().setUser(cloneValue(
                defaults.getAbsolute().getUser(),
                AffinityConfig.AbsoluteUserAffinityMultipliers.class));
    }

    private void applyEventDefaults(AffinityConfig config) {
        AffinityConfig defaults = AffinityConfig.defaults();
        config.getAbsolute().setEvent(cloneValue(
                defaults.getAbsolute().getEvent(),
                AffinityConfig.AbsoluteEventAffinityMultipliers.class));
        config.getBoost().setEvent(cloneValue(defaults.getBoost().getEvent(), AffinityConfig.EventBoostMultipliers.class));
    }

    private void applyAssetDefaults(AffinityConfig config) {
        AffinityConfig defaults = AffinityConfig.defaults();
        config.getAbsolute().setAsset(cloneValue(
                defaults.getAbsolute().getAsset(),
                AffinityConfig.AbsoluteAssetAffinityMultipliers.class));
        config.getBoost().setAsset(cloneValue(defaults.getBoost().getAsset(), AffinityConfig.AssetBoostMultipliers.class));
    }

    private AffinityConfig metadata(
            AffinityConfig config,
            int version,
            boolean active,
            String changedSection,
            String changedUser,
            String changedDate,
            String changeSummary) {
        config.setId(null);
        config.setKey(CONFIG_KEY);
        config.setVersion(version);
        config.setActive(active);
        config.setChangedSection(changedSection);
        config.setChangedUser(changedUser);
        config.setChangedDate(changedDate);
        config.setChangeSummary(changeSummary);
        return config;
    }

    private void setRuleMultiplier(List<AffinityConfig.FieldRule> rules, int index, double multiplier) {
        if (rules == null || index < 0 || index >= rules.size()) {
            return;
        }
        rules.get(index).setMultiplier(multiplier);
    }

    private void withMongoMode(MongoSessionMode mode, Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(mode);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private int safeVersion(AffinityConfig config) {
        return config == null || config.getVersion() == null || config.getVersion() <= 0 ? 1 : config.getVersion();
    }

    private AffinityConfig cloneConfig(AffinityConfig config) {
        return cloneValue(config, AffinityConfig.class);
    }

    private <T> T cloneValue(Object value, Class<T> type) {
        return objectMapper.convertValue(value, type);
    }

    private <T> List<T> cloneList(List<T> values, Class<T> type) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(value -> cloneValue(value, type))
                .toList();
    }
}
