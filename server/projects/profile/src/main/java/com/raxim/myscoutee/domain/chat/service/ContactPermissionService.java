package com.raxim.myscoutee.domain.chat.service;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.chat.document.ContactChatAccess;
import com.raxim.myscoutee.domain.chat.repository.ContactChatAccessRepository;
@Service
public class ContactPermissionService implements ContactPermissions {
    private final ContactChatAccessRepository permissions;
    public ContactPermissionService(ContactChatAccessRepository permissions) { this.permissions = permissions; }
    public String pairId(String first, String second) { return ContactChatAccess.pairId(first, second); }
    public List<ContactChatAccess> findForUser(String user) { return permissions.findForUser(user); }
    public Optional<ContactChatAccess> findById(String id) { return permissions.findById(id); }
    public ContactChatAccess save(Change value) { return permissions.save(new ContactChatAccess(value.id(), value.leftUserId(), value.rightUserId(), value.requestedBy(), value.status(), value.requestedAtIso(), value.decidedAtIso(), value.version())); }
}