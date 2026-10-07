package com.raxim.myscoutee.domain.events.mapper;

import org.springframework.stereotype.Component;

import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.dto.ActivityMembersDtos.ActivityMemberStatusDto;

@Component
public class ActivityMemberMapper {
    public ActivityMemberStatusDto toStatusDto(ActivityMember member) {
        if (member == null) {
            return null;
        }
        return new ActivityMemberStatusDto(member.getOwnerId(), member.getStatus());
    }
}
