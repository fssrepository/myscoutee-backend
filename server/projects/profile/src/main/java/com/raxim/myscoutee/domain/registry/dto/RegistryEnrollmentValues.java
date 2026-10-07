package com.raxim.myscoutee.domain.registry.dto;
import java.util.*;
import java.time.Instant;
import java.nio.file.Path;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.*;
public final class RegistryEnrollmentValues {
    private RegistryEnrollmentValues() {}
    public record NodeStatus(
            String state,
            String publicKeyFingerprint) {
    }
    public record EnrollmentOutcome(
            String deploymentCode,
            String installationTestBatchId,
            String installationTestAcceptedAt,
            Long installationTestLedgerIndex,
            boolean registrationDuplicate) {
    }
}
