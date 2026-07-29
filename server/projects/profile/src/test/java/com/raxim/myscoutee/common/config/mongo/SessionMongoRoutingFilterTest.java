package com.raxim.myscoutee.common.config.mongo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import com.raxim.myscoutee.common.config.bootstrap.OperatorBootstrapRequestSupport;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;

class SessionMongoRoutingFilterTest {
    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void bootstrapLoginAndHeaderAlwaysRouteToRealMongo() throws Exception {
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(false);
        SessionMongoRoutingFilter filter =
                new SessionMongoRoutingFilter(properties);

        MockHttpServletRequest login = new MockHttpServletRequest(
                "POST",
                OperatorBootstrapRequestSupport.LOGIN_PATH);
        login.addHeader(
                DemoSessionRequestSupport.SESSION_KIND_HEADER,
                "demo");
        assertThat(modeInside(filter, login))
                .isEqualTo(MongoSessionMode.REAL);

        MockHttpServletRequest authorized =
                new MockHttpServletRequest(
                        "GET",
                        "/operator/configuration");
        authorized.addHeader(
                "Authorization",
                "OperatorBootstrap signed-token");
        authorized.addHeader(
                DemoSessionRequestSupport.SESSION_KIND_HEADER,
                "demo");
        assertThat(modeInside(filter, authorized))
                .isEqualTo(MongoSessionMode.REAL);
    }

    @Test
    void firebaseDisabledOperatorWithoutBootstrapKeepsDemoRouting()
            throws Exception {
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(false);
        SessionMongoRoutingFilter filter =
                new SessionMongoRoutingFilter(properties);
        MockHttpServletRequest request = new MockHttpServletRequest(
                "GET",
                "/operator/configuration");
        request.setParameter("token", "query-token-is-not-auth");

        assertThat(modeInside(filter, request))
                .isEqualTo(MongoSessionMode.DEMO);
    }

    private MongoSessionMode modeInside(
            SessionMongoRoutingFilter filter,
            MockHttpServletRequest request) throws Exception {
        AtomicReference<MongoSessionMode> observed =
                new AtomicReference<>();
        filter.doFilter(
                request,
                new MockHttpServletResponse(),
                (servletRequest, servletResponse) -> observed.set(
                        MongoSessionModeContext.currentMode()));
        return observed.get();
    }
}
