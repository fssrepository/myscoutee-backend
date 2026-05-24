package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.ActivityChatMessage;

public interface ActivityChatMessagesRepository extends MongoRepository<ActivityChatMessage, String> {
    List<ActivityChatMessage> findByChatIdOrderBySentAtIsoAsc(String chatId);

    List<ActivityChatMessage> findByChatIdIn(Collection<String> chatIds);

    @Query("{ 'chatId': ?0, 'id': ?1 }")
    Optional<ActivityChatMessage> findByChatIdAndMessageId(String chatId, String messageId);

    @Query("{ 'chatId': ?0, 'id': { $in: ?1 } }")
    List<ActivityChatMessage> findByChatIdAndMessageIds(String chatId, Collection<String> messageIds);

    List<ActivityChatMessage> findByMessageAttachmentKeys(String attachmentKey);

    List<ActivityChatMessage> findByMessageSenderUserIds(String userId);

    List<ActivityChatMessage> findByMessageReadByUserIds(String userId);

    List<ActivityChatMessage> findByMessageReactionUserIds(String userId);

    List<ActivityChatMessage> findByPollVoterUserIds(String userId);

    default List<ActivityChatMessage> findByMessageAttachmentTypeAndEntityId(String type, String entityId) {
        return findByMessageAttachmentKeys(ActivityChatMessage.messageAttachmentKey(type, entityId));
    }

    default List<ActivityChatMessage> findByMessageSenderUserId(String userId) {
        return findByMessageSenderUserIds(normalize(userId));
    }

    default List<ActivityChatMessage> findByMessageReadByUserId(String userId) {
        return findByMessageReadByUserIds(normalize(userId));
    }

    default List<ActivityChatMessage> findByMessageReactionUserId(String userId) {
        return findByMessageReactionUserIds(normalize(userId));
    }

    default List<ActivityChatMessage> findByPollVoterUserId(String userId) {
        return findByPollVoterUserIds(normalize(userId));
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
