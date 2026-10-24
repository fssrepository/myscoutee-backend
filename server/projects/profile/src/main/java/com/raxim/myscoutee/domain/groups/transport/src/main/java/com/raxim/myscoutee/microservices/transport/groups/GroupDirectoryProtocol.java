package com.raxim.myscoutee.microservices.transport.groups;

import java.io.IOException;
import java.util.List;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.ObjectMapper;

public final class GroupDirectoryProtocol {
    private static final String ROOT = "/_internal/v1/groups/directory/";
    public static final String ENTRY=ROOT+"entry", ENTRIES=ROOT+"entries", ALL_IDS=ROOT+"all-ids",
            BASES=ROOT+"workspace-bases", NAME=ROOT+"name", TYPE=ROOT+"type",
            ACTIVE=ROOT+"active-community-ids", BASE_IDS=ROOT+"base-ids", WORK_IDS=ROOT+"work-ids";
    public static final int MAX_QUERY_BYTES=1024*1024, MAX_RESPONSE_BYTES=2*1024*1024;
    private GroupDirectoryProtocol() {}
    public record Error(String code) {}
    record IdsQuery(List<String> ids) {}
    public static String[] paths() { return new String[]{ENTRY, ENTRIES, ALL_IDS, BASES, NAME, TYPE, ACTIVE, BASE_IDS, WORK_IDS}; }
    static boolean validId(String id) { return id == null || id.length() <= 512; }
    static List<String> readIds(HttpServletRequest request, ObjectMapper mapper) throws IOException {
        return ReadQueryBodies.readIds(request, mapper, MAX_QUERY_BYTES);
    }
    static byte[] encode(Iterable<String> ids, ObjectMapper mapper) {
        return ReadQueryBodies.encodeIds(ids, mapper, MAX_QUERY_BYTES,
                "Invalid group directory IDs.", "Group query exceeds size limit.");
    }
}
