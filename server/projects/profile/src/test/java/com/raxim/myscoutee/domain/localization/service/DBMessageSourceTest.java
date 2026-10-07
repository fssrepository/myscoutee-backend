package com.raxim.myscoutee.domain.localization.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Locale;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.localization.repository.I18nMessageRepository;
import com.raxim.myscoutee.domain.localization.document.I18nMessage;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;

@org.junit.jupiter.api.Tag("standard")
class DBMessageSourceTest {
    @Test void rawUiPlaceholdersDoNotBreakServerMessagesAndCachesAreDatabaseScoped() {
        var repository = mock(I18nMessageRepository.class);
        when(repository.findByLang("en")).thenAnswer(call -> List.of(
                message("server.key", MongoSessionModeContext.currentMode().name()),
                message("ui.key", "Hello {name}")));
        var source = new DBMessageSource(repository);
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            assertThat(source.getMessage("server.key", null, Locale.ENGLISH)).isEqualTo("REAL");
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
            assertThat(source.getMessage("server.key", null, Locale.ENGLISH)).isEqualTo("DEMO");
            assertThat(source.getMessage("ui.key", null, Locale.ENGLISH)).isEqualTo("Hello {name}");
            verify(repository, times(2)).findByLang("en");
        } finally { MongoSessionModeContext.clear(); }
    }
    private I18nMessage message(String key, String value) {
        var message = new I18nMessage(); message.setKey(key); message.setLang("en"); message.setValue(value); return message;
    }
}
