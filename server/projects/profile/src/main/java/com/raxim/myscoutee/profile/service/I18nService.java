package com.raxim.myscoutee.profile.service;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.document.I18nBundle;
import com.raxim.myscoutee.profile.data.document.I18nMessage;
import com.raxim.myscoutee.profile.data.dto.shared.I18nBundleResponseDto;
import com.raxim.myscoutee.profile.repository.I18nBundleRepository;
import com.raxim.myscoutee.profile.repository.I18nMessageRepository;

@Service
public class I18nService {
    private final I18nMessageRepository i18nMessageRepository;
    private final I18nBundleRepository i18nBundleRepository;

    public I18nService(I18nMessageRepository i18nMessageRepository, I18nBundleRepository i18nBundleRepository) {
        this.i18nMessageRepository = i18nMessageRepository;
        this.i18nBundleRepository = i18nBundleRepository;
    }

    public I18nBundleResponseDto getBundle(String lang, String currentVersion) {
        String latestVersion = i18nBundleRepository.findByLang(lang)
                .map(I18nBundle::getVersion)
                .orElse("0");

        if (latestVersion.equals(currentVersion)) {
            return new I18nBundleResponseDto(latestVersion, null);
        }

        Map<String, String> data = i18nMessageRepository.findByLang(lang).stream()
                .collect(Collectors.toMap(I18nMessage::getKey, I18nMessage::getValue, (v1, v2) -> v1));

        return new I18nBundleResponseDto(latestVersion, data);
    }
}
