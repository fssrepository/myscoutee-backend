package com.raxim.myscoutee.profile.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.UserNotification;

public interface UserNotificationsRepository extends MongoRepository<UserNotification, String> {
    Optional<UserNotification> findByIdAndRecipientUserId(String id, String recipientUserId);

    long deleteAllByRecipientUserId(String recipientUserId);
}
