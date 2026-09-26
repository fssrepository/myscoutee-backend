package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/** Shared consent for a pair; saving a private contact never grants this permission. */
@Document(collection = "contactChatAccess")
public record ContactChatAccess(@Id String id, @Indexed String leftUserId, @Indexed String rightUserId,
        String requestedBy, String status, String requestedAtIso, String decidedAtIso, @Version Long version) {
    public static String pairId(String first, String second) {
        String left = first.compareTo(second) < 0 ? first : second;
        String right = first.compareTo(second) < 0 ? second : first;
        return left.length() + ":" + left + right;
    }
}
