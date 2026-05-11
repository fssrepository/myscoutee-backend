package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamFieldDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsHistoryDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsHistoryItemDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsRevertRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsSectionDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminParamsStateDto;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

import tools.jackson.databind.ObjectMapper;

@Service
public class AdminParamsService {
    private static final String CONFIG_KEY = "default";
    private static final List<SectionDefinition> SECTIONS = List.of(
            new SectionDefinition("matching", "Matching"),
            new SectionDefinition("profile", "Profile"),
            new SectionDefinition("events", "Events"),
            new SectionDefinition("assets", "Assets"),
            new SectionDefinition("discovery", "Discovery"),
            new SectionDefinition("notifications", "Notifications"),
            new SectionDefinition("jobs", "Jobs"));

    private final AffinityConfigsRepository affinityConfigsRepository;
    private final ObjectMapper objectMapper;
    private final NotificationOutboxService notificationOutboxService;

    public AdminParamsService(
            AffinityConfigsRepository affinityConfigsRepository,
            ObjectMapper objectMapper,
            NotificationOutboxService notificationOutboxService) {
        this.affinityConfigsRepository = affinityConfigsRepository;
        this.objectMapper = objectMapper;
        this.notificationOutboxService = notificationOutboxService;
    }

    public AdminParamsStateDto state(String adminUserId) {
        AffinityConfig active = activeConfig();
        List<AffinityConfig> versions = configHistory(active.getKey());
        List<AdminParamsSectionDto> sections = SECTIONS.stream()
                .map(section -> sectionDto(section, active, versions))
                .toList();
        return new AdminParamsStateDto(sections, firstNonBlank(active.getChangedDate(), Instant.now().toString()));
    }

    public AdminParamsHistoryDto history(String sectionKey) {
        SectionDefinition section = section(sectionKey);
        AffinityConfig active = activeConfig();
        List<AdminParamsHistoryItemDto> versions = configHistory(active.getKey()).stream()
                .map(config -> new AdminParamsHistoryItemDto(
                        config.getId(),
                        safeVersion(config),
                        changedDate(config),
                        firstNonBlank(config.getChangedUser(), "system"),
                        summaryFor(config, section.key()),
                        Boolean.TRUE.equals(config.getActive()),
                        fieldsFor(section.key(), config)))
                .toList();
        return new AdminParamsHistoryDto(section.key(), section.label(), versions);
    }

    public AdminParamsStateDto save(AdminParamsSaveRequestDto request) {
        String sectionKey = section(request == null ? null : request.sectionKey()).key();
        AffinityConfig current = activeConfig();
        AffinityConfig next = cloneConfig(current);
        applySection(sectionKey, next, request == null ? List.of() : request.fields());
        persistNextVersion(
                current,
                next,
                sectionKey,
                request == null ? null : request.adminUserId(),
                firstNonBlank(request == null ? null : request.summary(), "Updated " + labelFor(sectionKey) + " parameters."));
        return state(request == null ? null : request.adminUserId());
    }

    public AdminParamsStateDto revert(String sectionKey, AdminParamsRevertRequestDto request) {
        SectionDefinition section = section(sectionKey);
        Integer selectedVersion = request == null ? null : request.version();
        if (selectedVersion == null || selectedVersion <= 0) {
            return state(request == null ? null : request.adminUserId());
        }
        AffinityConfig current = activeConfig();
        Optional<AffinityConfig> selected = affinityConfigsRepository.findByKeyAndVersion(current.getKey(), selectedVersion);
        if (selected.isEmpty()) {
            return state(request == null ? null : request.adminUserId());
        }
        AffinityConfig next = cloneConfig(current);
        copySection(section.key(), selected.get(), next);
        persistNextVersion(
                current,
                next,
                section.key(),
                request == null ? null : request.adminUserId(),
                "Reverted " + section.label() + " parameters to version " + selectedVersion + ".");
        return state(request == null ? null : request.adminUserId());
    }

    private AdminParamsSectionDto sectionDto(
            SectionDefinition section,
            AffinityConfig active,
            List<AffinityConfig> versions) {
        AffinityConfig metadata = versions.stream()
                .filter(config -> section.key().equals(safeText(config.getChangedSection())))
                .findFirst()
                .orElse(active);
        return new AdminParamsSectionDto(
                section.key(),
                section.label(),
                safeVersion(metadata),
                changedDate(metadata),
                firstNonBlank(metadata.getChangedUser(), "system"),
                summaryFor(metadata, section.key()),
                fieldsFor(section.key(), active));
    }

