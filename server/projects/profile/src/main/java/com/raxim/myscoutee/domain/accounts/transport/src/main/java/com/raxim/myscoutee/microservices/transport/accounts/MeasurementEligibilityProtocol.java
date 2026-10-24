package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.List;

public final class MeasurementEligibilityProtocol {
    public static final String PATH = "/_internal/v1/accounts/measurement-eligibility";
    public static final int MAX_IDS = 1024, MAX_REQUEST_BYTES = 4 * 1024 * 1024, MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
    private MeasurementEligibilityProtocol() {}
    public record Query(List<String> userIds) {}
    public record Error(String code) {}
    public static boolean valid(Query q) {
        return q != null && q.userIds() != null && q.userIds().size() <= MAX_IDS
                && q.userIds().stream().allMatch(id -> id == null || id.length() <= 512);
    }
}
