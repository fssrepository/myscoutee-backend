package com.raxim.myscoutee.domain.chat.api;
import java.util.List;
import java.util.Optional;
public interface ContactPermissions {
    interface Permission { String id(); String leftUserId(); String rightUserId(); String requestedBy(); String status(); String requestedAtIso(); String decidedAtIso(); Long version(); }
    record Change(String id, String leftUserId, String rightUserId, String requestedBy, String status, String requestedAtIso, String decidedAtIso, Long version) {}
    String pairId(String first, String second);
    List<? extends Permission> findForUser(String userId);
    Optional<? extends Permission> findById(String id);
    Permission save(Change value);
}