    private List<AdminParamFieldDto> fieldsFor(String sectionKey, AffinityConfig config) {
        AffinityConfig safeConfig = config == null ? AffinityConfig.defaults() : config;
        return switch (sectionKey) {
            case "matching" -> matchingFields(safeConfig);
            case "profile" -> profileFields(safeConfig);
            case "events" -> eventFields(safeConfig);
            case "assets" -> assetFields(safeConfig);
            case "discovery" -> discoveryFields(safeConfig);
            case "notifications" -> notificationFields(safeConfig);
            case "jobs" -> jobFields(safeConfig);
            default -> List.of();
        };
    }

    private List<AdminParamFieldDto> matchingFields(AffinityConfig config) {
        return List.of(
                field("rating.singleMutual", "Single mutual", "Ratings", multiplier(config.getRating().getSingleMutual()), "x"),
                field("rating.singleOneSided", "Single one-sided", "Ratings", multiplier(config.getRating().getSingleOneSided()), "x"),
                field("rating.pairOutsideNetwork", "Pair outside network", "Ratings", multiplier(config.getRating().getPairOutsideNetwork()), "x"),
                field("rating.pairInsideNetwork", "Pair inside network", "Ratings", multiplier(config.getRating().getPairInsideNetwork()), "x"),
                field("evidence.mutualSingle", "Mutual single", "Evidence", multiplier(config.getEvidence().getMutualSingle()), "x"),
                field("evidence.singleOneSided", "Single one-sided", "Evidence", multiplier(config.getEvidence().getSingleOneSided()), "x"),
                field("evidence.pairOutsideNetwork", "Pair outside network", "Evidence", multiplier(config.getEvidence().getPairOutsideNetwork()), "x"),
                field("evidence.pairInsideNetwork", "Pair inside network", "Evidence", multiplier(config.getEvidence().getPairInsideNetwork()), "x"),
                field("evidence.met", "Met in person", "Evidence", multiplier(config.getEvidence().getMet()), "x"),
                field("ownerContext", "Owner context", "Network", multiplier(config.getOwnerContext()), "x"));
    }

    private List<AdminParamFieldDto> profileFields(AffinityConfig config) {
        List<AdminParamFieldDto> fields = new ArrayList<>();
        addRuleFields(fields, "profileRules", "Profile fields", config.getProfileRules());
        addRuleFields(fields, "impressionRules", "Traits", config.getImpressionRules());
        AffinityConfig.AbsoluteUserAffinityMultipliers user = config.getAbsolute().getUser();
        fields.add(field("absolute.user.profileTokens", "Profile tokens", "Absolute user", multiplier(user.getProfileTokens()), "pts"));
        fields.add(field("absolute.user.profileDetailTokens", "Detail tokens", "Absolute user", multiplier(user.getProfileDetailTokens()), "pts"));
        fields.add(field("absolute.user.experienceTokens", "Experience tokens", "Absolute user", multiplier(user.getExperienceTokens()), "pts"));
        fields.add(field("absolute.user.impressionTokens", "Impression tokens", "Absolute user", multiplier(user.getImpressionTokens()), "pts"));
        fields.add(field("absolute.user.age", "Age", "Absolute user", multiplier(user.getAge()), "pts"));
        fields.add(field("absolute.user.height", "Height", "Absolute user", multiplier(user.getHeight()), "pts"));
        fields.add(field("absolute.user.completion", "Completion", "Absolute user", multiplier(user.getCompletion()), "pts"));
        fields.add(field("absolute.user.impressionAverageRating", "Average rating", "Impressions", multiplier(user.getImpressionAverageRating()), "pts"));
        fields.add(field("absolute.user.impressionPeopleMet", "People met", "Impressions", multiplier(user.getImpressionPeopleMet()), "pts"));
        fields.add(field("absolute.user.impressionTotalEvents", "Total events", "Impressions", multiplier(user.getImpressionTotalEvents()), "pts"));
        fields.add(field("absolute.user.impressionRepeatCount", "Repeat count", "Impressions", multiplier(user.getImpressionRepeatCount()), "pts"));
        fields.add(field("absolute.user.impressionNoShowPenalty", "No-show penalty", "Impressions", multiplier(user.getImpressionNoShowPenalty()), "pts"));
        fields.add(field("absolute.user.impressionTraitPercent", "Trait percent", "Traits", multiplier(user.getImpressionTraitPercent()), "pts"));
        fields.add(field("absolute.user.impressionTraitEvidenceCount", "Trait evidence", "Traits", multiplier(user.getImpressionTraitEvidenceCount()), "pts"));
        return fields;
    }

