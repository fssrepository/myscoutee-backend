package com.raxim.myscoutee.profile.service.mapper;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.IdeaPost;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;

@Component
public class IdeaPostMapper {
    private static final String DEFAULT_LANG = "en";

    public IdeaPostDto toDto(IdeaPost post) {
        return new IdeaPostDto(
                normalize(post.getId()),
                text(post.getContentKey(), contentKeyFromId(post.getId())),
                contentLang(post.getLang()),
                languageLabel(post.getLang()),
                text(post.getTitle(), "Untitled idea"),
                normalize(post.getExcerpt()),
                normalize(post.getContentHtml()),
                normalize(post.getImageUrl()),
                post.getImageUrls() == null
                        ? List.of()
                        : post.getImageUrls().stream()
                                .map(this::normalize)
                                .filter(StringUtils::hasText)
                                .distinct()
                                .toList(),
                Boolean.TRUE.equals(post.getFeatured()),
                !Boolean.FALSE.equals(post.getPublished()),
                Boolean.TRUE.equals(post.getTrashed()),
                normalize(post.getTrashedAtIso()),
                normalize(post.getTrashedByUserId()),
                normalize(post.getSubmittedAtIso()),
                normalize(post.getCreatedDate()),
                normalize(post.getCreatedUser()),
                normalize(post.getUpdatedDate()),
                normalize(post.getUpdatedUser()));
    }

    private String contentLang(String value) {
        String normalized = normalize(value).toLowerCase();
        int semicolonIndex = normalized.indexOf(';');
        if (semicolonIndex > 0) {
            normalized = normalized.substring(0, semicolonIndex);
        }
        int dashIndex = normalized.indexOf('-');
        if (dashIndex > 0) {
            normalized = normalized.substring(0, dashIndex);
        }
        return "hu".equals(normalized) ? "hu" : DEFAULT_LANG;
    }

    private String languageLabel(String lang) {
        return "hu".equals(contentLang(lang)) ? "Magyar" : "English";
    }

    private String contentKeyFromId(String id) {
        String normalized = normalize(id);
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return normalized.endsWith("-hu")
                ? normalized.substring(0, normalized.length() - 3)
                : normalized;
    }

    private String text(String value, String fallback) {
        String normalized = normalize(value);
        return StringUtils.hasText(normalized) ? normalized : fallback;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}
