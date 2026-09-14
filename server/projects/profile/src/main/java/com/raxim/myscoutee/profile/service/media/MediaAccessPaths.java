package com.raxim.myscoutee.profile.service.media;

import java.util.Arrays;
import java.util.List;

/** Only server-owned public namespaces are anonymously readable. */
public final class MediaAccessPaths {
    private static final List<String> PUBLIC_PREFIXES = List.of("public/demo/", "public/branding/",
            "images/demo-profiles/", "images/demo-assets/", "images/demo-events/", "images/system/", "payment-cards/");

    private MediaAccessPaths() {}

    public static boolean validKey(String key) {
        return key != null && !key.isBlank() && key.length() <= 2048 && !key.startsWith("/")
                && !key.contains("\\") && key.chars().noneMatch(c -> c < 32 || c == 127)
                && Arrays.stream(key.split("/", -1)).noneMatch(part -> part.isEmpty() || part.equals(".") || part.equals(".."));
    }

    public static boolean isPublicKey(String key) {
        return validKey(key) && PUBLIC_PREFIXES.stream().anyMatch(key::startsWith);
    }
}
