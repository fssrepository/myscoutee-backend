package com.raxim.myscoutee.common.config.properties;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

@ConfigurationProperties("config")
public class ConfigProperties {
    private String operatorUser;
    private String operatorBootstrapEmail;
    private String operatorBootstrapPasswordSha256;
    private boolean operatorBootstrapAllowInsecure;
    private String firebaseServiceAccountPath;
    private boolean firebaseEnabled = false;
    private boolean chatOnlyMode = false;
    private String devUser = "dev@myscoutee.local";
    private String facebookAppSecret = "";
    private String websocketAllowedOriginPatterns = "http://localhost,http://localhost:4200,https://localhost,https://localhost:4200";

    public String getOperatorUser() {
        return operatorUser;
    }

    public void setOperatorUser(String operatorUser) {
        this.operatorUser = operatorUser;
    }

    public List<String> getOperatorUsers() {
        return Arrays.stream((operatorUser == null ? "" : operatorUser).split("[,;]"))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    public boolean isOperatorUser(String value) {
        String normalized = value == null ? "" : value.trim();
        return StringUtils.hasText(normalized)
                && getOperatorUsers().stream().anyMatch(operator -> operator.equalsIgnoreCase(normalized));
    }

    public String getOperatorBootstrapPasswordSha256() {
        return operatorBootstrapPasswordSha256;
    }

    public String getOperatorBootstrapEmail() {
        return operatorBootstrapEmail;
    }

    public void setOperatorBootstrapEmail(String operatorBootstrapEmail) {
        this.operatorBootstrapEmail = operatorBootstrapEmail;
    }

    public void setOperatorBootstrapPasswordSha256(
            String operatorBootstrapPasswordSha256) {
        this.operatorBootstrapPasswordSha256 =
                operatorBootstrapPasswordSha256;
    }

    public boolean isOperatorBootstrapAllowInsecure() {
        return operatorBootstrapAllowInsecure;
    }

    public void setOperatorBootstrapAllowInsecure(
            boolean operatorBootstrapAllowInsecure) {
        this.operatorBootstrapAllowInsecure =
                operatorBootstrapAllowInsecure;
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

    public String getFacebookAppSecret() {
        return facebookAppSecret;
    }

    public void setFacebookAppSecret(String facebookAppSecret) {
        this.facebookAppSecret = facebookAppSecret;
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
