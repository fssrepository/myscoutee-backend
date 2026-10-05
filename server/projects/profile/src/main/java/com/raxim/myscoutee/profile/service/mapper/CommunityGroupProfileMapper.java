package com.raxim.myscoutee.profile.service.mapper;

import java.util.*;
import com.raxim.myscoutee.profile.data.document.Users;

/** Only personal fields cross the admission boundary. Credentials, activity and ratings do not. */
public final class CommunityGroupProfileMapper {
    private CommunityGroupProfileMapper() {}
    public static Users copy(Users source, String groupId) {
        var user = new Users();
        user.setUserId("group-" + UUID.randomUUID()); user.setSyncKey(UUID.randomUUID().toString());
        user.setWorkspaceGroupId(groupId); user.setAccountUserId(source.getUserId());
        user.setName(source.getName()); user.setInitials(source.getInitials()); user.setAge(source.getAge());
        user.setBirthday(source.getBirthday()); user.setGender(source.getGender()); user.setCity(source.getCity());
        user.setHeight(source.getHeight()); user.setPhysique(source.getPhysique()); user.setLanguages(source.getLanguages());
        user.setHoroscope(source.getHoroscope()); user.setHeadline(source.getHeadline()); user.setAbout(source.getAbout());
        user.setImages(source.getImages() == null ? List.of() : List.copyOf(source.getImages()));
        user.setLocationCoordinates(source.getLocationCoordinates()); user.setPartitionKey(source.getPartitionKey());
        user.setProfileDetails(source.getProfileDetails() == null ? List.of() : List.copyOf(source.getProfileDetails()));
        user.setProfileStatus(source.getProfileStatus()); user.setStatus(source.getStatus());
        user.setStatusText(source.getStatusText()); user.setCompletion(source.getCompletion());
        boolean baseAdmin = com.raxim.myscoutee.profile.data.document.CommunityGroup.isBaseId(groupId)
                && "Admin".equalsIgnoreCase(source.getHostTier());
        if (baseAdmin) user.setHostTier("Admin");
        else if ("admin workspace".equalsIgnoreCase(user.getStatusText())) user.setStatusText("");
        user.setProfileFormVersion(source.getProfileFormVersion()); user.setOperator(false);
        return user;
    }
    public static long attention(Users user) {
        if (user == null) return 0;
        var i = user.getImpressions(); var a = user.getActivities();
        if ("Admin".equalsIgnoreCase(user.getHostTier())) {
            var support = a == null || a.chat() == null ? null : a.chat().supportCases();
            return a == null ? 0 : count(a.game()) + count(a.feedback()) + count(a.adminJobs()) + count(a.adminMetrics())
                    + (support == null ? 0 : count(support.pending()) + count(support.warned()) + count(support.picked()) + count(support.blocked()));
        }
        long flags = i == null ? 0 : (i.host() != null && count(i.host().unreadCount()) > 0 ? 1 : 0)
                + (i.member() != null && count(i.member().unreadCount()) > 0 ? 1 : 0);
        return flags + count(user.getPaymentRefundsPending())
                + (a == null ? 0 : count(a.game()) + count(a.chats())
                + (a.event() == null ? 0 : count(a.event().all())) + count(a.feedback()));
    }
    private static long count(Integer value) { return value == null ? 0 : Math.max(0, value); }
}
