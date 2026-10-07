package com.raxim.myscoutee.domain.localization.service;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.context.support.AbstractMessageSource;
import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.localization.document.I18nMessage;
import com.raxim.myscoutee.domain.localization.repository.I18nMessageRepository;

@Component("messageSource")
public class DBMessageSource extends AbstractMessageSource {

    private final I18nMessageRepository i18nMessageRepository;
    private final Map<String, Map<String, String>> cachedMessages = new ConcurrentHashMap<>();

    public DBMessageSource(I18nMessageRepository i18nMessageRepository) {
        this.i18nMessageRepository = i18nMessageRepository;
    }

    @Override
    protected String resolveCodeWithoutArguments(String code, Locale locale) {
        String value = messages(locale.getLanguage()).get(code);
        return value != null || "en".equals(locale.getLanguage()) ? value : messages("en").get(code);
    }

    @Override
    protected MessageFormat resolveCode(String code, Locale locale) {
        String value = resolveCodeWithoutArguments(code, locale);
        return value == null ? null : new MessageFormat(value, locale);
    }

    private Map<String, String> messages(String lang) {
        String key = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode().name() + ":" + lang;
        if (cachedMessages.size() >= 64 && !cachedMessages.containsKey(key)) cachedMessages.clear();
        return cachedMessages.computeIfAbsent(key, ignored -> loadMessagesForLang(lang));
    }

    private Map<String, String> loadMessagesForLang(String lang) {
        // UI bundles can contain named placeholders; parse MessageFormat only for a requested parameterized server message.
        return i18nMessageRepository.findByLang(lang).stream()
                .collect(Collectors.toMap(I18nMessage::getKey, I18nMessage::getValue, (first, second) -> first));
    }

    // Refresh cache method
    public void refreshCache() {
        cachedMessages.clear();
    }
}
