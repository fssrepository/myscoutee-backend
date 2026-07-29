package com.raxim.myscoutee.common.config.bootstrap;

import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.ConfigProperties;

import jakarta.servlet.http.HttpServletRequest;

public final class OperatorBootstrapTransportSecurity {
    private static final String FORWARDED_PROTO_HEADER =
            "X-Forwarded-Proto";

    private OperatorBootstrapTransportSecurity() {
    }

    public static boolean isAllowed(
            HttpServletRequest request,
            ConfigProperties config) {
        if (config != null
                && config.isOperatorBootstrapAllowInsecure()) {
            return true;
        }
        if (request == null) {
            return false;
        }
        if (request.isSecure()) {
            return true;
        }
        String forwardedProto =
                request.getHeader(FORWARDED_PROTO_HEADER);
        if (!StringUtils.hasText(forwardedProto)) {
            return false;
        }
        String firstHop = forwardedProto.split(",", 2)[0].trim();
        return "https".equalsIgnoreCase(firstHop);
    }
}
