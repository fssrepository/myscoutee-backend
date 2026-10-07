package com.raxim.myscoutee.domain.accounts.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.ContactDirectory;
import com.raxim.myscoutee.domain.accounts.document.NavigatorContactsProfile;
import com.raxim.myscoutee.domain.accounts.repository.NavigatorContactsProfilesRepository;
@Service
public class ContactDirectoryService implements ContactDirectory {
    private final NavigatorContactsProfilesRepository navigatorContactsProfilesRepository;
    public ContactDirectoryService(NavigatorContactsProfilesRepository contacts) { navigatorContactsProfilesRepository = contacts; }
    public Set<String> savedCandidateIds(String activeUserId) {
        return navigatorContactsProfilesRepository.findByUserId(activeUserId)
                .map(NavigatorContactsProfile::getContacts)
                .map(contacts -> {
                    LinkedHashSet<String> contactUserIds = new LinkedHashSet<>();
                    for (NavigatorContactsProfile.NavigatorContactRecord contact : contacts) {
                        if (contact == null) {
                            continue;
                        }
                        String contactUserId = normalizeId(firstNonBlank(contact.getUserId(), contact.getId()));
                        if (StringUtils.hasText(contactUserId)) {
                            contactUserIds.add(contactUserId);
                        }
                    }
                    return contactUserIds;
                })
                .orElseGet(LinkedHashSet::new);
    }
    private String normalizeId(String value) { return value == null ? "" : value.trim(); }
    private String firstNonBlank(String... values) { for (var value : values) if (StringUtils.hasText(value)) return value.trim(); return ""; }
}
