package com.raxim.myscoutee.domain.accounts.api;
public interface AccountIdentity { WorkspaceProfile getUser(); String getEmail(); String getUserId(); java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> getAuthorities(); }
