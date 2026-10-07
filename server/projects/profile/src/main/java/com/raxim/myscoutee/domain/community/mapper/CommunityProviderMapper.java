package com.raxim.myscoutee.domain.community.mapper;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.community.document.CommunityProvider;
import com.raxim.myscoutee.domain.community.dto.OperatorCommunityDtos.CommunityProviderDto;

@Component
public class CommunityProviderMapper {
    private static final int MAX_NAME_LENGTH = 120;
    private static final int MAX_PURPOSE_LENGTH = 240;
    private static final int MAX_URL_LENGTH = 2048;

    public CommunityProviderDto toDto(CommunityProvider provider) {
        if (provider == null || !StringUtils.hasText(provider.getId())) {
            throw invalidMetadata("id");
        }
        return new CommunityProviderDto(
                normalizedText(provider.getId(), 80, "id")
                        .toLowerCase(Locale.ROOT),
                normalizedText(provider.getName(), MAX_NAME_LENGTH, "name"),
                normalizedText(
                        provider.getPurpose(),
                        MAX_PURPOSE_LENGTH,
                        "purpose"),
                validatedUrl(provider.getUrl()),
                Boolean.TRUE.equals(provider.getConfigured()),
                Boolean.TRUE.equals(provider.getAvailable()));
    }

    private String normalizedText(
            String value,
            int maximumLength,
            String fieldName) {
        if (!StringUtils.hasText(value)) {
            throw invalidMetadata(fieldName);
        }
        String normalized = value.trim();
        if (normalized.length() > maximumLength
                || normalized.chars().anyMatch(Character::isISOControl)) {
            throw invalidMetadata(fieldName);
        }
        return normalized;
    }

    private String validatedUrl(String value) {
        String normalized = normalizedText(value, MAX_URL_LENGTH, "url");
        try {
            URI uri = new URI(normalized);
            if (!"https".equalsIgnoreCase(uri.getScheme())
                    || uri.getHost() == null
                    || uri.getUserInfo() != null) {
                throw invalidMetadata("url");
            }
            return normalized;
        } catch (URISyntaxException exception) {
            throw invalidMetadata("url");
        }
    }

    private IllegalStateException invalidMetadata(String fieldName) {
        return new IllegalStateException(
                "Community provider catalog contains invalid "
                        + fieldName + ".");
    }
}
