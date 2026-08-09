package com.raxim.myscoutee.profile.service.mapper;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityMembersDtos.ActivityMemberStatusDto;

@Component
public class ActivityMemberMapper {
    public ActivityMemberStatusDto toStatusDto(ActivityMember member) {
        if (member == null) {
            return null;
        }
        return new ActivityMemberStatusDto(member.getOwnerId(), member.getStatus());
    }
}
