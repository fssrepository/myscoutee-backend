package com.raxim.myscoutee.domain.localization.api;

/** Resolves a server message using the current request locale. */
public interface Translations {
    String t(String key, Object... args);
}
