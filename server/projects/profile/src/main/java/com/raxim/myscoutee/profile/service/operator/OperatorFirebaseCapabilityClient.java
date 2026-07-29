package com.raxim.myscoutee.profile.service.operator;

/**
 * Narrow boundary for explicitly requested operator Firebase capability
 * checks. Implementations must use an isolated Firebase application and must
 * never replace or delete the process-wide default application.
 */
public interface OperatorFirebaseCapabilityClient {
    void testAuthentication(
            String projectId,
            String serviceAccountJson);

    void sendTestMessage(
            String projectId,
            String serviceAccountJson,
            String destinationToken,
            String notificationTitle);
}
