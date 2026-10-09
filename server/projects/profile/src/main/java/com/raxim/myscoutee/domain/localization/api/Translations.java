package com.raxim.myscoutee.domain.localization.api;

/** Resolves a server message using the current request locale. */
public interface Translations extends MessageTranslations {
    @Override default String t(String key) { return t(key, new Object[0]); }
    String t(String key, Object... args);
}