    private List<AdminParamFieldDto> eventFields(AffinityConfig config) {
        AffinityConfig.AbsoluteEventAffinityMultipliers absolute = config.getAbsolute().getEvent();
        AffinityConfig.EventBoostMultipliers boost = config.getBoost().getEvent();
        return List.of(
                field("absolute.event.contentTokens", "Content tokens", "Affinity", multiplier(absolute.getContentTokens()), "pts"),
                field("absolute.event.participantAffinity", "Participant affinity", "Affinity", multiplier(absolute.getParticipantAffinity()), "x"),
                field("boost.event.rating", "Rating", "Boost", multiplier(boost.getRating()), "pts"),
                field("boost.event.acceptedMembers", "Accepted members", "Boost", multiplier(boost.getAcceptedMembers()), "pts"),
                field("boost.event.pendingMembers", "Pending members", "Boost", multiplier(boost.getPendingMembers()), "pts"),
                field("boost.event.capacityAvailable", "Capacity available", "Boost", multiplier(boost.getCapacityAvailable()), "pts"),
                field("boost.event.freshness", "Freshness", "Boost", multiplier(boost.getFreshness()), "pts"),
                field("boost.event.hostConfidence", "Host confidence", "Boost", multiplier(boost.getHostConfidence()), "x"));
    }

    private List<AdminParamFieldDto> assetFields(AffinityConfig config) {
        AffinityConfig.AbsoluteAssetAffinityMultipliers absolute = config.getAbsolute().getAsset();
        AffinityConfig.AssetBoostMultipliers boost = config.getBoost().getAsset();
        return List.of(
                field("absolute.asset.contentTokens", "Content tokens", "Affinity", multiplier(absolute.getContentTokens()), "pts"),
                field("absolute.asset.ownerAffinity", "Owner affinity", "Affinity", multiplier(absolute.getOwnerAffinity()), "x"),
                field("boost.asset.capacityAvailable", "Capacity available", "Boost", multiplier(boost.getCapacityAvailable()), "pts"),
                field("boost.asset.quantity", "Quantity", "Boost", multiplier(boost.getQuantity()), "pts"),
                field("boost.asset.requestCount", "Request count", "Boost", multiplier(boost.getRequestCount()), "pts"),
                field("boost.asset.freshness", "Freshness", "Boost", multiplier(boost.getFreshness()), "pts"),
                field("boost.asset.ownerConfidence", "Owner confidence", "Boost", multiplier(boost.getOwnerConfidence()), "x"));
    }

    private List<AdminParamFieldDto> discoveryFields(AffinityConfig config) {
        return List.of(
                field("distance.multiplier", "Distance multiplier", "Distance", multiplier(config.getDistance()), "pts"),
                field("distance.maxMeters", "Max distance", "Distance", number(config.getDistance().getMaxMeters()), "m"),
                textField("distance.strategy", "Distance strategy", "Distance", config.getDistance().getStrategy(), config.getDistance().getStrategy()));
    }

    private List<AdminParamFieldDto> notificationFields(AffinityConfig config) {
        AffinityConfig.NotificationParameters notifications = config.getNotifications();
        return List.of(
                field("notifications.firebaseWindowStartHour", "Window start", "Firebase", number(notifications.getFirebaseWindowStartHour()), "h"),
                field("notifications.firebaseWindowEndHour", "Window end", "Firebase", number(notifications.getFirebaseWindowEndHour()), "h"),
                field("notifications.maxWorkers", "Max workers", "Delivery", number(notifications.getMaxWorkers()), ""),
                field("notifications.maxRetries", "Max retries", "Retry", number(notifications.getMaxRetries()), ""),
                field("notifications.initialBackoffSeconds", "Initial backoff", "Retry", number(notifications.getInitialBackoffSeconds()), "s"),
                field("notifications.collapseWindowSeconds", "Collapse window", "Collapse", number(notifications.getCollapseWindowSeconds()), "s"),
                field("notifications.multicastThreshold", "Multicast threshold", "Delivery", number(notifications.getMulticastThreshold()), ""),
                field("notifications.topicThreshold", "Topic threshold", "Delivery", number(notifications.getTopicThreshold()), ""));
    }

