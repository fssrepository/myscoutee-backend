package com.raxim.myscoutee.domain.notifications.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.SendResponse;
import com.raxim.myscoutee.domain.platform.service.DeploymentFirebaseRuntime;

@Service
public class DefaultFirebaseMessagingGateway implements FirebaseMessagingGateway {
    private final DeploymentFirebaseRuntime firebaseRuntime;

    public DefaultFirebaseMessagingGateway(
            DeploymentFirebaseRuntime firebaseRuntime) {
        this.firebaseRuntime = firebaseRuntime;
    }

    @Override
    public void send(Message message) throws FirebaseMessagingException {
        firebaseRuntime.messaging().send(message);
    }

    @Override
    public FirebaseMessagingGateway.FirebaseBatchSendResult sendAll(List<Message> messages, List<String> tokens) throws FirebaseMessagingException {
        return toResult(firebaseRuntime.messaging().sendEach(messages));
    }

    @Override
    public FirebaseMessagingGateway.FirebaseBatchSendResult sendMulticast(MulticastMessage message, List<String> tokens) throws FirebaseMessagingException {
        return toResult(firebaseRuntime.messaging().sendEachForMulticast(message));
    }

    private FirebaseMessagingGateway.FirebaseBatchSendResult toResult(BatchResponse response) {
        if (response == null) {
            return new FirebaseMessagingGateway.FirebaseBatchSendResult(0, 0, List.of());
        }
        List<FirebaseMessagingGateway.FirebaseTokenSendResult> responses = response.getResponses() == null
                ? List.of()
                : response.getResponses().stream()
                        .map(this::toResult)
                        .toList();
        return new FirebaseMessagingGateway.FirebaseBatchSendResult(response.getSuccessCount(), response.getFailureCount(), responses);
    }

    private FirebaseMessagingGateway.FirebaseTokenSendResult toResult(SendResponse response) {
        if (response == null) {
            return new FirebaseMessagingGateway.FirebaseTokenSendResult(false, null);
        }
        MessagingErrorCode errorCode = response.getException() == null
                ? null
                : response.getException().getMessagingErrorCode();
        return new FirebaseMessagingGateway.FirebaseTokenSendResult(response.isSuccessful(), errorCode);
    }
}
