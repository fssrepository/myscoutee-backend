package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.Chat;

public interface ChatsRepository extends MongoRepository<Chat, String> {
    List<Chat> findByOwnerUserId(String ownerUserId);

    List<Chat> findByOwnerUserIdOrderByDateIsoDesc(String ownerUserId);

    Optional<Chat> findByOwnerUserIdAndChatId(String ownerUserId, String chatId);

    List<Chat> findByChatId(String chatId);

    List<Chat> findByChannelType(String channelType);

    List<Chat> findByMemberIdsContaining(String userId);
}
