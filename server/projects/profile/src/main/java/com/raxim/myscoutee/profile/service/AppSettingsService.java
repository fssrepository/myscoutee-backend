package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.AppSettings;
import com.raxim.myscoutee.profile.repository.AppSettingsRepository;

import jakarta.annotation.PostConstruct;

@Service
public class AppSettingsService {
    public static final String GLOBAL_SETTINGS_ID = "app-settings-global";
    public static final String GLOBAL_SETTINGS_KEY = "global";

    private static final Logger LOGGER = LoggerFactory.getLogger(AppSettingsService.class);

    private final AppSettingsRepository appSettingsRepository;
    private final ConfigProperties configProperties;
    private final AtomicReference<CachedAppSettings> cachedSettings =
            new AtomicReference<>(new CachedAppSettings(true, Set.of()));

    public AppSettingsService(AppSettingsRepository appSettingsRepository, ConfigProperties configProperties) {
        this.appSettingsRepository = appSettingsRepository;
        this.configProperties = configProperties;
    }

    @PostConstruct
    public void preloadCache() {
        refreshCache();
    }

    @Scheduled(fixedDelayString = "${app-settings.cache-refresh-ms:5000}")
    public void refreshCache() {
        try {
            cachedSettings.set(toCachedSettings(loadOrCreateGlobalSettings()));
        } catch (RuntimeException exception) {
            LOGGER.warn("App settings cache refresh failed; keeping previous admin access settings.", exception);
        }
    }

    public void evictCache() {
        refreshCache();
    }

    public boolean isAdminEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (!StringUtils.hasText(normalizedEmail)) {
            return false;
        }
        CachedAppSettings settings = cachedSettings.get();
        return settings.adminAccessEnabled() && settings.adminEmails().contains(normalizedEmail);
    }

    public List<String> adminEmails() {
        return List.copyOf(cachedSettings.get().adminEmails());
    }

    private AppSettings loadOrCreateGlobalSettings() {
        return appSettingsRepository.findBySettingsKey(GLOBAL_SETTINGS_KEY)
                .orElseGet(this::createGlobalSettings);
    }

    private AppSettings createGlobalSettings() {
        AppSettings settings = new AppSettings();
        settings.setId(GLOBAL_SETTINGS_ID);
        settings.setSettingsKey(GLOBAL_SETTINGS_KEY);
        settings.setAdminAccessEnabled(true);
        settings.setAdminEmails(configProperties.getAdminUsers().stream()
                .map(this::normalizeEmail)
                .filter(StringUtils::hasText)
                .distinct()
                .toList());
        String nowIso = Instant.now().toString();
        settings.setCreatedDate(nowIso);
        settings.setUpdatedDate(nowIso);
        try {
            return appSettingsRepository.save(settings);
        } catch (DuplicateKeyException ignored) {
            return appSettingsRepository.findBySettingsKey(GLOBAL_SETTINGS_KEY)
                    .orElse(settings);
        }
    }

    private CachedAppSettings toCachedSettings(AppSettings settings) {
        if (settings == null) {
            return new CachedAppSettings(true, Set.of());
        }
        LinkedHashSet<String> adminEmails = new LinkedHashSet<>();
        for (String email : settings.getAdminEmails() == null ? List.<String>of() : settings.getAdminEmails()) {
            String normalizedEmail = normalizeEmail(email);
            if (StringUtils.hasText(normalizedEmail)) {
                adminEmails.add(normalizedEmail);
            }
        }
        return new CachedAppSettings(Boolean.TRUE.equals(settings.getAdminAccessEnabled()), Set.copyOf(adminEmails));
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private record CachedAppSettings(boolean adminAccessEnabled, Set<String> adminEmails) {}
}
