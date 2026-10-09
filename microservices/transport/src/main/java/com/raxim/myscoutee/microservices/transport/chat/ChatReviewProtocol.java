package com.raxim.myscoutee.microservices.transport.chat;

public final class ChatReviewProtocol {
    public static final String REPORTED="/_internal/v1/chat/review/reported";
    public static final String EVIDENCE="/_internal/v1/chat/review/evidence";
    public static final int MAX_RESPONSE_BYTES=2*1024*1024;
    private ChatReviewProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{REPORTED,EVIDENCE}; }
    static boolean validId(String value) { return value==null || value.length()<=512; }
}
