package com.raxim.myscoutee.common.config.properties;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties("config")
public class ConfigProperties {
    private String adminUser;
    private String firebaseServiceAccountPath;
    private boolean firebaseEnabled = false;
    private boolean chatOnlyMode = false;
    private String devUser = "dev@myscoutee.local";
    private String websocketAllowedOriginPatterns = "http://localhost,http://localhost:4200,https://localhost,https://localhost:4200";

    public String getAdminUser() {
        return adminUser;
    }

    public void setAdminUser(String adminUser) {
        this.adminUser = adminUser;
    }

    public List<String> getAdminUsers() {
        return Arrays.stream((adminUser == null ? "" : adminUser).split("[,;]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    public boolean isAdminUser(String value) {
        String normalized = value == null ? "" : value.trim();
        return StringUtils.hasText(normalized)
                && getAdminUsers().stream().anyMatch(admin -> admin.equalsIgnoreCase(normalized));
    }

    public String getFirebaseServiceAccountPath() {
        return firebaseServiceAccountPath;
    }

    public void setFirebaseServiceAccountPath(String firebaseServiceAccountPath) {
        this.firebaseServiceAccountPath = firebaseServiceAccountPath;
    }

    public boolean isFirebaseEnabled() {
        return firebaseEnabled;
    }

    public void setFirebaseEnabled(boolean firebaseEnabled) {
        this.firebaseEnabled = firebaseEnabled;
    }

    public boolean isChatOnlyMode() {
        return chatOnlyMode;
    }

    public void setChatOnlyMode(boolean chatOnlyMode) {
        this.chatOnlyMode = chatOnlyMode;
    }

    public String getDevUser() {
        return devUser;
    }

    public void setDevUser(String devUser) {
        this.devUser = devUser;
    }

    public String getWebsocketAllowedOriginPatterns() {
        return websocketAllowedOriginPatterns;
    }

    public void setWebsocketAllowedOriginPatterns(String websocketAllowedOriginPatterns) {
        this.websocketAllowedOriginPatterns = websocketAllowedOriginPatterns;
    }

    public List<String> getWebsocketAllowedOriginPatternList() {
        return Arrays.stream((websocketAllowedOriginPatterns == null ? "" : websocketAllowedOriginPatterns).split("[,;]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }
}