    private List<AdminParamFieldDto> jobFields(AffinityConfig config) {
        AffinityConfig.JobParameters jobs = config.getJobs();
        return List.of(
                field("jobs.userChangedDebounceSeconds", "User debounce", "Debounce", number(jobs.getUserChangedDebounceSeconds()), "s"),
                field("jobs.eventChangedDebounceSeconds", "Event debounce", "Debounce", number(jobs.getEventChangedDebounceSeconds()), "s"),
                field("jobs.eventMembersChangedDebounceSeconds", "Members debounce", "Debounce", number(jobs.getEventMembersChangedDebounceSeconds()), "s"),
                field("jobs.assetChangedDebounceSeconds", "Asset debounce", "Debounce", number(jobs.getAssetChangedDebounceSeconds()), "s"),
                field("jobs.assetRequestsChangedDebounceSeconds", "Requests debounce", "Debounce", number(jobs.getAssetRequestsChangedDebounceSeconds()), "s"),
                field("jobs.configChangedDebounceSeconds", "Config debounce", "Debounce", number(jobs.getConfigChangedDebounceSeconds()), "s"),
                field("jobs.workerPollDelayMs", "Worker poll delay", "Worker", number(jobs.getWorkerPollDelayMs()), "ms"),
                field("jobs.batchSize", "Batch size", "Worker", number(jobs.getBatchSize()), ""),
                field("jobs.leaseDurationSeconds", "Lease duration", "Worker", number(jobs.getLeaseDurationSeconds()), "s"));
    }

    private void applySection(String sectionKey, AffinityConfig config, Collection<AdminParamFieldDto> fields) {
        Map<String, AdminParamFieldDto> byKey = indexFields(fields);
        switch (sectionKey) {
            case "matching" -> applyMatching(config, byKey);
            case "profile" -> applyProfile(config, byKey);
            case "events" -> applyEvents(config, byKey);
            case "assets" -> applyAssets(config, byKey);
            case "discovery" -> applyDiscovery(config, byKey);
            case "notifications" -> applyNotifications(config, byKey);
            case "jobs" -> applyJobs(config, byKey);
            default -> {
            }
        }
    }

    private void applyMatching(AffinityConfig config, Map<String, AdminParamFieldDto> fields) {
        setMultiplier(config.getRating().getSingleMutual(), fields.get("rating.singleMutual"));
        setMultiplier(config.getRating().getSingleOneSided(), fields.get("rating.singleOneSided"));
        setMultiplier(config.getRating().getPairOutsideNetwork(), fields.get("rating.pairOutsideNetwork"));
        setMultiplier(config.getRating().getPairInsideNetwork(), fields.get("rating.pairInsideNetwork"));
        setMultiplier(config.getEvidence().getMutualSingle(), fields.get("evidence.mutualSingle"));
        setMultiplier(config.getEvidence().getSingleOneSided(), fields.get("evidence.singleOneSided"));
        setMultiplier(config.getEvidence().getPairOutsideNetwork(), fields.get("evidence.pairOutsideNetwork"));
        setMultiplier(config.getEvidence().getPairInsideNetwork(), fields.get("evidence.pairInsideNetwork"));
        setMultiplier(config.getEvidence().getMet(), fields.get("evidence.met"));
        setMultiplier(config.getOwnerContext(), fields.get("ownerContext"));
    }

