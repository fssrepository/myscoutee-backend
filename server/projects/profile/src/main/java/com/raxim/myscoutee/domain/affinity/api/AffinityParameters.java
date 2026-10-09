package com.raxim.myscoutee.domain.affinity.api;

import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsHistoryDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsRevertRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsSaveRequestDto;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsStateDto;
public interface AffinityParameters {
    AdminParamsStateDto state(String adminUserId);
    AdminParamsHistoryDto history(String sectionKey);
    AdminParamsHistoryDto history(String sectionKey, String adminUserId);
    AdminParamsStateDto save(AdminParamsSaveRequestDto request);
    AdminParamsStateDto revert(String sectionKey, AdminParamsRevertRequestDto request);
}
