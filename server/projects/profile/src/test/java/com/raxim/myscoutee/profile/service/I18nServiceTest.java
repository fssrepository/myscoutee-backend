package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.I18nBundle;
import com.raxim.myscoutee.profile.data.document.I18nMessage;
import com.raxim.myscoutee.profile.data.dto.shared.I18nBundleResponseDto;
import com.raxim.myscoutee.profile.repository.I18nBundleRepository;
import com.raxim.myscoutee.profile.repository.I18nMessageRepository;

class I18nServiceTest {
    @Test
    void returnsTheMongoBackedEnglishBundle() {
        I18nMessageRepository messageRepository =
                org.mockito.Mockito.mock(I18nMessageRepository.class);
        I18nBundleRepository bundleRepository =
                org.mockito.Mockito.mock(I18nBundleRepository.class);
        I18nBundle bundle = bundle("en", "2026.07.29.en.46");
        I18nMessage title = message(
                "en",
                "add.myscoutee.to.your.home.screen",
                "Add {productName} to your home screen");
        I18nMessage description = message(
                "en",
                "install.prompt.description",
                "Install {productName} for quick access from your home screen.");
        when(bundleRepository.findAll()).thenReturn(List.of(bundle));
        when(bundleRepository.findByLang("en")).thenReturn(Optional.of(bundle));
        when(messageRepository.findByLang("en")).thenReturn(List.of(title, description));

        I18nBundleResponseDto response =
                new I18nService(messageRepository, bundleRepository)
                        .getBundle("en", "en-US", null);

        assertThat(response.lang()).isEqualTo("en");
        assertThat(response.version()).isEqualTo("2026.07.29.en.46");
        assertThat(response.data())
                .containsEntry(
                        "add.myscoutee.to.your.home.screen",
                        "Add {productName} to your home screen");
        assertThat(response.data())
                .containsEntry(
                        "install.prompt.description",
                        "Install {productName} for quick access from your home screen.");
        verify(messageRepository).findByLang("en");
    }

    @Test
    void returnsTheMongoBackedHungarianInstallPromptBundle() {
        I18nMessageRepository messageRepository =
                org.mockito.Mockito.mock(I18nMessageRepository.class);
        I18nBundleRepository bundleRepository =
                org.mockito.Mockito.mock(I18nBundleRepository.class);
        I18nBundle englishBundle = bundle("en", "2026.07.29.en.46");
        I18nBundle hungarianBundle = bundle("hu", "2026.07.29.hu.46");
        I18nMessage title = message(
                "hu",
                "add.myscoutee.to.your.home.screen",
                "{productName} hozzáadása a kezdőképernyőhöz");
        I18nMessage description = message(
                "hu",
                "install.prompt.description",
                "{productName} telepítésével gyorsan elérheted az alkalmazást a kezdőképernyőről.");
        when(bundleRepository.findAll()).thenReturn(List.of(englishBundle, hungarianBundle));
        when(bundleRepository.findByLang("hu")).thenReturn(Optional.of(hungarianBundle));
        when(messageRepository.findByLang("hu")).thenReturn(List.of(title, description));

        I18nBundleResponseDto response =
                new I18nService(messageRepository, bundleRepository)
                        .getBundle("hu", "hu-HU,en-US", null);

        assertThat(response.lang()).isEqualTo("hu");
        assertThat(response.version()).isEqualTo("2026.07.29.hu.46");
        assertThat(response.data())
                .containsEntry(
                        "add.myscoutee.to.your.home.screen",
                        "{productName} hozzáadása a kezdőképernyőhöz")
                .containsEntry(
                        "install.prompt.description",
                        "{productName} telepítésével gyorsan elérheted az alkalmazást a kezdőképernyőről.");
        verify(messageRepository).findByLang("hu");
    }

    @Test
    void returnsNoPayloadWhenTheEnglishClientAlreadyHasTheLatestVersion() {
        I18nMessageRepository messageRepository =
                org.mockito.Mockito.mock(I18nMessageRepository.class);
        I18nBundleRepository bundleRepository =
                org.mockito.Mockito.mock(I18nBundleRepository.class);
        I18nBundle bundle = bundle("en", "2026.07.29.en.46");
        when(bundleRepository.findAll()).thenReturn(List.of(bundle));
        when(bundleRepository.findByLang("en")).thenReturn(Optional.of(bundle));

        I18nBundleResponseDto response =
                new I18nService(messageRepository, bundleRepository)
                        .getBundle(
                                "en",
                                "en-US",
                                "2026.07.29.en.46");

        assertThat(response.lang()).isEqualTo("en");
        assertThat(response.version()).isEqualTo("2026.07.29.en.46");
        assertThat(response.data()).isNull();
    }

    private static I18nBundle bundle(String lang, String version) {
        I18nBundle bundle = new I18nBundle();
        bundle.setLang(lang);
        bundle.setVersion(version);
        return bundle;
    }

    private static I18nMessage message(
            String lang,
            String key,
            String value) {
        I18nMessage message = new I18nMessage();
        message.setLang(lang);
        message.setKey(key);
        message.setValue(value);
        return message;
    }
}
