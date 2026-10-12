package com.raxim.myscoutee.domain.chat.service;

import static com.raxim.myscoutee.domain.chat.service.ChatRecordContext.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.api.MemberDirectory.Member;
import com.raxim.myscoutee.domain.chat.mapper.ChatMapper;
import com.raxim.myscoutee.domain.chat.dto.ChatDtos.*;

@Service
class ResourceChatMemberPages implements ChatMemberPages {
    private final MemberDirectory memberDirectory;
    private final ProfileSummaries profileDirectory;
    private final ChatMapper chatMapper;

    ResourceChatMemberPages(MemberDirectory memberDirectory, ProfileSummaries profileDirectory, ChatMapper chatMapper) {
        this.memberDirectory = memberDirectory; this.profileDirectory = profileDirectory; this.chatMapper = chatMapper;
    }

    @Override
    public ChatMembersPageResponseDto query(String memberOwnerType, String memberOwnerId, Boolean pendingOnly, int offset, int limit) {
        var memberPage = memberDirectory.pageByOwnerAndStatus(memberOwnerType, memberOwnerId,
                Boolean.TRUE.equals(pendingOnly) ? MEMBER_STATUS_PENDING : MEMBER_STATUS_ACCEPTED, offset, limit);
        long total = memberPage.total();
        var memberRecords = memberPage.items();
        Set<String> pageMemberIds = memberRecords.stream()
                .map(Member::getUserId)
                .map(ChatRecordContext::normalizeId)
                .filter(StringUtils::hasText)
                .collect(java.util.stream.Collectors.toCollection(LinkedHashSet::new));
        Map<String, ProfileSummary> usersById = new LinkedHashMap<>();
        for (ProfileSummary user : profileDirectory.findByUserIdIn(pageMemberIds)) {
            String memberUserId = normalizeId(user == null ? null : user.getUserId());
            if (StringUtils.hasText(memberUserId)) {
                usersById.put(memberUserId, user);
            }
        }
        List<ChatMemberDto> items = memberRecords.stream()
                .map(record -> chatMapper.toMemberDto(
                    usersById.get(normalizeId(record.getUserId())),
                    safeText(record.getStatus()).toLowerCase(Locale.ROOT)))
                .filter(Objects::nonNull)
                .toList();
        int nextOffset = offset + memberRecords.size();
        return new ChatMembersPageResponseDto(
                items,
                safePageTotal(total),
                nextOffset < total && !memberRecords.isEmpty() ? Integer.toString(nextOffset) : null);
    }
}
