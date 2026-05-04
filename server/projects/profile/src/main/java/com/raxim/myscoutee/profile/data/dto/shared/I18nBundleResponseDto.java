package com.raxim.myscoutee.profile.data.dto.shared;

import java.util.Map;

public record I18nBundleResponseDto(String lang, String version, Map<String, String> data) {
}
