package com.raxim.myscoutee.microservices.transport.localization;

public final class MessageTranslationsProtocol {
    public static final String PATH = "/_internal/v1/localization/message";
    private MessageTranslationsProtocol() {}
    public record Result(String text) {}
    public record Error(String code) {}
}
