package com.raxim.myscoutee.common.config.mongo;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;

class OperatorDemoSessionSecurityTest {
    @Test
    void demoHeaderDoesNotMakeOperatorApiPublic() {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/operator/registry");
        request.addHeader(DemoSessionRequestSupport.SESSION_KIND_HEADER, "demo");

        assertThat(DemoSessionRequestSupport.isDemoSessionRequest(request)).isTrue();
        assertThat(DemoSessionRequestSupport.isOperatorRequest(request)).isTrue();
        assertThat(DemoSessionRequestSupport.isAllowedDemoSessionRequest(request)).isFalse();
    }
}
