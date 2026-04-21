package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import com.raxim.myscoutee.common.config.properties.MediaStorageProperties;
import com.raxim.myscoutee.profile.service.media.MediaObjectStoreClient;
import com.raxim.myscoutee.profile.service.media.MediaObjectStoreClient.StoredObject;

@Service
public class MediaStorageService {
    private static final Set<String> ALLOWED_SCOPES = Set.of("profile", "event", "asset");

    private final MediaStorageProperties properties;
    private final MediaObjectStoreClient objectStoreClient;

    public MediaStorageService(
            MediaStorageProperties properties,
            MediaObjectStoreClient objectStoreClient) {
        this.properties = properties;
        this.objectStoreClient = objectStoreClient;
    }

    public String storeImage(String scope, String ownerId, String entityId, MultipartFile image) {
        if (!isEnabled() || image == null || image.isEmpty()) {
            return null;
        }
        try {
            return storeImageBytes(scope, ownerId, entityId, image.getOriginalFilename(), image.getContentType(), image.getBytes());
        } catch (IOException | RuntimeException ex) {
            return null;
        }
    }

    public String storeImageBytes(
            String scope,
            String ownerId,
            String entityId,
            String originalFilename,
            String contentTypeValue,
            byte[] bytes) {
        if (!isEnabled() || bytes == null || bytes.length == 0) {
            return null;
        }
        String normalizedScope = normalizeScope(scope);
        String normalizedOwnerId = sanitizeSegment(ownerId);
        String normalizedEntityId = sanitizeSegment(entityId);
        if (!StringUtils.hasText(normalizedScope) || !StringUtils.hasText(normalizedOwnerId)) {
            return null;
        }
        String contentType = normalizeContentType(contentTypeValue);
        if (!contentType.startsWith("image/")) {
            return null;
        }
        try {
            String objectKey = String.join("/",
                    normalizedScope,
                    normalizedOwnerId,
                    StringUtils.hasText(normalizedEntityId) ? normalizedEntityId : "shared",
                    Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + resolveExtension(originalFilename, contentType));
            objectStoreClient.putObject(properties.getBucket(), objectKey, contentType, bytes);
            return "/media/public?key=" + UriUtils.encodeQueryParam(objectKey, StandardCharsets.UTF_8);
        } catch (RuntimeException ex) {
            return null;
        }
    }

    public StoredMediaObject loadPublicObject(String key) {
        if (!isEnabled()) {
            return null;
        }
        String normalizedKey = safeText(key);
        if (!StringUtils.hasText(normalizedKey)) {
            return null;
        }
        StoredObject storedObject = objectStoreClient.getObject(properties.getBucket(), normalizedKey);
        if (storedObject == null || storedObject.bytes() == null || storedObject.bytes().length == 0) {
            return null;
        }
        return new StoredMediaObject(storedObject.bytes(), storedObject.contentType());
    }

    public boolean isEnabled() {
        return properties.isEnabled()
                && objectStoreClient != null
                && objectStoreClient.isEnabled()
                && StringUtils.hasText(safeText(properties.getBucket()));
    }

    private String normalizeScope(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        return ALLOWED_SCOPES.contains(normalized) ? normalized : "";
    }

    private String normalizeContentType(String value) {
        return safeText(value).toLowerCase(Locale.ROOT);
    }

    private String sanitizeSegment(String value) {
        String normalized = safeText(value).replaceAll("[^a-zA-Z0-9._-]+", "-");
        return normalized.replaceAll("(^-+|-+$)", "");
    }

    private String resolveExtension(String originalFilename, String contentType) {
        String safeFileName = safeText(originalFilename);
        int dotIndex = safeFileName.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < safeFileName.length() - 1) {
            return safeFileName.substring(dotIndex).toLowerCase(Locale.ROOT);
        }
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    public record StoredMediaObject(
            byte[] bytes,
            String contentType) {
    }
}
