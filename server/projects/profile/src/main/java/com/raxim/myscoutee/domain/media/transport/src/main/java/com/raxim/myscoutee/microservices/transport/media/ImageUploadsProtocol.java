package com.raxim.myscoutee.microservices.transport.media;

import com.raxim.myscoutee.domain.media.api.MediaStorage.StoredImageSet;

public final class ImageUploadsProtocol {
    public static final String PATH = "/_internal/v1/media/integration-images";
    // Same 10 MiB file limit as the canonical production multipart configuration, plus base64/metadata.
    public static final int MAX_IMAGE_BYTES = 10 * 1024 * 1024;
    public static final int MAX_REQUEST_BYTES = 14 * 1024 * 1024, MAX_RESPONSE_BYTES = 32768;
    private ImageUploadsProtocol() {}
    public static String[] paths() { return new String[]{PATH}; }
    public record Upload(String ownerId, String entityId, String originalFilename, String contentType, byte[] bytes) {
        @Override public boolean equals(Object other) {
            return other instanceof Upload upload && java.util.Objects.equals(ownerId, upload.ownerId)
                    && java.util.Objects.equals(entityId, upload.entityId)
                    && java.util.Objects.equals(originalFilename, upload.originalFilename)
                    && java.util.Objects.equals(contentType, upload.contentType)
                    && java.util.Arrays.equals(bytes, upload.bytes);
        }
        @Override public int hashCode() {
            return java.util.Objects.hash(ownerId, entityId, originalFilename, contentType, java.util.Arrays.hashCode(bytes));
        }
        @Override public String toString() {
            return "Upload[ownerId=" + ownerId + ", entityId=" + entityId + ", originalFilename=" + originalFilename
                    + ", contentType=" + contentType + ", bytes=" + (bytes == null ? "null" : bytes.length + " bytes") + "]";
        }
    }
    public record Result(Boolean resolved, StoredImageSet imageSet) {}
    public record Error(String code) {}
    private static boolean bounded(String value, int maximum) { return value == null || value.length() <= maximum; }
    public static boolean valid(Upload value) {
        return value != null && value.ownerId() != null && !value.ownerId().isBlank() && bounded(value.ownerId(), 512)
                && value.entityId() != null && bounded(value.entityId(), 512)
                && (value.entityId().startsWith("asset-") || value.entityId().startsWith("event-") || value.entityId().startsWith("campaign-"))
                && bounded(value.originalFilename(), 1024) && bounded(value.contentType(), 256)
                && value.bytes() != null && value.bytes().length <= MAX_IMAGE_BYTES;
    }
    public static boolean valid(Result value) {
        if (value == null || !Boolean.TRUE.equals(value.resolved())) return false;
        var image = value.imageSet();
        return image == null || (bounded(image.imageUrl(), 4096) && bounded(image.originalUrl(), 4096)
                && bounded(image.smallUrl(), 4096) && bounded(image.mediumUrl(), 4096) && bounded(image.largeUrl(), 4096)
                && image.imageUrl() != null && image.originalUrl() != null && image.smallUrl() != null
                && image.mediumUrl() != null && image.largeUrl() != null);
    }
}
