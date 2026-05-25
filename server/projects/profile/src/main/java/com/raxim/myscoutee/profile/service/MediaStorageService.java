package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.net.UnknownHostException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
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
    private static final Duration REMOTE_IMAGE_CONNECT_TIMEOUT = Duration.ofSeconds(5);
    private static final Duration REMOTE_IMAGE_REQUEST_TIMEOUT = Duration.ofSeconds(8);
    private static final int MAX_REMOTE_IMAGE_BYTES = 5 * 1024 * 1024;
    private static final int MAX_REMOTE_IMAGE_REDIRECTS = 3;

    private final MediaStorageProperties properties;
    private final MediaObjectStoreClient objectStoreClient;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(REMOTE_IMAGE_CONNECT_TIMEOUT)
            .followRedirects(HttpClient.Redirect.NEVER)
            .build();

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

    public String importImage(String scope, String ownerId, String entityId, String imageUrl) {
        if (!isEnabled()) {
            return null;
        }
        URI remoteImageUri = normalizeRemoteImageUri(imageUrl);
        if (remoteImageUri == null) {
            return null;
        }
        ImportedImage importedImage = downloadRemoteImage(remoteImageUri, 0);
        if (importedImage == null) {
            return null;
        }
        return storeImageBytes(
                scope,
                ownerId,
                entityId,
                importedImage.originalFilename(),
                importedImage.contentType(),
                importedImage.bytes());
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

    private URI normalizeRemoteImageUri(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        URI uri;
        try {
            uri = URI.create(normalized);
        } catch (IllegalArgumentException ex) {
            return null;
        }
        String scheme = safeText(uri.getScheme()).toLowerCase(Locale.ROOT);
        String host = safeText(uri.getHost()).toLowerCase(Locale.ROOT);
        if ((!"http".equals(scheme) && !"https".equals(scheme)) || !StringUtils.hasText(host) || StringUtils.hasText(uri.getUserInfo())) {
            return null;
        }
        if (isBlockedRemoteHost(host)) {
            return null;
        }
        return uri;
    }

    private ImportedImage downloadRemoteImage(URI uri, int redirectCount) {
        try {
            HttpRequest request = HttpRequest.newBuilder(uri)
                    .timeout(REMOTE_IMAGE_REQUEST_TIMEOUT)
                    .header("Accept", "image/avif,image/webp,image/png,image/jpeg,image/gif,image/*;q=0.8,*/*;q=0.1")
                    .GET()
                    .build();
            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            int statusCode = response.statusCode();
            if (statusCode >= 300 && statusCode < 400) {
                if (redirectCount >= MAX_REMOTE_IMAGE_REDIRECTS) {
                    return null;
                }
                Optional<String> location = response.headers().firstValue("location");
                if (location.isEmpty()) {
                    return null;
                }
                URI redirectUri = normalizeRemoteImageUri(uri.resolve(location.get()).toString());
                return redirectUri == null ? null : downloadRemoteImage(redirectUri, redirectCount + 1);
            }
            if (statusCode < 200 || statusCode >= 300) {
                return null;
            }
            long declaredLength = response.headers().firstValueAsLong("content-length").orElse(-1L);
            if (declaredLength > MAX_REMOTE_IMAGE_BYTES) {
                return null;
            }
            byte[] bytes = response.body();
            if (bytes == null || bytes.length == 0 || bytes.length > MAX_REMOTE_IMAGE_BYTES) {
                return null;
            }
            String contentType = resolveRemoteImageContentType(
                    uri,
                    response.headers().firstValue("content-type").orElse(""));
            if (!ALLOWED_IMAGE_CONTENT_TYPES.contains(contentType)) {
                return null;
            }
            return new ImportedImage(bytes, contentType, resolveRemoteImageFilename(uri, contentType));
        } catch (IOException | InterruptedException | IllegalArgumentException ex) {
            if (ex instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            return null;
        }
    }

    private String resolveRemoteImageContentType(URI uri, String contentTypeValue) {
        String contentType = normalizeContentType(contentTypeValue);
        if (ALLOWED_IMAGE_CONTENT_TYPES.contains(contentType)) {
            return contentType;
        }
        String path = safeText(uri.getPath()).toLowerCase(Locale.ROOT);
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        if (path.endsWith(".png")) {
            return "image/png";
        }
        if (path.endsWith(".webp")) {
            return "image/webp";
        }
        if (path.endsWith(".gif")) {
            return "image/gif";
        }
        return "";
    }

    private String resolveRemoteImageFilename(URI uri, String contentType) {
        String path = safeText(uri.getPath());
        int slashIndex = path.lastIndexOf('/');
        String filename = slashIndex >= 0 ? path.substring(slashIndex + 1) : path;
        filename = sanitizeSegment(filename);
        if (StringUtils.hasText(filename) && filename.contains(".")) {
            return filename;
        }
        return "source-image" + resolveExtension("", contentType);
    }

    private boolean isBlockedRemoteHost(String host) {
        if (!StringUtils.hasText(host)
                || "localhost".equals(host)
                || host.endsWith(".localhost")) {
            return true;
        }
        try {
            for (InetAddress address : InetAddress.getAllByName(host)) {
                if (isBlockedRemoteAddress(address)) {
                    return true;
                }
            }
            return false;
        } catch (UnknownHostException ex) {
            return true;
        }
    }

    private boolean isBlockedRemoteAddress(InetAddress address) {
        if (address == null
                || address.isAnyLocalAddress()
                || address.isLoopbackAddress()
                || address.isLinkLocalAddress()
                || address.isSiteLocalAddress()
                || address.isMulticastAddress()) {
            return true;
        }
        if (address instanceof Inet4Address) {
            byte[] bytes = address.getAddress();
            int first = bytes[0] & 0xff;
            int second = bytes[1] & 0xff;
            return first == 0
                    || first == 10
                    || first == 127
                    || (first == 169 && second == 254)
                    || (first == 172 && second >= 16 && second <= 31)
                    || (first == 192 && second == 168);
        }
        if (address instanceof Inet6Address) {
            byte[] bytes = address.getAddress();
            int first = bytes[0] & 0xff;
            return (first & 0xfe) == 0xfc;
        }
        return true;
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

    private record ImportedImage(
            byte[] bytes,
            String contentType,
            String originalFilename) {
    }
}
