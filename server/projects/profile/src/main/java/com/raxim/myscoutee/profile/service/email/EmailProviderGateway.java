package com.raxim.myscoutee.profile.service.email;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.EmailProperties;

@Service
public class EmailProviderGateway {
    private final EmailProperties emailProperties;
    private final Map<String, EmailProvider> providersByKey = new LinkedHashMap<>();

    public EmailProviderGateway(
            EmailProperties emailProperties,
            List<EmailProvider> providers) {
        this.emailProperties = emailProperties;
        for (EmailProvider provider : providers) {
            if (provider == null || !StringUtils.hasText(provider.providerKey())) {
                continue;
            }
            providersByKey.put(provider.providerKey().trim().toLowerCase(Locale.ROOT), provider);
        }
    }

    public String currentProviderKey() {
        String configured = normalizeProviderKey(emailProperties.getProvider());
        return providersByKey.containsKey(configured) ? configured : "noop";
    }

    public EmailSendResult send(EmailSendRequest request) {
        return providersByKey.getOrDefault(currentProviderKey(), providersByKey.get("noop")).send(request);
    }

    private String normalizeProviderKey(String value) {
        String normalized = value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
        return normalized.isEmpty() ? "noop" : normalized;
    }
}
