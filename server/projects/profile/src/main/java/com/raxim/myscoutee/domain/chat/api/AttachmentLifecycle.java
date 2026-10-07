package com.raxim.myscoutee.domain.chat.api;
public interface AttachmentLifecycle {
    void markEventUnavailable(String eventId, String reason);
    void markEventAvailable(String eventId);
    void markAssetUnavailable(String assetId, String reason);
    void markAssetAvailable(String assetId);
}
