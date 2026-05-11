package com.raxim.myscoutee.profile.service;

import java.time.Duration;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;

@Service
public class PlatformParametersService {
    private static final String CONFIG_KEY = "default";

    private final AffinityConfigsRepository affinityConfigsRepository;

    public PlatformParametersService(AffinityConfigsRepository affinityConfigsRepository) {
        this.affinityConfigsRepository = affinityConfigsRepository;
    }

    public AffinityConfig activeConfig() {
        return affinityConfigsRepository.findFirstByActiveTrueOrderByVersionDesc()
                .or(() -> affinityConfigsRepository.findFirstByKeyOrderByVersionDesc(CONFIG_KEY))
                .orElseGet(AffinityConfig::defaults);
    }

    public AffinityConfig.NotificationParameters notifications() {
        return activeConfig().getNotifications();
    }

    public AffinityConfig.JobParameters jobs() {
        return activeConfig().getJobs();
    }

    public int notificationWindowStartHour(int fallback) {
        return clampInt(notifications().getFirebaseWindowStartHour(), 0, 23, fallback);
    }

    public int notificationWindowEndHour(int fallback) {
        return clampInt(notifications().getFirebaseWindowEndHour(), 0, 24, fallback);
    }

    public int notificationMaxWorkers(int fallback) {
        return clampInt(notifications().getMaxWorkers(), 1, 64, fallback);
    }

    public int notificationMaxRetries(int fallback) {
        return clampInt(notifications().getMaxRetries(), 0, 20, fallback);
    }

    public Duration notificationInitialBackoff(Duration fallback) {
        return seconds(notifications().getInitialBackoffSeconds(), fallback, 1, 86_400);
    }

    public int notificationCollapseWindowSeconds(int fallback) {
        return clampInt(notifications().getCollapseWindowSeconds(), 0, 86_400, fallback);
    }

    public int notificationTopicThreshold(int fallback) {
        return clampInt(notifications().getTopicThreshold(), 1, 1_000_000, fallback);
    }

    public int notificationMulticastThreshold(int fallback) {
        return clampInt(notifications().getMulticastThreshold(), 1, 1000, fallback);
    }

    public long jobWorkerPollDelayMs(long fallback) {
        Integer value = jobs().getWorkerPollDelayMs();
        if (value == null || value < 100 || value > 3_600_000) {
            return fallback;
        }
        return value.longValue();
    }

    public int jobBatchSize(int fallback) {
        return clampInt(jobs().getBatchSize(), 1, 10_000, fallback);
    }

    public Duration jobLeaseDuration(Duration fallback) {
        return seconds(jobs().getLeaseDurationSeconds(), fallback, 1, 86_400);
    }

    public Duration userChangedDebounce(Duration fallback) {
        return seconds(jobs().getUserChangedDebounceSeconds(), fallback, 0, 86_400);
    }

    public Duration eventChangedDebounce(Duration fallback) {
        return seconds(jobs().getEventChangedDebounceSeconds(), fallback, 0, 86_400);
    }

    public Duration eventMembersChangedDebounce(Duration fallback) {
        return seconds(jobs().getEventMembersChangedDebounceSeconds(), fallback, 0, 86_400);
    }

    public Duration assetChangedDebounce(Duration fallback) {
        return seconds(jobs().getAssetChangedDebounceSeconds(), fallback, 0, 86_400);
    }

    public Duration assetRequestsChangedDebounce(Duration fallback) {
        return seconds(jobs().getAssetRequestsChangedDebounceSeconds(), fallback, 0, 86_400);
    }

    public Duration configChangedDebounce(Duration fallback) {
        return seconds(jobs().getConfigChangedDebounceSeconds(), fallback, 0, 86_400);
    }

    private Duration seconds(Integer value, Duration fallback, int min, int max) {
        int normalized = clampInt(value, min, max, (int) Math.max(0, (fallback == null ? Duration.ZERO : fallback).toSeconds()));
        return Duration.ofSeconds(normalized);
    }

    private int clampInt(Integer value, int min, int max, int fallback) {
        if (value == null || value < min || value > max) {
            return Math.max(min, Math.min(max, fallback));
        }
        return value;
    }
}