    private void applyProfile(AffinityConfig config, Map<String, AdminParamFieldDto> fields) {
        applyRuleFields(config.getProfileRules(), "profileRules", fields);
        applyRuleFields(config.getImpressionRules(), "impressionRules", fields);
        AffinityConfig.AbsoluteUserAffinityMultipliers user = config.getAbsolute().getUser();
        setMultiplier(user.getProfileTokens(), fields.get("absolute.user.profileTokens"));
        setMultiplier(user.getProfileDetailTokens(), fields.get("absolute.user.profileDetailTokens"));
        setMultiplier(user.getExperienceTokens(), fields.get("absolute.user.experienceTokens"));
        setMultiplier(user.getImpressionTokens(), fields.get("absolute.user.impressionTokens"));
        setMultiplier(user.getAge(), fields.get("absolute.user.age"));
        setMultiplier(user.getHeight(), fields.get("absolute.user.height"));
        setMultiplier(user.getCompletion(), fields.get("absolute.user.completion"));
        setMultiplier(user.getImpressionAverageRating(), fields.get("absolute.user.impressionAverageRating"));
        setMultiplier(user.getImpressionPeopleMet(), fields.get("absolute.user.impressionPeopleMet"));
        setMultiplier(user.getImpressionTotalEvents(), fields.get("absolute.user.impressionTotalEvents"));
        setMultiplier(user.getImpressionRepeatCount(), fields.get("absolute.user.impressionRepeatCount"));
        setMultiplier(user.getImpressionNoShowPenalty(), fields.get("absolute.user.impressionNoShowPenalty"));
        setMultiplier(user.getImpressionTraitPercent(), fields.get("absolute.user.impressionTraitPercent"));
        setMultiplier(user.getImpressionTraitEvidenceCount(), fields.get("absolute.user.impressionTraitEvidenceCount"));
    }

    private void applyEvents(AffinityConfig config, Map<String, AdminParamFieldDto> fields) {
        AffinityConfig.AbsoluteEventAffinityMultipliers absolute = config.getAbsolute().getEvent();
        AffinityConfig.EventBoostMultipliers boost = config.getBoost().getEvent();
        setMultiplier(absolute.getContentTokens(), fields.get("absolute.event.contentTokens"));
        setMultiplier(absolute.getParticipantAffinity(), fields.get("absolute.event.participantAffinity"));
        setMultiplier(boost.getRating(), fields.get("boost.event.rating"));
        setMultiplier(boost.getAcceptedMembers(), fields.get("boost.event.acceptedMembers"));
        setMultiplier(boost.getPendingMembers(), fields.get("boost.event.pendingMembers"));
        setMultiplier(boost.getCapacityAvailable(), fields.get("boost.event.capacityAvailable"));
        setMultiplier(boost.getFreshness(), fields.get("boost.event.freshness"));
        setMultiplier(boost.getHostConfidence(), fields.get("boost.event.hostConfidence"));
    }

    private void applyAssets(AffinityConfig config, Map<String, AdminParamFieldDto> fields) {
        AffinityConfig.AbsoluteAssetAffinityMultipliers absolute = config.getAbsolute().getAsset();
        AffinityConfig.AssetBoostMultipliers boost = config.getBoost().getAsset();
        setMultiplier(absolute.getContentTokens(), fields.get("absolute.asset.contentTokens"));
        setMultiplier(absolute.getOwnerAffinity(), fields.get("absolute.asset.ownerAffinity"));
        setMultiplier(boost.getCapacityAvailable(), fields.get("boost.asset.capacityAvailable"));
        setMultiplier(boost.getQuantity(), fields.get("boost.asset.quantity"));
        setMultiplier(boost.getRequestCount(), fields.get("boost.asset.requestCount"));
        setMultiplier(boost.getFreshness(), fields.get("boost.asset.freshness"));
        setMultiplier(boost.getOwnerConfidence(), fields.get("boost.asset.ownerConfidence"));
    }

    private void applyDiscovery(AffinityConfig config, Map<String, AdminParamFieldDto> fields) {
        setMultiplier(config.getDistance(), fields.get("distance.multiplier"));
        readInteger(fields.get("distance.maxMeters"), 0, 1_000_000).ifPresent(config.getDistance()::setMaxMeters);
        String strategy = safeText(fieldText(fields.get("distance.strategy")));
        if (StringUtils.hasText(strategy)) {
            config.getDistance().setStrategy(strategy);
        }
    }

