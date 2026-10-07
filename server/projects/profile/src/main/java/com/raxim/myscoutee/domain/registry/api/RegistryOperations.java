package com.raxim.myscoutee.domain.registry.api;
import com.raxim.myscoutee.domain.registry.dto.RegistryExpectation;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import com.raxim.myscoutee.domain.registry.api.RegistryTransport;
import com.raxim.myscoutee.domain.registry.dto.RegistryEnrollmentValues.NodeStatus;
import com.raxim.myscoutee.domain.registry.dto.RegistryEnrollmentValues.EnrollmentOutcome;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.BindingArchive;
import com.raxim.myscoutee.domain.registry.dto.RegistryState.BindingArchiveRequest;
public interface RegistryOperations {
    com.raxim.myscoutee.domain.registry.dto.RegistryInspection inspect(RegistryConfiguration properties);
    NodeStatus inspectNodeIdentity(RegistryConfiguration properties);
    com.raxim.myscoutee.domain.registry.dto.NodeIdentity initializeNodeIdentity(
            RegistryConfiguration properties);
    EnrollmentOutcome synchronize(RegistryConfiguration properties);
    BindingArchive archiveActiveBinding(
            RegistryConfiguration properties,
            BindingArchiveRequest request);
    void restoreActiveBinding(
            RegistryConfiguration properties,
            String archiveId);
    RegistryTransport openTransport(RegistryConfiguration properties);
    RegisteredRuntime registeredEvidence(RegistryConfiguration runtime, String requiredEndpointPath,
            RegistryExpectation expectation);
}
