package com.raxim.myscoutee.profile.service.media;

public interface MediaObjectStoreClient {
    boolean isEnabled();

    void putObject(String bucket, String key, String contentType, byte[] bytes);

    StoredObject getObject(String bucket, String key);

    record StoredObject(
            byte[] bytes,
            String contentType) {
    }
}
