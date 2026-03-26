package com.raxim.myscoutee.profile.repository.mongo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.ActivityChat;

public interface ActivityChatsRepository extends MongoRepository<ActivityChat, String> {
    List<ActivityChat> findByOwnerUserId(String ownerUserId);

    List<ActivityChat> findByOwnerUserIdOrderByDateIsoDesc(String ownerUserId);

    Optional<ActivityChat> findByOwnerUserIdAndChatId(String ownerUserId, String chatId);

    List<ActivityChat> findByChatId(String chatId);

    List<ActivityChat> findByMemberIdsContaining(String userId);
}
