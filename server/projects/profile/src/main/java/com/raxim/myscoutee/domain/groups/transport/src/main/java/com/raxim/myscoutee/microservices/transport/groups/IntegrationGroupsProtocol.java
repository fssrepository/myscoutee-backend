package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields.JobScope;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.groups.api.IntegrationGroups;

public final class IntegrationGroupsProtocol {
    public static final String ACTOR_1 = "/_internal/v1/groups/integration-groups/actor_1";
    public static final String DETAIL_1 = "/_internal/v1/groups/integration-groups/detail_1";
    public static final String PAGE_1 = "/_internal/v1/groups/integration-groups/page_1";
    public static final String PAGE_2 = "/_internal/v1/groups/integration-groups/page_2";
    public static final String JOINWORKSPACEBASE_1 = "/_internal/v1/groups/integration-groups/joinworkspacebase_1";
    public static final String CLAIMINTEGRATIONINVITE_1 = "/_internal/v1/groups/integration-groups/claimintegrationinvite_1";
    public static final String CLAIMEVENTINVITE_1 = "/_internal/v1/groups/integration-groups/claimeventinvite_1";
    public static final String ADMINISTEREDGROUPS_1 = "/_internal/v1/groups/integration-groups/administeredgroups_1";
    public static final String REQUIREADMIN_1 = "/_internal/v1/groups/integration-groups/requireadmin_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "groups:integration-groups";
    public static boolean delegated(String path) { return java.util.Set.of(ACTOR_1, DETAIL_1, PAGE_1, PAGE_2, JOINWORKSPACEBASE_1, CLAIMINTEGRATIONINVITE_1, CLAIMEVENTINVITE_1, ADMINISTEREDGROUPS_1, REQUIREADMIN_1).contains(path); }
    private IntegrationGroupsProtocol() {}
    public static String[] paths() { return new String[]{ACTOR_1, DETAIL_1, PAGE_1, PAGE_2, JOINWORKSPACEBASE_1, CLAIMINTEGRATIONINVITE_1, CLAIMEVENTINVITE_1, ADMINISTEREDGROUPS_1, REQUIREADMIN_1}; }
    private static boolean scope(JobScope value) { return ProtocolFields.boundedJobScope(value); }
    public record Actor1(JobScope scope, String requestedId) {}
    public static boolean valid(Actor1 q) { return q!=null && scope(q.scope()) && text(q.requestedId(),8192); }
    public record Actor1Result(Boolean resolved, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto value) {}
    public record Detail1(JobScope scope, String actorId, String id) {}
    public static boolean valid(Detail1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.id(),8192); }
    public record Detail1Result(Boolean resolved, com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Group value) {}
    public record Page1(JobScope scope, String actorId, String bucket, String category, @com.fasterxml.jackson.annotation.JsonProperty(required = true) @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) int pageSize, String cursor) {}
    public static boolean valid(Page1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.bucket(),8192) && text(q.category(),8192) && text(q.cursor(),8192); }
    public record Page1Result(Boolean resolved, com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Page value) {}
    public record Page2(JobScope scope, String actorId, String bucket, String category, @com.fasterxml.jackson.annotation.JsonProperty(required = true) @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) int pageSize, String cursor, String sort) {}
    public static boolean valid(Page2 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.bucket(),8192) && text(q.category(),8192) && text(q.cursor(),8192) && text(q.sort(),8192); }
    public record Page2Result(Boolean resolved, com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Page value) {}
    public record JoinWorkspaceBase1(JobScope scope, String actorId, String groupId) {}
    public static boolean valid(JoinWorkspaceBase1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.groupId(),8192); }
    public record ClaimIntegrationInvite1(JobScope scope, com.raxim.myscoutee.domain.integrations.dto.ParticipantInvitationDto invite, String actorUserId) {}
    public static boolean valid(ClaimIntegrationInvite1 q) { return q!=null && scope(q.scope()) && text(q.actorUserId(),8192); }
    public record ClaimEventInvite1(JobScope scope, String groupId, String inviterProfileId, String accountId) {}
    public static boolean valid(ClaimEventInvite1 q) { return q!=null && scope(q.scope()) && text(q.groupId(),8192) && text(q.inviterProfileId(),8192) && text(q.accountId(),8192); }
    public record ClaimEventInvite1Result(Boolean resolved, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto value) {}
    public record AdministeredGroups1(JobScope scope, String actorId) {}
    public static boolean valid(AdministeredGroups1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192); }
    public record RequireAdmin1(JobScope scope, String actorId, String id) {}
    public static boolean valid(RequireAdmin1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.id(),8192); }
}
