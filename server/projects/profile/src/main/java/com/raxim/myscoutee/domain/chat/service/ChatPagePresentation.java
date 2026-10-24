package com.raxim.myscoutee.domain.chat.service;

import java.util.List;
import java.util.Map;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatDto;

/** Optional owner presentation for a page already selected by the chat service. */
public interface ChatPagePresentation {
    List<ChatDto> present(List<Chat> records, Map<String, ProfileSummary> usersById);

    static String resolveUserImageUrl(ProfileSummary user) {
        if (user == null || user.getImages() == null) {
            return "";
        }
        return user.getImages().stream()
                .map(ChatPagePresentation::chatText)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse("");
    }


    static String buildInitials(String value) {
        String normalized = chatText(value);
        if (!org.springframework.util.StringUtils.hasText(normalized)) {
            return "CH";
        }
        String[] parts = normalized.split("\\s+");
        if (parts.length == 1) {
            return parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase(java.util.Locale.US);
        }
        return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase(java.util.Locale.US);
    }


    private static String chatText(String value) { return value == null ? "" : value.trim(); }

}
