package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.ActivityChat;

public interface ActivityChatsRepository extends MongoRepository<ActivityChat, String> {
    List<ActivityChat> findByOwnerUserId(String ownerUserId);

    List<ActivityChat> findByOwnerUserIdOrderByDateIsoDesc(String ownerUserId);

    Optional<ActivityChat> findByOwnerUserIdAndChatId(String ownerUserId, String chatId);

    List<ActivityChat> findByChatId(String chatId);

    List<ActivityChat> findByChannelType(String channelType);

    List<ActivityChat> findByMemberIdsContaining(String userId);

    List<ActivityChat> findByMessageAttachmentKeys(String attachmentKey);

    List<ActivityChat> findByMessageSenderUserIds(String userId);

    List<ActivityChat> findByMessageReadByUserIds(String userId);

    List<ActivityChat> findByMessageReactionUserIds(String userId);

    List<ActivityChat> findByPollVoterUserIds(String userId);

    default List<ActivityChat> findByMessageAttachmentTypeAndEntityId(String type, String entityId) {
        return findByMessageAttachmentKeys(ActivityChat.messageAttachmentKey(type, entityId));
    }

    default List<ActivityChat> findByMessageSenderUserId(String userId) {
        return findByMessageSenderUserIds(normalize(userId));
    }

    default List<ActivityChat> findByMessageReadByUserId(String userId) {
        return findByMessageReadByUserIds(normalize(userId));
    }

    default List<ActivityChat> findByMessageReactionUserId(String userId) {
        return findByMessageReactionUserIds(normalize(userId));
    }

    default List<ActivityChat> findByPollVoterUserId(String userId) {
        return findByPollVoterUserIds(normalize(userId));
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