    private void applyNotifications(AffinityConfig config, Map<String, AdminParamFieldDto> fields) {
        AffinityConfig.NotificationParameters notifications = config.getNotifications();
        readInteger(fields.get("notifications.firebaseWindowStartHour"), 0, 23).ifPresent(notifications::setFirebaseWindowStartHour);
        readInteger(fields.get("notifications.firebaseWindowEndHour"), 0, 23).ifPresent(notifications::setFirebaseWindowEndHour);
        readInteger(fields.get("notifications.maxWorkers"), 1, 64).ifPresent(notifications::setMaxWorkers);
        readInteger(fields.get("notifications.maxRetries"), 0, 20).ifPresent(notifications::setMaxRetries);
        readInteger(fields.get("notifications.initialBackoffSeconds"), 1, 86400).ifPresent(notifications::setInitialBackoffSeconds);
        readInteger(fields.get("notifications.collapseWindowSeconds"), 0, 86400).ifPresent(notifications::setCollapseWindowSeconds);
        readInteger(fields.get("notifications.multicastThreshold"), 1, 1000).ifPresent(notifications::setMulticastThreshold);
        readInteger(fields.get("notifications.topicThreshold"), 1, 1000000).ifPresent(notifications::setTopicThreshold);
        config.setNotifications(notifications);
    }

    private void applyJobs(AffinityConfig config, Map<String, AdminParamFieldDto> fields) {
        AffinityConfig.JobParameters jobs = config.getJobs();
        readInteger(fields.get("jobs.userChangedDebounceSeconds"), 0, 86400).ifPresent(jobs::setUserChangedDebounceSeconds);
        readInteger(fields.get("jobs.eventChangedDebounceSeconds"), 0, 86400).ifPresent(jobs::setEventChangedDebounceSeconds);
        readInteger(fields.get("jobs.eventMembersChangedDebounceSeconds"), 0, 86400).ifPresent(jobs::setEventMembersChangedDebounceSeconds);
        readInteger(fields.get("jobs.assetChangedDebounceSeconds"), 0, 86400).ifPresent(jobs::setAssetChangedDebounceSeconds);
        readInteger(fields.get("jobs.assetRequestsChangedDebounceSeconds"), 0, 86400).ifPresent(jobs::setAssetRequestsChangedDebounceSeconds);
        readInteger(fields.get("jobs.configChangedDebounceSeconds"), 0, 86400).ifPresent(jobs::setConfigChangedDebounceSeconds);
        readInteger(fields.get("jobs.workerPollDelayMs"), 100, 3600000).ifPresent(jobs::setWorkerPollDelayMs);
        readInteger(fields.get("jobs.batchSize"), 1, 10000).ifPresent(jobs::setBatchSize);
        readInteger(fields.get("jobs.leaseDurationSeconds"), 1, 86400).ifPresent(jobs::setLeaseDurationSeconds);
        config.setJobs(jobs);
    }

    private void copySection(String sectionKey, AffinityConfig source, AffinityConfig target) {
        switch (sectionKey) {
            case "matching" -> {
                target.setRating(cloneValue(source.getRating(), AffinityConfig.RatingMultipliers.class));
                target.setEvidence(cloneValue(source.getEvidence(), AffinityConfig.EvidenceMultipliers.class));
                target.setOwnerContext(cloneValue(source.getOwnerContext(), AffinityConfig.MultiplierRule.class));
            }
            case "profile" -> {
                target.setProfileRules(cloneList(source.getProfileRules(), AffinityConfig.FieldRule.class));
                target.setImpressionRules(cloneList(source.getImpressionRules(), AffinityConfig.FieldRule.class));
                AffinityConfig.AbsoluteAffinityMultipliers absolute = target.getAbsolute();
                absolute.setUser(cloneValue(source.getAbsolute().getUser(), AffinityConfig.AbsoluteUserAffinityMultipliers.class));
                target.setAbsolute(absolute);
            }
            case "events" -> {
                AffinityConfig.AbsoluteAffinityMultipliers absolute = target.getAbsolute();
                absolute.setEvent(cloneValue(source.getAbsolute().getEvent(), AffinityConfig.AbsoluteEventAffinityMultipliers.class));
                target.setAbsolute(absolute);
                AffinityConfig.BoostMultipliers boost = target.getBoost();
                boost.setEvent(cloneValue(source.getBoost().getEvent(), AffinityConfig.EventBoostMultipliers.class));
                target.setBoost(boost);
            }
            case "assets" -> {
                AffinityConfig.AbsoluteAffinityMultipliers absolute = target.getAbsolute();
                absolute.setAsset(cloneValue(source.getAbsolute().getAsset(), AffinityConfig.AbsoluteAssetAffinityMultipliers.class));
                target.setAbsolute(absolute);
                AffinityConfig.BoostMultipliers boost = target.getBoost();
                boost.setAsset(cloneValue(source.getBoost().getAsset(), AffinityConfig.AssetBoostMultipliers.class));
                target.setBoost(boost);
            }
            case "discovery" -> target.setDistance(cloneValue(source.getDistance(), AffinityConfig.DistanceRule.class));
            case "notifications" -> target.setNotifications(cloneValue(source.getNotifications(), AffinityConfig.NotificationParameters.class));
            case "jobs" -> target.setJobs(cloneValue(source.getJobs(), AffinityConfig.JobParameters.class));
            default -> {
            }
        }
    }

