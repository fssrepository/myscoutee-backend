package com.raxim.myscoutee.domain.events.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.document.ActivityMember.EventVipPriceAudit;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import org.springframework.util.StringUtils;

/** Write-owned invitation evidence. Reading a price never reconstructs organizer roles. */
public final class EventVipInvitation {
    private EventVipInvitation() { }

    static void issue(ActivityMember member, boolean organizer, PricingConfigDto pricing, String nowIso) {
        if (Objects.equals(member.getEventVipOfferedAtIso(), nowIso)) {
            return;
        }
        member.setEventVipInvitation(organizer);
        member.setEventVipAcceptedAtIso(null);
        member.setEventVipOfferedAtIso(organizer ? nowIso : null);
        member.setEventVipOfferedPricing(organizer ? pricing : null);
        if (organizer) {
            audit(member, "offered", member.getInvitedByUserId(), nowIso, pricing);
        }
    }

    static void accept(ActivityMember member, PricingConfigDto currentPricing, String nowIso) {
        if (Boolean.TRUE.equals(member.getEventVipInvitation())
                && !StringUtils.hasText(member.getEventVipAcceptedAtIso())) {
            member.setEventVipAcceptedAtIso(nowIso);
            audit(member, "accepted", member.getUserId(), nowIso, currentPricing);
        }
    }

    private static void audit(ActivityMember member, String action, String actor,
            String nowIso, PricingConfigDto pricing) {
        String invitationId = member.getOwnerId() + ":" + member.getUserId() + ":" + member.getEventVipOfferedAtIso();
        List<EventVipPriceAudit> entries = new ArrayList<>(
                member.getEventVipPriceAudit() == null ? List.of() : member.getEventVipPriceAudit());
        if (entries.stream().noneMatch(entry -> invitationId.equals(entry.invitationId()) && action.equals(entry.action()))) {
            entries.add(new EventVipPriceAudit(invitationId, action, actor, nowIso, pricing));
            member.setEventVipPriceAudit(List.copyOf(entries));
        }
    }

    public static boolean eligible(ActivityMember member) {
        if (member == null || !"event".equals(member.getOwnerType())
                || !Boolean.TRUE.equals(member.getEventVipInvitation())) {
            return false;
        }
        if (!"pending".equals(member.getStatus()) && !"accepted".equals(member.getStatus())) {
            return false;
        }
        // An outstanding invitation previews the price of accepting that invitation.
        return StringUtils.hasText(member.getEventVipAcceptedAtIso())
                || ("pending".equals(member.getStatus()) && "invite".equals(member.getRequestKind()));
    }
}
