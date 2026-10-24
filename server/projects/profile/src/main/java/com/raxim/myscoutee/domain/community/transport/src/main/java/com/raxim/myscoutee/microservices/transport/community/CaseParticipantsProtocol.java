package com.raxim.myscoutee.microservices.transport.community;

import java.io.IOException;

import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

public final class CaseParticipantsProtocol {
    public static final String CONVERSATION = "/_internal/v1/community/cases/conversation";
    public static final String ACTIVE = "/_internal/v1/community/cases/active-accounts";
    public static final String ADMINS_CHANGED = "/_internal/v1/community/cases/admins-changed";
    public static final int MAX_QUERY_BYTES = 1024 * 1024;
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private CaseParticipantsProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{CONVERSATION, ACTIVE, ADMINS_CHANGED}; }
    static boolean validId(String value) { return value == null || value.length() <= 512; }
    private static boolean validIdNode(JsonNode value) {
        return value != null && (value.isNull() || value.isString() && value.asString().length() <= 512);
    }
    public record AdminChange(String groupId, java.util.List<String> adminAccountIds) {}
    static AdminChange read(HttpServletRequest request, ObjectMapper mapper) throws IOException {
        var query = ReadQueryBodies.read(request, mapper, MAX_QUERY_BYTES);
        if (query == null || !query.isObject() || query.size() != 2
                || !validIdNode(query.get("groupId")) || !query.has("adminAccountIds")) throw new RejectedQuery(400, "INVALID_REQUEST");
        var groups = query.get("adminAccountIds");
        if (!groups.isNull()) {
            if (!groups.isArray() || groups.size() > 4096) throw new RejectedQuery(400, "INVALID_REQUEST");
            for (var id : groups) if (!validIdNode(id)) throw new RejectedQuery(400, "INVALID_REQUEST");
        }
        var value = mapper.treeToValue(query, AdminChange.class);
        try { encode(value, mapper); } catch (IllegalArgumentException invalid) { throw new RejectedQuery(400, "INVALID_REQUEST"); }
        return value;
    }
    static byte[] encode(AdminChange query, ObjectMapper mapper) {
        if (query.groupId() == null || query.groupId().isBlank() || !validId(query.groupId())
                || query.adminAccountIds() == null || query.adminAccountIds().size() > 4096
                || !query.adminAccountIds().stream().allMatch(id -> id != null && !id.isBlank() && validId(id)))
            throw new IllegalArgumentException("Invalid case visibility query.");
        var body = mapper.writeValueAsBytes(query);
        if (body.length > MAX_QUERY_BYTES) throw new IllegalArgumentException("Case visibility query exceeds size limit.");
        return body;
    }
}