    private void persistNextVersion(
            AffinityConfig current,
            AffinityConfig next,
            String sectionKey,
            String actorUserId,
            String summary) {
        String key = firstNonBlank(current == null ? null : current.getKey(), CONFIG_KEY);
        String nowIso = Instant.now().toString();
        for (AffinityConfig active : affinityConfigsRepository.findByActiveTrue()) {
            active.setActive(false);
            affinityConfigsRepository.save(active);
        }
        next.setId(null);
        next.setKey(key);
        next.setActive(true);
        next.setVersion(nextVersion(key));
        next.setChangedDate(nowIso);
        next.setChangedUser(firstNonBlank(actorUserId, "system"));
        next.setChangedSection(sectionKey);
        next.setChangeSummary(summary);
        AffinityConfig saved = affinityConfigsRepository.save(next);
        notifyAdminParameterChange(saved, sectionKey, actorUserId, summary);
    }

    private void notifyAdminParameterChange(AffinityConfig config, String sectionKey, String actorUserId, String summary) {
        String normalizedActorUserId = safeText(actorUserId);
        if (!StringUtils.hasText(normalizedActorUserId)) {
            return;
        }
        String label = labelFor(sectionKey);
        String version = String.valueOf(safeVersion(config));
        notificationOutboxService.enqueue(new NotificationIntent(
                "admin-params-changed",
                "config",
                firstNonBlank(config == null ? null : config.getKey(), CONFIG_KEY) + ":" + safeText(sectionKey),
                "admins",
                List.of(normalizedActorUserId),
                "Platform parameters changed",
                label + " parameters saved. Recompute tasks were queued.",
                "/admin",
                "/assets/logo/heart.webp",
                "/assets/logo/heart.webp",
                "admin-params-" + safeText(sectionKey),
                Map.of(
                        "sectionKey", safeText(sectionKey),
                        "sectionLabel", label,
                        "version", version,
                        "summary", safeText(summary),
                        "recomputeScope", "config"),
                normalizedActorUserId));
    }

    private AffinityConfig activeConfig() {
        AffinityConfig config = affinityConfigsRepository.findFirstByActiveTrueOrderByVersionDesc()
                .or(() -> affinityConfigsRepository.findFirstByKeyOrderByVersionDesc(CONFIG_KEY))
                .map(this::cloneConfig)
                .orElseGet(AffinityConfig::defaults);
        if (!StringUtils.hasText(config.getKey())) {
            config.setKey(CONFIG_KEY);
        }
        if (config.getVersion() == null || config.getVersion() <= 0) {
            config.setVersion(1);
        }
        return config;
    }

    private List<AffinityConfig> configHistory(String key) {
        String normalizedKey = firstNonBlank(key, CONFIG_KEY);
        List<AffinityConfig> versions = affinityConfigsRepository.findByKeyOrderByVersionDesc(normalizedKey);
        if (versions == null || versions.isEmpty()) {
            return List.of(activeConfig());
        }
        return versions.stream().map(this::cloneConfig).toList();
    }

    private int nextVersion(String key) {
        return affinityConfigsRepository.findFirstByKeyOrderByVersionDesc(firstNonBlank(key, CONFIG_KEY))
                .map(AffinityConfig::getVersion)
                .filter(version -> version != null && version > 0)
                .orElse(0) + 1;
    }

