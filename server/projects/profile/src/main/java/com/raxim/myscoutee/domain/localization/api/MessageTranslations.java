package com.raxim.myscoutee.domain.localization.api;

/** Resolves an unparameterized server message in the current request locale. */
public interface MessageTranslations {
    String t(String key);
}
