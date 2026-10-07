package com.raxim.myscoutee.domain.platform.api;

import java.util.List;

public interface AdministratorSettings {
    boolean isAdminEmail(String email);
    List<String> adminEmails();
}
