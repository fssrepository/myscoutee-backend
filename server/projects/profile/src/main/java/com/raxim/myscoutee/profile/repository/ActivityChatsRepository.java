package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.raxim.myscoutee.profile.data.document.ActivityChat;

public interface ActivityChatsRepository extends MongoRepository<ActivityChat, String> {
    List<ActivityChat> findByOwnerUserId(String ownerUserId);

    List<ActivityChat> findByOwnerUserIdOrderByDateIsoDesc(String ownerUserId);

    Optional<ActivityChat> findByOwnerUserIdAndChatId(String ownerUserId, String chatId);

    List<ActivityChat> findByChatId(String chatId);

    List<ActivityChat> findByMemberIdsContaining(String userId);

    @Query("{ 'messages.attachments': { $elemMatch: { 'type': ?0, 'entityId': ?1 } } }")
    List<ActivityChat> findByMessageAttachmentTypeAndEntityId(String type, String entityId);

    @Query("{ 'messages.senderAvatar.id': ?0 }")
    List<ActivityChat> findByMessageSenderUserId(String userId);

    @Query("{ 'messages.readBy.id': ?0 }")
    List<ActivityChat> findByMessageReadByUserId(String userId);

    @Query("{ 'messages.reactions.userId': ?0 }")
    List<ActivityChat> findByMessageReactionUserId(String userId);

    @Query("{ 'messages.attachments': { $elemMatch: { 'type': 'poll', 'description': { $regex: ?0 } } } }")
    List<ActivityChat> findByPollAttachmentDescriptionMatching(String pattern);
}
