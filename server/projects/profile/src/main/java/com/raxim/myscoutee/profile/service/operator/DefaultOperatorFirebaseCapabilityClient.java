package com.raxim.myscoutee.profile.service.operator;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.AuthErrorCode;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;

@Component
public class DefaultOperatorFirebaseCapabilityClient
        implements OperatorFirebaseCapabilityClient {
    private static final String TEST_UID =
            "myscoutee-operator-capability-test";
    private static final int CONNECT_TIMEOUT_MILLIS = 5_000;
    private static final int READ_TIMEOUT_MILLIS = 10_000;

    private final FirebaseCapabilityOperations operations;

    public DefaultOperatorFirebaseCapabilityClient() {
        this(new FirebaseCapabilityOperations() {
            @Override
            public void testAuthentication(FirebaseApp app)
                    throws FirebaseAuthException {
                try {
                    FirebaseAuth.getInstance(app).getUser(TEST_UID);
                } catch (FirebaseAuthException exception) {
                    if (exception.getAuthErrorCode()
                            != AuthErrorCode.USER_NOT_FOUND) {
                        throw exception;
                    }
                    /*
                     * USER_NOT_FOUND is an authenticated response from the
                     * configured Firebase project and therefore proves the
                     * provider round-trip without creating test data.
                     */
                }
            }

            @Override
            public void sendTestMessage(
                    FirebaseApp app,
                    String destinationToken,
                    String notificationTitle)
                    throws Exception {
                Message message = Message.builder()
                        .setToken(destinationToken)
                        .setNotification(Notification.builder()
                                .setTitle(notificationTitle)
                                .setBody(
                                        "Operator messaging configuration is working.")
                                .build())
                        .putData("operator_capability_test", "true")
                        .build();
                FirebaseMessaging.getInstance(app).send(message);
            }
        });
    }

    DefaultOperatorFirebaseCapabilityClient(
            FirebaseCapabilityOperations operations) {
        this.operations = Objects.requireNonNull(operations);
    }

    @Override
    public void testAuthentication(
            String projectId,
            String serviceAccountJson) {
        withIsolatedApp(
                projectId,
                serviceAccountJson,
                operations::testAuthentication);
    }

    @Override
    public void sendTestMessage(
            String projectId,
            String serviceAccountJson,
            String destinationToken,
            String notificationTitle) {
        String token = requireText(
                destinationToken,
                "Firebase destination token");
        String title = requireText(
                notificationTitle,
                "Firebase notification title");
        withIsolatedApp(
                projectId,
                serviceAccountJson,
                app -> operations.sendTestMessage(app, token, title));
    }

    private void withIsolatedApp(
            String projectId,
            String serviceAccountJson,
            FirebaseOperation operation) {
        String normalizedProjectId = requireText(
                projectId,
                "Firebase project id");
        String credential = requireText(
                serviceAccountJson,
                "Firebase service-account credential");
        FirebaseApp app = null;
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    new ByteArrayInputStream(
                            credential.getBytes(StandardCharsets.UTF_8)));
            if (!(credentials instanceof ServiceAccountCredentials serviceAccount)) {
                throw new IllegalArgumentException(
                        "Firebase credential must be a service-account JSON document.");
            }
            String credentialProjectId = serviceAccount.getProjectId();
            if (StringUtils.hasText(credentialProjectId)
                    && !normalizedProjectId.equals(
                            credentialProjectId.trim())) {
                throw new IllegalArgumentException(
                        "Firebase project id does not match the service-account credential.");
            }
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .setProjectId(normalizedProjectId)
                    .setConnectTimeout(CONNECT_TIMEOUT_MILLIS)
                    .setReadTimeout(READ_TIMEOUT_MILLIS)
                    .build();
            app = FirebaseApp.initializeApp(
                    options,
                    "operator-capability-" + UUID.randomUUID());
            operation.run(app);
        } catch (IOException exception) {
            throw new IllegalArgumentException(
                    "Firebase service-account credential is invalid.",
                    exception);
        } catch (RuntimeException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Firebase capability test failed.",
                    exception);
        } finally {
            if (app != null) {
                app.delete();
            }
        }
    }

    private String requireText(String value, String fieldName) {
        String normalized = value == null ? "" : value.trim();
        if (!StringUtils.hasText(normalized)) {
            throw new IllegalArgumentException(
                    fieldName + " is required.");
        }
        return normalized;
    }

    @FunctionalInterface
    private interface FirebaseOperation {
        void run(FirebaseApp app) throws Exception;
    }

    interface FirebaseCapabilityOperations {
        void testAuthentication(FirebaseApp app) throws Exception;

        void sendTestMessage(
                FirebaseApp app,
                String destinationToken,
                String notificationTitle) throws Exception;
    }
}
