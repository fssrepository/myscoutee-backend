package com.raxim.myscoutee.common.config.properties;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("affinity.recompute")
public class AffinityRecomputeProperties {
    private boolean enabled = true;
    private int dueTaskLimit = 50;
    private Duration leaseDuration = Duration.ofMinutes(10);
    private Duration defaultDebounce = Duration.ofMinutes(5);
    private Duration userChangedDebounce = Duration.ofMinutes(5);
    private Duration eventChangedDebounce = Duration.ofMinutes(3);
    private Duration eventMembersChangedDebounce = Duration.ofMinutes(5);
    private Duration assetChangedDebounce = Duration.ofMinutes(3);
    private Duration assetRequestsChangedDebounce = Duration.ofMinutes(3);
    private Duration adminStatusChangedDebounce = Duration.ofMinutes(1);
    private Duration configChangedDebounce = Duration.ofMinutes(15);
    private boolean changeStreamEnabled = false;
    private boolean changeStreamFallbackPollEnabled = true;
    private Duration changeStreamWakeupCoalesce = Duration.ofMillis(250);
    private Duration changeStreamReconnectDelay = Duration.ofSeconds(5);

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getDueTaskLimit() {
        return dueTaskLimit;
    }

    public void setDueTaskLimit(int dueTaskLimit) {
        this.dueTaskLimit = dueTaskLimit;
    }

    public Duration getLeaseDuration() {
        return leaseDuration;
    }

    public void setLeaseDuration(Duration leaseDuration) {
        this.leaseDuration = leaseDuration == null ? Duration.ofMinutes(10) : leaseDuration;
    }

    public Duration getDefaultDebounce() {
        return defaultDebounce;
    }

    public void setDefaultDebounce(Duration defaultDebounce) {
        this.defaultDebounce = defaultDebounce == null ? Duration.ofMinutes(5) : defaultDebounce;
    }

    public Duration getUserChangedDebounce() {
        return userChangedDebounce;
    }

    public void setUserChangedDebounce(Duration userChangedDebounce) {
        this.userChangedDebounce = userChangedDebounce == null ? Duration.ofMinutes(5) : userChangedDebounce;
    }

    public Duration getEventChangedDebounce() {
        return eventChangedDebounce;
    }

    public void setEventChangedDebounce(Duration eventChangedDebounce) {
        this.eventChangedDebounce = eventChangedDebounce == null ? Duration.ofMinutes(3) : eventChangedDebounce;
    }

    public Duration getEventMembersChangedDebounce() {
        return eventMembersChangedDebounce;
    }

    public void setEventMembersChangedDebounce(Duration eventMembersChangedDebounce) {
        this.eventMembersChangedDebounce = eventMembersChangedDebounce == null ? Duration.ofMinutes(5) : eventMembersChangedDebounce;
    }

    public Duration getAssetChangedDebounce() {
        return assetChangedDebounce;
    }

    public void setAssetChangedDebounce(Duration assetChangedDebounce) {
        this.assetChangedDebounce = assetChangedDebounce == null ? Duration.ofMinutes(3) : assetChangedDebounce;
    }

    public Duration getAssetRequestsChangedDebounce() {
        return assetRequestsChangedDebounce;
    }

    public void setAssetRequestsChangedDebounce(Duration assetRequestsChangedDebounce) {
        this.assetRequestsChangedDebounce = assetRequestsChangedDebounce == null ? Duration.ofMinutes(3) : assetRequestsChangedDebounce;
    }

    public Duration getAdminStatusChangedDebounce() {
        return adminStatusChangedDebounce;
    }

    public void setAdminStatusChangedDebounce(Duration adminStatusChangedDebounce) {
        this.adminStatusChangedDebounce = adminStatusChangedDebounce == null ? Duration.ofMinutes(1) : adminStatusChangedDebounce;
    }

    public Duration getConfigChangedDebounce() {
        return configChangedDebounce;
    }

    public void setConfigChangedDebounce(Duration configChangedDebounce) {
        this.configChangedDebounce = configChangedDebounce == null ? Duration.ofMinutes(15) : configChangedDebounce;
    }

    public boolean isChangeStreamEnabled() {
        return changeStreamEnabled;
    }

    public void setChangeStreamEnabled(boolean changeStreamEnabled) {
        this.changeStreamEnabled = changeStreamEnabled;
    }

    public boolean isChangeStreamFallbackPollEnabled() {
        return changeStreamFallbackPollEnabled;
    }

    public void setChangeStreamFallbackPollEnabled(boolean changeStreamFallbackPollEnabled) {
        this.changeStreamFallbackPollEnabled = changeStreamFallbackPollEnabled;
    }

    public Duration getChangeStreamWakeupCoalesce() {
        return changeStreamWakeupCoalesce;
    }

    public void setChangeStreamWakeupCoalesce(Duration changeStreamWakeupCoalesce) {
        this.changeStreamWakeupCoalesce = changeStreamWakeupCoalesce == null
                ? Duration.ofMillis(250)
                : changeStreamWakeupCoalesce;
    }

    public Duration getChangeStreamReconnectDelay() {
        return changeStreamReconnectDelay;
    }

    public void setChangeStreamReconnectDelay(Duration changeStreamReconnectDelay) {
        this.changeStreamReconnectDelay = changeStreamReconnectDelay == null
                ? Duration.ofSeconds(5)
                : changeStreamReconnectDelay;
    }
}
