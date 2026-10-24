package com.raxim.myscoutee.domain.localization.api;

import java.util.List;
import java.util.Locale;
import org.springframework.util.StringUtils;

/** Existing content-language selection; callers retain their original case-folding locale. */
public final class ContentLanguages {
    private ContentLanguages() {}
    public static String supported(String value, Locale locale) {
        String normalized = (value == null ? "" : value.trim()).toLowerCase(locale);
        int semicolon = normalized.indexOf(';');
        if (semicolon > 0) normalized = normalized.substring(0, semicolon);
        int dash = normalized.indexOf('-');
        if (dash > 0) normalized = normalized.substring(0, dash);
        return List.of("en", "hu", "de", "es").contains(normalized) ? normalized : "";
    }
    public static String requested(String explicit, String acceptLanguage, Locale locale, String fallback) {
        if (StringUtils.hasText(explicit == null ? "" : explicit.trim())) {
            String language = supported(explicit, locale);
            return StringUtils.hasText(language) ? language : fallback;
        }
        for (String candidate : (acceptLanguage == null ? "" : acceptLanguage.trim()).split(",")) {
            String language = supported(candidate, locale);
            if (StringUtils.hasText(language)) return language;
        }
        return fallback;
    }
    public static String label(String normalizedLanguage) {
        return switch (normalizedLanguage) {
            case "hu" -> "Magyar";
            case "de" -> "Deutsch";
            case "es" -> "Español";
            default -> "English";
        };
    }
    public static String contentKey(String value) {
        String normalized = value == null ? "" : value.trim();
        return StringUtils.hasText(normalized) ? normalized.replaceFirst("-(hu|de|es)$", "") : "";
    }
}
