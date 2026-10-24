package com.raxim.myscoutee.microservices.transport.affinity;

import java.io.IOException;
import java.util.List;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.ObjectMapper;

public final class RatingDirectoryProtocol {
    private static final String ROOT = "/_internal/v1/affinity/ratings/";
    public static final String ALL=ROOT+"all", RELEVANT=ROOT+"relevant", EXCLUSIONS=ROOT+"home-game-exclusions", POSITIVE=ROOT+"positive-campaign";
    public static final int MAX_QUERY_BYTES=1024*1024, MAX_RESPONSE_BYTES=2*1024*1024;
    private RatingDirectoryProtocol() {}
    public record Error(String code) {}
    record IdsQuery(List<String> ids) {}
    public static String[] paths() { return new String[]{ALL, RELEVANT, EXCLUSIONS, POSITIVE}; }
    static boolean validId(String id) { return id == null || id.length() <= 512; }
    static List<String> readIds(HttpServletRequest request, ObjectMapper mapper) throws IOException {
        return ReadQueryBodies.readIds(request, mapper, MAX_QUERY_BYTES);
    }
    static byte[] encode(Iterable<String> ids, ObjectMapper mapper) {
        return ReadQueryBodies.encodeIds(ids, mapper, MAX_QUERY_BYTES,
                "Invalid affinity directory IDs.", "Affinity query exceeds size limit.");
    }
}
