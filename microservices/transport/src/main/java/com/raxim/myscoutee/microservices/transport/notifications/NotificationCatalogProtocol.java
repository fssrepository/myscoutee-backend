package com.raxim.myscoutee.microservices.transport.notifications;

public final class NotificationCatalogProtocol {
    public static final String UNREAD = "/_internal/v1/notifications/catalog/unread";
    public static final String FAILED_JOBS = "/_internal/v1/notifications/catalog/failed-jobs";
    public static final String OUTBOX = "/_internal/v1/notifications/catalog/outbox";
    public static final String TEMPLATE = "/_internal/v1/notifications/catalog/template";
    private NotificationCatalogProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{UNREAD, FAILED_JOBS, OUTBOX, TEMPLATE}; }
}
