package com.raxim.myscoutee.domain.help.api;

import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAuditEntryDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterGuideFieldDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterRevisionDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterRevisionSaveRequestDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterSectionDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.PrivacyConsentDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.PrivacyConsentSaveRequestDto;

/** Existing administrator operations; public content stays with its original API. */
public interface HelpAdministration {
    HelpCenterStateDto adminState(String adminUserId);
    HelpCenterStateDto adminState(String adminUserId, String documentType);
    HelpCenterStateDto adminState(String adminUserId, String documentType, String lang);
    HelpCenterStateDto adminState(String adminUserId, String documentType, String lang, String contextKey);
    HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request);
    HelpCenterStateDto saveRevision(HelpCenterRevisionSaveRequestDto request, String documentType);
    HelpCenterStateDto activateRevision(String revisionId, HelpCenterAdminActionRequestDto request);
    HelpCenterStateDto activateRevision(String revisionId, HelpCenterAdminActionRequestDto request, String documentType);
    HelpCenterStateDto deleteRevision(String revisionId, HelpCenterAdminActionRequestDto request);
    HelpCenterStateDto deleteRevision(String revisionId, HelpCenterAdminActionRequestDto request, String documentType);
}
