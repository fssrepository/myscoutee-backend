package com.raxim.myscoutee.profile.service.media;

import java.util.Arrays;
import java.util.List;

/** Only server-owned public namespaces are anonymously readable. */
public final class MediaAccessPaths {
    private static final List<String> PUBLIC_PREFIXES = List.of("public/demo/", "public/branding/",
            "images/demo-profiles/", "images/demo-assets/", "images/demo-events/", "images/system/", "payment-cards/",
            "seeded-help/");

    private MediaAccessPaths() {}

    public static String storageSegment(String value) {
        return (value == null ? "" : value.trim()).replaceAll("[^a-zA-Z0-9._-]+", "-").replaceAll("(^-+|-+$)", "");
    }

    /** Resource editors may reference public media or their own uploaded images only. */
    public static boolean ownedImageReference(String reference, String owner) {
        if (reference == null) return false;
        if (!reference.startsWith("/api/media/") && !reference.startsWith("/media/")) return true;
        try {
            var uri = java.net.URI.create(reference);
            String query = uri.getRawQuery();
            if (query == null || !query.startsWith("key=") || query.contains("&")) return false;
            String key = java.net.URLDecoder.decode(query.substring(4), java.nio.charset.StandardCharsets.UTF_8);
            if (!validKey(key)) return false;
            if (isPublicKey(key)) return true;
            String[] parts = key.split("/");
            int offset = "private".equals(parts[0]) ? 1 : 0;
            return parts.length >= offset + 4 && "images".equals(parts[offset])
                    && storageSegment(owner).equals(parts[offset + 1]);
        } catch (IllegalArgumentException ex) { return false; }
    }

    public static boolean validKey(String key) {
        return key != null && !key.isBlank() && key.length() <= 2048 && !key.startsWith("/")
                && !key.contains("\\") && key.chars().noneMatch(c -> c < 32 || c == 127)
                && Arrays.stream(key.split("/", -1)).noneMatch(part -> part.isEmpty() || part.equals(".") || part.equals(".."));
    }

    public static boolean isPublicKey(String key) {
        return validKey(key) && PUBLIC_PREFIXES.stream().anyMatch(key::startsWith);
    }
}
