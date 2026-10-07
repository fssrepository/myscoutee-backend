package com.raxim.myscoutee.domain.operator.service;

import org.mockito.Answers;
import org.mockito.Mockito;
import com.raxim.myscoutee.domain.registry.RegistryHttpClient;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import tools.jackson.databind.ObjectMapper;

/** Preserve real HTTP fixtures when a test supplies the verified runtime through a mock gate. */
final class RegistryRuntimeTestSupport {
    private RegistryRuntimeTestSupport() {}
    static OperatorRevenueRegistryRuntimeResolver resolver() {
        return Mockito.mock(OperatorRevenueRegistryRuntimeResolver.class, call ->
                "transport".equals(call.getMethod().getName())
                        ? new RegistryHttpClient(call.getArgument(0, RegisteredRuntime.class).properties(), new ObjectMapper())
                        : Answers.RETURNS_DEFAULTS.answer(call));
    }
}
