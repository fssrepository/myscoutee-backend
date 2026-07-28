package com.raxim.myscoutee.profile.service.operator;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Locale;
import java.util.Set;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.PaymentProvider;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentProviderDto;

@Component
public class PaymentProviderMapper {
    private static final int MAX_LOGO_URL_LENGTH = 2048;
    private static final int MAX_LOGO_ALT_LENGTH = 160;
    private static final Set<String> ALLOWED_PALETTES = Set.of(
            "slate",
            "blue",
            "sky",
            "cyan",
            "teal",
            "green",
            "mint",
            "violet",
            "purple",
            "pink",
            "rose",
            "red",
            "orange",
            "amber",
            "gold",
            "brown");

    public PaymentProviderDto toDto(PaymentProvider provider) {
        if (provider == null
                || !StringUtils.hasText(provider.getId())
                || !StringUtils.hasText(provider.getLabel())) {
            throw new IllegalStateException(
                    "Payment provider catalog contains an incomplete record.");
        }
        return new PaymentProviderDto(
                provider.getId().trim().toLowerCase(Locale.ROOT),
                provider.getLabel().trim(),
                validatedLogoUrl(provider.getLogoUrl()),
                validatedOptionalText(
                        provider.getLogoAlt(),
                        MAX_LOGO_ALT_LENGTH,
                        "logoAlt"),
                validatedPalette(provider.getPalette()));
    }

    private String validatedLogoUrl(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String normalized = value.trim();
        if (normalized.length() > MAX_LOGO_URL_LENGTH
                || normalized.indexOf('\\') >= 0
                || normalized.chars().anyMatch(Character::isISOControl)) {
            throw invalidMetadata("logoUrl");
        }
        try {
            URI uri = new URI(normalized);
            if (uri.getQuery() != null || uri.getFragment() != null) {
                throw invalidMetadata("logoUrl");
            }
            if (!uri.isAbsolute()) {
                String path = uri.getPath();
                if (path == null
                        || (!path.startsWith("assets/") && !path.startsWith("/assets/"))
                        || containsParentTraversal(path)) {
                    throw invalidMetadata("logoUrl");
                }
                return normalized;
            }
            if (!"https".equalsIgnoreCase(uri.getScheme())
                    || uri.getHost() == null
                    || uri.getUserInfo() != null) {
                throw invalidMetadata("logoUrl");
            }
            return normalized;
        } catch (URISyntaxException exception) {
            throw invalidMetadata("logoUrl");
        }
    }

    private boolean containsParentTraversal(String path) {
        for (String segment : path.split("/")) {
            if ("..".equals(segment)) {
                return true;
            }
        }
        return false;
    }

    private String validatedOptionalText(
            String value,
            int maximumLength,
            String fieldName) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String normalized = value.trim();
        if (normalized.length() > maximumLength
                || normalized.chars().anyMatch(Character::isISOControl)) {
            throw invalidMetadata(fieldName);
        }
        return normalized;
    }

    private String validatedPalette(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_PALETTES.contains(normalized)) {
            throw invalidMetadata("palette");
        }
        return normalized;
    }

    private IllegalStateException invalidMetadata(String fieldName) {
        return new IllegalStateException(
                "Payment provider catalog contains invalid " + fieldName + ".");
    }
}
