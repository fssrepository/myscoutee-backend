package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.ChatMeasurement;
import com.raxim.myscoutee.microservices.transport.common.MeasurementStream;
import jakarta.servlet.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class ChatMeasurementEndpoint {
    private final ChatMeasurement owner;
    private final ObjectMapper mapper;
    public ChatMeasurementEndpoint(ChatMeasurement owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(ChatMeasurementProtocol.MESSAGES)
    public void messages(HttpServletRequest request, HttpServletResponse response) throws java.io.IOException {
        MeasurementStream.write(request, response, mapper, owner::messages);
    }
}
