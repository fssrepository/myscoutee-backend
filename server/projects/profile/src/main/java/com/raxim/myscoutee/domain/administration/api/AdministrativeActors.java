package com.raxim.myscoutee.domain.administration.api;

import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;

/** Existing authenticated administrator/workspace resolution; grants no moderation writes. */
public interface AdministrativeActors {
    AdminUserDto resolveAdminActor(String adminUserId);
    String baseGroupId(String adminUserId);
}