    private void addRuleFields(
            List<AdminParamFieldDto> fields,
            String prefix,
            String group,
            List<AffinityConfig.FieldRule> rules) {
        List<AffinityConfig.FieldRule> safeRules = rules == null ? List.of() : rules;
        for (int index = 0; index < safeRules.size(); index += 1) {
            AffinityConfig.FieldRule rule = safeRules.get(index);
            fields.add(field(
                    prefix + "." + index,
                    firstNonBlank(rule.getLabelKey(), rule.getField(), "Rule " + (index + 1)),
                    firstNonBlank(rule.getGroup(), group),
                    multiplier(rule),
                    "x",
                    rule.getStrategy()));
        }
    }

    private void applyRuleFields(
            List<AffinityConfig.FieldRule> rules,
            String prefix,
            Map<String, AdminParamFieldDto> fields) {
        if (rules == null || rules.isEmpty()) {
            return;
        }
        for (int index = 0; index < rules.size(); index += 1) {
            setMultiplier(rules.get(index), fields.get(prefix + "." + index));
        }
    }

    private AdminParamFieldDto field(String key, String label, String group, Double value, String unit) {
        return field(key, label, group, value, unit, "");
    }

    private AdminParamFieldDto field(String key, String label, String group, Double value, String unit, String strategy) {
        return new AdminParamFieldDto(key, label, group, "number", value, null, unit, strategy);
    }

    private AdminParamFieldDto textField(String key, String label, String group, String value, String strategy) {
        return new AdminParamFieldDto(key, label, group, "text", null, value, null, strategy);
    }

    private Map<String, AdminParamFieldDto> indexFields(Collection<AdminParamFieldDto> fields) {
        LinkedHashMap<String, AdminParamFieldDto> result = new LinkedHashMap<>();
        for (AdminParamFieldDto field : fields == null ? List.<AdminParamFieldDto>of() : fields) {
            String key = safeText(field == null ? null : field.key());
            if (StringUtils.hasText(key)) {
                result.put(key, field);
            }
        }
        return result;
    }

    private void setMultiplier(AffinityConfig.MultiplierRule rule, AdminParamFieldDto field) {
        if (rule == null || field == null || field.numberValue() == null || !Double.isFinite(field.numberValue())) {
            return;
        }
        rule.setMultiplier(field.numberValue());
    }

    private Optional<Integer> readInteger(AdminParamFieldDto field, int min, int max) {
        if (field == null || field.numberValue() == null || !Double.isFinite(field.numberValue())) {
            return Optional.empty();
        }
        int value = (int) Math.round(field.numberValue());
        return Optional.of(Math.max(min, Math.min(max, value)));
    }

    private String fieldText(AdminParamFieldDto field) {
        return field == null ? "" : field.textValue();
    }

    private Double multiplier(AffinityConfig.MultiplierRule rule) {
        return rule == null ? null : rule.getMultiplier();
    }

    private Double number(Integer value) {
        return value == null ? null : value.doubleValue();
    }

    private int safeVersion(AffinityConfig config) {
        return config == null || config.getVersion() == null || config.getVersion() <= 0 ? 1 : config.getVersion();
    }

    private String changedDate(AffinityConfig config) {
        return firstNonBlank(config == null ? null : config.getChangedDate(), Instant.now().toString());
    }

    private String summaryFor(AffinityConfig config, String sectionKey) {
        String summary = safeText(config == null ? null : config.getChangeSummary());
        if (StringUtils.hasText(summary)) {
            return summary;
        }
        if (config != null && sectionKey.equals(safeText(config.getChangedSection()))) {
            return "Updated " + labelFor(sectionKey) + " parameters.";
        }
        return "Config version " + safeVersion(config) + ".";
    }

    private SectionDefinition section(String value) {
        String normalized = safeText(value).toLowerCase();
        return SECTIONS.stream()
                .filter(section -> section.key().equals(normalized))
                .findFirst()
                .orElse(SECTIONS.get(0));
    }

    private String labelFor(String sectionKey) {
        return section(sectionKey).label();
    }

    private AffinityConfig cloneConfig(AffinityConfig config) {
        return cloneValue(config == null ? AffinityConfig.defaults() : config, AffinityConfig.class);
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

    private String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record SectionDefinition(String key, String label) {
    }
}
