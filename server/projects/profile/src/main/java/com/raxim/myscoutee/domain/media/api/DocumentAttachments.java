package com.raxim.myscoutee.domain.media.api;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.media.dto.DocumentAttachment;

public final class DocumentAttachments {
    private DocumentAttachments() {}
    public static void validate(DocumentAttachment file, List<String> owners, List<DocumentAttachment> existing) {
        if (file == null || file.name() == null || file.name().isBlank() || file.name().length() > 250 || file.url() == null
                || file.mimeType() == null || file.sizeBytes() <= 0 || file.sizeBytes() > 10485760) throw error(HttpStatus.BAD_REQUEST);
        if (existing != null && existing.contains(file)) return;
        String key;
        try {
            if (!file.url().startsWith("/api/media/private?key=")) throw error(HttpStatus.BAD_REQUEST);
            key = java.net.URLDecoder.decode(file.url().substring("/api/media/private?key=".length()), java.nio.charset.StandardCharsets.UTF_8);
        } catch (RuntimeException ex) { throw error(HttpStatus.BAD_REQUEST); }
        if (!com.raxim.myscoutee.domain.media.api.MediaAccessPaths.validKey(key)) throw error(HttpStatus.BAD_REQUEST);
        var parts = key.split("/");
        if (parts.length != 5 || !"private".equals(parts[0]) || !"documents".equals(parts[1])
                || !owners.stream().map(com.raxim.myscoutee.domain.media.api.MediaAccessPaths::storageSegment).anyMatch(parts[2]::equals))
            throw error(HttpStatus.BAD_REQUEST);
    }
    private static ResponseStatusException error(HttpStatus status) { return new ResponseStatusException(status); }
}
