package com.raxim.myscoutee.domain.platform.api;

import java.util.List;

/** Read-only in-process deployment policy; mutation remains with configuration binding and platform activation. */
public interface RuntimeConfiguration {
    List<String> getMcpManualRedirectUris();
    boolean isMcpDemoEnabled();
    String getOperatorUser();
    List<String> getOperatorUsers();
    boolean isOperatorUser(String value);
    String getOperatorBootstrapPasswordSha256();
    String getOperatorBootstrapEmail();
    boolean isOperatorBootstrapAllowInsecure();
    String getFirebaseServiceAccountPath();
    boolean isFirebaseEnabled();
    boolean isStartupFirebaseEnabled();
    boolean isChatOnlyMode();
    String getMemberUser();
    boolean isMemberFallbackEnabled();
    String getFacebookAppSecret();
    String getWebsocketAllowedOriginPatterns();
    List<String> getWebsocketAllowedOriginPatternList();
}
