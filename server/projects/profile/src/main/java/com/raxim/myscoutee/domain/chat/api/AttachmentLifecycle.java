package com.raxim.myscoutee.domain.chat.api;
public interface AttachmentLifecycle {
    record Projection(String type, String entityId, long revision, boolean available, String reason) {}
    void project(Projection projection);
    void markEventUnavailable(String eventId, String reason);
    void markEventAvailable(String eventId);
    void markAssetUnavailable(String assetId, String reason);
    void markAssetAvailable(String assetId);
}
