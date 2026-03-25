package com.raxim.myscoutee.profile.dto.activities;

import java.util.List;

import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;

public final class ActivityMembersDtos {
    private ActivityMembersDtos() {
    }

    public record ActivityMembersSummariesRequestDto(
            List<ActivityMemberOwnerRefDto> owners) {
    }

    public record ActivityMembersReplaceRequestDto(
            ActivityMemberOwnerRefDto owner,
            List<ActivityMemberEntryDto> members,
            Integer capacityTotal) {
    }
}
