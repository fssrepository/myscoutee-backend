package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.net.URLDecoder;
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
    private static final Set<String> ALLOWED_SCOPES = Set.of("profile", "event", "asset", "chat", "idea", "content");
    private static final Set<String> ALLOWED_IMAGE_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final Set<String> ALLOWED_AUDIO_CONTENT_TYPES = Set.of(
            "audio/mpeg",
            "audio/mp4",
            "audio/aac",
            "audio/ogg",
            "audio/webm",
            "audio/wav",
            "audio/x-wav");

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
            return storeMediaBytes(scope, ownerId, entityId, image.getOriginalFilename(), image.getContentType(), image.getBytes(), "image/");
        } catch (IOException | RuntimeException ex) {
            return null;
        }
    }

    public String storeAudio(String scope, String ownerId, String entityId, MultipartFile audio) {
        if (!isEnabled() || audio == null || audio.isEmpty()) {
            return null;
        }
        try {
            return storeMediaBytes(scope, ownerId, entityId, audio.getOriginalFilename(), audio.getContentType(), audio.getBytes(), "audio/");
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
        if (!StringUtils.hasText(normalizedScope) || !StringUtils.hasText(normalizedOwnerId)) {
            return null;
        }
        return storeMediaBytes(scope, ownerId, entityId, originalFilename, contentTypeValue, bytes, "image/");
    }

    public String storeMediaBytes(
            String scope,
            String ownerId,
            String entityId,
            String originalFilename,
            String contentTypeValue,
            byte[] bytes,
            String requiredContentTypePrefix) {
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
        if (!contentType.startsWith(safeText(requiredContentTypePrefix))) {
            return null;
        }
        if ("image/".equals(requiredContentTypePrefix) && !ALLOWED_IMAGE_CONTENT_TYPES.contains(contentType)) {
            return null;
        }
        if ("audio/".equals(requiredContentTypePrefix) && !ALLOWED_AUDIO_CONTENT_TYPES.contains(contentType)) {
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

    public void deletePublicObject(String mediaUrlOrKey) {
        try {
            deletePublicObjectOrThrow(mediaUrlOrKey);
        } catch (RuntimeException ignored) {
        }
    }

    public void deletePublicObjectOrThrow(String mediaUrlOrKey) {
        if (!isEnabled()) {
            return;
        }
        String key = extractPublicObjectKey(mediaUrlOrKey);
        if (!StringUtils.hasText(key)) {
            return;
        }
        objectStoreClient.deleteObject(properties.getBucket(), key);
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
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        int parameterIndex = normalized.indexOf(';');
        return parameterIndex >= 0 ? normalized.substring(0, parameterIndex).trim() : normalized;
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
            case "image/svg+xml" -> ".svg";
            case "audio/mpeg" -> ".mp3";
            case "audio/mp4", "audio/aac" -> ".m4a";
            case "audio/ogg" -> ".ogg";
            case "audio/webm" -> ".webm";
            case "audio/wav", "audio/x-wav" -> ".wav";
            default -> contentType.startsWith("audio/") ? ".audio" : ".jpg";
        };
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String extractPublicObjectKey(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        if (!normalized.contains("/media/public")) {
            return normalized.contains("/") ? "" : normalized;
        }
        int keyIndex = normalized.indexOf("key=");
        if (keyIndex < 0) {
            return "";
        }
        String encoded = normalized.substring(keyIndex + 4);
        int separatorIndex = encoded.indexOf('&');
        if (separatorIndex >= 0) {
            encoded = encoded.substring(0, separatorIndex);
        }
        try {
            return URLDecoder.decode(encoded, StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ex) {
            return "";
        }
    }

    public record StoredMediaObject(
            byte[] bytes,
            String contentType) {
    }
}
