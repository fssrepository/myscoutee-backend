package com.raxim.myscoutee.domain.events.api;
/** Asset participation commands; authorization and asset projection remain with the caller. */
public interface AssetMemberships {
    MemberDirectory.Member promote(MemberDirectory.Member current, String assetId, String targetUserId, String actorUserId, String nowIso);
    void delete(MemberDirectory.Member member);
}
