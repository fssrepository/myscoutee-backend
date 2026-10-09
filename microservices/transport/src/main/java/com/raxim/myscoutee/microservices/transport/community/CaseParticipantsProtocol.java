package com.raxim.myscoutee.microservices.transport.community;

import java.io.IOException;
import com.raxim.myscoutee.domain.community.dto.CaseVisibilityQueryDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

public final class CaseParticipantsProtocol {
    public static final String CONVERSATION = "/_internal/v1/community/cases/conversation";
    public static final String ACTIVE = "/_internal/v1/community/cases/active-accounts";
    public static final String COUNT = "/_internal/v1/community/cases/visible-count";
    public static final int MAX_QUERY_BYTES = 1024 * 1024;
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private CaseParticipantsProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{CONVERSATION, ACTIVE, COUNT}; }
    static boolean validId(String value) { return value == null || value.length() <= 512; }
    private static boolean validIdNode(JsonNode value) {
        return value != null && (value.isNull() || value.isString() && value.asString().length() <= 512);
    }
    static CaseVisibilityQueryDto read(HttpServletRequest request, ObjectMapper mapper) throws IOException {
        var query = ReadQueryBodies.read(request, mapper, MAX_QUERY_BYTES);
        if (query == null || !query.isObject() || query.size() != 3
                || !validIdNode(query.get("baseGroupId")) || !validIdNode(query.get("accountId"))
                || !query.has("managedGroupIds")) throw new RejectedQuery(400, "INVALID_REQUEST");
        var groups = query.get("managedGroupIds");
        if (!groups.isNull()) {
            if (!groups.isArray() || groups.size() > 4096) throw new RejectedQuery(400, "INVALID_REQUEST");
            for (var id : groups) if (!validIdNode(id)) throw new RejectedQuery(400, "INVALID_REQUEST");
        }
        return mapper.treeToValue(query, CaseVisibilityQueryDto.class);
    }
    static byte[] encode(CaseVisibilityQueryDto query, ObjectMapper mapper) {
        if (!validId(query.baseGroupId()) || !validId(query.accountId())
                || query.managedGroupIds() != null && (query.managedGroupIds().size() > 4096
                        || !query.managedGroupIds().stream().allMatch(CaseParticipantsProtocol::validId)))
            throw new IllegalArgumentException("Invalid case visibility query.");
        var body = mapper.writeValueAsBytes(query);
        if (body.length > MAX_QUERY_BYTES) throw new IllegalArgumentException("Case visibility query exceeds size limit.");
        return body;
    }
}
