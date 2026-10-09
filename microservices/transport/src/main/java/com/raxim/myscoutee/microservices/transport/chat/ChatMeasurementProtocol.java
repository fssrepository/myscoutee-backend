package com.raxim.myscoutee.microservices.transport.chat;

public final class ChatMeasurementProtocol {
    private ChatMeasurementProtocol() {}
    public static final String MESSAGES = "/_internal/v1/chat/chat-measurement/messages";
    public static String[] paths() { return new String[]{MESSAGES}; }
}
