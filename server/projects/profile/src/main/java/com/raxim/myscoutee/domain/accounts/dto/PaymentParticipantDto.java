package com.raxim.myscoutee.domain.accounts.dto;

import com.raxim.myscoutee.domain.accounts.api.WorkspaceIdentity;

/** Existing, non-deleted receipt participant; no financial or device data. */
public record PaymentParticipantDto(String userId, String workspaceGroupId, String name) implements WorkspaceIdentity {
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
}
