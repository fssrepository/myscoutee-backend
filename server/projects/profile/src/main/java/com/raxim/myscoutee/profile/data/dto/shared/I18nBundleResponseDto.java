package com.raxim.myscoutee.profile.data.dto.shared;

import java.util.Map;

public record I18nBundleResponseDto(String lang, String version, Map<String, String> data, String founderName) {
    public I18nBundleResponseDto(String lang, String version, Map<String, String> data) {
        this(lang, version, data, "");
    }
}
