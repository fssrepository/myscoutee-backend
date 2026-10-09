package com.raxim.myscoutee.domain.chat.dto;

import com.raxim.myscoutee.domain.chat.api.ContactPermissions.Permission;

public record ContactPermissionDto(String id, String leftUserId, String rightUserId, String requestedBy,
        String status, String requestedAtIso, String decidedAtIso, Long version) implements Permission {
    public static ContactPermissionDto from(Permission value) {
        return new ContactPermissionDto(value.id(), value.leftUserId(), value.rightUserId(), value.requestedBy(),
                value.status(), value.requestedAtIso(), value.decidedAtIso(), value.version());
    }
}
