package com.raxim.myscoutee.domain.content.api;

import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;

public interface AdministrativeAccess {
    String baseGroupId(String adminUserId);
    AdminUserDto resolveAdminActor(String adminUserId);
}
