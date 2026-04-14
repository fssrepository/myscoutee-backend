package com.raxim.myscoutee.profile.service;

import java.text.MessageFormat;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.context.support.AbstractMessageSource;
import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.data.document.I18nMessage;
import com.raxim.myscoutee.profile.repository.I18nMessageRepository;

@Component("messageSource")
public class DBMessageSource extends AbstractMessageSource {

    private final I18nMessageRepository i18nMessageRepository;
    private final Map<String, Map<String, MessageFormat>> cachedMessages = new ConcurrentHashMap<>();

    public DBMessageSource(I18nMessageRepository i18nMessageRepository) {
        this.i18nMessageRepository = i18nMessageRepository;
    }

    @Override
    protected MessageFormat resolveCode(String code, Locale locale) {
        String lang = locale.getLanguage();
        Map<String, MessageFormat> langCache = cachedMessages.computeIfAbsent(lang, this::loadMessagesForLang);
        return langCache.get(code);
    }

    private Map<String, MessageFormat> loadMessagesForLang(String lang) {
        return i18nMessageRepository.findByLang(lang).stream()
                .collect(Collectors.toMap(
                        I18nMessage::getKey,
                        m -> new MessageFormat(m.getValue(), Locale.forLanguageTag(lang)),
                        (v1, v2) -> v1
                ));
    }

    // Refresh cache method
    public void refreshCache() {
        cachedMessages.clear();
    }
}
