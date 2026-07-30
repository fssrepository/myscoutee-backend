package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.I18nBundle;
import com.raxim.myscoutee.profile.data.document.I18nMessage;
import com.raxim.myscoutee.profile.data.dto.shared.I18nBundleResponseDto;
import com.raxim.myscoutee.profile.repository.I18nBundleRepository;
import com.raxim.myscoutee.profile.repository.I18nMessageRepository;

@Service
public class I18nService {
    private static final String DEFAULT_LANG = "en";

    private final I18nMessageRepository i18nMessageRepository;
    private final I18nBundleRepository i18nBundleRepository;

    public I18nService(I18nMessageRepository i18nMessageRepository, I18nBundleRepository i18nBundleRepository) {
        this.i18nMessageRepository = i18nMessageRepository;
        this.i18nBundleRepository = i18nBundleRepository;
    }

    public I18nBundleResponseDto getBundle(String requestedLang, String acceptLanguage, String currentVersion) {
        String selectedLang = selectLanguage(requestedLang, acceptLanguage);
        I18nBundle i18nBundle = i18nBundleRepository.findByLang(selectedLang).orElse(null);
        if (i18nBundle == null) {
            return new I18nBundleResponseDto(DEFAULT_LANG, "0", null);
        }

        String latestVersion = safeText(i18nBundle.getVersion(), "0");

        if (latestVersion.equals(safeText(currentVersion, ""))) {
            return new I18nBundleResponseDto(selectedLang, latestVersion, null);
        }

        Map<String, String> data = i18nMessageRepository.findByLang(selectedLang).stream()
                .collect(Collectors.toMap(I18nMessage::getKey, I18nMessage::getValue, (v1, v2) -> v1));

        return new I18nBundleResponseDto(selectedLang, latestVersion, data);
    }

    private String selectLanguage(String requestedLang, String acceptLanguage) {
        Set<String> availableLangs = i18nBundleRepository.findAll().stream()
                .map(I18nBundle::getLang)
                .map(this::normalizeLang)
                .filter(lang -> !lang.isBlank())
                .collect(Collectors.toSet());
        if (availableLangs.isEmpty()) {
            return DEFAULT_LANG;
        }

        for (String candidate : languageCandidates(requestedLang, acceptLanguage)) {
            if (DEFAULT_LANG.equals(candidate)) {
                return DEFAULT_LANG;
            }
            if (availableLangs.contains(candidate)) {
                return candidate;
            }
        }
        return DEFAULT_LANG;
    }

    private List<String> languageCandidates(String requestedLang, String acceptLanguage) {
        LinkedHashSet<String> candidates = new LinkedHashSet<>();
        String explicitLang = normalizeLang(requestedLang);
        if (!explicitLang.isBlank()) {
            candidates.add(explicitLang);
        }
        parseAcceptLanguage(acceptLanguage).stream()
                .map(LanguagePreference::lang)
                .forEach(candidates::add);
        candidates.add(DEFAULT_LANG);
        return new ArrayList<>(candidates);
    }

    private List<LanguagePreference> parseAcceptLanguage(String acceptLanguage) {
        String raw = safeText(acceptLanguage, "");
        if (raw.isBlank()) {
            return List.of();
        }
        String[] parts = raw.split(",");
        List<LanguagePreference> preferences = new ArrayList<>();
        for (int index = 0; index < parts.length; index++) {
            String part = parts[index].trim();
            if (part.isBlank()) {
                continue;
            }
            String[] tokens = part.split(";");
            String lang = normalizeLang(tokens[0]);
            if (lang.isBlank()) {
                continue;
            }
            double quality = 1.0d;
            for (int tokenIndex = 1; tokenIndex < tokens.length; tokenIndex++) {
                String token = tokens[tokenIndex].trim();
                if (!token.startsWith("q=")) {
                    continue;
                }
                try {
                    quality = Double.parseDouble(token.substring(2));
                } catch (NumberFormatException ignored) {
                    quality = 1.0d;
                }
            }
            preferences.add(new LanguagePreference(lang, quality, index));
        }
        preferences.sort(Comparator
                .comparingDouble(LanguagePreference::quality)
                .reversed()
                .thenComparingInt(LanguagePreference::index));
        return preferences;
    }

    private String normalizeLang(String value) {
        String raw = safeText(value, "").toLowerCase();
        int commaIndex = raw.indexOf(',');
        if (commaIndex >= 0) {
            raw = raw.substring(0, commaIndex);
        }
        int semicolonIndex = raw.indexOf(';');
        if (semicolonIndex >= 0) {
            raw = raw.substring(0, semicolonIndex);
        }
        int dashIndex = raw.indexOf('-');
        if (dashIndex >= 0) {
            raw = raw.substring(0, dashIndex);
        }
        return raw.chars()
                .filter(ch -> ch >= 'a' && ch <= 'z')
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    private String safeText(String value, String fallback) {
        String text = Objects.toString(value, "").trim();
        return text.isBlank() ? fallback : text;
    }

    private record LanguagePreference(String lang, double quality, int index) {
    }
}
