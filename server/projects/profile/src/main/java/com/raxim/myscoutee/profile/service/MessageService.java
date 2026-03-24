package com.raxim.myscoutee.profile.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.dto.rest.MessageDTO;
import com.raxim.myscoutee.profile.data.dto.rest.PageParam;
import com.raxim.myscoutee.profile.repository.mongo.MessageRepository;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<MessageDTO> getLastMessagesByChannels(PageParam pageParam) {
        return this.messageRepository.findLastMessageByChannels(pageParam);
    }

    public List<MessageDTO> getMessagesByChannel(UUID eventId, PageParam pageParam) {
        return this.messageRepository.findMessagesByChannel(eventId, pageParam);
    }
}
