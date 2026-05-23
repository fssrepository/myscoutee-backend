package com.raxim.myscoutee.profile.service.notifications;

import java.util.ArrayList;
import java.util.List;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.MulticastMessage;

public interface FirebaseMessagingGateway {
    void send(Message message) throws FirebaseMessagingException;

    FirebaseBatchSendResult sendAll(List<Message> messages, List<String> tokens) throws FirebaseMessagingException;

    FirebaseBatchSendResult sendMulticast(MulticastMessage message, List<String> tokens) throws FirebaseMessagingException;

    record FirebaseBatchSendResult(int successCount, int failureCount, List<FirebaseTokenSendResult> responses) {
        public FirebaseBatchSendResult {
            responses = responses == null ? List.of() : List.copyOf(responses);
        }

        public static FirebaseBatchSendResult allSuccessful(int count) {
            List<FirebaseTokenSendResult> responses = new ArrayList<>();
            for (int index = 0; index < Math.max(0, count); index += 1) {
                responses.add(FirebaseTokenSendResult.success());
            }
            return new FirebaseBatchSendResult(Math.max(0, count), 0, responses);
        }
    }

    record FirebaseTokenSendResult(boolean successful, MessagingErrorCode errorCode) {
        public static FirebaseTokenSendResult success() {
            return new FirebaseTokenSendResult(true, null);
        }
    }
}
