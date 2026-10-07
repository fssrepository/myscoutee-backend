package com.raxim.myscoutee.domain.chat.service;

import java.util.List;
import org.bson.Document;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.data.domain.Sort;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.chat.api.ChatDirectory;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;

@Service
public class ChatDirectoryService implements ChatDirectory {
    @org.springframework.beans.factory.annotation.Autowired private org.springframework.data.mongodb.core.MongoTemplate mongo;
    @Override public String unreadVersion(String owner) {
        Query query = Query.query(Criteria.where("ownerUserId").is(owner).and("unread").gt(0).and("lastSenderId").ne(owner))
                .with(Sort.by(Sort.Direction.DESC, "dateIso")).limit(1);
        query.fields().include("dateIso");
        Document row = mongo.findOne(query, Document.class, "chats");
        return row == null ? "" : row.getString("dateIso");
    }
    private final ChatsRepository chats;
    public ChatDirectoryService(ChatsRepository chats) { this.chats = chats; }
    @Override public Optional<com.raxim.myscoutee.domain.chat.document.Chat> findByOwnerUserIdAndChatId(String owner, String chat) { return chats.findByOwnerUserIdAndChatId(owner, chat); }
    @Override public List<com.raxim.myscoutee.domain.chat.document.Chat> findByChatId(String chat) { return chats.findByChatId(chat); }
}
