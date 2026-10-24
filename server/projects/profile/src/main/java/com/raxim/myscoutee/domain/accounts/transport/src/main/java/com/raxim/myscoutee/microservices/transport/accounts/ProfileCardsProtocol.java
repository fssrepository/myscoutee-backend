package com.raxim.myscoutee.microservices.transport.accounts;

import java.io.IOException;
import java.util.List;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.ObjectMapper;

public final class ProfileCardsProtocol {
    public static final String PATH = "/_internal/v1/accounts/profile-cards";
    public static final String PROFILES = PATH + "/profiles";
    public static final String PRESENT = PATH + "/present";
    public static final int MAX_QUERY_BYTES=1024*1024, MAX_RESPONSE_BYTES=8*1024*1024;
    private ProfileCardsProtocol() {}
    public record Error(String code) {}
    record IdsQuery(List<String> ids) {}
    public static String[] paths() { return new String[]{PATH, PRESENT, PROFILES}; }
    static boolean validId(String id) { return id == null || id.length() <= 512; }
    static List<String> readIds(HttpServletRequest request, ObjectMapper mapper) throws IOException {
        return ReadQueryBodies.readIds(request, mapper, MAX_QUERY_BYTES);
    }
    static byte[] encode(Iterable<String> ids, ObjectMapper mapper) {
        return ReadQueryBodies.encodeIds(ids, mapper, MAX_QUERY_BYTES,
                "Invalid rating profile IDs.", "Rating profile query exceeds size limit.");
    }
}
