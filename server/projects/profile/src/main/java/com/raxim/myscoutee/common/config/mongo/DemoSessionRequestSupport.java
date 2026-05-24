package com.raxim.myscoutee.common.config.mongo;

import org.springframework.util.StringUtils;

import jakarta.servlet.http.HttpServletRequest;

public final class DemoSessionRequestSupport {
    public static final String SESSION_KIND_HEADER = "X-App-Session-Kind";
    private static final String DEMO_SESSION_KIND = "demo";
    private static final String SESSION_KIND_PARAM = "sessionKind";
    private static final String ACTIVITIES_CHATS_ROUTE = "/activities/chats";

    private DemoSessionRequestSupport() {
    }

    public static boolean isAllowedDemoSessionRequest(HttpServletRequest request) {
        if (request == null || !isDemoSessionRequest(request)) {
            return false;
        }
        String requestUri = request.getRequestURI();
        return StringUtils.hasText(requestUri) && requestUri.startsWith(ACTIVITIES_CHATS_ROUTE);
    }

    public static boolean isDemoSessionRequest(HttpServletRequest request) {
        if (request == null) {
            return false;
        }
        return isDemoSessionKind(request.getHeader(SESSION_KIND_HEADER))
                || isDemoSessionKind(request.getParameter(SESSION_KIND_PARAM));
    }

    public static boolean isDemoSessionKind(String sessionKind) {
        return StringUtils.hasText(sessionKind)
                && DEMO_SESSION_KIND.equalsIgnoreCase(sessionKind.trim());
    }
}
