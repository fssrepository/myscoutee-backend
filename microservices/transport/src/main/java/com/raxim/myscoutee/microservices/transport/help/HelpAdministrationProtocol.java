package com.raxim.myscoutee.microservices.transport.help;

import com.raxim.myscoutee.domain.help.api.HelpAdministration;

public final class HelpAdministrationProtocol {
    public static final String ADMINSTATE_1 = "/_internal/v1/help/help-administration/adminstate_1";
    public static final String ADMINSTATE_2 = "/_internal/v1/help/help-administration/adminstate_2";
    public static final String ADMINSTATE_3 = "/_internal/v1/help/help-administration/adminstate_3";
    public static final String ADMINSTATE_4 = "/_internal/v1/help/help-administration/adminstate_4";
    public static final String SAVEREVISION_1 = "/_internal/v1/help/help-administration/saverevision_1";
    public static final String SAVEREVISION_2 = "/_internal/v1/help/help-administration/saverevision_2";
    public static final String ACTIVATEREVISION_1 = "/_internal/v1/help/help-administration/activaterevision_1";
    public static final String ACTIVATEREVISION_2 = "/_internal/v1/help/help-administration/activaterevision_2";
    public static final String DELETEREVISION_1 = "/_internal/v1/help/help-administration/deleterevision_1";
    public static final String DELETEREVISION_2 = "/_internal/v1/help/help-administration/deleterevision_2";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "help:help-administration";
    public static boolean delegated(String path) { return java.util.Set.of(ADMINSTATE_1, ADMINSTATE_2, ADMINSTATE_3, ADMINSTATE_4, SAVEREVISION_1, SAVEREVISION_2, ACTIVATEREVISION_1, ACTIVATEREVISION_2, DELETEREVISION_1, DELETEREVISION_2).contains(path); }
    private HelpAdministrationProtocol() {}
    public static String[] paths() { return new String[]{ADMINSTATE_1, ADMINSTATE_2, ADMINSTATE_3, ADMINSTATE_4, SAVEREVISION_1, SAVEREVISION_2, ACTIVATEREVISION_1, ACTIVATEREVISION_2, DELETEREVISION_1, DELETEREVISION_2}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record AdminState1(Scope scope, String adminUserId) {}
    public static boolean valid(AdminState1 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192); }
    public record AdminState2(Scope scope, String adminUserId, String documentType) {}
    public static boolean valid(AdminState2 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.documentType(),8192); }
    public record AdminState3(Scope scope, String adminUserId, String documentType, String lang) {}
    public static boolean valid(AdminState3 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.documentType(),8192) && text(q.lang(),8192); }
    public record AdminState4(Scope scope, String adminUserId, String documentType, String lang, String contextKey) {}
    public static boolean valid(AdminState4 q) { return q!=null && scope(q.scope()) && text(q.adminUserId(),8192) && text(q.documentType(),8192) && text(q.lang(),8192) && text(q.contextKey(),8192); }
    public record SaveRevision1(Scope scope, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterRevisionSaveRequestDto request) {}
    public static boolean valid(SaveRevision1 q) { return q!=null && scope(q.scope()); }
    public record SaveRevision2(Scope scope, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterRevisionSaveRequestDto request, String documentType) {}
    public static boolean valid(SaveRevision2 q) { return q!=null && scope(q.scope()) && text(q.documentType(),8192); }
    public record ActivateRevision1(Scope scope, String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request) {}
    public static boolean valid(ActivateRevision1 q) { return q!=null && scope(q.scope()) && text(q.revisionId(),8192); }
    public record ActivateRevision2(Scope scope, String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request, String documentType) {}
    public static boolean valid(ActivateRevision2 q) { return q!=null && scope(q.scope()) && text(q.revisionId(),8192) && text(q.documentType(),8192); }
    public record DeleteRevision1(Scope scope, String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request) {}
    public static boolean valid(DeleteRevision1 q) { return q!=null && scope(q.scope()) && text(q.revisionId(),8192); }
    public record DeleteRevision2(Scope scope, String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request, String documentType) {}
    public static boolean valid(DeleteRevision2 q) { return q!=null && scope(q.scope()) && text(q.revisionId(),8192) && text(q.documentType(),8192); }
}
