package com.raxim.myscoutee.profile.service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class ProfileImageSeedImportService {
    private static final Logger log = LoggerFactory.getLogger(ProfileImageSeedImportService.class);
    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(10);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(20);

    private final UsersRepository usersRepository;
    private final MediaStorageService mediaStorageService;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(CONNECT_TIMEOUT)
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    public ProfileImageSeedImportService(
            UsersRepository usersRepository,
            MediaStorageService mediaStorageService) {
        this.usersRepository = usersRepository;
        this.mediaStorageService = mediaStorageService;
    }

    public ImportSummary importExternalProfileImages(Set<String> allowedHosts, int maxUsers, boolean dryRun) {
        if (!mediaStorageService.isEnabled()) {
            throw new IllegalStateException("Media storage is not enabled.");
        }

        Set<String> normalizedAllowedHosts = normalizeAllowedHosts(allowedHosts);
        int scannedUsers = 0;
        int updatedUsers = 0;
        int importedImages = 0;
        int failedImages = 0;

        for (Users user : usersRepository.findAll()) {
            if (maxUsers > 0 && scannedUsers >= maxUsers) {
                break;
            }
            scannedUsers += 1;

            String userId = safeText(user == null ? null : user.getId());
            if (!StringUtils.hasText(userId)) {
                continue;
            }

            List<String> currentImages = normalizeImages(user.getImages());
            if (currentImages.isEmpty()) {
                continue;
            }

            boolean changed = false;
            List<String> nextImages = new ArrayList<>(currentImages.size());
            for (int index = 0; index < currentImages.size(); index += 1) {
                String imageUrl = currentImages.get(index);
                if (!shouldImportImage(imageUrl, normalizedAllowedHosts)) {
                    nextImages.add(imageUrl);
                    continue;
                }

                ImportedRemoteImage remoteImage = downloadImage(imageUrl);
                if (remoteImage == null) {
                    failedImages += 1;
                    nextImages.add(imageUrl);
                    continue;
                }

                if (dryRun) {
                    importedImages += 1;
                    nextImages.add(imageUrl);
                    continue;
                }

                String storedImageUrl = mediaStorageService.storeImageBytes(
                        "profile",
                        userId,
                        "seed-import-" + index,
                        remoteImage.originalFilename(),
                        remoteImage.contentType(),
                        remoteImage.bytes());
                if (!StringUtils.hasText(storedImageUrl)) {
                    failedImages += 1;
                    nextImages.add(imageUrl);
                    continue;
                }

                importedImages += 1;
                changed = true;
                nextImages.add(storedImageUrl);
            }

            if (changed) {
                user.setImages(nextImages);
                usersRepository.save(user);
                updatedUsers += 1;
            }
        }

        ImportSummary summary = new ImportSummary(scannedUsers, updatedUsers, importedImages, failedImages);
        log.info("Profile image seed import finished: scannedUsers={}, updatedUsers={}, importedImages={}, failedImages={}",
                summary.scannedUsers(),
                summary.updatedUsers(),
                summary.importedImages(),
                summary.failedImages());
        return summary;
    }

    private Set<String> normalizeAllowedHosts(Set<String> allowedHosts) {
        Set<String> normalizedHosts = new LinkedHashSet<>();
        for (String host : allowedHosts == null ? Set.<String>of() : allowedHosts) {
            String normalizedHost = safeText(host).toLowerCase(Locale.ROOT);
            if (StringUtils.hasText(normalizedHost)) {
                normalizedHosts.add(normalizedHost);
            }
        }
        return normalizedHosts;
    }

    private List<String> normalizeImages(List<String> images) {
        return (images == null ? List.<String>of() : images).stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .toList();
    }

    private boolean shouldImportImage(String imageUrl, Set<String> allowedHosts) {
        String normalizedUrl = safeText(imageUrl);
        if (!StringUtils.hasText(normalizedUrl) || normalizedUrl.startsWith("/media/public?key=")) {
            return false;
        }

        URI uri;
        try {
            uri = URI.create(normalizedUrl);
        } catch (IllegalArgumentException ex) {
            return false;
        }

        String scheme = safeText(uri.getScheme()).toLowerCase(Locale.ROOT);
        if (!"http".equals(scheme) && !"https".equals(scheme)) {
            return false;
        }

        if (allowedHosts.isEmpty()) {
            return true;
        }

        String host = safeText(uri.getHost()).toLowerCase(Locale.ROOT);
        if (!StringUtils.hasText(host)) {
            return false;
        }
        for (String allowedHost : allowedHosts) {
            if (host.equals(allowedHost) || host.endsWith("." + allowedHost)) {
                return true;
            }
        }
        return false;
    }

    private ImportedRemoteImage downloadImage(String imageUrl) {
        try {
            HttpRequest request = HttpRequest.newBuilder(URI.create(imageUrl))
                    .timeout(REQUEST_TIMEOUT)
                    .header("User-Agent", "myscoutee-profile-image-import/1.0")
                    .GET()
                    .build();
            HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() < 200 || response.statusCode() >= 300 || response.body() == null || response.body().length == 0) {
                return null;
            }

            String contentType = normalizeContentType(response.headers().firstValue("Content-Type").orElse(""));
            if (!contentType.startsWith("image/")) {
                contentType = inferContentTypeFromUrl(imageUrl);
                if (!contentType.startsWith("image/")) {
                    return null;
                }
            }

            return new ImportedRemoteImage(
                    response.body(),
                    contentType,
                    resolveOriginalFilename(imageUrl, contentType));
        } catch (IOException ex) {
            return null;
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            return null;
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private String resolveOriginalFilename(String imageUrl, String contentType) {
        try {
            String path = safeText(URI.create(imageUrl).getPath());
            int slashIndex = path.lastIndexOf('/');
            String fileName = slashIndex >= 0 ? path.substring(slashIndex + 1) : path;
            if (StringUtils.hasText(fileName) && fileName.contains(".")) {
                return fileName;
            }
        } catch (IllegalArgumentException ex) {
            // Fall back to generated extension below.
        }

        return "seed-image" + switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }

    private String inferContentTypeFromUrl(String imageUrl) {
        String normalizedUrl = safeText(imageUrl).toLowerCase(Locale.ROOT);
        if (normalizedUrl.endsWith(".png")) {
            return "image/png";
        }
        if (normalizedUrl.endsWith(".webp")) {
            return "image/webp";
        }
        if (normalizedUrl.endsWith(".gif")) {
            return "image/gif";
        }
        if (normalizedUrl.endsWith(".jpeg") || normalizedUrl.endsWith(".jpg")) {
            return "image/jpeg";
        }
        return "";
    }

    private String normalizeContentType(String value) {
        String normalized = safeText(value).toLowerCase(Locale.ROOT);
        int separatorIndex = normalized.indexOf(';');
        return separatorIndex >= 0 ? normalized.substring(0, separatorIndex).trim() : normalized;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record ImportedRemoteImage(
            byte[] bytes,
            String contentType,
            String originalFilename) {
    }

    public record ImportSummary(
            int scannedUsers,
            int updatedUsers,
            int importedImages,
            int failedImages) {
    }
}
